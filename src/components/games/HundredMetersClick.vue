<template>
<div id="race" class="row justify-content-center gap-3">
  <b-button type="button" class="btn btn-outline-primary" v-on:click="increment">
    RUN
  </b-button>
  <div class="group row align-items-lg-start" v-for="client in clients" :key="client.id">
    <div class="row">
      <span class="col-1">You : </span>
      <div class="col-11 progress p-0">
        <div  class="progress-bar progress-bar-animated progress-bar-striped"
              role="progressbar"
              aria-valuenow="1"
              aria-valuemin="0"
              aria-valuemax="100"
              v-bind:style="valueBar(client.value)">
        </div>
      </div>
    </div>
  </div>
  {{run}}
</div>
</template>

<script>
export default {
  name: "HundredMetersClick",
  data(){
    return{
      value: 0,
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
    }
  }
}
</script>

<style scoped>

</style>
