const FoodItem = require("../models/FoodItem");

exports.getFood = async (req, res) => {
  try {
    res.json(await FoodItem.find({ available: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFood = async (req, res) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};