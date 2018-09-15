const User = require("../models/user");
const chalk = require("chalk");

const init = db => {
  // delete entire users collection
  // db.collections["users"].drop(err => {
  //   if (err) {
  //     console.log(
  //       chalk.red.bold("Error encounted while dropping users collection...")
  //     );
  //   }
  // });
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
        console.log(error);
        console.log(
          chalk.red.bold("Error encounted while creating admin account...")
        );
      } else {
        console.log(
          chalk.green.bold(
            `Successfully created admin account with password: ${rndPswd}`
          )
        );
      }
    }
  );
};

module.exports = {
  init
};
