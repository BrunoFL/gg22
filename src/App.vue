<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Counter/>
    <ClientList />
  </div>
</template>

<script>
import Counter from './components/Counter'
import ClientList from './components/ClientList'

export default {
  name: 'App',
  components: {
    Counter, ClientList
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
