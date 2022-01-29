<template>
<div id="race" class="row justify-content-center gap-3">
  <div id="rules">
    {{rulesRun}}
  </div>
  <div v-for="player of run" :key="player.id">
    <b-progress :value="player.meter" :max="max" show-progress animated></b-progress>
  </div>
  <b-button type="button" class="btn btn-outline-primary" v-on:click="increment">
    RUN
  </b-button>
  {{run}}
</div>
</template>

<script>
export default {
  name: "HundredMetersClick",
  data(){
    return{
      value: 0,
      max: 100,
      rulesRun: '',
      clients: [],
      run: ''
    }
  },
  methods: {
    increment(){
      this.$socket.client.emit("touch")
    },
    valueBar(value){
      return "width: " + value + "%;";
    }
  },
  sockets: {
    updateRun(data){
      this.run = data;
    },
    rules(rules){
      this.rulesRun = rules
    }
  }
}
</script>

<style scoped>

</style>
