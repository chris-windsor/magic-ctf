<template>
  <div class="columns">
    <b-loading :active.sync="isLoading"></b-loading>
    <div class="column is-3">
      <h1 class="title is-5">Game end time:</h1>
      <b-field grouped>
        <b-timepicker
          hour-format="12"
          icon="clock"
          placeholder="Click to select..."
          rounded
          v-model="gameEndTime">
        </b-timepicker>
        <p class="control">
          <a @click="updateGameLength()" class="button is-success">Update</a>
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
        gameEndTime: undefined
      };
    },
    methods: {
      updateGameLength() {
        this.$axios
            .post("/api/admin/settings/gamelength", {
              gameEndTime: this.$moment(this.gameEndTime)
                               .tz(this.$store.state.timezone)
                               .utc()
                               .toISOString()
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
            this.gameEndTime = this.$moment(res.data.endTime)
                                   .toDate();
            this.isLoading = false;
          })
          .catch(err => {
            console.error(err);
          });
    }
  };
</script>
