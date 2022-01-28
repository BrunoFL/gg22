<template>
  <div id="mainLobby">
    <h1 class="display-1">NOM DU JEU</h1>

    <!-- PLAYER NAME CHOICE -->
    <div id="choiceName">
      <b-input-group class="mx-auto" style="width: 33%;" prepend="Nom du joueur">
        <b-form-input type="text" name="playerName" id="playerName" v-model="playerName"></b-form-input>
      </b-input-group>
    </div>

    <!-- SCREEN CHOICE -->
    <div v-if="!isClicked"  id="firstScreen">
      <b-button v-on:click="initLobby()">Create lobby</b-button>
      <b-button v-on:click="getLobbies()">Join lobby</b-button>
    </div>

    <!-- BLOC CREATE LOBBY-->
    <div v-if="clickCreateLobby && !clickJoinLobby" id="createLobby">
      <b-input-group size="lg" prepend="Nom du lobby">
        <b-form-input type="text" name="nameLobby" id="nameLobby" v-model="nameLobby"></b-form-input>
        <b-input-group-append>
          <b-button v-on:click="createLobby(nameLobby)" type="submit" value="Submit" variant="outline-success" >Créer la partie</b-button>
        </b-input-group-append>
      </b-input-group>
      {{nameLobby}}
    </div>

    <!-- BLOC GET LOBBIES-->
    <div v-if="clickGetLobbies" id="getLobbies">
      <b-list-group class="mx-auto" style="width: 33%;" id="listLobbies" v-for="lobby of lobbies" :key="lobby.id">
        <b-list-group-item href="#" v-on:click="selectLobby(lobby)" class="listSize">
          {{lobby.name}}
          <b-badge variant="primary" pill>{{lobby.players.length}}</b-badge>
        </b-list-group-item>
      </b-list-group>
      <b-button v-if="isLobbySelected" variant="success">Rejoindre le lobby</b-button>
    </div>

    <div v-if="clickJoinLobby" id="joinLobby">
      <h1>{{nameLobby}}</h1>
      <b-list-group >

      </b-list-group>
    </div>
  </div>

  <!-- BLOC JOIN LOBBIES -->
</template>

<script>
export default {
  name: "Lobby",
  data(){
    return {
      isClicked: false,
      clickJoinLobby: false,
      clickGetLobbies : false,
      clickCreateLobby: false,
      nameLobby: '',
      playerName: '',
      lobbies: '',
      lobby: '',
      selectedLobby: '',
      isLobbySelected: false
    }
  },
  methods: {
    initLobby() {
      //TODO : CREATE LOBBY
      this.isClicked = true
      this.clickCreateLobby = true
      this.$emit('swapScreen','create')
    },
    getLobbies() {
      //TODO : JOIN LOBBY
      this.$socket.client.emit('getLobbies')
      this.isClicked = true
      this.clickGetLobbies = true
      this.$emit('swapScreen','join')
    },
    createLobby(nameLobby) {
      this.$socket.client.emit('createLobby', nameLobby)
      this.clickJoinLobby = true
    },
    selectLobby(lobby) {
      this.selectedLobby = lobby
      this.isLobbySelected = true
    }
  },
  sockets: {
    listLobbies(lobbies) {
      console.log('boup bip')
      this.lobbies = lobbies
    },
    updateLobby(lobby) {
      this.lobby = lobby
    }
  }
}
</script>

<style scoped>
</style>
