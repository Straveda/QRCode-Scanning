import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Save token + user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsUser = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ role: "user", email: "guest@demo.com" })
    );
    navigate("/dashboard");
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-left-panel">
        <div className="brand-content">
          <h1 className="brand-title">Welcome to SMIDI Product Portal</h1>
          <p className="brand-tagline">Manage your dynamic QR inventory with ease and precision.</p>

          <ul className="feature-list">
            <li>
              <span className="feature-icon">🚀</span>
              <div className="feature-text">
                <strong>Dynamic QR Management</strong>
                <span>Easily create and update product QR codes in real-time.</span>
              </div>
            </li>
            <li>
              <span className="feature-icon">📊</span>
              <div className="feature-text">
                <strong>Intuitive Dashboard</strong>
                <span>Monitor all your products and their status at a glance.</span>
              </div>
            </li>
            <li>
              <span className="feature-icon">📱</span>
              <div className="feature-text">
                <strong>Mobile Optimized</strong>
                <span>Responsive interface designed for seamless mobile interaction.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-card">
          <h2 id="admin_login_heading">Admin Login</h2>
          <p className="subtitle">Please enter your details to access the portal.</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-loading-flex">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
