<template>
  <div id="gamesList">
    <!-- BLOC GAMES LIST -->
    <div id="displayListGames">
      <h1>Jeux</h1>
      <b-list-group class="mx-auto" style="width: 33%;">
        <b-list-group-item v-for="game of listGames" :key="game" href="#" v-on:click="selectGame(game)" style="width: auto;">
          {{game}}
        </b-list-group-item>
      </b-list-group>
    </div>
    <b-button v-if="isGameSelected" v-on:click="startGame()" variant="success">Lancer le jeu !</b-button>
  </div>
</template>

<script>

export default {
  name: "Games",
  data(){
    return {
        listGames: [],
        isGameSelected: true,
        selectedGame: ''
    }
  },
  watch: {

  },
  methods: {
    startGame() {
        this.$socket.client.emit('startGame', this.selectedGame)
        this.$emit('swapToGames')
    },   
    selectGame(game) {
        this.selectedGame = game
    }
  },
  sockets: {
    listGames(listGames) {
        this.listGames = listGames
    }
  }
}
</script>

<style scoped>
</style>
