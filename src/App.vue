<template>
  <div id="app">
    <Lobby></Lobby>
  </div>
</template>

<script>
import Lobby from "@/components/app/lobby/Lobby";

export default {
  name: 'App',
  components: {
    Lobby
  },
  sockets: {
    connect() {
      console.log('socket connected')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
