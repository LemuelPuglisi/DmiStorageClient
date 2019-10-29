<template>
  
  <div id="login-modal" class="modal bottom-sheet">
    <div class="modal-content">
      
          <div class="row">
            <form @submit.prevent="login" class="col s12">
                
                <div class="col s12 right-align">
                    <span class="z-depth-2">
                        <a class="modal-action modal-close dismiss-x grey-text">x</a>
                    </span>
                </div>

                <div class="row">
                    <div class="col s12">
                        <div class="card-panel z-depth-2">
                            <span class="card-panel-text-cloud red-text lighten-2-text">Cloud</span>
                            <i class="material-icons grey-text text-darken-2">security</i>
                            <span class="card-panel-text grey-text darken-2">Access</span>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="input-field col s12">
                    <i class="material-icons prefix">email</i>
                    <input required v-model="email" id="email-input" type="email" class="validate">
                    <label for="email-input">Inserisci la tua mail</label>
                </div>
                
                <div class="input-field col s12">
                    <i class="material-icons prefix">lock</i>
                    <input required v-model="password" id="password-input" type="password" minlength="6" class="validate">
                    <label for="password-input">Inserisci la tua password</label>
                </div>

                <div class="input-field col s12 center align">
                    <button v-if="!loading" type="submit" class="btn-floating btn-large waves-effect waves-light teal">
                        <i class="material-icons">send</i>
                    </button>
                    <button v-else class="btn-floating btn-large waves-effect waves-light teal pulse">
                        <i class="material-icons">hourglass_empty</i>
                    </button>
                </div>                



                <div class="left align">
                    <p class="auth-span"><i class="material-icons text-icon">edit</i> Non sei ancora registrato? <a  href="#" @click="openSignupModal()">Registrati</a></p>
                    <p class="auth-span"><i class="material-icons text-icon">vpn_key</i> Hai dimenticato la password? <a href="#" @click="openForgotModal()">Recuperala qui</a> </p>                    
                </div>

            </form>
        </div>

    </div>
  </div>

</template>

<script>
import { RepoFactory }  from '@/repositories/RepoFactory'
import errorMixin       from '@/mixins/errorMixin'

const UserRepo = RepoFactory.get('users')

export default {
    name: "Login",
    data: function() {
        return {
            email: '', 
            password: '', 
        };
    },
    mixins: [
        errorMixin
    ], 
    computed: {

        loading: function() {
            return this.$store.getters.getAuthStatus == 'loading'
        }, 

        userToken: function() {
            return this.$store.getters.getUserToken
        }, 

        userRole: function() {
            return this.$store.getters.getUserRole
        }, 

        userId: function() {
           return this.$store.getters.getUserId 
        }, 

    }, 
    methods: {
     
        login: function() {
            let credentials = {
                email: this.email, 
                password: this.password
            }
            this.$store.dispatch('loginRequest', credentials)
            .then(result => { 
                if (this.userRole == 1) this.fetchPermissions()
                M.Modal.getInstance(document.getElementById('login-modal')).close();
                M.toast({html: "Bentornato " + result.data.name, displayLength: 5000, classes: "green"})                
            })
            .catch(error => {
                this.showError(error)
            });
        }, 

        openSignupModal: function() {
            M.Modal.getInstance(document.getElementById('login-modal')).close();
            M.Modal.getInstance(document.getElementById('signup-modal')).open();
        }, 

        openForgotModal: function() {
            M.Modal.getInstance(document.getElementById('login-modal')).close();
            M.Modal.getInstance(document.getElementById('forgot-modal')).open();
        }, 

        fetchPermissions: function() {
            let data = { id: this.userId, token: this.userToken }            
            this.$store.dispatch('getUserPermissions', data)
            .catch(error => this.showError(error))
        }

    }
}
</script>

<style scoped>

    .modal.bottom-sheet {
        margin: auto; 
        max-width: 100% !important;
        max-height: 100% !important;

        width: 60% !important;
        height: 65% !important;
    }

    @media screen and (max-width: 1200px) {
        .modal.bottom-sheet {
            width: 90% !important;
            height: 65% !important;
        }
    }

    @media screen and (max-width: 600px) {
        .modal.bottom-sheet {
            height: 92% !important;
            width: 100% !important; 
        }
    }

    .card-panel {
        padding: 5px !important; 
        text-align: center; 
    }

    .card-panel-text {
        font-size: 25px;
        font-weight: 400; 
    }

    .card-panel-text-cloud {
        font-size: 25px;
        font-weight: 400; 
    }

    .auth-span {
        border-radius: 5px 5px 5px 5px; 
        text-align: left;
        margin-left: 20px;  
    }

    .text-icon{
        display: inline-flex;
        vertical-align: top;
    }

    .dismiss-x {
        font-size: 18px; 
        padding: 5px;
    }

</style>