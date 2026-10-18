const db = require("../models");
const router = require("express").Router();

//$push: https://docs.mongodb.com/manual/reference/operator/update/push/
//$addFields: https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/
//new: https://mongoosejs.com/docs/tutorials/findoneandupdate.html

// computes totalDuration from the exercises so it is always accurate
const addTotalDuration = {
  $addFields: { totalDuration: { $sum: "$exercises.duration" } },
};

//get workouts
router.get("/api/workouts", (req, res) => {
  db.Workout.aggregate([addTotalDuration, { $sort: { day: 1 } }])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// add exercise
router.put("/api/workouts/:id", (req, res) => {
  db.Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: req.body } },
    { new: true, runValidators: true }
  )
    .then((dbWorkout) => {
      if (!dbWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//create workout
router.post("/api/workouts", (req, res) => {
  db.Workout.create({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// get the last 7 workouts, oldest first
router.get("/api/workouts/range", (req, res) => {
  db.Workout.aggregate([
    addTotalDuration,
    { $sort: { day: -1 } },
    { $limit: 7 },
    { $sort: { day: 1 } },
  ])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
