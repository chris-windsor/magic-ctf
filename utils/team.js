const ctf = require("./ctf");

class Team {
  constructor(name) {
    this.name = name;
    this.players = {};
    this.score = 0;
    ctf.updateTeamScores();
    this.puzzles = ctf.getPuzzlesForPlayer();
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
    ctf.updateTeamScores();
  }

  addPlayer(username) {
    this.players[username] = {};
  }
}

module.exports = {
  Team
};
