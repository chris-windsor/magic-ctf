<template>
  <div class="columns content">
    <div class="column">
      <h1 class="title is-4">{{puzzleData.name}}</h1>
      <h1 class="subtitle is-6">{{puzzleData.reward}}pts.</h1>
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
    props: ["puzzleData", "index"]
  };
</script>

<style>
  #add-new-hint-container {
    margin-top: 0.5rem;
  }
</style>
