<template>
  <div class="box has-text-centered" id="login-form">
    <img src="~/assets/ctficon.png" id="form-icon" draggable="false">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="notification is-danger" v-if="loginError !== ''">{{loginError}}</div>
    <form @submit="submitForm($event)">
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="password" placeholder="Password" required="" v-model="password" autofocus />
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
    </form>
  </div>
</template>

<script>
  export default {
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
        password: ""
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
      submitForm(e) {
        e.preventDefault();
      },
      login() {
        this.$store.dispatch("login", {
          accountName: "admin",
          password: this.password
        });
      }
    }
  };
</script>
