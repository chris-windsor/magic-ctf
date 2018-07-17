<template>
  <div class="columns">
    <div class="column is-2">
      <aside class="menu">
        <p class="menu-label">Info:</p>
        <ul class="menu-list" id="sidebar-info">
          <li>
            <a>Elapsed Time: 0:00</a>
          </li>
          <li>
            <a>Time Left: 3:00</a>
          </li>
        </ul>
        <br/>
        <ul class="menu-list">
          <li class="has-text-centered">
            <button class="button is-medium is-rounded is-loading" id="toggle-status-btn"></button>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-10">
      <div class="box content">
        <div class="tabs is-centered is-boxed is-medium">
          <ul>
            <li class="control-panel-tab" data-cpid="puzzles">
              <a>
                <span class="icon is-small">
                  <i class="fas fa-file-alt" aria-hidden="true"></i>
                </span>
                <span>Puzzles</span>
              </a>
            </li>
            <li class="control-panel-tab" data-cpid="mechanics">
              <a>
                <span class="icon is-small">
                  <i class="fas fa-sliders-h" aria-hidden="true"></i>
                </span>
                <span>Mechanics</span>
              </a>
            </li>
            <li class="control-panel-tab" data-cpid="locations">
              <a>
                <span class="icon is-small">
                  <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
                </span>
                <span>Locations</span>
              </a>
            </li>
            <li class="control-panel-tab" data-cpid="data">
              <a>
                <span class="icon is-small">
                  <i class="far fa-chart-bar" aria-hidden="true"></i>
                </span>
                <span>Data</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="notification is-info" id="control-panel-info">Select a tab above to edit game settings.</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: "profile",
    computed: {
      username() {
        if (this.$store.state.authUser !== null) {
          return this.$store.state.authUser.username
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
        if (store.state.authUser.accountType === "player") {
          return redirect('/dashboard');
        }
      }
    }
  }

</script>
