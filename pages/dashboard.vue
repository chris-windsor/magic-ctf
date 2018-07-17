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
            <a class="button is-rounded is-warning is-outlined" href="#">
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
  export default {
    layout: "profile",
    computed: {
      userData() {
        if (this.$store.state.authUser !== null) {
          return this.$store.state.authUser;
        }
      }
    },
    fetch({
      store,
      redirect
    }) {
      if (!store.state.authUser) {
        return redirect('/')
      } else {
        if (store.state.authUser.accountType === "admin") {
          return redirect('/admin');
        }
        // passed all checks for player...
        document.title = `MAGIC CTF | ${store.state.authUser.teamName}`;
      }
    }
  }

</script>
