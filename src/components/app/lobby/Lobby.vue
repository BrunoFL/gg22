<template>
  <div id="mainLobby">
    <h1 class="display-1">DUEL 3000</h1>
    <!--<Obstacle></Obstacle>-->

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
    <div v-if="clickGetLobbies && !clickJoinLobby" id="getLobbies">
      <b-list-group class="mx-auto" style="width: 33%;" id="listLobbies">
        <b-list-group-item v-for="lobby of lobbies" :key="lobby.id" href="#" v-on:click="selectLobby(lobby)" class="listSize">
          {{lobby.name}}
          <b-badge variant="primary" pill>{{lobby.players.length}}</b-badge>
        </b-list-group-item>
      </b-list-group>
      <b-button v-if="isLobbySelected" v-on:click="joinLobby(selectedLobby.id)" variant="success">Rejoindre le lobby</b-button>
    </div>

    <!-- BLOC JOIN LOBBY -->
    <div v-if="clickJoinLobby" id="joinLobby">
      <h1>{{nameLobby}}</h1>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item v-for="player of lobby.players" :key="player.id">
          {{player.name}}
        </b-list-group-item>
      </b-list-group>
      <b-button v-if="isAdmin()" v-on:click="goToGamesList()" variant="success">Lancer la partie !</b-button>
    </div>
  </div>

  <!-- BLOC JOIN LOBBIES -->
</template>

<script>
//import Obstacle from '../../games/Obstacle.vue'
export default {
//  components: { Obstacle },
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
      isLobbySelected: false,
      adminName: ''
    }
  },
  watch: {
    playerName: function (val) {
      this.$socket.client.emit('updateName', val)
    },    
    lobby: function (val) {
      let playerAdmin = val.players.filter(function(player) { return player.isAdmin === true; });
      this.adminName = playerAdmin[0].name
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
    joinLobby(nameLobby){
      this.$socket.client.emit('joinLobby', nameLobby)
      this.clickJoinLobby = true
    },
    isAdmin(){
      return this.adminName == this.playerName
    },
    goToGamesList() {
      this.$emit('swapScreen')
      this.$socket.client.emit('askListGames')
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
