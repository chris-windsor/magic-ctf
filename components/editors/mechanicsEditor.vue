<template>
  <div class="columns">
    <b-loading :active.sync="isLoading"></b-loading>
    <div class="column is-3">
      <h1 class="title is-5">Game end time:</h1>
      <b-field grouped>
        <b-timepicker
          rounded
          placeholder="Click to select..."
          icon="clock"
          hour-format="12"
          :increment-minutes="10"
          v-model="gameEndTime">
        </b-timepicker>
        <p class="control">
          <a class="button is-success" @click="updateGameLength()">Update</a>
        </p>
      </b-field>
    </div>
  </div>
</template>

<script>
  import "moment-timezone";

  export default {
    data() {
      return {
        isLoading: true,
        gameEndTime: undefined,
      };
    },
    methods: {
      updateGameLength() {
        console.log(this.gameEndTime.getHours());
        console.log(this.$moment(this.gameEndTime).tz("America/New_York").utc());
        this.$axios
          .post("/api/admin/settings/gamelength", {
            gameEndTime: this.gameEndTime
          })
          .then(res => {
            this.$toast.open({
              message: "Successfully updated the game length...",
              type: "is-success",
              duration: 1500
            });
          })
          .catch(err => {
            this.$toast.open({
              message: "There was an error while updating the game length...",
              type: "is-danger",
              duration: 1500
            });
          });
      }
    },
    mounted() {
      this.$axios
        .get("/api/admin/settings/gamelength")
        .then(res => {
          console.log(res);
          this.isLoading = false;
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
</script>
