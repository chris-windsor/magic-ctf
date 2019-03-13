<template>
  <div>
    <b-loading :active.sync="isLoading"></b-loading>
    <p class="has-text-success has-text-weight-bold">NOTE: team names will automatically be sorted alphabetically for
      the register page</p>
    <team :id="index" :key="index" :locations="locations" :teamData="team" @delete="deleteTeam" @updateAccountName="updateTeam" v-for="(team, index) in teamList"></team>
    <div class="buttons is-centered">
      <button @click="addNewTeam" class="button is-success is-rounded is-medium">Add new team</button>
      <button @click="saveTeamList" class="button is-info is-rounded is-medium">Save teams</button>
    </div>
  </div>
</template>

<script>
  import team from "~/components/editors/team";

  export default {
    data() {
      return {
        isLoading: true,
        teamList: [],
        locations: []
      };
    },
    methods: {
      addNewTeam() {
        this.teamList.push({});
      },
      updateTeam(id, val) {
        this.teamList[id] = val;
      },
      deleteTeam(id) {
        this.teamList.splice(id, 1);
      },
      saveTeamList() {
        this.$axios
            .post("/api/admin/settings/teams", {
              teamList: this.teamList
            })
            .then(res => {
              this.$toast.open({
                message: "Successfully saved the updated teams...",
                type: "is-success",
                duration: 1500
              });
            })
            .catch(err => {
              this.$toast.open({
                message: "There was an error while saving the teams...",
                type: "is-danger",
                duration: 1500
              });
            });
      }
    },
    mounted() {
      const getTeams = this.$axios
                           .get("/api/teams")
                           .then(res => {
                             // this.teamList = res.data.sort();
                           })
                           .catch(err => {
                             console.error(err);
                           });
      const getLocations = this.$axios
                               .get("/api/locations")
                               .then(res => {
                                 this.locations = res.data.sort();
                               })
                               .catch(err => {
                                 console.error(err);
                               });
      Promise.all([getTeams, getLocations])
             .then(() => {
               this.isLoading = false;
             });
    },
    components: {
      team
    }
  };
</script>
