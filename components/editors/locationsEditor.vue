<template>
  <div>
    <b-loading :active.sync="isLoading"></b-loading>
    <p class="has-text-success has-text-weight-bold">NOTE: locations will automatically be sorted alphabetically for the register page</p>
    <location v-for="(location, index) in locations" :key="index" :location="locations[index]" :id="index" @updateLocation="updateLocation"
      @delete="deleteLocation"></location>
    <div class="buttons is-centered">
      <button class="button is-success is-rounded is-medium" @click="addNewLocation()">Add new location</button>
      <button class="button is-info is-rounded is-medium" @click="saveLocationData()">Save locations</button>
    </div>
  </div>
</template>

<script>
  import location from "~/components/editors/location"

  export default {
    data() {
      return {
        isLoading: true,
        locations: []
      }
    },
    methods: {
      loadData() {
        this.$axios.get('/api/register/locations').then(res => {
          this.locations = res.data.sort();
          this.isLoading = false;
        }).catch(err => {
          console.error(err);
        });
      },
      addNewLocation() {
        this.locations.push("");
      },
      updateLocation(id, val) {
        this.locations[id] = val;
      },
      deleteLocation(id) {
        this.locations.splice(id, 1);
      },
      saveLocationData() {
        this.$axios.post("/api/admin/settings/locations", {
          locationData: this.locations
        }).then(res => {
          this.$toast.open({
            message: 'Successfully saved the updated locations...',
            type: 'is-success',
            duration: 1500
          });
        }).catch(err => {
          this.$toast.open({
            message: 'There was an error while saving the locations...',
            type: 'is-danger',
            duration: 1500
          });
        });
      }
    },
    mounted() {
      this.loadData();
    },
    components: {
      location
    }
  }

</script>
