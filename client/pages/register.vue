<template>
  <div class="box has-text-centered" id="login-form">
    <img draggable="false" id="form-icon" src="~/assets/ctficon.png">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="notification is-danger" v-if="registerError !== ''">{{registerError}}</div>
    <form @submit="submitForm($event)" action="/register">
      <div class="field">
        <p class="control has-icons-left">
          <input autofocus="autofocus" class="input" placeholder="Team name" required="" type="text"
                 v-model="userData.name"/>
          <span class="icon is-small is-left">
            <i class="fa fa-user"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <div class="control has-icons-left">
          <div class="select is-fullwidth">
            <select required="" v-model="userData.locationId">
              <option disabled="disabled" selected="selected" value="-1">Location</option>
              <option :key="index" :value="index" v-for="(loc, index) in locations">{{loc}}</option>
            </select>
          </div>
          <span class="icon is-left">
            <i class="fa fa-globe"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" placeholder="Password" required="" type="password" v-model="userData.password"/>
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" placeholder="Confirm Password" required="" type="password"
                 v-model="userData.passwordConf"/>
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button @click="register()" class="button is-success is-rounded">Register</button>
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
        userData: {
          name: "",
          locationId: -1,
          password: "",
          passwordConf: ""
        },
        locations: []
      };
    },
    computed: {
      registerError() {
        if (this.$store.getters["auth/registerError"] !== "") {
          return this.$store.getters["auth/registerError"];
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
        this.$store.dispatch("auth/register", this.userData);
      }
    },
    mounted() {
      this.$axios
        .get("/api/locations")
        .then(res => {
          this.locations = res.data.sort();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
</script>
