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
import SelectElement    from "@/components/requests/subcomps/SelectElement"
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";

const CourseRequestRepo = RepoFactory.get('courseRequests'); 
const FolderRequestRepo = RepoFactory.get('folderRequests'); 

export default {
    name: "AdminPanel", 
    mixins: [
        errorMixin
    ], 
    components: {
        SelectElement, 
        RequestLabel
    }, 
    data: function() {
        return {

            courseRequests: [], 
            folderRequests: [], 

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
                cRequests[i].perms = 'corso, globale'
                cRequests[i].type  = "course"
                requests.push(cRequests[i])
            }
            for (let i = 0; i < fRequests.length; i++) {
                let json = fRequests[i].permissions
                let perms = 'cartella'; 
                if (json.manage) perms += ", gestione"
                if (json.remove) perms += ", rimozione"
                fRequests[i].perms = perms
                fRequests[i].type  = "folder"
                requests.push(fRequests[i])
            }
            return requests; 
        }, 

    }, 
    methods: {

        fetchCourseRequests: function() {
            CourseRequestRepo.get(this.userToken)
            .then( result => {
                this.courseRequests = result.data.content
            })
            .catch( error => {
                this.showError(error); 
            })
        }, 

        fetchFolderRequests: function() {
            FolderRequestRepo.get(this.userToken)
            .then( result => {
                this.folderRequests = result.data.content
            })
            .catch( error => {
                this.showError(error); 
            })
        }, 

        fetchUsers: function() {

        }, 

        fetchCourses: function() {

        }, 

        fetchFolders: function() {

        }
    }, 
    created: function() {

        this.fetchCourseRequests(); 
        this.fetchFolderRequests(); 

    },
}
</script>

<style scoped>

</style>