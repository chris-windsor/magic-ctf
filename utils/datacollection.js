const ctf = require("./ctf");

let gameStatistics = ctf.getPuzzlesForDataCollection();
let gameLog = [];

const addPuzzleAttempt = puzzleId => {
  gameStatistics[puzzleId].attempts += 1;
};

const addPuzzleSuccess = puzzleId => {
  gameStatistics[puzzleId].successes += 1;
};

const addHintUse = (puzzleId, hintId) => {
  gameStatistics[puzzleId].hints[hintId].uses += 1;
};

const addLog = entry => {
  gameLog.push(entry);
};

module.exports = {
  gameStatistics,
  gameLog,
  addPuzzleAttempt,
  addPuzzleSuccess,
  addHintUse,
  addLog
};
