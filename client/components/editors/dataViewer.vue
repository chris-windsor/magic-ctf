<template>
  <div>
    <b-loading :active.sync="isLoading"></b-loading>
    <div class="content-header">
      <h1 class="title is-5">Log:</h1>
      <div style="display: flex; flex-direction: row; align-items: center;">
        <b-field class="is-marginless">
          <b-select placeholder="Location" v-model="teamNameLogFilter" rounded>
            <option value="" selected>No team filter</option>
            <option v-for="(team, idx) in teamList" :value="team.name" :key="idx">{{team.name}}</option>
          </b-select>
          <b-select placeholder="Location" v-model="puzzleNameLogFilter" rounded>
            <option value="" selected>No puzzle filter</option>
            <option v-for="(puzzle, idx) in puzzleList" :value="puzzle" :key="idx">{{puzzle}}</option>
          </b-select>
        </b-field>
        <b-checkbox v-model="attemptsOnlyFilter" style="margin-left: .5rem;">Only show attempts</b-checkbox>
      </div>
    </div>
    <div class="notification is-info" v-if="log.length === 0">There is currently no logs to view.</div>
    <div class="log-viewer" v-else>
      <ol style="white-space: nowrap; list-style: none; margin: .5em;">
        <li :key="index"
            v-for="(entry, index) in log.filter(e => new RegExp(`^.*'${this.teamNameLogFilter.length ? this.teamNameLogFilter : '.*'}' ${this.attemptsOnlyFilter ? 'attempted' : ''}.*'${this.puzzleNameLogFilter.length ? this.puzzleNameLogFilter : '.*'}'.*$`, 'gm').test(e))">
          {{entry}}
        </li>
      </ol>
    </div>
    <hr>
    <div class="content-header">
      <h1 class="title is-5">Statistics:</h1>
      <b-field>
        <b-input placeholder="Puzzle name" type="search" icon="search" rounded v-model="puzzleSearch"></b-input>
      </b-field>
    </div>
    <div :key="pIndex" class="box content"
         v-for="(puzzle, pIndex) in stats.filter(e => new RegExp(this.puzzleSearch, 'gi').test(e.name))">
      <h1 class="title is-3">{{puzzle.name}}</h1>
      <p>Attempts: {{puzzle.attempts}}. Successes: {{puzzle.successes}}.</p>
      <h1 class="title is-5">Hints:</h1>
      <ol>
        <li :key="hIndex" v-for="(hint, hIndex) in puzzle.hints">
          Uses: {{hint.uses}}
        </li>
      </ol>
    </div>
    <a @click="downloadData()" class="button is-success">Download Data</a>
  </div>
</template>

<script>
  import {saveAs} from 'file-saver';

  export default {
    data() {
      return {
        isLoading: true,
        stats: [],
        log: [],
        puzzleSearch: '',
        teamList: [],
        puzzleList: [],
        teamNameLogFilter: '',
        puzzleNameLogFilter: '',
        attemptsOnlyFilter: true
      };
    },
    methods: {
      downloadData() {
        const logFileData = new Blob([this.log.join("\n")], {type: 'text/plain'});
        const statisticsFileData = new Blob([JSON.stringify(this.stats)], {type: 'application/json'});
        saveAs(logFileData, "log.txt");
        saveAs(statisticsFileData, "dataCollection.json");
      }
    },
    mounted() {
      const getGameData = this.$axios
        .get("/api/admin/gamedata")
        .then(res => {
          this.stats = res.data.gameStatistics;
          this.log = res.data.gameLog;
        })
        .catch(err => {
          console.error(err);
        });
      const getTeams = this.$axios
        .get("/api/admin/settings/teams")
        .then(res => {
          this.teamList = res.data.sort((a, b) => {
            const t1 = a.name.toUpperCase();
            const t2 = b.name.toUpperCase();
            return (t1 < t2) ? -1 : (t1 > t2) ? 1 : 0;
          });
        })
        .catch(err => {
          console.error(err);
        });
      const getPuzzles = this.$axios
        .get("/api/admin/settings/puzzles")
        .then(res => {
          this.puzzleList = res.data.puzzles.map(e => e.title);
        })
        .catch(err => {
          console.error(err);
        });
      Promise.all([getGameData, getTeams, getPuzzles])
        .then(() => {
          this.isLoading = false;
        });
    }
  };
</script>

<style scoped>
  .content-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .content-header h1.title {
    margin: 0;
  }

  .log-viewer {
    height: 250px;
    overflow: scroll;
    border: 1px solid hsl(0, 0%, 86%);
    border-radius: 4px;
  }
</style>
