<template>
    <div class="reset">        
        
        <nav class="grey darken-4">
            <div class="nav-wrapper">
                <a href="/" class="brand-logo center">
                <i class="material-icons red-text text-lighten-1">school</i>
                <span>dmi</span>
                <span class="red-text text-lighten-1">Cloud</span>
                </a>
            </div>
        </nav>
        
        <div class="container">
            <div class="row">
                <div class="col s12 center-align valign">
                    <ResetForm v-bind:code="code"></ResetForm>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import ResetForm    from '@/components/auth/ResetForm'

export default {
    name: "reset", 
    components: {
        ResetForm
    }, 
    computed: {

        code : function() {
            return this.$route.query.code || null
        }

    }, 
    created: function() {
        if (this.code == null) {
            this.$router.push({path: "/"})
        }
    }
}
</script>

<style scoped>

    body {
        background-color: #F1F1F1;
    }

    .valign {
        margin-top: 10%; 
    }
    
</style>