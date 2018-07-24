<template>
  <div class="columns">
    <div class="column is-2">
      <aside class="menu">
        <p class="menu-label">Info:</p>
        <ul class="menu-list" id="sidebar-info">
          <li>
            <a>Time Left: 3:00</a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-10">
      <div class="box content">
        <h1 class="title is-4">Help requests:</h1>
        <b-loading :active.sync="isLoading"></b-loading>
        <ul v-if="helpRequests.length > 0">
          <li class="title is-4" v-for="(req, index) in helpRequests" :key="index">{{req}}
            <button class="button is-danger is-small is-rounded" @click="removeRequest(index)">
              <span class="icon is-small">
                <i class="fas fa-times"></i>
              </span>
              <span>remove</span>
            </button>
          </li>
        </ul>
        <div class="notification is-info" v-if="helpRequests.length === 0 && isLoading === false">
          Help requests will display here when there is any.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import socket from "~/plugins/socket.io.js";

  export default {
    layout: "profile",
    fetch({ store, redirect }) {
      if (!store.state.authUser) {
        return redirect("/");
      } else {
        if (store.state.authUser.accountType === "player") {
          return redirect("/dashboard");
        } else if (store.state.authUser.accountType === "admin") {
          return redirect("/admin");
        }
      }
    },
    data() {
      return {
        gameLength: "",
        helpRequests: [],
        isLoading: true
      };
    },
    methods: {
      removeRequest(id) {
        this.helpRequests.splice(id, 1);
        socket.emit("removeHelpRequest", id);
      }
    },
    mounted() {
      socket.connect();
      socket.on("updateHelpRequests", requests => {
        this.helpRequests = requests;
        this.isLoading = false;
      });
    },
    beforeDestroy() {
      socket.disconnect();
    }
  };
</script>
