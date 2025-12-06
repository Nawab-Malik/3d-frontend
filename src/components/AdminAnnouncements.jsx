import { useState, useEffect } from "react";
import axios from "axios";
import "./adminpanel.css";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    message: "",
    backgroundColor: "#6366f1",
    textColor: "#ffffff",
    link: { url: "", text: "" },
    isActive: true,
    isDismissible: true,
    priority: 1,
  });

  const API_URL =
    import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");

      if (editingId) {
        await axios.put(`${API_URL}/api/announcements/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Announcement updated!");
      } else {
        await axios.post(`${API_URL}/api/announcements`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Announcement created!");
      }

      resetForm();
      fetchAnnouncements();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save announcement");
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      message: announcement.message,
      backgroundColor: announcement.backgroundColor || "#6366f1",
      textColor: announcement.textColor || "#ffffff",
      link: announcement.link || { url: "", text: "" },
      isActive: announcement.isActive,
      isDismissible: announcement.isDismissible,
      priority: announcement.priority || 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`${API_URL}/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnnouncements();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.patch(
        `${API_URL}/api/announcements/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAnnouncements();
    } catch (error) {
      alert("Failed to toggle status");
    }
  };

  const resetForm = () => {
    setFormData({
      message: "",
      backgroundColor: "#6366f1",
      textColor: "#ffffff",
      link: { url: "", text: "" },
      isActive: true,
      isDismissible: true,
      priority: 1,
    });
    setEditingId(null);
    setShowModal(false);
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>📢 Announcements</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Announcement
        </button>
      </div>

      {/* Info Banner */}
      <div
        style={{
          background: "#e0f2fe",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "1px solid #7dd3fc",
        }}
      >
        <p style={{ margin: 0, color: "#0369a1" }}>
          💡 <strong>Tip:</strong> Only one announcement shows at a time. The
          one with highest priority will be displayed as a popup on the
          homepage.
        </p>
      </div>

      {/* Announcements List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {announcements.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              background: "white",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "48px" }}>📭</span>
            <h3>No Announcements Yet</h3>
            <p style={{ color: "#666" }}>
              Create your first announcement to engage visitors!
            </p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann._id}
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                border: ann.isActive
                  ? "2px solid #22c55e"
                  : "1px solid #e5e7eb",
              }}
            >
              {/* Preview Banner */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${
                    ann.backgroundColor || "#6366f1"
                  } 0%, ${adjustColor(
                    ann.backgroundColor || "#6366f1",
                    -30
                  )} 100%)`,
                  padding: "20px 25px",
                  color: ann.textColor || "white",
                }}
              >
                <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                  {ann.message}
                </p>
                {ann.link?.text && (
                  <span
                    style={{
                      marginTop: "8px",
                      display: "inline-block",
                      opacity: 0.85,
                      fontSize: "0.9rem",
                    }}
                  >
                    🔗 {ann.link.text}
                  </span>
                )}
              </div>

              {/* Controls */}
              <div
                style={{
                  padding: "15px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      background: ann.isActive ? "#dcfce7" : "#f3f4f6",
                      color: ann.isActive ? "#166534" : "#6b7280",
                    }}
                  >
                    {ann.isActive ? "✅ Active" : "⏸️ Inactive"}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                    Priority: {ann.priority}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-edit"
                    onClick={() => handleToggleActive(ann._id)}
                  >
                    {ann.isActive ? "Pause" : "Activate"}
                  </button>
                  <button className="btn-edit" onClick={() => handleEdit(ann)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(ann._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "520px" }}
          >
            <h3 style={{ marginBottom: "25px" }}>
              {editingId ? "✏️ Edit Announcement" : "✨ Create Announcement"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows="3"
                  placeholder="🎉 Welcome! Get 20% off your first order..."
                  style={{ fontSize: "1rem" }}
                />
              </div>

              {/* Colors */}
              <div className="form-row">
                <div className="form-group">
                  <label>Background Color</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backgroundColor: e.target.value,
                        })
                      }
                      style={{
                        width: "50px",
                        height: "40px",
                        cursor: "pointer",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backgroundColor: e.target.value,
                        })
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Text Color</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) =>
                        setFormData({ ...formData, textColor: e.target.value })
                      }
                      style={{
                        width: "50px",
                        height: "40px",
                        cursor: "pointer",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) =>
                        setFormData({ ...formData, textColor: e.target.value })
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Link */}
              <div className="form-row">
                <div className="form-group">
                  <label>Link URL</label>
                  <input
                    type="url"
                    value={formData.link.url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        link: { ...formData.link, url: e.target.value },
                      })
                    }
                    placeholder="https://yoursite.com/sale"
                  />
                </div>
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={formData.link.text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        link: { ...formData.link, text: e.target.value },
                      })
                    }
                    placeholder="Shop Now"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Priority (Higher = Shows First)</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 1,
                    })
                  }
                  min="1"
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
                <label style={{ marginLeft: "20px" }}>
                  <input
                    type="checkbox"
                    checked={formData.isDismissible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isDismissible: e.target.checked,
                      })
                    }
                  />{" "}
                  Can be dismissed
                </label>
              </div>

              {/* Live Preview */}
              <div style={{ marginTop: "20px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  📱 Preview
                </label>
                <div
                  style={{
                    background: `linear-gradient(135deg, ${
                      formData.backgroundColor
                    } 0%, ${adjustColor(formData.backgroundColor, -30)} 100%)`,
                    padding: "25px",
                    borderRadius: "12px",
                    color: formData.textColor,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                    🎉
                  </div>
                  <p
                    style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}
                  >
                    {formData.message || "Your message here..."}
                  </p>
                  {formData.link.text && (
                    <button
                      type="button"
                      style={{
                        marginTop: "15px",
                        padding: "10px 25px",
                        background: "white",
                        color: formData.backgroundColor,
                        border: "none",
                        borderRadius: "25px",
                        fontWeight: "600",
                        cursor: "default",
                      }}
                    >
                      {formData.link.text} →
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "25px" }}>
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

// Helper
function adjustColor(color, amount) {
  if (!color) return "#4f46e5";
  let c = color.startsWith("#") ? color.slice(1) : color;
  if (c.length !== 6) return "#4f46e5";
  const num = parseInt(c, 16);
  let r = Math.max(0, Math.min(255, (num >> 16) + amount));
  let g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  let b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

export default AdminAnnouncements;
