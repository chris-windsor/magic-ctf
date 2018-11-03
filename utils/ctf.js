const fs = require("fs");

let gameIsRunning = false;
let gameLength = "3hr:0min";
let remainingTime;

let teamList = {};

let teamScores = {};

let helpRequests = {};

const changeGameState = newState => {
  gameIsRunning = newState;
  if (newState === true && remainingTime === undefined) {
    const timeComponents = gameLength.split(":");
    const hrs = Number(timeComponents[0].slice(0, -2)) * 1000 * 3600;
    const mins = Number(timeComponents[1].slice(0, -3)) * 1000 * 60;
    remainingTime = hrs + mins;
  }
};

const isGameRunning = () => {
  return gameIsRunning;
};

const setEndTime = date => {
  endTime = date;
};

const getEndTime = () => endTime;

const getRemainingTime = () => remainingTime;

setInterval(() => {
  if (gameIsRunning) {
    remainingTime -= 1000;
  }
}, 1000);

const updateTeamScores = () => {
  for (const team in teamList) {
    if (teamList.hasOwnProperty(team)) {
      const { score, lastUpdated, location } = teamList[team];
      teamScores[team] = {
        score,
        lastUpdated,
        location
      };
    }
  }
};

const puzzles = require("./puzzles.json");

const getHint = request => {
  const hint = puzzles[request.puzzleName].hints[request.hintId];
  return {
    hintContent: hint.content,
    hintCost: hint.cost
  };
};

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

const getPuzzlesForPlayer = () => {
  const puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach(entry => {
    let hints = [];
    puzzles[entry].hints.forEach((hint, index) => {
      hints.push({
        cost: hint.cost,
        content: "",
        unlocked: index == 0
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

const locations = require("./locations.json");

const getLocations = () => locations.locations;

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

module.exports = {
  changeGameState,
  isGameRunning,
  teamList,
  teamScores,
  helpRequests,
  gameLength,
  setEndTime,
  getEndTime,
  getRemainingTime,
  updateTeamScores,
  getHint,
  checkAnswer,
  getPuzzlesForPlayer,
  getPuzzlesForAdmin,
  getPuzzlesForDataCollection,
  updatePuzzles,
  getLocations,
  updateLocations
};
