import { useState, useEffect } from 'react';
import axios from 'axios';
import './ReferralSystem.css';

/**
 * Referral System Component
 * Displays user's referral code and referral history
 */
const ReferralSystem = ({ user }) => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/referrals/my-referrals`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setReferralData(response.data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (referralData?.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Check out this amazing store! Use my referral code ${referralData.referralCode} when you sign up: ${referralData.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const message = `Use my referral code ${referralData.referralCode} to get started!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralData.referralLink)}`,
      '_blank'
    );
  };

  if (loading) {
    return <div className="referral-loading">Loading referral data...</div>;
  }

  if (!referralData) {
    return <div className="referral-error">Unable to load referral data</div>;
  }

  return (
    <div className="referral-system">
      <div className="referral-header">
        <h1>Refer & Earn</h1>
        <p>Share your referral code and earn rewards when your friends make a purchase!</p>
      </div>

      {/* Referral Code Section */}
      <div className="referral-code-section">
        <h2>Your Referral Code</h2>
        <div className="referral-code-display">
          <div className="code-box">
            <span className="code">{referralData.referralCode || 'Loading...'}</span>
          </div>
          <button onClick={handleCopyCode} className="copy-btn">
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className="referral-link-display">
          <input
            type="text"
            value={referralData.referralLink || ''}
            readOnly
            className="link-input"
          />
          <button onClick={handleCopyLink} className="copy-btn">
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="share-buttons">
          <button onClick={handleShareWhatsApp} className="share-btn whatsapp">
            <span>📱</span> WhatsApp
          </button>
          <button onClick={handleShareTwitter} className="share-btn twitter">
            <span>🐦</span> Twitter
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="referral-stats">
        <div className="stat-card">
          <div className="stat-number">{referralData.totalReferrals || 0}</div>
          <div className="stat-label">Total Referrals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{referralData.successfulReferrals || 0}</div>
          <div className="stat-label">Successful Referrals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">£{(referralData.totalRewardsEarned || 0).toFixed(2)}</div>
          <div className="stat-label">Total Rewards</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Share Your Code</h3>
            <p>Share your unique referral code with friends and family</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>They Sign Up</h3>
            <p>Your friend signs up using your referral code or link</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>They Purchase</h3>
            <p>When they make their first purchase, you both get rewarded!</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Earn Rewards</h3>
            <p>Receive a £10 discount code for each successful referral</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      {referralData.referrals && referralData.referrals.length > 0 && (
        <div className="referral-history">
          <h2>Your Referrals</h2>
          <div className="referral-list">
            {referralData.referrals.map((referral, index) => (
              <div key={index} className="referral-item">
                <div className="referral-info">
                  <div className="referral-name">
                    {referral.referee?.name || 'Friend'}
                  </div>
                  <div className="referral-date">
                    Referred on {new Date(referral.referredAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="referral-status">
                  {referral.orderPlaced ? (
                    <span className="status-badge success">
                      ✓ Purchased
                      {referral.rewardGiven && (
                        <span className="reward-info">
                          <br />
                          Reward: {referral.rewardCode}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="status-badge pending">Pending Purchase</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
