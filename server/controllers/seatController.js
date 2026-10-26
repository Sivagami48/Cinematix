const Show = require("../models/Show");
const SeatLock = require("../models/SeatLock");

const HOLD_MINUTES = 5;

const notify = (req, showId) => {
  req.app.get("io").to(`show:${showId}`).emit("seats-changed", { showId });
};

exports.lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "Select seats" });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    if (seats.some((s) => show.bookedSeats.includes(s))) {
      return res.status(409).json({ message: "Seat already booked" });
    }

    const now = new Date();

    await SeatLock.deleteMany({ show: showId, expiresAt: { $lte: now } });
    await SeatLock.deleteMany({ show: showId, user: req.user._id });

    const expiresAt = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000);

    try {
      await SeatLock.insertMany(
        seats.map((seat) => ({
          show: showId,
          seat,
          user: req.user._id,
          expiresAt,
        })),
        { ordered: false }
      );
    } catch (e) {
      if (e.code === 11000 || e.writeErrors) {
        await SeatLock.deleteMany({ show: showId, user: req.user._id });
        notify(req, showId);
        return res
          .status(409)
          .json({ message: "Some seats are held by someone else" });
      }
      throw e;
    }

    notify(req, showId);
    res.json({ expiresAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.releaseSeats = async (req, res) => {
  try {
    await SeatLock.deleteMany({
      show: req.body.showId,
      user: req.user._id,
    });
    notify(req, req.body.showId);
    res.json({ message: "Released" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLockedSeats = async (req, res) => {
  try {
    const locks = await SeatLock.find({
      show: req.params.showId,
      expiresAt: { $gt: new Date() },
    }).select("seat user -_id");
    res.json(locks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};