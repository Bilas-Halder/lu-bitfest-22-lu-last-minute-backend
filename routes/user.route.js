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
      res.status(500).json(err);
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
      res.status(500).json(err);
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

router.get("/staffList", (req, res) => {
  User.find({ role: "staff", isAdmin: { $ne: true } }, (err, user) => {
    if (err) {
      res.status(500).json(err);
    } else if (!user) {
      res.status(404).json({
        status: 404,
        message: "There is no staff here.",
      });
    } else {
      res.status(200).json(user);
    }
  });
});

router.get("/adminList", (req, res) => {
  User.find({ isAdmin: true }, (err, user) => {
    if (err) {
      res.status(500).json(err);
    } else if (!user) {
      res.status(404).json({
        status: 404,
        message: "There is no staff here.",
      });
    } else {
      res.status(200).json(user);
    }
  });
});

router.get("/isAdmin/:username", (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(500).json(err);
    } else if (!user) {
      res.status(404).json({
        status: 404,
        message: "User Not Found.",
      });
    } else {
      if (user?.isAdmin) {
        res.status(200).json({
          isAdmin: true,
          username: user.username,
          email: user.email,
          contactNumber: user.contactNumber,
          displayName: username.displayName,
        });
      } else {
        res.status(200).json({
          isAdmin: false,
          username: user.username,
          email: user.email,
          message: `${user.username} is not an admin.`,
        });
      }
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
        res.status(409).json(x);
      } else {
        res.status(500).json(err);
      }
    } else {
      res.status(201).json(user);
    }
  });
});

// update
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
        res.status(500).json(err);
      } else {
        res.status(201).json(user);
      }
    }
  );
});

router.put("/addAdmin/:username", (req, res) => {
  var query = { username: req.params.username };
  console.log(req.body.username);

  User.findOne(query, (err, user) => {
    if (err) {
    } else {
      const nUser = user.toObject();
      nUser.isAdmin = true;
      User.findOneAndUpdate(query, nUser, { new: true }, (err, user) => {
        if (err) {
          res.status(500).json(err);
        } else {
          console.log(user);
          res.status(200).json({
            status: 200,
            message: `${user.username} is an admin now.`,
            data: user,
          });
        }
      });
    }
  });
});

router.put("/removeAdmin/:username", (req, res) => {
  var query = { username: req.params.username };

  User.findOne(query, (err, user) => {
    if (err) {
    } else {
      const nUser = user.toObject();
      nUser.isAdmin = false;
      User.findOneAndUpdate(query, nUser, { new: true }, (err, user) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({
            status: 200,
            message: `${user.username} is only a ${user.role} now.`,
            data: user,
          });
        }
      });
    }
  });
});

module.exports = router;
