<template>
    
    <div class="container">

        <div class="row">
            <div class="col s2 m1 center-align">
                <a class="waves-effect red waves-light btn-floating" @click="goBack()">
                    <i class="material-icons left">keyboard_arrow_left</i>
                </a>
            </div>
            <div class="col s10 m11 left-align">
                <p class="title">{{file.name}}</p>
                <p class="author">File appartenente a {{file.author}}</p>
            </div>
        </div>
        
        <div class="progress">
                <div class="determinate" :style="loadRatio"></div>
        </div>

        <div v-if="file.extension == 'pdf'">
            <pdf    style="width:100%" 
                    ref="myPdfComponent" 
                    :src="source"
                    :page="index"
                    @progress="loaded = $event"
                    @num-pages="pageCount = $event">
            </pdf>
            <ul v-if="loaded" class="pagination center align">
                <li class="waves-effect"><a href="#!"><i class="material-icons" @click="prev()">chevron_left</i></a></li>
                <li v-for="page in pagination" 
                    :key="page" 
                    :class="dinamicPageClass(page)" 
                    @click="changePage(page)"> 
                    <a href="#!">{{page}}</a> 
                </li>
                <li class="waves-effect"><a href="#!"><i class="material-icons" @click="next()">chevron_right</i></a></li>
            </ul>
        </div>
        
        <div v-else-if="isStreammable">
            <img :src="source" style="width:100%" @load="loaded = 1" alt="">
        </div>

        <div v-else-if="file.extension != null" class="card center-align">
            <div class="card-content">
                <h5 style="padding: 10px">
                    <i class="material-icons fixed-icon red-text">warning</i> 
                    Lo streamer non è in grado di visualizzare la risorsa</h5>
            </div>
        </div>

    </div>

</template>

<script>
import pdf              from 'vue-pdf'
import errorMixin       from "@/mixins/errorMixin";
import { RepoFactory }  from "@/repositories/RepoFactory";

const FileRepo = RepoFactory.get('files')

export default {
    name: "ResourceRender", 
    components: {
        pdf
    },
    props: [
        "id"
    ], 
    mixins: [
        errorMixin
    ], 
    data: function() {
        return { 
            file: {
                name: "", 
                folder_id: 1, 
                extension: null, 
            }, 
            streammable: [
                'pdf',  'png',  'jpeg',  
                'gif',  'jpg'
            ], 
            base : process.env.VUE_APP_HOST,
            paginationLimit: 5,
            pageCount: null,  
            index: 1,
            loaded: 0, 
        }
    }, 
    computed: {
        
        source: function() {
            return this.base + "api/files/" + this.id + "/stream"
        },

        isStreammable: function() {
            return this.streammable.includes(this.file.extension)
        },  

        totalPages: function() {
            return this.pageCount || 1; 
        },

        pages: function() {
            let pages = []; 
            for(let i = 1; i <= this.totalPages; i++) {
                pages.push(i); 
            }
            return pages; 
        },

        pagination: function() {
            if ((this.totalPages - this.index) >= this.paginationLimit) {
                return this.pages.slice(this.index-1, this.index + this.paginationLimit - 1)
            } 
            let q = this.paginationLimit - (this.totalPages - this.index); 
            return this.pages.slice(this.index - q, this.index + this.paginationLimit - 1)
        }, 

        loadRatio: function() {
            let k = this.loaded * 100
            return "width: " + k + "%;"; 
        }

    }, 
    methods: {

        getFileDetails: function() {
            FileRepo.show(this.id)
            .then(result => {
                this.file = result.data.content
            })
            .catch(error => {
                this.showError(error)
            })
        }, 

        dinamicPageClass: function(index) {
            return this.index == index ? "active" : "waves-effect"
        }, 

        changePage: function(page) {
            if (page > this.totalPages) return
            this.index = page; 
            window.scroll({
                top: 0, 
                left: 0, 
                behavior: 'smooth' 
            });
        },

        prev: function() {
            if (this.index > 1) this.index --
        }, 

        next: function() {
            if (this.index < this.totalPages) this.index++
        }, 

        goBack: function() {
            this.$router.push({path: "/folder/" + this.file.folder_id})
        }

    }, 
    watch: {
        "$route" () {
            this.getFileDetails() 
        }
    },
    created: function() {
        this.getFileDetails()
    }
}
</script>

<style scoped>

    .container {
        margin-top: 40px; 
    }

    .title {
        font-size: 20px; 
        margin-top: 0px;
        font-weight: bold; 
        margin-bottom: 0px; 
    }

    .author {
        font-size: 15px;        
        color: #757575; 
        margin: 0; 
    }

    .fixed-icon {
        display: inline-flex;
        vertical-align: top;
    }

</style>