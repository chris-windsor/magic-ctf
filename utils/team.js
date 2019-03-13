const ctf = require("./ctf");
const accountSchema = require("../models/account");
const logger = require("../utils/logger");
const loadedTeams = {};

const updateTeam = (name, prop, val) => {
  accountSchema.update(
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
  constructor(name, locationId, players, score, puzzles, lastUpdated) {
    this.name = name;
    this.locationId = locationId;
    this.score = score ? score : 0;
    this.puzzles = puzzles ? puzzles : ctf.getPuzzlesForPlayer();
    this.lastUpdated = lastUpdated ? lastUpdated : Date.now();
  }

  static loadTeam(teamName) {
    if (!loadedTeams[teamName]) {
      accountSchema.find({name: teamName})
                   .then((res, err) => {
                     console.log(res);
                     if (res[0].accountType === "player") {
                       if (err) {
                         logger.error("Error loading team data from db... ", err);
                       } else {
                         const {
                                 name,
                                 locationId,
                                 score,
                                 puzzles,
                                 lastUpdated
                               } = res[0];
                         ctf.teamList[name] = new this(
                           name,
                           locationId,
                           score,
                           puzzles,
                           lastUpdated,
                           false
                         );
                         ctf.teamScores[name] = {
                           score,
                           lastUpdated,
                           locationId
                         };
                         ctf.updateTeamScores();
                       }
                     }
                   });
    }
    loadedTeams[teamName] = true;
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
}

module.exports = Team;
