const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = require("../schemas/user.schema");

const User = mongoose.model("User", userSchema);

router.get("/", (req, res) => {
  
      res.status(200).json('Connected to user route');
});
module.exports = router;