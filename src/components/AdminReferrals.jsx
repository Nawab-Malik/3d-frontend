import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/referrals/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferrals(response.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      alert('Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  const filteredReferrals = referrals.filter(ref =>
    ref.referrer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.referrer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSuccessfulReferrals = referrals.reduce(
    (acc, ref) => acc + ref.referrals.filter(r => r.orderPlaced).length,
    0
  );

  const totalPendingReferrals = referrals.reduce(
    (acc, ref) => acc + ref.referrals.filter(r => !r.orderPlaced).length,
    0
  );

  const totalRewardsGiven = referrals.reduce((acc, ref) => {
    return acc + ref.referrals.filter(r => r.rewardGiven).length * 10; // Assuming £10 per reward
  }, 0);

  if (loading) return <div className="admin-loading">Loading referrals...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>🎁 Referral Program</h2>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{referrals.length}</h3>
          <p>Active Referrers</p>
        </div>
        <div className="stat-card">
          <h3>{totalSuccessfulReferrals}</h3>
          <p>Successful Referrals</p>
        </div>
        <div className="stat-card">
          <h3>{totalPendingReferrals}</h3>
          <p>Pending Referrals</p>
        </div>
        <div className="stat-card">
          <h3>£{totalRewardsGiven.toFixed(2)}</h3>
          <p>Total Rewards Given</p>
        </div>
      </div>

      <div className="search-group">
        <input
          type="text"
          placeholder="Search by name, email or referral code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Referrer</th>
              <th>Email</th>
              <th>Referral Code</th>
              <th>Total Referrals</th>
              <th>Successful</th>
              <th>Rewards Given</th>
              <th>Total Earned</th>
            </tr>
          </thead>
          <tbody>
            {filteredReferrals.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  No referrals found.
                </td>
              </tr>
            ) : (
              filteredReferrals.map((referral) => {
                const successfulCount = referral.referrals.filter(r => r.orderPlaced).length;
                const rewardsGiven = referral.referrals.filter(r => r.rewardGiven).length;
                
                return (
                  <tr key={referral._id}>
                    <td>{referral.referrer?.name || 'N/A'}</td>
                    <td>{referral.referrer?.email || 'N/A'}</td>
                    <td>
                      <code>{referral.referralCode}</code>
                    </td>
                    <td>{referral.referrals.length}</td>
                    <td>
                      <span className="badge badge-success">
                        {successfulCount}
                      </span>
                    </td>
                    <td>{rewardsGiven}</td>
                    <td>£{(rewardsGiven * 10).toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Referrals Table */}
      <div style={{ marginTop: '40px' }}>
        <h3>Recent Referrals</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Referrer</th>
                <th>Referee</th>
                <th>Referred Date</th>
                <th>Order Placed</th>
                <th>Reward Given</th>
                <th>Reward Code</th>
              </tr>
            </thead>
            <tbody>
              {referrals.flatMap(ref =>
                ref.referrals.map((r, idx) => (
                  <tr key={`${ref._id}-${idx}`}>
                    <td>{ref.referrer?.name || 'N/A'}</td>
                    <td>{r.referee?.name || 'New User'}</td>
                    <td>{new Date(r.referredAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${r.orderPlaced ? 'active' : 'inactive'}`}>
                        {r.orderPlaced ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${r.rewardGiven ? 'active' : 'inactive'}`}>
                        {r.rewardGiven ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{r.rewardCode ? <code>{r.rewardCode}</code> : 'N/A'}</td>
                  </tr>
                ))
              ).slice(0, 20)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReferrals;
