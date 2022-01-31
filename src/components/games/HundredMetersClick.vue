<template>
  <div>
    <audio autoplay controls loop>
      <source src="@/assets/sound/course_clic.mp3" />
    </audio>
    <div id="race" v-if="!isRankingOpen" class="row justify-content-center gap-3">
      <h1>100m clic</h1>
      <div class="m-3 alert alert-light" style="background-color: white; font-size: 200%">
        {{ rules }}
      </div>
      <div
        class="group row align-items-start"
        v-for="(player, index) of run"
        :key="player.id"
        :index="index"
      >
        <div class="row">
          <span class="row fw-bolder" style="font-size: 125%">
            {{ player.player.name }}
          </span>
        </div>
        <div class="progress" style="height: 30px; font-size: 125%">
          <div
            class="progress-bar animated progress-bar-striped progress-bar-animated bg-success"
            :style="this.progressCss(player.meter)"
            :class="this.progressClass(index)"
            role="progressbar"
            :aria-valuenow="player.meter"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {{ player.meter }}
          </div>
        </div>
      </div>
      <button
        :disabled="!started"
        type="button"
        class="btn btn-outline-primary w-75 m-5"
        v-on:click="increment"
      >
        RUN
      </button>
      <!--      {{ run }}-->
    </div>
    <GameRanking
      v-if="isRankingOpen"
      :rankingList="rankingList"
      @swapScreen="(event) => swapScreen(event)"
    ></GameRanking>
  </div>
</template>

<script>
import GameRanking from "@/components/app/ranking/GameRanking";

export default {
  name: "HundredMetersClick",
  data() {
    return {
      value: 0,
      rules: "",
      clients: [],
      run: "",
      isRankingOpen: false,
      rankingList: [],
      started: false,
    };
  },
  components: {
    GameRanking,
  },
  methods: {
    increment() {
      this.$socket.client.emit("touch");
    },
    isMyId(id) {
      return id === this.$socket.client.id;
    },
    swapScreen(event) {
      this.$emit("swapScreen", event);
    },
    progressCss(value) {
      return `width: ${value}%`;
    },
    progressClass(index) {
      switch (index) {
        case 0:
          return "bg-sucess";
        case 1:
          return "bg-info";
        case 2:
          return "bg-warning";
        default:
          return "bg-error";
      }
    },
  },
  sockets: {
    updateRun(data) {
      data.sort((a, b) => {
        return b.meter - a.meter;
      });
      this.run = data;
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

<style scoped></style>
