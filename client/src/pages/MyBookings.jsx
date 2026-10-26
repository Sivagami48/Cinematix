import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      try {
        if (reloadKey === 0) setLoading(true);
        setError("");

        const res = await API.get("/bookings/my");

        if (!cancelled) {
          setBookings(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("My bookings error:", err.response?.data || err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load your bookings. Please login again and retry."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleCancel = async (id) => {
    const ok = window.confirm(
      "Cancel this booking? Your seats will be released."
    );
    if (!ok) return;

    setAlert({ type: "", text: "" });
    setCancellingId(id);

    try {
      await API.patch(`/bookings/${id}/cancel`);
      setAlert({ type: "success", text: "Booking cancelled successfully." });
      setReloadKey((k) => k + 1);
    } catch (err) {
      setAlert({
        type: "error",
        text: err.response?.data?.message || "Could not cancel the booking.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <style>{`
        .mybook-page {
          min-height: calc(100vh - 76px);
          padding: 40px 20px 60px;
          background:
            radial-gradient(ellipse at top, rgba(37, 99, 235, 0.10), transparent 45%),
            #070b14;
          color: #f8fafc;
        }

        .mybook-container {
          max-width: 850px;
          margin: 0 auto;
        }

        .mybook-heading {
          font-size: 30px;
          margin: 0 0 8px;
          font-weight: 800;
        }

        .mybook-subtitle {
          color: #94a3b8;
          margin: 0 0 30px;
          font-size: 14px;
        }

        .mybook-alert {
          margin: 0 0 20px;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 14px;
          line-height: 1.6;
          border: 1px solid #1e4977;
          background: rgba(37, 99, 235, 0.1);
          color: #93c5fd;
        }

        .mybook-alert.success {
          border-color: rgba(34, 197, 94, 0.35);
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
        }

        .mybook-alert.error {
          border-color: rgba(248, 113, 113, 0.35);
          background: rgba(220, 38, 38, 0.1);
          color: #fca5a5;
        }

        .mybook-card {
          background: #101827;
          border: 1px solid #24334a;
          border-radius: 16px;
          padding: 23px;
          margin-bottom: 18px;
          transition: border-color 0.2s, transform 0.2s;
        }

        .mybook-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .mybook-card.is-cancelled {
          opacity: 0.65;
        }

        .mybook-card.is-cancelled:hover {
          border-color: #24334a;
          transform: none;
        }

        .mybook-movie {
          font-size: 21px;
          margin: 0 0 12px;
          color: #f8fafc;
        }

        .mybook-info {
          color: #a9b8cc;
          font-size: 14px;
          line-height: 1.8;
          margin: 0 0 8px;
          overflow-wrap: anywhere;
        }

        .mybook-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          border-top: 1px solid #263449;
          padding-top: 16px;
          margin-top: 17px;
        }

        .mybook-price {
          font-size: 19px;
          font-weight: 800;
          color: #60a5fa;
        }

        .mybook-status {
          display: inline-block;
          border-radius: 20px;
          padding: 5px 11px;
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .mybook-status.cancelled {
          background: rgba(220, 38, 38, 0.12);
          color: #fca5a5;
        }

        .mybook-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }

        .mybook-ticket {
          display: inline-block;
          padding: 10px 16px;
          background: #2563eb;
          border-radius: 9px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .mybook-ticket:hover {
          background: #1d4ed8;
        }

        .mybook-cancel {
          padding: 10px 16px;
          border: 1px solid #74334a;
          border-radius: 9px;
          background: #3a1c29;
          color: #fecdd3;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: filter 0.2s;
        }

        .mybook-cancel:hover:not(:disabled) {
          filter: brightness(1.2);
        }

        .mybook-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .mybook-message {
          padding: 22px;
          border-radius: 12px;
          background: #101827;
          border: 1px solid #24334a;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .mybook-error {
          color: #fca5a5;
          border-color: rgba(248, 113, 113, 0.35);
        }

        .mybook-retry {
          margin-top: 12px;
          padding: 9px 15px;
          border: 0;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 500px) {
          .mybook-page {
            padding: 28px 14px 45px;
          }

          .mybook-heading {
            font-size: 25px;
          }

          .mybook-card {
            padding: 17px;
          }

          .mybook-movie {
            font-size: 18px;
          }

          .mybook-actions > * {
            flex: 1 1 100%;
            text-align: center;
          }
        }
      `}</style>

      <Navbar />

      <main className="mybook-page">
        <div className="mybook-container">
          <h1 className="mybook-heading">My Bookings 🎬</h1>

          <p className="mybook-subtitle">
            Your tickets and movie booking history in one place.
          </p>

          {alert.text && (
            <div className={`mybook-alert ${alert.type}`} role="status">
              {alert.type === "error" ? "⚠️ " : "✓ "}
              {alert.text}
            </div>
          )}

          {loading && (
            <div className="mybook-message">
              Loading your bookings...
            </div>
          )}

          {!loading && error && (
            <div className="mybook-message mybook-error">
              <strong>Couldn't load bookings</strong>
              <br />
              {error}
              <br />
              <button
                className="mybook-retry"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="mybook-message">
              <h3 style={{ marginTop: 0 }}>No bookings yet 🎟️</h3>
              <p>
                You haven't booked any movies yet. Explore movies and book
                your favourite seats!
              </p>
              <Link className="mybook-ticket" to="/">
                Explore Movies
              </Link>
            </div>
          )}

          {!loading &&
            !error &&
            bookings.map((b) => {
              const isCancelled = b.status === "cancelled";

              return (
                <article
                  className={`mybook-card ${isCancelled ? "is-cancelled" : ""}`}
                  key={b._id}
                >
                  <h2 className="mybook-movie">
                    {b.show?.movie?.title || "Movie details unavailable"}
                  </h2>

                  <p className="mybook-info">
                    🏢 Theatre: {b.show?.theatre?.name || "Not available"}
                    <br />
                    📅 Date: {b.show?.date || "Not available"}
                    <br />
                    🕒 Time: {b.show?.time || "Not available"}
                  </p>

                  <p className="mybook-info">
                    <strong style={{ color: "#e2e8f0" }}>🎟️ Seats:</strong>{" "}
                    {Array.isArray(b.seats) && b.seats.length
                      ? b.seats.join(", ")
                      : "Not available"}
                  </p>

                  {b.foodOrders?.length > 0 && (
                    <p className="mybook-info">
                      🍿 Food:{" "}
                      {b.foodOrders
                        .map((f) => `${f.name} x${f.qty}`)
                        .join(", ")}
                      {!isCancelled && (
                        <>
                          {" · "}
                          {b.foodStatus || "Pending"}
                        </>
                      )}
                    </p>
                  )}

                  <div className="mybook-total">
                    <span className="mybook-price">
                      Total: ₹{b.total ?? 0}
                    </span>

                    <span
                      className={`mybook-status ${isCancelled ? "cancelled" : ""}`}
                    >
                      {b.status || "Confirmed"}
                    </span>
                  </div>

                  {!isCancelled && (
                    <div className="mybook-actions">
                      <Link
                        to={`/ticket/${b._id}`}
                        className="mybook-ticket"
                      >
                        View Ticket →
                      </Link>

                      <button
                        type="button"
                        className="mybook-cancel"
                        disabled={cancellingId === b._id}
                        onClick={() => handleCancel(b._id)}
                      >
                        {cancellingId === b._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
        </div>
      </main>
    </>
  );
}