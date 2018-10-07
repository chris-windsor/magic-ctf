const ctf = require("./ctf");

class Team {
  constructor(name) {
    this.name = name;
    this.players = {};
    this.score = 0;
    ctf.updateTeamScores();
    this.puzzles = ctf.getPuzzlesForPlayer();
    this.lastUpdated = Date.now();
  }

  getPuzzles() {
    return this.puzzles;
  }

  addHint(puzzleId, hintId, hintContent) {
    this.puzzles[puzzleId].hints[hintId].content = hintContent;
    this.puzzles[puzzleId].value -= this.puzzles[puzzleId].hints[hintId].cost;
  }

  addCorrectPuzzle(puzzleId) {
    this.puzzles[puzzleId].isSolved = true;
  }

  addScore(points) {
    this.score += points;
    this.lastUpdated = Date.now();
    ctf.updateTeamScores();
  }

  addPlayer(username) {
    this.players[username] = {};
  }
}

module.exports = {
  Team
};
