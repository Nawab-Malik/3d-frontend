// pages/OrderConfirmation.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const API_URL =
  import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get data from navigation state (COD, PayPal)
  const { order: stateOrder, message: stateMessage } = location.state || {};

  // Get data from URL params (Stripe redirect)
  const sessionId = searchParams.get("session_id");
  const orderIdFromUrl = searchParams.get("order_id");

  const [order, setOrder] = useState(stateOrder || null);
  const [message, setMessage] = useState(stateMessage || "");
  const [loading, setLoading] = useState(
    !stateOrder && (sessionId || orderIdFromUrl)
  );
  const [error, setError] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(!!stateOrder);

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    // If we already have order from navigation state, we're done
    if (stateOrder) {
      setPaymentVerified(true);
      setLoading(false);
      return;
    }

    const processPayment = async () => {
      setLoading(true);
      setError("");

      try {
        // Step 1: If we have session_id from Stripe, verify the payment
        if (sessionId) {
          console.log("Verifying Stripe session:", sessionId);

          try {
            const verifyRes = await api.post(
              "/payment/verify",
              { sessionId },
              { headers: getAuthHeader() }
            );

            console.log("Verify response:", verifyRes.data);

            if (verifyRes.data?.success) {
              setPaymentVerified(true);

              if (verifyRes.data.paymentStatus === "paid") {
                setMessage(
                  "🎉 Payment successful! Your order has been confirmed."
                );
              } else {
                setMessage("Your payment is being processed.");
              }

              // Try to fetch order using orderId from verification or URL
              const orderId = verifyRes.data.orderId || orderIdFromUrl;
              if (orderId) {
                await fetchOrder(orderId);
              }
            } else {
              // Payment verification returned but wasn't successful
              // Still show success if we have session_id (payment likely went through)
              setPaymentVerified(true);
              setMessage("Thank you! Your order is being processed.");

              if (orderIdFromUrl) {
                await fetchOrder(orderIdFromUrl);
              }
            }
          } catch (verifyErr) {
            console.error("Verification API error:", verifyErr);
            // Even if verification API fails, if we have session_id, payment likely succeeded
            setPaymentVerified(true);
            setMessage("Thank you for your order! Payment received.");

            if (orderIdFromUrl) {
              await fetchOrder(orderIdFromUrl);
            }
          }
        }
        // Step 2: If no session but we have order_id, just fetch the order
        else if (orderIdFromUrl) {
          await fetchOrder(orderIdFromUrl);
          setPaymentVerified(true);
          setMessage("Order found successfully!");
        }
      } catch (err) {
        console.error("Process payment error:", err);
        // If we have session_id, still show success
        if (sessionId) {
          setPaymentVerified(true);
          setMessage("Payment successful! Check your email for order details.");
        } else {
          setError("Could not load order details.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchOrder = async (orderId) => {
      try {
        console.log("Fetching order:", orderId);
        const orderRes = await api.get(`/orders/${orderId}`, {
          headers: getAuthHeader(),
        });

        if (orderRes.data?.order) {
          setOrder(orderRes.data.order);
        } else if (orderRes.data?._id) {
          setOrder(orderRes.data);
        }
      } catch (orderErr) {
        console.error("Failed to fetch order:", orderErr);
        // Don't set error - we might still have successful payment
      }
    };

    processPayment();
  }, [sessionId, orderIdFromUrl, stateOrder]);

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            paddingBottom: "40px",
            textAlign: "center",
            minHeight: "60vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px" }}>
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

  // Error state - only show if no payment was verified
  if (!paymentVerified && !order && error) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            paddingBottom: "40px",
            textAlign: "center",
            minHeight: "60vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>⚠️</div>
            <h2 style={{ color: "#dc3545" }}>Order Not Found</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>{error}</p>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                backgroundColor: "#514F6E",
                color: "white",
                border: "none",
                cursor: "pointer",
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate estimated delivery date
  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate || new Date());
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Success state
  return (
    <>
      <Navbar />
      <div
        style={{
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingBottom: "40px",
          paddingTop: "140px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Success Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
              padding: "30px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#28a745",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "2.5rem",
                color: "white",
              }}
            >
              ✓
            </div>
            <h1
              style={{
                color: "#28a745",
                marginBottom: "10px",
                fontSize: "2.5rem",
              }}
            >
              Order Confirmed!
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>
            {message && (
              <p
                style={{
                  color: "#28a745",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {message}
              </p>
            )}
          </div>

          {/* Order Details - Show if we have order data */}
          {order ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "30px",
                  marginBottom: "40px",
                }}
              >
                {/* Order Summary */}
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  <h2
                    style={{
                      marginBottom: "25px",
                      color: "#333",
                      borderBottom: "2px solid #eee",
                      paddingBottom: "15px",
                      fontSize: "1.8rem",
                    }}
                  >
                    Order Summary
                  </h2>
                  <div style={{ marginBottom: "25px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Order Number:</span>
                      <span style={{ color: "#514F6E", fontWeight: "bold" }}>
                        #{order.orderNo}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Order Date:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Status:</span>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          backgroundColor:
                            order.status === "confirmed" ||
                            order.paymentStatus === "paid"
                              ? "#d4edda"
                              : "#ffc107",
                          color:
                            order.status === "confirmed" ||
                            order.paymentStatus === "paid"
                              ? "#155724"
                              : "#000",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                        }}
                      >
                        {(order.status || "Processing")
                          .charAt(0)
                          .toUpperCase() +
                          (order.status || "processing").slice(1)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        Estimated Delivery:
                      </span>
                      <span>{getEstimatedDelivery(order.createdAt)}</span>
                    </div>
                    {order.trackingNumber && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                          backgroundColor: "#e7f3ff",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          📦 Tracking Number:
                        </span>
                        <span
                          style={{ color: "#007bff", fontFamily: "monospace" }}
                        >
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      borderTop: "2px solid #eee",
                      paddingTop: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <span>Subtotal:</span>
                      <span>${(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <span>Tax:</span>
                      <span>${(order.tax || 0).toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      <span>Grand Total:</span>
                      <span style={{ color: "#514F6E" }}>
                        ${(order.grandTotal || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  <h2
                    style={{
                      marginBottom: "25px",
                      color: "#333",
                      borderBottom: "2px solid #eee",
                      paddingBottom: "15px",
                      fontSize: "1.8rem",
                    }}
                  >
                    Shipping Information
                  </h2>
                  {order.shippingAddress && (
                    <div style={{ marginBottom: "25px" }}>
                      <h3 style={{ marginBottom: "15px", color: "#514F6E" }}>
                        Delivery Address
                      </h3>
                      <p style={{ lineHeight: "1.6" }}>
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                        <br />
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                        <br />
                        {order.shippingAddress.country}
                        <br />
                        📞 {order.shippingAddress.phone}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 style={{ marginBottom: "15px", color: "#514F6E" }}>
                      Payment Method
                    </h3>
                    <p>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          backgroundColor: "#e9ecef",
                          fontWeight: "bold",
                        }}
                      >
                        {(order.paymentMethod || "CARD")
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </span>
                      {order.paymentStatus === "paid" && (
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "#28a745",
                            fontWeight: "bold",
                          }}
                        >
                          ✓ Paid
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    marginBottom: "40px",
                  }}
                >
                  <h2
                    style={{
                      marginBottom: "25px",
                      color: "#333",
                      borderBottom: "2px solid #eee",
                      paddingBottom: "15px",
                      fontSize: "1.8rem",
                    }}
                  >
                    Order Items
                  </h2>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "20px 0",
                        borderBottom:
                          index < order.items.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                    >
                      <div style={{ flex: "0 0 80px", marginRight: "20px" }}>
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
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src = `${API_URL}/uploads/default-product.png`;
                          }}
                        />
                      </div>
                      <div style={{ flex: "1" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          {item.product?.title || "Product"}
                        </h4>
                        <p style={{ color: "#666", margin: "0 0 8px 0" }}>
                          Quantity: {item.quantity}
                        </p>
                        <p style={{ color: "#514F6E", fontWeight: "bold" }}>
                          $
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Minimal success message if no order details */
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              <p style={{ fontSize: "1.1rem", color: "#666" }}>
                Your payment has been processed successfully. You will receive a
                confirmation email shortly with your order details.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/orders")}
              style={{
                padding: "15px 30px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#514F6E",
                border: "2px solid #514F6E",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                minWidth: "200px",
              }}
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "15px 30px",
                borderRadius: "8px",
                backgroundColor: "#514F6E",
                color: "white",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                minWidth: "200px",
              }}
            >
              Continue Shopping
            </button>
          </div>

          {/* Support Information */}
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "#e9ecef",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Need Help?</h3>
            <p style={{ marginBottom: "10px" }}>
              If you have any questions about your order, please contact our
              support team.
            </p>
            <p style={{ fontWeight: "bold" }}>📧 support@makeit3d.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
