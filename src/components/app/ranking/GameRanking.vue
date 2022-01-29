<template>
  <div id="playerRankingList">
    <!-- BLOC GAMES LIST -->
    <div v-if="displayWinners" id="displayWinners">
      <h1>Gagnant</h1>
      <b-row>
        <b-col cols="12" class="mt-3">
          <img id="first" src="@/assets/img/first.png" alt="anvil">
          <p>{{getFirst()}}</p>
        </b-col>
        <b-col>
          <img id="second" src="@/assets/img/second.png" alt="anvil">
          <p>{{getSecond()}}</p>
        </b-col>
        <b-col>
          <img id="third" src="@/assets/img/third.png" alt="anvil">
          <p>{{getThird()}}</p>
        </b-col>
      </b-row>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item variant="secondary" v-for="playerState of otherRanking" :key="playerState">
          {{playerState.player.name}}
        </b-list-group-item>
      </b-list-group>
    </div>
    <div v-if="displayGeneral" id="displayGeneral">
      <h1>Classement général</h1>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item variant="secondary" v-for="(player, index) of generalRank" :key="index">
          {{(index + 1) + ' - ' + player.name + ' ' + player.score + 'pts'}}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: "GameRanking",
  props: {
    rankingList: Array,
  },
  data(){
    return {
      first: '',
      second: '',
      third: '',
      displayWinners: true,
      displayGeneral: false,
      otherRanking: [],
      generalRank: []
    }
  },
  watch: { 
  },
  methods: {
    getFirst(){
      if(this.rankingList[0]) {
        let firstData = this.rankingList.filter(function(player) { return player.position === 0; });
        if(firstData[0])
          return this.first = firstData[0].player.name
      }
    },    
    getSecond(){
      if(this.rankingList[0]) {
        let secondData = this.rankingList.filter(function(player) { return player.position === 1; });
        if(secondData[0])
          return this.second = secondData[0].player.name
      }
    }, 
    getThird(){
      if(this.rankingList[0]) {
        let thirdData = this.rankingList.filter(function(player) { return player.position === 2; });
        if(thirdData[0])
          return this.third = thirdData[0].player.name
      }
    },    
    getOther(){
      if(this.rankingList[0]) {
        let thirdData = this.rankingList.filter(function(player) { return (player.position != 2 || player.position === 1 || player.position === 0); });
        if(thirdData)
          return this.otherRanking = thirdData
      }
    }
  },
  sockets: {
    leaderBoardGeneral(event) {
      this.generalRank = event
      this.displayWinners = false
      this.displayGeneral = true
    },
    listGames(listGames) {
        this.$emit('swapScreen', listGames)
    }
  }
}
</script>

<style scoped>
#first {
  width: 10%;
}
#second {
  width: 20%;
}
#third {
  width: 20%;
}
</style>
