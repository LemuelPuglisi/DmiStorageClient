<template>
    
    <div class="RequestList">

        <div class="row">
            <div class="input-field col s12 m6">
              <select id="status-select" v-model="filters.status">
                <option value="" disabled selected>Seleziona stato della richiesta</option>
                <option value="">Tutte</option>
                <option value="pending">Pendenti</option>
                <option value="active">Attive</option>
                <option value="refused">Rifiutate</option>
                <option value="expired">Scadute</option>
              </select>
              <label>Filtro delle richieste</label>
            </div>
            <div class="col s12 divider"></div>
        </div>

        <div v-if="this.requests.length <= 0">
            <div class="no-requests center-align">
                Nessuna richiesta trovata.
            </div>
        </div>  

        <div v-else class="row">
            <table  class="striped col s12">
                <thead>
                    <tr>
                        <th></th>
                        <th>Target</th>
                        <th>Permessi</th>
                        <th>Durata</th>
                        <th>Note</th>
                        <th>Stato</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in pagination.pageContent" :key="request.id" class="hoverable animated fadeIn">
                        <td class="left-align">
                            <i  class="material-icons teal-text" 
                                style="cursor: pointer" 
                                @click="openEditModal(request)">
                                edit
                            </i>
                        </td>
                        <td>{{getInfo(request).name}}</td>
                        <td>{{request.perms}}</td>
                        <td>{{request.lifespan}}</td>
                        <td><span>{{showNotes(request.notes)}}</span></td>
                        <td><span :class="dinamicColor(request)">{{request.status}}</span></td>     
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="row">
            <div class="col s12">
                <ul v-if="this.requests.length > 0" class="pagination center-align" style="margin-bottom:0px;">
                    <li :class="isPrevDisabled" @click="prevPage()"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                    <li :class="isNextDisabled" @click="nextPage()"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                </ul>
            </div>
        </div>
        

        <!-- <EditFolderRequest :request="requestToEdit"></EditFolderRequest> -->
        <!-- <EditCourseRequest :request="requestToEdit"></EditCourseRequest> -->
        <EditRequest :request="requestToEdit"></EditRequest>

    </div>

</template>

<script>
import { RepoFactory }      from "@/repositories/RepoFactory"
import errorMixin           from "@/mixins/errorMixin"
// import EditFolderRequest    from "@/components/requests/modals/EditFolderRequest"
// import EditCourseRequest    from "@/components/requests/modals/EditCourseRequest"
import EditRequest    from "@/components/requests/modals/EditRequest"

const CoursesRepo   = RepoFactory.get("courses")
const FolderRepo    = RepoFactory.get("folders");

export default {
    name: "RequestsList", 
    mixins: [
        errorMixin
    ], 
    components: {
        // EditFolderRequest, 
        // EditCourseRequest, 
        EditRequest
    },
    data: function() {
        return {
            statusColor: {
                active: 'green', 
                pending: 'orange', 
                refused: 'red', 
                expired: 'purple'
            }, 
            pagination: {
                page: 1, 
                perPage: 4, 
                pageContent: []
            }, 
            filters: { 
                status: "", 
            }, 
            courses: [], 
            folders: [], 
            requestToEdit: null, 
            
        }
    }, 
    computed: {
        
        mergedRequests: function() {
            let requests = []
            let fRequests = this.$store.getters.getFolderRequests
            let cRequests = this.$store.getters.getCourseRequests
            for (let i = 0; i < cRequests.length; i++) {
                cRequests[i].perms = 'corso, globale'
                cRequests[i].type  = "course"
                requests.push(cRequests[i])
            }
            for (let i = 0; i < fRequests.length; i++) {
                let json = JSON.parse(fRequests[i].permissions)
                let perms = 'cartella'; 
                if (json.manage) perms += ", gestione"
                if (json.remove) perms += ", rimozione"
                fRequests[i].perms = perms
                fRequests[i].type  = "folder"
                requests.push(fRequests[i])
            }
            return requests; 
        }, 

        requests: function() { 
            if (this.filters.status == "") return this.mergedRequests 
            return this.mergedRequests.filter(request => {
                return request.status == this.filters.status
            })
        },

        pages: function() {
            return Math.ceil(this.requests.length / this.pagination.perPage); 
        }, 

        isPrevDisabled: function() {
            return this.pagination.page <= 1 ? 'disabled waves-effect' : 'waves-effect' 
        }, 

        isNextDisabled: function() {
            return this.pagination.page >= this.pages ? 'disabled waves-effect' : 'waves-effect'
        },

    }, 
    methods: {
        
        fetchAllCoursesInfo: function() {
            CoursesRepo.get()
            .then(result => this.courses = result.data)
            .catch(error => this.showError(error))
        }, 

        fetchAllFoldersInfo: function() {
            FolderRepo.get()
            .then(result => this.folders = result.data)
            .catch(error => this.showError(error))
        }, 

        getCourseInfo: function(id) {
            return this.courses.filter(course => { return course.id == id })[0] || {name: 'corso'}
        }, 

        getFolderInfo: function(id) {
            return this.folders.filter(folder => { return folder.id == id })[0] || {name: 'folder'}
        }, 

        getInfo: function(request) {
            if (request.type == "course") return this.getCourseInfo(request.course_id)
            let tmp = this.getFolderInfo(request.folder_id)
            tmp.name = tmp.display_name; 
            return tmp; 
        }, 

        dinamicColor: function(request) {
            return "statusBadge " + this.statusColor[request.status]
        }, 

        showNotes: function(notes) {
            return notes.substring(0, 15) + "..."
        },

        getCurrentPageContent: function() {
            this.pagination.pageContent = []
            let start = (this.pagination.page - 1) * this.pagination.perPage
            let end = (this.pagination.page * this.pagination.perPage)
            for (let i = start; i < end && i < this.requests.length; i++) {
                this.pagination.pageContent.push(this.requests[i])
            }
        }, 

        openEditModal: function(request) {
            this.requestToEdit = request; 
            // let id = "edit-"; 
            // if (request.type == "folder") id += "frequest"
            // else id += "crequest" 
            // M.Modal.getInstance(document.getElementById(id)).open();
            const id = "editr"; 
            M.Modal.getInstance(document.getElementById(id)).open();            
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

        requests: function() {
            this.getCurrentPageContent()
            let elems = document.querySelectorAll('.modal');
            M.Modal.init(elems);
        }

    }, 
    created: function() {
        this.fetchAllCoursesInfo()
        this.fetchAllFoldersInfo()
    }, 
    mounted: function() {
        this.getCurrentPageContent()
        let modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
        let sselect = document.getElementById("status-select"); 
        M.FormSelect.init(sselect); 
    }
}
</script>

<style scoped>

    .statusBadge {
        padding: 5px; 
        color: white; 
        border-radius: 5px 5px 5px 5px; 
    }

    .no-requests {
        color: #757575; 
        padding: 20px;
        padding-bottom: 10px; 
        font-size: 1em; 
    }

    @media only screen and (max-width: 600px) {
        table {
            display: block !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
        }
    }

</style>