import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const API_URL =
  import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) {
      setError("Please login to view your orders");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: getAuthHeader(),
      });
      setOrders(res.data?.orders || res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#fff3cd", color: "#856404" },
      confirmed: { bg: "#d4edda", color: "#155724" },
      processing: { bg: "#cce5ff", color: "#004085" },
      shipped: { bg: "#d1ecf1", color: "#0c5460" },
      delivered: { bg: "#d4edda", color: "#155724" },
      cancelled: { bg: "#f8d7da", color: "#721c24" },
    };
    return colors[status?.toLowerCase()] || { bg: "#e9ecef", color: "#495057" };
  };

  const viewOrderDetails = (order) => {
    navigate("/order-confirmation", { state: { order } });
  };

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
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #514F6E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "20px", color: "#666" }}>
            Loading your orders...
          </p>
        </div>
        <Footer />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            textAlign: "center",
            minHeight: "60vh",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontSize: "4rem" }}>⚠️</span>
            <h2 style={{ marginTop: "20px", color: "#333" }}>{error}</h2>
            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "20px",
                padding: "12px 30px",
                backgroundColor: "#514F6E",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Go Home
            </button>
          </div>
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
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontFamily: "Staatliches, sans-serif",
                fontSize: "3rem",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              📦 My Orders
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem" }}>
              Track and manage all your orders in one place
            </p>
          </div>

          {orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "4rem",
                  display: "block",
                  marginBottom: "20px",
                }}
              >
                🛒
              </span>
              <h3 style={{ color: "#333", marginBottom: "10px" }}>
                No Orders Yet
              </h3>
              <p style={{ color: "#666", marginBottom: "20px" }}>
                You haven't placed any orders yet. Start shopping!
              </p>
              <button
                onClick={() => navigate("/products")}
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#514F6E",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {orders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                return (
                  <div
                    key={order._id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Order Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px",
                        borderBottom: "1px solid #eee",
                        flexWrap: "wrap",
                        gap: "15px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 5px",
                            color: "#514F6E",
                            fontSize: "1.2rem",
                          }}
                        >
                          Order #{order.orderNo}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            color: "#666",
                            fontSize: "0.9rem",
                          }}
                        >
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <span
                          style={{
                            padding: "6px 16px",
                            borderRadius: "20px",
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {order.status || "pending"}
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            color: "#333",
                          }}
                        >
                          ${(order.grandTotal || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          overflowX: "auto",
                          paddingBottom: "10px",
                        }}
                      >
                        {(order.items || []).slice(0, 4).map((item, idx) => (
                          <div
                            key={idx}
                            style={{ flexShrink: 0, textAlign: "center" }}
                          >
                            <img
                              src={
                                item.product?.imageUrl?.startsWith("http")
                                  ? item.product.imageUrl
                                  : `${API_URL}${
                                      item.product?.imageUrl ||
                                      "/uploads/default-product.png"
                                    }`
                              }
                              alt={item.product?.title}
                              style={{
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #eee",
                              }}
                              onError={(e) => {
                                e.target.src = `${API_URL}/uploads/default-product.png`;
                              }}
                            />
                            <p
                              style={{
                                margin: "5px 0 0",
                                fontSize: "0.75rem",
                                color: "#666",
                              }}
                            >
                              x{item.quantity}
                            </p>
                          </div>
                        ))}
                        {(order.items || []).length > 4 && (
                          <div
                            style={{
                              flexShrink: 0,
                              width: "70px",
                              height: "70px",
                              borderRadius: "8px",
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#666",
                              fontWeight: "bold",
                            }}
                          >
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>

                      {/* Order Info */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "15px",
                          paddingTop: "15px",
                          borderTop: "1px solid #eee",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            📍 {order.shippingAddress?.city || "N/A"},{" "}
                            {order.shippingAddress?.country || ""}
                          </span>
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            💳{" "}
                            {(order.paymentMethod || "card")
                              .replace(/_/g, " ")
                              .toUpperCase()}
                          </span>
                          {order.trackingNumber && (
                            <span
                              style={{ color: "#007bff", fontSize: "0.9rem" }}
                            >
                              📦 {order.trackingNumber}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => viewOrderDetails(order)}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#514F6E",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "0.9rem",
                            }}
                          >
                            View Details
                          </button>
                          {order.status === "shipped" &&
                            order.trackingNumber && (
                              <button
                                onClick={() =>
                                  navigate("/track-order", {
                                    state: {
                                      trackingNumber: order.trackingNumber,
                                    },
                                  })
                                }
                                style={{
                                  padding: "10px 20px",
                                  backgroundColor: "transparent",
                                  color: "#514F6E",
                                  border: "2px solid #514F6E",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  fontSize: "0.9rem",
                                }}
                              >
                                Track Order
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Continue Shopping */}
          {orders.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button
                onClick={() => navigate("/products")}
                style={{
                  padding: "15px 40px",
                  backgroundColor: "transparent",
                  color: "#514F6E",
                  border: "2px solid #514F6E",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;
