<template>
  <div class="columns">
    <div class="column is-3">
      <aside class="menu">
        <p class="menu-label">Info:</p>
        <ul class="menu-list" id="sidebar-info">
          <li>
            <a>Team: {{userData.name}}</a>
          </li>
          <li>
            <a>Remaining time:</a>
          </li>
          <li>
            <a><b>{{countdown}}</b></a>
          </li>
        </ul>
        <p class="menu-label"></p>
        <ul class="menu-list">
          <li>
            <a class="button is-rounded is-info is-outlined" href="/scoreboard" target="_blank">
              <span class="icon">
                <i class="fa fa-list-ol"></i>
              </span>
              <span>Scoreboard</span>
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
        <div class="title is-5 has-text-centered" v-if="puzzles.length === 0">Congratulations you have successfully
          logged in. The game will begin shortly.
        </div>
        <div v-else>
          <puzzle :id="index" :key="index" :puzzleData="puzzles[index]" @requestHint="requestHint" @submitAnswer="submitAnswer" v-for="(puzzle, index) in puzzles"></puzzle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import puzzle from "~/components/puzzle";

  export default {
    layout: "profile",
    fetch({store, redirect}) {
      if (!store.state.authUser) {
        return redirect("/");
      } else {
        if (store.state.authUser.accountType === "admin") {
          return redirect("/admin");
        }
      }
    },
    mixins: ["socket", "countdown"],
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
          return this.$store.state.authUser;
        } else {
          return "";
        }
      },
      teamScoreAndPosition() {
        let sorted = [];
        for (let _id in this.rawTeamScores) {
          const {name, score, lastUpdated} = this.rawTeamScores[_id];
          sorted.push({teamName: name, score, lastUpdated});
        }
        sorted.sort((a, b) => {
          return a.lastUpdated - b.lastUpdated;
        });
        sorted.sort((a, b) => {
          return b.score - a.score;
        });
        let scoreAndPosition = {};
        sorted.forEach((entry, index) => {
          if (entry.teamName === this.userData.name) {
            scoreAndPosition.score = entry.score;
            scoreAndPosition.position = index + 1;
          }
        });
        return scoreAndPosition;
      }
    },
    methods: {
      submitAnswer(puzzleId, puzzleName, answer) {
        this.socket.emit("submitAnswer", {
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
            this.socket.emit("requestHint", {
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
      }
    },
    mounted() {
      this.socket.connect();
      this.socket.on("connect", () => {
        this.socket.emit("requestPuzzles");
      });
      this.socket.on("updateTeamPuzzles", puzzleData => {
        this.puzzles = puzzleData;
      });
      this.socket.on("incorrectAnswer", puzzleName => {
        this.$toast.open({
          message: `Sorry. Incorrect answer for puzzle: ${puzzleName}`,
          type: "is-danger",
          duration: 1500
        });
      });
      this.socket.on("updateGameStatus", gameData => {
        this.rawTeamScores = gameData.teamScores;
        this.gameEndTime = gameData.endTime;
        this.gameIsActive = gameData.isActive;
      });
      this.socket.on("gameStateChange", () => {
        this.$router.go({
          path: "/dashboard",
          force: true
        });
      });
    },
    beforeDestroy() {
      this.socket.disconnect();
    },
    components: {
      puzzle
    }
  };
</script>
