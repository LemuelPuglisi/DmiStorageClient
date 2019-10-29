<template>
  <div id="signup-modal" class="modal bottom-sheet">
    <div class="modal-content">
      <div class="row">

        <form class="col s12" @submit.prevent="signup">
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
            <i class="material-icons prefix">whatshot</i>
            <input required v-model="name" id="username-input" type="text" class="validate" />
            <label for="username-input">Inserisci un username</label>
          </div>

          <div class="input-field col s12">
            <i class="material-icons prefix">email</i>
            <input required v-model="email" id="email-signup-input" type="email" class="validate" />
            <label for="email-signup-input">Inserisci il tuo indirizzo email</label>
          </div>

          <div class="input-field col s10">
            <i class="material-icons prefix">lock_open</i>
            <input required v-model="password" id="password-signup-input" type="password" minlength="6" class="validate" />
            <label for="password-signup-input">Inserisci una password</label>
          </div>
          <div class="input-field col s2">
                <i v-if="!seePassword" @click="revertSeePsw()" class="material-icons clickable hoverable circle">visibility_off</i>
                <i v-else @click="revertSeePsw()" class="material-icons clickable hoverable circle">visibility</i>
          </div>


          <div class="input-field col s10">
            <i class="material-icons prefix">lock_outline</i>
            <input required v-model="confirmPassword" id="password-confirm-input" type="password" minlength="6" />
            <label for="password-confirm-input">Ripeti la password</label>
          </div>
          <div class="input-field col s2">
                <i v-if="!seeConfirmPassword" @click="revertSeeConfirmPsw()" class="material-icons clickable hoverable circle">visibility_off</i>
                <i v-else @click="revertSeeConfirmPsw()" class="material-icons clickable hoverable circle">visibility</i>
          </div>

          <div class="input-field col s12">
            <p><label><input required type="checkbox" id="accept-policy" v-model="acceptPolicy"/>
                    <span class="grey-text"><small>Dichiaro di aver letto e di accettare i <a href="">Termini di Servizio</a> e l' <a href="">informativa sulla Privacy</a> di DmiCloud</small></span>
            </label></p>
          </div>

          <div class="input-field col s12 center align">
            <button v-if="!loading" type="submit" class="btn-floating btn-large waves-effect waves-light teal">
              <i class="material-icons">save</i>
            </button>
            <button v-else class="btn-floating btn-large waves-effect waves-light teal pulse">
              <i class="material-icons">hourglass_empty</i>
            </button>
          </div>

          <div class="left align">
            <p class="auth-span">
              <i class="material-icons text-icon">undo</i> Sei già registrato?
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
  name: "Signup",
  mixins: [
    errorMixin
  ], 
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptPolicy: false, 
      seePassword: false, 
      seeConfirmPassword: false, 
      loading: false,
      prodCaptchaKey: process.env.VUE_APP_RECAPTCHA_PUBLIC_KEY
    };
  },
  computed: {
      passwordMatch: function() {
          return this.password == this.confirmPassword
      }
  },
  methods: {

    openLoginModal: function() {
      M.Modal.getInstance(document.getElementById("signup-modal")).close();
      M.Modal.getInstance(document.getElementById("login-modal")).open();
    }, 

    revertSeePsw: function() {
        this.seePassword = !this.seePassword; 
        if (this.seePassword) {
            document.getElementById('password-signup-input').type = "text"
        } else {
            document.getElementById('password-signup-input').type = "password"
        }
    }, 

    revertSeeConfirmPsw: function() {
        this.seeConfirmPassword = !this.seeConfirmPassword; 
        if (this.seeConfirmPassword) {
            document.getElementById('password-confirm-input').type = "text"
        } else {
            document.getElementById('password-confirm-input').type = "password"
        }
    }, 

    signup: function() {
        if (!this.passwordMatch) {
            return M.toast({html: "La password inserita non combacia con quella di conferma ", displayLength: 5000, classes: "red"}) 
        }
        if (!this.acceptPolicy) {
            return M.toast({html: "Per completare la registrazione, accetta i Termini di Servizio e l'informativa sulla Privacy", displayLength: 5000, classes: "red"}) 
        } 
        this.loading = true;
        AuthRepo.create({
            name: this.name, 
            email: this.email, 
            password: this.password
        })
        .then(() => {
            this.openLoginModal(); 
            this.loading = false; 
            return M.toast({html: "La registrazione è andata a buon fine, accedi!", displayLength: 5000, classes: "green"}) 
        })
        .catch(error => {
            this.loading = false;
            this.showError(error)
        })
    }

  }
};
</script>

<style scoped>

  .modal.bottom-sheet {
    margin: auto;
    max-width: 100% !important;
    max-height: 100% !important;

    width: 60% !important;
    height: 85% !important;
  }

  @media screen and (max-width: 1200px) {
    .modal.bottom-sheet {
      width: 90% !important;
      height: 85% !important;
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

  .text-icon {
    display: inline-flex;
    vertical-align: top;
  }

  .dismiss-x {
    font-size: 18px;
    padding: 5px;
  }

  .clickable {
      cursor: pointer;
  }

</style>