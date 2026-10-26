const express = require("express");
const {
  getMine,
  readAll,
  readOne,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMine);
router.patch("/read-all", protect, readAll);
router.patch("/:id/read", protect, readOne);

module.exports = router;