<template>
  <div>
    <puzzle v-for="(puzzle, index) in puzzles" :key="index" :puzzleData="puzzles[index]" :id="index" @delete="deletePuzzle" @addNewHint="addNewHint"
      @deleteHint="deleteHint"></puzzle>
    <div class="buttons is-centered">
      <button class="button is-success is-rounded is-medium" @click="addNewPuzzle()">Add new puzzle</button>
      <button class="button is-info is-rounded is-medium" @click="savePuzzleData()">Save puzzles</button>
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
      },
      savePuzzleData() {
        this.$axios.post("/api/admin/settings/puzzles", {
          puzzleData: this.puzzles
        }).then(res => {
          this.$toast.open({
            message: 'Successfully saved updated puzzles...',
            type: 'is-success',
            duration: 1500
          });
        }).catch(err => {
          this.$toast.open({
            message: 'There was an error while saving the puzzles...',
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
      puzzle
    }
  }

</script>
