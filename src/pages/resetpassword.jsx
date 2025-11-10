import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing reset token.");
    }
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/reset-password", {
        token,
        password,
      });
      setMessage(res.data?.message || "Password has been reset.");
      setTimeout(() => navigate("/"), 1500);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "160px", paddingLeft: 20, paddingRight: 20, minHeight: "60vh" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: 10 }}>Reset Password</h2>
          {email && <p style={{ color: "#666", marginBottom: 16 }}>for {email}</p>}
          {error && (
            <div style={{ background: "#f8d7da", color: "#721c24", padding: 10, borderRadius: 6, marginBottom: 12 }}>{error}</div>
          )}
          {message && (
            <div style={{ background: "#d4edda", color: "#155724", padding: 10, borderRadius: 6, marginBottom: 12 }}>{message}</div>
          )}
          <form onSubmit={submit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            </div>
            <button type="submit" disabled={loading || !token} style={{ width: "100%", padding: 12, background: "#514F6E", color: "white", border: "none", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer", fontWeight: 600 }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
