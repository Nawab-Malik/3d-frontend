import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    fetchSubscriptions();
  }, [filter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      const params = filter !== "all" ? `?isActive=${filter === "active"}` : "";
      const response = await axios.get(
        `${API_URL}/api/subscriptions${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle 204 No Content or empty responses
      if (response.status === 204 || !response.data) {
        console.warn("API returned no subscriptions (204 No Content)");
        setSubscriptions([]);
        setError("No subscriptions available. Check your backend API.");
      } else if (Array.isArray(response.data)) {
        // Case 1: API returns a raw array
        setSubscriptions(response.data);
      } else if (
        response.data.subscriptions &&
        Array.isArray(response.data.subscriptions)
      ) {
        // Case 2: API returns { subscriptions: [...] }
        setSubscriptions(response.data.subscriptions);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Case 3: API returns { data: [...] }
        setSubscriptions(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setSubscriptions([]);
        setError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError(
        error.response?.data?.message || "Failed to fetch subscriptions"
      );
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?"))
      return;

    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`${API_URL}/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Subscription deleted successfully!");
      fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      alert("Failed to delete subscription");
    }
  };

  // Calculate filtered subscriptions here (before exportToCSV can use it)
  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToCSV = () => {
    const headers = [
      "Email",
      "Name",
      "Source",
      "Discount Code",
      "Status",
      "Subscribed Date",
    ];
    const rows = filteredSubscriptions.map((sub) => [
      sub.email,
      sub.name || "N/A",
      sub.source,
      sub.discountCode || "N/A",
      sub.isActive ? "Active" : "Unsubscribed",
      new Date(sub.subscribedAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading)
    return <div className="admin-loading">Loading subscriptions...</div>;

  if (error) {
    return (
      <div className="admin-section">
        <div style={{ padding: "20px", color: "#d32f2f", textAlign: "center" }}>
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchSubscriptions}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="admin-section">
        <div className="admin-header">
          <h2>📧 Email Subscriptions</h2>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <p>No subscriptions found yet.</p>
        </div>
      </div>
    );
  }

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
          <h3>{subscriptions.filter((s) => s.isActive).length}</h3>
          <p>Active Subscribers</p>
        </div>
        <div className="stat-card">
          <h3>{subscriptions.filter((s) => !s.isActive).length}</h3>
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
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No subscriptions match your search.
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <tr key={subscription._id}>
                  <td>{subscription.email}</td>
                  <td>{subscription.name || "N/A"}</td>
                  <td>
                    <span className={`badge badge-${subscription.source}`}>
                      {subscription.source}
                    </span>
                  </td>
                  <td>
                    {subscription.discountCode ? (
                      <code>{subscription.discountCode}</code>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        subscription.isActive ? "active" : "inactive"
                      }`}
                    >
                      {subscription.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td>
                    {new Date(subscription.subscribedAt).toLocaleDateString()}
                  </td>
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
