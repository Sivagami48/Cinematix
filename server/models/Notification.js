const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: String,
  link: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});

module.exports = mongoose.model("Notification", notificationSchema);