<template>

    <div class="col s12">
        <div class="card card-fixed z-depth-2 hvr-underline-from-center">
            <div class="card-content clickable" @click="goToFolder()">
                <p> 
                    <i class="material-icons small teal-text icon-fixed">folder</i> 
                    <span class="folder-text"> {{folder.display_name}}</span>  
                </p> 
                <small class="mobile-spacing right align grey-text">Ultima modifica di {{username}} il {{folder.created_at}}</small>
            </div>
        </div>
    </div>

</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory";
import errorMixin       from "@/mixins/errorMixin";

const FolderRepo = RepoFactory.get("folders");

export default {
    name: "FolderItem", 
    props: [
        "folder"
    ], 
    mixins: [
        errorMixin
    ], 
    data: function() {
        return {
            creator: null
        }
    },
    computed: {

        username: function() {
            return this.creator || 'loading'; 
        } 

    }, 
    methods: {

        getCreator: function() {
            FolderRepo.user(this.folder.id)
            .then(result => {
                this.creator = result.data.username
            })
            .catch(error => {
                this.showError(error)
            })
        }, 

        goToFolder: function() {
            this.$router.push({path: "/folder/" + this.folder.id})
        }

    }, 
    mounted: function() {
        this.getCreator()
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

    .folder-text {
        margin-left: 10px;
        font-size: 19px; 
    }

    @media only screen and (max-width: 600px) {
        .folder-text {
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

</style>