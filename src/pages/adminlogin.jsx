// pages/AdminLogin.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("userToken");
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (token && userData?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (_) {}
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password });

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: String(email || "").trim().toLowerCase(),
          password,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        // Check if user is admin
        console.log("User role:", response.data.user.role);

        if (response.data.user.role === "admin") {
          // Store token and user data
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));

          console.log("Admin login successful, redirecting to /admin/dashboard");
          // Redirect to admin panel dashboard
          navigate("/admin/dashboard");
        } else {
          setError("Access denied. Admin privileges required.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);

      const msg = error.response?.data?.message || "Login failed. Please try again.";
      const hint =
        msg === "Invalid credentials"
          ? " If this is the admin account, visit /api/setup/setup-admin?force=1 in the backend to reset the admin password and try again."
          : "";
      setError(msg + hint);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: "20px",
          paddingTop: "140px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "30px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: "#514F6E",
              fontFamily: "Staatliches, sans-serif",
            }}
          >
            Admin Login
          </h2>

          {error && (
            <div
              style={{
                color: "#dc3545",
                marginBottom: "15px",
                textAlign: "center",
                padding: "10px",
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
                placeholder="Enter admin email"
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: loading ? "#9C98D4" : "#514F6E",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#3a3551";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#514F6E";
                }
              }}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#666",
            }}
          >
            <p>Only users with admin privileges can access this page.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
