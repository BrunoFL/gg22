<template>
  <div id="gamesList">
    <!-- BLOC GAMES LIST -->
    <div id="joinLobby">
      <h1>{{nameLobby}}</h1>
      <b-list-group horizontal>
        <b-list-group-item v-for="game of listGames" :key="game" style="width: auto;">
          {{game}}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: "Games",
  data(){
    return {
        listGames: ['Enclume', 'Donuts', 'Poubelle', 'Enclume', 'Donuts', 'Poubelle', 'Enclume', 'Donuts', 'Poubelle', 'Enclume', 'Donuts', 'Poubelle']
    }
  },
  watch: {

  },
  methods: {

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
