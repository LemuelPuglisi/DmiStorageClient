<template>
    <div class="FolderRequestForm row">
        <form @submit.prevent="sendRequest()">

            <div v-if="listOfCourses != null" class="col s12 m6">
                <SelectElement
                    :items="listOfCourses"
                    name="il corso"
                    v-on:updatevalue="getSelectedCourse">
                </SelectElement>
            </div>

            <div v-if="folders != null && selectedCourse != null" class="col s12 m6">
                <SelectElement
                    :key="selectedCourse"
                    :items="foldersFromCourse"
                    name="la cartella"
                    v-on:updatevalue="getSelectedFolder">
                </SelectElement>
            </div>
            <div v-else class="col s12 m6">
                <div style="padding: 10px">
                    <span class="red-text">*</span> Seleziona il corso in cui risiede la cartella
                </div>
            </div>

            <div class="col s12">
                <div class="input-field">
                    <textarea
                        v-model="reason"
                        id="folder-request-text"
                        class="materialize-textarea"
                        data-length="400">
                    </textarea>
                    <label for="folder-request-text">
                        <span class="red-text">*</span> spiega i motivi della richiesta
                    </label>
                </div>
            </div>

            <div class="col s12 m4">
                Permessi richiesti: 
                <div class="input-field">
                    <div class="switch">
                        <label>
                            <input type="checkbox" v-model="manage">
                            <span class="lever"></span>
                            <span class="switch-text">Gestione cartella</span>
                        </label>
                    </div>
                </div>
                <div class="input-field">
                    <div class="switch">
                        <label>
                            <input type="checkbox" v-model="remove">
                            <span class="lever"></span>
                            <span class="switch-text">Rimozione files</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="col s12 m8">
                <div class="input-field">
                    <p class="range-field">
                        <input
                          type="range"
                          id="folder-lifespan-slider"
                          v-model="lifespan"
                          :min="7"
                          :max="365"/>
                        <label for="folder-lifespan-slider" style="font-size:15px">
                          <span class="red-text">*</span>
                          Quanti giorni vuoi trattenere il permesso? Giorni: {{lifespan}}
                        </label>
                    </p>
                </div>
            </div>

            <div class="col s12 m12 left-align">
                <div class="input-field">
                    <button
                        class="btn waves-effect btn-small waves-light"
                        :class="loading ? 'pulse' : ''"
                        type="submit"
                        name="action">
                        Invia richiesta
                        <i class="material-icons right">send</i>
                    </button>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory";
import SelectElement    from "@/components/requests/SelectElement";
import errorMixin       from "@/mixins/errorMixin";

const FolderRequestRepo = RepoFactory.get("folderRequests"); 
const CoursesRepo       = RepoFactory.get("courses");

export default {
    name: "FolderRequestForm",
    props: [
        "folders", 
    ],
    mixins: [
        errorMixin
    ], 
    components: {
        SelectElement
    }, 
    data: function() {
        return {
            listOfCourses: null, 
            foldersFromCourse: [], 
            selectedCourse: null,  
            selectedFolder: null, 
            lifespan: 0, 
            reason: "",
            manage: false, 
            remove: false, 
            loading: false, 
        }
    }, 
    computed: {
    
        userId: function() {
            return this.$store.getters.getUserId;
        },

        userToken: function() {
            return this.$store.getters.getUserToken;
        }, 

    },
    methods: {

        fetchAvaiblesCourses: function() {
            CoursesRepo.get()
            .then(result => this.listOfCourses = result.data)
            .catch(error => this.showError(error));
        },

        spawnToast: function(message, error = 0) {
            let color = error == 1 ? 'red' : 'green'; 
            M.toast({ html: message, classes: color });
        },

        checkFields: function() {
            if (this.selectedCourse == null ||
                this.selectedFolder == null ||
                this.lifespan < 7 || 
                this.reason.replace(/\s/g, "").length < 1 ||
                (!this.manage && !this.remove)) {
                    const error = "Compila tutti i campi"                
                    this.spawnToast(error, 1)
                    return false; 
                } return true; 
        }, 

        clearFields: function() {
            this.selectedFolder = null
            this.selectedCourse = null
            this.reason = ""
            this.lifespan = 0
            this.manage = false
            this.remove = false
        }, 

        sendRequest: function() {
            if (this.checkFields()) {
                this.loading = true
                FolderRequestRepo.store(this.userToken, {
                    folderId: this.selectedFolder, 
                    permissions: JSON.stringify({
                        remove: this.remove, 
                        manage: this.manage
                    }), 
                    notes: this.reason,
                    lifespan: this.lifespan 
                })
                .then( result => {
                    this.spawnToast(result.data.message)
                    this.loading = false
                    this.$store.dispatch("getUserPermissions", {
                        id: this.userId, 
                        token: this.userToken
                    }).catch(error => this.showError(error))
                    this.clearFields();
                })
                .catch( error => {
                    this.loading = false 
                    this.showError(error)
                })
            }
        }, 

        getSelectedCourse: function(value) {
            this.selectedFolder = null
            this.selectedCourse = value
            this.foldersFromCourse = this.getFoldersFromCourse(value)
        }, 

        getSelectedFolder: function(value) {
            this.selectedFolder = value
        }, 

        getFoldersFromCourse: function(id) {
            if (id === null) return []
            let ffc = []
            for (let i in this.folders) {
                if (this.folders[i].course_id === id) 
                    ffc.push(this.folders[i])
            }
            return ffc; 
        }

    }, 
    created: function() {
        this.fetchAvaiblesCourses()
    }, 
    mounted: function() {
        let folderTextArea = document.getElementById("folder-request-text");
        let folderLifespan = document.getElementById("folder-lifespan-slider");

        M.CharacterCounter.init(folderTextArea);
        M.Range.init(folderLifespan);
    }
}
</script>

<style scoped>

    .alert {
        padding: 10px; 
        text-align: center; 
        border-radius: 7px 7px 7px 7px; 
        font-weight: bold;  
    }

</style>