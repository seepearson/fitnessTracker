// Add code to userModel.js to complete the model

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const workoutModel = require("./workoutModel");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Route Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});
// Route Exercise Page
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "exercise.html"));
});
// Route Exercise Page
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "stats.html"));
});

//Route data for stats page
app.get("/api/workouts/range", (req, res) => {
  workoutModel.find({}).then(function (data) {
    res.json(data);
  });
});
//Route data created
app.get("/api/workouts", ({ body }, res) => {
  workoutModel.find(body).then(function (data) {
    res.json(data);
  });
});
// Route WorkoutModel create object
app.post("/api/workouts", ({ body }, res) => {
  workoutModel.create(body).then(function (data) {
    res.json(data);
  });
});
// Route WorkoutModel update object
app.put("/api/workouts/:id", (req, res) => {
  workoutModel
    .update(
      {
        _id: req.params.id,
      },
      {
        $push: {
          exercises: req.body,
        },
      }
    )
    .then(function (data) {
      res.json(data);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
