import Vue      from 'vue'
import Vuex     from 'vuex'
import axios    from 'axios'
import CryptoJS from 'crypto-js'

Vue.use(Vuex)

function getTokenFromStorage(secret) {  
  let token = localStorage.getItem('access_token') || null
  if (token != null) {
    let decryptedToken = CryptoJS.AES.decrypt(token, secret)
    token = decryptedToken.toString(CryptoJS.enc.Utf8)
  } return token
}

function getUserDataFromStorage(secret) {
  let data = localStorage.getItem('data') || null
  if (data != null) {
    let decryptedData = CryptoJS.AES.decrypt(data, secret)
    decryptedData = decryptedData.toString(CryptoJS.enc.Utf8)
    data = JSON.parse(decryptedData)
  } return data
}

function retrieveItemFromStorage(secret, name) {
  let item = localStorage.getItem(name)
  if (item != null) {
    item = CryptoJS.AES.decrypt(item, secret)
    item = item.toString(CryptoJS.enc.Utf8)
    return JSON.parse(item)
  } return []
}

export default new Vuex.Store({
  state: {

    user: {
      state: localStorage.getItem('access_token') != null ? 'logged' : 'guest', 
      token: getTokenFromStorage(process.env.VUE_APP_AES_SECRET), 
      data: getUserDataFromStorage(process.env.VUE_APP_AES_SECRET), 
    },
    requests : {
      folder: retrieveItemFromStorage(process.env.VUE_APP_AES_SECRET, 'frq'), 
      course: retrieveItemFromStorage(process.env.VUE_APP_AES_SECRET, 'crq'),
    }, 

  },
  getters: {

    isLoggedIn: state => {
      return state.user.state == 'logged'; 
    },
    
    isAdmin: state => {
      return  state.user.state == 'logged' && 
              state.user.data.role != 1; 
    }, 

    getUserData: state => {
      return state.user.data
    }, 

    getUserRole: state => {
      return state.user.data.role
    },
    
    getUserId: state => {
      return state.user.data.id
    }, 

    getAuthStatus: state => {
      return state.user.state
    },

    getUserToken: state => {
      return state.user.token
    }, 

    getCourseRequests: state => {
      return state.requests.course
    }, 

    getFolderRequests: state => {
      return state.requests.folder
    }, 

  },
  mutations: {

    authInit: (state) => {
      state.user.state = 'loading'
    }, 

    authSuccess: (state, response) => {
      state.user.state = 'logged' 
      state.user.token = response.token
      state.user.data = response.data
    }, 

    expell: (state) => {
      state.user.state = 'guest' 
      state.user.token = null 
      state.user.data = null
      state.requests.folder = []
      state.requests.course = []
      localStorage.removeItem('access_token')
      localStorage.removeItem('data')
      localStorage.removeItem('frq')
      localStorage.removeItem('crq')
    }, 

    addFolderRequests: (state, requests) => {
      state.requests.folder = requests      
      let localResult = JSON.stringify(requests)
      let secret = process.env.VUE_APP_AES_SECRET 
      localResult = CryptoJS.AES.encrypt(localResult, secret).toString()
      localStorage.setItem('frq', localResult)
    }, 

    addCourseRequests: (state, requests) => {
      state.requests.course = requests
      let localResult = JSON.stringify(requests)
      let secret = process.env.VUE_APP_AES_SECRET 
      localResult = CryptoJS.AES.encrypt(localResult, secret).toString()
      localStorage.setItem('crq', localResult)
    }

  },
  actions: {

    loginRequest : (context, credentials) => {
      context.commit('authInit')
      return new Promise((resolve, reject) => {
        const params = {
          grant_type: 'password', 
          client_id: process.env.VUE_APP_OAUTH_ID, 
          client_secret: process.env.VUE_APP_OAUTH_TOKEN, 
          username: credentials.email,
          password: credentials.password, 
          scope: ''
        }  
        axios({
          url: 'oauth/token', 
          data: params, 
          method: 'POST'
        })
        .then(result => { 
          let token = result.data.access_token
          let secret = process.env.VUE_APP_AES_SECRET
          let encryptedToken = CryptoJS.AES.encrypt(token, secret).toString()
          localStorage.setItem('access_token', encryptedToken)
          let response = {
            token: token, 
            data: null
          }
          axios({
            url: 'api/user', 
            headers: {'Authorization': `Bearer ${token}`}, 
            method: 'GET'
          })
          .then(result => {
            response.data = result.data
            let encryptedData = JSON.stringify(response.data)
            encryptedData = CryptoJS.AES.encrypt(encryptedData, secret).toString()
            localStorage.setItem('data', encryptedData)
            context.commit('authSuccess', response)
            resolve(response)
          })
          .catch(error => {
            context.commit('expell')
            reject(error)
          })
        })
        .catch(error => {
          context.commit('expell')
          reject(error)
        });

      }) 
    },
    
    logoutRequest: (context) => {
      context.commit('expell')
    },

    getUserPermissions: (context, data) => {
      return new Promise((resolve, reject) => {
        
        const headers = {'Authorization': `Bearer ${data.token}`} 
        const courseUrl = 'api/user/' + data.id + '/courses/requests' 
        const folderUrl = 'api/user/' + data.id + '/folders/requests' 
        
        axios({ url: courseUrl, headers: headers })
        .then(result => context.commit('addCourseRequests', result.data.content))
        .catch(error => reject(error))

        axios({ url: folderUrl, headers: headers})
        .then(result => context.commit('addFolderRequests', result.data.content))
        .catch(error => reject(error))

        resolve(true)
      })       
    }

  }
})
