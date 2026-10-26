import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const MOODS = [
  { key: "loved", emoji: "😍", label: "Loved it" },
  { key: "fun", emoji: "😂", label: "Fun" },
  { key: "thrilled", emoji: "😱", label: "Thrilled" },
  { key: "emotional", emoji: "😭", label: "Emotional" },
  { key: "meh", emoji: "😐", label: "Meh" },
];

const moodOf = (key) => MOODS.find((m) => m.key === key);
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

export default function Diary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ rating: 0, mood: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    API.get("/bookings/diary")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your diary")
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const rated = items.filter((b) => b.memory?.rating);
    const avg = rated.length
      ? (rated.reduce((s, b) => s + b.memory.rating, 0) / rated.length).toFixed(1)
      : "-";

    const genreCount = {};
    items.forEach((b) =>
      (b.show?.movie?.genre || []).forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      })
    );
    const topGenre =
      Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const spent = items.reduce((s, b) => s + (b.total || 0), 0);

    return { count: items.length, avg, topGenre, spent };
  }, [items]);

  const openEditor = (b) => {
    setEditing(b);
    setFormError("");
    setForm({
      rating: b.memory?.rating || 0,
      mood: b.memory?.mood || "",
      note: b.memory?.note || "",
    });
  };

  const saveMemory = async () => {
    if (!form.rating) return setFormError("Please give a star rating");
    if (!form.mood) return setFormError("Pick how the movie made you feel");

    setSaving(true);
    setFormError("");

    try {
      const { data } = await API.put(`/bookings/${editing._id}/memory`, form);
      setItems((prev) =>
        prev.map((b) => (b._id === editing._id ? { ...b, memory: data } : b))
      );
      setEditing(null);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save memory");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .dy-page {
          min-height: calc(100vh - 76px);
          padding: 40px 20px 60px;
          background:
            radial-gradient(ellipse at top, rgba(37, 99, 235, 0.10), transparent 45%),
            #070b14;
          color: #f8fafc;
        }

        .dy-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .dy-heading {
          margin: 0 0 8px;
          font-size: 30px;
          font-weight: 800;
        }

        .dy-sub {
          margin: 0 0 28px;
          color: #94a3b8;
          font-size: 14px;
        }

        .dy-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 30px;
        }

        .dy-stat {
          padding: 18px;
          border: 1px solid #1b2b45;
          border-radius: 14px;
          background: linear-gradient(145deg, #101a2d, #0a1120);
        }

        .dy-stat-label {
          color: #94a3b8;
          font-size: 12px;
        }

        .dy-stat-value {
          margin-top: 8px;
          font-size: 24px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .dy-card {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          padding: 16px;
          border: 1px solid #24334a;
          border-radius: 16px;
          background: #101827;
        }

        .dy-poster {
          width: 90px;
          height: 130px;
          flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, #1e90ff, #0b1730);
          overflow: hidden;
        }

        .dy-poster img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dy-body {
          flex: 1;
          min-width: 0;
        }

        .dy-title {
          margin: 0 0 6px;
          font-size: 19px;
        }

        .dy-info {
          margin: 0 0 4px;
          color: #a9b8cc;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .dy-memory {
          margin-top: 10px;
          padding: 12px;
          border: 1px solid #243e65;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.08);
        }

        .dy-stars {
          color: #ffd36b;
          letter-spacing: 2px;
        }

        .dy-mood {
          margin-left: 10px;
          color: #cbd5e1;
          font-size: 13px;
        }

        .dy-note {
          margin: 8px 0 0;
          color: #cbd5e1;
          font-size: 13px;
          line-height: 1.6;
          font-style: italic;
          overflow-wrap: anywhere;
        }

        .dy-btn {
          margin-top: 10px;
          padding: 9px 14px;
          border: 1px solid #388dff;
          border-radius: 9px;
          background: linear-gradient(135deg, #1681ff, #1458c7);
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-btn.ghost {
          border-color: #304562;
          background: #17253a;
          color: #cbd5e1;
        }

        .dy-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dy-message {
          padding: 22px;
          border: 1px solid #24334a;
          border-radius: 12px;
          background: #101827;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .dy-message.error {
          border-color: rgba(248, 113, 113, 0.35);
          color: #fca5a5;
        }

        .dy-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.7);
        }

        .dy-modal {
          width: 100%;
          max-width: 440px;
          padding: 22px;
          border: 1px solid #24334a;
          border-radius: 16px;
          background: #0b1322;
        }

        .dy-modal h3 {
          margin: 0 0 4px;
        }

        .dy-label {
          display: block;
          margin: 16px 0 8px;
          color: #b9c7db;
          font-size: 12px;
          font-weight: 700;
        }

        .dy-star-row {
          display: flex;
          gap: 4px;
        }

        .dy-star {
          padding: 0 2px;
          border: none;
          background: none;
          color: #3b4a63;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
        }

        .dy-star.on {
          color: #ffd36b;
        }

        .dy-mood-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dy-chip {
          padding: 8px 12px;
          border: 1px solid #2b3b54;
          border-radius: 20px;
          background: #111d30;
          color: #cbd5e1;
          font-size: 13px;
          cursor: pointer;
        }

        .dy-chip.on {
          border-color: #4297ff;
          background: #14305a;
          color: white;
        }

        .dy-textarea {
          width: 100%;
          min-height: 90px;
          padding: 12px;
          border: 1px solid #263751;
          border-radius: 10px;
          outline: none;
          background: #080f1d;
          color: #e2e8f0;
          font-family: inherit;
          font-size: 13px;
          resize: vertical;
        }

        .dy-count {
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
          text-align: right;
        }

        .dy-error {
          margin: 12px 0 0;
          color: #fca5a5;
          font-size: 13px;
        }

        .dy-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }

        @media (max-width: 700px) {
          .dy-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 500px) {
          .dy-page {
            padding: 28px 14px 45px;
          }

          .dy-heading {
            font-size: 25px;
          }

          .dy-poster {
            width: 70px;
            height: 105px;
          }
        }
      `}</style>

      <Navbar />

      <main className="dy-page">
        <div className="dy-container">
          <h1 className="dy-heading">My Movie Diary 📔</h1>
          <p className="dy-sub">
            Every movie you have watched, and how it made you feel.
          </p>

          {loading && <div className="dy-message">Loading your diary...</div>}

          {!loading && error && (
            <div className="dy-message error">{error}</div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="dy-message">
              <h3 style={{ marginTop: 0 }}>Your diary is empty 🎞️</h3>
              <p>
                Movies appear here after the show ends. Book a show and come
                back after you watch it!
              </p>
              <Link to="/">
                <button className="dy-btn">Explore Movies</button>
              </Link>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <div className="dy-stats">
                <div className="dy-stat">
                  <div className="dy-stat-label">Movies watched</div>
                  <div className="dy-stat-value">{stats.count}</div>
                </div>
                <div className="dy-stat">
                  <div className="dy-stat-label">Average rating</div>
                  <div className="dy-stat-value">
                    {stats.avg}
                    {stats.avg !== "-" && " ★"}
                  </div>
                </div>
                <div className="dy-stat">
                  <div className="dy-stat-label">Favourite genre</div>
                  <div className="dy-stat-value">{stats.topGenre}</div>
                </div>
                <div className="dy-stat">
                  <div className="dy-stat-label">Total spent</div>
                  <div className="dy-stat-value">₹{stats.spent}</div>
                </div>
              </div>

              {items.map((b) => {
                const movie = b.show?.movie;
                const mood = moodOf(b.memory?.mood);

                return (
                  <article className="dy-card" key={b._id}>
                    <div className="dy-poster">
                      {movie?.poster && (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>

                    <div className="dy-body">
                      <h2 className="dy-title">{movie?.title || "Movie"}</h2>
                      <p className="dy-info">
                        📅 {b.show?.date} • 🕒 {b.show?.time}
                      </p>
                      <p className="dy-info">
                        🏢 {b.show?.theatre?.name} • 🎟️ {b.seats.join(", ")}
                      </p>

                      {b.memory?.rating ? (
                        <div className="dy-memory">
                          <span className="dy-stars">
                            {stars(b.memory.rating)}
                          </span>
                          {mood && (
                            <span className="dy-mood">
                              {mood.emoji} {mood.label}
                            </span>
                          )}
                          {b.memory.note && (
                            <p className="dy-note">“{b.memory.note}”</p>
                          )}
                        </div>
                      ) : null}

                      <button
                        className={b.memory?.rating ? "dy-btn ghost" : "dy-btn"}
                        onClick={() => openEditor(b)}
                      >
                        {b.memory?.rating ? "✏️ Edit memory" : "📝 Add memory"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </>
          )}
        </div>
      </main>

      {editing && (
        <div className="dy-overlay" onClick={() => !saving && setEditing(null)}>
          <div className="dy-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.show?.movie?.title}</h3>
            <small style={{ color: "#94a3b8" }}>
              How was the movie?
            </small>

            <span className="dy-label">Your rating</span>
            <div className="dy-star-row">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={`dy-star ${form.rating >= n ? "on" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  aria-label={`${n} star`}
                >
                  ★
                </button>
              ))}
            </div>

            <span className="dy-label">It made me feel</span>
            <div className="dy-mood-row">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.key}
                  className={`dy-chip ${form.mood === m.key ? "on" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, mood: m.key }))}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            <span className="dy-label">One line to remember (optional)</span>
            <textarea
              className="dy-textarea"
              maxLength={300}
              placeholder="Went with friends, interval la popcorn semma..."
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
            <div className="dy-count">{form.note.length}/300</div>

            {formError && <p className="dy-error">{formError}</p>}

            <div className="dy-actions">
              <button
                className="dy-btn ghost"
                disabled={saving}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="dy-btn" disabled={saving} onClick={saveMemory}>
                {saving ? "Saving..." : "Save memory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}