<template>
  <div>
    <div class="columns">
      <div class="column is-4">
        <div class="box">
          <div class="field">
            <div class="control has-icons-left is-expanded">
              <input class="input is-info" placeholder="Puzzle title" type="text" v-model="puzzleData.title">
              <span class="icon is-left">
                <i class="fa fa-pencil-alt"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left is-expanded">
              <input class="input is-info" placeholder="Puzzle flag" type="text" v-model="puzzleData.answer">
              <span class="icon is-left">
                <i class="fa fa-flag"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left is-expanded">
              <input class="input is-info" placeholder="Puzzle reward" type="number" v-model.number="puzzleData.value">
              <span class="icon is-left">
                <i class="fa fa-money-bill-alt"></i>
              </span>
            </div>
          </div>
          <button @click="$emit('delete', id)" class="button is-danger is-rounded is-small">Delete puzzle</button>
        </div>
        <button @click="$emit('addNew', id)" class="button is-success is-rounded">Add new puzzle below</button>
      </div>
      <div class="column is-8">
        <h1 class="title is-5" v-if="puzzleData.hints.length > 1">Hints:</h1>
        <h1 class="title is-5" v-else>Hint:</h1>
        <div>
          <hint :hintData="puzzleData.hints[index]" :id="index" :key="index" @delete="deleteHint"
                v-for="(hint, index) in puzzleData.hints"></hint>
          <div class="has-text-centered" id="add-new-hint-container">
            <button @click="addNewHint()" class="button is-success is-rounded">Add new hint</button>
          </div>
        </div>
      </div>
    </div>
    <hr v-if="isLast === true">
  </div>
</template>

<script>
  import hint from "~/components/editors/hint";

  export default {
    props: ["puzzleData", "id", "isLast"],
    methods: {
      addNewHint() {
        this.$emit("addNewHint", this.id);
      },
      deleteHint(hintId) {
        this.$emit("deleteHint", this.id, hintId);
      }
    },
    components: {
      hint
    }
  };
</script>

<style>
  #add-new-hint-container {
    margin-top: 0.5rem;
  }
</style>
