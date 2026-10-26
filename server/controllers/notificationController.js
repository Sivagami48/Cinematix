const Notification = require("../models/Notification");

exports.getMine = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    const unread = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });
    res.json({ items, unread });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.readAll = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: "All read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.readOne = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }
    );
    res.json({ message: "Read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};