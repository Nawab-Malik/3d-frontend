import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchSubscriptions();
  }, [filter]);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const params = filter !== 'all' ? `?isActive=${filter === 'active'}` : '';
      const response = await axios.get(`${API_URL}/api/subscriptions${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      alert('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Subscription deleted successfully!');
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Failed to delete subscription');
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Name', 'Source', 'Discount Code', 'Status', 'Subscribed Date'];
    const rows = filteredSubscriptions.map(sub => [
      sub.email,
      sub.name || 'N/A',
      sub.source,
      sub.discountCode || 'N/A',
      sub.isActive ? 'Active' : 'Unsubscribed',
      new Date(sub.subscribedAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="admin-loading">Loading subscriptions...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>📧 Email Subscriptions</h2>
        <button className="btn-primary" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>

      <div className="admin-filters">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Unsubscribed</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{subscriptions.filter(s => s.isActive).length}</h3>
          <p>Active Subscribers</p>
        </div>
        <div className="stat-card">
          <h3>{subscriptions.filter(s => !s.isActive).length}</h3>
          <p>Unsubscribed</p>
        </div>
        <div className="stat-card">
          <h3>{subscriptions.length}</h3>
          <p>Total Subscriptions</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Source</th>
              <th>Discount Code</th>
              <th>Status</th>
              <th>Subscribed Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <tr key={subscription._id}>
                  <td>{subscription.email}</td>
                  <td>{subscription.name || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${subscription.source}`}>
                      {subscription.source}
                    </span>
                  </td>
                  <td>
                    {subscription.discountCode ? (
                      <code>{subscription.discountCode}</code>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${subscription.isActive ? 'active' : 'inactive'}`}
                    >
                      {subscription.isActive ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td>{new Date(subscription.subscribedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(subscription._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
