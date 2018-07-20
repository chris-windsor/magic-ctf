<template>
  <div class="columns">
    <b-loading :active.sync="isLoading"></b-loading>
    <div class="column is-3">
      <h1 class="title is-5">Game length:</h1>
      <div class="field is-grouped">
        <div class="control">
          <div class="select is-info is-fullwidth">
            <select v-model="selectedHour">
              <option v-for="(hr, index) in hours" :key="index">{{hr}}hr</option>
            </select>
          </div>
        </div>
        <div class="control">
          <div class="select is-info is-fullwidth">
            <select v-model="selectedMinute">
              <option v-for="(min, index) in minutes" :key="index">{{min}}min</option>
            </select>
          </div>
        </div>
        <p class="control">
          <a class="button is-success" @click="updateGameLength()">Update</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isLoading: true,
        hours: [1, 2, 3, 4],
        minutes: [0, 15, 30, 45],
        selectedHour: "",
        selectedMinute: ""
      }
    },
    methods: {
      updateGameLength() {
        this.$axios.post("/api/admin/settings/gamelength", {
          hr: this.selectedHour,
          min: this.selectedMinute
        }).then(res => {
          this.$toast.open({
            message: 'Successfully updated the game length...',
            type: 'is-success',
            duration: 1500
          });
        }).catch(err => {
          this.$toast.open({
            message: 'There was an error while updating the game length...',
            type: 'is-danger',
            duration: 1500
          });
        });
      }
    },
    mounted() {
      let length = this.$parent.gameLength.split(":");
      this.selectedHour = `${length[0]}`;
      this.selectedMinute = `${length[1]}`;
      this.isLoading = false;
    }
  }

</script>
