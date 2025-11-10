// components/TestConnection.js
import React, { useState } from "react";
import axios from "axios";

const TestConnection = () => {
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/test/test-login"
      );
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setTestResult(
        `Error: ${error.message}\n${
          error.response?.data
            ? JSON.stringify(error.response.data)
            : "No response data"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: "admin@3dprints.com",
          password: "your_admin_password", // You need to enter the actual password here
        }
      );
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setTestResult(
        `Login Error: ${error.message}\n${
          error.response?.data
            ? JSON.stringify(error.response.data)
            : "No response data"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Test Backend Connection</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={testConnection} disabled={loading}>
          {loading ? "Testing..." : "Test Connection"}
        </button>
        <button onClick={testAdminLogin} disabled={loading}>
          {loading ? "Testing..." : "Test Admin Login"}
        </button>
      </div>
      <pre
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          overflow: "auto",
          maxHeight: "400px",
        }}
      >
        {testResult || "Click to test connection"}
      </pre>
    </div>
  );
};

export default TestConnection;
