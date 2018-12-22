const User = require("../models/user");

const isAuth = (userId, reqUserType) => {
  return new Promise((resolve, reject) => {
    User.findById(userId).exec((error, user) => {
      if (error) {
        reject({ error });
      } else {
        if (user === null) {
          reject({
            errCode: 401,
            error: "You must be an authenticated user to make that request"
          });
        } else {
          if (user.accountType === reqUserType) resolve();
          else {
            reject({
              errCode: 403,
              error: "User is not appropriate type for this request"
            });
          }
        }
      }
    });
  });
};

const routeError = (res, err) => {
  return res.status(err.errCode ? err.errCode : 400).json({
    error: err.error
  });
};

module.exports = {
  isAuth,
  routeError
};
