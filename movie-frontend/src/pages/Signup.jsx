import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Validation ──
  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  // ── Password Strength ──
  const getPasswordStrength = () => {
    if (!password) return { label: "", level: 0 };
    if (password.length < 6) return { label: "Weak", level: 1 };
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      return { label: "Strong", level: 3 };
    if (/[A-Z]/.test(password) || /[0-9]/.test(password))
      return { label: "Medium", level: 2 };
    return { label: "Weak", level: 1 };
  };

  const strength = getPasswordStrength();

  // ── Submit ──
  const handleSignup = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = { username, email, password };
      localStorage.setItem("user", JSON.stringify(user));
      setLoading(false);
      alert("Account Created Successfully");
      navigate("/");
    }, 1000);
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">

        {/* ── Left Panel ── */}
        <div className="signup-left">
          <div className="brand">
            <div className="brand-icon">🚀</div>
            <h2>Join Us Today</h2>
            <p>
              Create your free account and unlock access to gather information about Trending Movies.
            </p>

            {/* Steps */}
            <ul className="steps">
              <li>
                <span className="step-dot">✔</span> Fill in your details
              </li>
              <li>
                <span className="step-dot">✔</span> Create a strong password
              </li>
              
            </ul>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="signup-right">
          <form onSubmit={handleSignup} className="signup-form" noValidate>

            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Sign up to get started</p>

            {/* ── Username ── */}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className={`input-wrapper ${errors.username ? "input-error" : ""}`}>
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                />
              </div>
              {errors.username && (
                <span className="error-msg">⚠️ {errors.username}</span>
              )}
            </div>

            {/* ── Email ── */}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className={`input-wrapper ${errors.email ? "input-error" : ""}`}>
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
              </div>
              {errors.email && (
                <span className="error-msg">⚠️ {errors.email}</span>
              )}
            </div>

            {/* ── Password ── */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${errors.password ? "input-error" : ""}`}>
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-msg">⚠️ {errors.password}</span>
              )}

              {/* Password Strength Bar */}
              {password && (
                <div className="strength-bar-wrapper">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill strength-${strength.level}`}
                    ></div>
                  </div>
                  <span className={`strength-label label-${strength.level}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={`input-wrapper ${errors.confirmPassword ? "input-error" : ""}`}>
                <span className="input-icon">🔑</span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-msg">⚠️ {errors.confirmPassword}</span>
              )}
            </div>

            {/* ── Submit Button ── */}
            <button
              type="submit"
              className={`signup-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>

            {/* ── Divider ── */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* ── Login Link ── */}
            <p className="login-text">
              Already have an account?
              <Link to="/"> Login</Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Signup;