const Show = require("../models/Show");
const Booking = require("../models/Booking");
const SeatLock = require("../models/SeatLock");
const FoodItem = require("../models/FoodItem");
const { notifyUser } = require("../utils/notify");

const CANCEL_BEFORE_HOURS = 2;

// "2026-10-25" + "11:45 AM" => Date (IST)
const showStart = (date, time) => {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((time || "").trim());
  if (!m || !date) return null;

  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;

  const d = new Date(`${date}T${String(h).padStart(2, "0")}:${m[2]}:00+05:30`);
  return isNaN(d.getTime()) ? null : d;
};

exports.createBooking = async (req, res) => {
  try {
    const { showId, seats, foods } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "Select seats" });
    }

    // indha user ku ella seats ku valid lock irukka?
    const myLocks = await SeatLock.countDocuments({
      show: showId,
      seat: { $in: seats },
      user: req.user._id,
      expiresAt: { $gt: new Date() },
    });

    if (myLocks !== seats.length) {
      return res
        .status(409)
        .json({ message: "Seat hold expired, select again" });
    }

    // food total ah DB price vechi calculate pannu
    const foodOrders = [];
    let foodTotal = 0;

    if (foods && foods.length > 0) {
      const items = await FoodItem.find({
        _id: { $in: foods.map((f) => f.foodId) },
        available: true,
      });

      for (const f of foods) {
        const item = items.find((i) => i._id.toString() === f.foodId);
        const qty = Number(f.qty);

        if (!item || !Number.isInteger(qty) || qty < 1 || qty > 10) {
          return res.status(400).json({ message: "Invalid food item" });
        }

        foodOrders.push({ name: item.name, price: item.price, qty });
        foodTotal += item.price * qty;
      }
    }

    // check + add oru query la (atomic)
    const show = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats } },
      { $push: { bookedSeats: { $each: seats } } },
      { returnDocument: "after" }
    );

    if (!show) {
      return res.status(409).json({ message: "Seat already booked" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      foodOrders,
      foodTotal,
      foodStatus: foodOrders.length > 0 ? "preparing" : "none",
      total: seats.length * show.price + foodTotal,
    });

    await SeatLock.deleteMany({
      show: showId,
      seat: { $in: seats },
      user: req.user._id,
    });

    // real-time update: andha show paakkura ellarukum anuppu
    const io = req.app.get("io");
    if (io) io.to(`show:${showId}`).emit("seats-changed", { showId });

    // notification: bell + toast
    await notifyUser(req, req.user._id, {
      type: "booking_confirmed",
      title: "Booking confirmed 🎟️",
      message: `Seats ${seats.join(", ")} • ${show.date} ${show.time} • ₹${booking.total}`,
      link: `/ticket/${booking._id}`,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theatre" }],
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theatre" }],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("show");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const start = showStart(booking.show?.date, booking.show?.time);
    if (!start) {
      return res.status(400).json({ message: "Cannot verify show time" });
    }

    const cutoff = new Date(
      start.getTime() - CANCEL_BEFORE_HOURS * 60 * 60 * 1000
    );
    if (new Date() > cutoff) {
      return res.status(400).json({
        message: `Cancellation closed. Allowed up to ${CANCEL_BEFORE_HOURS} hours before the show.`,
      });
    }

    // atomic: confirmed => cancelled (oru thadava mattum success)
    const update = { status: "cancelled" };
    if (booking.foodOrders.length > 0) update.foodStatus = "cancelled";

    const claimed = await Booking.findOneAndUpdate(
      { _id: booking._id, status: "confirmed" },
      update,
      { returnDocument: "after" }
    );

    if (!claimed) {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // seats ah release pannu
    await Show.updateOne(
      { _id: booking.show._id },
      { $pullAll: { bookedSeats: booking.seats } }
    );

    const io = req.app.get("io");
    if (io) {
      const showId = booking.show._id.toString();
      io.to(`show:${showId}`).emit("seats-changed", { showId });
    }

    await notifyUser(req, req.user._id, {
      type: "booking_cancelled",
      title: "Booking cancelled",
      message: `Seats ${booking.seats.join(", ")} • ${booking.show.date} ${booking.show.time} released`,
      link: "/my-bookings",
    });

    res.json(claimed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Memory Capsule ----------
const FALLBACK_DURATION_MIN = 150;
const MEMORY_MOODS = ["loved", "fun", "thrilled", "emotional", "meh"];

// show mudinjadha? (start + movie duration)
// showStart() cancel feature la already irukku, adhaiye use panrom
const showEnded = (show, movie) => {
  const start = showStart(show?.date, show?.time);
  if (!start) return false;
  const mins = movie?.duration || FALLBACK_DURATION_MIN;
  return Date.now() > start.getTime() + mins * 60 * 1000;
};

exports.saveMemory = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "show",
      populate: { path: "movie", select: "duration" },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Cancelled bookings cannot have memories" });
    }

    if (!showEnded(booking.show, booking.show?.movie)) {
      return res
        .status(400)
        .json({ message: "You can add a memory after the show ends" });
    }

    const rating = Number(req.body.rating);
    const mood = req.body.mood;
    const note = String(req.body.note || "").trim().slice(0, 300);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1 to 5" });
    }
    if (!MEMORY_MOODS.includes(mood)) {
      return res.status(400).json({ message: "Invalid mood" });
    }

    const memory = { rating, mood, note, updatedAt: new Date() };
    await Booking.updateOne({ _id: booking._id }, { $set: { memory } });

    res.json(memory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDiary = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: "confirmed",
    }).populate({
      path: "show",
      populate: [{ path: "movie", select: "-remindedBy" }, { path: "theatre" }],
    });

    const watched = bookings
      .filter((b) => showEnded(b.show, b.show?.movie))
      .sort(
        (a, b) =>
          showStart(b.show.date, b.show.time) -
          showStart(a.show.date, a.show.time)
      );

    res.json(watched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};