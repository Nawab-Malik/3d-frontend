// components/AdminPanel.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./productform";

function AdminPanel({ onLogout }) {
  const [activeSection, setActiveSection] = useState("product-management");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeSection === "product-management") {
      fetchProducts();
    } else if (
      activeSection === "order-management" ||
      activeSection === "order-items"
    ) {
      fetchOrders();
    }
  }, [activeSection]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admin/products",
        {
          headers: {
            Authorization: "Bearer admin123",
          },
        }
      );
      console.log('Admin: Fetched products:', response.data);
      console.log('Admin: Products with variations:', response.data.filter(p => p.hasVariations));
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response && error.response.status === 401) {
        alert("Authentication failed. Please log in again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: "Bearer admin123",
          },
        }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders. Please try again.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
          headers: {
            Authorization: "Bearer admin123",
          },
        });
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: "Bearer admin123",
          },
        }
      );
      fetchOrders(); // Refresh orders
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  const renderProductsManagement = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border"></div>
        </div>
      );
    }

    return (
      <>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
          <h2 className="mb-0">Product Management</h2>

          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add New Product
          </button>
        </div>

        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
            onSave={fetchProducts}
          />
        )}

        {products.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              No products found. Add your first product!
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Categories</th>
                  <th>Variations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={`http://localhost:5000${product.imageUrl}`}
                        alt={product.title}
                        className="img-thumbnail"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "http://localhost:5000/uploads/default-product.png";
                        }}
                      />
                    </td>
                    <td className="align-middle">{product.title}</td>
                    <td className="align-middle">${product.price}</td>
                    <td className="align-middle">
                      {product.categories.join(", ")}
                    </td>
                    <td className="align-middle">
                      {product.hasVariations && product.variations?.length > 0 ? (
                        <span className="badge bg-primary">
                          {product.variations.length} variation{product.variations.length !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">No variations</span>
                      )}
                    </td>
                    <td className="align-middle">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-sm btn-success me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  const renderOrderManagement = () => {
    if (ordersLoading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border"></div>
        </div>
      );
    }

    return (
      <>
        <h2 className="mb-4">Order Management</h2>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No orders found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="align-middle">{order.orderNo}</td>
                    <td className="align-middle">
                      {order.user?.name || "Guest"}
                    </td>
                    <td className="align-middle">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="align-middle">
                      {order.items.length} item(s)
                    </td>
                    <td className="align-middle">
                      ${order.grandTotal?.toFixed(2)}
                    </td>
                    <td className="align-middle">
                      <span
                        className={`badge ${
                          order.status === "delivered"
                            ? "bg-success"
                            : order.status === "cancelled" ||
                              order.status === "refunded"
                            ? "bg-danger"
                            : order.status === "processing"
                            ? "bg-primary"
                            : order.status === "shipped"
                            ? "bg-warning"
                            : "bg-secondary"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="align-middle">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="form-select form-select-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  const renderOrderItems = () => {
    return (
      <div>
        <h2 className="mb-4">Order Items Details</h2>
        <p className="text-muted">
          This section would show detailed information about order items.
        </p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "product-management":
        return renderProductsManagement();
      case "order-management":
        return renderOrderManagement();
      case "order-items":
        return renderOrderItems();
      default:
        return renderProductsManagement();
    }
  };

  return (
    <div
      className="flex-grow-1 p-3 overflow-auto"
      style={{ marginLeft: "0" }}
    >
      <div className="container-fluid">{renderProductsManagement()}</div>
    </div>
  );
}

export default AdminPanel;
