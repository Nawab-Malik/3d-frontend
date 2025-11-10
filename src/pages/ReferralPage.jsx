import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReferralSystem from '../components/ReferralSystem';
// Import your auth context - adjust path as needed
// import { AuthContext } from '../context/AuthContext';

/**
 * Referral Page
 * Displays user's referral dashboard
 */
const ReferralPage = () => {
  const navigate = useNavigate();
  
  // Replace with your actual auth context
  // const { user } = useContext(AuthContext);
  
  // Mock user for demonstration - replace with actual auth
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Please log in to access your referral dashboard</h2>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="referral-page">
      <ReferralSystem user={user} />
    </div>
  );
};

export default ReferralPage;
