<template>
        
    <div class="fixed-action-btn" id="floatBtn">
        <a id="float-menu" class="btn-floating btn-large grey darken-3">
            <i class="large material-icons">menu</i>
        </a>
        <ul>
            <li><a class="btn-floating green darken-1"><i class="material-icons">attach_file</i></a></li>
            <li><a class="btn-floating green lighten-2" @click="goTo('resources')"> <i class="material-icons">cloud_upload</i></a></li>
            <li><a class="btn-floating red darken-2"    @click="goTo('requests')">  <i class="material-icons">remove_red_eye</i></a></li>
            <li><a class="btn-floating brown darken-2"  @click="goTo('cloud')">     <i class="material-icons">home</i></a></li>
        </ul>
    </div>
    
</template>

<script>
export default {
    name: "FloatNav", 
    computed: {

        userRole: function() {
            return this.authenticated ? this.$store.getters.getUserRole : 1 
        }

    }, 
    methods: {

        goTo: function(route) {
            this.$router.push({name: route})
        }

    }
}
</script>