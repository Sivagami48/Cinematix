const Notification = require("../models/Notification");

// Notification DB la save pannu + user online na socket la anuppu
exports.notifyUser = async (req, userId, data) => {
  try {
    const n = await Notification.create({ user: userId, ...data });
    const io = req.app.get("io");
    if (io) io.to(`user:${userId}`).emit("notification", n);
    return n;
  } catch (err) {
    // notification fail aanaalum main flow break aaga koodadhu
    console.log("notify error:", err.message);
  }
};