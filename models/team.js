const mongoose = require("mongoose");
const logger = require("../utils/logger");

let db;

const init = DB => {
  db = DB;
};

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  players: {
    type: Array,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  puzzles: {
    type: Object,
    required: true
  },
  lastUpdated: {
    type: Number,
    required: true
  }
});

const Team = mongoose.model("Team", TeamSchema);
module.exports = { init, Team };
