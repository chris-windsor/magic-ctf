const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ctf = require("../utils/ctf");
const Team = require("../utils/team");
const dc = require("../utils/datacollection");
const logger = require("../utils/logger");
const handlers = require("./handlers");

// GET `/api/register/locations` to return available locations to register at
router.get("/api/register/locations", (req, res) =>
  res.json(ctf.getLocations())
);

// GET `/api/register/teams` to return available teams that have already been registered
router.get("/api/register/teams", (req, res) =>
  res.json(Object.keys(ctf.teamList))
);

// POST `/api/register` to register and login in the user and then add them to the `req.session.authUser`
router.post("/api/register", (req, res) => {
  if (req.body.password !== req.body.passwordConf) {
    return res.status(401).json({
      error: "Passwords do not match"
    });
  }

  const {
    username,
    isCoach,
    teamName,
    locationId,
    password,
    passwordConf
  } = req.body;

  if (isCoach) {
    if (!(username && locationId !== -1 && password && passwordConf)) {
      return res.status(400).json({
        error: "All fields required"
      });
    }
  } else {
    if (
      !(username && teamName && locationId !== -1 && password && passwordConf)
    ) {
      return res.status(400).json({
        error: "All fields required"
      });
    }
  }

  let userData = {
    username,
    locationId,
    password,
    passwordConf
  };

  if (isCoach) userData.accountType = "coach";
  else userData.teamName = teamName;

  User.findOne({ username }, (err, resp) => {
    if (err) return logger.error(err);
    if (resp !== null) {
      return res.status(409).json({
        error: "Username taken"
      });
    } else {
      User.create(userData, (error, user) => {
        if (error) {
          res.status(500).json({
            error
          });
        } else {
          req.session.userId = user._id;
          req.session.authUser = {
            username: user.username,
            teamName: user.teamName,
            accountType: user.accountType
          };
          const userTeam = user.teamName;
          if (userTeam !== undefined) {
            if (!ctf.teamList[userTeam]) {
              let newTeam = new Team.Team(userTeam, user.locationId, [
                user.username
              ]);
              ctf.teamList[userTeam] = newTeam;
              ctf.teamScores[userTeam] = {
                score: 0,
                lastUpdated: Date.now(),
                location: user.locationId
              };
            } else {
              ctf.teamList[userTeam].addPlayer(user.username);
            }
          }
          return res.json({
            username: user.username,
            teamName: user.teamName,
            accountType: user.accountType
          });
        }
      });
    }
  });
});

// POST `/api/login` to log in the user and then add them to the `req.session.authUser`
router.post("/api/login", (req, res) => {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, (error, user) => {
      if (error || !user) {
        res.status(401).json({
          error: "Incorrect username or password"
        });
      } else {
        req.session.userId = user._id;
        req.session.authUser = {
          username: user.username,
          teamName: user.teamName,
          accountType: user.accountType
        };
        const userTeam = user.teamName;
        if (userTeam !== undefined) {
          if (!ctf.teamList[userTeam]) {
            let newTeam = new Team.Team(userTeam, user.locationId, [
              user.username
            ]);
            ctf.teamList[userTeam] = newTeam;
            ctf.teamScores[userTeam] = {
              score: 0,
              lastUpdated: Date.now(),
              location: user.locationId
            };
          } else {
            ctf.teamList[userTeam].addPlayer(user.username);
          }
        }
        return res.json({
          username: user.username,
          teamName: user.teamName,
          accountType: user.accountType
        });
      }
    });
  } else {
    res.status(400).json({
      error: "Both fields required"
    });
  }
});

// POST `/api/logout` to log out the user and remove them from the `req.session`
router.post("/api/logout", (req, res) => {
  delete req.session.authUser;
  res.status(200);
});

// GET `/api/admin/settings/puzzles` to retrieve puzzle data
// POST `/api/admin/settings/puzzles` to save new puzzle data
router
  .route("/api/admin/settings/puzzles")
  .get((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        return res.json({
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
        return res.status(200);
      })
      .catch(err => handlers.routeError(res, err));
  });

// POST `/api/admin/settings/locations` to save new location data
router.post("/api/admin/settings/locations", (req, res) => {
  handlers
    .isAuth(req.session.userId, "admin")
    .then(() => {
      ctf.updateLocations(req.body.locationData);
      return res.status(200);
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
          gameLength: ctf.gameLength
        });
      })
      .catch(err => handlers.routeError(res, err));
  })
  .post((req, res) => {
    handlers
      .isAuth(req.session.userId, "admin")
      .then(() => {
        ctf.gameLength = `${req.body.hr}:${req.body.min}`;
        return res.status(200);
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

// GET `/api/top5` to retrieve top 5 teams
router.get("/api/top5", (req, res) => {
  const rawScores = ctf.teamScores;
  let sorted = [];
  for (let team in rawScores) {
    const { score, lastUpdated } = rawScores[team];
    sorted.push({
      teamName: team,
      score,
      lastUpdated
    });
  }
  sorted.sort((a, b) => a.lastUpdated - b.lastUpdated);
  sorted.sort((a, b) => b.score - a.score);
  sorted = sorted.map(({ teamName, score }) => {
    return { teamName, score };
  });
  return res.json(sorted.splice(0, 5));
});

module.exports = router;
