const express = require("express");
const { getFood, addFood, deleteFood } = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getFood);
router.post("/", protect, adminOnly, addFood);
router.delete("/:id", protect, adminOnly, deleteFood);

module.exports = router;