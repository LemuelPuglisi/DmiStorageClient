<template>
    <div class="card horizontal left-align">

        <div class="card-image hide-on-small-only">
            <img class="responsive" src="@/assets/media/reset-background.gif" alt="">
        </div>

        <div class="card-stacked">
            <div class="card-content">
                <span class="card-title center-align">Reimposta la tua password</span>
                <div class="row space">

                    <div class="disclaimer">
                        <div class="divider"></div>
                        <div class="center-align space grey-text">
                            Se non hai eseguito nessuna richiesta di reimpostazione, sarai caduto nell' <a href="https://www.youtube.com/watch?v=m9uRj9fV-i4">inganno della cadrega</a>
                        </div>
                        <div class="divider"></div>
                    </div>

                    <form @submit.prevent="resetPassword">

                        <div class="input-field">
                            <i class="material-icons prefix">email</i>
                            <input required v-model="email" type="email" id="reset-email" class="validate">
                            <label for="reset-email">Inserisci il tuo indirizzo email</label>
                        </div>

                        <div class="input-field">
                            <i class="material-icons prefix">lock_outline</i>
                            <input required v-model="password" id="password-reset-form" type="password" minlength="6" />
                            <label for="password-reset-form">Inserisci una nuova password</label>
                        </div>

                        <div class="input-field">
                            <i class="material-icons prefix">lock_outline</i>
                            <input required v-model="confirmPassword" id="password-reset-conf" type="password" minlength="6" />
                            <label for="password-reset-conf">Ripeti la password</label>
                        </div>

                        <div class="input-field center-align">
                            <button v-if="!loading" class="btn waves-effect waves-light" type="submit" name="action">Reimposta</button>
                            <button v-else class="btn waves-effect waves-light pulse" type="button" name="loader">Reimposta</button>    
                        </div>

                    </form>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import errorMixin       from '@/mixins/errorMixin'
import { RepoFactory }  from '@/repositories/RepoFactory'

const AuthRepo = RepoFactory.get('auth')

export default {
    name: "ResetForm", 
    props: [
        "code"
    ],
    mixins: [
        errorMixin
    ], 
    data: function() {
        return {
            email: '', 
            password: '', 
            confirmPassword: '', 
            loading: false,
        }
    }, 
    computed: {
        passwordMatch: function() {
            return this.password == this.confirmPassword
        }
    }, 
    methods: {  
        resetPassword: function() {
            if (this.password.length < 6) {
                return M.toast({html:"La password è troppo corta", classes:"red"})
            }
            if (!this.passwordMatch) {
                return M.toast({html:"Le password non combaciano", classes:"red"})
            }
            this.loading = true
            AuthRepo.reset({
                email: this.email, 
                token: this.code, 
                password: this.password, 
                confirm: this.confirmPassword
            })
            .then(() => {
                this.loading = false
                M.toast({html:"La password è stata reimpostata con successo.", classes:"green"})
                this.$router.push({path: "/"})
            })
            .catch(error => {
                this.loading = false
                this.showError(error)
            })
        }
    }
}
</script>

<style scoped>

    .space {
        padding: 5px; 
    }

    .disclaimer {
        margin-top: 10px;
        margin-bottom: 40px; 
    }

</style>