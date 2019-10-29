<template>
    <div class="bottom-sheet modal" id="editr">
        <div class="modal-content">
            <p class="modal-header">Gestisci la tua richiesta</p>
            <div v-if="!buffer">
                <p class="grey-text text-darken-1"> Nessuna richiesta è stata selezionata</p>
            </div>
            <div v-else class="row">
                <form @submit.prevent="routeRequest()">
                    
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

                    <div v-if="buffer.type == 'folder'" class="col s12 m6">
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

                    <div class="col s12" :class="buffer.type == 'folder' ? 'm6' : ''">
                        <div class="input-field">
                            <p class="range-field">
                                <input type="range"  id="rslider"
                                  v-model="buffer.lifespan"
                                  :min="7" :max="365"/>
                                <label for="folder-lifespan-slider" style="font-size:15px">
                                  Durata del permesso {{buffer.lifespan}}
                                </label>
                            </p>
                        </div>
                    </div>

                    <div class="col s12">
                        <button type="submit" class="waves-effect waves-light btn-small">
                            <i class="material-icons left">publish</i> Richiedi modifica
                        </button>
                    </div>

                </form>

                <!-- delete request -->
                <div>
                    <button class="waves-effect red waves-light btn-small" 
                        style="margin-top:10px; margin-left: 10px;"
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
export default {
    name: "EditRequest", 
    props: ["request"], 
    data: function() {
        return {
            buffer: {
                id: null, 
                type: null, 
                lifespan: null, 
                notes: null, 
                permissions: null, 
            }, 
            showDeleteConfirm: false, 
        }
    },
    methods: {

        fillBuffer: function() {
            this.buffer.id = this.request.id; 
            this.buffer.type = this.request.type; 
            this.buffer.lifespan = this.request.lifespan;
            this.buffer.notes = this.request.notes;
            if (this.request.type == "folder") {
                this.buffer.permissions = this.request.permissions;
            }    
        }, 

        routeRequest: function() {}, 

        deleteRequest: function() {}, 

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
        let lifespan = document.getElementById("rslider")
        M.CharacterCounter.init(notes)
        M.Range.init(lifespan);
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