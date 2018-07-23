const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  locationId: {
    type: Number,
    required: true
  },
  teamName: {
    type: String,
    trim: true
  },
  accountType: {
    type: String,
    default: "player"
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.statics.authenticate = (username, password, callback) => {
  User.findOne({
    username: username
  }).exec((err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) return callback(null, user);
      else return callback();
    });
  });
};

UserSchema.pre("save", function(next) {
  let user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

let User = mongoose.model("User", UserSchema);
module.exports = User;
