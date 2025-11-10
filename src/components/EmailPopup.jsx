import { useState, useEffect } from 'react';
import axios from 'axios';
import './EmailPopup.css';

/**
 * Email Marketing Popup Component
 * Shows after a delay or on first visit to collect email subscriptions
 */
const EmailPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    // Check if user has already seen or dismissed the popup
    const hasSeenPopup = localStorage.getItem('hasSeenEmailPopup');
    const isSubscribed = localStorage.getItem('isSubscribed');

    if (!hasSeenPopup && !isSubscribed) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenEmailPopup', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscriptions`,
        {
          email,
          name,
          source: 'popup',
        }
      );

      if (response.data.subscription) {
        setDiscountCode(response.data.subscription.discountCode);
        setMessage('Success! Check your email for your discount code.');
        localStorage.setItem('isSubscribed', 'true');

        // Close popup after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="email-popup-overlay" onClick={handleClose} />
      <div className="email-popup">
        <button className="email-popup-close" onClick={handleClose}>
          ×
        </button>

        <div className="email-popup-content">
          {!discountCode ? (
            <>
              <h2>Get 10% Off Your First Order!</h2>
              <p>Subscribe to our newsletter and receive exclusive offers and updates.</p>

              <form onSubmit={handleSubmit} className="email-popup-form">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="email-popup-input"
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-popup-input"
                />
                <button
                  type="submit"
                  className="email-popup-button"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Get My Discount'}
                </button>
              </form>

              {message && (
                <p className={`email-popup-message ${discountCode ? 'success' : 'error'}`}>
                  {message}
                </p>
              )}

              <p className="email-popup-privacy">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          ) : (
            <div className="email-popup-success">
              <div className="success-icon">✓</div>
              <h2>Welcome Aboard!</h2>
              <p>Your discount code is:</p>
              <div className="discount-code-box">
                {discountCode}
              </div>
              <p className="success-message">
                We've also sent this code to your email. Start shopping now!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailPopup;
