<template>
  <div class="columns">
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
          <a class="button is-success">Submit</a>
        </p>
      </div>
    </div>
    <div class="column is-6">
      <h1 class="title is-5" v-if="puzzleData.hints.length > 1">Hints:</h1>
      <h1 class="title is-5" v-else>Hint:</h1>
      <div class="buttons">
        <hint v-for="(hint, index) in puzzleData.hints" :key="index" :cost="puzzleData.hints[index]"></hint>
      </div>
    </div>
  </div>
</template>

<script>
  import hint from "~/components/hint"

  export default {
    data() {
      return {
        answer: ""
      }
    },
    props: ["puzzleData"],
    components: {
      hint
    }

  }

</script>
