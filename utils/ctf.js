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

const getRawPuzzleData = () => {
  return puzzles;
};

const locations = require("./locations.json");

const getLocations = () => locations.locations;

module.exports = {
  changeGameState,
  isGameRunning,
  getPuzzlesForPlayer,
  getRawPuzzleData,
  getLocations
};
