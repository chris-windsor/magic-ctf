<template>
  <div class="box">
    <div class="field is-grouped is-horizontal">
      <div class="control has-icons-left is-expanded">
        <input @input="$emit('updateTeamData', id, teamData)" class="input is-info" placeholder="Team name" type="text" v-model="teamData.name">
        <span class="icon is-left">
          <i class="fa fa-id-card"></i>
        </span>
      </div>
      <div class="control has-icons-left is-expanded">
        <div class="select is-info is-fullwidth">
          <select @change="$emit('updateTeamData', id, teamData)" v-model="teamData.locationId">
            <option disabled="disabled" selected="selected" value="-1">Location</option>
            <option :key="index" :value="index" v-for="(loc, index) in locations">{{loc}}</option>
          </select>
        </div>
        <span class="icon is-left">
          <i class="fa fa-broadcast-tower"></i>
        </span>
      </div>
      <div class="control has-icons-left is-expanded">
        <input @input="$emit('updateTeamData', id, teamData)" class="input is-info" placeholder="Team password" type="text" v-model="teamData.password">
        <span class="icon is-left">
          <i class="fa fa-lock"></i>
        </span>
      </div>
      <p class="control">
        <a @click="$emit('delete', id)" class="button is-danger">
          <span class="icon is-small">
            <i class="fas fa-times"></i>
          </span>
        </a>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["teamData", "locations", "id"]
  };
</script>
