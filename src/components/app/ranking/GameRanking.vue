<template>
  <div id="playerRankingList">
    <!-- BLOC GAMES LIST -->
    <div v-if="displayWinners && !isTeamGame" id="displayWinners">
      <h1>Gagnant</h1>
      <b-row>
        <b-col cols="12" class="mt-3">
          <img id="first" src="@/assets/img/p1.png">
          <h3>{{ getFirst(isTeamGame) }}</h3>
        </b-col>
        <b-col>
          <img id="second" src="@/assets/img/p2.png">
          <h3>{{ getSecond(isTeamGame) }}</h3>
        </b-col>
        <b-col>
          <img id="third" src="@/assets/img/p3.png">
          <h3>{{ getThird() }}</h3>
        </b-col>
      </b-row>
      <br>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item variant="secondary" v-for="playerState of otherRanking" :key="playerState">
          {{ playerState.player.name }}
        </b-list-group-item>
      </b-list-group>
    </div>
    <div v-if="displayWinners && isTeamGame" id="displayTeamWinner">
        <h1>Gagnant</h1>
        <div>
          <img style="width: 17%;" src="@/assets/img/p1.png">
          <h3>{{ getFirst(isTeamGame) }}</h3>
        </div>
        <div>
          <img style="width: 15%;" src="@/assets/img/p2.png">
          <h3>{{ getSecond(isTeamGame) }}</h3>
        </div>
        
    </div>
    <div v-if="displayGeneral" id="displayGeneral">
      <h1>Classement général</h1>
      <b-list-group class="mx-auto" style="width: 50%;">
        <b-list-group-item style="font-size: 125%" variant="secondary" v-for="(player, index) of generalRank" :key="index">
          <div v-if="(index + 1) != 1" style="float: left; font-weight: bold">{{ (index + 1) + 'e' }}</div>
          <div v-if="((index + 1) === 1)" style="float: left; font-weight: bold">{{ (index + 1) + 'er' }}</div>
          <span style="font-weight: bold">{{ player.name}}</span>
          <div style="float: right; font-weight: bold">{{ player.score + 'pts' }}</div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GameRanking',
  props: {
    rankingList: Array,
    isTeamGame: Boolean
  },
  data() {
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
    getFirst(isTeamGame) {
      this.getOther()
      if (this.rankingList[0]) {
        if(!isTeamGame){
          let firstData = this.rankingList.filter(function (player) {
            return player.position === 0
          })
          if (firstData[0])
            return this.first = firstData[0].player.name
        } else {
          let firstData = this.rankingList.filter(function (team) {
            return team.win === true
          })
          if (firstData[0])
            return this.first = firstData[0].team.name
        }
      }
    },
    getSecond(isTeamGame) {
      if (this.rankingList[0]) {
        if(!isTeamGame){
          let secondData = this.rankingList.filter(function (player) {
            return player.position === 1
          })
          if (secondData[0])
            return this.second = secondData[0].player.name
        } else {
          let secondData = this.rankingList.filter(function (team) {
            return team.win === false
          })
          if (secondData[0])
            return this.first = secondData[0].team.name
        }
      }
    },
    getThird() {
      if (this.rankingList[0]) {
        let thirdData = this.rankingList.filter(function (player) {
          return player.position === 2
        })
        if (thirdData[0])
          return this.third = thirdData[0].player.name
      }
    },
    getOther() {
      if (this.rankingList[0]) {
        let thirdData = this.rankingList.filter(function (player) {
          return (player.position > 2)
        })
        if (thirdData)
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
