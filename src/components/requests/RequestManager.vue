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
            <div class="card-panel grey lighten-5 z-depth-2">
              
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
                    <td>{{course.name}}</td>
                    <td v-if="type=='folder'">{{folder.display_name}}</td>
                  </tr>
                </tbody>
                
              </table>
            </div>
          </div>

          <div v-if="request.status != 'pending'" class="col s12">
            <div class="card-panel grey lighten-5 z-depth-2">
              <div class="card-content" style="padding:5px">

                <p class="grey-text text-darken-2">
                  La richiesta è stata inoltrata il {{request.requested_at}}, scadrà il {{request.expiration_date}} ed una
                  volta decorsa la scadenza non sarà più possibile interagire con essa. <br>
                  L'amministratore <b>{{admin.name}}</b> è l'ultimo utente ad aver gestito la richiesta. 
                </p>
              </div>
            </div>
          </div>

          <div class="col s12 m6">
            <div class="card-panel chf grey lighten-5 z-depth-2">
              <h6>Estremi dell'utente</h6>
                <ul class="collection">
                  <li class="collection-item"><b>id:</b>          {{user.id}}</li>
                  <li class="collection-item"><b>nome:</b>        {{user.name}}</li>
                  <li class="collection-item"><b>email:</b>       {{user.email}}</li>
                  <li class="collection-item"><b>creato il</b>    {{user.created_at}}</li>
                </ul>
            </div>
          </div>

          <div class="col s12 m6">
            <div class="card-panel chf grey lighten-5 z-depth-2">
              <h6>Note della richiesta</h6>
              <p class="grey-text text-darken-2">{{request.notes}}</p>
            </div>
          </div>

        </div>

        <div class="row">
          <div class="col s12">
            <div class="card-panel grey lighten-5 z-depth-2">
              <div class="card-content action-bar">

                <a  v-if="showAccept" @click="manageRequest(true)" 
                    class="waves-effect waves-light btn-small green" 
                    :class="loading.acceptBtn ? 'pulse' : ''"
                    style="margin-right:10px">
                  <i class="material-icons left">check</i>
                  {{this.request.status == "pending" ? "Accetta" : "Abilita"}}
                </a>

                <a  v-if="showRefuse" @click="manageRequest(false)" 
                    class="waves-effect waves-light btn-small red"
                    :class="loading.refuseBtn ? 'pulse' : ''" 
                    style="margin-right:10px">
                  <i class="material-icons left">close</i>
                  {{this.request.status == "pending" ? "Rifiuta" : "Rimuovi"}}
                </a>

                <p v-if="request.status == 'expired'" class="grey-text text-darken-2" style="margin-right:10px">
                  La richiesta è scaduta. 
                </p>

              </div>
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
const CourseRepo        = RepoFactory.get("courses"); 
const FolderRepo        = RepoFactory.get("folders"); 
const UserRepo          = RepoFactory.get("users"); 

export default {
    name: "RequestManager", 
    data: function() {
      return {
        request: null, 
        user: {
          name:   '', 
          email:  '', 
        }, 
        admin: {
          name:   '', 
        }, 
        course: {}, 
        folder: {}, 
        loading: {
          acceptBtn: false, 
          refuseBtn: false, 
        }
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
      }, 

      showAccept: function() {
        return this.request.status == "pending" || this.request.status == "refused";  
      }, 

      showRefuse: function() {
        return this.request.status == "pending" || this.request.status == "active";   
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
        .then(result => {
          this.request = result.data.content
          this.fetchFolderDetails(this.request.folder_id); 
          this.fetchUserDetails(); 
          this.fetchAdminDetails(); 
        })
        .catch(error => this.showError(error))
      }, 

      fetchCourseRequest: function() {
        CourseRequestRepo.show(this.userToken, this.id)
        .then(result => {
          this.request = result.data.content
          this.fetchCourseDetails(this.request.course_id); 
          this.fetchUserDetails();
          this.fetchAdminDetails();
        })
        .catch(error => this.showError(error))
      },

      fetchCourseDetails: function(id) {
        CourseRepo.show(id)
        .then(result => this.course = result.data)
        .catch(error => this.showError(error))
      }, 

      fetchFolderDetails: function(id) {
        FolderRepo.show(id)
        .then(result => {
          this.folder = result.data.content
          this.fetchCourseDetails(this.folder.course_id); 
        })
      }, 

      fetchUserDetails: function() {
        UserRepo.show(this.userToken, this.request.user_id)
        .then(result => this.user = result.data.content)
        .catch(error => this.showError(error))
      }, 

      fetchAdminDetails: function() {
        UserRepo.show(this.userToken, this.request.authorizer_id)
        .then(result => this.admin = result.data.content)
        .catch(error => this.showError(error))
      },

      manageRequest: function(choice) {

        this.loading.acceptBtn = choice; 
        this.loading.refuseBtn = !choice; 

        if (this.type == 'folder') {
          FolderRequestRepo.manage(this.userToken, this.request.id, choice)
          .then(this.fetchDetails())
          .catch(error => this.showError(error))
        }
        else if (this.type == 'course') {
          CourseRequestRepo.manage(this.userToken, this.request.id, choice)
          .then(this.fetchDetails())
          .catch(error => this.showError(error))
        }
 
      }, 

      fetchDetails: function() {
        if (this.type == 'folder') 
          this.fetchFolderRequest(); 
        else this.fetchCourseRequest();
        this.loading.acceptBtn = false; 
        this.loading.refuseBtn = false;
      }

    }, 
    created: function() { 
      this.fetchDetails(); 
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
    margin-left: 10px; 
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

  .chf {
    height: 250px; 
    overflow: auto; 
  }

  .action-bar {
    padding-top: 10px; 
    padding-bottom: 10px; 
  }

</style>