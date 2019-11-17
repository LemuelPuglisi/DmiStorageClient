import Vue            from 'vue'
import Router         from 'vue-router'
import store          from './store' 
import Home           from './views/Home.vue'
import Reset          from './views/Reset.vue'
import PageNotFound   from './views/PageNotFound.vue'
import CloudRender    from './components/main/CloudRender'
import CourseRender   from './components/main/CourseRender'
import FolderRender   from './components/main/FolderRender'
import ResourceRender from './components/main/ResourceRender'
import RequestRender  from './components/requests/RequestRender'
import RequestManager from './components/requests/RequestManager'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home, 
      children: [
        {
          path: "/", 
          name: 'cloud', 
          component: CloudRender
        }, 
        {
          path: "/course/:id", 
          name: 'course', 
          props: true,
          component: CourseRender
        }, 
        {
          path: "/folder/:id", 
          name: 'folder', 
          props: true, 
          component: FolderRender
        }, 
        {
          path: 'stream/:id', 
          name: 'streamer', 
          props: true, 
          component: ResourceRender,  
        }, 
        {
          path: 'requests', 
          name: 'requests',
          component: RequestRender, 
          beforeEnter: function(to, from, next) {
            if (store.getters.isLoggedIn) {
              next()
            } else {
              next({name: 'not-found'})
            }
          }
        }, 
        {
          path: 'manage/:id', 
          name: 'manage-request', 
          component: RequestManager,
          props: true,
          beforeEnter: function(to, from, next) {
            if (store.getters.isAdmin) {
              next()
            } else {
              next({name: 'not-found'})
            }
          }
        }
      ], 
    },
    {
      path: '/reset',
      name: 'reset',
      component: Reset
    },
    { 
      path: "*", 
      name: "not-found", 
      component: PageNotFound 
    }

  ]
})
