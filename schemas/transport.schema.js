const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema({
  numOfStudents: {
    type: Number,
  },
  routeNumber: {
    type: Number,
  },
  startTimes: Number,
});

module.exports = transportSchema;
