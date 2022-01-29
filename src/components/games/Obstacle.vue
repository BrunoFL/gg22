<template>
    <div id="obstacleGame">
        <h1>DOR - Dual Obstacle Run</h1>
        <p>{{rules}}</p>
        <div id="gameObstacleRun">
            <input @keydown.space="interact()" autofocus>
            <img id="perso" src="../../assets/perso.jpeg">
        </div>
    </div>
</template>

<script>
export default {
  name: 'ObtacleRun',
  data() {
    return {
        rules: '',
        pos_x: 0,
        pos_y: 0
    }
  },
  methods: {
    /*
     * Depending on the direction that was assigned to you, moves the character.
     */
    interact() {
      console.log('prout')
      this.$socket.client.emit('interactWithCharacter')
    }
  },
  sockets: {
    rules(rules) {
      this.rules = rules;
    },
    startObstacleRun() {
      //setup vue
    },
    updateCharacterPos(pos) {
      this.pos_x = pos.pos_x;
      this.pos_y = pos.pos_y;
      console.log(this.pos_x, this.pos_y)
    }
  }
}
</script>

<style scoped>

#perso {
  position: absolute;
  bottom: pos_x rem;
  left: pos_y rem;
}
</style>