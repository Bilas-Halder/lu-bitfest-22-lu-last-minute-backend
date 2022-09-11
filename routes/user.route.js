const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = require("../schemas/user.schema");

const User = mongoose.model("User", userSchema);

router.get("/", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Need More Information.",
  });
});
router.get("/:username/email", (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else if (!user) {
      res.status(404).json({
        status: 404,
        message: "User Not Found.",
      });
    } else {
      res.status(200).json({
        status: 200,
        email: user.email,
      });
    }
  });
});
router.get("/:username/info", (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else if (!user) {
      res.status(404).json({
        status: 404,
        message: "User Not Found.",
      });
    } else {
      res.status(200).json(user);
    }
  });
});

// Post
router.post("/", (req, res) => {
  const user = new User({ ...req.body });
  user.save((err, user) => {
    if (err) {
      const dup = Object.keys(err?.keyPattern)[0];
      if (err.code === 11000) {
        const x = {
          status: 409,
          code: 11000,
          message: `${dup} already exist.`,
        };
        res.status(409).send(x);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.status(201).send(user);
    }
  });
});

// router.post("/many", (req, res) => {
//   const users = req.body;
//   User.insertMany(users, (err, users) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(users);
//     }
//   });
// });

router.put("/", (req, res) => {
  const user = new User({ ...req.body });
  const nUser = user.toObject();
  delete nUser._id;

  var query = { username: user.username };

  User.findOneAndUpdate(
    query,
    nUser,
    { upsert: true, new: true },
    (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json(user);
      }
    }
  );
});

module.exports = router;
