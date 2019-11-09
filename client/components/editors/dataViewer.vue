<template>
  <div class="columns">
    <b-loading :active.sync="isLoading"></b-loading>
    <div class="column">
      <div class="box content">
        <h1 class="title is-5">Log:</h1>
        <div class="notification is-info" v-if="log.length == 0">There is currently no logs to view.</div>
        <div class="log-viewer" v-else>
          <ol>
            <li :key="index" v-for="(entry, index) in log">{{entry}}</li>
          </ol>
        </div>
      </div>
      <hr>
      <div class="box content">
        <h1 class="title is-5">Statistics:</h1>
        <div :key="pIndex" class="box content" v-for="(puzzle, pIndex) in stats">
          <h1 class="title is-3">{{puzzle.name}}</h1>
          <p>Attempts: {{puzzle.attempts}}. Successes: {{puzzle.successes}}.</p>
          <h1 class="title is-5">Hints:</h1>
          <ol>
            <li :key="hIndex" v-for="(hint, hIndex) in puzzle.hints">
              Uses: {{hint.uses}}
            </li>
          </ol>
        </div>
      </div>
      <a @click="downloadData()" class="button is-success">Download Data</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isLoading: true,
        stats: [],
        log: []
      };
    },
    methods: {
      downloadData() {
      }
    },
    mounted() {
      this.$axios
        .get("/api/admin/gamedata")
        .then(res => {
          this.stats = res.data.gameStatistics;
          this.log = res.data.gameLog;
          this.isLoading = false;
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
</script>

<style scoped>
  .log-viewer {
    height: 250px;
    overflow: scroll;
    border: 1px solid hsl(0, 0%, 86%);
    border-radius: 4px;
  }
</style>
