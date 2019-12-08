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
                                        <textarea id="icon_prefix2" v-model="filterSet.username" class="materialize-textarea"></textarea>
                                        <label for="icon_prefix2">Cerca per username</label>
                                        </div>
                                    </div>
                                </form>

                                <div class="col s4 center-align grey-text text-darken-1">
                                    <p><b class="black-text">STATO</b></p><hr>
                                    <p class="clickable" @click="filterSet.status=''"        :class="blur('', 'status')">Tutte</p>
                                    <p class="clickable" @click="filterSet.status='active'"  :class="blur('active', 'status')">Attive</p>
                                    <p class="clickable" @click="filterSet.status='pending'" :class="blur('pending', 'status')">Pendenti</p>
                                    <p class="clickable" @click="filterSet.status='refused'" :class="blur('refused', 'status')">Rifiutate</p>
                                    <p class="clickable" @click="filterSet.status='expired'" :class="blur('expired', 'status')">Scadute</p>
                                </div>
                                
                                <div class="col s4 center-align grey-text text-darken-1">
                                    <p><b class="black-text">TIPO</b></p><hr>
                                    <p class="clickable" @click="filterSet.type=''"       :class="blur('', 'type')">Tutte</p>
                                    <p class="clickable" @click="filterSet.type='folder'" :class="blur('folder', 'type')">Solo cartelle</p>
                                    <p class="clickable" @click="filterSet.type='course'" :class="blur('course', 'type')">Solo corsi</p>
                                </div>

                                <div class="col s4 center-align grey-text text-darken-1">
                                    <p><b class="black-text">ORDINA PER</b></p><hr>
                                    <p class="clickable" @click="filterSet.orderBy='id'"            :class="blur('id', 'order')">Id</p>
                                    <p class="clickable" @click="filterSet.orderBy='user.name'"     :class="blur('user.name', 'order')">Utente</p>
                                    <p class="clickable" @click="filterSet.orderBy='course.name'"   :class="blur('course.name', 'order')">Corso</p>
                                    <p class="clickable" @click="filterSet.orderBy='requested_at'"  :class="blur('requested_at', 'order')">Data</p>
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
                    <RequestLabel v-for="(request, i) in pagination.pageContent" :key="i" :request="request"></RequestLabel>
                    <p v-if="mergedRequests.length < 1" class="center-align grey-text">Nessuna richiesta da gestire</p>             
                </ul>
            </div>
        </div>

        <div class="row">
            <div class="col s12">
                <ul v-if="mergedRequests.length > 0" class="pagination center-align" style="margin-bottom:0px;">
                    <li :class="isPrevDisabled" @click="prevPage()"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                    <li :class="isNextDisabled" @click="nextPage()"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
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

            requestToManage: null, 
            courseRequests: [], 
            folderRequests: [], 
            courses: [], 
            folders: [], 
            users: [], 
            pagination: {
                page: 1, 
                perPage: 6, 
                pageContent: []
            }, 
            filterSet: {
                status:     "", 
                type:       "", 
                orderBy:    "id",
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

        pages: function() {
            return Math.ceil(this.mergedRequests.length / this.pagination.perPage); 
        }, 

        isPrevDisabled: function() {
            return this.pagination.page <= 1 ? 'disabled waves-effect' : 'waves-effect' 
        }, 

        isNextDisabled: function() {
            return this.pagination.page >= this.pages ? 'disabled waves-effect' : 'waves-effect'
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

        dynamicSort: function(property) {
            let sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            let bp = property.indexOf('.');
            if (bp !== -1) {
                let mainp    = property.substr(0, bp); 
                let innerp   = property.substr(bp + 1);
                return function(a, b) {
                    let result = (a[mainp][innerp] < b[mainp][innerp]) ?
                        -1 : (a[mainp][innerp] > b[mainp][innerp]) ? 
                            1 : 0;
                    return result * sortOrder;
                }
            }
            return function (a,b) {
                let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }, 

        applyFilters: function(requests) {
            let user      = this.filterSet.username; 
            let status    = this.filterSet.status; 
            let type      = this.filterSet.type;    
            let order     = this.filterSet.orderBy; 

            let tmp = requests.filter(request => {
                return status == '' || request.status == status
            })

            tmp = tmp.filter(request => {
                return type == ''   || request.type == type
            })

            tmp = tmp.filter(request => {
                if (user == '') return true; 
                return  request.user.name.toLowerCase().includes(user); 
            })

            return tmp.sort(this.dynamicSort(order));
        }, 

        blur: function(selected, filter) {
            if ((filter == 'status'     && this.filterSet.status    == selected) ||
                (filter == 'type'       && this.filterSet.type      == selected) ||
                (filter == 'order'      && this.filterSet.orderBy   == selected))
                return "blurred"; 
            return false; 
        }, 

        getCurrentPageContent: function() {
            this.pagination.pageContent = []
            let start = (this.pagination.page - 1) * this.pagination.perPage
            let end = (this.pagination.page * this.pagination.perPage)
            for (let i = start; i < end && i < this.mergedRequests.length; i++) {
                this.pagination.pageContent.push(this.mergedRequests[i])
            }
        }, 

        prevPage: function() {
            if (this.pagination.page > 1) {
                this.pagination.page --
                this.getCurrentPageContent()
            }
        }, 

        nextPage: function() {
            if (this.pagination.page < this.pages) {
                this.pagination.page ++
                this.getCurrentPageContent()
            } 
        }
        
    }, 
    watch: {

        mergedRequests: function() {
            this.getCurrentPageContent()
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
        this.getCurrentPageContent()
        
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

    .clickable {
        cursor: pointer;
    }

</style>