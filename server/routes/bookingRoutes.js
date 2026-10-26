const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  saveMemory,
  getDiary,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/diary", protect, getDiary); // /:id ku munnaadi irukkanum
router.patch("/:id/cancel", protect, cancelBooking);
router.put("/:id/memory", protect, saveMemory);
router.get("/:id", protect, getBookingById);

module.exports = router;