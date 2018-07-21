<template>
  <div class="box has-text-centered" id="login-form">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="notification is-danger" v-if="loginError !== ''">{{loginError}}</div>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Username" required="" autofocus="autofocus" v-model="username" />
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="password" placeholder="Password" required="" v-model="password" />
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </p>
    </div>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button class="button is-success is-rounded" @click="login()">Login</button>
      </p>
    </div>
    <p class="has-text-blue"></p>Need an account?
    <nuxt-link class="has-text-grey" style="border-bottom: 1px solid currentColor;" tag="a" to="/register">Register</nuxt-link>
  </div>
</template>

<script>
  export default {
    layout: "auth",
    fetch({ store, redirect }) {
      if (store.state.authUser) {
        if (store.state.authUser.accountType === "admin") {
          return redirect("/admin");
        }
        return redirect("/dashboard");
      }
    },
    data() {
      return {
        username: "admin",
        password: "123"
      };
    },
    computed: {
      loginError() {
        if (this.$store.state.loginError !== "") {
          return this.$store.state.loginError;
        } else {
          return "";
        }
      }
    },
    methods: {
      login() {
        this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });
      }
    }
  };
</script>
