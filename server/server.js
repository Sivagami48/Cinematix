const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

const io = new Server(server, {
  cors: { origin: allowedOrigins },
});
app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-show", (showId) => socket.join(`show:${showId}`));
  socket.on("leave-show", (showId) => socket.leave(`show:${showId}`));

  // login pannina user ah identify pannu (token verify aanaa mattum)
  socket.on("auth", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (socket.userId) socket.leave(`user:${socket.userId}`);
      socket.userId = decoded.id;
      socket.join(`user:${decoded.id}`);
    } catch {
      // thappaana token na ignore pannu
    }
  });

  socket.on("unauth", () => {
    if (socket.userId) {
      socket.leave(`user:${socket.userId}`);
      socket.userId = null;
    }
  });
});

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Cinematix API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/shows", require("./routes/showRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/seats", require("./routes/seatRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));