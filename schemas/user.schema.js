const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    // require: true,
  },
  username: {
    type: String,
    // require: true,
    unique: true,
    index: true,
    message: "Username is taken",
  },
  email: {
    type: String,
    // require: true,
    unique: true,
  },
  photoURL: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  oid: {
    // organization id
    type: Number,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "staff"],
  },
  regularRoute: {
    routeNumber: Number,
    stoppage: String,
  },
  student: {
    batch: Number,
    section: String,
  },
  teacher: {
    department: String,
    codeName: String,
    designation: String,
  },
});

module.exports = userSchema;
