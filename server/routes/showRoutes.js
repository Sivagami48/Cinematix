const express = require("express");
const {
  addTheatre,
  getTheatres,
  addShow,
  getShows,
  getShowById,
} = require("../controllers/showController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/theatres", getTheatres);
router.post("/theatres", protect, adminOnly, addTheatre);

router.get("/", getShows);
router.get("/:id", getShowById);
router.post("/", protect, adminOnly, addShow);

module.exports = router;