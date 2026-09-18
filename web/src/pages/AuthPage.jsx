import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import GlareHover from "../components/GlareHover";
import Grainient from "../components/Grainient";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import logo from "../lib/logo-removebg.png";

export default function AuthPage() {
  const location = useLocation();
  const initialMode = location.pathname.includes("register")
    ? "register"
    : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(location.pathname.includes("register") ? "register" : "login");
  }, [location.pathname]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const action = isLogin ? login(email, password) : register(email, password);
    const msgs = isLogin
      ? {
          loading: "Logging in...",
          success: "Login successful",
          error: "Invalid email or password",
        }
      : {
          loading: "Creating account...",
          success: "Account created",
          error: "Registration failed. Email might be in use.",
        };

    try {
      await toast.promise(action, msgs);
      navigate("/dashboard");
    } catch (err) {
      setError(msgs.error);
    }
  };

  const isLogin = mode === "login";

  return (
    <div
      className="auth-page-wrapper"
      style={{ position: "relative", backgroundColor: "var(--color-primary)" }}
    >
      <ErrorBoundary
        fallback={
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundColor: "var(--color-primary)",
            }}
          />
        }
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Grainient color1="#0f3d28" color2="#1e8449" color3="#a8e063" />
        </div>
      </ErrorBoundary>

      <div
        className="card auth-card"
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          width: "100%",
          maxWidth: "440px",
          padding: "32px",
          margin: 0,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <img
          src={logo}
          alt="Darukaa.Earth Logo"
          style={{
            width: "160px",
            height: "auto",
            margin: "0 auto 24px auto",
            display: "block",
          }}
        />

        {/* Toggle Slider */}
        <div
          style={{
            display: "flex",
            background: "var(--color-primary)",
            borderRadius: "9999px",
            padding: "6px",
            position: "relative",
            marginBottom: "24px",
          }}
        >
          {/* Sliding Highlight */}
          <div
            style={{
              position: "absolute",
              top: "6px",
              bottom: "6px",
              width: "calc(50% - 6px)",
              left: "6px",
              transform: isLogin ? "translateX(0)" : "translateX(100%)",
              background: "var(--color-accent-lime)",
              borderRadius: "9999px",
              transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 0,
            }}
          />

          {/* Toggle Buttons */}
          <button
            type="button"
            onClick={() => setMode("login")}
            className="auth-tab-btn"
            style={{ color: isLogin ? "var(--color-primary)" : "#B7E4C7" }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className="auth-tab-btn"
            style={{ color: !isLogin ? "var(--color-primary)" : "#B7E4C7" }}
          >
            Register
          </button>
        </div>

        {error && <div className="error-text">{error}</div>}

        {/* Form Container */}
        <div style={{ transition: "opacity 0.3s ease", opacity: 1 }}>
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "15px", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  minHeight: "44px",
                  fontSize: "16px",
                  padding: "12px 16px",
                }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "15px", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    minHeight: "44px",
                    fontSize: "16px",
                    padding: "12px 48px 12px 16px",
                    width: "100%",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "15px", marginBottom: "8px" }}>
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                      minHeight: "44px",
                      fontSize: "16px",
                      padding: "12px 48px 12px 16px",
                      width: "100%",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-text-muted)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <GlareHover style={{ width: "100%" }}>
              <button
                type="submit"
                className="btn"
                style={{ width: "100%", minHeight: "48px", fontSize: "16px" }}
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </GlareHover>
          </form>
        </div>
      </div>
    </div>
  );
}
