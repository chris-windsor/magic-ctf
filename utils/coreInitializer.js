const Account = require("../models/account");
const Team = require("./team");
const logger = require("./logger");
const loadedTeams = {};

const createAdminAccount = db => {
  // delete old admin account
  db.collections["accounts"].deleteMany({
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
  Account.create(
    {
      name: "admin",
      accountType: "admin",
      password: rndPswd,
      passwordConf: rndPswd
    },
    (error, user) => {
      if (error) {
        logger.error("Error encountered while creating admin account...", error);
      } else {
        logger.success(
          `Successfully created admin account with password: ${rndPswd}`
        );
      }
    }
  );
};

const findAllPlayers = (db, callback) => {
  Account.find({accountType: "player"}, (err, res) => {
    if (err) {
      logger.error(err);
    }
    callback(res);
  });
};

const loadTeams = players => {
  if (players.length) {
    players.forEach(p => {
      const teamName = p.name;
      if (!loadedTeams[teamName]) {
        logger.info(`Loading account: '${teamName}'.`);
        Team.loadTeam(teamName);
        loadedTeams[teamName] = true;
      }
    });
  } else {
    logger.info("Found no pre-existing accounts to load...");
  }
};

const init = db => {
  createAdminAccount(db);
  findAllPlayers(db, loadTeams);
};

module.exports = {
  init
};
