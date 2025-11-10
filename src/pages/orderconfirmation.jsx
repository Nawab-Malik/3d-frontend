// pages/OrderConfirmation.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, message } = location.state || {};

  if (!order) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
            paddingTop: "160px",
            textAlign: "center",
            minHeight: "60vh",
          }}
        >
          <h2>Order Not Found</h2>
          <p>We couldn't find your order details.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Go Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate estimated delivery date (3-5 business days)
  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
              <p style={{ color: "#28a745", fontWeight: "bold" }}>{message}</p>
            )}
          </div>

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
                  <span>{formatDate(order.createdAt || new Date())}</span>
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
                      backgroundColor: "#ffc107",
                      color: "#000",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    {order.status || "Processing"}
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
                  <span>
                    {getEstimatedDelivery(order.createdAt || new Date())}
                  </span>
                </div>
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
                  <span>${order.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span>Tax:</span>
                  <span>${order.tax?.toFixed(2) || "0.00"}</span>
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
                    ${order.grandTotal?.toFixed(2) || "0.00"}
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

              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ marginBottom: "15px", color: "#514F6E" }}>
                  Delivery Address
                </h3>
                <p style={{ lineHeight: "1.6" }}>
                  {order.shippingAddress?.firstName}{" "}
                  {order.shippingAddress?.lastName}
                  <br />
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zipCode}
                  <br />
                  {order.shippingAddress?.country}
                  <br />
                  📞 {order.shippingAddress?.phone}
                </p>
              </div>

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
                    {order.paymentMethod
                      ? order.paymentMethod.replace("_", " ").toUpperCase()
                      : "CREDIT CARD"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
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

            {order.items && order.items.length > 0 ? (
              <div>
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
                            : `http://localhost:5000${item.product?.imageUrl}`
                        }
                        alt={item.product?.title}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "http://localhost:5000/uploads/default-product.png";
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
                        {item.total?.toFixed(2) ||
                          (item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items in this order.</p>
            )}
          </div>

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

            <button
              onClick={() => navigate("/")}
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
              Go to Homepage
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
            <p style={{ fontWeight: "bold" }}>
              📧 support@3dprints.com | 📞 1-800-3DPRINT
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
