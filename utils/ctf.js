let gameIsRunning = false;

const changeGameState = (newState) => {
  gameIsRunning = newState;
};

const isGameRunning = () => {
  return gameIsRunning;
};

const puzzles = require("./puzzles.json");

const getPuzzles = () => {
  let puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach((entry) => {
    puzzleData.push({
      title: entry,
      value: puzzles[entry].value,
      hints: puzzles[entry].hints
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
  getPuzzles,
  getRawPuzzleData,
  getLocations
};
