// components/AdminOrders.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  const statusColors = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-white",
    processing: "bg-primary text-white",
    shipped: "bg-secondary text-white",
    delivered: "bg-success text-white",
    cancelled: "bg-danger text-white",
    refunded: "bg-dark text-white",
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = "admin123";
      const response = await axios.get(
        `https://3-d-backend-3pgu.vercel.app/api/admin/orders?page=${currentPage}&limit=10&status=${filters.status}&search=${filters.search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = "admin123";
      await axios.put(
        `https://3-d-backend-3pgu.vercel.app/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order status updated successfully");
      fetchOrders(); // Refresh orders
      setSelectedOrder(null); // Close modal
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = "admin123";
      await axios.delete(
        `https://3-d-backend-3pgu.vercel.app/api/admin/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order deleted successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  return (
    <div>
      <h2>Orders Management</h2>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
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
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by order number or customer name..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={fetchOrders}>
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Discount</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>{order.orderNo}</strong>
                </td>
                <td>
                  {order.user?.name || "Unknown User"}
                  <br />
                  <small className="text-muted">{order.user?.email}</small>
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </small>
                </td>
                <td>
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items
                </td>
                <td>${order.discount || 0}</td>
                <td>
                  <strong>${order.grandTotal}</strong>
                </td>
                <td>
                  <span
                    className={`badge ${
                      statusColors[order.status] || "bg-secondary"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => setSelectedOrder(order)}
                    title="View Details"
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteOrder(order._id)}
                    title="Delete Order"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order Details - {selectedOrder.orderNo}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Customer Info */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p>
                      <strong>Name:</strong> {selectedOrder.user?.name || "N/A"}
                      <br />
                      <strong>Email:</strong>{" "}
                      {selectedOrder.user?.email || "N/A"}
                      <br />
                      <strong>Phone:</strong>{" "}
                      {selectedOrder.shippingAddress?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Shipping Address</h6>
                    <p>
                      {selectedOrder.shippingAddress?.firstName}{" "}
                      {selectedOrder.shippingAddress?.lastName}
                      <br />
                      {selectedOrder.shippingAddress?.address}
                      <br />
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state}{" "}
                      {selectedOrder.shippingAddress?.zipCode}
                      <br />
                      {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <h6>Order Items</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.product?.title || "Product Not Available"}
                          {item.product?.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginLeft: "10px",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                        </td>
                        <td>${item.price}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Order Summary */}
                <div className="row">
                  <div className="col-md-6">
                    <h6>Payment Information</h6>
                    <p>
                      <strong>Method:</strong> {selectedOrder.paymentMethod}
                      <br />
                      <strong>Status:</strong> {selectedOrder.paymentStatus}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Order Summary</h6>
                    <p>
                      <strong>Subtotal:</strong> £{selectedOrder.subtotal}
                      <br />
                      <strong>Discount:</strong> £{selectedOrder.discount || 0}
                      <br />
                      <strong>Tax:</strong> £{selectedOrder.tax || 0}
                      <br />
                      <strong>Grand Total:</strong> £{selectedOrder.grandTotal}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-3">
                  <h6>Update Status</h6>
                  <select
                    className="form-select"
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(selectedOrder._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
