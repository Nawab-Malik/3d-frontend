// pages/CartPage.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Use environment variable for API URL
const API_URL =
  import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const api = axios.create({
  baseURL: `${API_URL}/api`,
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
        <option value="stripe">Credit/Debit Card (Stripe)</option>
        {/* <option value="paypal">PayPal</option> */}
        <option value="cod">Cash on Delivery</option>
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
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);

  // NEW: Referral balance states
  const [referralBalance, setReferralBalance] = useState(0);
  const [useReferralBalance, setUseReferralBalance] = useState(false);
  const [referralAmountToUse, setReferralAmountToUse] = useState(0);

  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch available coupons for the user
  const fetchAvailableCoupons = useCallback(async () => {
    try {
      const res = await api.get("/coupons/available", {
        headers: getAuthHeader(),
      });
      if (res.data?.coupons) {
        setAvailableCoupons(res.data.coupons);
      }
    } catch (e) {
      console.log("No available coupons or error fetching:", e);
    }
  }, []);

  // NEW: Fetch referral balance
  const fetchReferralBalance = useCallback(async () => {
    try {
      const res = await api.get("/referrals/my-referrals", {
        headers: getAuthHeader(),
      });
      if (res.data?.totalEarnings) {
        setReferralBalance(res.data.totalEarnings);
      }
    } catch (e) {
      console.log("No referral balance or error:", e);
    }
  }, []);

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
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCartItems();
    fetchAvailableCoupons();
    fetchReferralBalance(); // NEW: Fetch referral balance
  }, [fetchCartItems, fetchAvailableCoupons, fetchReferralBalance]);

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await api.post(
        "/coupons/validate",
        {
          code: couponCode.trim().toUpperCase(),
          orderTotal: calculateTotal(),
        },
        { headers: getAuthHeader() }
      );

      if (res.data?.success && res.data?.coupon) {
        setAppliedCoupon(res.data.coupon);
        setCouponError("");
        setCouponCode("");
      } else {
        setCouponError(res.data?.message || "Invalid coupon code");
      }
    } catch (e) {
      console.error("Failed to apply coupon:", e);
      setCouponError(e.response?.data?.message || "Invalid or expired coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Apply coupon from available list
  const applyAvailableCoupon = (coupon) => {
    setCouponCode(coupon.code);
    setAppliedCoupon(coupon);
    setCouponError("");
  };

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

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateTotal();

    if (appliedCoupon.discountType === "percentage") {
      return (subtotal * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === "fixed") {
      return Math.min(appliedCoupon.discountValue, subtotal);
    } else if (appliedCoupon.discountType === "free_shipping") {
      return 0; // Shipping discount handled separately
    }

    return 0;
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.variation?.price || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);

  const calculateTax = () => (calculateTotal() - calculateDiscount()) * 0.08;
  const calculateGrandTotal = () => {
    const subtotal = calculateTotal();
    const couponDiscount = calculateDiscount();
    const referralDiscount = calculateReferralDiscount();
    const taxableAmount = subtotal - couponDiscount - referralDiscount;
    const tax = taxableAmount * 0.08;
    return Math.max(0, taxableAmount + tax);
  };

  // NEW: Calculate referral discount
  const calculateReferralDiscount = () => {
    if (!useReferralBalance) return 0;
    return referralAmountToUse;
  };

  const startStripeCheckout = async (order) => {
    try {
      const items = (order.items || []).map((item) => ({
        name: item.product?.title || "Product",
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.product?.imageUrl
          ? item.product.imageUrl.startsWith("http")
            ? item.product.imageUrl
            : `${API_URL}${item.product.imageUrl}`
          : undefined,
      }));

      const orderData = {
        items,
        subtotal: order.subtotal,
        discount: order.discount || 0,
        shippingCost: order.shippingCost || 0,
        tax: order.tax,
        grandTotal: order.grandTotal,
        couponCode: order.couponCode,
        shippingAddress: order.shippingAddress,
        orderNo: order.orderNo,
        orderId: order._id,
      };

      const response = await api.post(
        "/payment/create-checkout",
        { orderData },
        { headers: getAuthHeader() }
      );

      if (response.data?.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert(response.data?.message || "Unable to start card payment.");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert(error.response?.data?.message || "Failed to start card payment.");
    }
  };

  const createOrder = async () => {
    // ...existing validation...
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

    const grandTotal = calculateGrandTotal();
    const isCardPayment =
      paymentMethod === "stripe" || paymentMethod === "paypal";

    if (isCardPayment) {
      const confirmed = window.confirm(
        `Your total amount (including tax) is $${grandTotal.toFixed(
          2
        )}. Do you want to proceed with card payment?`
      );
      if (!confirmed) return;
    }

    setIsCreatingOrder(true);
    try {
      const orderData = {
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon?.code || null,
        discount: calculateDiscount(),
        // NEW: Add referral balance usage
        useReferralBalance: useReferralBalance,
        referralAmountUsed: referralAmountToUse,
        // NEW: Mark payment status based on payment method
        paymentStatus: isCardPayment ? "pending" : "pending",
      };

      const res = await api.post("/orders/create", orderData, {
        headers: getAuthHeader(),
      });

      const createdOrder = res.data?.order;

      if (!createdOrder) {
        alert("Order could not be created. Please try again.");
        return;
      }

      // For Cash on Delivery - navigate directly to confirmation
      if (paymentMethod === "cash_on_delivery") {
        navigate("/order-confirmation", {
          state: {
            order: createdOrder,
            message:
              res.data?.message ||
              "Order created successfully with Cash on Delivery.",
          },
        });
        return;
      }

      // For Card Payment - redirect to Stripe, DON'T navigate to confirmation yet
      if (isCardPayment) {
        // Start Stripe checkout - user will be redirected back after payment
        await startStripeCheckout(createdOrder);
        // Don't navigate here - Stripe will redirect to success/cancel URL
        return;
      }

      // For other payment methods
      navigate("/order-confirmation", {
        state: { order: createdOrder, message: res.data?.message },
      });
    } catch (e) {
      console.error("Failed to create order:", e);
      alert(
        e.response?.data?.message || "Failed to create order. Please try again."
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `${API_URL}/uploads/default-product.png`;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  const handleReferralToggle = (checked) => {
    setUseReferralBalance(checked);
    if (checked) {
      const maxUsable = Math.min(
        referralBalance,
        calculateTotal() - calculateDiscount()
      );
      setReferralAmountToUse(maxUsable);
    } else {
      setReferralAmountToUse(0);
    }
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
          <h2>Loading your cart...</h2>
        </div>
        <Footer />
      </>
    );
  }

  const token = getToken();
  if (!token) {
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
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              cursor: "pointer",
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
            paddingTop: "160px",
            textAlign: "center",
            minHeight: "60vh",
          }}
        >
          <h2>Your Cart is Empty</h2>
          <button
            onClick={() => navigate("/products")}
            style={{
              marginTop: "20px",
              padding: "12px 30px",
              borderRadius: "8px",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              cursor: "pointer",
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
              }}
            >
              Shopping Cart
            </h1>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* Cart Items Section */}
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
                  <img
                    src={getImageUrl(item.product?.imageUrl)}
                    alt={item.product?.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = `${API_URL}/uploads/default-product.png`;
                    }}
                  />
                  <div style={{ flex: "1" }}>
                    <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
                      {item.product?.title || "Product"}
                    </h3>
                    <p style={{ color: "#514F6E", fontWeight: "bold" }}>
                      £
                      {Number(
                        item.variation?.price || item.product?.price || 0
                      ).toFixed(2)}
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
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
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
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p
                    style={{
                      fontWeight: "bold",
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    £
                    {(
                      (item.variation?.price || item.product?.price || 0) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc3545",
                      fontSize: "1.2rem",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
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

              {/* Available Coupons Dropdown */}
              {availableCoupons.length > 0 && !appliedCoupon && (
                <div style={{ marginBottom: "20px" }}>
                  <div
                    onClick={() => setShowCouponDropdown(!showCouponDropdown)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 15px",
                      backgroundColor: "#fff3cd",
                      borderRadius: "8px",
                      border: "1px solid #ffc107",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>🎁</span>
                      <div>
                        <strong style={{ color: "#856404" }}>
                          You have {availableCoupons.length} coupon
                          {availableCoupons.length > 1 ? "s" : ""} available!
                        </strong>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "#856404",
                            margin: "2px 0 0",
                          }}
                        >
                          Click to view & apply
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "1.2rem",
                        transform: showCouponDropdown
                          ? "rotate(180deg)"
                          : "rotate(0)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      ▼
                    </span>
                  </div>

                  {/* Dropdown Content */}
                  {showCouponDropdown && (
                    <div
                      style={{
                        marginTop: "8px",
                        backgroundColor: "#fffbe6",
                        borderRadius: "8px",
                        border: "1px solid #ffc107",
                        overflow: "hidden",
                      }}
                    >
                      {availableCoupons.map((coupon, index) => (
                        <div
                          key={coupon._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 15px",
                            backgroundColor:
                              index % 2 === 0 ? "white" : "#fffbe6",
                            borderBottom:
                              index < availableCoupons.length - 1
                                ? "1px solid #f0e68c"
                                : "none",
                          }}
                        >
                          <div style={{ flex: 1 }}>
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
                                  fontSize: "0.9rem",
                                  letterSpacing: "1px",
                                }}
                              >
                                {coupon.code}
                              </code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(coupon.code);
                                  alert(
                                    `Coupon code "${coupon.code}" copied to clipboard!`
                                  );
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                  color: "#666",
                                  padding: "2px 6px",
                                }}
                                title="Copy code"
                              >
                                📋
                              </button>
                            </div>
                            <p
                              style={{
                                fontSize: "0.85rem",
                                color: "#28a745",
                                margin: "0",
                                fontWeight: "600",
                              }}
                            >
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}% OFF`
                                : coupon.discountType === "fixed"
                                ? `$${coupon.discountValue} OFF`
                                : "FREE SHIPPING"}
                            </p>
                            {coupon.minOrderAmount > 0 && (
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#666",
                                  margin: "2px 0 0",
                                }}
                              >
                                Min. order: ${coupon.minOrderAmount}
                              </p>
                            )}
                            {coupon.description && (
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#888",
                                  margin: "2px 0 0",
                                  fontStyle: "italic",
                                }}
                              >
                                {coupon.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              applyAvailableCoupon(coupon);
                              setShowCouponDropdown(false);
                            }}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              transition: "background 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#218838")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#28a745")
                            }
                          >
                            Apply
                          </button>
                        </div>
                      ))}

                      {/* View All Coupons Link - Add this at the bottom */}
                      <div
                        onClick={() => navigate("/coupons")}
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#fff8e1",
                          borderTop: "1px solid #ffc107",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffecb3")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff8e1")
                        }
                      >
                        <span
                          style={{
                            color: "#514F6E",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          🎁 View All Coupons →
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Coupon Input Section */}
              {!appliedCoupon ? (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Have a coupon code?
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                      }}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#514F6E",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: couponLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "0.85rem",
                        marginTop: "8px",
                      }}
                    >
                      {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "15px",
                    backgroundColor: "#d4edda",
                    borderRadius: "8px",
                    border: "1px solid #28a745",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>🎉</span>
                        <strong style={{ color: "#155724" }}>
                          Coupon Applied!
                        </strong>
                      </div>
                      <p
                        style={{
                          color: "#155724",
                          margin: "5px 0 0",
                          fontSize: "0.9rem",
                        }}
                      >
                        <code
                          style={{
                            backgroundColor: "#c3e6cb",
                            padding: "2px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {appliedCoupon.code}
                        </code>
                        {appliedCoupon.discountType === "percentage"
                          ? ` - ${appliedCoupon.discountValue}% off`
                          : appliedCoupon.discountType === "fixed"
                          ? ` - $${appliedCoupon.discountValue} off`
                          : " - Free Shipping"}
                      </p>
                      <p
                        style={{
                          color: "#28a745",
                          margin: "5px 0 0",
                          fontSize: "1rem",
                          fontWeight: "bold",
                        }}
                      >
                        You save: ${calculateDiscount().toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* NEW: Referral Balance Section */}
              {referralBalance > 0 && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "15px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    border: "1px solid #4caf50",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>💰</span>
                      <div>
                        <strong style={{ color: "#2e7d32" }}>
                          Referral Balance
                        </strong>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "#4caf50",
                          }}
                        >
                          Available: ${referralBalance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={useReferralBalance}
                        onChange={(e) => handleReferralToggle(e.target.checked)}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                      <span style={{ fontWeight: "600", color: "#2e7d32" }}>
                        Use
                      </span>
                    </label>
                  </div>

                  {useReferralBalance && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "0.9rem", color: "#666" }}>
                          Amount to use:
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{ fontWeight: "bold", color: "#2e7d32" }}
                          >
                            -${referralAmountToUse.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={Math.min(
                          referralBalance,
                          calculateTotal() - calculateDiscount()
                        )}
                        value={referralAmountToUse}
                        onChange={(e) =>
                          setReferralAmountToUse(parseFloat(e.target.value))
                        }
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.8rem",
                          color: "#888",
                        }}
                      >
                        <span>$0</span>
                        <span>
                          $
                          {Math.min(
                            referralBalance,
                            calculateTotal() - calculateDiscount()
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price Summary */}
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
                  <span>£{calculateTotal().toFixed(2)}</span>
                </div>

                {appliedCoupon && calculateDiscount() > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "1.1rem",
                      color: "#28a745",
                    }}
                  >
                    <span>Coupon Discount:</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}

                {/* NEW: Show referral discount */}
                {useReferralBalance && referralAmountToUse > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "1.1rem",
                      color: "#2e7d32",
                    }}
                  >
                    <span>💰 Referral Credit:</span>
                    <span>-£{referralAmountToUse.toFixed(2)}</span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "1.1rem",
                  }}
                >
                  <span>Tax (8%):</span>
                  <span>
                    £
                    {(
                      (calculateTotal() -
                        calculateDiscount() -
                        calculateReferralDiscount()) *
                      0.08
                    ).toFixed(2)}
                  </span>
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

              {/* Buttons */}
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

      {/* Add animation styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default CartPage;
