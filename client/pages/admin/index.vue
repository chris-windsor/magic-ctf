<template>
  <div class="columns">
    <div class="column is-2">
      <aside class="menu">
        <p class="menu-label">Info:</p>
        <ul class="menu-list" id="sidebar-info">
          <li>
            <a>Remaining time:</a>
          </li>
          <li>
            <a><b>{{countdown}}</b></a>
          </li>
        </ul>
        <br/>
        <ul class="menu-list">
          <li class="has-text-centered">
            <button
              :class="{'is-loading': gameStateBtnLoading, 'is-success': !gameStateBtnLoading && !gameIsActive,  'is-danger': !gameStateBtnLoading && gameIsActive}"
              @click="toggleGameState()" class="button is-medium is-rounded">
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
        <b-tabs class="is-medium admin-nav" position="is-centered" type="is-boxed" v-model="selectedTab">
          <b-tab-item :visible="false"></b-tab-item>
          <b-tab-item :visible="!gameIsActive" icon="file-alt" label="Puzzles"></b-tab-item>
          <b-tab-item icon="sliders-h" label="Mechanics"></b-tab-item>
          <b-tab-item :visible="!gameIsActive" icon="map-marked-alt" label="Locations"></b-tab-item>
          <b-tab-item icon="user-friends" label="Teams"></b-tab-item>
          <b-tab-item icon="chart-bar" label="Data"></b-tab-item>
        </b-tabs>
        <div class="notification is-info" v-if="selectedTab === 0">Select a tab above to edit game settings.</div>
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
  import "moment-timezone";
  import dataViewer from "~/components/editors/dataViewer";
  import locationsEditor from "~/components/editors/locationsEditor";
  import mechanicsEditor from "~/components/editors/mechanicsEditor";
  import puzzlesEditor from "~/components/editors/puzzlesEditor";
  import teamsEditor from "~/components/editors/teamsEditor";

  export default {
    layout: "profile",
    fetch({store, redirect}) {
      if (!store.getters["auth/authUser"]) {
        return redirect("/");
      } else {
        if (store.getters["auth/authUser"].accountType === "player") {
          return redirect("/dashboard");
        }
      }
    },
    mixins: ["socket", "countdown"],
    data() {
      return {
        selectedTab: 0,
        tabMappings: {
          1: "puzzlesEditor",
          2: "mechanicsEditor",
          3: "locationsEditor",
          4: "teamsEditor",
          5: "dataViewer"
        },
        gameStateBtnLoading: true,
        gameIsActive: false,
        gameEndtime: null
      };
    },
    computed: {
      gameStateBtnLabel() {
        return !this.gameStateBtnLoading && !this.gameIsActive
          ? "Start CTF"
          : "Stop CTF";
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
              this.socket.emit("adminCommand", {
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
          this.socket.emit("adminCommand", {
            name: "start"
          });
        }
      }
    },
    mounted() {
      this.socket.connect();
      this.socket.on("updateGameStatus", gameData => {
        if (gameData.endTime !== undefined) this.gameEndTime = gameData.endTime;
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
    },
    beforeDestroy() {
      this.socket.disconnect();
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
  .admin-nav ul {
    margin-left: 0;
  }

  .b-tabs .tab-content {
    padding: 0;
  }
</style>
