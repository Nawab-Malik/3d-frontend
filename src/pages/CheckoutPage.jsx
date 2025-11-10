import { useState, useEffect } from 'react';
import CheckoutFlow from '../components/CheckoutFlow';

/**
 * Checkout Page
 * Wraps the CheckoutFlow component
 */
const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load cart items from localStorage or context
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);

    // Load user from localStorage or context
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(currentUser);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checking out.</p>
        <a
          href="/products"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 30px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
          }}
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <CheckoutFlow cartItems={cartItems} user={user} />
    </div>
  );
};

export default CheckoutPage;
