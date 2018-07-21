<template>
  <div class="box">
    <div class="has-text-centered" v-if="puzzleData.isSolved">
      <h1 class="title is-3">{{puzzleData.title}}</h1>
      <h1 class="subtitle is-5 has-text-success">Successfully solved</h1>
    </div>
    <div class="columns" v-else>
      <div class="column is-6">
        <h1 class="title is-3">{{puzzleData.title}}</h1>
        <h1 class="subtitle is-5">{{puzzleData.value}}</h1>
        <div class="field is-grouped">
          <div class="control has-icons-left has-icons-right is-expanded">
            <input type="text" class="input is-info is-active" placeholder="Flag" v-model="answer">
            <span class="icon is-left">
              <i class="fa fa-flag"></i>
            </span>
          </div>
          <p class="control">
            <a class="button is-success" @click="$emit('submitAnswer', id, puzzleData.title, answer)">Submit</a>
          </p>
        </div>
      </div>
      <div class="column is-6">
        <h1 class="title is-5" v-if="puzzleData.hints.length > 1">Hints:</h1>
        <h1 class="title is-5" v-else>Hint:</h1>
        <div class="buttons">
          <hint class="hint" v-for="(hint, index) in puzzleData.hints" :key="index" :hintData="puzzleData.hints[index]" :id="index"
            @request="requestHint"></hint>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import hint from "~/components/hint"

  export default {
    props: ["puzzleData", "id"],
    data() {
      return {
        answer: ""
      }
    },
    methods: {
      requestHint(id, cost) {
        this.$emit('requestHint', this.id, this.puzzleData.title, id, cost);
      }
    },
    components: {
      hint
    }

  }

</script>

<style>
  .hint {
    margin: 0rem 0.25rem 0.25rem 0.25rem;
  }

</style>
