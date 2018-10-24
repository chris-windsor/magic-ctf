const User = require("../models/user");
const Team = require("./team").Team;
const logger = require("./logger");
const loadedTeams = {};

const createAdminAccount = db => {
  // delete old admin account
  db.collections["users"].deleteMany({
    accountType: "admin"
  });
  // generate random password for admin account
  let rndPswd = "";
  for (let i = 0; i < 10; i++) {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let r = Math.floor(Math.random() * chars.length);
    rndPswd += chars[r];
  }
  // create admin account
  User.create(
    {
      username: "admin",
      accountType: "admin",
      locationId: -1,
      password: rndPswd,
      passwordConf: rndPswd
    },
    (error, user) => {
      if (error) {
        logger.error("Error encounted while creating admin account...", error);
      } else {
        logger.success(
          `Successfully created admin account with password: ${rndPswd}`
        );
      }
    }
  );
};

const findAllPlayers = (db, callback) => {
  User.find({ accountType: "player" }, (err, res) => {
    if (err) {
      logger.error(err);
    }
    callback(res);
  });
};

const loadTeams = players => {
  if (players.length) {
    players.forEach(p => {
      teamName = p.teamName;
      if (!loadedTeams[teamName]) {
        logger.info(`Loading team: '${teamName}'.`);
        Team.loadTeam(teamName);
        loadedTeams[teamName] = true;
      }
    });
  } else {
    logger.info("Found no pre-existing users to load...");
  }
};

const init = db => {
  createAdminAccount(db);
  findAllPlayers(db, loadTeams);
};

module.exports = {
  init
};
