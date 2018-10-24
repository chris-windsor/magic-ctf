<template>
  <div class="box has-text-centered" id="login-form">
    <img src="~/assets/ctficon.png" id="form-icon" draggable="false">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="notification is-danger" v-if="registerError !== ''">{{registerError}}</div>
    <form action="/register" @submit="submitForm($event)">
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="text" placeholder="Username" required="" autofocus="autofocus" v-model="userdata.username" />
          <span class="icon is-small is-left">
            <i class="fa fa-user"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <b-autocomplete v-model="userdata.teamName" placeholder="Team name" required="" icon-pack="fa" icon="user-friends" :open-on-focus="true" :data="teams" @select="option => selected = option">
        </b-autocomplete>
      </div>
      <div class="field">
        <div class="control has-icons-left">
          <div class="select is-fullwidth">
            <select required="" v-model="userdata.locationId">
              <option disabled="disabled" selected="selected" value="-1">Location</option>
              <option v-for="(loc, index) in locations" :key="index" :value="index">{{loc}}</option>
            </select>
          </div>
          <span class="icon is-left">
            <i class="fa fa-globe"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="password" placeholder="Password" required="" v-model="userdata.password" />
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="password" placeholder="Confirm Password" required="" v-model="userdata.passwordConf" />
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-success is-rounded" @click="register()">Register</button>
        </p>
      </div>
    </form>
    <p class="has-text-blue"></p>Already have an account?
    <nuxt-link class="has-text-grey" style="border-bottom: 1px solid currentColor;" tag="a" to="/">Login</nuxt-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userdata: {
          username: "",
          teamName: "",
          locationId: -1,
          password: "",
          passwordConf: ""
        },
        locations: [],
        teams: []
      };
    },
    computed: {
      registerError() {
        if (this.$store.state.registerError !== "") {
          return this.$store.state.registerError;
        } else {
          return "";
        }
      }
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
      },
      register() {
        this.$store.dispatch("register", this.userdata);
      }
    },
    mounted() {
      this.$axios
        .get("/api/register/locations")
        .then(res => {
          this.locations = res.data.sort();
        })
        .catch(err => {
          console.error(err);
        });
      this.$axios
        .get("/api/register/teams")
        .then(res => {
          this.teams = res.data.sort();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
</script>
