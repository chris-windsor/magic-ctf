<template>
  <div class="box" id="scoreboardContainer">
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <div class="navbar-item">
          <h1 class="title is-3">MAGIC CTF</h1>
        </div>
      </div>
    </nav>
    <nav class="level box" id="topThreeListingContainer" style="align-items:center;justify-content:space-around;">
      <div class="has-text-centered" v-for="(score, index) in 3" :key="index">
        <h1 class="title is-4">{{topThreeScores[index] ? `#${(index + 1)}: ${topThreeScores[index].teamName}`: "n/a"}}</h1>
        <h1 class="subtitle is-4">{{topThreeScores[index] ? topThreeScores[index].score : "n/a"}}</h1>
      </div>
    </nav>
    <div id="scoreListingContainer">
      <div class="box" v-for="(score, index) in remainingScores" :key="index">
        <h1 class="title is-4" style="display:inline;">#{{index + 4}}: {{score.teamName}}</h1>
        <h1 class="subtitle is-4" style="display:inline;"> - {{score.score}} points</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import socket from "~/plugins/socket.io.js";

  export default {
    data() {
      return {
        rawTeamScores: {}
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
          const { score, lastUpdated } = this.rawTeamScores[team];
          sorted.push({ teamName: team, score, lastUpdated });
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
    mounted() {
      socket.connect();
      socket.on("updateGameStatus", gameData => {
        this.rawTeamScores = gameData.teamScores;
      });
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
    top: 11rem;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1.25rem;
    overflow: scroll;
  }
</style>
