<template>

    <li class="collection-item avatar">

        <!-- status and type -->
        <i class="material-icons circle" :class="statusColor[request.status]">
            {{ request.type == "folder" ? 'folder' : 'school' }}
        </i>

        <!-- username -->
        <span class="title"> <b>{{request.user.name}}</b> </span>
        
        <!-- target -->
        <p>
            {{request.course.name}} 
            {{request.type == "folder" ? " | " +request.folder.display_name : "" }}
        </p>
        <p v-if="request.type == 'folder'" style="width: 80%">
            <b>Permessi</b>: 
            {{request.permissions.manage ? 'gestione, ' : ''}}
            {{request.permissions.remove ? 'rimozione' : ''}}
        </p>
        <p v-else><b>Permessi</b>: globali</p>
        <p><small class="grey-text">{{request.requested_at}}</small></p>
        
        <!-- edit -->
        <a @click="manage()" class="secondary-content btn-floating btn-small waves-effect waves-light">
            <i class="material-icons right">tune</i>
        </a>

    </li>

</template>

<script>
export default {
    name: "RequestLabel", 
    props: [
        "request"
    ], 
    data: function() {
        return {
            statusColor: {
                active:  'green', 
                pending: 'orange', 
                refused: 'red', 
                expired: 'purple'
            }, 
        }
    }, 
    computed: {

        badge: function() {
            return "statusBadge " + this.statusColor[this.request.status]
        }

    }, 
    methods: {

        manage: function() {
            this.$router.push({
                name: 'manage-request', 
                params: {
                    id:     this.request.id, 
                    type:   this.request.type,
                }, 
                // query: {
                //     user:   '', 
                //     email:  '', 
                //     course: '', 
                //     folder: '', 
                // }
            })
        }

    }
}
</script>

<style scoped>
    
    .statusBadge {
        padding: 2px; 
        padding-left: 7px; 
        padding-right: 7px; 
        color: white; 
        margin-right: 4px; 
        border-radius: 5px 5px 5px 5px; 
    }

    .secondary-content {
        margin-top: 27px;
    }

</style>