<template>
  <div id="playerRankingList">
    <!-- BLOC GAMES LIST -->
    <div v-if="displayWinners && !isTeamGame" id="displayWinners">
      <h1>Gagnant</h1>
      <div class="row">
        <div class="row mt-3">
          <img class="mx-auto" id="first" src="@/assets/img/p1.png" />
          <h3>{{ getFirst(isTeamGame) }}</h3>
        </div>
        <div class="d-flex mt-5">
          <div class="d-flex flex-row w-50">
            <div class="row">
              <img id="second" class="mx-auto" src="@/assets/img/p2.png" />
              <h3>{{ getSecond(isTeamGame) }}</h3>
            </div>
          </div>
          <div class="d-flex flex-row-reverse mt-5 w-50">
            <div class="row">
              <img class="mx-auto" id="third" src="@/assets/img/p3.png" />
              <h3>{{ getThird() }}</h3>
            </div>
          </div>
        </div>
      </div>
      <br />
      <ul class="mx-auto list-group" style="col-sm-10 col-md-8 col-lg-6">
        <li
          class="list-group-item list-group-item-secondary"
          v-for="playerState of otherRanking"
          :key="playerState"
        >
          {{ playerState.player.name }}
        </li>
      </ul>
    </div>

    <div v-if="displayWinners && isTeamGame" id="displayTeamWinner">
      <h1>Gagnant</h1>
      <div class="row">
        <div class="col-lg col-sm-12">
          <img src="@/assets/img/p1.png" style="max-width: 200px" />
          <h3>{{ getFirst(isTeamGame) }}</h3>
        </div>
        <div class="col-lg col-sm-12">
          <img src="@/assets/img/p2.png" style="max-width: 200px" />
          <h3>{{ getSecond(isTeamGame) }}</h3>
        </div>
      </div>
    </div>

    <div v-if="displayGeneral" id="displayGeneral">
      <h1>Classement général</h1>
      <ul class="mx-auto list-group" style="w-50">
        <li
          class="list-group-item list-group-item-secondary"
          style="font-size: 125%"
          v-for="(player, index) of generalRank"
          :key="index"
        >
          <div v-if="index + 1 != 1" class="fw-bold" style="float: left">
            {{ index + 1 + "e" }}
          </div>
          <div v-if="index + 1 === 1" class="fw-bold" style="float: left">
            {{ index + 1 + "er" }}
          </div>
          <span class="fw-bold">{{ player.name }}</span>
          <div class="fw-bold" style="float: right">{{ player.score + "pts" }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameRanking",
  props: {
    rankingList: Array,
    isTeamGame: Boolean,
  },
  data() {
    return {
      first: "",
      second: "",
      third: "",
      displayWinners: true,
      displayGeneral: false,
      otherRanking: [],
      generalRank: [],
    };
  },
  watch: {},
  methods: {
    getFirst(isTeamGame) {
      this.getOther();
      if (this.rankingList[0]) {
        if (!isTeamGame) {
          let firstData = this.rankingList.filter(function (player) {
            return player.position === 0;
          });
          if (firstData[0]) return (this.first = firstData[0].player.name);
        } else {
          let firstData = this.rankingList.filter(function (team) {
            return team.win === true;
          });
          if (firstData[0]) return (this.first = firstData[0].team.name);
        }
      }
    },
    getSecond(isTeamGame) {
      if (this.rankingList[0]) {
        if (!isTeamGame) {
          let secondData = this.rankingList.filter(function (player) {
            return player.position === 1;
          });
          if (secondData[0]) return (this.second = secondData[0].player.name);
        } else {
          let secondData = this.rankingList.filter(function (team) {
            return team.win === false;
          });
          if (secondData[0]) return (this.first = secondData[0].team.name);
        }
      }
    },
    getThird() {
      if (this.rankingList[0]) {
        let thirdData = this.rankingList.filter(function (player) {
          return player.position === 2;
        });
        if (thirdData[0]) return (this.third = thirdData[0].player.name);
      }
    },
    getOther() {
      if (this.rankingList[0]) {
        let thirdData = this.rankingList.filter(function (player) {
          return player.position > 2;
        });
        if (thirdData) return (this.otherRanking = thirdData);
      }
    },
  },
  sockets: {
    leaderBoardGeneral(event) {
      this.generalRank = event;
      this.displayWinners = false;
      this.displayGeneral = true;
    },
    listGames(listGames) {
      this.$emit("swapScreen", listGames);
    },
  },
};
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
