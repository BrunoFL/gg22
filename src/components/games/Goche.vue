<template>
  <div>
    <h1>Gôche ou Droate</h1>
    {{ rules }}
    <h2>{{proposition.name}}</h2>
    <div class="row">
      <div class="col-6">
        <b-button v-on:click="jeSuisGocho()">Gôche</b-button>
      </div>
      <div class="col-6">
        <b-button v-on:click="QUANDLEPARCFLORAL()">Droate</b-button>
      </div>
    </div>
    <GameRanking v-if="isRankingOpen" :rankingList="rankingList" @swapScreen="event => swapScreen(event)"></GameRanking>
  </div>
</template>

<script>
export default {
  name: "Goche",
  data(){
    return {
      rules: '',
      isRankingOpen: false,
      proposition: '',
      rankingList: []
    }
  },
  methods: {
    jeSuisGocho(){
      this.$socket.client.emit('touch',0);
    },
    QUANDLEPARCFLORAL(){
      this.$socket.client.emit('touch',1);
    },
    swapScreen(event) {
      this.$emit('swapScreen', event)
    }
  },
  sockets: {
    rules(rules){
      this.rules = rules;
    },
    leaderBoardGame(event){
      this.isRankingOpen = true
      this.rankingList = event
    },
    question(proposition){
      this.proposition = proposition
    }
  }
}
</script>

<style scoped>

</style>
