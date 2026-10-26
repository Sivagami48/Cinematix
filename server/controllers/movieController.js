const Movie = require("../models/Movie");
const { notifyUser } = require("../utils/notify");

exports.getMovies = async (req, res) => {
  try {
    const { search, language, status } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (language) filter.language = language;

    if (status === "coming_soon") filter.status = "coming_soon";
    else if (status === "now_showing") filter.status = { $ne: "coming_soon" };

    const movies = await Movie.find(filter)
      .select("-remindedBy")
      .sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select("-remindedBy");
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const before = await Movie.findById(req.params.id).select(
      "status title remindedBy"
    );
    if (!before) return res.status(404).json({ message: "Movie not found" });

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    // Coming Soon => Now Showing aana, remind panna ellarukum notification
    if (before.status === "coming_soon" && movie.status === "now_showing") {
      await Promise.all(
        before.remindedBy.map((userId) =>
          notifyUser(req, userId, {
            type: "movie_released",
            title: `${movie.title} is now showing! 🎬`,
            message: "Book your seats before they fill up.",
            link: `/movie/${movie._id}`,
          })
        )
      );

      // reminders mudinjadhu, list clear pannu
      await Movie.updateOne({ _id: movie._id }, { $set: { remindedBy: [] } });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remind me toggle
exports.toggleRemind = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user._id;

    const exists = await Movie.exists({ _id: movieId });
    if (!exists) return res.status(404).json({ message: "Movie not found" });

    const already = await Movie.exists({ _id: movieId, remindedBy: userId });

    if (already) {
      await Movie.updateOne({ _id: movieId }, { $pull: { remindedBy: userId } });
    } else {
      await Movie.updateOne({ _id: movieId }, { $addToSet: { remindedBy: userId } });
    }

    res.json({ reminded: !already });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// indha user remind pannina movie ids
exports.getMyReminders = async (req, res) => {
  try {
    const movies = await Movie.find({ remindedBy: req.user._id }).select("_id");
    res.json(movies.map((m) => m._id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};