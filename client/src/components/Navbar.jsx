import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#60a5fa" : "#cbd5e1",
    fontWeight: isActive(path) ? "600" : "500",
    fontSize: "14px",
    transition: "color 0.2s ease",
  });

  return (
    <>
      <style>{`
        .cinema-navbar {
          width: 100%;
          box-sizing: border-box;
          min-height: 76px;
          padding: 14px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          background: #080d18;
          border-bottom: 1px solid rgba(59, 130, 246, 0.25);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .cinema-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #f8fafc;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.7px;
          white-space: nowrap;
        }

        .cinema-logo-icon {
          width: 39px;
          height: 39px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border-radius: 11px;
          color: #ffffff;
          font-size: 17px;
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          box-shadow: 0 5px 18px rgba(37, 99, 235, 0.25);
          flex-shrink: 0;
        }

        .cinema-logo-accent {
          color: #60a5fa;
        }

        .cinema-nav-right {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .cinema-nav-link {
          text-decoration: none;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .cinema-nav-link:hover {
          color: #60a5fa;
        }

        .cinema-user {
          color: #e2e8f0;
          font-size: 13px;
          padding: 9px 13px;
          border-radius: 9px;
          background: #111827;
          border: 1px solid #263449;
          white-space: nowrap;
        }

        .cinema-nav-button {
          padding: 10px 19px;
          border: 1px solid #3b82f6;
          border-radius: 9px;
          background: #2563eb;
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cinema-nav-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .cinema-logout {
          background: transparent;
          color: #93c5fd;
        }

        .cinema-logout:hover {
          background: rgba(37, 99, 235, 0.12);
        }

        .cinema-mobile-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        @media (max-width: 700px) {
          .cinema-navbar {
            padding: 13px 16px;
            flex-wrap: wrap;
            gap: 14px;
          }

          .cinema-logo {
            font-size: 21px;
          }

          .cinema-logo-icon {
            width: 34px;
            height: 34px;
          }

          .cinema-nav-right {
            width: 100%;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .cinema-mobile-links {
            gap: 15px;
            flex-wrap: wrap;
          }

          .cinema-nav-link {
            font-size: 13px;
          }

          .cinema-user {
            display: none;
          }

          .cinema-nav-button {
            padding: 9px 13px;
          }
        }

        @media (max-width: 380px) {
          .cinema-nav-right {
            gap: 10px;
          }

          .cinema-mobile-links {
            gap: 12px;
          }

          .cinema-logo {
            font-size: 19px;
          }
        }
      `}</style>

      <nav className="cinema-navbar">
        <Link to="/" className="cinema-logo">
          <span className="cinema-logo-icon">▶</span>
          <span>
            Cinema<span className="cinema-logo-accent">tix</span>
          </span>
        </Link>

        <div className="cinema-nav-right">
          <div className="cinema-mobile-links">
            <Link to="/" className="cinema-nav-link">
              Home
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                className="cinema-nav-link"
                style={linkStyle("/my-bookings")}
              >
                My Bookings
              </Link>
            )}

            {/* <Link to="/diary">Diary</Link> */}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="cinema-nav-link"
                style={linkStyle("/admin")}
              >
                Admin
              </Link>
            )}
          </div>

          {user ? (
            <>
              <NotificationBell />

              <span className="cinema-user">👤 {user.name}</span>

              <button
                type="button"
                className="cinema-nav-button cinema-logout"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button type="button" className="cinema-nav-button">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}