import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minimumPurchase: 0,
    maxDiscount: 0,
    expiryDate: '',
    usageLimit: 0,
    usagePerUser: 1,
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const dataToSend = {
        ...formData,
        code: formData.code.toUpperCase(),
      };
      
      if (editingId) {
        await axios.put(
          `${API_URL}/api/coupons/${editingId}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Coupon updated successfully!');
      } else {
        await axios.post(
          `${API_URL}/api/coupons`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Coupon created successfully!');
      }
      
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumPurchase: coupon.minimumPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || 0,
      usagePerUser: coupon.usagePerUser || 1,
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Coupon deleted successfully!');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minimumPurchase: 0,
      maxDiscount: 0,
      expiryDate: '',
      usageLimit: 0,
      usagePerUser: 1,
      isActive: true,
    });
    setEditingId(null);
    setShowModal(false);
  };

  const formatDate = (date) => {
    if (!date) return 'No expiry';
    return new Date(date).toLocaleDateString();
  };

  if (loading) return <div className="admin-loading">Loading coupons...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>🎫 Manage Coupons</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Coupon
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Min Purchase</th>
              <th>Usage</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  No coupons found. Create your first coupon!
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <strong>{coupon.code}</strong>
                    <br />
                    <small>{coupon.description}</small>
                  </td>
                  <td>
                    <span className={`badge badge-${coupon.discountType}`}>
                      {coupon.discountType}
                    </span>
                  </td>
                  <td>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : coupon.discountType === 'fixed'
                      ? `£${coupon.discountValue}`
                      : 'Free Shipping'}
                  </td>
                  <td>£{coupon.minimumPurchase || 0}</td>
                  <td>
                    {coupon.usageCount || 0}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' / ∞'}
                  </td>
                  <td>{formatDate(coupon.expiryDate)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        coupon.isActive && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date())
                          ? 'active'
                          : 'inactive'
                      }`}
                    >
                      {coupon.isActive && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date())
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(coupon)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(coupon._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Coupon' : 'Create Coupon'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="SUMMER20"
                  maxLength="20"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summer sale discount"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(£)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    required={formData.discountType !== 'free_shipping'}
                    min="0"
                    step="0.01"
                    disabled={formData.discountType === 'free_shipping'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Purchase (£)</label>
                  <input
                    type="number"
                    value={formData.minimumPurchase}
                    onChange={(e) => setFormData({ ...formData, minimumPurchase: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Max Discount (£)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    placeholder="0 = No limit"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    min="0"
                    placeholder="0 = Unlimited"
                  />
                </div>

                <div className="form-group">
                  <label>Usage Per User</label>
                  <input
                    type="number"
                    value={formData.usagePerUser}
                    onChange={(e) => setFormData({ ...formData, usagePerUser: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
