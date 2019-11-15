<template>
  <div class="modal-card" style="width: auto">
    <div class="box">
      <div>
        <h1 class="title is-4">Edit team</h1>
      </div>
      <b-field>
        <b-input v-model="teamData.name"></b-input>
      </b-field>
      <b-field>
        <b-select placeholder="Location" v-model="teamData.locationId">
          <option v-for="(loc, idx) in locations" :value="idx" :key="idx">{{loc}}</option>
        </b-select>
      </b-field>
      <b-field>
        <p class="control">
          <button class="button" @click="generateRndPswd">
            <b-icon icon="redo" size="is-small"></b-icon>
          </button>
        </p>
        <b-input placeholder="Password"
                 type="text" v-model="newPassword" expanded></b-input>
      </b-field>
      <b-field grouped position="is-centered">
        <b-field>
          <p class="control">
            <button class="button is-success" @click="$emit('update')">Update</button>
          </p>
        </b-field>
        <b-field>
          <p class="control">
            <button class="button is-danger" @click="$emit('delete', index, teamData._id)">Delete</button>
          </p>
        </b-field>
      </b-field>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["teamData", "locations", "index"],
    data() {
      return {
        newPassword: ''
      }
    },
    methods: {
      generateRndPswd() {
        const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        this.newPassword = new Array(8).fill("-").map(_ => {
          return charList[Math.floor(Math.random() * charList.length)]
        }).join("");
        this.teamData.password = this.newPassword;
      },
    }
  }
</script>
