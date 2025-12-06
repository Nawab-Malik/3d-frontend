import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://3-d-backend-3pgu.vercel.app/api/cart"
      );
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(
        `https://3-d-backend-3pgu.vercel.app/api/cart/${productId}`
      );
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item", error);
      alert("Failed to remove item from cart.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div
          style={{ padding: "20px", paddingTop: "160px", minHeight: "60vh" }}
        >
          <h2>Your Cart</h2>
          <p>No items in cart.</p>
          <button
            onClick={() => navigate("/products")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              zIndex: 10,
              position: "relative",
            }}
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "20px",
          paddingTop: "220px",
          paddingBottom: "190px",
          minHeight: "calc(100vh - 160px - 80px)",
        }}
      >
        {/* Centered Title + Paragraph */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              fontFamily: "Staatliches, sans-serif",
              lineHeight: "1.2",
              fontSize: "72px",
              textAlign: "center",
              textTransform: "uppercase",
              color: "#333",
              marginBottom: "10px",
            }}
          >
            Your Cart
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#777",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.5",
            }}
          >
            Review the products in your cart before proceeding to checkout.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0.7rem",
          }}
        >
          {cartItems.map(({ product, quantity }) => {
            if (!product) return null;

            return (
              <div
                key={product._id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  border: "1px solid #ddd",
                  flex: "1 1 calc(33.333% - 30px)",
                  maxWidth: "386px",
                  minWidth: "280px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  userSelect: "none",
                  transition:
                    "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div
                  style={{
                    padding: "15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: "25px 25px 30px 25px",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "700",
                      fontSize: "1.5rem",
                      marginBottom: "10px",
                      color: "black",
                    }}
                  >
                    {product.title}
                  </h3>

                  <p
                    style={{
                      color: "#777777",
                      fontSize: "0.9rem",
                      lineHeight: "1.4",
                      marginBottom: "15px",
                      minHeight: "65px",
                    }}
                  >
                    {product.description}
                  </p>

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
                    <span>£{product.price}</span>
                    <span
                      style={{
                        color: "#999999",
                        fontWeight: "400",
                        fontSize: "0.85rem",
                        textDecoration: "line-through",
                        userSelect: "none",
                      }}
                    >
                      ${product.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(product._id)}
                    style={{
                      background:
                        "linear-gradient(90deg, #d9534f 0%, #c9302c 100%)",
                      color: "white",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "30px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      userSelect: "none",
                      width: "100%",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "linear-gradient(90deg, #b52b27 0%, #8b1d1a 100%)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "linear-gradient(90deg, #d9534f 0%, #c9302c 100%)")
                    }
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/products")}
          style={{
            marginTop: "40px",
            padding: "12px 36px",
            borderRadius: "12px",
            cursor: "pointer",
            backgroundColor: "#514F6E",
            color: "white",
            border: "none",
            fontWeight: "600",
            fontSize: "1.1rem",
            userSelect: "none",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          Continue Shopping
        </button>
      </div>
    </>
  );
};

export default Cart;
