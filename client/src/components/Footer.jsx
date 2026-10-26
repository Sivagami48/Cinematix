/*import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer
      className="no-print"
      style={{
        background: "var(--card)",
        marginTop: 40,
        padding: "28px 24px 16px",
        color: "var(--muted)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div style={{ maxWidth: 280 }}>
          <h3 style={{ margin: "0 0 8px", color: "var(--text)" }}>Cinematix</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            Book movie tickets, choose your seats and pre-order snacks, all in
            one place.
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 8px", color: "var(--text)" }}>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
            <Link to="/">Home</Link>
            {user ? (
              <Link to="/my-bookings">My Bookings</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>

        <div>
          <h4 style={{ margin: "0 0 8px", color: "var(--text)" }}>Contact</h4>
          <div style={{ fontSize: 14 }}>
            <div>support@cinematix.com</div>
            <div>Coimbatore, Tamil Nadu</div>
          </div>
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          margin: "24px 0 0",
          borderTop: "1px solid #1c2a47",
          paddingTop: 12,
        }}
      >
        © {new Date().getFullYear()} Cinematix. All rights reserved.
      </p>
    </footer>
  );
}*/





import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        .cinema-footer {
          position: relative;
          overflow: hidden;
          margin-top: 0;
          padding: 55px 24px 20px;
          color: #94a3b8;
          background:
            radial-gradient(ellipse at 15% 0%, rgba(37, 99, 235, 0.13), transparent 42%),
            #080d18;
          border-top: 1px solid rgba(59, 130, 246, 0.25);
          font-family: Arial, Helvetica, sans-serif;
        }

        .cinema-footer,
        .cinema-footer * {
          box-sizing: border-box;
        }

        .cinema-footer-container {
          max-width: 1120px;
          margin: 0 auto;
        }

        .cinema-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 38px;
          padding-bottom: 38px;
        }

        .cinema-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #f8fafc;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.7px;
          margin-bottom: 17px;
        }

        .cinema-footer-logo {
          width: 39px;
          height: 39px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: white;
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          box-shadow: 0 5px 18px rgba(37, 99, 235, 0.25);
          font-size: 17px;
        }

        .cinema-footer-brand span:last-child span {
          color: #60a5fa;
        }

        .cinema-footer-description {
          max-width: 300px;
          margin: 0;
          font-size: 13px;
          line-height: 1.9;
          color: #94a3b8;
        }

        .cinema-footer-heading {
          position: relative;
          margin: 5px 0 22px;
          color: #f1f5f9;
          font-size: 14px;
          font-weight: 700;
        }

        .cinema-footer-heading::after {
          content: "";
          display: block;
          width: 30px;
          height: 2px;
          margin-top: 10px;
          border-radius: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
        }

        .cinema-footer-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 13px;
        }

        .cinema-footer-link {
          color: #94a3b8;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s, transform 0.2s;
        }

        .cinema-footer-link:hover {
          color: #60a5fa;
          transform: translateX(3px);
        }

        .cinema-footer-contact {
          margin-bottom: 15px;
          font-size: 13px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .cinema-footer-contact-label {
          display: block;
          margin-bottom: 3px;
          color: #64748b;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cinema-footer-email {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.2s;
        }

        .cinema-footer-email:hover {
          color: #60a5fa;
        }

        .cinema-footer-socials {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .cinema-footer-social {
          width: 35px;
          height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #27364c;
          border-radius: 10px;
          background: #101827;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cinema-footer-social:hover {
          color: #ffffff;
          border-color: #3b82f6;
          background: #1d4ed8;
          transform: translateY(-3px);
        }

        .cinema-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          padding-top: 20px;
          border-top: 1px solid #1e293b;
        }

        .cinema-footer-copyright {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.7;
        }

        .cinema-footer-legal {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .cinema-footer-legal a {
          color: #64748b;
          font-size: 12px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .cinema-footer-legal a:hover {
          color: #60a5fa;
        }

        @media (max-width: 850px) {
          .cinema-footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 35px 28px;
          }
        }

        @media (max-width: 480px) {
          .cinema-footer {
            padding: 38px 20px 18px;
          }

          .cinema-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px 18px;
          }

          .cinema-footer-about {
            grid-column: 1 / -1;
          }

          .cinema-footer-brand {
            font-size: 23px;
          }

          .cinema-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .cinema-footer-legal {
            gap: 15px;
          }
        }
      `}</style>

      <footer className="cinema-footer no-print">
        <div className="cinema-footer-container">
          <div className="cinema-footer-grid">
            {/* Brand */}
            <div className="cinema-footer-about">
              <Link to="/" className="cinema-footer-brand">
                <span className="cinema-footer-logo">▶</span>
                <span>
                  Cinema<span>tix</span>
                </span>
              </Link>

              <p className="cinema-footer-description">
                Your next movie experience starts here. Discover movies,
                choose your favourite seats, and pre-order snacks — all in
                one place.
              </p>

              <div className="cinema-footer-socials">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="cinema-footer-social"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  IG
                </a>

                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="cinema-footer-social"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  YT
                </a>

                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="cinema-footer-social"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  FB
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="cinema-footer-heading">Quick Links</h3>

              <div className="cinema-footer-links">
                <Link to="/" className="cinema-footer-link">
                  Home
                </Link>

                {user ? (
                  <Link to="/my-bookings" className="cinema-footer-link">
                    My Bookings
                  </Link>
                ) : (
                  <Link to="/login" className="cinema-footer-link">
                    Login
                  </Link>
                )}

                {user?.role === "admin" && (
                  <Link to="/admin" className="cinema-footer-link">
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="cinema-footer-heading">Help & Support</h3>

              <div className="cinema-footer-links">
                <a href="mailto:support@cinematix.com" className="cinema-footer-link">
                  Contact Us
                </a>

                <a
                  href="mailto:support@cinematix.com?subject=Cinematix%20Booking%20Help"
                  className="cinema-footer-link"
                >
                  Booking Help
                </a>

                <a
                  href="mailto:support@cinematix.com?subject=Cinematix%20Feedback"
                  className="cinema-footer-link"
                >
                  Send Feedback
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="cinema-footer-heading">Get in Touch</h3>

              <div className="cinema-footer-contact">
                <span className="cinema-footer-contact-label">
                  Email Us
                </span>

                <a
                  href="mailto:support@cinematix.com"
                  className="cinema-footer-email"
                >
                  support@cinematix.com
                </a>
              </div>

              <div className="cinema-footer-contact">
                <span className="cinema-footer-contact-label">
                  Location
                </span>
                Coimbatore, Tamil Nadu
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="cinema-footer-bottom">
            <p className="cinema-footer-copyright">
              © {year} Cinematix. All rights reserved.
              <br />
              Made for movie lovers. 🎬
            </p>

            <div className="cinema-footer-legal">
              <Link to="/">Home</Link>
              <a href="mailto:support@cinematix.com?subject=Privacy%20Policy">
                Privacy Policy
              </a>
              <a href="mailto:support@cinematix.com?subject=Terms%20of%20Service">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

