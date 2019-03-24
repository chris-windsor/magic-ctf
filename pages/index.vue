<template>
  <div class="box has-text-centered" id="login-form">
    <img draggable="false" id="form-icon" src="~/assets/ctficon.png">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="notification is-danger" v-if="loginError !== ''">{{loginError}}</div>
    <form @submit="submitForm($event)" action="/">
      <b-field>
        <b-autocomplete
          :data="teamList"
          :keep-first="false"
          :open-on-focus="true"
          @select="option => selected = option"
          autofocus
          icon="user"
          placeholder="Team name"
          v-model="teamName">
        </b-autocomplete>
      </b-field>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" placeholder="Password" required="" type="password" v-model="password"/>
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
      if (store.state.authUser) {
        if (store.state.authUser.accountType === "admin") {
          return redirect("/admin");
        }
        return redirect("/dashboard");
      }
    },
    data() {
      return {
        teamList: [],
        teamName: "",
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
          accountName: this.teamName,
          password: this.password
        });
      }
    },
    mounted() {
      this.$axios
          .get("/api/teams")
          .then(res => {
            this.teamList = res.data.sort();
          })
          .catch(err => {
            console.error(err);
          });
    }
  };
</script>
