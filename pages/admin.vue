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
            <button class="button is-medium is-rounded" :class="{'is-loading': gameStateBtnLoading, 'is-success': !gameStateBtnLoading && !gameIsActive,  'is-danger': !gameStateBtnLoading && gameIsActive}" @click="toggleGameState()">{{gameStateBtnLabel}}</button>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-10">
      <div class="box content">
        <div class="tabs is-centered is-boxed is-medium">
          <ul>
            <li class="control-panel-tab" :class="{'is-active': selectedSettings === 'puzzles'}" @click="changeSettingsTab('puzzles')">
              <a>
                <span class="icon is-small">
                  <i class="fas fa-file-alt" aria-hidden="true"></i>
                </span>
                <span>Puzzles</span>
              </a>
            </li>
            <li class="control-panel-tab" :class="{'is-active': selectedSettings === 'mechanics'}" @click="changeSettingsTab('mechanics')">
              <a>
                <span class="icon is-small">
                  <i class="fas fa-sliders-h" aria-hidden="true"></i>
                </span>
                <span>Mechanics</span>
              </a>
            </li>
            <li class="control-panel-tab" :class="{'is-active': selectedSettings === 'locations'}" @click="changeSettingsTab('locations')">
              <a>
                <span class="icon is-small">
                  <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
                </span>
                <span>Locations</span>
              </a>
            </li>
            <li class="control-panel-tab" :class="{'is-active': selectedSettings === 'data'}" @click="changeSettingsTab('data')">
              <a>
                <span class="icon is-small">
                  <i class="far fa-chart-bar" aria-hidden="true"></i>
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
  import socket from "~/plugins/socket.io.js";
  import puzzlesEditor from "~/components/editors/puzzlesEditor";
  import mechanicsEditor from "~/components/editors/mechanicsEditor";
  import locationsEditor from "~/components/editors/locationsEditor";
  import dataViewer from "~/components/editors/dataViewer";

  export default {
    layout: "profile",
    fetch({ store, redirect }) {
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
                command: "stop"
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
            command: "start"
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
      dataViewer
    }
  };
</script>
