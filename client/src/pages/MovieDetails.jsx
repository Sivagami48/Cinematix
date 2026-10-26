/*import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DateStrip from "../components/DateStrip";
import SeatGrid from "../components/SeatGrid";
import CountdownTimer from "../components/CountdownTimer";
import FoodMenu from "../components/FoodMenu";

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [locks, setLocks] = useState([]);
  const [holdUntil, setHoldUntil] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState("");

  const showId = selectedShow?._id;

  const fetchShows = useCallback(async () => {
    const res = await API.get("/shows", { params: { movie: id, date } });
    setShows(res.data);
    return res.data;
  }, [id, date]);

  useEffect(() => {
    API.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id]);

  useEffect(() => {
    API.get("/food")
      .then((res) => setFoodItems(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedShow(null);
    setSelectedSeats([]);
    setHoldUntil(null);
    setCart({});
    setMessage("");
    fetchShows();
  }, [fetchShows]);

  // real-time seat updates (Socket.io)
  useEffect(() => {
    if (!showId) return;

    const loadLocks = () =>
      API.get(`/seats/${showId}`)
        .then((res) => setLocks(res.data))
        .catch(() => {});

    const onChange = async (payload) => {
      if (payload.showId !== showId) return;
      loadLocks();
      const data = await fetchShows();
      setSelectedShow((prev) => data.find((s) => s._id === prev?._id) || prev);
    };

    socket.emit("join-show", showId);
    socket.on("seats-changed", onChange);
    loadLocks();
    const timer = setInterval(loadLocks, 15000); // fallback (hold expire ku)

    return () => {
      socket.emit("leave-show", showId);
      socket.off("seats-changed", onChange);
      clearInterval(timer);
    };
  }, [showId, fetchShows]);

  const lockedByOthers = locks
    .filter((l) => l.user !== user?._id)
    .map((l) => l.seat);

  const pickShow = async (show) => {
    if (holdUntil && selectedShow) {
      await API.post("/seats/release", { showId: selectedShow._id });
    }
    setHoldUntil(null);
    setSelectedShow(show);
    setSelectedSeats([]);
    setCart({});
    setMessage("");
  };

  const toggleSeat = (seatId) => {
    if (holdUntil) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const changeQty = (foodId, delta) => {
    setCart((prev) => {
      const qty = Math.max(0, Math.min(10, (prev[foodId] || 0) + delta));
      return { ...prev, [foodId]: qty };
    });
  };

  const refreshSelectedShow = async () => {
    const data = await fetchShows();
    setSelectedShow(data.find((s) => s._id === showId) || null);
  };

  const handleHold = async () => {
    if (!user) return navigate("/login");
    try {
      const { data } = await API.post("/seats/lock", {
        showId,
        seats: selectedSeats,
      });
      setHoldUntil(new Date(data.expiresAt));
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not hold seats");
      setSelectedSeats([]);
      const res = await API.get(`/seats/${showId}`);
      setLocks(res.data);
    }
  };

  const handleRelease = async () => {
    await API.post("/seats/release", { showId });
    setHoldUntil(null);
    setSelectedSeats([]);
    setCart({});
  };

  const handleExpire = useCallback(() => {
    setHoldUntil(null);
    setSelectedSeats([]);
    setCart({});
    setMessage("Hold expired, please select seats again");
  }, []);

  const handleBuy = async () => {
    const foods = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([foodId, qty]) => ({ foodId, qty }));

    try {
      const { data } = await API.post("/bookings", {
        showId,
        seats: selectedSeats,
        foods,
      });
      navigate(`/ticket/${data._id}`);
      return;
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
    setHoldUntil(null);
    setSelectedSeats([]);
    setCart({});
    await refreshSelectedShow();
  };

  if (!movie) return <Navbar />;

  const seatTotal = selectedSeats.length * (selectedShow?.price || 0);
  const foodTotal = foodItems.reduce(
    (sum, f) => sum + f.price * (cart[f._id] || 0),
    0
  );
  const total = seatTotal + foodTotal;

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <DateStrip selected={date} onSelect={setDate} />

        <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: 200, borderRadius: 12 }}
          />
          <div style={{ flex: 1, minWidth: 250 }}>
            <h2 style={{ marginTop: 0 }}>{movie.title}</h2>
            <p style={{ color: "var(--muted)" }}>
              {movie.releaseYear} • {movie.duration} min • {movie.language}
            </p>
            <p>{movie.description}</p>
            <p>⭐ {movie.rating}/10</p>

            <h4>Select Time</h4>
            {shows.length === 0 && (
              <p style={{ color: "var(--muted)" }}>No shows on this date</p>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {shows.map((s) => (
                <button
                  key={s._id}
                  onClick={() => pickShow(s)}
                  style={{
                    background:
                      selectedShow?._id === s._id ? "var(--blue)" : "var(--card)",
                    borderRadius: 8,
                  }}
                >
                  {s.time}
                  <br />
                  <small>{s.theatre?.name}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedShow && (
          <div style={{ marginTop: 32 }}>
            <SeatGrid
              rows={selectedShow.theatre.rows}
              seatsPerRow={selectedShow.theatre.seatsPerRow}
              booked={[...selectedShow.bookedSeats, ...lockedByOthers]}
              selected={selectedSeats}
              onToggle={toggleSeat}
            />

            {holdUntil && (
              <FoodMenu items={foodItems} cart={cart} onChange={changeQty} />
            )}

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--card)",
                padding: 16,
                borderRadius: 12,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div>
                  Seats: {selectedSeats.length ? selectedSeats.join(", ") : "-"}
                </div>
                {foodTotal > 0 && (
                  <div style={{ color: "var(--muted)" }}>
                    Seats ₹{seatTotal} + Food ₹{foodTotal}
                  </div>
                )}
                <div style={{ fontSize: 22, fontWeight: "bold" }}>
                  Total: ₹{total}
                </div>
                {holdUntil && (
                  <div style={{ marginTop: 6 }}>
                    Seats held for you{" "}
                    <CountdownTimer
                      expiresAt={holdUntil}
                      onExpire={handleExpire}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {!holdUntil ? (
                  <button
                    onClick={handleHold}
                    disabled={selectedSeats.length === 0}
                    style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
                  >
                    Hold Seats
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRelease}
                      style={{ background: "#2a3347" }}
                    >
                      Cancel
                    </button>
                    <button onClick={handleBuy}>Buy</button>
                  </>
                )}
              </div>
            </div>

            {message && <p style={{ marginTop: 12 }}>{message}</p>}
          </div>
        )}
      </div>
    </>
  );
}*/




import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import API from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import DateStrip from "../components/DateStrip";
import SeatGrid from "../components/SeatGrid";
import CountdownTimer from "../components/CountdownTimer";
import FoodMenu from "../components/FoodMenu";
import ShareButton from "../components/ShareButton";

const styles = `
* {
  box-sizing: border-box;
}

.movie-page {
  min-height: 100vh;
  padding: 26px;
  color: #e8f0ff;
  background:
    radial-gradient(ellipse at top right, rgba(24, 91, 190, 0.13), transparent 42%),
    #070b14;
}

.movie-date-section {
  margin-bottom: 24px;
  padding: 18px 20px;
  background: #0d1422;
  border: 1px solid #1d2b42;
  border-radius: 16px;
}

.movie-date-title {
  margin: 0 0 15px;
  color: #f1f6ff;
  font-size: 18px;
  font-weight: 700;
}

.movie-date-section > div {
  max-width: 100%;
  overflow-x: auto;
}

.movie-date-section button {
  cursor: pointer;
}

.movie-booking-layout {
  display: grid;
  grid-template-columns: minmax(260px, 330px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.movie-info-panel {
  overflow: hidden;
  background: linear-gradient(160deg, #111d32, #0b1220 75%);
  border: 1px solid #203552;
  border-radius: 18px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.movie-poster-wrapper {
  position: relative;
  padding: 16px 16px 0;
}

.movie-poster {
  display: block;
  width: 100%;
  height: 390px;
  object-fit: cover;
  background: #111a29;
  border-radius: 12px;
}

.movie-info-content {
  padding: 20px;
}

.movie-info-content h1 {
  margin: 0 0 12px;
  color: #f5f8ff;
  font-size: 25px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.movie-meta span {
  padding: 6px 10px;
  color: #a9c9ff;
  background: #152746;
  border: 1px solid #243e65;
  border-radius: 7px;
  font-size: 12px;
}

.movie-rating {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 16px;
  padding: 9px 12px;
  color: #ffd36b;
  background: #272318;
  border: 1px solid #514326;
  border-radius: 9px;
  font-weight: 700;
}

.movie-description {
  color: #aab8cf;
  font-size: 14px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.movie-info-divider {
  height: 1px;
  margin: 18px 0;
  background: #243149;
}

.movie-info-label {
  margin: 0 0 8px;
  color: #8da3c3;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.movie-info-value {
  margin: 0;
  color: #e7efff;
  font-size: 14px;
}

.booking-main-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  min-width: 0;
  padding: 22px;
  background: #0d1422;
  border: 1px solid #1d2b42;
  border-radius: 16px;
}

.booking-section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
  color: #f0f5ff;
  font-size: 19px;
  font-weight: 700;
}

.booking-heading-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #fff;
  background: #176de0;
  border-radius: 9px;
  font-size: 14px;
}

.booking-show-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.booking-show-button {
  min-width: 125px;
  padding: 12px 16px;
  color: #c4d2e9;
  background: #111d30;
  border: 1px solid #2b3b54;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: 0.2s ease;
}

.booking-show-button:hover {
  border-color: #338cff;
  transform: translateY(-2px);
}

.booking-show-button.active {
  color: white;
  background: linear-gradient(135deg, #1678f5, #1454b4);
  border-color: #4297ff;
  box-shadow: 0 4px 18px rgba(22, 120, 245, 0.2);
}

.booking-show-time {
  display: block;
  font-size: 15px;
  font-weight: 700;
}

.booking-show-theatre {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.8;
}

.booking-muted {
  color: #8ea2c4;
  font-size: 14px;
  line-height: 1.7;
}

.booking-screen {
  margin: 10px auto 28px;
  padding: 10px;
  max-width: 460px;
  color: #c8e1ff;
  background: linear-gradient(
    180deg,
    rgba(42, 137, 255, 0.2),
    rgba(42, 137, 255, 0.02)
  );
  border-top: 3px solid #419bff;
  border-radius: 50% 50% 0 0 / 18% 18% 0 0;
  text-align: center;
  font-size: 11px;
  letter-spacing: 4px;
}

.booking-seat-area {
  width: 100%;
  overflow-x: auto;
  padding: 4px 0 12px;
}

.booking-seat-area > * {
  margin-left: auto;
  margin-right: auto;
}

.booking-seat-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin-top: 18px;
  color: #aabbd3;
  font-size: 12px;
}

.booking-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.booking-legend-box {
  width: 13px;
  height: 13px;
  border-radius: 4px;
}

.booking-legend-available {
  background: #18263a;
  border: 1px solid #526a8b;
}

.booking-legend-selected {
  background: #2387ff;
  border: 1px solid #67b0ff;
}

.booking-legend-booked {
  background: #4a5362;
  border: 1px solid #687487;
}

.booking-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.booking-summary-item {
  min-width: 0;
  padding: 15px;
  background: #111d30;
  border: 1px solid #22344f;
  border-radius: 11px;
}

.booking-summary-label {
  margin-bottom: 8px;
  color: #8ea2c4;
  font-size: 12px;
}

.booking-summary-value {
  color: #eaf2ff;
  font-size: 19px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.booking-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0;
  padding-top: 18px;
  border-top: 1px solid #243149;
}

.booking-total-label {
  color: #c3d2e8;
  font-size: 15px;
}

.booking-total-price {
  color: #55a5ff;
  font-size: 27px;
  font-weight: 800;
}

.booking-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.booking-action-button {
  min-height: 44px;
  padding: 11px 20px;
  color: #eaf2ff;
  background: #17253a;
  border: 1px solid #304562;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: 0.2s ease;
}

.booking-action-button:hover:not(:disabled) {
  filter: brightness(1.15);
  transform: translateY(-1px);
}

.booking-action-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.booking-action-primary {
  color: white;
  background: linear-gradient(135deg, #1681ff, #1458c7);
  border-color: #388dff;
}

.booking-action-danger {
  background: #3a1c29;
  border-color: #74334a;
}

.booking-message {
  margin: 14px 0 0;
  padding: 12px 14px;
  color: #ffcfda;
  background: #321925;
  border: 1px solid #713249;
  border-radius: 9px;
  font-size: 13px;
}

.booking-message:empty {
  display: none;
}

.booking-food-area {
  margin-top: 20px;
}

.booking-food-area > * {
  max-width: 100%;
}

.booking-empty {
  padding: 18px;
  color: #91a4c0;
  background: #111d30;
  border: 1px dashed #30425d;
  border-radius: 10px;
  text-align: center;
}

@media (max-width: 900px) {
  .movie-booking-layout {
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 16px;
  }

  .movie-poster {
    height: 330px;
  }

  .booking-card {
    padding: 16px;
  }

  .booking-summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .movie-page {
    padding: 12px;
  }

  .movie-booking-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .movie-info-panel {
    display: grid;
    grid-template-columns: 125px minmax(0, 1fr);
    align-items: start;
  }

  .movie-poster-wrapper {
    padding: 12px 0 12px 12px;
  }

  .movie-poster {
    height: 190px;
  }

  .movie-info-content {
    padding: 14px;
  }

  .movie-info-content h1 {
    font-size: 19px;
  }

  .movie-description {
    font-size: 12px;
    line-height: 1.6;
  }

  .movie-meta {
    gap: 5px;
  }

  .movie-meta span {
    padding: 5px 7px;
    font-size: 10px;
  }

  .movie-info-divider {
    margin: 10px 0;
  }

  .movie-date-section {
    padding: 14px;
  }

  .booking-card {
    padding: 15px;
  }

  .booking-section-heading {
    font-size: 17px;
  }

  .booking-show-button {
    flex: 1 1 115px;
    min-width: 0;
  }

  .booking-summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
  }

  .booking-summary-item {
    padding: 10px 8px;
  }

  .booking-summary-value {
    font-size: 15px;
  }

  .booking-summary-label {
    font-size: 10px;
  }

  .booking-total-price {
    font-size: 23px;
  }

  .booking-action-row {
    flex-direction: column;
  }

  .booking-action-button {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .movie-info-panel {
    grid-template-columns: 105px minmax(0, 1fr);
  }

  .movie-poster {
    height: 160px;
  }

  .movie-info-content {
    padding: 10px;
  }

  .movie-info-content h1 {
    font-size: 16px;
  }

  .booking-summary-grid {
    grid-template-columns: 1fr;
  }
}
`;

const today = () => new Date().toLocaleDateString("en-CA");

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // shared link la irundhu vandha date / show (first load ku mattum)
  const initialShowId = useRef(searchParams.get("show"));
  const dateParam = searchParams.get("date");

  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today()
  );
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [locks, setLocks] = useState([]);
  const [holdUntil, setHoldUntil] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState("");

  const showId = selectedShow?._id;

  const fetchShows = useCallback(async () => {
    const res = await API.get("/shows", {
      params: { movie: id, date },
    });

    setShows(res.data);
    return res.data;
  }, [id, date]);

  useEffect(() => {
    API.get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setMessage("Could not load movie details"));
  }, [id]);

  useEffect(() => {
    API.get("/food")
      .then((res) => setFoodItems(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedShow(null);
    setSelectedSeats([]);
    setHoldUntil(null);
    setCart({});
    setMessage("");

    fetchShows()
      .then((data) => {
        const wanted = initialShowId.current;
        if (wanted) {
          const found = data.find((s) => s._id === wanted);
          if (found) setSelectedShow(found);
          initialShowId.current = null; // oru thadava mattum
        }
      })
      .catch(() => setShows([]));
  }, [fetchShows]);

  useEffect(() => {
    if (!showId) return;

    const loadLocks = () => {
      API.get(`/seats/${showId}`)
        .then((res) => setLocks(res.data))
        .catch(() => {});
    };

    const onChange = async (payload) => {
      if (payload.showId !== showId) return;

      loadLocks();

      try {
        const data = await fetchShows();
        setSelectedShow(
          (prev) => data.find((s) => s._id === prev?._id) || prev
        );
      } catch {
        // Keep the current show if refreshing fails.
      }
    };

    socket.emit("join-show", showId);
    socket.on("seats-changed", onChange);
    loadLocks();

    const timer = setInterval(loadLocks, 15000);

    return () => {
      socket.emit("leave-show", showId);
      socket.off("seats-changed", onChange);
      clearInterval(timer);
    };
  }, [showId, fetchShows]);

  const lockedByOthers = locks
    .filter((lock) => lock.user !== user?._id)
    .map((lock) => lock.seat);

  const pickShow = async (show) => {
    if (holdUntil && selectedShow) {
      try {
        await API.post("/seats/release", {
          showId: selectedShow._id,
        });
      } catch {
        // Continue switching shows.
      }
    }

    setHoldUntil(null);
    setSelectedShow(show);
    setSelectedSeats([]);
    setCart({});
    setMessage("");
  };

  const toggleSeat = (seatId) => {
    if (holdUntil) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const changeQty = (foodId, delta) => {
    setCart((prev) => {
      const qty = Math.max(
        0,
        Math.min(10, (prev[foodId] || 0) + delta)
      );

      return { ...prev, [foodId]: qty };
    });
  };

  const refreshSelectedShow = async () => {
    const data = await fetchShows();

    setSelectedShow(
      data.find((show) => show._id === showId) || null
    );
  };

  const handleHold = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedShow || selectedSeats.length === 0) {
      setMessage("Please select your seats first");
      return;
    }

    try {
      const { data } = await API.post("/seats/lock", {
        showId,
        seats: selectedSeats,
      });

      setHoldUntil(new Date(data.expiresAt));
      setMessage("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Could not hold seats"
      );

      setSelectedSeats([]);

      try {
        const res = await API.get(`/seats/${showId}`);
        setLocks(res.data);
      } catch {
        // Ignore refresh error.
      }
    }
  };

  const handleRelease = async () => {
    try {
      await API.post("/seats/release", { showId });
    } catch {
      setMessage("Could not release seats. Please try again.");
      return;
    }

    setHoldUntil(null);
    setSelectedSeats([]);
    setCart({});
    setMessage("");
  };

  const handleExpire = useCallback(() => {
    setHoldUntil(null);
    setSelectedSeats([]);
    setCart({});
    setMessage("Hold expired, please select seats again");
  }, []);

  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!holdUntil || selectedSeats.length === 0) {
      setMessage("Please hold your seats before booking");
      return;
    }

    const foods = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([foodId, qty]) => ({ foodId, qty }));

    try {
      const { data } = await API.post("/bookings", {
        showId,
        seats: selectedSeats,
        foods,
      });

      navigate(`/ticket/${data._id}`);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Booking failed"
      );

      setHoldUntil(null);
      setSelectedSeats([]);
      setCart({});

      try {
        await refreshSelectedShow();
      } catch {
        // Ignore refresh error.
      }
    }
  };

  if (!movie) {
    return (
      <>
        <style>{styles}</style>
        <Navbar />
        <main className="movie-page">
          <div className="booking-card">
            <p className="booking-muted">
              {message || "Loading movie details..."}
            </p>
          </div>
        </main>
      </>
    );
  }

  const seatTotal =
    selectedSeats.length * (selectedShow?.price || 0);

  const foodTotal = foodItems.reduce(
    (sum, food) =>
      sum + food.price * (cart[food._id] || 0),
    0
  );

  const total = seatTotal + foodTotal;

  return (
    <>
      <style>{styles}</style>

      <Navbar />

      <main className="movie-page">
        {/* Date selection */}
        <section className="movie-date-section">
          <h3 className="movie-date-title">
            📅 Select Booking Date
          </h3>

          <DateStrip selected={date} onSelect={setDate} />
        </section>

        <div className="movie-booking-layout">
          {/* LEFT SIDE: Movie information */}
          <aside className="movie-info-panel">
            <div className="movie-poster-wrapper">
              <img
                className="movie-poster"
                src={movie.poster}
                alt={movie.title}
              />
            </div>

            <div className="movie-info-content">
              <h1>{movie.title}</h1>

              <div className="movie-meta">
                {movie.releaseYear && (
                  <span>{movie.releaseYear}</span>
                )}

                {movie.duration && (
                  <span>{movie.duration} min</span>
                )}

                {movie.language && (
                  <span>{movie.language}</span>
                )}
              </div>

              <div className="movie-rating">
                ⭐ {movie.rating ?? "N/A"}/10
              </div>

              {/* Share plan */}
              <ShareButton
                movie={movie}
                date={date}
                show={selectedShow}
              />

              <div className="movie-info-divider" />

              <p className="movie-info-label">
                Movie Description
              </p>

              <p className="movie-description">
                {movie.description || "No description available."}
              </p>

              {selectedShow && (
                <>
                  <div className="movie-info-divider" />

                  <p className="movie-info-label">
                    Selected Show
                  </p>

                  <p className="movie-info-value">
                    {selectedShow.time}
                  </p>

                  <p
                    className="movie-info-value"
                    style={{ marginTop: 6 }}
                  >
                    {selectedShow.theatre?.name}
                  </p>
                </>
              )}
            </div>
          </aside>

          {/* RIGHT SIDE: Showtimes, seats and booking */}
          <section className="booking-main-panel">
            {/* Show timings */}
            <div className="booking-card">
              <h2 className="booking-section-heading">
                <span className="booking-heading-number">1</span>
                Select Show Time
              </h2>

              {shows.length === 0 ? (
                <div className="booking-empty">
                  No shows available on this date.
                  Please select another date.
                </div>
              ) : (
                <div className="booking-show-list">
                  {shows.map((show) => (
                    <button
                      key={show._id}
                      type="button"
                      className={`booking-show-button ${
                        selectedShow?._id === show._id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => pickShow(show)}
                    >
                      <span className="booking-show-time">
                        {show.time}
                      </span>

                      <span className="booking-show-theatre">
                        {show.theatre?.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Seat selection */}
            {selectedShow && (
              <>
                <div className="booking-card">
                  <h2 className="booking-section-heading">
                    <span className="booking-heading-number">2</span>
                    Choose Your Seats
                  </h2>

                  <div className="booking-screen">
                    SCREEN THIS WAY
                  </div>

                  <div className="booking-seat-area">
                    <SeatGrid
                      rows={selectedShow.theatre.rows}
                      seatsPerRow={selectedShow.theatre.seatsPerRow}
                      booked={[
                        ...(selectedShow.bookedSeats || []),
                        ...lockedByOthers,
                      ]}
                      selected={selectedSeats}
                      onToggle={toggleSeat}
                    />
                  </div>

                  <div className="booking-seat-legend">
                    <span className="booking-legend-item">
                      <span className="booking-legend-box booking-legend-available" />
                      Available
                    </span>

                    <span className="booking-legend-item">
                      <span className="booking-legend-box booking-legend-selected" />
                      Selected
                    </span>

                    <span className="booking-legend-item">
                      <span className="booking-legend-box booking-legend-booked" />
                      Booked / Locked
                    </span>
                  </div>

                  {holdUntil && (
                    <div className="booking-food-area">
                      <FoodMenu
                        items={foodItems}
                        cart={cart}
                        onChange={changeQty}
                      />
                    </div>
                  )}
                </div>

                {/* Booking summary */}
                <div className="booking-card">
                  <h2 className="booking-section-heading">
                    <span className="booking-heading-number">3</span>
                    Booking Summary
                  </h2>

                  <div className="booking-summary-grid">
                    <div className="booking-summary-item">
                      <div className="booking-summary-label">
                        Selected Seats
                      </div>

                      <div className="booking-summary-value">
                        {selectedSeats.length}
                      </div>
                    </div>

                    <div className="booking-summary-item">
                      <div className="booking-summary-label">
                        Ticket Amount
                      </div>

                      <div className="booking-summary-value">
                        ₹{seatTotal}
                      </div>
                    </div>

                    <div className="booking-summary-item">
                      <div className="booking-summary-label">
                        Food Amount
                      </div>

                      <div className="booking-summary-value">
                        ₹{foodTotal}
                      </div>
                    </div>
                  </div>

                  <div className="booking-total">
                    <span className="booking-total-label">
                      Total Amount
                    </span>

                    <span className="booking-total-price">
                      ₹{total}
                    </span>
                  </div>

                  {holdUntil && (
                    <div style={{ marginBottom: 18 }}>
                      <p className="booking-muted">
                        Complete your booking before the hold expires.
                      </p>

                      <CountdownTimer
                        expiresAt={holdUntil}
                        onExpire={handleExpire}
                      />
                    </div>
                  )}

                  <div className="booking-action-row">
                    {!holdUntil ? (
                      <button
                        type="button"
                        className="booking-action-button booking-action-primary"
                        onClick={handleHold}
                        disabled={selectedSeats.length === 0}
                      >
                        🔒 Hold Seats
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="booking-action-button booking-action-danger"
                          onClick={handleRelease}
                        >
                          Cancel Hold
                        </button>

                        <button
                          type="button"
                          className="booking-action-button booking-action-primary"
                          onClick={handleBuy}
                        >
                          🎟️ Book Tickets · ₹{total}
                        </button>
                      </>
                    )}
                  </div>

                  {message && (
                    <p className="booking-message">{message}</p>
                  )}
                </div>
              </>
            )}

            {!selectedShow && shows.length > 0 && (
              <div className="booking-card">
                <div className="booking-empty">
                  👆 Select a show time to view the cinema seats.
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}