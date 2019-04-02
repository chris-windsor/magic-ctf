const fs = require("fs");

let gameIsRunning = false;
let gameEndTime = new Date();
let teamList = {};
let teamScores = {};

/*
 * Change current game state
 * */
const changeGameState = newState => gameIsRunning = newState;

/*
 * Return current game state
 * */
const isGameRunning = () => gameIsRunning;

/*
 * Change game end time
 * */
const updateEndTime = newEndTime => gameEndTime = newEndTime;

/*
 * Retrieve game end time
 * */
const getEndTime = () => gameEndTime;

/*
 * Re-process team score list when any team's score updates
 * */
const updateTeamScores = () => {
  for (const _id in teamList) {
    if (teamList.hasOwnProperty(_id)) {
      const {name, locationId, score, lastUpdated} = teamList[_id];
      teamScores[_id] = {
        name,
        locationId,
        score,
        lastUpdated
      };
    }
  }
};

/*
 * Load in puzzle data from its respective file
 * */
const puzzles = require("../data/puzzles.json");

/*
 * Retrieve a hint from the master puzzle set to be returned to the team
 * */
const getHint = request => {
  const hint = puzzles[request.puzzleName].hints[request.hintId];
  return {
    hintContent: hint.content,
    hintCost: hint.cost
  };
};

/*
 * Compare submitted answer for a puzzle to the correct answer in the master set
 * */
const checkAnswer = request => {
  try {
    if (puzzles[request.puzzleName].answer === request.answer) {
      return {
        correct: true,
        reward: puzzles[request.puzzleName].value
      };
    }
    return {
      correct: false
    };
  } catch (error) {
    return {
      correct: false
    };
  }
};

/*
 * Retrieve blank puzzle data set for newly created teams
 * */
const getPuzzlesForPlayer = () => {
  const puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach(entry => {
    let hints = [];
    puzzles[entry].hints.forEach((hint, index) => {
      hints.push({
        cost: hint.cost,
        content: "",
        unlocked: index === 0
      });
    });
    puzzleData.push({
      title: entry,
      value: puzzles[entry].value,
      isSolved: false,
      hints
    });
  });
  return puzzleData;
};

/*
 * Retrieve puzzle data set in efficient format for the admin panel
 * */
const getPuzzlesForAdmin = () => {
  const puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach(entry => {
    puzzleData.push({
      title: entry,
      answer: puzzles[entry].answer,
      value: puzzles[entry].value,
      hints: puzzles[entry].hints
    });
  });
  return puzzleData;
};

/*
 * Retrieve puzzle data set in efficient format for the data colletion system
 * */
const getPuzzlesForDataCollection = () => {
  const puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach(entry => {
    let hints = [];
    puzzles[entry].hints.forEach(hint => {
      hints.push({
        uses: 0
      });
    });
    puzzleData.push({
      name: entry,
      attempts: 0,
      successes: 0,
      hints
    });
  });
  return puzzleData;
};

/*
 * Modify puzzle data set with newly created puzzle set from admin panel
 * */
const updatePuzzles = puzzleData => {
  let puzzles = {};
  puzzleData.forEach(entry => {
    puzzles[entry.title] = {
      answer: entry.answer,
      value: entry.value,
      hints: entry.hints
    };
  });
  fs.writeFile(
    __dirname + "/puzzles.json",
    JSON.stringify(puzzles, null, 2),
    err => {
      if (err) throw err;
    }
  );
};

/*
 * Load in location data from its respective json file
 * */
const locations = require("../data/locations.json");

/*
 * Retrieve location data
 * */
const getLocations = () => locations.locations;

/*
 * Update the location data file with new location list
 * */
const updateLocations = locationData => {
  const locs = {
    locations: locationData
  };
  fs.writeFile(
    __dirname + "/locations.json",
    JSON.stringify(locs, null, 2),
    err => {
      if (err) throw err;
    }
  );
};

/*
 * Retrieve the current top five scoring teams
 * */
const getTop5 = () => {
  let sorted = [];
  for (let _id in teamScores) {
    const {name, score, lastUpdated} = teamScores[_id];
    sorted.push({
      name,
      score,
      lastUpdated
    });
  }
  sorted.sort((a, b) => a.lastUpdated - b.lastUpdated);
  sorted.sort((a, b) => b.score - a.score);
  sorted = sorted.map(({name, score}) => {
    return {name, score};
  });
  return sorted.splice(0, 5);
};

module.exports = {
  changeGameState,
  checkAnswer,
  getEndTime,
  getHint,
  getLocations,
  getPuzzlesForAdmin,
  getPuzzlesForDataCollection,
  getPuzzlesForPlayer,
  getTop5,
  isGameRunning,
  teamList,
  teamScores,
  updateEndTime,
  updateLocations,
  updatePuzzles,
  updateTeamScores
};
