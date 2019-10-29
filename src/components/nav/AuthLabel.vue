<template>
    <div class="row">
        
        <div v-if="authenticated" class="col s12">
            <div class="card z-depth-2">
                <div class="card-content">

                    <div class="row">
                        <div class="col s12 center-align">
                            <div class="user-details-container">
                                <span><b> {{user.name}} </b></span> <br/>
                                <div class="divider"></div>
                                <span> {{user.email}} </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div  class="col s12 center align">
            <a v-if="authenticated" class="waves-effect waves-light btn red lighten-2 z-depth-2 login-btn" @click="logout()">Esci</a>            
            <a v-else class="waves-effect waves-light btn teal z-depth-2 login-btn modal-trigger" href="#login-modal">Accedi</a>   
        </div>

    </div>      
</template>

<script>
import { RepoFactory }  from "@/repositories/RepoFactory"
import errorMixin       from '@/mixins/errorMixin'

const AuthRepo = RepoFactory.get('auth')

export default {

    name: "AuthLabel", 
    mixins: [
        errorMixin
    ], 
    computed: {

        authenticated: function() {
            return this.$store.getters.isLoggedIn
        }, 

        user: function() {
            return this.$store.getters.getUserData || {
                name: 'Errore del server', 
                email: 'Download dei dati utente non riuscito' 
            }
        },

        status: function() {
            return this.$store.state.user.state
        }

    }, 
    methods: {
        
        updateStatus: function() {
            this.userState = this.$store.state.user
        },

        logout: function() {
            const id = this.$store.getters.getUserId
            const token = this.$store.getters.getUserToken
            
            AuthRepo.logout(id, token)
            .then( () => {
                this.$store.dispatch('logoutRequest')
                .then(() => {
                    M.toast({html: "Logout eseguito con successo", classes: "green"})                
                })
                .catch(error => {
                    this.showError(error)
                })
            })
            .catch(error => {
                this.$store.dispatch('logoutRequest')
            }) 
        }

    },

}
</script>

<style scoped>

.login-btn {
    max-width: 90% !important;
    width: 90% !important; 
    margin-top: 9px; 
}

.card {
    padding: 0px !important; 
}

.card-content {
    padding-bottom: 3px !important; 
}

.user-details-container {
    padding: 5px;
}

</style>