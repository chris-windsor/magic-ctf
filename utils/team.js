const ctf = require("./ctf");
const teamSchema = require("../models/team");
const logger = require("../utils/logger");
const loadedTeams = {};

const updateTeam = (name, prop, val) => {
  teamSchema.Team.update(
    {
      name
    },
    {
      $set: {
        [prop]: val
      }
    },
    err => {
      if (err) {
        logger.error("Encountered an error while updating team...", err);
      }
    }
  );
};

class Team {
  constructor(name, location, players, score, puzzles, lastUpdated, isNew) {
    this.name = name;
    this.location = location;
    this.players = new Array(players);
    this.score = score ? score : 0;
    ctf.updateTeamScores();
    this.puzzles = puzzles ? puzzles : ctf.getPuzzlesForPlayer();
    this.lastUpdated = lastUpdated ? lastUpdated : Date.now();

    if (isNew === undefined) {
      const doc = {
        name,
        location,
        players: this.players,
        score: 0,
        puzzles: this.puzzles,
        lastUpdated: this.lastUpdated
      };

      teamSchema.Team.create(doc, (err, team) => {
        if (err) {
          logger.error("Encountered error while creating team... ", err);
        } else {
          logger.success(`Successfully saved new team (${team.name}) to db.`);
        }
      });
    }
  }

  getPuzzles() {
    return this.puzzles;
  }

  hasHintAccess(puzzleId, hintId) {
    return this.puzzles[puzzleId].hints[hintId].unlocked;
  }

  addHint(puzzleId, hintId, hintContent) {
    this.puzzles[puzzleId].hints[hintId].content = hintContent;
    this.puzzles[puzzleId].value -= this.puzzles[puzzleId].hints[hintId].cost;
    if (this.puzzles[puzzleId].hints[hintId + 1] !== undefined) {
      this.puzzles[puzzleId].hints[hintId + 1].unlocked = true;
    }
    updateTeam(this.name, "puzzles", this.puzzles);
  }

  addCorrectPuzzle(puzzleId) {
    this.puzzles[puzzleId].isSolved = true;
    updateTeam(this.name, "puzzles", this.puzzles);
  }

  addScore(points) {
    this.score += points;
    this.lastUpdated = Date.now();
    ctf.updateTeamScores();
    updateTeam(this.name, "score", this.score);
    updateTeam(this.name, "lastUpdated", this.lastUpdated);
  }

  addPlayer(username) {
    if (!this.players.includes(username)) {
      this.players.push(username);
      updateTeam(this.name, "players", this.players);
    }
  }

  static loadTeam(teamName) {
    if (!loadedTeams[teamName]) {
      teamSchema.Team.find({ name: teamName }).then((res, err) => {
        if (err) {
          logger.error("Error loading team data from db... ", err);
        } else {
          const {
            name,
            location,
            players,
            score,
            puzzles,
            lastUpdated
          } = res[0];
          ctf.teamList[name] = new this(
            name,
            location,
            players,
            score,
            puzzles,
            lastUpdated,
            false
          );
          ctf.teamScores[name] = {
            score,
            lastUpdated,
            location
          };
          ctf.updateTeamScores();
        }
      });
    }
    loadedTeams[teamName] = true;
  }
}

module.exports = {
  Team
};
