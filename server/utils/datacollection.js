const fs = require("fs");
const ctf = require("./ctf");
const logger = require("./logger");

const dataCollectionFileName = "dataCollection.json";
const logCollectionFileName = "log.txt";

const dataFolder = `${__dirname}/../data/`;

const loadPuzzleDataCollection = () => {
  if (fs.existsSync(dataFolder + dataCollectionFileName)) {
    return require(dataFolder + dataCollectionFileName);
  } else {
    return ctf.getPuzzlesForDataCollection();
  }
};

const loadGameLog = () => {
  if (fs.existsSync(dataFolder + logCollectionFileName)) {
    const rawLog = fs
      .readFileSync(dataFolder + logCollectionFileName, err => {
        if (err) {
          logger.error(err);
        }
      })
      .toString()
      .split("\n");
    rawLog.splice(-1);
    return rawLog;
  } else {
    return [];
  }
};

let gameStatistics = loadPuzzleDataCollection();
let gameLog = loadGameLog();

const updateDataCollectionFile = () => {
  fs.writeFileSync(
    dataFolder + dataCollectionFileName,
    JSON.stringify(gameStatistics),
    err => {
      if (err) {
        logger.error(err);
      }
    }
  );
};

const addPuzzleAttempt = puzzleId => {
  gameStatistics[puzzleId].attempts += 1;
  updateDataCollectionFile();
};

const addPuzzleSuccess = puzzleId => {
  gameStatistics[puzzleId].successes += 1;
  updateDataCollectionFile();
};

const addHintUse = (puzzleId, hintId) => {
  gameStatistics[puzzleId].hints[hintId].uses += 1;
  updateDataCollectionFile();
};

const addLog = entry => {
  const computedEntry = `[${new Date().toLocaleTimeString()}]: ${entry}`;
  gameLog.push(computedEntry);
  fs.appendFile(dataFolder + logCollectionFileName, computedEntry, err => {
    if (err) {
      logger.error(err);
    }
  });
};

module.exports = {
  gameStatistics,
  gameLog,
  addPuzzleAttempt,
  addPuzzleSuccess,
  addHintUse,
  addLog
};
