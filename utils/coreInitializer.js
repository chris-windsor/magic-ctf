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
  Account.find({accountType: "player"}, (err, players) => {
    if (err) {
      return logger.error(err);
    }

    if (players.length) {
      players.forEach(p => {
        const teamName = p.name;
        if (!loadedTeams[teamName]) {
          logger.info(`Loading account: '${teamName}'...`);
          Team.loadTeam(teamName);
          loadedTeams[teamName] = true;
        }
      });
    } else {
      logger.info("Found no pre-existing accounts to load...");
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
