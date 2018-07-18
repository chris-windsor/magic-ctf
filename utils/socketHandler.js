const User = require("../models/user");
const ctf = require("./ctf");

const init = (io) => {
  io.on("connection", (socket) => {
    socket.join("ctf");
    socket.emit("updateGameStatus", {
      isActive: ctf.isGameRunning()
      // TODO: send back time left, etc...
    });
    socket.on("adminCommand", (command) => {
      User.findById(socket.handshake.session.userId).exec(function(error, user) {
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
