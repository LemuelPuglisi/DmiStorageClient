<template>
    <div class="bottom-sheet modal" id="editr">
        <div v-if="buffer != null" class="modal-content">
            <p class="modal-header">Gestisci la tua richiesta</p>
            <div v-if="!buffer">
                <p class="grey-text text-darken-1"> Nessuna richiesta è stata selezionata</p>
            </div>
            <div v-else class="row">

                <div class="col s12">
                    <p class="grey-text text-darken-1">
                        Se la richiesta da modificare è in stato attivo, non verrà cancellata una volta inviata la richiesta di modifica al server. 
                        <br>
                        Quest'ultima verrà archiviata come pendente sino alla gestione da parte degli amministratori. 
                        <br>
                        Nel caso venisse accettata, essa sostituira la vecchia richiesta, che verrà, a sua volta, eliminata.
                        <br>
                        Nel caso di modifiche di richieste pendenti, la nuova richiesta sostituirà in qualsiasi caso quella modificata.  
                    </p>
                </div>

                <form @submit.prevent="editRequest()">
                    
                    <div class="col s12 divider"></div>

                    <div class="col s12">
                        <div class="input-field">
                            <textarea
                                id="rnotes"
                                v-model="buffer.notes"
                                class="materialize-textarea"
                                data-length="400">
                            </textarea>
                        </div>
                        <small class="grey-text">
                            Motivi della richiesta
                        </small>
                    </div>

                    <div class="col s12 m6">
                        Permessi richiesti: 
                        <div class="input-field">
                            <div class="switch">
                                <label>
                                    <input type="checkbox" v-model="buffer.permissions.manage">
                                    <span class="lever"></span>
                                    <span class="switch-text">Gestione cartella</span>
                                </label>
                            </div>
                        </div>
                        <div class="input-field">
                            <div class="switch">
                                <label>
                                    <input type="checkbox" v-model="buffer.permissions.remove">
                                    <span class="lever"></span>
                                    <span class="switch-text">Rimozione files</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="col s12 m6 right-align">
                        <!-- edit button -->
                        <button type="submit" class="waves-effect waves-light btn-small"
                        :class = "loadBtn.edit ? 'pulse' : ''" >
                            <i class="material-icons left">publish</i> Richiedi modifica
                        </button>
                    </div>

                </form>

                <div class="right-align">
                        <!-- delete button -->
                        <button class="waves-effect red waves-light btn-small"
                            :class = "loadBtn.canc ? 'pulse' : ''" 
                            style="margin-top:10px; margin-right: 10px;"
                            @click="showDeleteConfirm = true">
                            <i class="material-icons left">delete</i> Elimina richiesta
                        </button>
                        <div v-if="showDeleteConfirm" style="margin: 10px" class="grey-text text-darken-2">
                            Ne sei sicuro?
                            <a style="cursor: pointer" @click="deleteRequest()" class="red-text">Si </a>, 
                            <a style="cursor: pointer" @click="showDeleteConfirm = false"> No</a>
                        </div> 
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { RepoFactory }      from "@/repositories/RepoFactory"
import errorMixin           from "@/mixins/errorMixin"

const FolderRequestRepo = RepoFactory.get("folderRequests");

export default {
    name: "EditRequest", 
    props: ["request"], 
    data: function() {
        return {
            buffer: null, 
            showDeleteConfirm: false, 
            loadBtn: {
                edit: false, 
                canc: false, 
            }
        }
    },
    mixins: [
        errorMixin
    ], 
    computed: {

        userToken: function() {
            return this.$store.getters.getUserToken;
        }, 

        userId: function() {
            return this.$store.getters.getUserId 
        }

    },
    methods: {

        fillBuffer: function() {
            this.buffer = {
                id :            this.request.id, 
                notes:          this.request.notes, 
                permissions:    JSON.parse(this.request.permissions)
            }
        }, 

        editRequest: function() {
            let form = {}
            form.notes = this.buffer.notes, 
            form.permissions = JSON.stringify(this.buffer.permissions) 
            FolderRequestRepo.upgrade(this.userToken, this.buffer.id, form)
            .then(() => {
               
                let data = { id: this.userId, token: this.userToken } 
                this.$store.dispatch('getUserPermissions', data)
               .catch(error => this.showError(error))
               
                let html = "<p class='grey-text text-darken-1'>La modifica è stata richiesta correttamente.</p>"
                this.$swal({
                    html: html, 
                    type: "success", 
                })

                this.loadBtn.canc = false; 
                let modal = document.getElementById('editr') 
                M.Modal.getInstance(modal).close();
                this.buffer = null; 
            })  
            .catch(error => {
                this.loadBtn.edit = false; 
                this.showError(error)
            })
        }, 

        deleteRequest: function() {
            FolderRequestRepo.delete(this.userToken, this.buffer.id)
            .then(() => {   
                let data = { id: this.userId, token: this.userToken } 
                this.$store.dispatch('getUserPermissions', data)
               .catch(error => this.showError(error))
                let html = "<p class='grey-text text-darken-1'>La cancellazione è stata eseguita correttamente.</p>"
                this.$swal({
                    html: html, 
                    type: "success", 
                })
                this.loadBtn.canc = false; 
                let modal = document.getElementById('editr') 
                M.Modal.getInstance(modal).close();
                this.buffer = null; 
            })
            .catch(error => {
                this.loadBtn.canc = false; 
                this.showError(error)
            });  
        }

    }, 
    watch: {
        "request": function(newRequest) {
            if (newRequest) {
                this.fillBuffer()
            }
        }
    }, 
    mounted: function() {
        let notes = document.getElementById("rnotes")
        M.CharacterCounter.init(notes)
        if (this.request) {
            this.fillBuffer()
        } 
    }
}
</script>

<style scoped>

    .modal-header {
        font-size: 1.5em; 
        font-weight: 400; 
    }

    .modal.bottom-sheet {
        margin: auto; 
        max-width: 100% !important;
        max-height: 100% !important;

        width: 60% !important;
        height: 55% !important;
    }

    @media screen and (max-width: 1200px) {
        .modal.bottom-sheet {
            width: 90% !important;
            height: 55% !important;
        }
    }

    @media screen and (max-width: 600px) {
        .modal.bottom-sheet {
            height: 70% !important;
            width: 100% !important; 
        }
    }

</style>