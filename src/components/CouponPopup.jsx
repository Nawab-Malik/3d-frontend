import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Force localhost for development
const API_URL =
  window.location.hostname === "localhost"
    ? "https://3-d-backend-3pgu.vercel.app"
    : import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const CouponPopup = () => {
  const [show, setShow] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [earnableCoupons, setEarnableCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  useEffect(() => {
    const checkAndShowPopup = async () => {
      const token = getToken();
      if (!token) return; // Only show for logged-in users

      // Check if popup was shown in last 24 hours
      const lastShown = localStorage.getItem("couponPopupLastShown");
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (lastShown && now - parseInt(lastShown) < twentyFourHours) {
        return; // Don't show if shown within 24 hours
      }

      // Fetch coupons
      try {
        const [availableRes, earnableRes] = await Promise.all([
          axios
            .get(`${API_URL}/api/coupons/available`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: { coupons: [] } })),
          axios
            .get(`${API_URL}/api/coupons/earnable`)
            .catch(() => ({ data: { earnableCoupons: [] } })),
        ]);

        const availableCoupons = availableRes.data?.coupons || [];
        const earnable = earnableRes.data?.earnableCoupons || [];

        if (availableCoupons.length > 0 || earnable.length > 0) {
          setCoupons(availableCoupons);
          setEarnableCoupons(earnable);
          setShow(true);
          localStorage.setItem("couponPopupLastShown", now.toString());
        }
      } catch (error) {
        console.error("Error fetching coupons for popup:", error);
      }
    };

    // Delay popup to not interfere with page load
    const timer = setTimeout(checkAndShowPopup, 2000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleViewAll = () => {
    setShow(false);
    navigate("/coupons");
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 9999,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "0",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "hidden",
          zIndex: 10000,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "slideIn 0.4s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "25px",
            textAlign: "center",
            color: "white",
            position: "relative",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              color: "white",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎁</div>
          <h2 style={{ margin: "0 0 5px", fontSize: "1.5rem" }}>
            Special Offers For You!
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>
            {coupons.length > 0
              ? `You have ${coupons.length} coupon${
                  coupons.length > 1 ? "s" : ""
                } available!`
              : "Check out rewards you can earn!"}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", maxHeight: "400px", overflowY: "auto" }}>
          {/* Available Coupons */}
          {coupons.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  color: "#333",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🎟️ Your Coupons
              </h3>
              {coupons.slice(0, 3).map((coupon) => (
                <div
                  key={coupon._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    border: "1px dashed #ddd",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <code
                        style={{
                          backgroundColor: "#514F6E",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                        }}
                      >
                        {coupon.code}
                      </code>
                      {coupon.isEarned && (
                        <span
                          style={{
                            backgroundColor: "#ffc107",
                            color: "#333",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                          }}
                        >
                          🏆 EARNED
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#28a745",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% OFF`
                        : `$${coupon.discountValue} OFF`}
                    </p>
                    {coupon.description && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: "#666",
                          fontSize: "0.8rem",
                        }}
                      >
                        {coupon.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    style={{
                      padding: "8px 14px",
                      backgroundColor:
                        copiedCode === coupon.code ? "#28a745" : "#514F6E",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copiedCode === coupon.code ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Earnable Coupons */}
          {earnableCoupons.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  color: "#333",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🎯 Earn Rewards
              </h3>
              {earnableCoupons.slice(0, 2).map((coupon, index) => (
                <div
                  key={index}
                  style={{
                    padding: "12px 15px",
                    background:
                      "linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ffc107",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#856404",
                        fontSize: "1.1rem",
                      }}
                    >
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% OFF`
                        : `$${coupon.discountValue} OFF`}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#856404" }}>
                      On ${coupon.minSpendToEarn}+ order
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#856404",
                      fontSize: "0.85rem",
                    }}
                  >
                    Complete an order and get this coupon when delivered!
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "15px 20px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: "12px",
              border: "2px solid #514F6E",
              backgroundColor: "white",
              color: "#514F6E",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            Maybe Later
          </button>
          <button
            onClick={handleViewAll}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              backgroundColor: "#514F6E",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            View All Coupons
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default CouponPopup;
