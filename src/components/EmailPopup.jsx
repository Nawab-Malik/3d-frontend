import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmailPopup.css";

const EmailPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    // Check if popup has been dismissed before
    const hasSeenPopup = localStorage.getItem("emailPopupSeen");

    if (!hasSeenPopup) {
      // Show popup after 5 seconds delay
      const timer = setTimeout(() => {
        console.log("📧 Email popup showing...");
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as seen for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem("emailPopupSeen", "true");
    localStorage.setItem("emailPopupExpiry", expiryDate.toISOString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email) {
        setError("Please enter your email");
        setLoading(false);
        return;
      }

      console.log("📧 Subscribing email:", email);

      const response = await axios.post(`${API_URL}/api/subscriptions`, {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        source: "popup",
      });

      console.log("✅ Subscription response:", response.data);

      if (response.data.success) {
        console.log("✅ Success! Discount code:", response.data.discountCode);

        // Set discount code first
        setDiscountCode(response.data.discountCode || "WELCOME10");

        // Then show success state
        setSuccess(true);

        // Clear form
        setEmail("");
        setName("");

        // Close popup after 5 seconds
        setTimeout(() => {
          handleClose();
          // Reset form for next time (if they clear localStorage)
          setSuccess(false);
          setDiscountCode("");
        }, 5000);
      } else {
        setError(
          response.data.message || "Failed to subscribe. Please try again."
        );
      }
    } catch (err) {
      console.error("❌ Subscription error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="email-popup-overlay">
      <div className="email-popup-container">
        <button className="popup-close" onClick={handleClose}>
          ✕
        </button>

        {!success ? (
          <>
            <div className="popup-header">
              <h2>🎉 Get 10% Off!</h2>
              <p>Subscribe to our newsletter for exclusive deals and updates</p>
            </div>

            <form onSubmit={handleSubmit} className="popup-form">
              {error && <div className="popup-error">{error}</div>}

              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="popup-input"
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="popup-input"
              />

              <button type="submit" disabled={loading} className="popup-button">
                {loading ? "Subscribing..." : "Get My Discount"}
              </button>

              <p className="popup-disclaimer">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </>
        ) : (
          <div className="popup-success">
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>Your discount code has been sent to your email</p>

            {discountCode && (
              <div className="discount-code-display">
                <span className="code">{discountCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(discountCode);
                    alert("Code copied to clipboard!");
                  }}
                  className="copy-button"
                >
                  Copy Code
                </button>
              </div>
            )}

            <p className="popup-disclaimer">
              Use this code at checkout to get your discount!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPopup;
