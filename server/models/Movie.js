const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    poster: String,
    backdrop: String,
    trailerUrl: String,
    duration: Number,
    language: String,
    genre: [String],
    rating: { type: Number, default: 0 },
    releaseYear: Number,
    ageRating: { type: String, default: "UA" },
    format: { type: String, default: "2D" },
    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "now_showing",
    },
    releaseDate: String, // "2026-12-25"
    remindedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);