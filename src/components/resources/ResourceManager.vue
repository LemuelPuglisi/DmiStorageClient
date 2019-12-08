<template>
    <div class="cloud container" style="padding:10px">

        <div class="row">
            <div class="col s12">
                <h4>Gestione delle risorse</h4>
                <p>
                    In questa sezione potrai caricare file nel cloud ed avere accesso diretto alle tue risorse.  
                </p>
                <div class="divider"></div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "ResourceManager", 
    computed: {

    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },

    getUserRole: function() {
      return this.$store.getters.getUserRole || 0;
    }

  },
  watch: {

    isLoggedIn: function(newValue) {
      if (!newValue) {
        this.$router.push({ path: "/" });
      }
    }

  }
}
</script>

<style scoped>

    .cloud {
        margin-top: 20px;
        background-color: white;
    }

    .title {
      margin-left: 10px; 
      font-size: 25px; 
      font-weight: bold; 
    }

    .container {
      max-width: 100% !important;
      width: 90% !important; 
    }

</style>