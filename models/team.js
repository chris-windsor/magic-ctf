const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
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
module.exports = { Team };
