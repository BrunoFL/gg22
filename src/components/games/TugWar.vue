<template>
<div>
  <div id="race" v-if="!isRankingOpen" class="row justify-content-center gap-3">
    <div id="rules">
      {{rulesRun}}
    </div>
    <b-button type="button" variant="warning" class="mx-auto" style="width: 33%;" v-on:click="increment">TIREZ !</b-button>
  </div>
  <GameRanking v-if="isRankingOpen" :rankingList="rankingList" @swapScreen="event => swapScreen(event)"></GameRanking>
</div>
</template>

<script>
import GameRanking from "@/components/app/ranking/GameRanking";

export default {
  name: "TugWar",
  data(){
    return{
      rulesRun: '',
      clients: [],
      isRankingOpen: false,
      rankingList: []
    }
  },
  components: {
    GameRanking,
  },
  methods: {
    increment(){
      this.$socket.client.emit("touch", Date.getTime())
    },
    swapScreen(event) {
      this.$emit('swapScreen', event)
    }
  },
  sockets: {
    tugStart(){

    },    
    tugEnd(){

    },
    rules(rules){
      this.rulesRun = rules
    },
    leaderBoardGame(event) {
      this.isRankingOpen = true
      this.rankingList = event
    }
  }
}
</script>

<style scoped>

</style>
