import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    type: 'info',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    link: { url: '', text: '' },
    isActive: true,
    isDismissible: true,
    priority: 1,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      alert('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      
      if (editingId) {
        await axios.put(
          `${API_URL}/api/announcements/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Announcement updated successfully!');
      } else {
        await axios.post(
          `${API_URL}/api/announcements`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Announcement created successfully!');
      }
      
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert(error.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      message: announcement.message,
      type: announcement.type,
      backgroundColor: announcement.backgroundColor,
      textColor: announcement.textColor,
      link: announcement.link || { url: '', text: '' },
      isActive: announcement.isActive,
      isDismissible: announcement.isDismissible,
      priority: announcement.priority || 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(
        `${API_URL}/api/announcements/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      alert('Failed to toggle announcement status');
    }
  };

  const resetForm = () => {
    setFormData({
      message: '',
      type: 'info',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      link: { url: '', text: '' },
      isActive: true,
      isDismissible: true,
      priority: 1,
    });
    setEditingId(null);
    setShowModal(false);
  };

  if (loading) return <div className="admin-loading">Loading announcements...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>📢 Manage Announcements</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Announcement
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No announcements found. Create your first announcement!
                </td>
              </tr>
            ) : (
              announcements.map((announcement) => (
                <tr key={announcement._id}>
                  <td>
                    <div
                      style={{
                        backgroundColor: announcement.backgroundColor,
                        color: announcement.textColor,
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      {announcement.message}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${announcement.type}`}>
                      {announcement.type}
                    </span>
                  </td>
                  <td>{announcement.priority || 1}</td>
                  <td>
                    <button
                      className={`status-badge ${announcement.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(announcement._id, announcement.isActive)}
                    >
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(announcement._id)}
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Announcement' : 'Create Announcement'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows="3"
                  placeholder="Enter announcement message"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                    <option value="promo">Promo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Link URL (Optional)</label>
                <input
                  type="url"
                  value={formData.link.url}
                  onChange={(e) => setFormData({
                    ...formData,
                    link: { ...formData.link, url: e.target.value }
                  })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Link Text (Optional)</label>
                <input
                  type="text"
                  value={formData.link.text}
                  onChange={(e) => setFormData({
                    ...formData,
                    link: { ...formData.link, text: e.target.value }
                  })}
                  placeholder="Shop Now"
                />
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
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isDismissible}
                    onChange={(e) => setFormData({ ...formData, isDismissible: e.target.checked })}
                  />
                  Dismissible
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

export default AdminAnnouncements;
