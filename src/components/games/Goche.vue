<template>
  <div>
    <audio autoplay controls loop>
      <source src="@/assets/sound/droate_goche.mp3" />
    </audio>
    <div v-if="!isRankingOpen">
      <h1>Gôche ou Droate</h1>
      <p class="m-3" style="background-color: white; font-size: 200%">
        {{ rules }}
      </p>
      <h2>{{ proposition.name }}</h2>

      <div class="row m-5">
        <div class="col m-3">
          <button
            type="button"
            class="btn btn-secondary w-75"
            :disabled="!started"
            v-on:click="jeSuisGocho()"
          >
            Gôche
          </button>
        </div>
        <div class="col m-3">
          <button
            type="button"
            class="btn btn-secondary w-75"
            v-on:click="QUANDLEPARCFLORAL()"
            :disabled="!started"
          >
            Droate
          </button>
        </div>
      </div>
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
  name: "Goche",
  data() {
    return {
      rules: "",
      isRankingOpen: false,
      proposition: "",
      rankingList: [],
      started: false,
    };
  },
  components: {
    GameRanking,
  },
  methods: {
    jeSuisGocho() {
      this.$socket.client.emit("touch", 0);
    },
    QUANDLEPARCFLORAL() {
      this.$socket.client.emit("touch", 1);
    },
    swapScreen(event) {
      this.$emit("swapScreen", event);
    },
  },
  sockets: {
    rules(rules) {
      this.rules = rules;
    },
    leaderBoardGame(event) {
      this.isRankingOpen = true;
      this.rankingList = event;
    },
    question(proposition) {
      this.proposition = proposition;
    },
    startGame() {
      this.started = true;
    },
  },
};
</script>

<style scoped></style>
