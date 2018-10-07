const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ctf = require("../utils/ctf");
const Team = require("../utils/team");
const dc = require("../utils/datacollection");

// GET `/api/register/locations` to return available locations to register at
router.get("/api/register/locations", function(req, res) {
  return res.json(ctf.getLocations());
});

// POST `/api/register` to register and login in the user and then add them to the `req.session.authUser`
router.post("/api/register", function(req, res) {
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

  if (isCoach) {
    userData.accountType = "coach";
  } else {
    userData.teamName = teamName;
  }

  User.findOne({ username }, (err, resp) => {
    if (err) return console.log("err", err);
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
              let newTeam = new Team.Team(userTeam);
              newTeam.addPlayer(user.username);
              ctf.teamList[userTeam] = newTeam;
              ctf.teamScores[userTeam] = {
                score: 0,
                lastUpdated: Date.now()
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
router.post("/api/login", function(req, res) {
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
            let newTeam = new Team.Team(userTeam);
            newTeam.addPlayer(user.username);
            ctf.teamList[userTeam] = newTeam;
            ctf.teamScores[userTeam] = {
              score: 0,
              lastUpdated: Date.now()
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
router.post("/api/logout", function(req, res) {
  delete req.session.authUser;
  res.json({
    ok: true
  });
});

// GET `/api/admin/settings/puzzles` to retrieve puzzle data
router.get("/api/admin/settings/puzzles", function(req, res) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return error;
    } else {
      if (user === null) {
        res.status(401).json({
          error: "You must be an authenticated to make that request"
        });
      } else {
        if (user.accountType === "admin") {
          return res.json({
            puzzles: ctf.getPuzzlesForAdmin()
          });
        } else {
          res.status(403).json({
            error: "You must be an admin to make that request"
          });
        }
      }
    }
  });
});

// POST `/api/admin/settings/puzzles` to save new puzzle data
router.post("/api/admin/settings/puzzles", function(req, res) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return error;
    } else {
      if (user === null) {
        res.status(401).json({
          error: "You must be an authenticated to make that request"
        });
      } else {
        if (user.accountType === "admin") {
          ctf.updatePuzzles(req.body.puzzleData);
          res.json({
            ok: true
          });
        } else {
          res.status(403).json({
            error: "You must be an admin to make that request"
          });
        }
      }
    }
  });
});

// POST `/api/admin/settings/locations` to save new location data
router.post("/api/admin/settings/locations", function(req, res) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return error;
    } else {
      if (user === null) {
        res.status(401).json({
          error: "You must be an authenticated to make that request"
        });
      } else {
        if (user.accountType === "admin") {
          ctf.updateLocations(req.body.locationData);
          res.json({
            ok: true
          });
        } else {
          res.status(403).json({
            error: "You must be an admin to make that request"
          });
        }
      }
    }
  });
});

// GET `/api/admin/settings/gamelength` to retrieve game length
router.get("/api/admin/settings/gamelength", function(req, res) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return error;
    } else {
      if (user === null) {
        res.status(401).json({
          error: "You must be an authenticated to make that request"
        });
      } else {
        if (user.accountType === "admin") {
          return res.json({
            gameLength: ctf.gameLength
          });
        } else {
          res.status(403).json({
            error: "You must be an admin to make that request"
          });
        }
      }
    }
  });
});

// POST `/api/admin/settings/gamelength` to update game length
router.post("/api/admin/settings/gamelength", function(req, res) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return error;
    } else {
      if (user === null) {
        res.status(401).json({
          error: "You must be an authenticated to make that request"
        });
      } else {
        if (user.accountType === "admin") {
          ctf.gameLength = `${req.body.hr}:${req.body.min}`;
          res.json({
            ok: true
          });
        } else {
          res.status(403).json({
            error: "You must be an admin to make that request"
          });
        }
      }
    }
  });
});

// GET `/api/admin/gamedata` to retrieve game data
router.get("/api/admin/gamedata", function(req, res) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return error;
    } else {
      if (user === null) {
        res.status(401).json({
          error: "You must be an authenticated to make that request"
        });
      } else {
        if (user.accountType === "admin") {
          return res.json({
            gameStatistics: dc.gameStatistics,
            gameLog: dc.gameLog
          });
        } else {
          res.status(403).json({
            error: "You must be an admin to make that request"
          });
        }
      }
    }
  });
});

module.exports = router;
