import { useState, useEffect } from "react";
import axios from "axios";
import "./ReferralSystem.css";

const ReferralSystem = ({ user }) => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  const API_URL = "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from multiple possible sources
      const token =
        localStorage.getItem("userToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("userToken");

      console.log("🔑 Token found:", token ? "Yes" : "No");

      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      console.log(
        "📡 Fetching referral data from:",
        `${API_URL}/api/referrals/my-referrals`
      );

      const response = await axios.get(
        `${API_URL}/api/referrals/my-referrals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Referral data received:", response.data);
      setReferralData(response.data);
    } catch (err) {
      console.error("❌ Referral fetch error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      let errorMessage = "Failed to load referral data";

      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        // Clear invalid token
        localStorage.removeItem("userToken");
        localStorage.removeItem("token");
      } else if (err.response?.status === 404) {
        errorMessage = "Referral system not found. Please contact support.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type, index) => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === "coupon") {
      setCopiedCoupon(index);
      setTimeout(() => setCopiedCoupon(null), 2000);
    }
  };

  const shareVia = (platform) => {
    if (!referralData) return;

    const message = `Join me on this amazing platform! Use my referral code ${referralData.referralCode} to get started: ${referralData.referralLink}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedLink = encodeURIComponent(referralData.referralLink);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      email: `mailto:?subject=Join me!&body=${encodedMessage}`,
    };

    window.open(urls[platform], "_blank");
  };

  if (loading) {
    return (
      <div className="referral-system">
        <div className="referral-loading">
          <div className="spinner"></div>
          <p>Loading your referral dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="referral-system">
        <div className="referral-error-banner">
          <div>
            <h3>⚠️ {error}</h3>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
              {error.includes("log in")
                ? "Please log in to access your referral dashboard."
                : "There was an issue loading your referral data."}
            </p>
          </div>
          <button className="btn-retry" onClick={fetchReferralData}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="referral-system">
        <div className="referral-error">
          <p>No referral data available</p>
          <button className="btn-retry" onClick={fetchReferralData}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Get ONLY referrals that have reward codes
  const rewardedReferrals =
    referralData.referrals?.filter(
      (r) => r.rewardGiven === true && r.rewardCode
    ) || [];

  console.log("🎁 Rewarded referrals with codes:", rewardedReferrals);

  return (
    <div className="referral-system">
      {/* Header */}
      <div className="referral-header">
        <h1>🎁 Refer & Earn</h1>
        <p>
          Share your code and earn £{referralData.rewardInfo?.value} instantly
          when friends sign up!
        </p>
      </div>

      {/* ✅ Available Rewards Section */}
      {rewardedReferrals.length > 0 && (
        <div className="referral-rewards-section">
          <h2>💰 Your Available Rewards ({rewardedReferrals.length})</h2>
          <p className="rewards-subtitle">
            Copy these coupon codes to use at checkout!
          </p>
          <div className="rewards-grid">
            {rewardedReferrals.map((ref, index) => (
              <div key={index} className="reward-card">
                <div className="reward-header">
                  <span className="reward-icon">🎉</span>
                  <span className="reward-value">£{ref.rewardValue}</span>
                </div>
                <div className="reward-body">
                  <div className="reward-from">
                    From: <strong>{ref.referee?.name || "New User"}</strong>
                  </div>
                  <div className="reward-code-container">
                    <code className="reward-coupon-code">{ref.rewardCode}</code>
                    <button
                      className={`copy-coupon-btn ${
                        copiedCoupon === index ? "copied" : ""
                      }`}
                      onClick={() =>
                        copyToClipboard(ref.rewardCode, "coupon", index)
                      }
                      title="Copy coupon code"
                    >
                      {copiedCoupon === index ? "✓" : "📋"}
                    </button>
                  </div>
                  <div className="reward-date">
                    Earned: {new Date(ref.rewardedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral Code */}
      <div className="referral-code-section">
        <h2>📋 Your Referral Code</h2>
        <div className="referral-code-display">
          <div className="code-box">
            <span className="code">{referralData.referralCode}</span>
            <span className="copy-hint">Click to copy →</span>
          </div>
          <button
            className={`copy-btn ${copiedCode ? "copied" : ""}`}
            onClick={() => copyToClipboard(referralData.referralCode, "code")}
          >
            {copiedCode ? "✓ Copied!" : "📋 Copy Code"}
          </button>
        </div>
      </div>

      {/* Referral Link */}
      {/* <div className="referral-link-section">
        <h2>🔗 Your Referral Link</h2>
        <div className="referral-link-display">
          <input
            type="text"
            className="link-input"
            value={referralData.referralLink}
            readOnly
          />
          <button
            className={`copy-btn ${copiedLink ? "copied" : ""}`}
            onClick={() => copyToClipboard(referralData.referralLink, "link")}
          >
            {copiedLink ? "✓ Copied!" : "📋 Copy Link"}
          </button>
        </div>
      </div> */}

      {/* Share Buttons */}
      <div className="share-buttons-section">
        <h2>📢 Share Your Code</h2>
        <div className="share-buttons">
          <button
            className="share-btn whatsapp"
            onClick={() => shareVia("whatsapp")}
          >
            <span>📱</span>
            WhatsApp
          </button>
          <button
            className="share-btn twitter"
            onClick={() => shareVia("twitter")}
          >
            <span>🐦</span>
            Twitter
          </button>
          <button
            className="share-btn facebook"
            onClick={() => shareVia("facebook")}
          >
            <span>📘</span>
            Facebook
          </button>
          <button className="share-btn email" onClick={() => shareVia("email")}>
            <span>✉️</span>
            Email
          </button>
        </div>
      </div>

      {/* ✅ Stats with correct counting */}
      <div className="referral-stats">
        <h2>📊 Your Referral Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">
              {referralData.totalReferrals || 0}
            </div>
            <div className="stat-label">Total Referrals</div>
            <div className="stat-description">Friends you've invited</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-number">{rewardedReferrals.length}</div>
            <div className="stat-label">Rewards Earned</div>
            <div className="stat-description">Coupons ready to use</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {referralData.pendingReferrals || 0}
            </div>
            <div className="stat-label">Pending</div>
            <div className="stat-description">Processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              £{referralData.totalEarnings || 0}
            </div>
            <div className="stat-label">Total Earned</div>
            <div className="stat-description">All-time rewards</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>❓ How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Share Your Code</h3>
            <p>Send your unique referral code to friends and family</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>They Sign Up</h3>
            <p>Your friend creates an account using your code</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>They Purchase</h3>
            <p>When they place their first order, you both get rewarded!</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>You Earn</h3>
            <p>Receive your reward automatically</p>
          </div>
        </div>
      </div>

      {/* Referral History Section */}
      <div className="referral-history-section">
        <h3 className="referral-section-title">
          <span className="referral-section-icon">📋</span>
          Referral History
        </h3>

        {referralData.referrals && referralData.referrals.length > 0 ? (
          <div className="referral-history-grid">
            {referralData.referrals.map((referral, index) => {
              // Fix: Use referee field (same as rewards section)
              const userName =
                referral.referee?.name ||
                referral.referee?.firstName ||
                referral.referredUser?.name ||
                referral.name ||
                referral.referee?.email?.split("@")[0] ||
                "Unknown User";

              // Fix: Get date from referee or referral
              const joinDate =
                referral.referee?.createdAt ||
                referral.createdAt ||
                referral.joinedAt ||
                referral.date;

              // Fix: Check status correctly
              const isRewarded =
                referral.status === "rewarded" ||
                referral.status === "completed" ||
                referral.status === "Rewarded" ||
                referral.rewarded === true ||
                referral.isRewarded === true ||
                referral.rewardGiven === true ||
                referral.couponCode ||
                referral.rewardCode;

              const status = isRewarded ? "rewarded" : "pending";

              // Format date with error handling
              const formatJoinDate = (date) => {
                if (!date) return "Recently joined";
                try {
                  const d = new Date(date);
                  if (isNaN(d.getTime())) return "Recently joined";
                  return d.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                } catch (e) {
                  return "Recently joined";
                }
              };

              return (
                <div
                  key={referral._id || index}
                  className={`referral-history-card ${status}`}
                >
                  <div className="referral-card-header">
                    <div className="referral-avatar">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="referral-user-info">
                      <h4 className="referral-user-name">{userName}</h4>
                      <p className="referral-user-date">
                        Joined: {formatJoinDate(joinDate)}
                      </p>
                    </div>
                  </div>

                  <div className="referral-card-footer">
                    <span className={`referral-status-badge ${status}`}>
                      {status === "rewarded" ? "🎉 Rewarded" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="referral-empty-state">
            <span className="referral-empty-icon">👥</span>
            <p>No referrals yet. Share your link to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSystem;
