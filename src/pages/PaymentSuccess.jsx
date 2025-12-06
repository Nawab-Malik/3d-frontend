import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const API_URL =
  window.location.hostname === "localhost"
    ? "https://3-d-backend-3pgu.vercel.app"
    : import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("Verifying your payment...");

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const orderId = searchParams.get("order_id");

      if (!sessionId || !orderId) {
        setStatus("error");
        setMessage("Invalid payment session. Please contact support.");
        return;
      }

      try {
        const token = getToken();
        const res = await axios.post(
          `${API_URL}/api/payment/verify-payment`,
          { sessionId, orderId },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        if (res.data?.success) {
          setStatus("success");
          setOrder(res.data.order);
          setMessage("Payment successful! Your order has been confirmed.");
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Failed to verify payment. Please contact support if money was deducted."
        );
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "160px",
          paddingBottom: "100px",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {status === "verifying" && (
            <>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid #e0e0e0",
                  borderTopColor: "#514F6E",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px",
                }}
              />
              <h2 style={{ color: "#333" }}>Verifying Payment</h2>
              <p style={{ color: "#666" }}>{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#d4edda",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "3rem",
                  color: "#28a745",
                }}
              >
                ✓
              </div>
              <h2 style={{ color: "#28a745", marginBottom: "15px" }}>
                Payment Successful!
              </h2>
              <p style={{ color: "#666", marginBottom: "20px" }}>{message}</p>

              {order && (
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ margin: "5px 0", color: "#333" }}>
                    <strong>Order No:</strong> {order.orderNo}
                  </p>
                  <p style={{ margin: "5px 0", color: "#333" }}>
                    <strong>Total Paid:</strong> ${order.grandTotal?.toFixed(2)}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => navigate("/orders")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#514F6E",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate("/products")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "white",
                    color: "#514F6E",
                    border: "2px solid #514F6E",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#f8d7da",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "3rem",
                  color: "#dc3545",
                }}
              >
                ✕
              </div>
              <h2 style={{ color: "#dc3545", marginBottom: "15px" }}>
                Payment Issue
              </h2>
              <p style={{ color: "#666", marginBottom: "20px" }}>{message}</p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => navigate("/cart")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#514F6E",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Return to Cart
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "white",
                    color: "#514F6E",
                    border: "2px solid #514F6E",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Contact Support
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
