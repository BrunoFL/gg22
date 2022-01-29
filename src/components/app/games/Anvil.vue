<template>
  <div v-on:click="stopAnvil()">
    <div id="gameAnvil">
      <img id="anvil" src="@/assets/img/anvil.png" alt="anvil">
      <p>{{rules}}</p>
      <p>{{touchTime}}</p>
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
      fallDuration: '4s',
      anvilState: 'running',
      touchTime: ''
    }
  },
  methods: {
    stopAnvil(){
      this.anvilState = 'paused'
      this.touchTime = new Date().getTime()
    }
  },
  sockets: {
    rules(rules){
      console.log('rules')
      this.rules = rules;
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
