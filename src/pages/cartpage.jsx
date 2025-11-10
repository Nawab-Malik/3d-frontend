// pages/CartPage.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const ShippingForm = ({
  shippingInfo,
  handleInputChange,
  paymentMethod,
  setPaymentMethod,
}) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      marginBottom: "20px",
    }}
  >
    <h3 style={{ marginBottom: "20px", color: "#333" }}>
      Shipping Information
    </h3>

    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}
    >
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={shippingInfo.firstName}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={shippingInfo.lastName}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
    </div>

    <div style={{ marginTop: "15px" }}>
      <label
        style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
      >
        Address
      </label>
      <input
        type="text"
        name="address"
        value={shippingInfo.address}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
        required
      />
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "15px",
        marginTop: "15px",
      }}
    >
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          City
        </label>
        <input
          type="text"
          name="city"
          value={shippingInfo.city}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          State
        </label>
        <input
          type="text"
          name="state"
          value={shippingInfo.state}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          ZIP Code
        </label>
        <input
          type="text"
          name="zipCode"
          value={shippingInfo.zipCode}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginTop: "15px",
      }}
    >
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Country
        </label>
        <input
          type="text"
          name="country"
          value={shippingInfo.country}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          required
        />
      </div>
    </div>

    <div style={{ marginTop: "15px" }}>
      <label
        style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
      >
        Payment Method
      </label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <option value="credit_card">Credit Card</option>
        <option value="debit_card">Debit Card</option>
        <option value="paypal">PayPal</option>
        <option value="cash_on_delivery">Cash on Delivery</option>
      </select>
    </div>
  </div>
);

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("userToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchCartItems = useCallback(async () => {
    try {
      const res = await api.get("/cart", { headers: getAuthHeader() });
      setCartItems(res.data.cart?.items || []);
    } catch (e) {
      console.error("Failed to fetch cart", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put(
        `/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: getAuthHeader() }
      );
      fetchCartItems();
    } catch (e) {
      console.error("Failed to update quantity", e);
      alert("Failed to update quantity.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`, { headers: getAuthHeader() });
      fetchCartItems();
    } catch (e) {
      console.error("Failed to remove item", e);
      alert("Failed to remove item from cart.");
    }
  };

  const createOrder = async () => {
    // Validate shipping info
    if (
      !shippingInfo.firstName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode ||
      !shippingInfo.country ||
      !shippingInfo.phone
    ) {
      alert("Please fill in all shipping information fields");
      return;
    }

    setIsCreatingOrder(true);
    try {
      const orderData = {
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
      };

      const res = await api.post("/orders/create", orderData, {
        headers: getAuthHeader(),
      });

      console.log("Order created:", res.data);

      // Navigate to confirmation page with order data
      navigate("/order-confirmation", {
        state: {
          order: res.data.order,
          message: res.data.message,
        },
      });
    } catch (e) {
      console.error("Failed to create order:", e);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => {
        const price = item.variation?.price || item.product?.price || 0;
        return total + price * item.quantity;
      },
      0
    );

  const calculateTax = () => calculateTotal() * 0.08; // 8% tax
  const calculateGrandTotal = () => calculateTotal() + calculateTax();

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "http://localhost:5000/uploads/default-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            paddingBottom: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
            textAlign: "center",
            minHeight: "60vh",
          }}
        >
          <h2>Loading your cart...</h2>
        </div>
        <Footer />
      </>
    );
  }

  const token = localStorage.getItem("userToken");
  if (!token) {
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
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              fontWeight: "600",
            }}
          >
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
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
          <h2 style={{ marginBottom: "20px" }}>Your Cart is Empty</h2>
          <p style={{ marginBottom: "30px", color: "#777" }}>
            Add some products to get started!
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: "12px 30px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              fontWeight: "600",
              fontSize: "1rem",
            }}
          >
            Continue Shopping
          </button>
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
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "140px",
          paddingBottom: "100px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontFamily: "Staatliches, sans-serif",
                fontSize: "3.5rem",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Shopping Cart
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem" }}>
              Review and manage your items
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: "40px",
              alignItems: "start",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  marginBottom: "25px",
                  color: "#333",
                  borderBottom: "2px solid #eee",
                  paddingBottom: "15px",
                }}
              >
                Cart Items ({cartItems.length})
              </h2>

              {cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  style={{
                    display: "flex",
                    gap: "20px",
                    padding: "20px 0",
                    borderBottom:
                      index < cartItems.length - 1 ? "1px solid #eee" : "none",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: "0 0 100px" }}>
                    <img
                      src={getImageUrl(item.product?.imageUrl)}
                      alt={item.product?.title || "Product"}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "http://localhost:5000/uploads/default-product.png";
                      }}
                    />
                  </div>

                  <div style={{ flex: "1" }}>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        color: "#333",
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.product?.title || "Unknown Product"}
                    </h3>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 12px 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.product?.description
                        ? `${item.product.description.substring(0, 60)}...`
                        : "No description available"}
                    </p>
                    
                    {/* Display variation if exists */}
                    {item.variation && (item.variation.color || item.variation.size) && (
                      <div style={{ 
                        display: "flex", 
                        gap: "10px", 
                        marginBottom: "8px",
                        flexWrap: "wrap" 
                      }}>
                        {item.variation.color && (
                          <span style={{
                            padding: "4px 10px",
                            background: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            fontWeight: "500"
                          }}>
                            Color: {item.variation.color}
                          </span>
                        )}
                        {item.variation.size && (
                          <span style={{
                            padding: "4px 10px",
                            background: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            fontWeight: "500"
                          }}>
                            Size: {item.variation.size}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p
                      style={{
                        color: "#514F6E",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      ${Number(item.variation?.price || item.product?.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "white",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      -
                    </button>

                    <span
                      style={{
                        minWidth: "40px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "white",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: "100px" }}>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#333",
                      }}
                    >
                      $
                      {Number(
                        (item.variation?.price || item.product?.price || 0) * (item.quantity || 0)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc3545",
                      fontSize: "1.2rem",
                      padding: "5px",
                    }}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                position: "sticky",
                top: "140px",
              }}
            >
              <h2
                style={{
                  marginBottom: "25px",
                  color: "black",
                  borderBottom: "2px solid #eee",
                  paddingBottom: "15px",
                  fontSize: "1.8rem",
                }}
              >
                Order Summary
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "1.1rem",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "1.1rem",
                  }}
                >
                  <span>Tax (8%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    borderTop: "2px solid #eee",
                    paddingTop: "15px",
                    color: "#514F6E",
                  }}
                >
                  <span>Grand Total:</span>
                  <span>${calculateGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <button
                  onClick={() => navigate("/products")}
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    border: "2px solid #514F6E",
                    background: "white",
                    color: "#514F6E",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#514F6E";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#514F6E";
                  }}
                >
                  Continue Shopping
                </button>
                {!showShippingForm ? (
                  <button
                    onClick={() => setShowShippingForm(true)}
                    style={{
                      padding: "15px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#28a745",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                    }}
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <>
                    <ShippingForm
                      shippingInfo={shippingInfo}
                      handleInputChange={handleInputChange}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                    />
                    <button
                      onClick={createOrder}
                      disabled={isCreatingOrder}
                      style={{
                        padding: "15px",
                        borderRadius: "8px",
                        border: "none",
                        background: isCreatingOrder ? "#ccc" : "#28a745",
                        color: "white",
                        fontWeight: "600",
                        cursor: isCreatingOrder ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                      }}
                    >
                      {isCreatingOrder ? "Creating Order..." : "Create Order"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default CartPage;
