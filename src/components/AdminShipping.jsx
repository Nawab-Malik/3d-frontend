import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminShipping = () => {
  const [shippingRules, setShippingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "flat_rate",
    baseRate: 0,
    freeShippingThreshold: 0,
    isActive: true,
    priority: 1,
  });

  const API_URL =
    import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    fetchShippingRules();
  }, []);

  const fetchShippingRules = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/api/shipping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShippingRules(response.data);
    } catch (error) {
      console.error("Error fetching shipping rules:", error);
      alert("Failed to fetch shipping rules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");

      if (editingId) {
        await axios.put(`${API_URL}/api/shipping/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Shipping rule updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/shipping`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Shipping rule created successfully!");
      }

      resetForm();
      fetchShippingRules();
    } catch (error) {
      console.error("Error saving shipping rule:", error);
      alert(error.response?.data?.message || "Failed to save shipping rule");
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule._id);
    setFormData({
      name: rule.name,
      description: rule.description || "",
      type: rule.type,
      baseRate: rule.baseRate,
      freeShippingThreshold: rule.freeShippingThreshold || 0,
      isActive: rule.isActive,
      priority: rule.priority || 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipping rule?"))
      return;

    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`${API_URL}/api/shipping/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Shipping rule deleted successfully!");
      fetchShippingRules();
    } catch (error) {
      console.error("Error deleting shipping rule:", error);
      alert("Failed to delete shipping rule");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "flat_rate",
      baseRate: 0,
      freeShippingThreshold: 0,
      isActive: true,
      priority: 1,
    });
    setEditingId(null);
    setShowModal(false);
  };

  if (loading)
    return <div className="admin-loading">Loading shipping rules...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>🚚 Manage Shipping Rules</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Shipping Rule
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Base Rate</th>
              <th>Free Shipping Threshold</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shippingRules.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No shipping rules found. Create your first shipping rule!
                </td>
              </tr>
            ) : (
              shippingRules.map((rule) => (
                <tr key={rule._id}>
                  <td>
                    <strong>{rule.name}</strong>
                    <br />
                    <small>{rule.description}</small>
                  </td>
                  <td>
                    <span className={`badge badge-${rule.type}`}>
                      {rule.type.replace("_", " ")}
                    </span>
                  </td>
                  <td>£{rule.baseRate.toFixed(2)}</td>
                  <td>
                    {rule.freeShippingThreshold
                      ? `£${rule.freeShippingThreshold.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td>{rule.priority || 1}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        rule.isActive ? "active" : "inactive"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(rule)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(rule._id)}
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
            <h3>{editingId ? "Edit Shipping Rule" : "Create Shipping Rule"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Rule Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Standard UK Shipping"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="2"
                  placeholder="Free shipping for orders over £50"
                />
              </div>

              <div className="form-group">
                <label>Shipping Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="flat_rate">Flat Rate</option>
                  <option value="free">Free Shipping</option>
                  <option value="price_based">Price Based</option>
                  <option value="weight_based">Weight Based</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Base Rate (£) *</label>
                  <input
                    type="number"
                    value={formData.baseRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseRate: parseFloat(e.target.value),
                      })
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Free Shipping Threshold (£)</label>
                  <input
                    type="number"
                    value={formData.freeShippingThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        freeShippingThreshold: parseFloat(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                    placeholder="0 = No free shipping"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
                <small>Higher priority rules are checked first</small>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  Active
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;
