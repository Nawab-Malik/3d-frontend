import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ReferralSystem from "../components/ReferralSystem";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./ReferralPage.css";

/**
 * Referral Page
 * Displays user's referral dashboard
 */
const ReferralPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser, token } = useContext(AuthContext);

  useEffect(() => {
    // Use AuthContext user first
    if (authUser) {
      setUser(authUser);
      setLoading(false);
      return;
    }

    // Fallback to localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }

    setLoading(false);
  }, [authUser]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="referral-page">
          <div className="referral-page__loading">
            <div className="referral-page__spinner"></div>
            <p>Loading your referral dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user || !token) {
    return (
      <>
        <Navbar />
        <div className="referral-page">
          <div className="referral-page__error">
            <div className="referral-page__error-icon">🔒</div>
            <h2>Authentication Required</h2>
            <p>
              Please log in to access your referral dashboard and start earning
              rewards.
            </p>
            <a href="/login" className="referral-page__login-btn">
              Log In to Continue
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="referral-page">
        {/* Hero Section */}
        <div className="referral-page__hero">
          <div className="referral-page__hero-content">
            <h1>🎁 Referral Program</h1>
            <p>
              Share the love and earn rewards! Invite friends to join and both
              of you get exclusive benefits.
            </p>
          </div>
          <div className="referral-page__hero-decoration">
            <div className="referral-page__hero-circle"></div>
            <div className="referral-page__hero-circle"></div>
            <div className="referral-page__hero-circle"></div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="referral-page__how-it-works">
          <h2>How It Works</h2>
          <div className="referral-page__steps">
            <div className="referral-page__step">
              <div className="referral-page__step-number">1</div>
              <div className="referral-page__step-icon">📤</div>
              <h3>Share Your Link</h3>
              <p>
                Copy your unique referral link and share it with friends and
                family
              </p>
            </div>
            <div className="referral-page__step-arrow">→</div>
            <div className="referral-page__step">
              <div className="referral-page__step-number">2</div>
              <div className="referral-page__step-icon">👥</div>
              <h3>Friends Sign Up</h3>
              <p>
                When they register using your link, they become your referral
              </p>
            </div>
            <div className="referral-page__step-arrow">→</div>
            <div className="referral-page__step">
              <div className="referral-page__step-number">3</div>
              <div className="referral-page__step-icon">🎉</div>
              <h3>Both Get Rewards</h3>
              <p>You both receive exclusive discounts and rewards on orders</p>
            </div>
          </div>
        </div>

        {/* Main Referral System Component */}
        <div className="referral-page__main">
          <ReferralSystem user={user} />
        </div>

        {/* Benefits Section */}
        <div className="referral-page__benefits">
          <h2>Why Refer Friends?</h2>
          <div className="referral-page__benefits-grid">
            <div className="referral-page__benefit">
              <span className="referral-page__benefit-icon">💰</span>
              <h4>Earn Credits</h4>
              <p>Get store credits for every successful referral</p>
            </div>
            <div className="referral-page__benefit">
              <span className="referral-page__benefit-icon">🏷️</span>
              <h4>Exclusive Discounts</h4>
              <p>Unlock special discounts only for referrers</p>
            </div>
            <div className="referral-page__benefit">
              <span className="referral-page__benefit-icon">♾️</span>
              <h4>Unlimited Referrals</h4>
              <p>No limit on how many friends you can invite</p>
            </div>
            <div className="referral-page__benefit">
              <span className="referral-page__benefit-icon">⚡</span>
              <h4>Instant Rewards</h4>
              <p>Rewards are credited immediately after qualifying</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReferralPage;
