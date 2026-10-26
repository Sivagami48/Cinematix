const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seats: { type: [String], required: true },
    foodOrders: [
      {
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    foodTotal: { type: Number, default: 0 },
    foodStatus: {
      type: String,
      enum: ["none", "preparing", "ready", "delivered", "cancelled"],
      default: "none",
    },
    total: { type: Number, required: true },
    status: { type: String, default: "confirmed" },
    memory: {
      rating: { type: Number, min: 1, max: 5 },
      note: { type: String, maxlength: 300 },
      mood: {
        type: String,
        enum: ["loved", "fun", "thrilled", "emotional", "meh"],
      },
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);