<template>
    <div id="obstacleGame">
        <h1>DOR - Dual Obstacle Run</h1>
        <div class="gameWindow">
            <img src="../../assets/perso.jpeg">
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
      this.$socket.client.emit('interactWithCharacter')
    }
  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    update_character_position(x, y) {
      this.pos_x = x;
      this.pos_y = y;
    }
  }
}
</script>

<style scoped>

</style>