const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
    date: { type: String, required: true }, // "2026-10-25"
    time: { type: String, required: true }, // "11:45 AM"
    price: { type: Number, required: true },
    bookedSeats: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);