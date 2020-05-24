<template>
  <div class="modal-card" style="width: 33vw; min-width: 400px;">
    <div class="box">
      <div class="header-content">
        <h1 class="title is-4 is-marginless">Edit puzzle</h1>
        <b-field grouped position="is-centered">
          <p class="control">
            <button class="button is-danger is-small" @click="$emit('delete', index, puzzleData._id)">Delete</button>
          </p>
          <p class="control">
            <button class="button is-success is-small" @click="$emit('update', puzzleData)">Save</button>
          </p>
        </b-field>
      </div>
      <div class="grid-container">
        <div class="puzzleName">
          <b-field label="Name">
            <b-input v-model="puzzleData.name"/>
          </b-field>
        </div>
        <div class="puzzleReward">
          <b-field label="Value">
            <b-input v-model.number="puzzleData.reward" type="number"/>
          </b-field>
        </div>
        <div class="puzzleAnswers">
          <b-field :label="'Answer #' + (idx + 1)" v-for="(ans, idx) in puzzleData.answers" :key="idx">
            <b-input v-model="puzzleData.answers[idx]"/>
          </b-field>
          <b-button icon-left="plus" type="is-info" size="is-small">Add</b-button>
          <b-field grouped style="margin-top: .5rem;">
            <b-checkbox v-model="puzzleData.caseSensitive">case sensitive</b-checkbox>
          </b-field>
        </div>
        <div class="puzzleHints">
          <b-field :label="'Hint #' + (idx + 1)" v-for="(hint, idx) in puzzleData.hints" :key="idx" grouped>
            <b-input v-model="puzzleData.hints[idx].content" expanded/>
            <b-input v-model.number="puzzleData.hints[idx].cost" style="width: 47px"/>
          </b-field>
          <b-button icon-left="plus" type="is-info" size="is-small">Add</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["puzzleData"],
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas: "puzzleName puzzleName puzzleName puzzleReward" "puzzleAnswers puzzleAnswers puzzleHints puzzleHints" "puzzleAnswers puzzleAnswers puzzleHints puzzleHints";
    grid-gap: 0 .5rem;
  }

  .puzzleName {
    grid-area: puzzleName;
  }

  .puzzleReward {
    grid-area: puzzleReward;
  }

  .puzzleHints {
    grid-area: puzzleHints;
  }

  .puzzleAnswers {
    grid-area: puzzleAnswers;
  }
</style>
