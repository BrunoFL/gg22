<template>
  <div>
    <div id="race" v-if="!isRankingOpen" class="row justify-content-center gap-3">
      <h1>100m clic</h1>
      <p class="m-3" size="lg" style="background-color: white; font-size: 200%">{{ rules }}</p>
      <div class="group row align-items-start" v-for="player of run" :key="player.id">
        <div class="row">
          <span class="col-1" style="font-size: 125%">
            {{ player.player.name }}
          </span>
        </div>
        <b-progress style="height: 25px; font-size: 125%" :value="player.meter" :max="max" show-progress
                    animated></b-progress>
      </div>
      <b-button variant="outline-primary" size="lg" class="w-75 m-5" v-on:click="increment">
        RUN
      </b-button>
      <!--      {{ run }}-->
    </div>
    <GameRanking v-if="isRankingOpen" :rankingList="rankingList" @swapScreen="event => swapScreen(event)"></GameRanking>
  </div>
</template>

<script>
import GameRanking from '@/components/app/ranking/GameRanking'

export default {
  name: 'HundredMetersClick',
  data() {
    return {
      value: 0,
      max: 100,
      rules: '',
      clients: [],
      run: '',
      isRankingOpen: false,
      rankingList: []
    }
  },
  components: {
    GameRanking,
  },
  methods: {
    increment() {
      this.$socket.client.emit('touch')
    },
    isMyId(id) {
      return id === this.$socket.client.id
    },
    swapScreen(event) {
      this.$emit('swapScreen', event)
    }
  },
  sockets: {
    updateRun(data) {
      data.sort((a, b) => {
        return b.meter - a.meter
      })
      this.run = data
    },
    rules(rules) {
      this.rules = rules
    },
    leaderBoardGame(event) {
      this.isRankingOpen = true
      this.rankingList = event
    }
  }
}
</script>

<style scoped>

</style>
