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
        <div class="tabs is-centered is-boxed is-medium">
          <ul>
            <li :class="{'is-active': selectedSettings === 'puzzles'}" @click="changeSettingsTab('puzzles')" class="control-panel-tab">
              <a>
                <span class="icon is-small">
                  <i aria-hidden="true" class="fas fa-file-alt"></i>
                </span>
                <span>Puzzles</span>
              </a>
            </li>
            <li :class="{'is-active': selectedSettings === 'mechanics'}" @click="changeSettingsTab('mechanics')" class="control-panel-tab">
              <a>
                <span class="icon is-small">
                  <i aria-hidden="true" class="fas fa-sliders-h"></i>
                </span>
                <span>Mechanics</span>
              </a>
            </li>
            <li :class="{'is-active': selectedSettings === 'locations'}" @click="changeSettingsTab('locations')" class="control-panel-tab">
              <a>
                <span class="icon is-small">
                  <i aria-hidden="true" class="fas fa-map-marked-alt"></i>
                </span>
                <span>Locations</span>
              </a>
            </li>
            <li :class="{'is-active': selectedSettings === 'teams'}" @click="changeSettingsTab('teams')" class="control-panel-tab">
              <a>
                <span class="icon is-small">
                  <i aria-hidden="true" class="fas fa-user-friends"></i>
                </span>
                <span>Teams</span>
              </a>
            </li>
            <li :class="{'is-active': selectedSettings === 'data'}" @click="changeSettingsTab('data')" class="control-panel-tab">
              <a>
                <span class="icon is-small">
                  <i aria-hidden="true" class="far fa-chart-bar"></i>
                </span>
                <span>Data</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="notification is-info" v-if="selectedSettings === ''">Select a tab above to edit game settings.</div>
        <div v-else>
          <keep-alive>
            <component :is="editorCompName"></component>
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
        selectedSettings: "",
        editorCompName: "",
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
      changeSettingsTab(tabName) {
        this.selectedSettings = tabName;
        switch (tabName) {
          case "puzzles":
          case "mechanics":
          case "locations":
          case "teams":
            this.editorCompName = tabName + "Editor";
            break;
          case "data":
            this.editorCompName = tabName + "Viewer";
            break;
        }
      },
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
