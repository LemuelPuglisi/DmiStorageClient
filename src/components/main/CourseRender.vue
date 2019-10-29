<template>

    <div v-show="elementVisible">
        <div class="container" style="margin-top:20px;">
            <div class="row">
                <div class="col s12">
                    <div class="card-panel grey lighten-5 z-depth-2">
                        <div class="row valign-wrapper">
                            <div class="col s3 m2 center align">
                                <a class="btn-floating btn-large waves-effect waves-light red" @click="goBack()">
                                    <i class="material-icons">keyboard_arrow_left</i>
                                </a>                        
                            </div>
                            <div v-if="course != null" class="col s10 m11 left align">
                                <p class="course-title">{{course.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>

        <div class="cloud container">

            <div v-if="emptyCourse && course != null">
                <div class="row">
                    <div class="offset-s1 col s10 ">
                        <div class="card">
                            <div class="card-image">
                                <img src="@/assets/media/no-content.gif" class="responsive-img" alt="">
                            </div>
                            <div class="card-content center align">
                                <p class="error-message"><i class="material-icons fixed-icon red-text">mood_bad</i> Il corso <b>{{course.name}}</b> sembra essere <span class="red-text">vuoto</span>! </p>
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
                        <FolderItem v-for="folder in filteredFolders" 
                                    :key="folder.ir" 
                                    v-bind:folder="folder">
                        </FolderItem>
                    </div>

                </div>
            </div>

        </div>

    </div>

</template>

<script>
import FolderItem       from "@/components/main/FolderItem"
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";

const CoursesRepo = RepoFactory.get("courses");

export default {
    name: "CourseRender", 
    mixins: [
        errorMixin
    ],
    components: {
        FolderItem
    },
    props: [
        "id"
    ], 
    data: function() {
        return {
            course : null, 
            folders: null, 
            filter: '', 
            elementVisible: false
        }
    },
    computed: {
        
        emptyCourse: function() {
            return this.folders == null || this.folders.length <= 0; 
        }, 

        filteredFolders: function() {
            if (this.folders == null) return null
            let FF = this.folders.filter( folder => {
                return  folder.subfolder_of == null
            }); 
            if (this.filter == '') return FF
            return FF.filter( folder => {
                return  folder.display_name.toLowerCase().includes(this.filter.toLowerCase())
            });
        }, 

        dinamicFolders: function() {
            return this.folders != null ? this.folders : [{display_name: 'null'}] 
        }, 

    },
    methods: {

        getCourseDetails: function() {
            CoursesRepo.show(this.id)
            .then(result => {
                this.course = result.data
            })
            .catch(error => {
                this.showError(error)
            })
        },

        fetchFolders: function() {
            CoursesRepo.getFolders(this.id)
            .then(result => {
                this.folders = result.data.content
                this.elementVisible = true
            })
            .catch(error => {
                this.showError(error)
                this.elementVisible = true
            })
        }, 

        goBack: function() {
            this.$router.push({path: "/"})
        }

    },
    watch: {
        "$route" () {
            this.getCourseDetails()
            this.fetchFolders()
        }
    },
    created: function() {
        this.getCourseDetails()
        this.fetchFolders()
    }, 
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

    .course-title {
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