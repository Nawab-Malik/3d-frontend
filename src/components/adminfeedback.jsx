import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        "https://3-d-backend-3pgu.vercel.app/api/feedback"
      );
      setItems(res.data?.feedback || []);
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const token = localStorage.getItem("userToken");

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await axios.delete(
        `https://3-d-backend-3pgu.vercel.app/api/feedback/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchFeedback();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Delete ALL feedback? This cannot be undone.")) return;
    try {
      setClearing(true);
      await axios.delete("https://3-d-backend-3pgu.vercel.app/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchFeedback();
    } catch (err) {
      alert("Clear all failed");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h2 className="mb-0">General Feedback</h2>
          <small className="text-muted">
            Site-wide feedback from customers
          </small>
        </div>
        <button
          className="btn btn-danger"
          onClick={clearAll}
          disabled={clearing}
        >
          {clearing ? "Clearing..." : "Clear All"}
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-muted">No feedback yet.</div>
      ) : (
        <div className="list-group">
          {items.map((fb) => {
            const displayName =
              fb?.user?.name || (fb?.email || "").split("@")[0] || "Customer";
            const initial = displayName.substring(0, 1).toUpperCase();
            return (
              <div
                key={fb._id}
                className="list-group-item d-flex align-items-center gap-3"
              >
                {fb.avatarUrl ? (
                  <img
                    src={fb.avatarUrl}
                    alt="Avatar"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#e9e9ef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontWeight: 600,
                    }}
                  >
                    {initial}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{displayName}</div>
                  <div style={{ fontSize: 13, color: "#6b6b6b" }}>
                    {new Date(fb.createdAt).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                    {fb.message}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteOne(fb._id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;
