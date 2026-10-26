const express = require("express");
const {
  lockSeats,
  releaseSeats,
  getLockedSeats,
} = require("../controllers/seatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/lock", protect, lockSeats);
router.post("/release", protect, releaseSeats);
router.get("/:showId", getLockedSeats);

module.exports = router;