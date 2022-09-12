const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const transportSchema = require("../schemas/transport.schema");
const Transport = mongoose.model("Transport", transportSchema);

const busSchema = require("../schemas/bus.schema");
const Bus = mongoose.model("Bus", busSchema);

router.get("/", (req, res) => {
  Transport.find({}, (err, transports) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const count = transports.length;
      res.status(200).json({
        count: count,
        data: transports,
      });
    }
  });
});

router.get("/available/at/:time", (req, res) => {
  const time = req.params.time;

  Bus.find({}, (err, bus) => {
    if (err) {
      res.status(500).json(err);
    } else if (!bus) {
      res.status(404).json({
        status: 404,
        message: "No buses in maintenance.",
      });
    } else {
      const available = bus.filter((bus) => {
        const pt = time - 3600;
        if (bus?.isActive && bus?.lastOccupied && pt > bus?.lastOccupied) {
          return true;
        } else if (bus?.isActive && !bus?.lastOccupied) {
          return true;
        }
      });

      const count = available.length;

      const comFnNumOfStu = (a, b) => {
        if (a.numOfStudents > b.numOfStudents) {
          return -1;
        } else if (a.numOfStudents < b.numOfStudents) {
          return 1;
        } else {
          return 0;
        }
      };
      const comFnCapOfBus = (a, b) => {
        if (a.capacity > b.capacity) {
          return -1;
        } else if (a.capacity < b.capacity) {
          return 1;
        } else {
          return 0;
        }
      };

      Transport.find({ startTimes: time }, (err, transports) => {
        if (err) {
          res.status(500).json(err);
        } else {
          let trans = new Set();
          let buses = new Set([...available]);
          trans.add("transports[0]");

          res.status(200).json({
            trans,
            buses,
            available,
            transports,
          });
        }
      });
      //   res.status(200).json({
      //     count: count,
      //     data: available,
      //   });
    }
  });
});

// Post
router.post("/", (req, res) => {
  const transport = new Transport({ ...req.body });
  transport.save((err, transport) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(transport);
    }
  });
});

//delete

router.delete("/:id", (req, res) => {
  var query = { _id: req.params.id };

  Transport.deleteOne(query, (err, data) => {
    if (err) {
      res.status(400).json(err);
    } else {
      if (data?.deletedCount) {
        res.status(200).json({
          status: 200,
          message: "Delete Successful.",
          deletedCount: 1,
        });
      } else {
        res.status(424).json({
          status: 424,
          message: "Delete Unsuccessful. Transport not found.",
          deletedCount: 0,
        });
      }
    }
  });
});

module.exports = router;
