<template>
  <div>
    <div id="race" v-if="!isRankingOpen" class="row justify-content-center gap-3">
      <h1>Tir à la corde</h1>
      <p class="m-3" size="lg" style="background-color: white; font-size: 200%">{{ rules }}</p>
    </div>
    <div v-if="!isRankingOpen">
      <b-form-input id="range" disabled v-model="center" type="range" min="-30" max="30"></b-form-input>
    </div>
    <div v-if="!isRankingOpen" class="m-5" style="font-size: 150%">
        <div style="float: left;">{{ teamAName }}<br>
          <b-list-group class="mx-auto" style="width: 100%;">
            <b-list-group-item v-for="player of teamA" :key="player.id">{{ player.name }}</b-list-group-item>
          </b-list-group>
        </div>
        <div style="float: right;">{{ teamBName }}<br>
          <b-list-group class="mx-auto" style="width: 100%;">
            <b-list-group-item v-for="player of teamB" :key="player.id">{{ player.name }}</b-list-group-item>
          </b-list-group>
        </div>
    </div>
    <b-button v-if="!isRankingOpen" type="button" class="mx-auto" style="width: 33%; background: rgb(25, 135, 84); color: white;" :disabled="!start" v-on:click="increment">TIREZ !</b-button>
    <GameRanking v-if="isRankingOpen" :rankingList="rankingList" :isTeamGame=true @swapScreen="event => swapScreen(event)"></GameRanking>
  </div>
</template>

<script>
import GameRanking from '@/components/app/ranking/GameRanking'

export default {
  name: 'TugWar',
  data() {
    return {
      rules: '',
      rulesRun: '',
      clients: [],
      isRankingOpen: false,
      rankingList: [],
      teamA: [],
      teamAName: '',
      teamB: [],
      teamBName: '',
      center: 0,
      start: false
    }
  },
  components: {
    GameRanking,
  },
  methods: {
    increment(){
      this.$socket.client.emit("touch", new Date().getTime())
    },
    swapScreen(event) {
      this.$emit('swapScreen', event)
    }
  },
  sockets: {
    tugStart() {
      this.start = true
    },
    tugEnd() {

    },
    tugInit(data) {
      this.teamA = data.teamA.players
      this.teamAName = data.teamA.name
      this.teamB = data.teamB.players
      this.teamBName = data.teamB.name
    },
    tug(result){
      this.center = result
    },
    rules(rules) {
      this.rules = rules
    },
    leaderBoardGame(event) {
      this.isRankingOpen = true
      this.rankingList = event
    }
  }
}
</script>

<style scoped>
input[type=range] {
  -webkit-appearance: none;
  width: 75%;   
  font: inherit;
  background: rgba(255, 255, 255, 0);
  transition: opacity .2s;
}
input[type=range]::-webkit-slider-runnable-track {
  height: 100%;
  background-color: rgb(99, 34, 9);  
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2em;
  height: 2em;
  border-radius: 100%;
  background: rgb(25, 135, 84);       /* pris en compte sur Webkit only */
}
</style>
