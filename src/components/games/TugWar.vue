<template>
  <div>
    <div id="race" v-if="!isRankingOpen" class="row justify-content-center gap-3">
      <h1>Tir à la corde</h1>
      <div class="m-3 alert alert-light" style="background-color: white; font-size: 200%">
        {{ rules }}
      </div>
    </div>

    <div v-if="!isRankingOpen">
      <input
        id="range"
        disabled
        v-model="center"
        type="range"
        min="-30"
        class="form-range"
        max="30"
      />
    </div>

    <button
      type="button"
      v-if="!isRankingOpen"
      class="btn btn-primary mx-auto w-50 mt-5"
      :disabled="!started"
      v-on:click="increment"
    >
      TIRER !
    </button>

    <div v-if="!isRankingOpen" class="row mt-5 p-3" style="font-size: 150%">
      <div class="col">
        <h2 class="mx-auto">{{ teamAName }}</h2>
        <ul class="mx-auto w-75 list-group">
          <li class="list-group-item" v-for="player of teamA" :key="player.id">
            {{ player.name }}
          </li>
        </ul>
      </div>

      <div class="col">
        <h2 class="mx-auto">{{ teamAName }}</h2>
        <ul class="mx-auto w-75 list-group">
          <li class="list-group-item" v-for="player of teamB" :key="player.id">
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>

    <GameRanking
      v-if="isRankingOpen"
      :rankingList="rankingList"
      :isTeamGame="true"
      @swapScreen="(event) => swapScreen(event)"
    ></GameRanking>
  </div>
</template>

<script>
import GameRanking from "@/components/app/ranking/GameRanking";

export default {
  name: "TugWar",
  data() {
    return {
      rules: "",
      rulesRun: "",
      clients: [],
      isRankingOpen: false,
      rankingList: [],
      teamA: [],
      teamAName: "",
      teamB: [],
      teamBName: "",
      center: 0,
      started: false,
    };
  },
  components: {
    GameRanking,
  },
  methods: {
    increment() {
      this.$socket.client.emit("touch", new Date().getTime());
    },
    swapScreen(event) {
      this.$emit("swapScreen", event);
    },
  },
  sockets: {
    tugInit(data) {
      this.teamA = data.teamA.players;
      this.teamAName = data.teamA.name;
      this.teamB = data.teamB.players;
      this.teamBName = data.teamB.name;
    },
    tug(result) {
      this.center = result;
    },
    rules(rules) {
      this.rules = rules;
    },
    leaderBoardGame(event) {
      this.isRankingOpen = true;
      this.rankingList = event;
    },
    startGame() {
      this.started = true;
    },
  },
};
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  width: 75%;
  font: inherit;
  background: rgba(255, 255, 255, 0);
  transition: opacity 0.2s;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 100%;
  background-color: rgb(211, 208, 35);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2em;
  height: 2em;
  border-radius: 100%;
  background: red; /* pris en compte sur Webkit only */
}
</style>
