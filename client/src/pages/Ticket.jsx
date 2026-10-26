import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Ticket() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/bookings/${id}`)
      .then((res) => setBooking(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load ticket")
      );
  }, [id]);

  if (error)
    return (
      <>
        <Navbar />
        <p style={{ padding: 24 }}>{error}</p>
      </>
    );
  if (!booking) return <Navbar />;

  const { show } = booking;
  const isCancelled = booking.status === "cancelled";

  return (
    <>
      <Navbar />
      <div style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            color: "#111",
            borderRadius: 16,
            padding: 24,
            textAlign: "center",
            opacity: isCancelled ? 0.75 : 1,
          }}
        >
          <h2 style={{ margin: "0 0 4px" }}>{show?.movie?.title}</h2>
          <p style={{ margin: "0 0 16px", color: "#555" }}>
            {show?.theatre?.name}, {show?.theatre?.city}
          </p>

          {isCancelled ? (
            <div
              style={{
                margin: "10px auto 16px",
                padding: "26px 10px",
                border: "3px solid #c0392b",
                borderRadius: 12,
                color: "#c0392b",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 3,
                transform: "rotate(-4deg)",
                maxWidth: 240,
              }}
            >
              CANCELLED
            </div>
          ) : (
            <QRCodeSVG value={`CINEMATIX:${booking._id}`} size={180} />
          )}

          <p style={{ fontSize: 12, color: "#777", wordBreak: "break-all" }}>
            {booking._id}
          </p>

          <hr style={{ border: "none", borderTop: "1px dashed #bbb" }} />

          <p style={{ margin: "8px 0" }}>
            <b>{show?.date}</b> • <b>{show?.time}</b>
          </p>
          <p style={{ margin: "8px 0" }}>
            Seats: <b>{booking.seats.join(", ")}</b>
          </p>
          {booking.foodOrders?.length > 0 && (
            <p style={{ margin: "8px 0" }}>
              Food:{" "}
              {booking.foodOrders.map((f) => `${f.name} x${f.qty}`).join(", ")}
            </p>
          )}
          <p style={{ margin: "8px 0", fontSize: 20 }}>
            Total: <b>₹{booking.total}</b>
          </p>

          {isCancelled && (
            <p style={{ margin: "10px 0 0", color: "#c0392b", fontSize: 13 }}>
              This booking was cancelled. This ticket is no longer valid.
            </p>
          )}
        </div>

        <div
          className="no-print"
          style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
            justifyContent: "center",
          }}
        >
          {!isCancelled && (
            <button onClick={() => window.print()}>Print / Save PDF</button>
          )}
          <Link to="/my-bookings">
            <button style={{ background: "#2a3347" }}>My Bookings</button>
          </Link>
        </div>
      </div>
    </>
  );
}