<template>
  <div class="container-fluid" id="app">
    <Lobby v-if="isInLobby" @swapScreen="event => swapScreen(event)"></Lobby>
    <Games v-if="isInGamesList" @swapToGames="swapToGames()" :listGames="listGames"></Games>
    <Anvil v-if="isInAnvilGame"></Anvil>
    <GameRanking v-if="false"></GameRanking>
    <Footer></Footer>
  </div>
</template>

<script>
import Lobby from "@/components/app/lobby/Lobby";
import Games from "@/components/app/games/Games";
import GameRanking from "@/components/app/ranking/GameRanking";
import Footer from "@/components/app/footer/Footer";
import Anvil from "@/components/games/Anvil"

export default {
  name: 'App',
    data(){
    return {
      isInLobby: true,
      isInGamesList: false,
      isInAnvilGame: false,
      listGames: []
    }
  },
  components: {
    Lobby,
    Games,
    GameRanking,
    Footer,
    Anvil
  },
  methods: {
    swapScreen(listGames) {
        this.isInLobby = false,
        this.isInGamesList = true
        this.listGames = listGames
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
