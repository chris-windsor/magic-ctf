let gameIsRunning = false;

const changeGameState = (newState) => {
  gameIsRunning = newState;
};

const isGameRunning = () => {
  return gameIsRunning;
};

const puzzles = require("./puzzles.json");

const getPuzzlesForPlayer = () => {
  let puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach((entry) => {
    let hints = [];
    puzzles[entry].hints.forEach((hint) => {
      hints.push(hint.cost);
    });
    puzzleData.push({
      title: entry,
      value: puzzles[entry].value,
      hints
    });
  });
  return puzzleData;
};

const getPuzzlesForAdmin = () => {
  let puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach((entry) => {
    puzzleData.push({
      title: entry,
      answer: puzzles[entry].answer,
      value: puzzles[entry].value,
      hints: puzzles[entry].hints
    });
  });
  return puzzleData;
};

const locations = require("./locations.json");

const getLocations = () => locations.locations;

module.exports = {
  changeGameState,
  isGameRunning,
  getPuzzlesForPlayer,
  getPuzzlesForAdmin,
  getLocations
};
