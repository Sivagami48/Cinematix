const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    category: { type: String, default: "snacks" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", foodSchema);