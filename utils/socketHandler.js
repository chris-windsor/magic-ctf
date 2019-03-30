const Account = require("../models/account");
const ctf = require("./ctf");
const dc = require("./datacollection");
const logger = require("./logger");

const init = io => {
  /*
   * Handles initial socket connection to server
   *
   * Checks client authorization and dispatches appropriate information relative to the client
   * */
  io.on("connection", socket => {
    const {userId} = socket.handshake.session;

    Account.findById(userId)
           .exec((err, user) => {
             let isAuth = true;
             if (err) {
               return logger.error(err);
             } else {
               if (user === null) {
                 /*
                  * Clients that are un-authorized just need to be included in the general ctf room
                  *
                  * Currently these requests are only applicable to general clients who are just viewing scoreboard page
                  * */
                 socket.join("ctf");
                 isAuth = false;
               } else {
                 if (user.accountType === "player") {
                   /*
                    * Teams are put into respective rooms so that their updates are only passed to them
                    *
                    * These per team responses will include: answer submission, hint requests, and their puzzle set
                    * */
                   const teamRoom = `team-${user._id}`;
                   socket.join(["ctf", teamRoom]);
                 } else {
                   /*
                    * Anyone logged into admin account just needs general ctf data and some extra admin data
                    * */
                   socket.join(["ctf", "ctf-admin"]);
                 }
               }
             }
             /*
              * Emit game state to connected client
              * */
             socket.emit("updateGameStatus", {
               isAuth,
               isActive: ctf.isGameRunning(),
               teamScores: ctf.teamScores,
               endTime: ctf.getEndTime()
             });
           });

    /*
     * Return respective puzzle set to team
     * */
    socket.on("requestPuzzles", () => {
      Account.findById(userId)
             .exec((err, user) => {
               if (err) {
                 return logger.error(err);
               } else {
                 if (user !== null && user.accountType === "player") {
                   if (ctf.isGameRunning() && ctf.teamList[user._id]) {
                     socket.emit("updateTeamPuzzles", ctf.teamList[user._id].getPuzzles());
                   }
                 }
               }
             });
    });

    /*
     * Handle answer submission
     * */
    socket.on("submitAnswer", submittedAnswer => {
      Account.findById(userId)
             .exec((err, user) => {
               if (err) {
                 return logger.error(err);
               } else {
                 if (user !== null && user.accountType === "player") {
                   let teamPuzzleData = [];
                   if (ctf.isGameRunning() && ctf.teamList[user._id]) {
                     const {puzzleId, puzzleName} = submittedAnswer;

                     const answer = ctf.checkAnswer(submittedAnswer);
                     if (answer.correct === true) {
                       const team = ctf.teamList[user._id];

                       team.addCorrectPuzzle(puzzleId);

                       /*
                        * Calculate final puzzle cost based on usage of hints
                        *
                        * Update team's score with new puzzle reward
                        * */
                       let totalUsedHintsCost = 0;
                       team.getPuzzles()[puzzleId].hints.forEach(hint => {
                         if (hint.content !== "") totalUsedHintsCost += hint.cost;
                       });

                       team.addScore(
                         answer.reward - totalUsedHintsCost
                       );

                       teamPuzzleData = team.getPuzzles();

                       const teamRoom = `team-${team._id}`;

                       /*
                        * Send the team their updated puzzle set
                        * */
                       io.in(teamRoom)
                         .emit("updateTeamPuzzles", teamPuzzleData);

                       /*
                        * Update game status with newly calculated score list
                        * */
                       io.in("ctf")
                         .emit("updateGameStatus", {
                           teamScores: ctf.teamScores
                         });

                       /*
                        * Log team action for data collection
                        * */
                       dc.addPuzzleSuccess(puzzleId);
                       dc.addLog(
                         `Team: '${team.name}' solved puzzle: '${puzzleName}'.`
                       );
                     } else {
                       /*
                        * Alert team of their incorrect answer submission
                        * */
                       socket.emit("incorrectAnswer", puzzleName);

                       /*
                        * Log team action for data collection
                        */
                       dc.addPuzzleAttempt(puzzleId);
                       dc.addLog(
                         `Team: '${
                           user.name
                           }' attempted puzzle: '${puzzleName}' with answer: '${
                           submittedAnswer.answer
                           }'.`
                       );
                     }
                   }
                 }
               }
             });
    });

    /*
     * Handle hint requests
     * */
    socket.on("requestHint", requestedHint => {
      Account.findById(userId)
             .exec((err, user) => {
               if (err) {
                 return logger.error(err);
               } else {
                 if (user !== null && user.accountType === "player") {
                   let teamPuzzleData = [];
                   if (ctf.isGameRunning() && ctf.teamList[user._id]) {
                     const {puzzleId, puzzleName, hintId} = requestedHint;

                     const team = ctf.teamList[user._id];

                     if (team.hasHintAccess(puzzleId, hintId)) {
                       const hint = ctf.getHint(requestedHint);

                       /*
                        * Add requested hint to team's puzzle set
                        * */
                       team.addHint(
                         puzzleId,
                         hintId,
                         hint.hintContent
                       );

                       teamPuzzleData = team.getPuzzles();

                       const teamRoom = `team-${team._id}`;

                       /*
                        * Send the team their updated puzzle set
                        * */
                       io.in(teamRoom)
                         .emit("updateTeamPuzzles", teamPuzzleData);

                       /*
                        * Update game status with newly calculated score list
                        * */
                       io.in("ctf")
                         .emit("updateGameStatus", {
                           teamScores: ctf.teamScores
                         });

                       /*
                        * Log team action for data collection
                        * */
                       dc.addHintUse(puzzleId, hintId);
                       dc.addLog(
                         `Team: '${team.name}' requested hint #${hintId +
                         1} for puzzle: '${puzzleName}'.`
                       );
                     }
                   }
                 }
               }
             });
    });

    /*
     * Handle admin commands
     * */
    socket.on("adminCommand", command => {
      Account.findById(socket.handshake.session.userId)
             .exec((err, user) => {
               if (err) {
                 return logger.error(err);
               } else {
                 if (user !== null && user.accountType === "admin") {
                   switch (command.name) {
                     case "start":
                       /*
                        * Change game state to active and update all users of state change
                        * */
                       ctf.changeGameState(true);

                       io.in("ctf")
                         .emit("gameStateChange");

                       io.in("ctf-admin")
                         .emit("updateGameStatus", {
                           isActive: ctf.isGameRunning(),
                           endTime: ctf.getEndTime()
                         });
                       break;
                     case "stop":
                       /*
                        * Change game state to inactive and update all users of state change
                        * */
                       ctf.changeGameState(false);

                       io.in("ctf")
                         .emit("gameStateChange");

                       io.in("ctf-admin")
                         .emit("updateGameStatus", {
                           isActive: ctf.isGameRunning(),
                           endTime: ctf.getEndTime()
                         });
                       break;
                     default:
                       /*
                        * No matching command found
                        *
                        * Currently ignored...
                        * */
                       break;
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
