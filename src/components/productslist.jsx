import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductsList = ({ products = [], onBuyNow }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productsPerPage = 6;
  const navigate = useNavigate();

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          fontSize: "1.5rem",
          color: "#777",
          userSelect: "none",
        }}
      >
        No products found.
      </div>
    );
  }

  // Function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "http://localhost:5000/uploads/default-product.png";
    const s = String(imageUrl);
    if (
      s.startsWith("http") ||
      s.startsWith("blob:") ||
      s.startsWith("data:") ||
      s.startsWith("/assets") ||
      s.startsWith("/images") ||
      s.startsWith("/src")
    ) {
      return s;
    }
    if (s.startsWith("/uploads")) {
      return `http://localhost:5000${s}`;
    }
    return `http://localhost:5000/uploads/${s}`;
  };

  // Toggle description expansion
  const toggleDescription = (productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Handle Buy Now button click
  const handleBuyNowClick = async (product) => {
    setLoadingProductId(product._id);

    try {
      // Call the function passed from parent component
      if (onBuyNow && typeof onBuyNow === "function") {
        await onBuyNow(product);
      }
    } catch (error) {
      console.error("Error in buy now:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          fontFamily: "Staatliches, sans-serif",
          lineHeight: "1.2",
          fontSize: "72px",
          textAlign: "center",
          textTransform: "uppercase",
          marginTop: "30px",
          marginBottom: "30px",
          userSelect: "none",
          color: "black",
        }}
      >
        OUR PRODUCTS
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "30px",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.7rem",
        }}
      >
        {currentProducts.map((prod) => (
          <div
            key={prod._id}
            className="tilt reveal-on-scroll sr-zoom"
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              userSelect: "none",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              height: "100%",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(81, 79, 110, 0.2)";
              e.currentTarget.style.borderColor = "#514F6E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "#ddd";
            }}
          >
            {/* Loading overlay */}
            {loadingProductId === prod._id && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  borderRadius: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #f3f3f3",
                    borderTop: "3px solid #514F6E",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
              </div>
            )}

            {/* Image Container with Fixed Aspect Ratio */}
            <div
              style={{
                width: "100%",
                height: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f9f9f9",
                overflow: "hidden",
                position: "relative",
              }}
              onClick={() => navigate(`/products/${prod._id}`)}
              role="button"
            >
              <img
                src={getImageUrl(prod.imageUrl)}
                alt={prod.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "15px",
                  cursor: "pointer",
                }}
                onError={(e) => {
                  e.target.src =
                    "http://localhost:5000/uploads/default-product.png";
                }}
              />
            </div>

            {/* Product Info */}
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "1.4rem",
                  marginBottom: "12px",
                  color: "black",
                  lineHeight: "1.3",
                  minHeight: "3.6rem",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                onClick={() => navigate(`/products/${prod._id}`)}
                role="button"
              >
                {prod.title}
              </h3>

              {/* Categories */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "12px",
                  userSelect: "none",
                  maxHeight: "60px",
                  overflow: "hidden",
                }}
              >
                {(prod.categories || []).slice(0, 8).map((cat, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      cursor: "default",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      userSelect: "none",
                      backgroundColor: "#f0f0f0",
                      color: "#514F6E",
                      border: "1px solid #d3d3d3",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "120px",
                    }}
                    title={cat}
                  >
                    {cat}
                  </div>
                ))}
              </div>

              {/* Description with Read More functionality */}
              <div style={{ marginBottom: "15px", flexGrow: 1 }}>
                <p
                  style={{
                    color: "#777777",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    marginBottom: "8px",
                    display: "-webkit-box",
                    WebkitLineClamp: expandedDescriptions[prod._id]
                      ? "unset"
                      : "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "60px",
                  }}
                >
                  {prod.description}
                </p>
                {prod.description && prod.description.length > 150 && (
                  <button
                    onClick={() => toggleDescription(prod._id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#514F6E",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    {expandedDescriptions[prod._id] ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Price */}
              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>${prod.price}</span>
                {prod.originalPrice && prod.originalPrice > prod.price && (
                  <span
                    style={{
                      color: "#999999",
                      fontWeight: "400",
                      fontSize: "0.85rem",
                      textDecoration: "line-through",
                      userSelect: "none",
                    }}
                  >
                    ${prod.originalPrice}
                  </span>
                )}
              </div>

              {/* Buy Now Button */}
              <button
                style={{
                  background:
                    loadingProductId === prod._id
                      ? "#9C98D4"
                      : "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor:
                    loadingProductId === prod._id ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  userSelect: "none",
                  width: "100%",
                  transition: "background-color 0.3s ease",
                  marginTop: "auto",
                  opacity: loadingProductId === prod._id ? 0.7 : 1,
                }}
                onClick={() => handleBuyNowClick(prod)}
                disabled={loadingProductId === prod._id}
                onMouseEnter={(e) => {
                  if (loadingProductId !== prod._id) {
                    e.currentTarget.style.background =
                      "linear-gradient(90deg, #3a3551 0%, #7f7ac2 100%)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (loadingProductId !== prod._id) {
                    e.currentTarget.style.background =
                      "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)";
                  }
                }}
              >
                {loadingProductId === prod._id ? (
                  <>
                    Adding...
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid #f3f3f3",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                  </>
                ) : (
                  <>
                    Buy Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      style={{ marginLeft: "4px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: currentPage === 1 ? "#ccc" : "#514F6E",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              style={{
                padding: "8px 12px",
                backgroundColor: currentPage === page ? "#514F6E" : "white",
                color: currentPage === page ? "white" : "#514F6E",
                border: "1px solid #514F6E",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              backgroundColor: currentPage === totalPages ? "#ccc" : "#514F6E",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = "#3a3551";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = "#514F6E";
              }
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Products count info */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#777",
          fontSize: "0.9rem",
        }}
      >
        Showing {indexOfFirstProduct + 1}-
        {Math.min(indexOfLastProduct, products.length)} of {products.length}{" "}
        products
      </div>

      {/* CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductsList;
