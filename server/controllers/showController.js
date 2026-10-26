const Theatre = require("../models/Theatre");
const Show = require("../models/Show");

exports.addTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json(theatre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTheatres = async (req, res) => {
  try {
    res.json(await Theatre.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getShows = async (req, res) => {
  try {
    const { movie, date } = req.query;
    const filter = {};
    if (movie) filter.movie = movie;
    if (date) filter.date = date;

    const shows = await Show.find(filter)
      .populate("theatre")
      .sort({ time: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate("theatre");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};