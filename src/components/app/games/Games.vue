<template>
  <div id="gamesList">
    <audio autoplay controls loop>
      <source src="@/assets/sound/menu.mp3">
    </audio>
    <!-- BLOC GAMES LIST -->
    <div id="displayListGames">
      <h1>Jeux</h1>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item v-for="game of listGames" :key="game" href="#" v-on:click="selectGame(game)" style="width: auto;">
          {{game}}
        </b-list-group-item>
      </b-list-group>
    </div>
    <b-button class="m-3" v-if="isGameSelected && isAdmin()" v-on:click="startGame()" variant="success">Lancer le jeu !</b-button>
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
  data(){
    return {
        isGameSelected: true,
        adminName: '',
        selectedGame: ''
    }
  },
  watch: {
  },
  methods: {
    startGame() {
        this.$socket.client.emit('startGame', this.selectedGame)
    },
    selectGame(game) {
        this.selectedGame = game
        this.getAdmin()
    },
    getAdmin() {
      let playerAdmin = this.lobby.players.filter(function (player) {
        return player.isAdmin === true
      })
      this.adminName = playerAdmin[0].name
    },
    isAdmin() {
      return this.adminName === this.playerName
    },
  },
  sockets: {
      gameStarted(gameName) {
          this.$emit('swapToGames', gameName)
      }
  }
}
</script>

<style scoped>
</style>
