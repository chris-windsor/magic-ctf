<template>
  <div class="is-unselectable">
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <div class="navbar-item">
          <h1 class="title is-3">MAGIC CTF</h1>
        </div>
        <div class="navbar-burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <a class="button is-danger is-rounded is-outlined" @click="logout()">
                  <span class="icon">
                    <i class="fa fa-user" aria-hidden="true"></i>
                  </span>
                  <span>Logout</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section class="container is-fluid">
      <nuxt />
    </section>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>Copyright © 2018 Chris Windsor</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showNav: false
      };
    },
    methods: {
      logout() {
        this.$store.dispatch("logout");
      }
    }
  };
</script>

<style>
  html,
  body {
    background: #f2f6fa;
  }

  footer {
    background-color: #f2f6fa !important;
  }

  .container .columns {
    margin: 1rem 0 0 0;
  }

  .navbar-menu .navbar-item {
    padding: 0 2rem;
  }

  aside.menu .menu-list {
    line-height: 1.5;
  }

  .menu-list a:hover {
    background-color: rgb(223, 223, 223);
  }

  aside.menu .menu-label {
    padding-left: 10px;
    font-weight: 700;
  }

  ul.menu-list#sidebar-info li a {
    cursor: default;
  }
</style>
