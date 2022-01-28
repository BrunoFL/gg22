<template>
    <div id="obstacleGame">
        <h1>DOR - Dual Obstacle Run</h1>
        <div class="gameWindow" v-on:click="interact()">
            <img id="perso" src="../../assets/perso.jpeg">
        </div>
    </div>
</template>

<script>
export default {
  name: 'ObtacleRun',
  data() {
    return {
        pos_x: 0,
        pos_y: 0
    }
  },
  methods: {
    /*
     * Depending on the direction that was assigned to you, moves the character.
     */
    interact() {
      console.log("prout")
      this.$socket.client.emit('interactWithCharacter')
    }
  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    updateCharacterPos(pos) {
      this.pos_x = pos.pos_x;
      this.pos_y = pos.pos_y;
      console.log(this.pos_x, this.pos_y)
    }
  }
}
</script>

<style scoped>
.gameWindow {

}

#perso {

}
</style>