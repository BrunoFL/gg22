<template>
  <div id="mainLobby">
    <h1 class="display-1">DUEL 3000</h1>

    <!-- PLAYER NAME CHOICE -->
    <div id="choiceName">
      <div class="row">
        <div class="mx-auto w-75 input-group">
          <span class="input-group-text">Nom du joueur</span>
          <input
            class="form-control"
            type="text"
            name="playerName"
            id="playerName"
            v-model="playerName"
          />
        </div>
      </div>
    </div>

    <!-- SCREEN CHOICE -->
    <div
      v-if="!isClicked"
      id="firstScreen"
      class="m-5 row mx-auto justify-content-md-center"
    >
      <div class="col col-lg-4">
        <button type="button" class="w-75 btn btn-dark btn-lg" v-on:click="initLobby()">
          Créer une salle
        </button>
      </div>
      <div class="col col-lg-4">
        <button type="button" class="w-75 btn btn-dark btn-lg" v-on:click="getLobbies()">
          Rejoindre une salle
        </button>
      </div>
    </div>

    <!-- BLOC CREATE LOBBY-->
    <div v-if="clickCreateLobby && !clickJoinLobby" id="createLobby" class="m-5">
      <div class="input-group">
        <span class="input-group-text">Nom de la salle</span>
        <input
          class="form-control"
          type="text"
          name="nameLobby"
          id="nameLobby"
          v-model="nameLobby"
        />
        <button
          class="btn btn-outline-success"
          type="button"
          v-on:click="createLobby(nameLobby)"
        >
          Créer la partie
        </button>
      </div>
    </div>

    <!-- BLOC GET LOBBIES-->
    <div v-if="clickGetLobbies && !clickJoinLobby" id="getLobbies" class="m-5">
      <ul class="list-group mx-auto col-sm-12 col-md-6 col-lg-5" id="listLobbies">
        <li
          v-for="lobby of lobbies"
          :key="lobby.id"
          href="#"
          v-on:click="selectLobby(lobby)"
          class="ps-3 list-group-item d-flex justify-content-between align-items-center"
          :class="{ active: this.selectedLobby.id === lobby.id }"
        >
          {{ lobby.name }}

          <span class="badge rounded-pill bg-dark">{{ lobby.players.length }}</span>
        </li>
      </ul>
      <button
        type="button"
        class="btn btn-success m-3"
        v-if="isLobbySelected"
        v-on:click="joinLobby(selectedLobby.id)"
        variant="success"
      >
        Rejoindre la salle
      </button>
    </div>

    <!-- BLOC JOIN LOBBY -->
    <div v-if="clickJoinLobby" id="joinLobby" class="m-5">
      <h2>
        Salle • {{ lobby.name }} •
        <span v-if="lobby.players" class="badge rounded-pill bg-dark">{{
          lobby.players.length
        }}</span>
      </h2>
      <ul class="list-group mx-auto col-sm-12 col-md-6 col-lg-5 m-3">
        <li
          class="ps-3 list-group-item align-items-center"
          v-for="player of lobby.players"
          :key="player.id"
        >
          {{ player.name }}
        </li>
      </ul>
      <button
        class="btn btn-success m-3"
        v-if="isAdmin()"
        v-on:click="goToGamesList()"
        variant="success"
      >
        Lancer la partie !
      </button>
    </div>
    <audio autoplay controls loop>
      <source src="@/assets/sound/menu.mp3" />
    </audio>

    <Footer></Footer>
  </div>
  <!-- BLOC JOIN LOBBIES -->
</template>

<script>
import Footer from "../footer/Footer.vue";
export default {
  components: { Footer },
  name: "Lobby",
  data() {
    return {
      isClicked: false,
      clickJoinLobby: false,
      clickGetLobbies: false,
      clickCreateLobby: false,
      nameLobby: "",
      playerName: "",
      lobbies: "",
      lobby: "",
      selectedLobby: "",
      isLobbySelected: false,
      adminName: "",
      isMounted: false,
    };
  },
  watch: {
    playerName: function (name) {
      const trimed = name.trim().substring(0, 8);
      if (trimed.length > 0) {
        this.$socket.client.emit("updateName", trimed);
      }
      this.playerName = trimed;
    },
    nameLobby: function (name) {
      this.nameLobby = name.trim().substring(0, 12);
    },
    lobby: function (val) {
      let playerAdmin = val.players.filter(function (player) {
        return player.isAdmin === true;
      });
      this.adminName = playerAdmin[0].name;
      this.$emit("sendLobbyToApp", this.lobby);
      this.$emit("sendPlayerToApp", this.playerName);
    },
  },
  methods: {
    initLobby() {
      //TODO : CREATE LOBBY
      this.isClicked = true;
      this.clickCreateLobby = true;
    },
    getLobbies() {
      //TODO : JOIN LOBBY
      this.$socket.client.emit("getLobbies");
      this.isClicked = true;
      this.clickGetLobbies = true;
    },
    createLobby(nameLobby) {
      const trimed = nameLobby.trim().substring(0, 15);
      this.nameLobby = trimed;
      this.$socket.client.emit("createLobby", trimed);
      this.clickJoinLobby = true;
    },
    selectLobby(lobby) {
      this.selectedLobby = lobby;
      this.isLobbySelected = true;
    },
    joinLobby(nameLobby) {
      this.$socket.client.emit("joinLobby", nameLobby);
      this.clickJoinLobby = true;
    },
    isAdmin() {
      return this.adminName === this.playerName;
    },
    goToGamesList() {
      this.$socket.client.emit("askListGames");
    },
  },
  sockets: {
    listLobbies(lobbies) {
      this.lobbies = lobbies;
    },
    updateLobby(lobby) {
      this.lobby = lobby;
    },
    listGames(listGames) {
      this.$emit("swapScreen", listGames);
    },
  },
};
</script>

<style scoped></style>
