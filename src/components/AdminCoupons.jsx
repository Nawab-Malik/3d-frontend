import { useState, useEffect } from "react";
import axios from "axios";
import "./adminpanel.css";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    minimumPurchase: 0,
    expiryDate: "",
    isActive: true,
    couponType: "public",
    earnCondition: "order_delivered",
    minSpendToEarn: 0,
  });

  const [assignData, setAssignData] = useState({
    email: "",
    reason: "",
    discountType: "percentage",
    discountValue: 10,
    expiryDate: "",
    description: "",
  });

  // Force localhost for development
  const API_URL =
    window.location.hostname === "localhost"
      ? "https://3-d-backend-3pgu.vercel.app"
      : import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const [couponsRes, templatesRes] = await Promise.all([
        axios.get(`${API_URL}/api/coupons`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/coupons/templates`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const allCoupons = [
        ...(couponsRes.data || []),
        ...(templatesRes.data?.templates || []),
      ];
      setCoupons(allCoupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      const dataToSend = { ...formData };

      // Auto-generate code for earned coupons
      if (formData.couponType === "earned" && !formData.code) {
        dataToSend.code = `REWARD${Date.now().toString(36).toUpperCase()}`;
      } else {
        dataToSend.code = formData.code.toUpperCase();
      }

      if (editingId) {
        await axios.put(`${API_URL}/api/coupons/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Coupon updated!");
      } else {
        await axios.post(`${API_URL}/api/coupons`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Coupon created!");
      }
      resetForm();
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleAssignPrivate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${API_URL}/api/coupons/assign-private`,
        assignData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message || "Coupon assigned successfully!");
      setShowAssignModal(false);
      setAssignData({
        email: "",
        reason: "",
        discountType: "percentage",
        discountValue: 10,
        expiryDate: "",
        description: "",
      });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign coupon");
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumPurchase: coupon.minimumPurchase || 0,
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      isActive: coupon.isActive,
      couponType: coupon.couponType || "public",
      earnCondition: coupon.earnCondition || "order_delivered",
      minSpendToEarn: coupon.minSpendToEarn || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`${API_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCoupons();
    } catch (error) {
      alert("Failed to delete coupon");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minimumPurchase: 0,
      expiryDate: "",
      isActive: true,
      couponType: "public",
      earnCondition: "order_delivered",
      minSpendToEarn: 0,
    });
    setEditingId(null);
    setShowModal(false);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "No expiry";

  const getCouponTypeBadge = (coupon) => {
    const badges = {
      public: { bg: "#28a745", label: "🌍 Public" },
      earned: {
        bg: "#ffc107",
        label: coupon.isTemplate ? "🎯 Earn Template" : "🎯 Earned",
      },
      private: { bg: "#6c757d", label: "🔒 Private" },
      welcome: { bg: "#17a2b8", label: "👋 Welcome" },
    };
    const badge = badges[coupon.couponType] || badges.public;
    return (
      <span
        style={{
          backgroundColor: badge.bg,
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.75rem",
        }}
      >
        {badge.label}
      </span>
    );
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>🎫 Manage Coupons</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-primary"
            onClick={() => setShowAssignModal(true)}
          >
            🎁 Assign to User
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Coupon
          </button>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          backgroundColor: "#e7f3ff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h4>📋 Coupon Types:</h4>
        <ul style={{ margin: "10px 0 0", paddingLeft: "20px" }}>
          <li>
            <strong>🌍 Public:</strong> Available to everyone, no code needed to
            find
          </li>
          <li>
            <strong>🎯 Earned:</strong> Auto-generated unique codes for each
            user when order is delivered
          </li>
          <li>
            <strong>🔒 Private:</strong> Assign to specific user by email with
            custom message
          </li>
        </ul>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Type</th>
              <th>Earn Condition</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <strong>{coupon.code}</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {coupon.description}
                    </small>
                    {coupon.assignedUserEmail && (
                      <>
                        <br />
                        <small style={{ color: "#007bff" }}>
                          → {coupon.assignedUserEmail}
                        </small>
                      </>
                    )}
                  </td>
                  <td>
                    {coupon.discountType === "percentage"
                      ? `£${coupon.discountValue}%`
                      : `£${coupon.discountValue}`}
                  </td>
                  <td>{getCouponTypeBadge(coupon)}</td>
                  <td>
                    {coupon.couponType === "earned" && coupon.isTemplate ? (
                      <small>
                        On ${coupon.minSpendToEarn}+ order delivered
                      </small>
                    ) : coupon.couponType === "private" ? (
                      <small>{coupon.assignmentReason || "Manual"}</small>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{formatDate(coupon.expiryDate)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        coupon.isActive ? "active" : "inactive"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(coupon)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(coupon._id)}
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

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "550px", maxHeight: "85vh", overflow: "auto" }}
          >
            <h3>{editingId ? "Edit Coupon" : "Create Coupon"}</h3>
            <form onSubmit={handleSubmit}>
              {/* Coupon Type */}
              <div
                className="form-group"
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Coupon Type *
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[
                    {
                      value: "public",
                      label: "🌍 Public",
                      desc: "For everyone",
                    },
                    {
                      value: "earned",
                      label: "🎯 Earned",
                      desc: "On order delivery",
                    },
                  ].map((type) => (
                    <label
                      key={type.value}
                      style={{
                        flex: "1",
                        minWidth: "140px",
                        padding: "10px",
                        border:
                          formData.couponType === type.value
                            ? "2px solid #514F6E"
                            : "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor:
                          formData.couponType === type.value
                            ? "#f0f0ff"
                            : "white",
                      }}
                    >
                      <input
                        type="radio"
                        name="couponType"
                        value={type.value}
                        checked={formData.couponType === type.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couponType: e.target.value,
                          })
                        }
                        style={{ display: "none" }}
                      />
                      <div style={{ fontWeight: "bold" }}>{type.label}</div>
                      <small style={{ color: "#666" }}>{type.desc}</small>
                    </label>
                  ))}
                </div>
              </div>

              {/* Earned Coupon Settings */}
              {formData.couponType === "earned" && (
                <div
                  style={{
                    backgroundColor: "#fff3cd",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <p style={{ margin: "0 0 10px", fontWeight: "bold" }}>
                    🎯 Earned Coupon Settings
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#856404",
                      margin: "0 0 10px",
                    }}
                  >
                    Each user will get a unique code when their order is
                    delivered.
                  </p>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Min Order Total to Earn ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minSpendToEarn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minSpendToEarn: parseFloat(e.target.value) || 0,
                      })
                    }
                    style={{ width: "100%", padding: "10px" }}
                  />
                </div>
              )}

              {/* Code - only for public */}
              {formData.couponType === "public" && (
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    required
                    placeholder="SUMMER20"
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Summer sale!"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: parseFloat(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />{" "}
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

      {/* Assign Private Coupon Modal */}
      {showAssignModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAssignModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <h3>🎁 Assign Private Coupon to User</h3>
            <form onSubmit={handleAssignPrivate}>
              <div className="form-group">
                <label>User Email *</label>
                <input
                  type="email"
                  value={assignData.email}
                  onChange={(e) =>
                    setAssignData({ ...assignData, email: e.target.value })
                  }
                  required
                  placeholder="user@example.com"
                />
              </div>

              <div className="form-group">
                <label>Reason (shown to user)</label>
                <textarea
                  value={assignData.reason}
                  onChange={(e) =>
                    setAssignData({ ...assignData, reason: e.target.value })
                  }
                  placeholder="Thank you for being a loyal customer!"
                  rows="2"
                  style={{ width: "100%", padding: "10px" }}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={assignData.description}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Special gift coupon"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    value={assignData.discountType}
                    onChange={(e) =>
                      setAssignData({
                        ...assignData,
                        discountType: e.target.value,
                      })
                    }
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    value={assignData.discountValue}
                    onChange={(e) =>
                      setAssignData({
                        ...assignData,
                        discountValue: parseFloat(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={assignData.expiryDate}
                  onChange={(e) =>
                    setAssignData({ ...assignData, expiryDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Assign Coupon
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
