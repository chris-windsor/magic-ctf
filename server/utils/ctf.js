const fs = require("fs");
const scheduler = require("node-schedule");

const dataFolder = `${__dirname}/../data/`;

let gameIsRunning = false;
let gameEndTime = new Date();
let teamList = {};
let teamScores = {};

let gameEndScheduler;

/*
 * Change current game state
 * */
const changeGameState = newState => {
  gameIsRunning = newState;

  if (newState === true) {
    gameEndScheduler = scheduler.scheduleJob(gameEndTime, () => {
      changeGameState(false);
    });
  } else {
    gameEndScheduler.cancel();
  }

  const socketHandler = require("./socketHandler");
  const io = socketHandler.getIO();
  io.in("ctf")
    .emit("gameStateChange");

  io.in("ctf-admin")
    .emit("updateGameStatus", {
      isActive: isGameRunning(),
      endTime: getEndTime()
    });
};

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
const updateTeamScores = (_id) => {
  const {name, locationId, score, lastUpdated} = teamList[_id];
  teamScores[_id] = {
    name,
    locationId,
    score,
    lastUpdated
  };
};

/*
 * Load in puzzle data from its respective file
 * */
let rawPuzzleData = require(dataFolder + "puzzles.json");

/*
 * Retrieve a hint from the master puzzle set to be returned to the team
 * */
const getHint = request => {
  const hint = rawPuzzleData[request.puzzleName].hints[request.hintId];
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
    if (rawPuzzleData[request.puzzleName].answer === request.answer) {
      return {
        correct: true,
        reward: rawPuzzleData[request.puzzleName].value
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
  return rawPuzzleData;
};

/*
 * Retrieve puzzle data set in efficient format for the data colletion system
 * */
const getPuzzlesForDataCollection = () => {
  return [];
};

/*
 * Modify puzzle data set with newly created puzzle set from admin panel
 * */
const updatePuzzles = puzzleData => {
  let newPuzzles = {};
  puzzleData.forEach(entry => {
    newPuzzles[entry.title] = {
      answer: entry.answer,
      value: entry.value,
      hints: entry.hints
    };
  });
  fs.writeFile(
    dataFolder + "puzzles.json",
    JSON.stringify(newPuzzles, null, 2),
    err => {
      if (err) {
        throw err;
      } else {
        rawPuzzleData = newPuzzles;
      }
    }
  );
};

/*
 * Load in location data from its respective json file
 * */
let locations = require(dataFolder + "locations.json");

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
    dataFolder + "locations.json",
    JSON.stringify(locs, null, 2),
    err => {
      if (err) {
        throw err;
      } else {
        locations = locs;
      }
    }
  );
};

/*
 * Retrieve team scores
 * Used for media broadcasting to handle the sorting for them
 * */
const getTeamScores = () => {
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
  return sorted;
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
  getTeamScores,
  isGameRunning,
  teamList,
  teamScores,
  updateEndTime,
  updateLocations,
  updatePuzzles,
  updateTeamScores
};
