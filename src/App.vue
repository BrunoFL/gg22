<template>
  <div class="container-fluid" id="app">
    <Lobby v-if="isInLobby" @sendLobbyToApp="event => getLobbyData(event)" @swapScreen="event => swapScreen(event)"></Lobby>
    <Games v-if="isInGamesList" :lobby="lobby"  @swapToGames="event => swapToGames(event)" :listGames="listGames"></Games>
    <Anvil v-if="isInAnvilGame" :lobby="lobby"  @swapScreen="event => swapScreenFromAnvil(event)"></Anvil>
    <GameRanking v-if="false"></GameRanking>
    <HundredMetersClick v-if="isInHundredMetersClic" @swapScreen="event => swapScreenFromHundred(event)"></HundredMetersClick>
    <TugWar v-if="isInTugWar" @swapScreen="event => swapScreenFromTug(event)"></TugWar>
    <Goche v-if="isInGoche" @swapScreen="event => swapScreenFromGoche(event)"></Goche>
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
import TugWar from "@/components/games/TugWar";
import Obstacle from "@/components/games/Obstacle";
import HundredMetersClick from "@/components/games/HundredMetersClick";
import Goche from "@/components/games/Goche"

export default {
  name: 'App',
    data(){
    return {
      isInLobby: true,
      isInGamesList: false,
      isInAnvilGame: false,
      isInObstacleRun: false,
      isInHundredMetersClic: false,
      isInTugWar: false,
      isInGoche: false,
      listGames: [],
      actualGame: '',
      lobby: Array
    }
  },
  components: {
    HundredMetersClick,
    Lobby,
    Games,
    GameRanking,
    Footer,
    Anvil,
    TugWar,
    Obstacle,
    Goche
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
    swapScreenFromHundred(listGames) {
        this.isInHundredMetersClic = false,
        this.isInGamesList = true
        this.listGames = listGames
    },     
    swapScreenFromTug(listGames) {
        this.isInTugWar = false
        this.isInGamesList = true
        this.listGames = listGames
    },
    swapScreenFromGoche(listGames){
      this.isInGoche = false
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
          case 'La guerre des tugs sans haches':
            this.isInTugWar = true
            break;
          case 'Gôche Droate':
            this.isInGoche = true
            break;
          default:
            break;
        }
    },
    getLobbyData(event){
      this.lobby = event;
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
  padding-top: 30px;
}
</style>
