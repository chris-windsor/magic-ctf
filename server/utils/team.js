const ctf = require("./ctf");
const Account = require("../models/account");
const logger = require("../utils/logger");
const loadedTeams = {};

const updateTeam = (_id, prop, val) => {
  /*
   * Update team properties in the database
   * */

  return new Promise(resolve => {
    Account.updateOne(
      {
        _id
      },
      {
        $set: {
          [prop]: val
        }
      },
      err => {
        if (err) {
          logger.error("Encountered an error while updating team...", err);
        } else {
          resolve();
        }
      }
    );
  });
};

class Team {
  constructor(_id, name, locationId, score, puzzles, lastUpdated) {
    /*
     * _id -> team uuid
     * mame -> team name
     * locationId -> team location identifier
     * score -> team score
     * puzzles -> team puzzle set; contains all their puzzle data including their hints
     * lastUpdated -> when team's score was last updated; used to decide leading team if there is score tie
     * */
    this._id = _id;
    this.name = name;
    this.locationId = locationId;
    this.score = score ? score : 0;
    this.puzzles = puzzles ? puzzles : ctf.getPuzzlesForPlayer();
    this.lastUpdated = lastUpdated ? lastUpdated : Date.now();

    /*
     * Load team instance into list with all other teams
     * */
    ctf.teamList[_id] = this;

    /*
     * Load teams score data
     * */
    ctf.teamScores[_id] = {
      name: this.name,
      locationId: this.locationId,
      score: this.score,
      lastUpdated: this.lastUpdated
    };
  }

  /*
   * Load an existing team from the database
   * */
  static loadTeam(_id) {
    if (!loadedTeams[_id]) {
      Account.find({_id})
             .then((res, err) => {
               if (res[0].accountType === "player") {
                 if (err) {
                   logger.error("Error loading team data from db... ", err);
                 } else {
                   const {
                           _id,
                           name,
                           locationId,
                           score,
                           puzzles,
                           lastUpdated
                         } = res[0];

                   new this(_id, name, locationId, score, puzzles, lastUpdated);
                 }
               }
             });
    }
    loadedTeams[_id] = true;
  }

  /*
   * Change team's name in database
   * */
  changeName(newName) {
    this.name = newName;
    updateTeam(this._id, "name", this.name);
  }

  /*
   * Change team's locationId in database
   * */
  changeLocationId(newLocationId) {
    this.locationId = newLocationId;
    updateTeam(this._id, "locationId", this.locationId);
  }

  /*
   * Return team's puzzle set
   * */
  getPuzzles() {
    return this.puzzles;
  }

  /*
   * Check if team can access certain hint
   *
   * Higher level hints are locked until lower level hints are used
   * */
  hasHintAccess(puzzleId, hintId) {
    return this.puzzles[puzzleId].hints[hintId].unlocked;
  }

  /*
   * Add hint content to team's puzzle set
   * */
  addHint(puzzleId, hintId, hintContent) {
    this.puzzles[puzzleId].hints[hintId].content = hintContent;

    this.puzzles[puzzleId].value -= this.puzzles[puzzleId].hints[hintId].cost;

    if (this.puzzles[puzzleId].hints[hintId + 1] !== undefined) {
      this.puzzles[puzzleId].hints[hintId + 1].unlocked = true;
    }

    updateTeam(this._id, "puzzles", this.puzzles);
  }

  /*
   * Check if team has puzzle solved
   * */
  hasPuzzleSolved(puzzleId) {
    return this.puzzles[puzzleId].isSolved;
  }

  /*
   * Set puzzle status to complete for team
   * */
  addCorrectPuzzle(puzzleId) {
    this.puzzles[puzzleId].isSolved = true;

    return new Promise(resolve => {
      updateTeam(this._id, "puzzles", this.puzzles)
        .then(() => {
          resolve();
        });
    });
  }


  /*
   * Increment a team's score
   * */
  addScore(points) {
    this.score += points;

    this.lastUpdated = Date.now();

    ctf.updateTeamScores(this._id);

    updateTeam(this._id, "score", this.score);
    updateTeam(this._id, "lastUpdated", this.lastUpdated);
  }
}

module.exports = Team;
