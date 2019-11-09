const express = require("express");
const router = express.Router();
const Account = require("../models/account");
const ctf = require("../utils/ctf");
const Team = require("../utils/team");
const dc = require("../utils/datacollection");
const logger = require("../utils/logger");
const handlers = require("./handlers");

// GET `/api/locations` to return available locations to register at
router.get("/api/locations", (req, res) =>
  res.json(ctf.getLocations())
);

// GET `/api/teams` to return available teams that have already been registered
router.get("/api/teams", (req, res) => {
  let teamNameList = [];
  for (let team in ctf.teamList) {
    teamNameList.push(ctf.teamList[team].name);
  }
  res.json(teamNameList);
});

// POST `/api/register` to register new team
router.post("/api/register", (req, res) => {
  const {name, locationId, password, passwordConf} = req.body;

  if (password !== passwordConf) {
    return res.status(401)
      .json({
        error: "Passwords do not match"
      });
  }

  if (!(name && locationId !== -1 && password && passwordConf)) {
    return res.status(400)
      .json({
        error: "All fields required"
      });
  }

  Account.findOne({name}, (err, resp) => {
    if (resp !== null) {
      return res.status(409)
        .json({
          error: "Username taken"
        });
    } else {
      Account.create({
        name,
        locationId,
        password
      }, (error, acc) => {
        if (error) {
          return logger.error(error);
        } else {
          new Team(acc._id, acc.name, acc.locationId);
        }

        req.session.userId = acc._id;
        req.session.authUser = {
          name: acc.name,
          accountType: acc.accountType
        };

        res.json({
          name: acc.name,
          accountType: acc.accountType
        });
      });
    }
  });
});

// POST `/api/login` to log in the user and then add them to the `req.session.authUser`
router.post("/api/login", (req, res) => {
  if (req.body.accountName && req.body.password) {
    Account.authenticate(req.body.accountName, req.body.password, (err, acc) => {
      if (err || !acc) {
        res.status(401)
          .json({
            error: "Incorrect username or password"
          });
      } else {
        req.session.userId = acc._id;
        req.session.authUser = {
          name: acc.name,
          accountType: acc.accountType
        };
        const {name, locationId, accountType} = acc;
        if (!!ctf.teamList[name] && accountType === "player") {
          ctf.teamList[name] = new Team(name, locationId);
          ctf.teamScores[name] = {
            score: 0,
            lastUpdated: Date.now(),
            location: locationId
          };
        }
        return res.json({
          name: acc.name,
          accountType: acc.accountType
        });
      }
    });
  } else {
    res.status(400)
      .json({
        error: "Both fields required"
      });
  }
});

// POST `/api/logout` to log out the user and remove them from the `req.session`
router.post("/api/logout", (req, res) => {
  delete req.session.authUser;
  res.status(200)
    .send();
});

// GET `/api/admin/settings/puzzles` to retrieve puzzle data
// POST `/api/admin/settings/puzzles` to save new puzzle data
router
  .route("/api/admin/settings/puzzles")
  .get((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        res.json({
          puzzles: ctf.getPuzzlesForAdmin()
        });
      })
      .catch(err => handlers.routeError(res, err));
  })
  .post((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        ctf.updatePuzzles(req.body.puzzleData);
        res.status(200)
          .send();
      })
      .catch(err => handlers.routeError(res, err));
  });

// POST `/api/admin/settings/locations` to save new locationId data
router.post("/api/admin/settings/locations", (req, res) => {
  handlers
    .isAuth(req.session.userId, "admin")
    .then(() => {
      ctf.updateLocations(req.body.locationData);
      res.status(200)
        .send();
    })
    .catch(err => handlers.routeError(res, err));
});

// GET `/api/admin/settings/teams` to retrieve admin team data
// POST `/api/admin/settings/teams` to save team list
router
  .route("/api/admin/settings/teams")
  .get((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        let teamList = [];
        for (let team in ctf.teamList) {
          const {_id, name, locationId} = ctf.teamList[team];
          teamList.push({_id, name, locationId});
        }
        res.json(teamList);
      })
      .catch(err => handlers.routeError(res, err));
  })
  .post((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        const {teamList} = req.body;

        const addTeams = new Promise((resolve, reject) => {
          teamList.forEach((team, idx, arr) => {
            const {_id, name, locationId, password} = team;

            const userData = {
              name,
              locationId,
              password
            };

            Account.findOne({$or: [{_id}, {name}]}, (err, acc) => {
              if (err) return logger.error(err);
              if (acc !== null && _id) {
                /*
                 * Team already exists, therefor we just need to update its properties
                 * */
                if (name !== null && name !== "") ctf.teamList[_id].changeName(name);

                if (locationId !== null && locationId > -1) ctf.teamList[_id].changeLocationId(locationId);

                if (password !== null && password !== "") {
                  acc.password = password;
                  acc.save();
                }
              } else {
                Account.create(userData, (error, user) => {
                  if (error) {
                    return logger.error(error);
                  } else {
                    new Team(user._id, user.name, user.locationId);
                    if (idx === arr.length - 1) {
                      resolve();
                    }
                  }
                });
              }
            });
          });
        });

        addTeams.then(() => {
          res.status(200)
            .send();
        });

      })
      .catch(err => handlers.routeError(res, err));
  });

// POST `/api/admin/settings/deactivateteam` to deactivate team
router.post("/api/admin/settings/deactivateteam", (req, res) => {
  handlers
    .isAuth(req.session.userId, "admin")
    .then(() => {
      const {teamId} = req.body;

      Account.findOne({_id: teamId}, (err, acc) => {
        if (err) return logger.error(err);
        if (acc !== null) {
          delete ctf.teamList[teamId];
          delete ctf.teamScores[teamId];
          acc.isActive = false;
          acc.save();
        }
      });

      res.status(200)
        .send();
    })
    .catch(err => handlers.routeError(res, err));
});

// GET `/api/admin/settings/gamelength` to retrieve game length
// POST `/api/admin/settings/gamelength` to update game length
router
  .route("/api/admin/settings/gamelength")
  .get((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        return res.json({
          endTime: ctf.getEndTime()
        });
      })
      .catch(err => handlers.routeError(res, err));
  })
  .post((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        const {gameEndTime} = req.body;

        ctf.updateEndTime(gameEndTime);

        res.status(200)
          .send();
      })
      .catch(err => handlers.routeError(res, err));
  });

// GET `/api/admin/gamedata` to retrieve game data
router.get("/api/admin/gamedata", (req, res) => {
  handlers
    .isAuth(req.session.userId, "admin")
    .then(() => {
      return res.json({
        gameStatistics: dc.gameStatistics,
        gameLog: dc.gameLog
      });
    })
    .catch(err => handlers.routeError(res, err));
});

// GET `/api/scores` to retrieve team scores
router.get("/api/scores", (req, res) => {
  const {format} = req.query;
  if (format === "json") {
    res.json(ctf.getTeamScores());
  } else if (format === "csv") {
    let content = "position,name,score";
    ctf.getTeamScores()
      .forEach((e, i) => {
        content += `\n${i + 1},${e.name},${e.score}`;
      });
    res.send(content);
  } else {
    res.send("Please specify a request query option for 'format' of either: json, csv");
  }
});

module.exports = router;
