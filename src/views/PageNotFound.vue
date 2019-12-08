<template>
  <div class="PageNotFound">

        
    <div class="container">

      <div class="row">
        <div class="col s12 m8 offset-m2" style="margin-top:40px">
          <div class="card">
            <div class="center-align">
              <img class="responsive" src="@/assets/media/no-content.png" style="max-width: 400px;">
            </div>
            <div class="card-content center-align">
              <h5>404 | Pagina non trovata</h5>
              <br>
              <a class="waves-effect waves-light btn" @click="goHome()"><i class="material-icons left">home</i>Torna alla home</a>
            </div>
            <div class="card-content center-align">
              <p class="grey-text text-darken-1">
                Se apprezzi il progetto, lascia una stella su github! <br>
                <ul>
                  <li><a :href="serverUrl"><i class="material-icons fixed-icon">chevron_right</i>DmiStorageServer</a></li>
                  <li><a :href="clientUrl"><i class="material-icons fixed-icon">chevron_right</i>DmiStorageClient</a></li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
            
    </div>
          

  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
  data: function() {
    return {
      serverUrl: "https://github.com/LemuelPuglisi/DmiStorageServer", 
      clientUrl: "https://github.com/LemuelPuglisi/DmiStorageClient"
    }
  }, 
  methods: {

    goHome: function() {

      // init again all materialize comps.  
      window.location.href="/"; 
    
    }

  }
}
</script>

<style scoped>

  body {
    background-color: #F1F1F1;    
  }

  .fixed-icon {
    display: inline-flex;
    vertical-align: top;
    margin-right: 5px; 
  }

</style>