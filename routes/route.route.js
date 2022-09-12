const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const routeSchema = require("../schemas/route.schemas");

const Route = mongoose.model("Route", routeSchema);

router.get("/", (req, res) => {
  Route.find({}, (err, routes) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const count = routes.length;
      res.status(200).json({
        count: count,
        data: routes,
      });
    }
  });
});

router.get("/:routeNumber", (req, res) => {
  const routeNumber = req.params.routeNumber;

  Route.findOne({ routeNumber: routeNumber }, (err, route) => {
    if (err) {
      res.status(500).json(err);
    } else if (!route) {
      res.status(404).json({
        status: 404,
        message: "Route Not Found.",
      });
    } else {
      res.status(200).json(route);
    }
  });
});

// get stoppage of a route using route number

router.get("/stoppage/:routeNumber", (req, res) => {
  const routeNumber = req.params.routeNumber;
  console.log(routeNumber);

  Route.findOne({ routeNumber: routeNumber }, (err, route) => {
    console.log(route);
    if (err) {
      res.status(500).json(err);
    } else if (!route) {
      res.status(404).json({
        status: 404,
        message: "Route Not Found.",
      });
    } else {
      console.log(route?.stoppages);
      res.status(200).json(route?.stoppages);
    }
  });
});
// Post
router.post("/", (req, res) => {
  const route = new Route({ ...req.body });
  route.save((err, route) => {
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
      res.status(201).json(route);
    }
  });
});

// add stoppage
router.post("/stoppage", (req, res) => {
  const routeNumber = req.body?.routeNumber;
  const x = {
    label: req.body?.label,
    lat: req.body?.lat,
    lon: req.body?.lon,
  };
  // const route = new Route({ ...req.body });
  Route.findOne({ routeNumber: routeNumber }, (err, route) => {
    if (err) {
      res.status(500).json(err);
    } else if (!route) {
      res.status(404).json({
        status: 404,
        message: "Invalid Input. Please try with valid information.",
      });
    } else {
      try {
        const tRoute = route.toObject();
        tRoute?.stoppages.push(x);
        const nRoute = new Route({ ...tRoute });

        var query = { routeNumber: nRoute.routeNumber };

        Route.findOneAndUpdate(query, nRoute, { new: true }, (err, route) => {
          if (err) {
            res.status(500).json(err);
          } else {
            const count = route.stoppages.length;
            res.status(200).json({
              status: 200,
              message: "Stoppage added successfully",
              stoppage: route.stoppages[count - 1],
              stoppageCount: count,
              data: route,
            });
          }
        });
      } catch (err) {
        x = {
          ...err,
          message: err.message,
        };
        res.status(400).json(x);
      }
    }
  });
});

// update stoppage
router.put("/stoppage", (req, res) => {
  const routeNumber = req.body?.routeNumber;
  const id = req.body?._id;

  const x = {
    label: req.body?.label,
    lat: req.body?.lat,
    lon: req.body?.lon,
  };
  Route.findOne({ routeNumber: routeNumber }, (err, route) => {
    if (err) {
      res.status(500).json(err);
    } else if (!route) {
      res.status(404).json({
        status: 404,
        message: "Invalid Input. Please try with valid information.",
      });
    } else {
      try {
        const tRoute = route.toObject();
        const n = tRoute?.stoppages.find((st) => {
          return st._id?.toString() === id;
        });
        const index = tRoute?.stoppages.indexOf(n);
        if (index > -1) {
          tRoute?.stoppages.splice(index, 1);

          tRoute?.stoppages.push(x);
          const nRoute = new Route({ ...tRoute });

          var query = { routeNumber: nRoute.routeNumber };

          Route.findOneAndUpdate(query, nRoute, { new: true }, (err, route) => {
            if (err) {
              res.status(500).json(err);
            } else {
              const count = route.stoppages.length;
              res.status(200).json({
                status: 200,
                message: "Stoppage Updated successfully",
                stoppage: route.stoppages[count - 1],
                stoppageCount: count,
                data: route,
              });
            }
          });
        } else {
          res.status(404).json({
            status: 404,
            message: "Stoppage Not Found",
          });
        }
      } catch (err) {
        x = {
          ...err,
          message: err.message,
        };
        res.status(400).json(x);
      }
    }
  });
});

// router.post("/many", (req, res) => {
//   const buss = req.body;
//   Route.insertMany(buss, (err, buss) => {
//     if (err) {
//       res.status(500).json(err);
//     } else {
//       res.status(201).json(buss);
//     }
//   });
// });

router.put("/", (req, res) => {
  const route = new Route({ ...req.body });
  const nRoute = route.toObject();
  delete nRoute._id;

  var query = { routeNumber: route.routeNumber };

  Route.findOneAndUpdate(query, nRoute, { new: true }, (err, route) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(route);
    }
  });
});

//delete

router.delete("/:routeNumber", (req, res) => {
  const routeNumber = req.params.routeNumber;

  var query = { routeNumber: routeNumber };

  Route.deleteOne(query, (err, data) => {
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
          message: "Delete Unsuccessful. Bus not found.",
          deletedCount: 0,
        });
      }
    }
  });
});

module.exports = router;
