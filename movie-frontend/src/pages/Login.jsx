import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const storedData = localStorage.getItem("user");

      if (!storedData) {
        setLoading(false);
        setError("No account found. Please sign up first.");
        return;
      }

      const storedUser = JSON.parse(storedData);

      if (
        storedUser.email === email &&
        storedUser.password === password
      ) {
        // login success → set session
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("activeUser", email);

        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
      }
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* Left Panel */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">🔐</div>
            <h2>Welcome Back</h2>
            <p>
              Login to access your personal Movie Informer.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form">

            <h1 className="form-title">Login</h1>
            <p className="form-subtitle">Please enter your credentials</p>

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login →"
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* Signup */}
            <p className="signup-text">
              Don't have an account?
              <Link to="/signup"> Sign Up</Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Login; 
