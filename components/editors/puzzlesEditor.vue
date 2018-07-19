<template>
  <div>
    <puzzle v-for="(puzzle, index) in puzzles" :key="index" :puzzleData="puzzles[index]" :id="index" @delete="deletePuzzle" @addNewHint="addNewHint"
      @deleteHint="deleteHint"></puzzle>
    <div class="has-text-centered">
      <button class="button is-success is-rounded is-medium" @click="addNewPuzzle()">Add new puzzle</button>
    </div>
  </div>
</template>

<script>
  import puzzle from "~/components/editors/puzzle"

  export default {
    data() {
      return {
        puzzles: []
      }
    },
    methods: {
      loadData() {
        this.$axios.get('/api/admin/settings/puzzles').then(res => {
          this.puzzles = res.data.puzzles;
        }).catch(err => {
          console.error(err);
        });
      },
      addNewPuzzle() {
        this.puzzles.push({
          title: "",
          answer: "",
          value: "",
          hints: [{
            content: "",
            cost: 0
          }]
        });
      },
      deletePuzzle(id) {
        this.puzzles.splice(id, 1);
      },
      addNewHint(puzId) {
        this.puzzles[puzId].hints.push({
          content: "",
          cost: 0
        });
      },
      deleteHint(puzId, hintId) {
        this.puzzles[puzId].hints.splice(hintId, 1);
      }
    },
    mounted() {
      this.loadData();
    },
    components: {
      puzzle
    }
  }

</script>
