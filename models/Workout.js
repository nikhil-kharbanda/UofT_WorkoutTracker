const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  day: {
    type: Date,
    default: () => new Date(),
  },
  exercises: [
    {
      type: {
        type: String,
        trim: true,
        required: true,
      },
      name: {
        type: String,
        trim: true,
        required: true,
      },
      duration: {
        type: Number,
        trim: true,
        required: true,
        default: 0,
      },

      weight: {
        type: Number,
        trim: true,
        default: 0,
      },

      sets: {
        type: Number,
        trim: true,
        default: 0,
      },

      reps: {
        type: Number,
        trim: true,
        default: 0,
      },

      distance: {
        type: Number,
        trim: true,
        default: 0,
      },
    },
  ],
  totalDuration: {
    type: Number,
    default: 0,
  },
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
