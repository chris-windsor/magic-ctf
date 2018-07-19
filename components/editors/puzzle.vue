<template>
  <div>
    <div class="columns">
      <div class="column is-4">
        <div class="box">
          <div class="field">
            <div class="control has-icons-left is-expanded">
              <input type="text" class="input is-info" placeholder="Puzzle title" v-model="puzzleData.title">
              <span class="icon is-left">
                <i class="fa fa-pencil-alt"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left is-expanded">
              <input type="text" class="input is-info" placeholder="Puzzle flag" v-model="puzzleData.answer">
              <span class="icon is-left">
                <i class="fa fa-flag"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left is-expanded">
              <input type="number" class="input is-info" placeholder="Puzzle reward" v-model="puzzleData.value">
              <span class="icon is-left">
                <i class="fa fa-money-bill-alt"></i>
              </span>
            </div>
          </div>
          <button class="button is-danger is-small" @click="$emit('delete', id)">Delete puzzle</button>
        </div>
      </div>
      <div class="column is-8">
        <h1 class="title is-5" v-if="puzzleData.hints.length > 1">Hints:</h1>
        <h1 class="title is-5" v-else>Hint:</h1>
        <div>
          <hint v-for="(hint, index) in puzzleData.hints" :key="index" :hintData="puzzleData.hints[index]" :id="index" @delete="deleteHint"></hint>
          <div class="has-text-centered" id="add-new-hint-container">
            <button class="button is-success is-rounded" @click="addNewHint()">Add new hint</button>
          </div>
        </div>
      </div>
    </div>
    <hr>
  </div>
</template>

<script>
  import hint from "~/components/editors/hint"

  export default {
    props: ["puzzleData", "id"],
    methods: {
      addNewHint() {
        this.$emit('addNewHint', this.id);
      },
      deleteHint(hintId) {
        this.$emit('deleteHint', this.id, hintId);
      }
    },
    components: {
      hint
    }
  }

</script>

<style>
  #add-new-hint-container {
    margin-top: 0.5rem;
  }

  #puzzle-divider {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);

  }

</style>
