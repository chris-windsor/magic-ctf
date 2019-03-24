const Account = require("../models/account");
const Team = require("./team");
const logger = require("./logger");
const loadedTeams = {};

const createAdminAccount = db => {
  /*
   * Delete pre-existing admin account
   * */
  db.collections["accounts"].deleteMany({
    accountType: "admin"
  });

  /*
   * Generate random password for admin account
   * */
  let rndPswd = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++) {
    const r = Math.floor(Math.random() * chars.length);
    rndPswd += chars[r];
  }

  /*
   * Create the new admin account
   * */
  Account.create(
    {
      name: "admin",
      accountType: "admin",
      password: rndPswd,
      passwordConf: rndPswd
    },
    (err, user) => {
      if (err) {
        logger.error("Error encountered while creating admin account...", err);
      } else {
        logger.success(
          `Successfully created admin account with password: ${rndPswd}`
        );
      }
    }
  );
};

const loadTeams = db => {
  /*
   * Locate all teams in database and load their team data into memory
   * */
  Account.find({accountType: "player", isActive: true}, (err, teams) => {
    if (err) {
      return logger.error(err);
    }

    if (teams.length) {
      teams.forEach(team => {
        const {_id, name} = team;
        if (!loadedTeams[_id]) {
          logger.info(`Loading team: '${name}'...`);
          Team.loadTeam(_id);
        }
      });
    } else {
      logger.info("Found no pre-existing teams to load...");
    }
  });
};

const init = db => {
  createAdminAccount(db);
  loadTeams(db);
};

module.exports = {
  init
};
