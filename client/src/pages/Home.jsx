import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [search, setSearch] = useState("");
  const [waking, setWaking] = useState(false);

  // Now Showing: array vara varaikkum 5 sec ku oru thadava retry pannum
  useEffect(() => {
    let cancelled = false;
    let timer;
    let attempts = 0;

    const retry = () => {
      attempts += 1;
      if (attempts < 12) {
        setWaking(true);
        timer = setTimeout(load, 5000);
      } else {
        setWaking(false);
      }
    };

    const load = () => {
      API.get("/movies", { params: { search, status: "now_showing" } })
        .then((res) => {
          if (cancelled) return;
          if (Array.isArray(res.data)) {
            setMovies(res.data);
            setWaking(false);
          } else {
            retry();
          }
        })
        .catch(() => {
          if (!cancelled) retry();
        });
    };

    load();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    API.get("/movies", { params: { status: "coming_soon" } })
      .then((res) => setUpcoming(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) {
      setReminders([]);
      return;
    }
    API.get("/movies/reminders/my")
      .then((res) => setReminders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, [user]);

  const toggleRemind = async (movieId) => {
    if (!user) return navigate("/login");
    try {
      const { data } = await API.post(`/movies/${movieId}/remind`);
      setReminders((prev) =>
        data.reminded ? [...prev, movieId] : prev.filter((id) => id !== movieId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const featured = movies[0];

  return (
    <>
      <style>{`
        /* ---------- Movie card ---------- */
        .mc-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          border: 1px solid #1b2b45;
          border-radius: 14px;
          background: var(--card);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .mc-card:hover {
          transform: translateY(-4px);
          border-color: #315c9b;
        }

        .mc-poster-wrap {
          position: relative;
          aspect-ratio: 2 / 3;
          background: #0b1730;
        }

        .mc-poster {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mc-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 12px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          background: linear-gradient(135deg, #1e90ff, #0b1730);
        }

        .mc-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(5, 9, 20, 0.8);
          border: 1px solid rgba(96, 165, 250, 0.4);
          font-size: 12px;
          font-weight: 600;
        }

        .mc-body {
          padding: 14px;
        }

        .mc-title {
          margin: 0 0 6px;
          font-size: 17px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mc-meta {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
        }

        .mc-remind {
          padding: 0 14px 14px;
          margin-top: auto;
        }

        .mc-btn {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
        }

        .mc-btn.done {
          background: #2a3347;
        }

        /* Coming soon card: height kammi */
        .mc-soon .mc-poster-wrap {
          aspect-ratio: auto;
          height: 240px;
        }

        /* ---------- Grids ---------- */
        .grid-now {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 24px;
        }

        .grid-soon {
          display: grid;
          grid-template-columns: repeat(auto-fill, 230px);
          gap: 24px;
        }

        /* ---------- Page ---------- */
        .home-hero {
          margin: 24px;
          padding: 48px 32px;
          border-radius: 16px;
          background: linear-gradient(120deg, #0f2a55, #1e90ff 140%);
        }

        .home-wrap {
          padding: 0 24px 24px;
        }

        .home-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .home-search {
          width: 280px;
          max-width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
        }

        .home-section-title {
          margin: 48px 0 20px;
        }

        .home-waking {
          margin: 0 0 20px;
          padding: 14px 16px;
          border: 1px solid #1e4977;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.1);
          color: #93c5fd;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 560px) {
          .grid-now {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .grid-soon {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .home-hero {
            margin: 16px;
            padding: 32px 20px;
          }
        }
      `}</style>

      <Navbar />

      {featured && !search && (
        <div className="home-hero">
          <small style={{ letterSpacing: 2, opacity: 0.8 }}>NOW SHOWING</small>
          <h1 style={{ margin: "8px 0", fontSize: 40 }}>{featured.title}</h1>
          <p style={{ maxWidth: 520, opacity: 0.9 }}>
            {featured.description?.length > 140
              ? featured.description.slice(0, 140) + "..."
              : featured.description}
          </p>
          <p style={{ opacity: 0.9 }}>
            {featured.language} • {featured.duration} min • ⭐ {featured.rating}
          </p>
          <Link to={`/movie/${featured._id}`}>
            <button
              style={{ background: "white", color: "#0b1730", fontWeight: "bold" }}
            >
              Book Now
            </button>
          </Link>
        </div>
      )}

      <div className="home-wrap">
        <div className="home-head">
          <h2 style={{ margin: 0 }}>Now Showing</h2>
          <input
            className="home-search"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {waking && (
          <div className="home-waking">
            ⏳ Server is waking up (free hosting). This can take up to a
            minute, movies will appear automatically.
          </div>
        )}

        {!waking && movies.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No movies found</p>
        )}

        <div className="grid-now">
          {movies.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>

        {upcoming.length > 0 && !search && (
          <>
            <h2 className="home-section-title">Coming Soon</h2>
            <div className="grid-soon">
              {upcoming.map((m) => (
                <MovieCard
                  key={m._id}
                  movie={m}
                  comingSoon
                  reminded={reminders.includes(m._id)}
                  onRemind={toggleRemind}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}