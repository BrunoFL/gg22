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
        pos_x: '0px',
        pos_y: '0px'
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
      this.pos_x = pos.pos_x + 'px';
      this.pos_y = pos.pos_y + 'px';
      console.log(this.pos_x, this.pos_y)
    }
  }
}
</script>

<style scoped>

#perso {
  width:5%;
  min-width: 20px;
  position: absolute;
  bottom: v-bind(pos_y);
  left: v-bind(pos_x);
}
</style>