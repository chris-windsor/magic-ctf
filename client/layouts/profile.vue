<template>
  <div class="is-unselectable">
    <nav class="navbar is-white">
      <div class="navbar-brand">
        <div class="navbar-item">
          <h1 class="title is-3">MAGIC CTF</h1>
        </div>
        <div :class="{ 'is-active': showNav }" @click="showNav = !showNav" class="navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div :class="{ 'is-active': showNav }" class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <a @click="logout()" class="button is-danger is-rounded is-outlined">
                  <span class="icon">
                    <i aria-hidden="true" class="fa fa-user"></i>
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
      <nuxt/>
    </section>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>Made in collaboration with <a href="https://magicinc.org/">MAGIC INC | Mid-Atlantic Gigabit Innovation Collaboratory</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import "moment-timezone";

  export default {
    data() {
      return {
        showNav: false
      };
    },
    methods: {
      logout() {
        this.$store.dispatch("auth/logout");
      }
    },
    mounted() {
      this.$axios.setHeader("x-access-token", localStorage.getItem("token"));
      this.$store.commit("auth/SET_USER_TIMEZONE", this.$moment.tz.guess());
      this.$axios.interceptors.response.use(res => {
        return res;
      }, (err) => {
        if (err.response.status === 401) {
          this.logout();
        }
        Promise.reject({...err});
      })
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
