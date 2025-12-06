import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ProductsList from "../components/productslist";
import localProducts from "../data/products.json";

function CheckoutPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await axios.get(
        "https://3-d-backend-3pgu.vercel.app/api/products"
      );
      setProducts(res.data?.products || []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const handleBuyNow = async (product) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login to proceed with the checkout");
        return;
      }

      // Navigate to the payment page or perform the checkout action
      navigate("/payment");
    } catch (error) {
      console.error("Error in checkout:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            paddingTop: "160px",
            textAlign: "center",
            minHeight: "60vh",
          }}
        >
          Loading products...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
        className="content-wrapper"
        style={{
          paddingTop: "160px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "80px",
          minHeight: "calc(100vh - 160px - 80px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "2.5rem",
            fontWeight: 700,
          }}
        >
          Checkout
        </h1>

        {error && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                Your cart is empty
              </h2>
              <p style={{ color: "#666" }}>
                Add some products to your cart before checking out.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: "20px",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    margin: 0,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Order Summary
                </h2>
              </div>

              {products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        color: "#333",
                      }}
                    >
                      {product.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "8px",
                      }}
                    >
                      {(product.categories || []).map((category, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            background: "#f1f1f1",
                            border: "1px solid #ddd",
                            color: "#514F6E",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#333",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    £{product.price.toFixed(2)}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#514F6E",
                    }}
                  >
                    £
                    {products
                      .reduce((sum, product) => sum + product.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleBuyNow()}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "30px",
                    border: "none",
                    background:
                      "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CheckoutPage;
