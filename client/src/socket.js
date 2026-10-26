import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://cinematix-api-pq8r.onrender.com")
);