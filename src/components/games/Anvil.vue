<template>
  <div id="anvilContainer">
    <div v-if="!isRankingOpen" v-on:click="stopAnvil()">
      <p class="m-3" size="lg" style="background-color: white; font-size: 200%">{{rules}}</p>
      <p>{{lobby}}</p>
      <div class="row">
        <div class="col-3" v-for="player of lobby.players" :key="player.id">
          <p v-if="alertPlayer !== '' && alertPlayer.player.name === player.name">{{alertPlayer.player.name}} a touché !</p>
          <div id="gameAnvil">
            <img id="anvil" src="@/assets/img/anvil.png" alt="anvil">
          </div>
          <div id="character">
            <img id="characterIMG" alt="giscard" src="@/assets/perso.jpeg">
          </div>
        </div>
      </div>
    </div>
    <GameRanking v-if="isRankingOpen" :rankingList="rankingList"  @swapScreen="event => swapScreen(event)"></GameRanking>
  </div>
</template>

<script>
import GameRanking from "@/components/app/ranking/GameRanking";

export default {
  name: "Anvil",
  props: {
    lobby: Array
  },
  data(){
    return {
      rules: '',
      fallDuration: '',
      duration: 0,
      anvilState: 'paused',
      startTime: '',
      touchTime: '',
      delta: '',
      alertPlayer: '',
      isRankingOpen: false,
      rankingList: []
    }
  },
  components: {
    GameRanking,
  },
  methods: {
    stopAnvil(){
      this.anvilState = 'paused'
      this.touchTime = new Date().getTime()
      this.delta = (this.startTime + (this.duration * 1000) - this.touchTime)
      this.$socket.client.emit('touch',this.delta)
    },
    swapScreen(event) {
      this.$emit('swapScreen', event)
    }
  },
  sockets: {
    rules(rules){
      console.log('rules')
      this.rules = rules;
    },
    startEnclume(duration){
      this.startTime = new Date().getTime()
      this.duration = duration
      this.fallDuration = this.duration+'s'
      this.anvilState = 'running'
      console.log(this.anvilState)
    },
    playerTouch(data){
      this.alertPlayer = data
    },
    leaderBoardGame(event) {
      this.isRankingOpen = true
      this.rankingList = event
    }
  }
}
</script>

<style scoped>
  #gameAnvil{
    animation-name: anvilGoesBRRRR;
    position: relative;
    animation-duration: v-bind(fallDuration);
    animation-play-state: v-bind(anvilState);
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    visibility: hidden;
  }

  #character{
    position: relative;
    top: 200px;
  }
  #characterIMG{
    width: 150px;
  }

  #anvil{
    width: 150px;
  }

  @keyframes anvilGoesBRRRR {
    0% {
      top: 0px;
      visibility: visible;
    }
    99%{
      visibility: visible;
    }
    100% {
      top: 200px;
    }
  }
</style>
