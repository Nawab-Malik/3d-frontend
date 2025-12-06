import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminProductFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        "https://3-d-backend-3pgu.vercel.app/api/product-feedback/all"
      );
      setItems(res.data?.feedback || []);
    } catch (err) {
      setError("Failed to load product reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const token = localStorage.getItem("userToken");

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(
        `https://3-d-backend-3pgu.vercel.app/api/product-feedback/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchFeedback();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#FFD700" : "#ddd",
            fontSize: "16px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl)
      return "https://3-d-backend-3pgu.vercel.app/uploads/default-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/uploads"))
      return `https://3-d-backend-3pgu.vercel.app${imageUrl}`;
    return `https://3-d-backend-3pgu.vercel.app/uploads/${imageUrl}`;
  };

  // Filter items based on product title
  const filteredItems = filter
    ? items.filter((fb) =>
        fb.product?.title?.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  // Group by product
  const groupedByProduct = filteredItems.reduce((acc, fb) => {
    const productId = fb.product?._id || "unknown";
    if (!acc[productId]) {
      acc[productId] = {
        product: fb.product,
        reviews: [],
      };
    }
    acc[productId].reviews.push(fb);
    return acc;
  }, {});

  return (
    <div style={{ padding: 20 }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h2 className="mb-0">Product Reviews</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Filter by product name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              width: "250px",
            }}
          />
          <span style={{ color: "#666", fontSize: "14px" }}>
            {filteredItems.length} review{filteredItems.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : Object.keys(groupedByProduct).length === 0 ? (
        <div className="text-muted">No product reviews yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {Object.values(groupedByProduct).map(({ product, reviews }) => (
            <div
              key={product?._id || "unknown"}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Product Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  background: "#f8f9fa",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <img
                  src={getImageUrl(product?.imageUrl)}
                  alt={product?.title}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "contain",
                    borderRadius: "8px",
                    background: "#fff",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://3-d-backend-3pgu.vercel.app/uploads/default-product.png";
                  }}
                />
                <div>
                  <h4 style={{ margin: 0 }}>
                    {product?.title || "Unknown Product"}
                  </h4>
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""} •
                    Avg:{" "}
                    {(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)}{" "}
                    ★
                  </span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="list-group list-group-flush">
                {reviews.map((fb) => {
                  const displayName =
                    fb?.userName ||
                    fb?.user?.name ||
                    (fb?.email || "").split("@")[0] ||
                    "Customer";
                  const initial = displayName.substring(0, 1).toUpperCase();
                  return (
                    <div
                      key={fb._id}
                      className="list-group-item d-flex align-items-start gap-3"
                      style={{ padding: "16px" }}
                    >
                      {fb.avatarUrl ? (
                        <img
                          src={fb.avatarUrl}
                          alt="Avatar"
                          style={{
                            width: 44,
                            height: 44,
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
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "#e9e9ef",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#666",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {initial}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{displayName}</span>
                          <span>{renderStars(fb.rating)}</span>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#6b6b6b",
                            marginBottom: "6px",
                          }}
                        >
                          {fb.email} • {new Date(fb.createdAt).toLocaleString()}
                        </div>
                        <div style={{ whiteSpace: "pre-wrap", color: "#333" }}>
                          {fb.message}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteOne(fb._id)}
                        style={{ flexShrink: 0 }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProductFeedback;
