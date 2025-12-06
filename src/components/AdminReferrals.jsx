import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    referrerRewardType: "fixed",
    referrerRewardValue: 10,
    referrerRewardDescription: "",
    refereeRewardType: "percentage",
    refereeRewardValue: 10,
    refereeRewardDescription: "",
    minOrderAmount: 0,
    isActive: true,
    programTitle: "Refer & Earn",
    programDescription: "",
  });

  const API_URL = "https://3-d-backend-3pgu.vercel.app";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const [referralsRes, settingsRes] = await Promise.all([
        axios
          .get(`${API_URL}/api/referrals/all`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/referrals/settings`),
      ]);

      setReferrals(referralsRes.data || []);
      if (settingsRes.data?.settings) {
        setSettings(settingsRes.data.settings);
        setSettingsForm(settingsRes.data.settings);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPending = async () => {
    if (
      !confirm("Process all pending referral rewards for delivered orders?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${API_URL}/api/referrals/process-pending`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Processing result:", response.data);
      alert(
        `Success! Processed ${
          response.data.processed?.length || 0
        } pending rewards.`
      );
      fetchData(); // Refresh data
    } catch (error) {
      console.error("❌ Failed to process pending rewards:", error);
      alert(
        "Failed to process pending rewards: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");

      console.log("💾 Saving settings:", settingsForm);
      console.log("🔑 Token:", token ? "Present" : "Missing");

      const response = await axios.put(
        `${API_URL}/api/referrals/settings`,
        settingsForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Settings saved:", response.data);
      alert("Settings saved successfully!");
      setShowSettingsModal(false);
      fetchData();
    } catch (error) {
      console.error("❌ Failed to save settings:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMsg = "Failed to save settings";
      if (error.response?.status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMsg = "Admin access required.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      alert(errorMsg);
    }
  };

  const totalSuccessful = referrals.reduce(
    (acc, ref) => acc + ref.referrals.filter((r) => r.orderPlaced).length,
    0
  );
  const totalPending = referrals.reduce(
    (acc, ref) => acc + ref.referrals.filter((r) => !r.orderPlaced).length,
    0
  );
  const totalEarnings = referrals.reduce(
    (acc, ref) => acc + (ref.totalEarnings || 0),
    0
  );

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>🎁 Referral Program</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-primary"
            onClick={handleProcessPending}
            title="Process pending referral rewards for delivered orders"
          >
            🔄 Process Pending Rewards
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowSettingsModal(true)}
          >
            ⚙️ Configure Rewards
          </button>
        </div>
      </div>

      {/* Current Settings Display */}
      {settings && (
        <div
          style={{
            backgroundColor: "#e7f3ff",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h4>📋 Current Reward Settings:</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <strong>🎉 Referrer Gets:</strong>
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "#28a745",
                  margin: "10px 0",
                }}
              >
                {settings.referrerRewardType === "percentage"
                  ? `£${settings.referrerRewardValue}%`
                  : `£${settings.referrerRewardValue}`}
              </p>
              <small>{settings.referrerRewardDescription}</small>
            </div>
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <strong>🛍️ New User Gets:</strong>
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "#007bff",
                  margin: "10px 0",
                }}
              >
                {settings.refereeRewardType === "percentage"
                  ? `${settings.refereeRewardValue}% OFF`
                  : `$${settings.refereeRewardValue} OFF`}
              </p>
              <small>{settings.refereeRewardDescription}</small>
            </div>
          </div>
          {settings.minOrderAmount > 0 && (
            <p style={{ marginTop: "15px", color: "#666" }}>
              ⚠️ Minimum order: £{settings.minOrderAmount}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>{referrals.length}</h3>
          <p>Active Referrers</p>
        </div>
        <div className="stat-card">
          <h3>{totalSuccessful}</h3>
          <p>Successful Referrals</p>
        </div>
        <div className="stat-card">
          <h3>{totalPending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>£{totalEarnings.toFixed(2)}</h3>
          <p>Total Rewards Given</p>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Referrer</th>
              <th>Code</th>
              <th>Total</th>
              <th>Successful</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {referrals.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No referrals yet
                </td>
              </tr>
            ) : (
              referrals.map((ref) => (
                <tr key={ref._id}>
                  <td>
                    <strong>{ref.referrer?.name || "N/A"}</strong>
                    <br />
                    <small>{ref.referrer?.email}</small>
                  </td>
                  <td>
                    <code>{ref.referralCode}</code>
                  </td>
                  <td>{ref.referrals.length}</td>
                  <td>
                    <span className="badge badge-success">
                      {ref.referrals.filter((r) => r.orderPlaced).length}
                    </span>
                  </td>
                  <td>£{(ref.totalEarnings || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <h3>⚙️ Configure Referral Rewards</h3>
            <form onSubmit={handleSaveSettings}>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <h4>🎉 Referrer Reward (Person who shares)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Reward Type</label>
                    <select
                      value={settingsForm.referrerRewardType}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          referrerRewardType: e.target.value,
                        })
                      }
                    >
                      <option value="fixed">Fixed Amount (£)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Reward Value</label>
                    <input
                      type="number"
                      value={settingsForm.referrerRewardValue}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          referrerRewardValue: parseFloat(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description (shown to users)</label>
                  <input
                    type="text"
                    value={settingsForm.referrerRewardDescription}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        referrerRewardDescription: e.target.value,
                      })
                    }
                    placeholder="e.g., Get $10 for each friend who makes a purchase!"
                  />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#fff3cd",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <h4>🛍️ New User Reward (Person who uses code)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Reward Type</label>
                    <select
                      value={settingsForm.refereeRewardType}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          refereeRewardType: e.target.value,
                        })
                      }
                    >
                      <option value="percentage">Percentage Off (%)</option>
                      <option value="fixed">Fixed Amount Off (£)</option>
                      <option value="none">No Reward</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Reward Value</label>
                    <input
                      type="number"
                      value={settingsForm.refereeRewardValue}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          refereeRewardValue: parseFloat(e.target.value),
                        })
                      }
                      min="0"
                      disabled={settingsForm.refereeRewardType === "none"}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={settingsForm.refereeRewardDescription}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        refereeRewardDescription: e.target.value,
                      })
                    }
                    placeholder="e.g., Get 10% off your first order!"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum Order Amount for Reward ($)</label>
                <input
                  type="number"
                  value={settingsForm.minOrderAmount}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      minOrderAmount: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Program Title</label>
                <input
                  type="text"
                  value={settingsForm.programTitle}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      programTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Program Description</label>
                <textarea
                  value={settingsForm.programDescription}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      programDescription: e.target.value,
                    })
                  }
                  rows="2"
                  style={{ width: "100%", padding: "10px" }}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settingsForm.isActive}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  Referral Program Active
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowSettingsModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferrals;
