import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductFeedbackSection({ productId, productTitle }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const getUserEmail = () => {
    // Try multiple possible localStorage keys and structures
    try {
      // Try userData
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed?.email) return parsed.email;
      }
    } catch {}

    try {
      // Try user
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed?.email) return parsed.email;
      }
    } catch {}

    try {
      // Try userInfo
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed?.email) return parsed.email;
      }
    } catch {}

    // Try direct email key
    const directEmail = localStorage.getItem("userEmail");
    if (directEmail) return directEmail;

    return "";
  };

  // Fetch user email on mount
  useEffect(() => {
    const email = getUserEmail();
    setUserEmail(email);
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://3-d-backend-3pgu.vercel.app/api/product-feedback/product/${productId}`
      );
      setFeedbackList(res.data?.feedback || []);
      setAverageRating(res.data?.averageRating || 0);
      setTotalReviews(res.data?.totalReviews || 0);

      // Check if current user has already reviewed
      const email = getUserEmail();
      if (email) {
        const existing = (res.data?.feedback || []).find(
          (f) => f.email?.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          setUserReview(existing);
          setMessage(existing.message);
          setRating(existing.rating);
        }
      }
    } catch (err) {
      console.error("Failed to fetch product feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchFeedback();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be logged in to submit a review.");
      return;
    }

    // Use state email or try to get it again
    let email = userEmail || getUserEmail();

    // If still no email, try to get from server
    if (!email) {
      try {
        const res = await axios.get(
          "https://3-d-backend-3pgu.vercel.app/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        email = res.data?.email || res.data?.user?.email || "";
        if (email) {
          setUserEmail(email);
        }
      } catch (err) {
        console.error("Failed to get user info:", err);
      }
    }

    if (!email) {
      setError("Unable to get your email. Please log out and log in again.");
      return;
    }

    try {
      setSending(true);
      setError("");
      await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/product-feedback",
        { productId, message, rating, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
      await fetchFeedback();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm("Delete this review?")) return;
    const token = getToken();
    try {
      await axios.delete(
        `https://3-d-backend-3pgu.vercel.app/api/product-feedback/${feedbackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserReview(null);
      setMessage("");
      setRating(5);
      await fetchFeedback();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const renderStars = (starRating, interactive = false, onChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={interactive ? () => onChange(i) : undefined}
          style={{
            cursor: interactive ? "pointer" : "default",
            color: i <= starRating ? "#FFD700" : "#ddd",
            fontSize: interactive ? "28px" : "18px",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const isLoggedIn = !!getToken();

  return (
    <div
      style={{
        marginTop: "40px",
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        Customer Reviews
        {totalReviews > 0 && (
          <span
            style={{ fontSize: "16px", color: "#666", fontWeight: "normal" }}
          >
            ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
          </span>
        )}
      </h2>

      {/* Average Rating Display */}
      {totalReviews > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
            padding: "16px",
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <span style={{ fontSize: "36px", fontWeight: "bold" }}>
            {averageRating.toFixed(1)}
          </span>
          <div>
            <div>{renderStars(Math.round(averageRating))}</div>
            <span style={{ color: "#666", fontSize: "14px" }}>
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Review Form */}
      {isLoggedIn ? (
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
            {userReview ? "Update Your Review" : "Write a Review"}
          </h3>

          {submitted && (
            <div
              style={{
                background: "rgba(76,175,80,0.15)",
                border: "1px solid rgba(76,175,80,0.35)",
                color: "#2e7d32",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              {userReview
                ? "Your review has been updated!"
                : "Thanks for your review!"}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(255, 99, 71, 0.15)",
                border: "1px solid rgba(255, 99, 71, 0.35)",
                color: "#c62828",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Your Rating
              </label>
              <div>{renderStars(rating, true, setRating)}</div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Your Review
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Share your experience with ${productTitle}...`}
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  resize: "vertical",
                  fontFamily: "inherit",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  background:
                    "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: sending ? "not-allowed" : "pointer",
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending
                  ? "Submitting..."
                  : userReview
                  ? "Update Review"
                  : "Submit Review"}
              </button>

              {userReview && (
                <button
                  type="button"
                  onClick={() => handleDelete(userReview._id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Delete My Review
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>
            Please{" "}
            <a href="/login" style={{ color: "#514F6E", fontWeight: "600" }}>
              log in
            </a>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          Loading reviews...
        </div>
      ) : feedbackList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {feedbackList.map((fb) => (
            <div
              key={fb._id}
              style={{
                padding: "16px",
                background: "#fafafa",
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                {fb.avatarUrl ? (
                  <img
                    src={fb.avatarUrl}
                    alt="Avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#e9e9ef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontWeight: 600,
                    }}
                  >
                    {(fb.userName || "C").substring(0, 1).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{fb.userName}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div>{renderStars(fb.rating)}</div>
                    <span style={{ color: "#999", fontSize: "12px" }}>
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#444",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {fb.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductFeedbackSection;
