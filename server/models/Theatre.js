const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    rows: { type: Number, default: 7 },
    seatsPerRow: { type: Number, default: 16 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theatre", theatreSchema);