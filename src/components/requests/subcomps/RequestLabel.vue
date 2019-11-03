<template>

    <li class="collection-item avatar">
        <img :src="request.type == 'folder' ? fpath : cpath" alt="" class="circle">
        <span class="title">
            Utente: {{request.user_id}}, 
            Corso: {{request.course_id}}
            {{request.type == 'folder' ? ', Cartella: ' + request.folder_id : ""}} 
        </span>
        <p> First Line <br>
            Second Line
        </p>
            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
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
            cpath: require("@/assets/media/course-icon.png"), 
            fpath: require("@/assets/media/folder-icon.png"), 
        }
    }, 
    computed: {

    }, 
    methods: {

    }
}
</script>
