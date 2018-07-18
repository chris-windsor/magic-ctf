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
            <a>Elapsed Time: 0:00</a>
          </li>
          <li>
            <a>Time Left: 3:00</a>
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
              <p class="title">0</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Position</p>
              <p class="title">n/a</p>
            </div>
          </div>
        </nav>
      </div>
      <div class="box content">
        <div class="notification is-info">Challenges will show when competition has begun</div>
      </div>
    </div>
  </div>
</template>

<script>
  import socket from '~/plugins/socket.io.js'

  export default {
    layout: "profile",
    fetch({
      store,
      redirect
    }) {
      if (!store.state.authUser) {
        return redirect('/')
      } else {
        if (store.state.authUser.accountType ===
          "admin") {
          return redirect('/admin');
        }
      }
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
          }
        }
      }
    },
    methods: {
      requestHelp() {
        this.$dialog.confirm({
          message: 'Are you sure you want to request help?',
          type: 'is-success',
          title: 'Please confirm',
          confirmText: 'Yes, please',
          onConfirm: () => {
            // TODO: send request for help
            this.$toast.open({
              message: 'Requesting help...',
              type: 'is-info',
              duration: 1500
            });
          }
        })
      }
    },
    mounted() {
      socket.connect();
      socket.on("connect", () => {
        console.log("connected to socket server")
      });
    },
    beforeDestroy() {
      socket.disconnect();
    }
  }

</script>
