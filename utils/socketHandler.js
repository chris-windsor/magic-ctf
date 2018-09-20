const User = require("../models/user");
const ctf = require("./ctf");

const init = io => {
  io.on("connection", socket => {
    User.findById(socket.handshake.session.userId).exec(function(error, user) {
      if (error) {
        return error;
      } else {
        if (user === null) {
          // this adds people who are not authenticated to the room
          // this allows non participants to still get scoreboard updates
          socket.join("ctf");
        } else {
          if (user.accountType === "player") {
            // this adds each team to its own room
            // which allows teams to recieve only their updates
            // updates per team include: puzzle submittal and hint request
            let teamRoom = "team-" + user.teamName;
            // this adds each team to a room for their respective location
            // which allows teams to request help from coaches
            // only sends help to coaches that share that location
            let locationRoom = "location-" + user.locationId;
            socket.join(["ctf", teamRoom, locationRoom]);
            // updates scoreboard for everyone
            io.to("ctf").emit("updateGameStatus", {
              teamScores: ctf.teamScores
            });
          } else if (user.accountType === "coach") {
            // coach just needs to join the room for their location
            // which allows them to recieve help requests from teams at that location
            socket.join(["ctf-coaches", "coach-location-" + user.locationId]);
            let helpRequests = [];
            let storedRequests =
              ctf.helpRequests["location-" + user.locationId];
            if (storedRequests) {
              if (storedRequests.length > 0) {
                helpRequests = storedRequests;
              }
            }
            socket.emit("updateHelpRequests", helpRequests);
          } else {
            // admin just needs to join ctf room
            socket.join(["ctf", "ctf-admins"]);
          }
        }
      }
    });
    // sends game state at time of initial socket connection
    socket.emit("updateGameStatus", {
      isActive: ctf.isGameRunning(),
      gameLength: ctf.gameLength,
      teamScores: ctf.teamScores,
      remainingTime: ctf.getRemainingTime()
    });
    // handles updating of puzzles per team
    socket.on("requestPuzzles", () => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged in
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            // only want to send data to players
            if (user.accountType === "player") {
              let teamPuzzleData = [];
              // only want to send teams the puzzles if the game is active
              if (ctf.isGameRunning()) {
                if (ctf.teamList[user.teamName]) {
                  teamPuzzleData = ctf.teamList[user.teamName].getPuzzles();
                }
              }
              // sends back puzzle data
              socket.emit("updateTeamPuzzles", teamPuzzleData);
            }
          }
        }
      });
    });
    // handles answer submittal
    socket.on("submitAnswer", submittedAnswer => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged in
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            // only want to send data to players
            if (user.accountType === "player") {
              let teamPuzzleData = [];
              if (ctf.isGameRunning()) {
                if (ctf.teamList[user.teamName]) {
                  // runs comparison between submitted and actual answer
                  let answer = ctf.checkAnswer(submittedAnswer);
                  if (answer.correct === true) {
                    ctf.teamList[user.teamName].addCorrectPuzzle(
                      submittedAnswer.puzzleId
                    );
                    // get total cost of any hints used
                    let totalUsedHintsCost = 0;
                    ctf.teamList[user.teamName].puzzles[
                      submittedAnswer.puzzleId
                    ].hints.forEach(hint => {
                      if (hint.content != "") {
                        totalUsedHintsCost += hint.cost;
                      }
                    });
                    // gives points to team equivalent to puzzle value
                    ctf.teamList[user.teamName].addScore(
                      answer.reward - totalUsedHintsCost
                    );
                    teamPuzzleData = ctf.teamList[user.teamName].getPuzzles();
                    let teamRoom = "team-" + user.teamName;
                    // broadcasts to all team players their updated puzzles
                    // their puzzles will display the answered puzzle as solved
                    io.to(teamRoom).emit("updateTeamPuzzles", teamPuzzleData);
                    // broadcasts to everyone the new updated team scores
                    io.to("ctf").emit("updateGameStatus", {
                      teamScores: ctf.teamScores
                    });
                    socket.emit("updateGameStatus", {
                      teamScores: ctf.teamScores
                    });
                  } else {
                    // sends event to alert teams that their answer was incorrect
                    socket.emit("incorrectAnswer", submittedAnswer.puzzleName);
                  }
                }
              }
            }
          }
        }
      });
    });
    // handles hint requesting
    socket.on("requestHint", requestedHint => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged in
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            // only want to send data to players
            if (user.accountType === "player") {
              let teamPuzzleData = [];
              if (ctf.isGameRunning()) {
                if (ctf.teamList[user.teamName]) {
                  let hint = ctf.getHint(requestedHint);
                  ctf.teamList[user.teamName].addHint(
                    requestedHint.puzzleId,
                    requestedHint.hintId,
                    hint.hintContent
                  );
                  teamPuzzleData = ctf.teamList[user.teamName].getPuzzles();
                  let teamRoom = "team-" + user.teamName;
                  // broadcasts to all team players their updated puzzles
                  // their puzzles will now contain the selected hint
                  io.to(teamRoom).emit("updateTeamPuzzles", teamPuzzleData);
                  // broadcasts to everyone the new updated team scores
                  io.to("ctf").emit("updateGameStatus", {
                    teamScores: ctf.teamScores
                  });
                  socket.emit("updateGameStatus", {
                    teamScores: ctf.teamScores
                  });
                }
              }
            }
          }
        }
      });
    });
    // handles help requesting
    socket.on("requestHelp", () => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged in
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            // only want to allow help request for players
            if (user.accountType === "player") {
              let storedRequests =
                ctf.helpRequests["location-" + user.locationId];
              if (storedRequests) {
                ctf.helpRequests["location-" + user.locationId].push(
                  user.teamName
                );
              } else {
                ctf.helpRequests["location-" + user.locationId] = [
                  user.teamName
                ];
              }
              io.to("coach-location-" + user.locationId).emit(
                "updateHelpRequests",
                ctf.helpRequests["location-" + user.locationId]
              );
            }
          }
        }
      });
    });
    // handles help request removing
    socket.on("removeHelpRequest", hintIndex => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged in
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            // only want to allow coaches to remove help requests
            if (user.accountType === "coach") {
              ctf.helpRequests["location-" + user.locationId].splice(
                hintIndex,
                1
              );
              let helpRequests = [];
              let storedRequests =
                ctf.helpRequests["location-" + user.locationId];
              if (storedRequests) {
                if (storedRequests.length > 0) {
                  helpRequests = storedRequests;
                }
              }
              socket.emit("updateHelpRequests", helpRequests);
            }
          }
        }
      });
    });
    // handles admin commands
    socket.on("adminCommand", command => {
      User.findById(socket.handshake.session.userId).exec(function(
        error,
        user
      ) {
        if (error) {
          return error;
        } else {
          if (user === null) {
            // not logged in
            // this shouldnt be possible theoretically so we arent going to worry about it for now
          } else {
            // only want to perform commands if user is an admin
            if (user.accountType === "admin") {
              switch (command.command) {
                case "start":
                  // changes game state to active
                  ctf.changeGameState(true);
                  io.to("ctf").emit("gameStateChange");
                  io.to("ctf-coaches").emit("updateGameStatus", {
                    isActive: ctf.isGameRunning(),
                    remainingTime: ctf.getRemainingTime()
                  });
                  io.to("ctf-admins").emit("updateGameStatus", {
                    isActive: ctf.isGameRunning(),
                    remainingTime: ctf.getRemainingTime()
                  });
                  break;
                case "stop":
                  // changes game state to inactive
                  ctf.changeGameState(false);
                  io.to("ctf").emit("gameStateChange");
                  io.to("ctf-coaches").emit("updateGameStatus", {
                    isActive: ctf.isGameRunning(),
                    remainingTime: ctf.getRemainingTime()
                  });
                  io.to("ctf-admins").emit("updateGameStatus", {
                    isActive: ctf.isGameRunning(),
                    remainingTime: ctf.getRemainingTime()
                  });
                  break;
                default:
                  // no commands were found, this should not be possible
                  // this probably does not need to be handled
                  break;
              }
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
