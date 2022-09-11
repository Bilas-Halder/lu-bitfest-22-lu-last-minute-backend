const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const users = require("./routes/user.route");

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

app.get("/", (req, res) => {
  res.send("Hello EveryOne!");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
