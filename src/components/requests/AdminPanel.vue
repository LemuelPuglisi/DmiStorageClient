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
                <div class="card-panel">
                    <h5>Applica filtri</h5>
                </div>
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
            users: []

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
            return requests; 
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

    }, 
    created: function() {

        this.fetchUsers();
        this.fetchCourses(); 
        this.fetchFolders(); 
        this.fetchCourseRequests(); 
        this.fetchFolderRequests(); 

    },
}
</script>

<style scoped>

</style>