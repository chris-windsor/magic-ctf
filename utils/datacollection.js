const fs = require("fs");
const ctf = require("./ctf");
const logger = require("./logger");

const dataCollectionFileName = "dataCollection.json";
const logCollectionFileName = "log.txt";

const loadPuzzleDataCollection = () => {
  if (fs.existsSync(dataCollectionFileName)) {
    return require("../" + dataCollectionFileName);
  } else {
    return ctf.getPuzzlesForDataCollection();
  }
};

const loadGameLog = () => {
  if (fs.existsSync(logCollectionFileName)) {
    return fs
      .readFileSync(logCollectionFileName, err => {
        if (err) {
          logger.error(err);
        }
      })
      .toString()
      .split("\n")
      .splice(-1);
  } else {
    return [];
  }
};

let gameStatistics = loadPuzzleDataCollection();
let gameLog = loadGameLog();

const updateDataCollectionFile = () => {
  fs.writeFileSync(
    dataCollectionFileName,
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
  gameLog.push(entry);
  fs.appendFile(logCollectionFileName, `${entry}\n`, err => {
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
