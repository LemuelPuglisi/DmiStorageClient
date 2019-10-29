<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
  @import   url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
  @import   './assets/css/animate.css'; 
  @import   './assets/css/hover.css'; 

  body {
    background-color: #F1F1F1;
    font-family: 'Roboto', sans-serif;
  }

  header, main, footer {
    padding-left: 300px;
  }

  @media only screen and (max-width : 992px) {
    header, main, footer {
      padding-left: 0;
    }
  }

  ::-webkit-scrollbar {
    width: 7px;  
    height: 7px; 
  }

  ::-webkit-scrollbar-track {
    background: #fbe9e7;
  }

  ::-webkit-scrollbar-thumb {
    background: bdbdbd; 
  }
      
</style>
