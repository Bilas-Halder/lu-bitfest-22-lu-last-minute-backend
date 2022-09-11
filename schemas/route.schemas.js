const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: Number,
    // require: true,
    unique: true,
    index: true,
  },
  location: {
    label: String,
    lat: Number,
    lon: Number,
  },
  startTimes: [String],
  stoppages: [
    {
      label: String,
      lat: Number,
      lon: Number,
    },
  ],
});

module.exports = routeSchema;
