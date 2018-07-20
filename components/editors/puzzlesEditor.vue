<template>
  <div>
    <b-loading :active.sync="isLoading"></b-loading>
    <puzzle v-for="(puzzle, index) in puzzles" :key="index" :puzzleData="puzzles[index]" :id="index" :isLast="index !== puzzles.length-1"
      @addNew="addNewPuzzle" @delete="deletePuzzle" @addNewHint="addNewHint" @deleteHint="deleteHint"></puzzle>
    <div class="buttons is-centered">
      <button class="button is-info is-rounded is-medium" @click="savePuzzleData()">Save puzzles</button>
    </div>
  </div>
</template>

<script>
  import puzzle from "~/components/editors/puzzle"

  export default {
    data() {
      return {
        isLoading: true,
        puzzles: []
      }
    },
    methods: {
      loadData() {
        this.$axios.get('/api/admin/settings/puzzles').then(res => {
          this.puzzles = res.data.puzzles;
          this.isLoading = false;
        }).catch(err => {
          console.error(err);
        });
      },
      addNewPuzzle(id) {
        this.puzzles.splice(id + 1, 0, {
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
            message: 'Successfully saved the updated puzzles...',
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
