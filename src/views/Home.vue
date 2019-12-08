<template>
  <div class="home">
    <Navbar></Navbar>    
    <main>
      <Login></Login>
      <Signup></Signup>
      <Forgot></Forgot>
      <FloatNav v-if="authenticated"></FloatNav>
      <transition name="router-anim" enter-active-class="animated fadeIn"> 
        <router-view/>
      </transition>
    </main>
  </div>
</template>

<script>
import Navbar         from '@/components/nav/Navbar.vue'
import Login          from '@/components/auth/Login.vue'
import Signup         from '@/components/auth/Signup.vue'
import Forgot         from '@/components/auth/Forgot.vue'
import FloatNav       from '@/components/main/FloatNav.vue'

export default {
  name: 'home',
  components: {
    Navbar, 
    Login, 
    Signup,
    Forgot, 
    FloatNav,  
  }, 
  computed: {

    authenticated: function() {
      return this.$store.getters.isLoggedIn
    },

  },
  watch: {

    authenticated: newValue => {
      if (newValue) {
        setTimeout(() => {
          let floatBtn = document.getElementById('floatBtn')
          M.FloatingActionButton.init(floatBtn)
        }, 0)
      }
    }

  },   
}
</script>

<style >

  body {
      background-color: #F1F1F1;
  }
  
</style>