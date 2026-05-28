import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      console.log("Username:", username);
      console.log("Password:", password);

      const response = await fetch("http://localhost:8080/api/auth/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username: username,
          password: password
        })

      });

      const data = (await response.text()).trim();

      console.log("Response:", data);
      console.log("Response length:", data.length);

      if (data === "Login Successful") {

        console.log("✅ Login successful! Storing user data...");
        
        // Store user data under "user" key (Dashboard expects this)
        localStorage.setItem("user", JSON.stringify({ username: username }));
        
        console.log("✅ User data stored. Navigating to dashboard...");
        setLoading(false);

        // Small delay to ensure state updates
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);

      } else {

        console.error("❌ Login failed. Response:", data);
        setError("Invalid username or password.");
        setLoading(false);
      }

    } catch (error) {

      console.error("❌ Fetch error:", error);
      setLoading(false);
      setError("Backend server not running.");
    }
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

            <p className="form-subtitle">
              Please enter your credentials
            </p>

            {/* Error */}
            {error && (

              <div className="error-box">

                <span className="error-icon">⚠️</span>

                {error}

              </div>
            )}

            {/* Username */}
            <div className="input-group">

              <label>Username</label>

              <div className="input-wrapper">

                <span className="input-icon">👤</span>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}

                  onChange={(e) => {
                    setUsername(e.target.value);
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


            {/* Login Button */}
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


          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;