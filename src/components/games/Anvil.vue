<template>
  <div id="anvilContainer">
    <div v-if="!isRankingOpen" class="row justify-content-center gap-3">
      <h1>Enclume</h1>
      <p class="m-3" size="lg" style="background-color: white; font-size: 200%">{{rules}}</p>
      <div class="row">
        <div id="canvas" class="col-3" v-for="player of lobby.players" :key="player.id" v-on:click="stopAnvil()">
          <h2>{{player.name}}</h2>
          <div id="gameAnvil">
            <img id="anvil" src="@/assets/img/anvil.png" alt="anvil">
          </div>
          <div id="character">
            <img id="characterIMG" alt="poticha" src="@/assets/img/poticha.png"><br><br>
            <h2 v-if="alertPlayer !== '' && alertPlayer.player.name === player.name">{{alertPlayer.player.name}} a touché !</h2>
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

  #canvas{
    height: 600px;
    border: 2px solid black;
    border-radius: 10px;
  }

  #character{
    position: relative;
    top: 200px;
  }
  #characterIMG{
    width: 200px;
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
      top: 250px;
    }
  }
</style>
