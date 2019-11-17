<template>
  <div class="cloud container" style="padding:10px">
    <div class="row">

      <div class="container" style="margin-top:20px;">
          <div class="row">
              <div class="col s12">
                  <div class="card-panel grey lighten-5 z-depth-2">
                      <div class="row valign-wrapper">
                          <div class="col s3 m2 l1 center align">
                              <a class="btn-floating btn-large waves-effect waves-light red" @click="goBack()">
                                  <i class="material-icons">keyboard_arrow_left</i>
                              </a>                        
                          </div>
                          <div class="col s10 m11 l12 left align">
                              <p class="title">Gestisci la richiesta</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>    
      </div>

      

    </div>
  </div>
</template>

<script>
export default {
    name: "RequestManager", 
    data: function() {
      return {
        request: {}
      }
    }, 
    props: {
      id:   Number,
      type: String, 
    },  
    computed: {

      isLoggedIn: function() {
        return this.$store.getters.isLoggedIn;
      },

    },
    methods: {

      goBack: function() {
        this.$router.push({
          name: 'requests'
        })
      }, 

      fetchFolderRequest: function() {

      }, 

      fetchCourseRequest: function() {
      
      }

    }, 
    created: function() {

      if (this.type == 'folder') this.fetchFolderRequest; 
      else this.fetchCourseRequest; 
    
    }, 
    watch: {

      isLoggedIn: function(newValue) {
        if (!newValue) {
          this.$router.push({ path: "/" });
        }
      }

    }
}
</script>

<style scoped>

  .cloud {
    margin-top: 20px;
    background-color: white;
  }

  .title {
    font-size: 25px; 
    font-weight: bold; 
  }

  .container {
    max-width: 100% !important;
    width: 90% !important; 
  }

  .card-panel {
    padding-top: 2px;
    padding-bottom: 0px;  
  }

</style>