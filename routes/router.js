const express = require("express");
const router = express.Router();
const User = require("../models/user");

// POST `/api/login` to log in the user and add him to the `req.session.authUser`
router.post("/api/login", function(req, res) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, (error, user) => {
      if (error || !user) {
        res.status(401).json({
          error: "Incorrect username or password"
        });
      } else {
        req.session.authUser = {
          username: user.username
        };
        return res.json({
          username: user.username
        });
      }
    });
  } else {
    res.status(400).json({
      error: "Both fields required"
    });
  }
});

// POST `/api/logout` to log out the user and remove it from the `req.session`
router.post("/api/logout", function(req, res) {
  delete req.session.authUser;
  res.json({
    ok: true
  });
});

module.exports = router;
