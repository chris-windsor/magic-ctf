<template>
  <div class="columns content">
    <div class="column">
      <h1 class="title is-4">{{teamData.name}}</h1>
      <h1 class="subtitle is-6">{{locations[teamData.locationId]}}</h1>
    </div>
    <div class="column">
      <b-field grouped position="is-right">
        <p class="control">
          <button class="button is-outlined is-small is-rounded" @click="$emit('edit', index)">
            <b-icon icon="edit"></b-icon>
          </button>
        </p>
      </b-field>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["teamData", "locations", "index"]
  };
</script>
