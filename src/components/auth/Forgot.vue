<template>
    <div id="forgot-modal" class="modal bottom-sheet">
        <div class="modal-content">

            <div class="row">
                <form @submit.prevent="forgotPassword" class="col s12">
                    
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

                    <div class="col s12 center-align">
                        <div class="red lighten-2 instruction">
                            Invieremo un link di reset all'indirizzo da te indicato, con il quale potrai cambiare la password del tuo account.
                        </div>
                    </div>

                    <div class="input-field col s12">
                        <i class="material-icons prefix">email</i>
                        <input required v-model="email" id="email-forgot-input" type="email" class="validate" />
                        <label for="email-forgot-input">Inserisci il tuo indirizzo email</label>
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
                        <p class="auth-span">
                        <i class="material-icons text-icon">undo</i> Ricordi la password?
                        <a href="#" @click="openLoginModal()">Accedi</a>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    </div>

</template>

<script>
import errorMixin       from '@/mixins/errorMixin'
import { RepoFactory }  from '@/repositories/RepoFactory'

const AuthRepo = RepoFactory.get('auth')

export default {
    name: "Forgot", 
    mixins: [
        errorMixin
    ], 
    data: function() {
        return {
            email: '', 
            loading: false, 
        }
    }, 
    methods: {

        forgotPassword: function() {
            this.loading = true
            AuthRepo.forgot(this.email)
            .then(() => {
                this.openLoginModal()
                this.loading = false
                return M.toast({html: "Link di reset inviato all'indirizzo " + this.email, displayLength: 5000, classes: "green"}) 
            })
            .catch(error => {
                this.loading = false
                this.showError(error)
            })
        },
        
        openLoginModal: function() {
            M.Modal.getInstance(document.getElementById("forgot-modal")).close();
            M.Modal.getInstance(document.getElementById("login-modal")).open();
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
            height: 70% !important;
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

    .instruction {
        color: #ededed;
        font-size: 15px; 
        padding: 3px; 
        border-radius: 5px 5px 5px 5px; 
        margin-bottom: 20px;
    }

</style>