const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const transportSchema = require("../schemas/transport.schema");

const Transport = mongoose.model("Transport", transportSchema);

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
