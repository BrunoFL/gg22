<template>
  <div class="container-fluid" id="app">
    <Lobby v-if="isInLobby" @swapScreen="swapScreen()"></Lobby>
    <Games v-if="isInGamesList" @swapToGames="swapToGames()"></Games>
    <Anvil v-if="isInAnvilGame"></Anvil>
    <Footer></Footer>
  </div>
</template>

<script>
import Lobby from "@/components/app/lobby/Lobby";
import Games from "@/components/app/games/Games";
import Footer from "@/components/app/footer/Footer";
import Anvil from "@/components/games/Anvil"

export default {
  name: 'App',
    data(){
    return {
      isInLobby: true,
      isInGamesList: false,
      isInAnvilGame: false
    }
  },
  components: {
    Lobby,
    Games,
    Footer,
    Anvil
  },
  methods: {
    swapScreen() {
        this.isInLobby = false,
        this.isInGamesList = true
    },    
    swapToGames() {
        this.isInLobby = false,
        this.isInGamesList = false,
        this.isInAnvilGame = true
    }
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
