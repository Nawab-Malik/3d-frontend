// pages/AdminLogin.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, login } = useContext(AuthContext);

  useEffect(() => {
    // Redirect if already logged in as admin
    if (isAuthenticated && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginData = {
        email: email.trim().toLowerCase(),
        password,
      };

      console.log("Admin login attempt with email:", loginData.email);

      const response = await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/users/login",
        loginData
      );

      console.log("Admin login response:", response.data);

      if (response.data.success) {
        if (response.data.user.role === "admin") {
          // Use AuthContext to store admin login
          login(response.data.user, response.data.token, true);

          navigate("/admin/dashboard", { replace: true });
        } else {
          setError("Access denied. Admin privileges required.");
        }
      }
    } catch (error) {
      console.error("Admin login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
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
