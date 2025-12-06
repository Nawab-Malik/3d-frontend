import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Force localhost for development
const API_URL =
  window.location.hostname === "localhost"
    ? "https://3-d-backend-3pgu.vercel.app"
    : import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const api = axios.create({ baseURL: `${API_URL}/api` });

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [earnableCoupons, setEarnableCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");
  const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [couponsRes, earnableRes] = await Promise.all([
          api
            .get("/coupons/available", { headers: getAuthHeader() })
            .catch(() => ({ data: { coupons: [] } })),
          api
            .get("/coupons/earnable")
            .catch(() => ({ data: { earnableCoupons: [] } })),
        ]);
        setCoupons(couponsRes.data?.coupons || []);
        setEarnableCoupons(earnableRes.data?.earnableCoupons || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "No expiry";
  const getDiscountText = (coupon) =>
    coupon.discountType === "percentage"
      ? `£${coupon.discountValue}% OFF`
      : `£${coupon.discountValue} OFF`;

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            textAlign: "center",
            minHeight: "60vh",
          }}
        >
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "140px",
          paddingBottom: "60px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "2.5rem", color: "#333" }}>
              🎁 Coupons & Rewards
            </h1>
          </div>

          {/* How to Earn */}
          {earnableCoupons.length > 0 && (
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px",
                padding: "30px",
                marginBottom: "40px",
                color: "white",
              }}
            >
              <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
                🎯 Earn Rewards on Orders!
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {earnableCoupons.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `$${c.discountValue} OFF`}
                    </div>
                    <p style={{ marginBottom: "10px" }}>
                      {c.description || "Reward coupon"}
                    </p>
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.3)",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <strong>How to earn:</strong>
                      <p style={{ margin: "5px 0 0" }}>
                        Complete an order of ${c.minSpendToEarn || 0}+ and
                        receive a unique coupon when delivered!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Coupons */}
          <h2 style={{ marginBottom: "20px" }}>🎟️ Your Available Coupons</h2>
          {coupons.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                backgroundColor: "white",
                borderRadius: "16px",
              }}
            >
              <span style={{ fontSize: "4rem" }}>😔</span>
              <h3>No Coupons Available</h3>
              <p style={{ color: "#666" }}>Complete orders to earn rewards!</p>
              <button
                onClick={() => navigate("/products")}
                style={{
                  marginTop: "20px",
                  padding: "12px 30px",
                  backgroundColor: "#514F6E",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {coupon.isEarned && (
                    <div
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#333",
                        padding: "5px 15px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      🏆{" "}
                      {coupon.couponType === "private"
                        ? "SPECIAL GIFT"
                        : "EARNED REWARD"}
                    </div>
                  )}
                  <div
                    style={{
                      backgroundColor:
                        coupon.discountType === "percentage"
                          ? "#e74c3c"
                          : "#3498db",
                      color: "white",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                      {getDiscountText(coupon)}
                    </span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#f8f9fa",
                        border: "2px dashed #ddd",
                        borderRadius: "8px",
                        padding: "12px 15px",
                        marginBottom: "15px",
                      }}
                    >
                      <code
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "#514F6E",
                        }}
                      >
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor:
                            copiedCode === coupon.code ? "#28a745" : "#514F6E",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        {copiedCode === coupon.code ? "✓ Copied!" : "Copy"}
                      </button>
                    </div>
                    {coupon.description && (
                      <p style={{ color: "#666", marginBottom: "10px" }}>
                        {coupon.description}
                      </p>
                    )}
                    {coupon.reason && (
                      <p
                        style={{
                          color: "#007bff",
                          marginBottom: "10px",
                          fontStyle: "italic",
                        }}
                      >
                        "{coupon.reason}"
                      </p>
                    )}
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>
                      📅 Valid until: {formatDate(coupon.expiryDate)}
                    </p>
                    <button
                      onClick={() => navigate("/cart")}
                      style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginTop: "15px",
                      }}
                    >
                      Use This Coupon →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CouponsPage;
