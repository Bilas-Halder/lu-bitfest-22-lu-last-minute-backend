const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    index: true,
  }
});

module.exports = userSchema;