
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <style>{`
        .register-page,
        .register-page * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 16px;
          background:
            radial-gradient(ellipse at top left, rgba(37,99,235,.2), transparent 45%),
            radial-gradient(ellipse at bottom right, rgba(6,182,212,.12), transparent 40%),
            #070b14;
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
        }

        .register-card {
          width: 100%;
          max-width: 440px;
          padding: 35px;
          border-radius: 22px;
          background: rgba(15,23,42,.95);
          border: 1px solid rgba(96,165,250,.24);
          box-shadow: 0 25px 80px rgba(0,0,0,.4);
        }

        .register-brand {
          text-align: center;
          margin-bottom: 25px;
        }

        .register-logo {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          border-radius: 16px;
          background: linear-gradient(135deg,#2563eb,#06b6d4);
          color: white;
          font-size: 24px;
          box-shadow: 0 8px 25px rgba(37,99,235,.3);
        }

        .register-brand h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -.8px;
        }

        .register-brand h1 span {
          color: #60a5fa;
        }

        .register-tagline {
          margin: 9px 0 0;
          color: #94a3b8;
          font-size: 13px;
        }

        .register-heading {
          margin: 0 0 8px;
          text-align: center;
          font-size: 24px;
        }

        .register-description {
          margin: 0 0 25px;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .register-field {
          margin-bottom: 17px;
        }

        .register-label {
          display: block;
          margin-bottom: 8px;
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 600;
        }

        .register-input {
          display: block;
          width: 100%;
          height: 47px;
          padding: 0 13px;
          border: 1px solid #334155;
          border-radius: 10px;
          background: #0b1220;
          color: #f8fafc;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }

        .register-input::placeholder {
          color: #64748b;
        }

        .register-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,.13);
        }

        .register-password-wrap {
          position: relative;
        }

        .register-password-input {
          padding-right: 75px;
        }

        .register-show-password {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .register-submit {
          width: 100%;
          min-height: 49px;
          margin-top: 5px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(100deg,#2563eb,#0284c7);
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .2s, opacity .2s;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .register-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .register-error {
          margin-bottom: 16px;
          padding: 11px 13px;
          border: 1px solid rgba(248,113,113,.3);
          border-radius: 9px;
          background: rgba(127,29,29,.2);
          color: #fca5a5;
          font-size: 13px;
          line-height: 1.5;
        }

        .register-login {
          margin: 23px 0 0;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
        }

        .register-login a {
          color: #60a5fa;
          font-weight: 700;
          text-decoration: none;
        }

        .register-login a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        .register-footer {
          margin: 20px 0 0;
          text-align: center;
          color: #64748b;
          font-size: 11px;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 28px 21px;
          }

          .register-heading {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="register-card">
        <div className="register-brand">
          <div className="register-logo">▶</div>
          <h1>Cinema<span>tix</span></h1>
          <p className="register-tagline">
            Your next movie experience starts here.
          </p>
        </div>

        <h2 className="register-heading">Create Your Account</h2>

        <p className="register-description">
          Join Cinematix and book your favourite movie seats.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label className="register-label" htmlFor="register-name">
              Full Name
            </label>
            <input
              id="register-name"
              className="register-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={80}
              required
            />
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="register-email">
              Email Address
            </label>
            <input
              id="register-email"
              className="register-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="register-password">
              Password
            </label>
            <div className="register-password-wrap">
              <input
                id="register-password"
                className="register-input register-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="register-show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="register-confirm">
              Confirm Password
            </label>
            <input
              id="register-confirm"
              className="register-input"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="register-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="register-login">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>

        <p className="register-footer">
          © {new Date().getFullYear()} Cinematix · Your seat, your story.
        </p>
      </div>
    </div>
  );
}

