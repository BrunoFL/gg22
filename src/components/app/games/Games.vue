<template>
  <div id="gamesList">
    <h1>DUEL 3000</h1>
    <audio autoplay controls loop>
      <source src="@/assets/sound/menu.mp3" />
    </audio>
    <!-- BLOC GAMES LIST -->
    <div id="displayListGames" class="mt-3">
      <h2>Liste des jeux</h2>
      <span v-if="!this.isAdmin()">Le chef va choisir un jeu</span>
      <ul class="list-group mx-auto col-sm-12 col-md-6 col-lg-5 m-3 mt-5">
        <li
          v-for="game of listGames"
          :key="game"
          href="#"
          v-on:click="selectGame(game)"
          class="ps-3 list-group-item align-items-center"
          :class="{ active: this.selectedGame === game }"
        >
          {{ game }}
        </li>
      </ul>
    </div>
    <button
      type="button"
      class="m-3 btn btn-success"
      v-if="isGameSelected && this.isAdmin()"
      v-on:click="startGame()"
      variant="success"
    >
      Lancer le jeu !
    </button>
  </div>
</template>

<script>
export default {
  name: "Games",
  props: {
    listGames: Array,
    lobby: Object,
    playerName: String,
  },
  data() {
    return {
      isGameSelected: true,
      adminName: "",
      selectedGame: "",
    };
  },
  watch: {},
  methods: {
    startGame() {
      this.$socket.client.emit("startGame", this.selectedGame);
    },
    selectGame(game) {
      if (this.isAdmin()) {
        this.selectedGame = game;
      }
    },
    isAdmin() {
      return this.lobby.admin.name === this.playerName;
    },
  },
  sockets: {
    gameStarted(gameName) {
      this.$emit("swapToGames", gameName);
    },
  },
};
</script>

<style scoped></style>
