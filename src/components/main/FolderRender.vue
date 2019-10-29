<template>

    <div v-show="elementVisible">
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
                            <div v-if="folder != null" class="col s10 m11 l12 left align">
                                <p class="folder-title">{{folder.display_name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>

        <div class="cloud container">

            <div v-if="emptyFolder && folder != null">
                <div class="row">
                    <div class="offset-s1 col s10 ">
                        <div class="card">
                            <div class="card-image">
                                <img src="@/assets/media/no-content.gif" class="responsive-img" alt="">
                            </div>
                            <div class="card-content center align">
                                <p class="error-message"><i class="material-icons fixed-icon red-text">mood_bad</i> Il corso <b>{{folder.display_name}}</b> sembra essere <span class="red-text">vuoto</span>! </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="row">

                    <div class="col s12">
                        <div class="row">
                            <div class="input-field col s12">
                                <i class="material-icons prefix">search</i>
                                <input type="text" v-model="filter" id="searchBar" class="autocomplete">
                                <label for="searchBar">Cerca tra le cartelle</label>
                                <small class="filter-display" v-if="filter != ''">Filtro: {{filter}}</small>
                            </div>
                        </div>
                    </div>

                    <div class="row">

                        <FolderItem v-for="sub in compSubfolders" :key="sub.id" v-bind:folder="sub"></FolderItem> 
                        <FileItem v-for="item in files" :key="item.id" v-bind:file="item"></FileItem>

                    </div>

                </div>
            </div>

        </div>

    </div>

</template>

<script>
import  { RepoFactory } from "@/repositories/RepoFactory";
import  errorMixin      from "@/mixins/errorMixin";
import  FolderItem      from "@/components/main/FolderItem"
import  FileItem        from "@/components/main/FileItem"

const FolderRepo = RepoFactory.get("folders");

export default {
    name: "FolderRender",
    props: [
        "id"
    ],
    mixins: [
        errorMixin
    ],
    components: {
        FolderItem, 
        FileItem
    }, 
    data: function() {
        return {
            folder: null, 
            content: null, 
            subfolders: null, 
            filter: '', 
            elementVisible: false, 
        }
    },
    computed: {

        emptyFolder: function() {
            return this.content == null || this.content.length <= 0; 
        },

        files: function() {
            if (this.filter == '') return this.content || {}
            return this.content.filter(file => {
                return  file.name.toLowerCase().includes(this.filter.toLowerCase())
            })
        },
        
        compSubfolders: function() {
            if (this.filter == '') return this.subfolders || {}
            return this.subfolders.filter(sub => {
                return  sub.display_name.toLowerCase().includes(this.filter.toLowerCase())
            })
        }

    }, 
    methods: {

        getFolderDetails: function() {
            FolderRepo.show(this.id)
            .then(result => {
                this.folder = result.data.content
            })
            .catch(error => {
                this.showError(error)
            })
        }, 

        fetchFiles: function() {
            FolderRepo.files(this.id)
            .then(result => {
                this.content = result.data.content;
                this.elementVisible = true;  
            })
            .catch(error => {
                this.showError(error)
                this.elementVisible = true;  
            })
        }, 

        fetchSubFolders: function() {
            FolderRepo.subFolders(this.id)
            .then(result => {
                this.subfolders = result.data.content
            })
            .catch(error => {
                this.showError(error)
            })
        }, 

        goBack: function() {
            let path = "/course/" + this.folder.course_id
            if (this.folder.subfolder_of != null) {
                path = "/folder/" + this.folder.subfolder_of
            }
            this.$router.push({path: path})
        }

    },
    watch: {
        "$route" () {
            this.getFolderDetails()
            this.fetchSubFolders()
            this.fetchFiles()
        }
    },
    mounted: function() {
        this.getFolderDetails()
        this.fetchSubFolders()
        this.fetchFiles()
    }
}
</script>

<style scoped>

    .cloud {
        margin-top: 20px; 
        background-color: white; 
    }

    .container {
        max-width: 100% !important;
        width: 90% !important; 
    }

    .folder-title {
        font-size: 25px; 
        font-weight: bold; 
    }

    .card-panel {
        padding-top: 2px;
        padding-bottom: 0px;  
    }

    .no-content {
        background: #212121; 
        padding: 15px;
    }

    .error-message {
        font-size: 20px; 
        font-weight: 500px; 
    }

    .fixed-icon {
        display: inline-flex;
        vertical-align: top;
    }

    .filter-display {
        margin-left: 20px; 
        color: grey; 
    }

</style>