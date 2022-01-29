<template>
  <div id="playerRankingList">
    <!-- BLOC GAMES LIST -->
    <div id="displayWinners">
      <h1>Gagnant</h1>
      <b-row>
        <b-col cols="12" class="mt-3">
          <img id="first" src="@/assets/img/first.png" alt="anvil">
          <p>MICHEL</p>
        </b-col>
        <b-col>
          <img id="second" src="@/assets/img/second.png" alt="anvil">
          <p>MICHEL</p>
        </b-col>
        <b-col>
          <img id="third" src="@/assets/img/third.png" alt="anvil">
          <p>MICHEL</p>
        </b-col>
      </b-row>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item variant="secondary" v-for="player of players" :key="player">
          {{player}}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: "GameRanking",
  data(){
    return {
        listRanking: [],
        players: ['Michou', 'Gislelle', 'Alphone'],
    }
  },
  watch: {

  },
  methods: {
  },
  sockets: {
    leaderBoardGame(data) {
      this.listRanking = data
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
