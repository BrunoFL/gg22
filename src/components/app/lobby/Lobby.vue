<template>
  <div id="mainLobby">
    <audio autoplay controls loop>
      <source src="@/assets/sound/menu.mp3">
    </audio>
    <h1 class="display-1">DUEL 3000</h1>

    <!-- PLAYER NAME CHOICE -->
    <div id="choiceName">
      <b-row cols="1">
        <b-col cols="10" offset="1">
          <b-input-group class="mx-auto" prepend="Nom du joueur">
            <b-form-input type="text" name="playerName" id="playerName" v-model="playerName"></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
    </div>

    <!-- SCREEN CHOICE -->
    <div v-if="!isClicked" id="firstScreen" class="m-5">
      <b-row cols="2">
        <b-col offset="2" cols="4">
          <b-button class="w-75" v-on:click="initLobby()">Créer une salle</b-button>
        </b-col>
        <b-col cols="4">
          <b-button class="w-75" v-on:click="getLobbies()">Rejoindre une salle</b-button>
        </b-col>
      </b-row>
    </div>

    <!-- BLOC CREATE LOBBY-->
    <div v-if="clickCreateLobby && !clickJoinLobby" id="createLobby" class="m-5">
      <b-input-group prepend="Nom du lobby">
        <b-form-input type="text" name="nameLobby" id="nameLobby" v-model="nameLobby"></b-form-input>
        <b-input-group-append>
          <b-button v-on:click="createLobby(nameLobby)" type="submit" value="Submit" variant="outline-success">Créer la
            partie
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>

    <!-- BLOC GET LOBBIES-->
    <div v-if="clickGetLobbies && !clickJoinLobby" id="getLobbies" class="m-5">
      <b-list-group class="mx-auto" style="width: 45%;" id="listLobbies">
        <b-list-group-item v-for="lobby of lobbies" :key="lobby.id" href="#" v-on:click="selectLobby(lobby)"
                           class="listSize">
          {{ lobby.name }}
          <b-badge variant="primary" pill>{{ lobby.players.length }}</b-badge>
        </b-list-group-item>
      </b-list-group>
      <b-button class="m-3" v-if="isLobbySelected" v-on:click="joinLobby(selectedLobby.id)" variant="success">Rejoindre
        le lobby
      </b-button>
    </div>

    <!-- BLOC JOIN LOBBY -->
    <div v-if="clickJoinLobby" id="joinLobby" class="m-5">
      <h2>Lobby • {{ lobby.name }} •
        <b-badge v-if="lobby && lobby.players" variant="primary" pill>{{ lobby.players.length }}</b-badge>
      </h2>
      <b-list-group class="mx-auto" style="width: 45%;">
        <b-list-group-item v-for="player of lobby.players" :key="player.id">{{ player.name }}</b-list-group-item>
      </b-list-group>
      <b-button class="m-3" v-if="isAdmin()" v-on:click="goToGamesList()" variant="success">
        Lancer la partie !
      </b-button>
    </div>
  </div>

  <!-- BLOC JOIN LOBBIES -->
</template>

<script>
export default {
  name: 'Lobby',
  data() {
    return {
      isClicked: false,
      clickJoinLobby: false,
      clickGetLobbies: false,
      clickCreateLobby: false,
      nameLobby: '',
      playerName: '',
      lobbies: '',
      lobby: '',
      selectedLobby: '',
      isLobbySelected: false,
      adminName: ''
    }
  },
  watch: {
    playerName: function (val) {
      this.$socket.client.emit('updateName', val)
    },
    lobby: function (val) {
      let playerAdmin = val.players.filter(function (player) {
        return player.isAdmin === true
      })
      this.adminName = playerAdmin[0].name
      this.$emit('sendLobbyToApp', this.lobby)
    }
  },
  methods: {
    initLobby() {
      //TODO : CREATE LOBBY
      this.isClicked = true
      this.clickCreateLobby = true
    },
    getLobbies() {
      //TODO : JOIN LOBBY
      this.$socket.client.emit('getLobbies')
      this.isClicked = true
      this.clickGetLobbies = true
    },
    createLobby(nameLobby) {
      this.$socket.client.emit('createLobby', nameLobby)
      this.clickJoinLobby = true
    },
    selectLobby(lobby) {
      this.selectedLobby = lobby
      this.isLobbySelected = true
    },
    joinLobby(nameLobby) {
      this.$socket.client.emit('joinLobby', nameLobby)
      this.clickJoinLobby = true
    },
    isAdmin() {
      return this.adminName === this.playerName
    },
    goToGamesList() {
      this.$socket.client.emit('askListGames')
    }
  },
  sockets: {
    listLobbies(lobbies) {
      this.lobbies = lobbies
    },
    updateLobby(lobby) {
      this.lobby = lobby
    },
    listGames(listGames) {
      this.$emit('swapScreen', listGames)
    }
  }
}
</script>

<style scoped>
</style>
