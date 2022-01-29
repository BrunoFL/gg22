<template>
<div>
  <div id="race" v-if="!isRankingOpen" class="row justify-content-center gap-3">
    <div id="rules">
      {{rulesRun}}
    </div>
    <div class="group row align-items-start" v-for="player of run" :key="player.id">
      <div class="row">
        <span class="col-1" v-if="isMyId(player.player.socketId)">YOU</span>
      </div>
      <b-progress :value="player.meter" :max="max" show-progress animated></b-progress>
    </div>
    <b-button type="button" class="btn btn-outline-primary" v-on:click="increment">
      RUN
    </b-button>
    {{run}}
  </div>
  <GameRanking v-if="isRankingOpen" :rankingList="rankingList"></GameRanking>
</div>
</template>

<script>
import GameRanking from "@/components/app/ranking/GameRanking";

export default {
  name: "HundredMetersClick",
  data(){
    return{
      value: 0,
      max: 100,
      rulesRun: '',
      clients: [],
      run: '',
      isRankingOpen: false,
      rankingList: []
    }
  },
  components: {
    GameRanking,
  },
  methods: {
    increment(){
      this.$socket.client.emit("touch")
    },
    isMyId(id){
      return id === this.$socket.client.id;
    }
  },
  sockets: {
    updateRun(data){
      data.sort((a, b) => {
        return b.meter - a.meter;
      });
      this.run = data;
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
