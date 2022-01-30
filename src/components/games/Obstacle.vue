<template>
    <div id="obstacleGame">
        <h1>DOR - Dual Obstacle Run</h1>
        <p>{{rules}}</p>
        <div id='gameWindow'>
          <div class="playerWindow">
              <button autofocus v-if="team == 1" @keydown.space="interact()" id="moveCharacter" class="btn btn-outline-success">Go {{direction}}</button>
              <img id="perso1" src="../../assets/perso.jpeg">
          </div>
          <div class="playerWindow">
              <button autofocus v-if="team == 2" @keydown.space="interact()" id="moveCharacter" class="btn btn-outline-success">Go {{direction}}</button>
              <img id="perso2" src="../../assets/img/jospin.jpg">
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ObtacleRun',
  data() {
    return {
        rules: '',
        character1Pos: '0px',
        character2Pos: '0px',
        team: '',
        direction: ''
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
    startObstacleRun(data) {
      console.log('client : ' + data)
      this.team = data.team;
      this.direction = (data.direction == 0) ? 'up' : 'down' 
    },
    updateCharacterPos(ret) {
      if (ret.team == 1) {
        this.character1Pos = ret.position + 'px';
      } else {
        this.character2Pos = ret.position + 'px';
      }
    }
  }
}
</script>

<style scoped>
#obstacleGame {
  height: 100%;
}

#gameWindow {
  height: 80%;
  background-color: rgba(255, 255, 255, 0.9);
}

.playerWindow {
  position: relative;
  float: left;
  border: black 2px solid;
  width: 50%;
  height: 100%;
}

#moveCharacter {
  position: absolute;
  bottom: 2rem;
  margin: auto;
}

#perso1 {
  width:5%;
  min-width: 40px;
  margin: 2%;
  position: absolute;
  bottom: v-bind(character1Pos);
  left: 0px;
}
#perso2 {
  width:5%;
  min-width: 40px;
  margin: 2%;
  position: absolute;
  bottom: v-bind(character2Pos);
  right: 0px;
}
</style>