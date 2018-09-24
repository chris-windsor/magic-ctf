<template>
  <div class="columns">
    <div class="column is-3">
      <aside class="menu">
        <p class="menu-label">Info:</p>
        <ul class="menu-list" id="sidebar-info">
          <li>
            <a>Team: {{userData.teamName}}</a>
          </li>
          <li>
            <a>User: {{userData.username}}</a>
          </li>
          <li>
            <a>Time Left: {{timeLeft}}</a>
          </li>
        </ul>
        <p class="menu-label"></p>
        <ul class="menu-list">
          <li>
            <a class="button is-rounded is-warning is-outlined" @click="requestHelp()">
              <span class="icon">
                <i class="fa fa-chalkboard-teacher"></i>
              </span>
              <span>Request Help</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-9">
      <div class="box content">
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Points</p>
              <p class="title" v-if="gameIsActive">{{teamScoreAndPosition.score}}</p>
              <p class="title" v-else>n/a</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Position</p>
              <p class="title" v-if="gameIsActive">{{teamScoreAndPosition.position}}</p>
              <p class="title" v-else>n/a</p>
            </div>
          </div>
        </nav>
      </div>
      <div class="box content">
        <div class="notification is-success" v-if="puzzles.length === 0">Congratulations you have successfully logged in. The game will begin shortly.</div>
        <div v-else>
          <puzzle v-for="(puzzle, index) in puzzles" :key="index" :puzzleData="puzzles[index]" :id="index" @submitAnswer="submitAnswer" @requestHint="requestHint"></puzzle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import socket from "~/plugins/socket.io.js";
  import puzzle from "~/components/puzzle";

  export default {
    layout: "profile",
    fetch({ store, redirect }) {
      if (!store.state.authUser) {
        return redirect("/");
      } else {
        if (store.state.authUser.accountType === "admin") {
          return redirect("/admin");
        } else if (store.state.authUser.accountType === "coach") {
          return redirect("/coach");
        }
      }
    },
    data() {
      return {
        puzzles: [],
        selectedHintCost: 0,
        rawTeamScores: {},
        gameIsActive: false,
        remainingTime: 0
      };
    },
    computed: {
      userData() {
        if (this.$store.state.authUser !== null) {
          this.team = this.$store.state.authUser.teamName;
          return this.$store.state.authUser;
        } else {
          return {
            teamName: "",
            username: ""
          };
        }
      },
      teamScoreAndPosition() {
        let sorted = [];
        for (let team in this.rawTeamScores) {
          sorted.push({ teamName: team, teamScore: this.rawTeamScores[team] });
        }
        sorted.sort((a, b) => {
          return b.teamScore - a.teamScore;
        });
        let scoreAndPosition = {};
        sorted.forEach((entry, index) => {
          if (entry.teamName === this.userData.teamName) {
            scoreAndPosition.score = entry.teamScore;
            scoreAndPosition.position = index + 1;
          }
        });
        return scoreAndPosition;
      },
      timeLeft() {
        let hrs = Math.floor(this.remainingTime / (1000 * 3600));
        let mins = Math.round((this.remainingTime % (1000 * 3600)) / 60000);
        if (this.gameIsActive) {
          if (mins === 0) {
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
      submitAnswer(puzzleId, puzzleName, answer) {
        socket.emit("submitAnswer", {
          puzzleId,
          puzzleName,
          answer
        });
      },
      requestHint(puzzleId, puzzleName, hintId, hintCost) {
        this.selectedHintCost = hintCost;
        this.$dialog.confirm({
          message: `If this hint is requested, the total value of this problem will be deducted by ${
            this.selectedHintCost
          } points.`,
          type: "is-success",
          title: "Please confirm",
          confirmText: "Okay, continue",
          onConfirm: () => {
            socket.emit("requestHint", {
              puzzleId,
              puzzleName,
              hintId
            });
            this.$toast.open({
              message: "Requesting hint...",
              type: "is-info",
              duration: 1500
            });
          }
        });
      },
      requestHelp() {
        this.$dialog.confirm({
          message: "Are you sure you want to request help?",
          type: "is-success",
          title: "Please confirm",
          confirmText: "Yes, please",
          onConfirm: () => {
            socket.emit("requestHelp");
            this.$toast.open({
              message: "Requesting help...",
              type: "is-info",
              duration: 1500
            });
          }
        });
      }
    },
    mounted() {
      socket.connect();
      socket.on("connect", () => {
        socket.emit("requestPuzzles");
      });
      socket.on("updateTeamPuzzles", puzzleData => {
        this.puzzles = puzzleData;
      });
      socket.on("incorrectAnswer", puzzleName => {
        this.$toast.open({
          message: `Sorry. Incorrect answer for puzzle: ${puzzleName}`,
          type: "is-danger",
          duration: 1500
        });
      });
      socket.on("updateGameStatus", gameData => {
        if (gameData.teamScores !== undefined)
          this.rawTeamScores = gameData.teamScores;
        if (gameData.isActive !== undefined)
          this.gameIsActive = gameData.isActive;
        if (gameData.remainingTime !== undefined)
          this.remainingTime = gameData.remainingTime;
      });
      socket.on("gameStateChange", () => {
        this.$router.go({
          path: "/dashboard",
          force: true
        });
      });
      setInterval(() => {
        if (this.gameIsActive) {
          this.remainingTime -= 1000;
        }
      }, 1000);
    },
    beforeDestroy() {
      socket.disconnect();
    },
    components: {
      puzzle
    }
  };
</script>
