// pages/ProductsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ProductsList from "../components/productslist";
import localProducts from "../data/products.json";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://3-d-backend-3pgu.vercel.app/api/products"
      );
      let list = response.data.products || response.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        // Fallback to local JSON; compute absolute image URLs to frontend/images
        list = (localProducts || []).map((p, i) => {
          const fileName = String(p.imageUrl || "")
            .split("/")
            .pop();
          let href = "";
          try {
            // Prefer src/assets (exists in repo)
            href = new URL(`../assets/${fileName}`, import.meta.url).href;
          } catch {
            try {
              // Fallback to frontend/images
              href = new URL(`../../images/${fileName}`, import.meta.url).href;
            } catch {
              href = p.imageUrl;
            }
          }
          return { ...p, _id: `local-${i}`, imageUrl: href };
        });
      }
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
      // On error, also fallback to local
      const list = (localProducts || []).map((p, i) => {
        const fileName = String(p.imageUrl || "")
          .split("/")
          .pop();
        let href = "";
        try {
          href = new URL(`../assets/${fileName}`, import.meta.url).href;
        } catch {
          try {
            href = new URL(`../../images/${fileName}`, import.meta.url).href;
          } catch {
            href = p.imageUrl;
          }
        }
        return { ...p, _id: `local-${i}`, imageUrl: href };
      });
      setProducts(list);
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const handleAddToCart = async (product) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login to add items to your cart");
        return;
      }

      await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/cart/add",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show notification instead of immediate navigation
      setAddedProduct(product);
      setShowCartNotification(true);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowCartNotification(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to add product to cart", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      } else {
        alert("Failed to add to cart. Please try again.");
      }
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
        <ProductsList products={products} onBuyNow={handleAddToCart} />
      </main>
      <Footer />

      {/* Cart Notification */}
      {showCartNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "white",
            border: "2px solid #514F6E",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "300px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
              ✅ Added to Cart!
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              {addedProduct?.title} was added to your cart.
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/cart");
              setShowCartNotification(false);
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#514F6E",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            View Cart
          </button>
          <button
            onClick={() => setShowCartNotification(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              marginLeft: "5px",
              color: "#666",
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default ProductsPage;
