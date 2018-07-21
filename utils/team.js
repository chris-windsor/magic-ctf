const ctf = require("./ctf");

class Team {
  constructor(name) {
    this.name = name;
    this.players = {};
    this.score = 0;
    this.puzzles = ctf.getPuzzlesForPlayer();
  }

  getPuzzles() {
    return this.puzzles;
  }

  addHint(puzzleId, hintId, hintContent) {
    this.puzzles[puzzleId].hints[hintId].content = hintContent;
  }

  addCorrectPuzzle(puzzleId) {
    this.puzzles[puzzleId].isSolved = true;
  }

  addScore(points) {
    this.score += points;
  }

  subtractScore(points) {
    if (this.score - points > 0) {
      this.score -= points;
    } else {
      return false;
    }
  }

  addPlayer(username) {
    this.players[username] = {};
  }
}

let teamList = {};

module.exports = {
  Team,
  teamList
};
