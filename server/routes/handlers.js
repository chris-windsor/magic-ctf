const Account = require("../models/account");

/*
 * Compares client's account type to desired authentication type
 * */
const isAuth = (userId, reqUserType) => {
  return new Promise((resolve, reject) => {
    Account.findById(userId)
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
