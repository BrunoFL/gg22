<template>
  <div class="container-fluid" id="app">
    <Lobby v-if="isInLobby" @swapScreen="event => swapScreen(event)"></Lobby>
    <Games v-if="isInGamesList" @swapToGames="event => swapToGames(event)" :listGames="listGames"></Games>
    <Anvil v-if="isInAnvilGame"  @swapScreen="event => swapScreenFromAnvil(event)"></Anvil>
    <GameRanking v-if="false"></GameRanking>
    <HundredMetersClick v-if="isInHundredMetersClic"></HundredMetersClick>
    <Obstacle v-if="isInObstacleRun"></Obstacle>
    <Footer></Footer>
  </div>
</template>

<script>
import Lobby from "@/components/app/lobby/Lobby";
import Games from "@/components/app/games/Games";
import GameRanking from "@/components/app/ranking/GameRanking";
import Footer from "@/components/app/footer/Footer";
import Anvil from "@/components/games/Anvil";
import Obstacle from "@/components/games/Obstacle";
import HundredMetersClick from "@/components/games/HundredMetersClick";

export default {
  name: 'App',
    data(){
    return {
      isInLobby: true,
      isInGamesList: false,
      isInAnvilGame: false,
      isInObstacleRun: false,
      isInHundredMetersClic: false,
      listGames: [],
      actualGame: '',
    }
  },
  components: {
    HundredMetersClick,
    Lobby,
    Games,
    GameRanking,
    Footer,
    Anvil,
    Obstacle
  },
  methods: {
    swapScreen(listGames) {
        this.isInLobby = false,
        this.isInGamesList = true
        this.listGames = listGames
    },    
    swapScreenFromAnvil(listGames) {
        this.isInAnvilGame = false,
        this.isInGamesList = true
        this.listGames = listGames
    },    
    swapToGames(event) {
        this.isInLobby = false
        this.isInGamesList = false
        switch (event) {
          case 'Enclume':
            this.isInAnvilGame = true
            break;
          case '100 mètre clic':
            this.isInHundredMetersClic = true
            break;
          case 'Course d\'obstacle':
            this.isInObstacleRun = true
            break;
          default:
            break;
        }
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
