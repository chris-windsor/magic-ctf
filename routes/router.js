const express = require("express");
const router = express.Router();
const User = require("../models/user");

// POST `/api/register` to register and login in the user and then add them to the `req.session.authUser`
router.post("/api/register", function(req, res) {
  if (req.body.password !== req.body.passwordConf) {
    res.status(400).json({
      error: "Passwords do not match"
    });
  }

  const { username, teamName, locationId, password, passwordConf } = req.body;

  if (username && teamName && locationId && password && passwordConf) {
    const userData = {
      username,
      teamName,
      locationId,
      password,
      passwordConf
    };

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
        return res.json({
          username: user.username,
          teamName: user.teamName,
          accountType: user.accountType
        });
        // TODO: handle team management
      }
    });
  } else {
    res.status(400).json({
      error: "All fields required"
    });
  }
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
        return res.json({
          username: user.username,
          teamName: user.teamName,
          accountType: user.accountType
        });
        // TODO: handle team management
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

module.exports = router;
