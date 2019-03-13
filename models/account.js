const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String
  },
  locationId: {
    type: Number
  },
  accountType: {
    type: String,
    default: "player"
  },
  score: {
    type: Number
  },
  puzzles: {
    type: Object
  },
  lastUpdated: {
    type: Number
  }
});

/*
 * Authenticates user
 * */
AccountSchema.statics.authenticate = (name, password, callback) => {
  Account.findOne({
           name: name
         })
         .exec((err, acc) => {
           if (err) {
             return callback(err);
           } else if (!acc) {
             const err = new Error("Account not found.");
             err.status = 401;
             return callback(err);
           }
           bcrypt.compare(password, acc.password, (err, result) => {
             if (result === true) return callback(null, acc);
             else return callback();
           });
         });
};

/*
 * Hashes user password before saving it to database
 * */
AccountSchema.pre("save", function (next) {
  let account = this;
  bcrypt.hash(account.password, 10, (err, hash) => {
    if (err) return next(err);
    account.password = hash;
    next();
  });
});

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
