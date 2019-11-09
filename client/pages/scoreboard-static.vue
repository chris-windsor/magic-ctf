<template>
  <div class="container is-fluid">
    <div class="box" id="scoreboard-container" style="margin-bottom: 1.5rem;">
      <nav class="navbar is-transparent" style="margin-bottom: 0.5rem;">
        <div class="navbar-brand">
          <div class="navbar-item">
            <h1 class="title 2 has-text-primary">MAGIC CTF</h1>
          </div>
        </div>
        <div class="navbar-menu is-active">
          <div class="navbar-end">
            <div class="navbar-item">
              <h1 class="subtitle is-5 has-text-grey">Time left: {{countdown}}</h1>
            </div>
          </div>
        </div>
      </nav>
      <div :key="index" class="box" style="padding:0.75rem; margin-bottom: 0.75rem;" v-for="(score, index) in 3">
        <h1 class="title is-4" style="display:inline;">{{topThreeScores[index] ? `#${(index + 1)}:
          ${topThreeScores[index].teamName}` : "N/A"}}</h1>
        <h1 class="subtitle is-4" style="display:inline;"> - {{topThreeScores[index] ? topThreeScores[index].score :
          "N/A"}} points
          <small>{{topThreeScores[index] ? `(${locations[topThreeScores[index].locationId]})` : ""}}</small>
        </h1>
      </div>
    </div>
    <div class="box" id="scoreboard-container" ref="remainingScoresList" style="padding:0.75rem;">
      <div :key="index" class="box" style="padding:0.75rem; margin-bottom: 0.75rem;"
           v-for="(score, index) in remainingScores">
        <h1 class="title is-4" style="display:inline;">#{{index + 4}}: {{score.teamName}}</h1>
        <h1 class="subtitle is-4" style="display:inline;"> - {{score.score}} points
          <small>({{locations[score.locationId]}})</small>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mixins: ["socket", "countdown"],
    data() {
      return {
        locations: [],
        rawTeamScores: {},
        gameIsActive: false,
        remainingTime: 0
      };
    },
    computed: {
      topThreeScores() {
        return this.processedTeamScores.splice(0, 3);
      },
      remainingScores() {
        return this.processedTeamScores;
      },
      processedTeamScores() {
        let sorted = [];
        for (let team in this.rawTeamScores) {
          const {name, score, lastUpdated, locationId} = this.rawTeamScores[team];
          sorted.push({teamName: name, score, lastUpdated, locationId});
        }
        sorted.sort((a, b) => {
          return a.lastUpdated - b.lastUpdated;
        });
        sorted.sort((a, b) => {
          return b.score - a.score;
        });
        return sorted;
      }
    },
    methods: {
      scrollInit() {
        var ScrollInterval = setInterval(this.scrollScoreboard, 25);
      },
      scrollScoreboard() {
        const el = this.$refs.remainingScoresList;
        el.scrollTop = el.scrollTop + 1;
        if (el.scrollTop >= (el.scrollHeight - (el.offsetHeight + 1))) {
          el.scrollTop = 0;
        }
      },
    },
    mounted() {
      this.socket.connect();
      this.socket.on("updateGameStatus", gameData => {
        if (gameData.teamScores !== undefined) this.rawTeamScores = gameData.teamScores;
        if (gameData.endTime !== undefined) this.gameEndTime = gameData.endTime;
        if (gameData.isActive !== undefined) this.gameIsActive = gameData.isActive;
      });
      this.$axios
        .get("/api/locations")
        .then(res => {
          this.locations = res.data.sort();
        })
        .catch(err => {
          console.error(err);
        });
      this.scrollInit();
    },
    beforeDestroy() {
      this.socket.disconnect();
    }
  };
</script>

<style>
  #scoreboard-container {
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 0.75rem;
    padding-bottom: 0.10rem;
    margin-bottom: 0.75;
  }

  #top-three-listing-container {
    margin: 1rem 0.075rem 0;
  }

  #score-listing-container {
    padding: 0.05rem;
    overflow: hidden;
    overflow-x: hidden;
    height: calc(100vh - 22rem);
    min-height: 12rem;
  }

  #particles-js canvas {
    position: fixed;
  }

  .hero-body {
    padding: 1.5rem;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>
