const Account = require("../models/account");
const jwt = require("jsonwebtoken");
const process = require("process");

/*
 * Compares client's account type to desired authentication type
 * */
const isAuth = (payload, reqUserType) => {
  const token = payload.headers["x-access-token"];
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject({
          errCode: 403,
          error: "Token authorization failed"
        });
      }

      Account.findOne({uuid: decoded.uuid})
        .exec((err, user) => {
          if (err) {
            reject({error: err});
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
                  error: "Account type is not appropriate type for this request"
                });
              }
            }
          }
        });
    });
  });
};

/*
 * Easy router error handler
 * */
const routeError = (res, err) => {
  return res.status(err.errCode ? err.errCode : 400)
    .json({
      error: err.error
    });
};

module.exports = {
  isAuth,
  routeError
};
