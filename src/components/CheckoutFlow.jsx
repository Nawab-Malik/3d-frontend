import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "./CheckoutFlow.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_..."
);

/**
 * Enhanced Checkout Flow Component
 * Supports coupons, shipping calculation, and Stripe payment
 */
const CheckoutFlow = ({ cartItems, user }) => {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [loading, setLoading] = useState(false);

  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "GB",
    phone: "",
  });

  // Pricing
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  // Terms
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    calculateSubtotal();
  }, [cartItems]);

  useEffect(() => {
    if (shippingInfo.country && subtotal > 0) {
      calculateShipping();
    }
  }, [shippingInfo.country, subtotal]);

  useEffect(() => {
    calculateTotal();
  }, [subtotal, shippingCost, discount, tax]);

  const calculateSubtotal = () => {
    const sum = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(sum);
  };

  const calculateShipping = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app"
        }/api/shipping/calculate`,
        {
          orderTotal: subtotal,
          country: shippingInfo.country,
        }
      );

      setShippingCost(response.data.shippingCost || 0);
    } catch (error) {
      console.error("Error calculating shipping:", error);
      setShippingCost(5.99); // Default shipping
    }
  };

  const calculateTotal = () => {
    const taxRate = 0.2; // 20% VAT for UK
    const taxAmount = (subtotal - discount) * taxRate;
    setTax(taxAmount);

    const grandTotal = subtotal - discount + shippingCost + taxAmount;
    setTotal(Math.max(0, grandTotal));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    setLoading(true);
    setCouponMessage("");

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app"
        }/api/coupons/validate`,
        {
          code: couponCode,
          subtotal,
          userId: user?.id,
        }
      );

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        setDiscount(response.data.coupon.discount);
        if (response.data.coupon.freeShipping) {
          setShippingCost(0);
        }
        setCouponMessage("Coupon applied successfully!");
      }
    } catch (error) {
      setCouponMessage(error.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    setCouponMessage("");
    calculateShipping(); // Recalculate shipping without free shipping
  };

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();

    // Validate shipping info
    const required = [
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "country",
      "phone",
    ];
    const isValid = required.every((field) => shippingInfo[field].trim());

    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order data
      const orderData = {
        items: cartItems.map((item) => ({
          name: item.title,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        subtotal,
        discount,
        shippingCost,
        tax,
        grandTotal: total,
        couponCode: appliedCoupon?.code,
        shippingAddress: shippingInfo,
        customerEmail: user?.email || shippingInfo.email,
        orderNo: `ORD-${Date.now()}`,
      };

      // Create Stripe checkout session
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app"
        }/api/payment/create-checkout`,
        { orderData }
      );

      if (response.data.success) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-flow">
      <div className="checkout-steps">
        <div
          className={`checkout-step ${step === 1 ? "active" : ""} ${
            step > 1 ? "completed" : ""
          }`}
        >
          1. Shipping
        </div>
        <div className={`checkout-step ${step === 2 ? "active" : ""}`}>
          2. Payment
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleContinueToPayment} className="checkout-form">
          <h2>Shipping Information</h2>

          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={shippingInfo.firstName}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={shippingInfo.lastName}
              onChange={handleShippingChange}
              required
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Street Address *"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            required
          />

          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State/County"
              value={shippingInfo.state}
              onChange={handleShippingChange}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code *"
              value={shippingInfo.postalCode}
              onChange={handleShippingChange}
              required
            />
            <select
              name="country"
              value={shippingInfo.country}
              onChange={handleShippingChange}
              required
            >
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
            required
          />

          <div className="coupon-section">
            <h3>Have a Coupon Code?</h3>
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={appliedCoupon}
              />
              {!appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="apply-coupon-btn"
                >
                  Apply
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="remove-coupon-btn"
                >
                  Remove
                </button>
              )}
            </div>
            {couponMessage && (
              <p
                className={`coupon-message ${
                  appliedCoupon ? "success" : "error"
                }`}
              >
                {couponMessage}
              </p>
            )}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {shippingCost === 0 ? "FREE" : `£${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax (VAT 20%):</span>
              <span>£{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <a href="/terms" target="_blank">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank">
                Privacy Policy
              </a>
            </label>
          </div>

          <button type="submit" className="continue-btn">
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="payment-section">
          <h2>Payment</h2>

          <div className="order-summary">
            <h3>Final Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {shippingCost === 0 ? "FREE" : `£${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>£{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-buttons">
            <button onClick={() => setStep(1)} className="back-btn">
              Back to Shipping
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="pay-btn"
            >
              {loading ? "Processing..." : "Pay with Stripe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
