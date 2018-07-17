<template>
  <div class="box has-text-centered" id="login-form">
    <h1 class="title is-3">MAGIC CTF</h1>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Username" required="" autofocus="autofocus" v-model="userdata.username" />
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Team Name" required="" v-model="userdata.teamName" />
        <span class="icon is-small is-left">
          <i class="fa fa-user-friends"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <div class="control has-icons-left">
        <div class="select is-fullwidth">
          <select required="" v-model="userdata.locationId">
            <option disabled="disabled" selected="selected" value="-1">Location</option>
            <option v-for="(loc, index) in possibleLocations" :key="index" :value="index">{{loc}}</option>
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
    <p class="has-text-blue"></p>Already have an account?
    <nuxt-link class="has-text-grey" style="border-bottom: 1px solid currentColor;" tag="a" to="/">Login</nuxt-link>
  </div>
</template>

<script>
  export default {
    // TODO: auth error handling with notification repsonses
    layout: "auth",
    data() {
      return {
        userdata: {
          username: "",
          teamName: "",
          locationId: -1,
          password: "",
          passwordConf: ""
        },
        // TODO: load data from server through socket
        possibleLocations: ["maryland 1", "maryland 2", "maryland 3", "north carolina 1", "idaho 1"]
      }
    },
    methods: {
      register() {
        this.$store.dispatch("register", this.userdata)
      }
    }
  }

</script>
