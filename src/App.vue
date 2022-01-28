<template>
  <div class="container-fluid" id="app">
    <Lobby></Lobby>
    <Footer></Footer>
  </div>
</template>

<script>
import Lobby from "@/components/app/lobby/Lobby";
import Footer from "@/components/app/footer/Footer";

export default {
  name: 'App',
  components: {
    Lobby,
    Footer
  },
  sockets: {
    connect() {
      console.log('socket connected')
    }
  }
}
</script>

<style>
body{
  height: 100%;
  background: rgb(238,174,202);
  background: linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
