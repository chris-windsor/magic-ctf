<template>
  <div class="box" id="scoreboardContainer">
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <div class="navbar-item">
          <h1 class="title is-3">MAGIC CTF</h1>
        </div>
      </div>
    </nav>
    <div id="scoreListingContainer">
      <div class="notification is-info" v-if="processedTeamScores.length === 0">
        No teams have currently registered for the CTF
      </div>
      <div class="box" v-for="(score, index) in processedTeamScores" :key="index">
        <h1 class="title is-4">{{index + 1}}. {{score.teamName}} : {{score.teamScore}} points</h1>
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
      processedTeamScores() {
        let sorted = [];
        for (let team in this.rawTeamScores) {
          sorted.push({ teamName: team, teamScore: this.rawTeamScores[team] });
        }
        sorted.sort((a, b) => {
          return b.teamScore - a.teamScore;
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

  #scoreListingContainer {
    position: absolute;
    top: 4rem;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1rem;
    overflow: scroll;
  }
</style>
