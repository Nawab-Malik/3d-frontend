import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const API_URL =
  import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

const OrderConfirmationPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State from navigation (COD or PayPal)
  const stateOrder = location.state?.order;
  const stateMessage = location.state?.message;

  const [order, setOrder] = useState(stateOrder || null);
  const [message, setMessage] = useState(stateMessage || "");
  const [loading, setLoading] = useState(!stateOrder);
  const [error, setError] = useState(null);

  // Get params from Stripe redirect
  const sessionId = searchParams.get("session_id");
  const orderIdFromUrl = searchParams.get("order_id");

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    // If we have order from state (COD/PayPal), no need to fetch
    if (stateOrder) {
      setLoading(false);
      return;
    }

    const fetchOrderAndVerify = async () => {
      setLoading(true);
      setError(null);

      try {
        // If coming from Stripe redirect with session_id
        if (sessionId) {
          console.log("Verifying Stripe session:", sessionId);

          // First, verify the payment
          try {
            const verifyRes = await api.post(
              "/payment/verify",
              { sessionId },
              { headers: getAuthHeader() }
            );

            console.log("Verify response:", verifyRes.data);

            if (
              verifyRes.data.success &&
              verifyRes.data.paymentStatus === "paid"
            ) {
              setMessage(
                "🎉 Payment successful! Your order has been confirmed."
              );
            } else {
              setMessage("Your payment is being processed.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            // Continue anyway - payment might still be successful
            setMessage("Thank you for your order!");
          }
        }

        // Fetch order details if we have an order ID
        const orderId = orderIdFromUrl;
        if (orderId) {
          console.log("Fetching order:", orderId);

          try {
            const orderRes = await api.get(`/orders/${orderId}`, {
              headers: getAuthHeader(),
            });

            if (orderRes.data?.order) {
              setOrder(orderRes.data.order);
            } else if (orderRes.data && orderRes.data._id) {
              setOrder(orderRes.data);
            }
          } catch (orderErr) {
            console.error("Order fetch error:", orderErr);
            // Don't show error if we have session - payment was successful
            if (!sessionId) {
              setError("Could not load order details.");
            }
          }
        }

        // If we have session but no order, still show success
        if (sessionId && !orderIdFromUrl) {
          setMessage("Payment successful! Check your email for order details.");
        }
      } catch (err) {
        console.error("Error:", err);
        if (!sessionId) {
          setError("Something went wrong. Please check your orders page.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndVerify();
  }, [sessionId, orderIdFromUrl, stateOrder]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            paddingBottom: "100px",
            minHeight: "60vh",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #514F6E",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <h2>Processing your order...</h2>
            <p style={{ color: "#666" }}>
              Please wait while we confirm your payment.
            </p>
          </div>
        </div>
        <Footer />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  // Determine if we should show success
  const showSuccess = order || sessionId || stateOrder;

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "160px",
          paddingBottom: "100px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "60vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          {error && !showSuccess ? (
            <>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>⚠️</div>
              <h1 style={{ color: "#dc3545", marginBottom: "20px" }}>
                Something Went Wrong
              </h1>
              <p style={{ color: "#666", marginBottom: "30px" }}>{error}</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
              <h1 style={{ color: "#28a745", marginBottom: "20px" }}>
                Order Confirmed!
              </h1>
              <p
                style={{
                  color: "#666",
                  marginBottom: "30px",
                  fontSize: "1.1rem",
                }}
              >
                {message || "Thank you for your order!"}
              </p>
            </>
          )}

          {order && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "25px",
                marginBottom: "30px",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#333",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                }}
              >
                Order Details
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <strong>Order Number:</strong>
                  <p
                    style={{
                      color: "#514F6E",
                      fontWeight: "bold",
                      margin: "5px 0",
                    }}
                  >
                    {order.orderNo}
                  </p>
                </div>
                <div>
                  <strong>Order Status:</strong>
                  <p style={{ margin: "5px 0" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor:
                          order.status === "confirmed" ||
                          order.paymentStatus === "paid"
                            ? "#d4edda"
                            : "#fff3cd",
                        color:
                          order.status === "confirmed" ||
                          order.paymentStatus === "paid"
                            ? "#155724"
                            : "#856404",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {(order.status || "processing").charAt(0).toUpperCase() +
                        (order.status || "processing").slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div
                  style={{
                    backgroundColor: "#e7f3ff",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <strong>📦 Tracking Information:</strong>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Tracking Number:</strong>{" "}
                    <span style={{ color: "#007bff", fontFamily: "monospace" }}>
                      {order.trackingNumber}
                    </span>
                  </p>
                  {order.courierName && (
                    <p style={{ margin: "5px 0" }}>
                      <strong>Courier:</strong> {order.courierName}
                    </p>
                  )}
                  {order.estimatedDelivery && (
                    <p style={{ margin: "5px 0" }}>
                      <strong>Estimated Delivery:</strong>{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <strong>Items Ordered:</strong>
                  <div style={{ marginTop: "10px" }}>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom:
                            index < order.items.length - 1
                              ? "1px solid #eee"
                              : "none",
                        }}
                      >
                        <span>
                          {item.product?.title || "Product"} × {item.quantity}
                        </span>
                        <span style={{ fontWeight: "500" }}>
                          $
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div style={{ borderTop: "2px solid #ddd", paddingTop: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>${(order.subtotal || 0).toFixed(2)}</span>
                </div>
                {order.tax > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span>Tax:</span>
                    <span>${(order.tax || 0).toFixed(2)}</span>
                  </div>
                )}
                {order.shippingCost > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span>Shipping:</span>
                    <span>${(order.shippingCost || 0).toFixed(2)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      color: "#28a745",
                    }}
                  >
                    <span>Discount:</span>
                    <span>-${(order.discount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginTop: "10px",
                    paddingTop: "10px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: "#514F6E" }}>
                    ${(order.grandTotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <strong>Shipping Address:</strong>
                  <p
                    style={{
                      margin: "10px 0",
                      color: "#666",
                      lineHeight: "1.6",
                    }}
                  >
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode ||
                      order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                    <br />
                    {order.shippingAddress.phone && (
                      <>📞 {order.shippingAddress.phone}</>
                    )}
                  </p>
                </div>
              )}

              {/* Payment Method */}
              <div style={{ marginTop: "15px" }}>
                <strong>Payment Method:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {(order.paymentMethod || "card").replace(/_/g, " ")}
                </span>
                {order.paymentStatus === "paid" && (
                  <span style={{ marginLeft: "10px", color: "#28a745" }}>
                    ✓ Paid
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/orders")}
              style={{
                padding: "12px 30px",
                borderRadius: "8px",
                border: "2px solid #514F6E",
                background: "white",
                color: "#514F6E",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "12px 30px",
                borderRadius: "8px",
                border: "none",
                background: "#514F6E",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
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

export default OrderConfirmationPage;
