<template>
    <div class="col s12">
        <div class="card card-fixed z-depth-2 hvr-underline-from-center">
            <div class="card-content">
                <div class="row">
                    <div class="col s7 l10">
                        <p> 
                            <i class="material-icons small red-text icon-fixed">{{opportuneIcon}}</i> 
                            <span   class="file-text" 
                                    :class="isStreammable ? 'clickable' : ''"
                                    @click="isStreammable ? stream() : null"> 
                            {{file.name}}</span>  
                        </p> 
                    </div>
                    <div class="col s5 l2">
                        <a 
                            v-if="isStreammable" 
                            class="btn-floating ml right align btn-small waves-effect waves-light teal" 
                            :class="streaming ? 'pulse' : ''" 
                            @click="stream">
                            <i class="material-icons">remove_red_eye</i>
                        </a>
                         <a 
                            class="btn-floating ml right align btn-small waves-effect waves-light teal" 
                            :class="downloading ? 'pulse' : ''" 
                            @click="download">
                            <i class="material-icons">get_app</i>
                        </a>
                    </div>
                </div>
                <p class="right align"><small class="mobile-spacing grey-text">Diritti di {{file.author}}</small></p> <br>
                <p class="right align"><small class="mobile-spacing grey-text">Ultima modifica {{file.updated_at}} </small></p>
            </div>
        </div>
    </div>    
</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";

const FileRepo = RepoFactory.get('files')

export default {
    name: "FileItem", 
    props: [
        "file"
    ], 
    mixins: [
        errorMixin
    ],
    data: function() {
        return {
            icon: {
                'std': "insert_drive_file", 
                'png': "image",
                'jpg': "image",
                'jpeg': "image",
                'gif': "image", 
                'pdf': "picture_as_pdf",  
            }, 
            streammable: [
                'pdf',  'png',  'jpeg',  
                'gif',  'jpg'
            ], 
            streaming: false, 
            downloading: false
        }
    }, 
    computed: {

        opportuneIcon: function() {
            return this.icon[this.file.extension] || this.icon.std; 
        }, 

        filename: function() {
            return this.file.name + "." + this.file.extension
        },

        isStreammable: function() {
            return this.streammable.includes(this.file.extension)
        }

    }, 
    methods: {

        download: function() {
            this.downloading = true
            FileRepo.download(this.file.id)
            .then(result => {
                const url = window.URL.createObjectURL(new Blob([result.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.filename);
                document.body.appendChild(link);
                link.click();
                this.downloading = false
            })
            .catch(error => {
                this.showError(error)
                this.downloading = false
            })
        }, 

        stream: function() {
            this.streaming = true; 
            this.$router.push({path: "/stream/" + this.file.id})
            this.streaming = false; 
        }

    }
}
</script>

<style scoped>

    .card {
        padding: 15px; 
    }

    .card-fixed {
        width: 100%; 
        padding: 0; 
    }

    .icon-fixed {
        display: inline-flex;
        vertical-align: top;
    }

    .file-text {
        margin-left: 10px;
        font-size: 19px; 
    }

    @media only screen and (max-width: 600px) {
        .file-text {
            font-size: 16px; 
        }    
    }
    
    @media only screen and (max-width: 600px) {
        .mobile-spacing {
            margin-top: 10px; 
            padding-bottom: 10px;   
        }
    }

    .clickable {
        cursor: pointer;
    }

    .ml {
        margin-left: 7px; 
    }

</style>