const mongoose = require("mongoose");

const seatLockSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
  seat: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
});

// same show la same seat ku oru lock mattum
seatLockSchema.index({ show: 1, seat: 1 }, { unique: true });

// expiresAt time vandha MongoDB auto delete pannum
seatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("SeatLock", seatLockSchema);