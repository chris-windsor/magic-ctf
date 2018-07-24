const fs = require("fs");

let gameIsRunning = false;
let gameLength = "3hr:0min";
let remainingTime;

let teamList = {};

let teamScores = {
  TheBestTeam: 15,
  Falcons: 0,
  Hackers: 40,
  TheWinners: 0
};

let helpRequests = {};

const changeGameState = newState => {
  gameIsRunning = newState;
  if (newState === true && remainingTime === undefined) {
    let timeComponents = gameLength.split(":");
    let hrs = Number(timeComponents[0].slice(0, -2)) * 1000 * 3600;
    let mins = Number(timeComponents[1].slice(0, -3)) * 1000 * 60;
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
      const t = teamList[team];
      teamScores[team] = t.score;
    }
  }
};

const puzzles = require("./puzzles.json");

const getHint = request => {
  let hint = puzzles[request.puzzleName].hints[request.hintId];
  return {
    hintContent: hint.content,
    hintCost: hint.cost
  };
};

const checkAnswer = request => {
  if (puzzles[request.puzzleName].answer === request.answer) {
    return {
      correct: true,
      reward: puzzles[request.puzzleName].value
    };
  }
  return {
    correct: false
  };
};

const getPuzzlesForPlayer = () => {
  let puzzleNames = Object.keys(puzzles);
  let puzzleData = [];
  puzzleNames.forEach(entry => {
    let hints = [];
    puzzles[entry].hints.forEach(hint => {
      hints.push({
        cost: hint.cost,
        content: ""
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
  let puzzleNames = Object.keys(puzzles);
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
  let locs = {
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
  updatePuzzles,
  getLocations,
  updateLocations
};
