const User = require("../models/user");
const ctf = require("./ctf");
const Team = require("../utils/team");

const init = io => {
  io.on("connection", socket => {
    User.findById(socket.handshake.session.userId).exec(function(error, user) {
      if (error) {
        return error;
      } else {
        if (user === null) {
          // not logged
          // this shouldnt be possible theoretically so we arent going to worry about it for now
        } else {
          if (user.accountType === "player") {
            let teamRoom = "team-" + user.teamName;
            socket.join(["ctf", teamRoom]);
          } else {
            // admin just needs to join ctf room
            socket.join("ctf");
          }
        }
      }
    });
    socket.emit("updateGameStatus", {
      isActive: ctf.isGameRunning(),
      gameLength: ctf.gameLength,
      teamScores: ctf.teamScores
    });
    socket.on("requestPuzzles", () => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            if (user.accountType === "player") {
              let teamPuzzleData = [];
              if (ctf.isGameRunning()) {
                if (Team.teamList[user.teamName]) {
                  teamPuzzleData = Team.teamList[user.teamName].getPuzzles();
                }
              }
              socket.emit("updateTeamPuzzles", teamPuzzleData);
            } else {
              // no perms
              // this also doesn't need to be handled
            }
          }
        }
      });
    });
    socket.on("submitAnswer", submittedAnswer => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            if (user.accountType === "player") {
              let teamPuzzleData = [];
              if (ctf.isGameRunning()) {
                if (Team.teamList[user.teamName]) {
                  let answer = ctf.checkAnswer(submittedAnswer);
                  if (answer.correct === true) {
                    Team.teamList[user.teamName].addCorrectPuzzle(
                      submittedAnswer.puzzleId
                    );
                    Team.teamList[user.teamName].addScore(answer.reward);
                    teamPuzzleData = Team.teamList[user.teamName].getPuzzles();
                    let teamRoom = "team-" + user.teamName;
                    io.to(teamRoom).emit("updateTeamPuzzles", teamPuzzleData);
                  } else {
                    socket.emit("incorrectAnswer", submittedAnswer.puzzleName);
                  }
                }
              }
            } else {
              // no perms
              // this also doesn't need to be handled
            }
          }
        }
      });
    });
    socket.on("requestHint", requestedHint => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            if (user.accountType === "player") {
              let teamPuzzleData = [];
              if (ctf.isGameRunning()) {
                if (Team.teamList[user.teamName]) {
                  let hint = ctf.getHint(requestedHint);
                  Team.teamList[user.teamName].addHint(
                    requestedHint.puzzleId,
                    requestedHint.hintId,
                    hint.hintContent
                  );
                  Team.teamList[user.teamName].subtractScore(hint.hintCost);
                  teamPuzzleData = Team.teamList[user.teamName].getPuzzles();
                  let teamRoom = "team-" + user.teamName;
                  io.to(teamRoom).emit("updateTeamPuzzles", teamPuzzleData);
                }
              }
            } else {
              // no perms
              // this also doesn't need to be handled
            }
          }
        }
      });
    });
    socket.on("adminCommand", command => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            if (user.accountType === "admin") {
              switch (command.command) {
                case "start":
                  ctf.changeGameState(true);
                  io.to("ctf").emit("gameStateChange");
                  break;
                case "stop":
                  ctf.changeGameState(false);
                  io.to("ctf").emit("gameStateChange");
                  break;
                default:
                  // no commands were found, this probably does not need to be handled
                  break;
              }
            } else {
              // no perms
              // this also doesn't need to be handled
            }
          }
        }
      });
    });
  });
};

module.exports = {
  init
};
