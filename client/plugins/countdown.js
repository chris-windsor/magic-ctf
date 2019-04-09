import Vue from "vue";

const countdown = Vue.mixin({
  data() {
    return {
      timer: null,
      countdown: "--:--:--"
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      const currentTime = this.$moment(this.gameEndTime)
                              .valueOf();
      const endTime = this.$moment.tz(this.$store.getters["auth/timezone"])
                          .utc()
                          .valueOf();
      const diffTime = this.$moment(currentTime - endTime);
      if (this.gameIsActive) {
        this.countdown = diffTime.toISOString()
                                 .split("T")[1].split(".")[0];
      } else {
        this.countdown = "--:--:--";
      }
    }, 250);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
});
