<template>
  <div>
    <b-loading :active.sync="isLoading"></b-loading>
    <b-modal :active.sync="isEditing" has-modal-card trap-focus>
      <puzzle-edit-modal :puzzleData="puzzles[puzzleInEdit]" @delete="deletePuzzle"
                         @update="updatePuzzle"></puzzle-edit-modal>
    </b-modal>
    <b-field horizontal>
      <b-input placeholder="Puzzle name" type="search" icon="search" rounded v-model="searchValue"></b-input>
      <button @click="addNewPuzzle" class="button is-success is-rounded">Add new team</button>
    </b-field>
    <hr>
    <puzzle :key="idx" :puzzleData="puzzle" :index="idx"
            v-for="(puzzle, idx) in puzzles.filter(e => new RegExp(this.searchValue, 'gi').test(e.name))"
            @edit="editPuzzle"/>
  </div>
</template>

<script>
  import puzzle from "./puzzle";
  import puzzleEditModal from "./puzzleEditModal"

  export default {
    data() {
      return {
        isLoading: true,
        isEditing: false,
        puzzles: [],
        searchValue: "",
        puzzleInEdit: undefined
      };
    },
    methods: {
      loadData() {
        this.$axios
          .get("/api/admin/settings/puzzles")
          .then(res => {
            this.puzzles = res.data.puzzles;
            this.isLoading = false;
          })
          .catch(err => {
            console.error(err);
          });
      },
      editPuzzle(idx) {
        this.isEditing = true;
        this.puzzleInEdit = idx;
      },
      addNewPuzzle(id) {
        this.puzzles.splice(id + 1, 0, {
          title: "",
          answer: "",
          value: "",
          hints: [
            {
              content: "",
              cost: 0
            }
          ]
        });
      },
      deletePuzzle(id) {
        this.puzzles.splice(id, 1);
      },
      updatePuzzle(puzzleData) {
        this.$axios
          .post("/api/admin/settings/puzzles", {
            puzzleData
          })
          .then(res => {
            this.$buefy.toast.open({
              message: "Successfully saved the updated puzzle...",
              type: "is-success",
              duration: 1500
            });
          })
          .catch(err => {
            this.$buefy.toast.open({
              message: "There was an error while saving the puzzle...",
              type: "is-danger",
              duration: 1500
            });
          });
      }
    },
    mounted() {
      this.loadData();
    },
    components: {
      puzzle,
      puzzleEditModal
    }
  };
</script>
