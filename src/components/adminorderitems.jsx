// components/AdminOrderItems.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminOrderItems() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "all", search: "" });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = "admin123"; // matches backend admin auth in routes/adminorders.js
      const res = await axios.get(
        `https://3-d-backend-3pgu.vercel.app/api/admin/orders?page=1&limit=100&status=${filters.status}&search=${filters.search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data?.orders || []);
    } catch (err) {
      setError("Failed to load order items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  const items = useMemo(() => {
    const list = [];
    for (const order of orders) {
      for (const it of order.items || []) {
        list.push({
          _id: `${order._id}-${it.product?._id || it._id}`,
          orderId: order._id,
          orderNo: order.orderNo,
          status: order.status,
          createdAt: order.createdAt,
          customer: {
            name: order.user?.name || "Unknown",
            email: order.user?.email || "",
          },
          product: {
            id: it.product?._id,
            title: it.product?.title || "(deleted product)",
            imageUrl: it.product?.imageUrl,
          },
          price: it.price,
          quantity: it.quantity,
          total: (Number(it.price) || 0) * (Number(it.quantity) || 0),
        });
      }
    }
    return list;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) =>
        x.product.title.toLowerCase().includes(q) ||
        String(x.orderNo).toLowerCase().includes(q) ||
        x.customer.name.toLowerCase().includes(q)
    );
  }, [items, filters.search]);

  return (
    <div>
      <h2>Order Items</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product, order no, or customer"
            value={filters.search}
            onChange={(e) =>
              setFilters((p) => ({ ...p, search: e.target.value }))
            }
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-secondary w-100"
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-danger">{error}</div>
      ) : loading ? (
        <div className="text-muted">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted">No items found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order No</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it._id}>
                  <td>{it.orderNo}</td>
                  <td>
                    {it.product.title}
                    {it.product.imageUrl && (
                      <img
                        src={it.product.imageUrl}
                        alt={it.product.title}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 6,
                          marginLeft: 8,
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </td>
                  <td>${it.price}</td>
                  <td>{it.quantity}</td>
                  <td>
                    <strong>${it.total}</strong>
                  </td>
                  <td>
                    {it.customer.name}
                    <br />
                    <small className="text-muted">{it.customer.email}</small>
                  </td>
                  <td>{it.status}</td>
                  <td>
                    {new Date(it.createdAt).toLocaleDateString()}
                    <br />
                    <small className="text-muted">
                      {new Date(it.createdAt).toLocaleTimeString()}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrderItems;
