<template>    
    <div class="AdminPanel container-fluid" style="padding: 10px">

        <div class="row">
          <div class="col s12">
            <h4>Sistema di richieste</h4>
            <p>
              Il
              <b>sistema di richieste</b> permette agli utenti di richiedere determinati permessi temporanei su corsi o cartelle esistenti.
            </p>
            <div class="divider"></div>
          </div>
        </div>

        <div class="row">
            <div class="col s12">
                <ul class="collapsible" id="mr-collapsible">
                    <li>
                        <div class="collapsible-header"><i class="material-icons">filter_list</i>Filtra le richieste</div>
                        <div class="collapsible-body">

                            <div class="row">
                                
                                <form class="col s12 m10 offset-m1">
                                    <div class="row">
                                        <div class="input-field col s12">
                                        <textarea id="icon_prefix2" :model="filterSet.username" class="materialize-textarea"></textarea>
                                        <label for="icon_prefix2">Cerca per username</label>
                                        </div>
                                    </div>
                                </form>

                                <div class="col s4 center-align grey-text text-darken-1">
                                    <p><b class="black-text">STATO</b></p><hr>
                                    <p @click="filterSet.status=''"        :class="blur('', 'status')">Tutte</p>
                                    <p @click="filterSet.status='active'"  :class="blur('active', 'status')">Attive</p>
                                    <p @click="filterSet.status='pending'" :class="blur('pending', 'status')">Pendenti</p>
                                    <p @click="filterSet.status='refused'" :class="blur('refused', 'status')">Rifiutate</p>
                                    <p @click="filterSet.status='expired'" :class="blur('expired', 'status')">Scadute</p>
                                </div>
                                
                                <div class="col s4 center-align grey-text text-darken-1">
                                    <p><b class="black-text">TIPO</b></p><hr>
                                    <p>Tutte</p>
                                    <p>Solo cartelle</p>
                                    <p>Solo corsi</p>
                                </div>

                                <div class="col s4 center-align grey-text text-darken-1">
                                    <p><b class="black-text">ORDINA PER</b></p><hr>
                                    <p>Utente</p>
                                    <p>Corso</p>
                                    <p>Data</p>
                                </div>

                            </div>

                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- legend -->
        <div class="row composed">
            <div class="col s6 m2 center-align">
                <p><i class="material-icons fixed-icon green-text">brightness_1</i><br>     Attive</p>
            </div>
            <div class="col s6 m2 center-align">
                <p><i class="material-icons fixed-icon yellow-text">brightness_1</i><br>    Pendenti</p>
            </div>
            <div class="col s6 m2 center-align">
                <p><i class="material-icons fixed-icon red-text">brightness_1</i><br>       Rifiutate</p>
            </div>
            <div class="col s6 m2 center-align">
                <p><i class="material-icons fixed-icon purple-text">brightness_1</i><br>    Scadute</p>
            </div>
            <div class="col s6 m2 center-align">
                <p><i class="material-icons fixed-icon grey-text">school</i><br>           Corso</p>
            </div>
            <div class="col s6 m2 center-align">
                <p><i class="material-icons fixed-icon grey-text">folder</i><br>           Cartella</p>
            </div>
        </div>

        <div class="row">            
            <div class="col s12">
                <ul class="collection with-header z-depth-1">
                    <li class="collection-header"><h5>Gestisci le richieste</h5></li>
                    <RequestLabel v-for="(request, i) in mergedRequests" :key="i" :request="request"></RequestLabel>
                    <p v-if="mergedRequests.length < 1" class="center-align grey-text">Nessuna richiesta da gestire</p>             
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import RequestLabel     from "@/components/requests/subcomps/RequestLabel"
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";

const CourseRequestRepo = RepoFactory.get('courseRequests'); 
const FolderRequestRepo = RepoFactory.get('folderRequests'); 
const CoursesRepo       = RepoFactory.get("courses");
const FoldersRepo       = RepoFactory.get("folders");
const UsersRepo         = RepoFactory.get("users"); 

export default {
    name: "AdminPanel", 
    mixins: [
        errorMixin
    ], 
    components: {
        RequestLabel
    }, 
    data: function() {
        return {

            courseRequests: [], 
            folderRequests: [], 
            courses: [], 
            folders: [], 
            users: [], 

            filterSet: {
                status:     "", 
                type:       "", 
                orderBy:    "",
                username:   "", 
            }, 
        }
    },
    computed: {

        userToken: function() {
            return this.$store.getters.getUserToken;
        }, 

        userId: function() {
            return this.$store.getters.getUserId 
        }, 

        mergedRequests: function() {

            let requests = []
            let fRequests = this.folderRequests
            let cRequests = this.courseRequests
            
            for (let i = 0; i < cRequests.length; i++) {
            
                cRequests[i].perms      = 'corso, globale'
                cRequests[i].type       = "course"
                cRequests[i].user       = this.getUser(cRequests[i].user_id)
                cRequests[i].course     = this.getCourse(cRequests[i].course_id)
                requests.push(cRequests[i])
            }
            for (let i = 0; i < fRequests.length; i++) {
                let json = fRequests[i].permissions
                let perms = 'cartella'; 
                if (json.manage) perms += ", gestione"
                if (json.remove) perms += ", rimozione"
                
                fRequests[i].perms  = perms
                fRequests[i].type   = "folder"
                fRequests[i].user   = this.getUser  (fRequests[i].user_id)
                fRequests[i].folder = this.getFolder(fRequests[i].folder_id)
                fRequests[i].course = this.getCourse(fRequests[i].folder.course_id) || {} 
                requests.push(fRequests[i])
            }
            return this.applyFilters(requests); 
        }, 

    }, 
    methods: {

        fetchCourseRequests: function() {
            CourseRequestRepo.get(this.userToken)
            .then( result => this.courseRequests = result.data.content )
            .catch( error => this.showError(error) )
        }, 

        fetchFolderRequests: function() {
            FolderRequestRepo.get(this.userToken)
            .then( result => this.folderRequests = result.data.content )
            .catch( error => this.showError(error) )
        }, 

        fetchUsers: function() {
            UsersRepo.get(this.userToken)
            .then( result => this.users = result.data.content )
            .catch( error => this.showError(error) )
        }, 

        fetchCourses: function() {
            CoursesRepo.get()
            .then( result => this.courses = result.data )
            .catch( error => this.showError(error) )
        }, 

        fetchFolders: function() {
            FoldersRepo.get()
            .then( result => this.folders = result.data )
            .catch( error => this.showError(error) )
        }, 

        getCourse: function(id) {
            return this.courses.filter(course => {
                return course.id == id; 
            })[0] || {}; 
        }, 

        getFolder: function(id) {
            return this.folders.filter(folder => {
                return folder.id == id; 
            })[0] || {}; 
        }, 

        getUser: function(id) {
            return this.users.filter(user => {
                return user.id == id; 
            })[0] || {}; 
        }, 

        materializeInit: function() {
            let collaps = document.getElementById('mr-collapsible'); 
            M.Collapsible.init(collaps);
        }, 

        applyFilters: function(requests) {
            return requests.filter(request => {
                let status    = this.filterSet.status; 
                let type      = this.filterSet.type;    
                return  (status != '' && requests.status == status) || 
                        (type   != '' && request.type    == type)   ||
                        (status == '' && type == ''); 
            })
        }, 

        blur: function(selected, filter) {
            if ((filter == 'status' && this.filterSet.status == selected) ||
                (filter == 'type'   && this.filterSet.type   == selected))
                return "blurred"; 
            return false; 
        }

    }, 
    created: function() {

        this.fetchUsers();
        this.fetchCourses(); 
        this.fetchFolders(); 
        this.fetchCourseRequests(); 
        this.fetchFolderRequests(); 

    },
    mounted: function() {

        this.materializeInit(); 

    }
}
</script>

<style scoped>

    .subtitle {
        font-size: 20px; 
    }

    .fixed-icon {
        display: inline-flex;
        vertical-align: top;
        margin-right: 5px; 
    }

    .composed {
        margin-left: 12px; 
        margin-right: 12px; 
    }
    
    .blurred {
        font-weight: bold; 
        color: #000; 
    }

    hr {
        width: 80%; 
        color: white; 
    }

</style>