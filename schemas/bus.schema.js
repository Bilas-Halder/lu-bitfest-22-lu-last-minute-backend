const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  codename: {
    type: String,
    // require: true,
    unique: true,
    index: true,
  },
  licenseNum: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  isActive: {
    type: Number,
  },

  driver: {
    Name: String,
    contact: Number,
  },
});

module.exports = busSchema;