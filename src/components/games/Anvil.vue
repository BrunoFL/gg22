<template>
  <div v-on:click="stopAnvil()">
    <p>{{rules}}</p>
    <div id="gameAnvil">
      <img id="anvil" src="@/assets/img/anvil.png" alt="anvil">
    </div>
    <div id="character">
      <img id="characterIMG" alt="giscard" src="@/assets/perso.jpeg">
    </div>
  </div>
</template>

<script>
export default {
  name: "Anvil",
  data(){
    return {
      rules: '',
      fallDuration: '',
      duration: 0,
      anvilState: 'paused',
      startTime: '',
      touchTime: '',
      delta: '',
      alertPlayer: ''
    }
  },
  methods: {
    stopAnvil(){
      this.anvilState = 'paused'
      this.touchTime = new Date().getTime()
      this.delta = (this.startTime + (this.duration * 1000) - this.touchTime)
      this.$socket.client.emit('touch',this.delta)
    }
  },
  sockets: {
    rules(rules){
      console.log('rules')
      this.rules = rules;
    },
    startEnclume(duration){
      this.startTime = new Date().getTime()
      this.duration = duration
      this.fallDuration = this.duration+'s'
      this.anvilState = 'running'
      console.log(this.anvilState)
    },
    playerTouch(data){
      this.alertPlayer = data
    }
  }
}
</script>

<style scoped>
  #gameAnvil{
    animation-name: anvilGoesBRRRR;
    position: relative;
    animation-duration: v-bind(fallDuration);
    animation-play-state: v-bind(anvilState);
  }

  #character{
    position: relative;
    top: 200px;
  }
  #characterIMG{
    width: 150px;
  }

  #anvil{
    width: 150px;
  }

  @keyframes anvilGoesBRRRR {
    0% {
      top: 0px;
    }
    100% {
      top: 200px;
    }
  }
</style>
