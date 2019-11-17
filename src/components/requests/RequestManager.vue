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
      
      <div v-if="request" class="container">
        <div class="row">

          <div class="col s12">
            <div class="card-panel ch grey lighten-5 z-depth-2">
              
              <table class="responsive-table highlight centered">
                <thead>
                  <tr>
                      <th>ID</th>
                      <th>Status</th>
                      <th>Permessi</th>
                      <th>Durata</th>
                      <th>Corso</th>
                      <th v-if="type=='folder'">Cartella</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{{request.id}}</td>
                    <td>{{request.status}}</td>
                    <td>{{wfPermissions}}</td>
                    <td>{{request.lifespan}} gg</td>
                    <td></td>
                    <td v-if="request.type=='folder'"></td>
                  </tr>
                </tbody>
                
              </table>
            </div>
          </div>

          <div class="col s12 m6">
            <div class="card-panel ch grey lighten-5 z-depth-2">
              <h6>Estremi dell'utente</h6>
                  
            </div>
          </div>

          <div class="col s12 m6">
            <div class="card-panel ch grey lighten-5 z-depth-2">
              <h6>Note della richiesta</h6>
              <p class="grey-text text-darken-2">{{request.notes}}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin"

const FolderRequestRepo = RepoFactory.get("folderRequests"); 
const CourseRequestRepo = RepoFactory.get("courseRequests");

export default {
    name: "RequestManager", 
    data: function() {
      return {
        request: null, 
        user: {
          name:   '', 
          email:  '', 
        }, 
        course: '', 
        folder: '', 

      }
    }, 
    mixins: {
      errorMixin
    }, 
    props: [
      "id", 
      "type"  
    ],  
    computed: {

      isLoggedIn: function() {
        return this.$store.getters.isLoggedIn;
      },

      userToken: function() {
        return this.$store.getters.getUserToken;
      }, 

      wfPermissions: function() {
        if (this.type == "course") return 'globali'
        let json = this.request.permissions; 
        let perms = ""; 
        if (json.manage) perms += "gestione";
        if (perms != "") perms += ", ";  
        if (json.remove) perms += "rimozione "; 
        return perms;  
      }

    },
    methods: {

      goBack: function() {
        this.$router.push({
          name: 'requests'
        })
      }, 

      fetchFolderRequest: function() {
        FolderRequestRepo.show(this.userToken, this.id)
        .then(result =>{this.request = result.data.content})
        .catch(error => this.showError(error))
      }, 

      fetchCourseRequest: function() {
        CourseRequestRepo.show(this.userToken, this.id)
        .then(result =>{this.request = result.data.content})
        .catch(error => this.showError(error))
      }

    }, 
    created: function() {

      // this.user.name  = this.$route.query.user; 
      // this.user.email = this.$route.query.email; 
      // this.course     = this.$route.query.course; 
      // this.folder     = this.$route.query.folder; 

      if (this.type == 'folder') this.fetchFolderRequest(); 
      else this.fetchCourseRequest(); 

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

  .ch {
    height: 180px;
  }

</style>