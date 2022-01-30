<template>
  <div>
    <audio autoplay controls loop>
      <source src="@/assets/sound/droate_goche.mp3">
    </audio>
    <div v-if="!isRankingOpen">
      <h1>Gôche ou Droate</h1>
      <p class="m-3" size="lg" style="background-color: white; font-size: 200%">{{ rules }}</p>
      <h2>{{proposition.name}}</h2>
      <div class="row m-5">
        <div class="col-sm-4 offset-sm-2">
          <b-button class="btn-lg w-100" v-on:click="jeSuisGocho()">Gôche</b-button>
        </div>
        <div class="col-sm-4">
          <b-button class="btn-lg w-100" v-on:click="QUANDLEPARCFLORAL()">Droate</b-button>
        </div>
      </div>
    </div>
      <GameRanking v-if="isRankingOpen" :rankingList="rankingList" @swapScreen="event => swapScreen(event)"></GameRanking>
  </div>
</template>

<script>
import GameRanking from '@/components/app/ranking/GameRanking'
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
  components: {
    GameRanking
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
