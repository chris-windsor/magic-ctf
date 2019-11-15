<template>
  <div>
    <b-loading :active.sync="isLoading"></b-loading>
    <b-modal :active.sync="isEditing" has-modal-card trap-focus>
      <team-edit-modal :teamData="teamList[teamInEdit]" :index="teamInEdit" @delete="deleteTeam" @update="saveTeamList"
                       :locations="locations"></team-edit-modal>
    </b-modal>
    <b-field horizontal>
      <b-input placeholder="Team name/location" type="search" icon="search" rounded v-model="searchValue"></b-input>
      <button @click="addNewTeam" class="button is-success is-rounded">Add new team</button>
    </b-field>
    <hr>
    <team :index="idx" :key="idx" :locations="locations" :teamData="team" @edit="editTeam"
          v-for="(team, idx) in teamList.filter(e => new RegExp(this.searchValue, 'gi').test(locations[e.locationId] + e.name))"></team>
  </div>
</template>

<script>
  import team from "./team";
  import teamEditModal from "./teamEditModal";

  export default {
    data() {
      return {
        isLoading: true,
        isEditing: false,
        teamList: [],
        locations: [],
        searchValue: '',
        teamInEdit: undefined
      };
    },
    methods: {
      retrieveTeams() {
        return new Promise((resolve, reject) => {
          this.$axios
            .get("/api/admin/settings/teams")
            .then(res => {
              this.teamList = res.data.sort((a, b) => {
                const t1 = a.name.toUpperCase();
                const t2 = b.name.toUpperCase();
                return (t1 < t2) ? -1 : (t1 > t2) ? 1 : 0;
              });
              resolve('test');
            })
            .catch(err => {
              console.error(err);
              reject();
            });
        });
      },
      addNewTeam() {
        this.teamList.push({
          name: `newTeam${Math.floor(Math.random() * 50)}`
        });
        this.teamInEdit = this.teamList.length - 1;
        this.isEditing = true;
      },
      editTeam(idx) {
        this.isEditing = true;
        this.teamInEdit = idx;
      },
      deleteTeam(idx, _id) {
        this.isEditing = false;
        this.$dialog.confirm({
          message: `Are you sure you want to delete the team: '${this.teamList[idx].name}' ?`,
          type: "is-danger",
          title: "Please confirm",
          confirmText: "Yes, continue",
          onConfirm: () => {
            this.$axios.post("/api/admin/settings/deactivateteam", {
              teamId: _id
            })
              .then(() => {
                this.teamList.splice(idx, 1);
              });
          }
        });
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
            this.isEditing = false;
            this.isLoading = true;
            this.retrieveTeams()
              .then(() => {
                this.isLoading = false;
              });
          })
          .catch(err => {
            this.isEditing = false;
            this.$toast.open({
              message: "There was an error while saving the teams...",
              type: "is-danger",
              duration: 1500
            });
          });
      }
    },
    mounted() {
      const getTeams = this.retrieveTeams();
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
      team,
      teamEditModal
    }
  };
</script>
