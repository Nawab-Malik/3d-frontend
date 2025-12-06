import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const API_URL =
  window.location.hostname === "localhost"
    ? "https://3-d-backend-3pgu.vercel.app"
    : import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (orderId) {
      // Cancel the order in backend
      axios
        .post(`${API_URL}/api/payment/cancel-payment`, { orderId })
        .catch((err) => console.error("Error cancelling order:", err));
    }
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
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#fff3cd",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "3rem",
            }}
          >
            ⚠️
          </div>

          <h2 style={{ color: "#856404", marginBottom: "15px" }}>
            Payment Cancelled
          </h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Your payment was cancelled. No charges were made.
            <br />
            Your cart items are still saved.
          </p>

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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCancel;
