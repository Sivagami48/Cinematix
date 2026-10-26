import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MovieDetails from "./pages/MovieDetails";
import MyBookings from "./pages/MyBookings";
import Ticket from "./pages/Ticket";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Diary from "./pages/Dairy";


export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
  path="/diary"
  element={
    <ProtectedRoute>
      <Diary />
    </ProtectedRoute>
  }
/>
          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute>
                <Ticket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}