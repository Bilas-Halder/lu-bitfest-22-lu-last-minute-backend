const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const users = require("./routes/user.route");
const admins = require("./routes/admin.route");
const buses = require("./routes/bus.route");
const routes = require("./routes/route.route");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//middleWares
app.use(cors());
app.use(express.json());

app.use("/users", users);
app.use("/admin", admins);
app.use("/bus", buses);
app.use("/route", routes);

app.get("/", (req, res) => {
  res.send("Hello EveryOne!");
});

app.use((err, req, res, next) => {
  if (error?.message) {
    x = {
      ...err,
      message: err.message,
    };
    console.log(x);
    res.status(400).json(x);
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
