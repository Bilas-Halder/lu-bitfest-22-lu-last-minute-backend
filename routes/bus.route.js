const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const busSchema = require("../schemas/bus.schema");

const Bus = mongoose.model("Bus", busSchema);

router.get("/", (req, res) => {
  Bus.find({}, (err, buses) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const count = buses.length;
      res.status(200).json({
        count: count,
        data: buses,
      });
    }
  });
});

router.get("/code/:codename", (req, res) => {
  const codename = req.params.codename;

  Bus.findOne({ codename: codename }, (err, bus) => {
    if (err) {
      res.status(500).json(err);
    } else if (!bus) {
      res.status(404).json({
        status: 404,
        message: "Bus Not Found.",
      });
    } else {
      res.status(200).json(bus);
    }
  });
});

router.get("/active", (req, res) => {
  Bus.find({ isActive: true }, (err, bus) => {
    if (err) {
      res.status(500).json(err);
    } else if (!bus) {
      res.status(404).json({
        status: 404,
        message: "No Active Buses.",
      });
    } else {
      const count = bus.length;
      res.status(200).json({
        count: count,
        data: bus,
      });
    }
  });
});
router.get("/maintenance", (req, res) => {
  Bus.find({ isActive: false }, (err, bus) => {
    if (err) {
      res.status(500).json(err);
    } else if (!bus) {
      res.status(404).json({
        status: 404,
        message: "No buses in maintenance.",
      });
    } else {
      const count = bus.length;
      res.status(200).json({
        count: count,
        data: bus,
      });
    }
  });
});

// Post
router.post("/", (req, res) => {
  const bus = new Bus({ ...req.body });
  bus.save((err, bus) => {
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
      res.status(201).json(bus);
    }
  });
});

// router.post("/many", (req, res) => {
//   const buss = req.body;
//   Bus.insertMany(buss, (err, buss) => {
//     if (err) {
//       res.status(500).json(err);
//     } else {
//       res.status(201).json(buss);
//     }
//   });
// });

router.put("/", (req, res) => {
  const bus = new Bus({ ...req.body });
  const nBus = bus.toObject();
  delete nBus._id;

  var query = { codename: bus.codename };

  Bus.findOneAndUpdate(query, nBus, { upsert: true, new: true }, (err, bus) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(bus);
    }
  });
});

//delete

router.delete("/", (req, res) => {
  const codename = req.params.codename;

  var query = { codename: codename };

  Bus.deleteOne(query, (err) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json({
        status: 200,
        message: "Delete Successful.",
        deleted: 1,
      });
    }
  });
});

module.exports = router;
