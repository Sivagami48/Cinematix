import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const emptyMovie = {
  title: "",
  poster: "",
  backdrop: "",
  trailerUrl: "",
  language: "",
  duration: "",
  rating: "",
  releaseYear: "",
  ageRating: "UA",
  format: "2D",
  status: "now_showing",
  releaseDate: "",
  genre: "",
  description: "",
};

const emptyFood = { name: "", price: "", category: "snacks" };
const emptyTheatre = { name: "", city: "", rows: 7, seatsPerRow: 16 };
const emptyShow = { movie: "", theatre: "", date: "", time: "", price: "" };

const movieFields = [
  "title",
  "poster",
  "backdrop",
  "trailerUrl",
  "language",
  "duration",
  "rating",
  "releaseYear",
  "ageRating",
  "format",
  "status",
  "releaseDate",
  "genre",
  "description",
];

export default function Admin() {
  const [tab, setTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [food, setFood] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [loading, setLoading] = useState(false);

  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [foodForm, setFoodForm] = useState(emptyFood);
  const [theatreForm, setTheatreForm] = useState(emptyTheatre);
  const [showForm, setShowForm] = useState(emptyShow);

  const loadAll = async () => {
    const [m, f, t, s] = await Promise.all([
      API.get("/movies"),
      API.get("/food"),
      API.get("/shows/theatres"),
      API.get("/shows"),
    ]);

    setMovies(m.data);
    setFood(f.data);
    setTheatres(t.data);
    setShows(s.data);
  };

  useEffect(() => {
    loadAll().catch(() => {
      setMsgType("error");
      setMsg("Unable to load admin data. Please check your server.");
    });
  }, []);

  const save = async (url, body, reset) => {
    try {
      setLoading(true);
      setMsg("");

      await API.post(url, body);

      setMsgType("success");
      setMsg("Saved successfully!");
      reset();

      await loadAll();
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (url) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      setLoading(true);
      setMsg("");

      await API.delete(url);

      setMsgType("success");
      setMsg("Deleted successfully!");

      await loadAll();
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Failed to delete. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Coming Soon => Now Showing (reminder set pannavangalukku notification pogum)
  const release = async (movieId) => {
    const confirmed = window.confirm(
      "Move this movie to Now Showing? Users who set a reminder will be notified."
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setMsg("");

      await API.put(`/movies/${movieId}`, { status: "now_showing" });

      setMsgType("success");
      setMsg("Movie is now showing. Reminder users notified!");

      await loadAll();
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Failed to update movie.");
    } finally {
      setLoading(false);
    }
  };

  const movieTitle = (id) =>
    movies.find((m) => m._id === (id?._id || id))?.title || "Movie";

  const set = (setter) => (e) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const formatLabel = (field) => {
    const labels = {
      trailerUrl: "Trailer URL",
      releaseYear: "Release Year",
      releaseDate: "Release Date (for Coming Soon)",
      ageRating: "Age Rating",
      status: "Status",
      genre: "Genres",
      seatsPerRow: "Seats Per Row",
      rows: "Number of Rows",
      backdrop: "Backdrop Image URL",
      poster: "Poster Image URL",
    };

    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <>
      <style>{`
        .admin-page,
        .admin-page * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          padding: 38px 5%;
          color: #e5edf9;
          background:
            radial-gradient(ellipse at top left, rgba(37, 99, 235, 0.13), transparent 38%),
            radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.07), transparent 32%),
            #050914;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .admin-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .admin-eyebrow::before {
          content: "";
          width: 22px;
          height: 2px;
          background: #3b82f6;
          border-radius: 10px;
        }

        .admin-title {
          margin: 0;
          color: #f8fafc;
          font-size: clamp(27px, 4vw, 36px);
          font-weight: 850;
          letter-spacing: -1.2px;
        }

        .admin-title span {
          color: #60a5fa;
        }

        .admin-subtitle {
          margin: 10px 0 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.7;
        }

        .admin-status {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 15px;
          border: 1px solid #1e3352;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.8);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }

        .admin-stat {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border: 1px solid #1b2b45;
          border-radius: 16px;
          background: linear-gradient(145deg, #101a2d, #0a1120);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .admin-stat:hover {
          transform: translateY(-3px);
          border-color: #315c9b;
        }

        .admin-stat-label {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-stat-value {
          margin-top: 13px;
          color: #f8fafc;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -1px;
          overflow-wrap: anywhere;
        }

        .admin-stat-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 37px;
          height: 37px;
          margin-bottom: 17px;
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 11px;
          background: rgba(37, 99, 235, 0.14);
          font-size: 18px;
        }

        .admin-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 25px;
          padding: 7px;
          border: 1px solid #1b2b45;
          border-radius: 14px;
          background: #0a1120;
        }

        .admin-tab {
          flex: 1;
          min-width: 110px;
          padding: 13px 18px;
          border: 1px solid transparent;
          border-radius: 9px;
          background: transparent;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-tab:hover {
          color: #e2e8f0;
          background: #111d32;
        }

        .admin-tab.active {
          border-color: rgba(96, 165, 250, 0.35);
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
        }

        .admin-message {
          margin: 0 0 22px;
          padding: 13px 16px;
          border: 1px solid #1e4977;
          border-radius: 11px;
          background: rgba(37, 99, 235, 0.1);
          color: #93c5fd;
          font-size: 13px;
          line-height: 1.6;
        }

        .admin-message.error {
          border-color: #7f1d1d;
          background: rgba(220, 38, 38, 0.1);
          color: #fca5a5;
        }

        .admin-section {
          margin-bottom: 24px;
          padding: 25px;
          border: 1px solid #1b2b45;
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.97), rgba(8, 15, 29, 0.97));
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.13);
        }

        .admin-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }

        .admin-section-title {
          margin: 0;
          color: #f1f5f9;
          font-size: 18px;
          font-weight: 750;
          letter-spacing: -0.3px;
        }

        .admin-section-description {
          margin: 7px 0 0;
          color: #8191a9;
          font-size: 12px;
          line-height: 1.6;
        }

        .admin-count {
          padding: 6px 11px;
          border: 1px solid #244879;
          border-radius: 8px;
          background: rgba(37, 99, 235, 0.12);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 750;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px;
        }

        .admin-field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 8px;
        }

        .admin-field.full {
          grid-column: 1 / -1;
        }

        .admin-field label {
          color: #b9c7db;
          font-size: 12px;
          font-weight: 650;
        }

        .admin-input,
        .admin-select,
        .admin-textarea {
          width: 100%;
          min-width: 0;
          padding: 12px 14px;
          border: 1px solid #263751;
          border-radius: 10px;
          outline: none;
          background: #080f1d;
          color: #e2e8f0;
          font-family: inherit;
          font-size: 13px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .admin-input::placeholder,
        .admin-textarea::placeholder {
          color: #5f6f86;
        }

        .admin-input:focus,
        .admin-select:focus,
        .admin-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        .admin-select {
          cursor: pointer;
        }

        .admin-textarea {
          min-height: 105px;
          resize: vertical;
          line-height: 1.6;
        }

        .admin-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 43px;
          padding: 12px 19px;
          border: 1px solid #3b82f6;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(37, 99, 235, 0.16);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .admin-primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.28);
        }

        .admin-primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-list {
          display: flex;
          flex-direction: column;
        }

        .admin-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #1b2b45;
        }

        .admin-list-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .admin-item-info {
          min-width: 0;
        }

        .admin-item-title {
          color: #e5edf9;
          font-size: 13px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .admin-item-meta {
          margin-top: 6px;
          color: #8493a9;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .admin-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 3px 8px;
          border: 1px solid rgba(250, 204, 21, 0.35);
          border-radius: 6px;
          background: rgba(250, 204, 21, 0.1);
          color: #fde68a;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 0.4px;
          vertical-align: middle;
        }

        .admin-item-actions {
          display: flex;
          flex-shrink: 0;
          gap: 8px;
        }

        .admin-release-btn {
          min-height: 34px;
          padding: 7px 12px;
        }

        .admin-delete-btn {
          flex-shrink: 0;
          padding: 8px 12px;
          border: 1px solid rgba(248, 113, 113, 0.25);
          border-radius: 8px;
          background: rgba(220, 38, 38, 0.1);
          color: #fca5a5;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .admin-delete-btn:hover:not(:disabled) {
          border-color: #ef4444;
          background: rgba(220, 38, 38, 0.22);
        }

        .admin-delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-empty {
          padding: 27px 15px;
          border: 1px dashed #293a54;
          border-radius: 11px;
          color: #8191a9;
          font-size: 13px;
          text-align: center;
          line-height: 1.7;
        }

        .admin-show-card {
          padding: 15px;
          border: 1px solid #1b2b45;
          border-radius: 11px;
          background: #0a1323;
        }

        .admin-show-card + .admin-show-card {
          margin-top: 11px;
        }

        .admin-show-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .admin-show-price {
          color: #7dd3fc;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .admin-show-details {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .admin-show-tag {
          padding: 6px 9px;
          border: 1px solid #223754;
          border-radius: 7px;
          background: #101d31;
          color: #a8bad1;
          font-size: 11px;
        }

        .admin-loading {
          color: #93c5fd;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 850px) {
          .admin-page {
            padding: 28px 4%;
          }

          .admin-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .admin-page {
            padding: 23px 15px;
          }

          .admin-header {
            align-items: flex-start;
          }

          .admin-stats {
            gap: 10px;
          }

          .admin-stat {
            padding: 16px;
          }

          .admin-stat-value {
            font-size: 25px;
          }

          .admin-section {
            padding: 18px 15px;
            border-radius: 14px;
          }

          .admin-form-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 15px;
          }

          .admin-field.full {
            grid-column: auto;
          }

          .admin-tab {
            min-width: 0;
            padding: 12px 8px;
            font-size: 11px;
          }

          .admin-list-item {
            align-items: flex-start;
          }

          .admin-item-actions {
            flex-direction: column;
          }

          .admin-delete-btn {
            padding: 7px 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-page *,
          .admin-page *::before,
          .admin-page *::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="admin-page">
        <div className="admin-container">
          <header className="admin-header">
            <div>
              <div className="admin-eyebrow">CINEMATIX MANAGEMENT</div>
              <h1 className="admin-title">
                Admin <span>Dashboard</span>
              </h1>
              <p className="admin-subtitle">
                Manage your movies, theatre menu and show schedules in one place.
              </p>
            </div>

            <div className="admin-status">
              <span className="admin-status-dot" />
              Management Panel
            </div>
          </header>

          <section className="admin-stats">
            <div className="admin-stat">
              <div className="admin-stat-icon">🎬</div>
              <div className="admin-stat-label">Total Movies</div>
              <div className="admin-stat-value">{movies.length}</div>
            </div>

            <div className="admin-stat">
              <div className="admin-stat-icon">🍿</div>
              <div className="admin-stat-label">Food Items</div>
              <div className="admin-stat-value">{food.length}</div>
            </div>

            <div className="admin-stat">
              <div className="admin-stat-icon">🏢</div>
              <div className="admin-stat-label">Theatres</div>
              <div className="admin-stat-value">{theatres.length}</div>
            </div>

            <div className="admin-stat">
              <div className="admin-stat-icon">🎟️</div>
              <div className="admin-stat-label">Total Shows</div>
              <div className="admin-stat-value">{shows.length}</div>
            </div>
          </section>

          <div className="admin-tabs">
            {["movies", "food", "shows"].map((t) => (
              <button
                key={t}
                type="button"
                className={`admin-tab ${tab === t ? "active" : ""}`}
                onClick={() => {
                  setTab(t);
                  setMsg("");
                }}
              >
                {t === "movies" && "🎬 "}
                {t === "food" && "🍿 "}
                {t === "shows" && "🎟️ "}
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {msg && (
            <div
              className={`admin-message ${msgType === "error" ? "error" : ""}`}
              role="status"
            >
              {msgType === "error" ? "⚠️ " : "✓ "}
              {msg}
            </div>
          )}

          {loading && (
            <p className="admin-loading">Processing your request...</p>
          )}

          {tab === "movies" && (
            <>
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Add New Movie</h2>
                    <p className="admin-section-description">
                      Enter the movie details to add it to your cinema catalogue.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    save(
                      "/movies",
                      {
                        ...movieForm,
                        duration: Number(movieForm.duration),
                        rating: Number(movieForm.rating),
                        releaseYear: Number(movieForm.releaseYear),
                        genre: movieForm.genre
                          .split(",")
                          .map((g) => g.trim())
                          .filter(Boolean),
                      },
                      () => setMovieForm(emptyMovie)
                    );
                  }}
                >
                  <div className="admin-form-grid">
                    {movieFields.map((f) => (
                      <div
                        className={`admin-field ${
                          f === "description" ? "full" : ""
                        }`}
                        key={f}
                      >
                        <label htmlFor={`movie-${f}`}>
                          {formatLabel(f)}
                        </label>

                        {f === "description" ? (
                          <textarea
                            id={`movie-${f}`}
                            className="admin-textarea"
                            name={f}
                            placeholder="Write a short movie description..."
                            value={movieForm[f]}
                            onChange={set(setMovieForm)}
                          />
                        ) : f === "ageRating" ? (
                          <select
                            id={`movie-${f}`}
                            className="admin-select"
                            name={f}
                            value={movieForm[f]}
                            onChange={set(setMovieForm)}
                          >
                            <option value="U">U</option>
                            <option value="UA">UA</option>
                            <option value="A">A</option>
                            <option value="S">S</option>
                          </select>
                        ) : f === "format" ? (
                          <select
                            id={`movie-${f}`}
                            className="admin-select"
                            name={f}
                            value={movieForm[f]}
                            onChange={set(setMovieForm)}
                          >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                          </select>
                        ) : f === "status" ? (
                          <select
                            id={`movie-${f}`}
                            className="admin-select"
                            name={f}
                            value={movieForm[f]}
                            onChange={set(setMovieForm)}
                          >
                            <option value="now_showing">Now Showing</option>
                            <option value="coming_soon">Coming Soon</option>
                          </select>
                        ) : f === "releaseDate" ? (
                          <input
                            id={`movie-${f}`}
                            className="admin-input"
                            type="date"
                            name={f}
                            value={movieForm[f]}
                            onChange={set(setMovieForm)}
                          />
                        ) : (
                          <input
                            id={`movie-${f}`}
                            className="admin-input"
                            name={f}
                            type={
                              ["duration", "rating", "releaseYear"].includes(f)
                                ? "number"
                                : "text"
                            }
                            min={
                              ["duration", "releaseYear"].includes(f)
                                ? 1
                                : undefined
                            }
                            max={f === "rating" ? 10 : undefined}
                            step={f === "rating" ? "0.1" : "1"}
                            required={f === "title"}
                            placeholder={
                              f === "genre"
                                ? "Action, Thriller, Drama"
                                : f === "poster"
                                  ? "Poster URL or /posters/name.jpg (optional)"
                                  : f === "backdrop"
                                    ? "Backdrop image URL (optional)"
                                    : f === "trailerUrl"
                                      ? "Trailer video URL"
                                      : `Enter ${formatLabel(f).toLowerCase()}`
                            }
                            value={movieForm[f]}
                            onChange={set(setMovieForm)}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="admin-primary-btn"
                    disabled={loading}
                    style={{ marginTop: 22 }}
                  >
                    + Add Movie
                  </button>
                </form>
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Movie Catalogue</h2>
                    <p className="admin-section-description">
                      View the movies currently available in your database.
                    </p>
                  </div>
                  <span className="admin-count">{movies.length} Movies</span>
                </div>

                {movies.length === 0 ? (
                  <div className="admin-empty">
                    No movies added yet. Add your first movie above.
                  </div>
                ) : (
                  <div className="admin-list">
                    {movies.map((m) => (
                      <div className="admin-list-item" key={m._id}>
                        <div className="admin-item-info">
                          <div className="admin-item-title">
                            {m.title}
                            {m.status === "coming_soon" && (
                              <span className="admin-badge">COMING SOON</span>
                            )}
                          </div>
                          <div className="admin-item-meta">
                            {[m.language, m.releaseYear, m.format]
                              .filter(Boolean)
                              .join(" • ") || "Movie details"}
                            {m.status === "coming_soon" && m.releaseDate
                              ? ` • Releases ${m.releaseDate}`
                              : ""}
                          </div>
                        </div>

                        <div className="admin-item-actions">
                          {m.status === "coming_soon" && (
                            <button
                              type="button"
                              className="admin-primary-btn admin-release-btn"
                              disabled={loading}
                              onClick={() => release(m._id)}
                            >
                              🎬 Release
                            </button>
                          )}

                          <button
                            type="button"
                            className="admin-delete-btn"
                            disabled={loading}
                            onClick={() => remove(`/movies/${m._id}`)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {tab === "food" && (
            <>
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Add Food Item</h2>
                    <p className="admin-section-description">
                      Add snacks, beverages and combo offers to your menu.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    save(
                      "/food",
                      { ...foodForm, price: Number(foodForm.price) },
                      () => setFoodForm(emptyFood)
                    );
                  }}
                >
                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label htmlFor="food-name">Food Name</label>
                      <input
                        id="food-name"
                        className="admin-input"
                        name="name"
                        placeholder="e.g. Popcorn Combo"
                        value={foodForm.name}
                        onChange={set(setFoodForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="food-price">Price (₹)</label>
                      <input
                        id="food-price"
                        className="admin-input"
                        type="number"
                        min="0"
                        name="price"
                        placeholder="Enter price"
                        value={foodForm.price}
                        onChange={set(setFoodForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="food-category">Category</label>
                      <select
                        id="food-category"
                        className="admin-select"
                        name="category"
                        value={foodForm.category}
                        onChange={set(setFoodForm)}
                      >
                        <option value="snacks">Snacks</option>
                        <option value="drinks">Drinks</option>
                        <option value="combos">Combos</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="admin-primary-btn"
                    disabled={loading}
                    style={{ marginTop: 22 }}
                  >
                    + Add Food Item
                  </button>
                </form>
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Cinema Menu</h2>
                    <p className="admin-section-description">
                      Manage the snacks and drinks offered to customers.
                    </p>
                  </div>
                  <span className="admin-count">{food.length} Items</span>
                </div>

                {food.length === 0 ? (
                  <div className="admin-empty">
                    No food items added yet. Add your first menu item above.
                  </div>
                ) : (
                  <div className="admin-list">
                    {food.map((f) => (
                      <div className="admin-list-item" key={f._id}>
                        <div className="admin-item-info">
                          <div className="admin-item-title">{f.name}</div>
                          <div className="admin-item-meta">
                            {f.category} • ₹{f.price}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="admin-delete-btn"
                          disabled={loading}
                          onClick={() => remove(`/food/${f._id}`)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {tab === "shows" && (
            <>
              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Add Theatre</h2>
                    <p className="admin-section-description">
                      Register a theatre and configure its seating capacity.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    save(
                      "/shows/theatres",
                      {
                        ...theatreForm,
                        rows: Number(theatreForm.rows),
                        seatsPerRow: Number(theatreForm.seatsPerRow),
                      },
                      () => setTheatreForm(emptyTheatre)
                    );
                  }}
                >
                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label htmlFor="theatre-name">Theatre Name</label>
                      <input
                        id="theatre-name"
                        className="admin-input"
                        name="name"
                        placeholder="e.g. Cinematix IMAX"
                        value={theatreForm.name}
                        onChange={set(setTheatreForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="theatre-city">City</label>
                      <input
                        id="theatre-city"
                        className="admin-input"
                        name="city"
                        placeholder="e.g. Coimbatore"
                        value={theatreForm.city}
                        onChange={set(setTheatreForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="theatre-rows">Number of Rows</label>
                      <input
                        id="theatre-rows"
                        className="admin-input"
                        type="number"
                        min="1"
                        name="rows"
                        value={theatreForm.rows}
                        onChange={set(setTheatreForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="theatre-seats">Seats Per Row</label>
                      <input
                        id="theatre-seats"
                        className="admin-input"
                        type="number"
                        min="1"
                        name="seatsPerRow"
                        value={theatreForm.seatsPerRow}
                        onChange={set(setTheatreForm)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="admin-primary-btn"
                    disabled={loading}
                    style={{ marginTop: 22 }}
                  >
                    + Add Theatre
                  </button>
                </form>
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Schedule a Show</h2>
                    <p className="admin-section-description">
                      Select a movie, theatre, date and showtime.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    save(
                      "/shows",
                      { ...showForm, price: Number(showForm.price) },
                      () => setShowForm(emptyShow)
                    );
                  }}
                >
                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label htmlFor="show-movie">Movie</label>
                      <select
                        id="show-movie"
                        className="admin-select"
                        name="movie"
                        value={showForm.movie}
                        onChange={set(setShowForm)}
                        required
                      >
                        <option value="">Select a movie</option>
                        {movies
                          .filter((m) => m.status !== "coming_soon")
                          .map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="admin-field">
                      <label htmlFor="show-theatre">Theatre</label>
                      <select
                        id="show-theatre"
                        className="admin-select"
                        name="theatre"
                        value={showForm.theatre}
                        onChange={set(setShowForm)}
                        required
                      >
                        <option value="">Select a theatre</option>
                        {theatres.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} {t.city ? `— ${t.city}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-field">
                      <label htmlFor="show-date">Show Date</label>
                      <input
                        id="show-date"
                        className="admin-input"
                        type="date"
                        name="date"
                        min={new Date().toLocaleDateString("en-CA")}
                        value={showForm.date}
                        onChange={set(setShowForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="show-time">Show Time</label>
                      <input
                        id="show-time"
                        className="admin-input"
                        name="time"
                        placeholder="e.g. 11:45 AM"
                        value={showForm.time}
                        onChange={set(setShowForm)}
                        required
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor="show-price">Ticket Price (₹)</label>
                      <input
                        id="show-price"
                        className="admin-input"
                        type="number"
                        min="1"
                        name="price"
                        placeholder="e.g. 250"
                        value={showForm.price}
                        onChange={set(setShowForm)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="admin-primary-btn"
                    disabled={loading}
                    style={{ marginTop: 22 }}
                  >
                    + Schedule Show
                  </button>
                </form>
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <div>
                    <h2 className="admin-section-title">Scheduled Shows</h2>
                    <p className="admin-section-description">
                      Review the movie schedules currently in your system.
                    </p>
                  </div>
                  <span className="admin-count">{shows.length} Shows</span>
                </div>

                {shows.length === 0 ? (
                  <div className="admin-empty">
                    No shows scheduled yet. Add a theatre and schedule a show above.
                  </div>
                ) : (
                  shows.map((s) => (
                    <div className="admin-show-card" key={s._id}>
                      <div className="admin-show-top">
                        <div className="admin-item-info">
                          <div className="admin-item-title">
                            {movieTitle(s.movie)}
                          </div>
                          <div className="admin-item-meta">
                            {typeof s.theatre === "object"
                              ? s.theatre?.name || "Theatre"
                              : theatres.find((t) => t._id === s.theatre)?.name ||
                                "Theatre"}
                            {typeof s.theatre === "object" && s.theatre?.city
                              ? ` • ${s.theatre.city}`
                              : ""}
                          </div>
                        </div>

                        <div className="admin-show-price">₹{s.price}</div>
                      </div>

                      <div className="admin-show-details">
                        <span className="admin-show-tag">📅 {s.date}</span>
                        <span className="admin-show-tag">🕒 {s.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}