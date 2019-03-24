<template>
  <div class="columns">
    <div class="column is-2">
      <aside class="menu">
        <p class="menu-label">Info:</p>
        <ul class="menu-list" id="sidebar-info">
          <li>
            <a>Time Left: {{timeLeft}}</a>
          </li>
        </ul>
        <br/>
        <ul class="menu-list">
          <li class="has-text-centered">
            <button :class="{'is-loading': gameStateBtnLoading, 'is-success': !gameStateBtnLoading && !gameIsActive,  'is-danger': !gameStateBtnLoading && gameIsActive}" @click="toggleGameState()" class="button is-medium is-rounded">
              {{gameStateBtnLabel}}
            </button>
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
    <div class="column is-10">
      <div class="box content">
        <b-tabs class="is-medium" position="is-centered" type="is-boxed" v-model="selectedTab">
          <b-tab-item icon="file-alt" label="Puzzles"></b-tab-item>
          <b-tab-item icon="sliders-h" label="Mechanics"></b-tab-item>
          <b-tab-item icon="map-marked-alt" label="Locations"></b-tab-item>
          <b-tab-item icon="user-friends" label="Teams"></b-tab-item>
          <b-tab-item icon="chart-bar" label="Data"></b-tab-item>
        </b-tabs>
        <div class="notification is-info" v-if="!selectedTab">Select a tab above to edit game settings.</div>
        <div v-else>
          <keep-alive>
            <component :is="tabMappings[selectedTab]"></component>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dataViewer from "~/components/editors/dataViewer";
  import locationsEditor from "~/components/editors/locationsEditor";
  import mechanicsEditor from "~/components/editors/mechanicsEditor";
  import puzzlesEditor from "~/components/editors/puzzlesEditor";
  import teamsEditor from "~/components/editors/teamsEditor";
  import socket from "~/plugins/socket.io.js";

  export default {
    layout: "profile",
    fetch({store, redirect}) {
      if (!store.state.authUser) {
        return redirect("/");
      } else {
        if (store.state.authUser.accountType === "player") {
          return redirect("/dashboard");
        } else if (store.state.authUser.accountType === "coach") {
          return redirect("/coach");
        }
      }
    },
    data() {
      return {
        selectedTab: null,
        tabMappings: {
          0: "puzzlesEditor",
          1: "mechanicsEditor",
          2: "locationsEditor",
          3: "teamsEditor",
          4: "dataViewer"
        },
        gameStateBtnLoading: true,
        gameIsActive: false,
        remainingTime: 0
      };
    },
    computed: {
      gameStateBtnLabel() {
        return !this.gameStateBtnLoading && !this.gameIsActive
          ? "Start CTF"
          : "Stop CTF";
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
      toggleGameState() {
        if (this.gameIsActive) {
          this.$dialog.confirm({
            message: "Are you sure you want to stop the game?",
            type: "is-danger",
            title: "Please confirm",
            confirmText: "Yes, continue",
            onConfirm: () => {
              this.gameIsActive = false;
              socket.emit("adminCommand", {
                name: "stop"
              });
              this.$toast.open({
                message: "Stopping game...",
                type: "is-info",
                duration: 1500
              });
            }
          });
        } else {
          this.gameIsActive = true;
          socket.emit("adminCommand", {
            name: "start"
          });
        }
      }
    },
    mounted() {
      socket.connect();
      socket.on("updateGameStatus", gameData => {
        if (gameData.remainingTime !== undefined)
          this.remainingTime = gameData.remainingTime;
        if (gameData.isActive !== undefined) {
          if (gameData.isActive === false) {
            this.gameStateBtnLoading = false;
            this.gameIsActive = false;
          } else {
            this.gameStateBtnLoading = false;
            this.gameIsActive = true;
          }
        }
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
      puzzlesEditor,
      mechanicsEditor,
      locationsEditor,
      teamsEditor,
      dataViewer
    }
  };
</script>

<style>
  .b-tabs .tab-content {
    padding: 0;
  }
</style>
