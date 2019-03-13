const ctf = require("./ctf");
const accountSchema = require("../models/account");
const logger = require("../utils/logger");
const loadedTeams = {};

const updateTeam = (name, prop, val) => {
  /*
   * Update team properties in the database
   * */

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
    /*
     * Name -> team name
     * LocationId -> team location identifier
     * Score -> team score
     * Puzzles -> team puzzle set; contains all their puzzle data including their hints
     * LastUpdated -> when team's score was last updated; used to decide leading team if there is score tie
     * */
    this.name = name;
    this.locationId = locationId;
    this.score = score ? score : 0;
    this.puzzles = puzzles ? puzzles : ctf.getPuzzlesForPlayer();
    this.lastUpdated = lastUpdated ? lastUpdated : Date.now();
  }

  /*
   * Load an existing team from the database
   * */
  static loadTeam(teamName) {
    if (!loadedTeams[teamName]) {
      accountSchema.find({name: teamName})
                   .then((res, err) => {
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

                         /*
                          * Load team instance into list with all other teams
                          * */
                         ctf.teamList[name] = new this(
                           name,
                           locationId,
                           score,
                           puzzles,
                           lastUpdated
                         );

                         /*
                          * Load teams score data
                          * */
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

    updateTeam(this.name, "puzzles", this.puzzles);
  }

  /*
   * Set puzzle status to complete for team
   * */
  addCorrectPuzzle(puzzleId) {
    this.puzzles[puzzleId].isSolved = true;

    updateTeam(this.name, "puzzles", this.puzzles);
  }


  /*
   * Increment a team's score
   * */
  addScore(points) {
    this.score += points;

    this.lastUpdated = Date.now();

    ctf.updateTeamScores();

    updateTeam(this.name, "score", this.score);
    updateTeam(this.name, "lastUpdated", this.lastUpdated);
  }
}

module.exports = Team;
