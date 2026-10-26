
const express = require("express");
const {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  toggleRemind,
  getMyReminders,
} = require("../controllers/movieController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getMovies);
router.get("/reminders/my", protect, getMyReminders); // /:id ku munnaadi irukkanum
router.get("/:id", getMovieById);
router.post("/", protect, adminOnly, addMovie);
router.post("/:id/remind", protect, toggleRemind);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

module.exports = router;