<template>
  <div class="box has-text-centered" id="login-form">
    <img draggable="false" id="form-icon" src="~/assets/ctficon.png">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="notification is-danger" v-if="loginError !== ''">{{loginError}}</div>
    <form @submit="submitForm($event)">
      <div class="field">
        <p class="control has-icons-left">
          <input autofocus class="input" placeholder="Password" required="" type="password" v-model="password"/>
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button @click="login()" class="button is-success is-rounded">Login</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    fetch({store, redirect}) {
      if (store.getters["auth/authUser"]) {
        if (store.getters["auth/authUser"].accountType === "admin") {
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
        if (this.$store.getters["auth/loginError"] !== "") {
          return this.$store.getters["auth/loginError"];
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
        this.$store.dispatch("auth/login", {
          accountName: "admin",
          password: this.password
        });
      }
    }
  };
</script>
