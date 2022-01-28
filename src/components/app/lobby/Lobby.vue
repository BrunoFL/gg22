<template>
  <div id="mainLobby">
    <h1>NOM DU JEU</h1>

    <!-- SCREEN CHOICE -->
    <div v-if="!isClicked"  id="firstScreen">
      <b-button v-on:click="createLobby()">Create lobby</b-button>
      <b-button v-on:click="getLobbies()">Join lobby</b-button>
    </div>

    <!-- BLOC CREATE LOBBY-->
    <div v-if="clickCreateLobby" id="createLobby">
      <b-input-group size="lg" prepend="Nom du lobby">
        <b-form-input></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-success">Créer la partie</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>

    <!-- BLOC JOIN LOBBY-->
    <div v-if="clickJoinLobby" id="joinLobby">
      <b-list-group class="mx-auto" style="width: 50%;" id="listLobbies" v-for="lobby of lobbies" :key="lobby.name">
        <b-list-group-item class="listSize">
          {{lobby.name}}
          <b-badge variant="primary" pill>2</b-badge>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lobby",
  data(){
    return {
      isClicked: false,
      clickJoinLobby: false,
      clickCreateLobby: false,
      lobbies: [{name:'komtuve'},{name: 'komtulsan'}]
    }
  },
  methods: {
    createLobby() {
      //TODO : CREATE LOBBY
      this.$socket.client.emit('createLobby')
      this.isClicked = true
      this.clickCreateLobby = true
      this.$emit('swapScreen','create')
    },
    getLobbies() {
      //TODO : JOIN LOBBY
      this.$socket.client.emit('getLobbies')
      this.isClicked = true
      this.clickJoinLobby = true
      this.$emit('swapScreen','join')
    }
  }
}
</script>

<style scoped>
</style>
