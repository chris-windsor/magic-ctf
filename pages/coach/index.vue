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
        help requests will be displayed here
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
        gameLength: ""
      };
    },
    mounted() {
      socket.connect();
    },
    beforeDestroy() {
      socket.disconnect();
    }
  };
</script>
