/*import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 10 }}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}*/



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 35px 18px;
          background:
            radial-gradient(ellipse at top left, rgba(37, 99, 235, 0.19), transparent 45%),
            radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.10), transparent 40%),
            #070b14;
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 38px 34px;
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(96, 165, 250, 0.22);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
          animation: loginAppear 0.5s ease;
        }

        @keyframes loginAppear {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .login-logo {
          width: 58px;
          height: 58px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 17px;
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          font-size: 25px;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          margin-bottom: 14px;
        }

        .login-brand-name {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .login-brand-name span {
          color: #60a5fa;
        }

        .login-tagline {
          color: #94a3b8;
          font-size: 13px;
          margin: 9px 0 0;
          text-align: center;
        }

        .login-heading {
          font-size: 24px;
          margin: 0 0 8px;
          text-align: center;
        }

        .login-description {
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 27px;
          line-height: 1.6;
        }

        .login-field {
          margin-bottom: 19px;
        }

        .login-label {
          display: block;
          margin-bottom: 9px;
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 600;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input {
          display: block;
          width: 100%;
          height: 48px;
          padding: 0 14px;
          border: 1px solid #334155;
          border-radius: 10px;
          background: #0b1220;
          color: #f8fafc;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-input::placeholder {
          color: #64748b;
        }

        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.13);
        }

        .login-password-input {
          padding-right: 78px;
        }

        .login-toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #60a5fa;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin: 3px 0 23px;
          font-size: 12px;
        }

        .login-remember {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #cbd5e1;
          cursor: pointer;
        }

        .login-remember input {
          accent-color: #3b82f6;
          cursor: pointer;
        }

        .login-forgot {
          color: #60a5fa;
          text-decoration: none;
        }

        .login-forgot:hover,
        .login-signup a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        .login-submit {
          width: 100%;
          min-height: 49px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(100deg, #2563eb, #0284c7);
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.32);
        }

        .login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-error {
          margin: 0 0 17px;
          padding: 11px 13px;
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 9px;
          background: rgba(127, 29, 29, 0.2);
          color: #fca5a5;
          font-size: 13px;
          line-height: 1.5;
        }

        .login-signup {
          margin: 25px 0 0;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
        }

        .login-signup a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 700;
        }

        .login-divider {
          height: 1px;
          margin-top: 25px;
          background: #1e293b;
        }

        .login-footer {
          text-align: center;
          color: #64748b;
          font-size: 11px;
          margin: 18px 0 0;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 22px;
            border-radius: 18px;
          }

          .login-heading {
            font-size: 22px;
          }

          .login-options {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">▶</div>

          <h1 className="login-brand-name">
            Cinema<span>tix</span>
          </h1>

          <p className="login-tagline">
            Your next movie experience starts here.
          </p>
        </div>

        <h2 className="login-heading">Welcome Back!</h2>

        <p className="login-description">
          Sign in to discover movies and book your favourite seats.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              Password
            </label>

            <div className="login-input-wrap">
              <input
                id="login-password"
                className="login-input login-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="login-forgot"
              onClick={(e) => {
                e.preventDefault();
                setError("Password recovery is not available yet. Please contact the administrator.");
              }}
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="login-signup">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

        <div className="login-divider" />

        <p className="login-footer">
          © {new Date().getFullYear()} Cinematix · Your seat, your story.
        </p>
      </div>
    </div>
  );
}

