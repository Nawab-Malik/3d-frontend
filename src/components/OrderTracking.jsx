import { useState } from 'react';
import axios from 'axios';
import './OrderTracking.css';

/**
 * Order Tracking Component
 * Allows users to track their orders by order number or email
 */
const OrderTracking = () => {
  const [trackingMethod, setTrackingMethod] = useState('orderNo'); // 'orderNo' or 'email'
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      let response;

      if (trackingMethod === 'orderNo') {
        response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/${orderNo}`
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tracking/email`,
          { email, orderNo }
        );
      }

      setOrderData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '🕐',
      confirmed: '✓',
      processing: '📦',
      packed: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
      refunded: '💰',
    };
    return icons[status] || '•';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      processing: '#9c27b0',
      packed: '#673ab7',
      shipped: '#00bcd4',
      delivered: '#4caf50',
      cancelled: '#f44336',
      refunded: '#607d8b',
    };
    return colors[status] || '#666';
  };

  const statuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h1>Track Your Order</h1>
        <p>Enter your order details to check the current status</p>
      </div>

      <div className="tracking-form-container">
        <div className="tracking-method-toggle">
          <button
            className={trackingMethod === 'orderNo' ? 'active' : ''}
            onClick={() => setTrackingMethod('orderNo')}
          >
            Track by Order Number
          </button>
          <button
            className={trackingMethod === 'email' ? 'active' : ''}
            onClick={() => setTrackingMethod('email')}
          >
            Track by Email
          </button>
        </div>

        <form onSubmit={handleTrack} className="tracking-form">
          {trackingMethod === 'orderNo' ? (
            <div className="form-group">
              <label>Order Number</label>
              <input
                type="text"
                placeholder="e.g., ORD-ABC123"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value.toUpperCase())}
                required
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="text"
                  placeholder="e.g., ORD-ABC123"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="track-btn">
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      {orderData && (
        <div className="tracking-results">
          <div className="order-header">
            <h2>Order #{orderData.orderNo}</h2>
            <span
              className="order-status-badge"
              style={{ backgroundColor: getStatusColor(orderData.status) }}
            >
              {orderData.status.toUpperCase()}
            </span>
          </div>

          <div className="order-date">
            Ordered on {new Date(orderData.createdAt).toLocaleDateString()}
          </div>

          {/* Status Timeline */}
          <div className="status-timeline">
            {statuses.map((status, index) => {
              const isCompleted = statuses.indexOf(orderData.status) >= index;
              const isCurrent = orderData.status === status;

              return (
                <div
                  key={status}
                  className={`timeline-item ${isCompleted ? 'completed' : ''} ${
                    isCurrent ? 'current' : ''
                  }`}
                >
                  <div className="timeline-icon">{getStatusIcon(status)}</div>
                  <div className="timeline-label">{status}</div>
                  {index < statuses.length - 1 && <div className="timeline-line" />}
                </div>
              );
            })}
          </div>

          {/* Tracking Information */}
          {orderData.trackingNumber && (
            <div className="tracking-info">
              <h3>Tracking Information</h3>
              <div className="info-row">
                <span className="label">Tracking Number:</span>
                <span className="value">{orderData.trackingNumber}</span>
              </div>
              {orderData.courierName && (
                <div className="info-row">
                  <span className="label">Courier:</span>
                  <span className="value">{orderData.courierName}</span>
                </div>
              )}
              {orderData.estimatedDelivery && (
                <div className="info-row">
                  <span className="label">Estimated Delivery:</span>
                  <span className="value">
                    {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="order-items">
            <h3>Order Items</h3>
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item">
                {item.product?.imageUrl && (
                  <img src={item.product.imageUrl} alt={item.product.title} />
                )}
                <div className="item-details">
                  <h4>{item.product?.title || 'Product'}</h4>
                  <p>
                    Quantity: {item.quantity} × £{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="item-total">£{item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="shipping-address">
            <h3>Shipping Address</h3>
            <p>
              {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
              <br />
              {orderData.shippingAddress.address}
              <br />
              {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{' '}
              {orderData.shippingAddress.postalCode}
              <br />
              {orderData.shippingAddress.country}
              <br />
              Phone: {orderData.shippingAddress.phone}
            </p>
          </div>

          {/* Status History */}
          {orderData.statusHistory && orderData.statusHistory.length > 0 && (
            <div className="status-history">
              <h3>Order History</h3>
              {orderData.statusHistory.map((history, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">
                    {new Date(history.timestamp).toLocaleString()}
                  </div>
                  <div className="history-status">
                    <strong>{history.status}</strong>
                    {history.note && <span> - {history.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
