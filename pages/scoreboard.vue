<template>
  <div class="box" id="scoreboardContainer">
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <div class="navbar-item">
          <h1 class="title is-3 has-text-primary">MAGIC CTF</h1>
        </div>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <h1 class="title is-3 has-text-grey">Time Left: {{timeLeft}}</h1>
          </div>
        </div>
      </div>
    </nav>
    <nav class="level box" id="topThreeListingContainer" style="align-items:center;justify-content:space-around;">
      <div class="has-text-centered" v-for="(score, index) in 3" :key="index">
        <h1 class="title is-3">{{topThreeScores[index] ? `#${(index + 1)}: ${topThreeScores[index].teamName}`: "n/a"}}</h1>
        <h1 class="subtitle is-5">{{topThreeScores[index] ? `(${locations[topThreeScores[index].location]})` : ""}}</h1>
        <h1 class="subtitle is-3">{{topThreeScores[index] ? topThreeScores[index].score : "n/a"}}</h1>
      </div>
    </nav>
    <div id="scoreListingContainer" ref="remainingScoresList">
      <div class="box" v-for="(score, index) in remainingScores" :key="index">
        <h1 class="title is-4" style="display:inline;">#{{index + 4}}: {{score.teamName}}</h1>
        <h1 class="subtitle is-4" style="display:inline;"> - {{score.score}} points <small>({{locations[score.location]}})</small></h1>
      </div>
    </div>
  </div>
</template>

<script>
  import socket from "~/plugins/socket.io.js";

  export default {
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
          const { score, lastUpdated, location } = this.rawTeamScores[team];
          sorted.push({ teamName: team, score, lastUpdated, location });
        }
        sorted.sort((a, b) => {
          return a.lastUpdated - b.lastUpdated;
        });
        sorted.sort((a, b) => {
          return b.score - a.score;
        });
        return sorted;
      },
      timeLeft() {
        let hrs = Math.floor(this.remainingTime / (1000 * 3600));
        let mins = Math.round((this.remainingTime % (1000 * 3600)) / 60000);
        if (this.gameIsActive) {
          if (hrs <= 0 && mins <= 0) {
            return `0:00`;
          } else if (mins === 0) {
            return `${hrs}:00`;
          } else if (mins === 60) {
            return `${hrs + 1}:00`;
          } else if (mins < 10) {
            return `${hrs}:0${mins}`;
          } else {
            return `${hrs}:${mins}`;
          }
        }
        return "-:--";
      }
    },
    methods: {
      scrollScoreboard() {
        const el = this.$refs.remainingScoresList;
        el.scrollTop = el.scrollTop + 1;
        if (el.scrollTop >= el.scrollHeight - el.offsetHeight) el.scrollTop = 0;
        setTimeout(this.scrollScoreboard, 25);
      }
    },
    mounted() {
      socket.connect();
      socket.on("updateGameStatus", gameData => {
        this.rawTeamScores = gameData.teamScores;
        if (gameData.isActive !== undefined)
          this.gameIsActive = gameData.isActive;
        if (gameData.remainingTime !== undefined)
          this.remainingTime = gameData.remainingTime;
      });
      this.$axios
        .get("/api/register/locations")
        .then(res => {
          this.locations = res.data.sort();
        })
        .catch(err => {
          console.error(err);
        });
      this.scrollScoreboard();
      setInterval(() => {
        if (this.gameIsActive) {
          this.remainingTime -= 1000;
        }
      }, 1000);
    },
    beforeDestroy() {
      socket.disconnect();
    }
  };
</script>

<style>
  #scoreboardContainer {
    position: absolute;
    top: 3rem;
    right: 3rem;
    bottom: 3rem;
    left: 3rem;
  }

  #topThreeListingContainer {
    position: absolute;
    top: 4.75rem;
    left: 1.25rem;
    right: 1.25rem;
  }

  #scoreListingContainer {
    position: absolute;
    top: 15.25rem;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1.25rem;
    overflow: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>
