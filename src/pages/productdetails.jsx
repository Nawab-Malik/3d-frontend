// pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import VariationSelector from "../components/VariationSelector";
import localProducts from "../data/products.json";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("userToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "http://localhost:5000/uploads/default-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/uploads")) return `http://localhost:5000${imageUrl}`;
    return `http://localhost:5000/uploads/${imageUrl}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try backend first
        const [p, r] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`).catch((e) => e),
          axios.get(`http://localhost:5000/api/products/${id}/related`).catch((e) => e),
        ]);

        if (p?.data && !p.isAxiosError) {
          console.log('Product loaded:', p.data);
          console.log('Has variations:', p.data.hasVariations);
          console.log('Variations:', p.data.variations);
          setProduct(p.data);
          let rel = Array.isArray(r?.data?.products) ? r.data.products : [];
          // Fallback if related API fails or returns empty
          if (!rel || rel.length === 0) {
            try {
              const gp = await axios.get(`http://localhost:5000/api/products?limit=50`).catch(() => null);
              const all = Array.isArray(gp?.data?.products) ? gp.data.products : [];
              const baseCats = new Set((p.data?.categories || []).map(String));
              if (all.length) {
                rel = all
                  .filter((x) => String(x._id) !== String(p.data._id))
                  .filter((x) =>
                    baseCats.size === 0 ? true : (x.categories || []).some((c) => baseCats.has(String(c)))
                  )
                  .slice(0, 8);
              }
            } catch {}
          }
          setRelated(rel || []);
        } else {
          // Local fallback: id like local-3
          const localIndex = String(id || "").startsWith("local-")
            ? parseInt(String(id).split("-")[1], 10)
            : -1;
          if (localIndex >= 0 && Array.isArray(localProducts)) {
            const lp = localProducts[localIndex];
            if (lp) {
              const fileName = String(lp.imageUrl || "").split("/").pop();
              let href = "";
              try {
                href = new URL(`../assets/${fileName}`, import.meta.url).href;
              } catch {
                try {
                  href = new URL(`../../images/${fileName}`, import.meta.url).href;
                } catch {
                  href = lp.imageUrl;
                }
              }
              const normalized = { ...lp, _id: id, imageUrl: href };
              setProduct(normalized);

              // Compute related locally by shared categories
              const baseCats = new Set((lp.categories || []).map(String));
              const relatedLocal = localProducts
                .map((p, i) => {
                  const name = String(p.imageUrl || "").split("/").pop();
                  let imgHref = "";
                  try {
                    imgHref = new URL(`../assets/${name}`, import.meta.url).href;
                  } catch {
                    try {
                      imgHref = new URL(`../../images/${name}`, import.meta.url).href;
                    } catch {
                      imgHref = p.imageUrl;
                    }
                  }
                  return { ...p, _id: `local-${i}`, imageUrl: imgHref };
                })
                .filter((p) => p._id !== id && (p.categories || []).some((c) => baseCats.has(String(c))))
                .slice(0, 8);
              setRelated(relatedLocal);
            } else {
              setProduct(null);
              setRelated([]);
            }
          } else {
            setProduct(null);
            setRelated([]);
          }
        }
      } catch (e) {
        console.error("Failed to load product", e);
        setProduct(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addToCart = async () => {
    // Check if product has variations and one is selected
    if (product.hasVariations && product.variations && product.variations.length > 0 && !selectedVariation) {
      alert("Please select color and size options");
      return;
    }

    // Check stock for variation
    if (selectedVariation && selectedVariation.stock <= 0) {
      alert("This variation is out of stock");
      return;
    }

    try {
      setAdding(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Please login to add items to your cart");
        return;
      }
      
      const cartData = { 
        productId: product._id, 
        quantity: 1
      };
      
      // Add variation info if selected
      if (selectedVariation) {
        cartData.variation = {
          variationId: selectedVariation._id,
          color: selectedVariation.color,
          size: selectedVariation.size,
          price: selectedVariation.price || product.price
        };
      }
      
      await axios.post(
        "http://localhost:5000/api/cart/add",
        cartData,
        { headers: getAuthHeader() }
      );
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 4000);
    } catch (e) {
      console.error("Failed to add to cart", e);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: "160px", textAlign: "center", minHeight: "60vh" }}>
          Loading product...
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: "160px", textAlign: "center", minHeight: "60vh" }}>
          Product not found
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: "160px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "80px",
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 160px - 80px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.title}
                style={{ width: "100%", height: "480px", objectFit: "contain" }}
                onError={(e) => (e.currentTarget.src = "http://localhost:5000/uploads/default-product.png")}
              />
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h1 style={{ margin: 0, marginBottom: "10px" }}>{product.title}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {(product.categories || []).map((c, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 10px",
                      background: "#f1f1f1",
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      color: "#514F6E",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p style={{ color: "#666", lineHeight: 1.6 }}>{product.description}</p>
              
              {/* Debug Info - Remove after testing */}
              {console.log('Rendering variations check:', {
                hasVariations: product.hasVariations,
                variationsLength: product.variations?.length,
                variations: product.variations
              })}
              
              {/* Product Variations */}
              {product.hasVariations && product.variations && product.variations.length > 0 ? (
                <VariationSelector
                  variations={product.variations}
                  onVariationChange={setSelectedVariation}
                  basePrice={product.price}
                />
              ) : (
                <div style={{ padding: "10px", background: "#f0f0f0", borderRadius: "4px", fontSize: "12px", marginBottom: "10px" }}>
                  Debug: hasVariations={String(product.hasVariations)}, variations count={product.variations?.length || 0}
                </div>
              )}
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                  ${selectedVariation && selectedVariation.price ? selectedVariation.price.toFixed(2) : product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ textDecoration: "line-through", color: "#999" }}>${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={addToCart}
                  disabled={adding}
                  style={{
                    background: adding
                      ? "#9C98D4"
                      : "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "30px",
                    fontWeight: 600,
                    cursor: adding ? "not-allowed" : "pointer",
                  }}
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={() => navigate("/products")}
                  style={{
                    background: "white",
                    color: "#514F6E",
                    border: "1px solid #514F6E",
                    padding: "12px 20px",
                    borderRadius: "30px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>

          <section style={{ marginTop: "50px" }}>
            <h2 style={{ marginBottom: "20px" }}>Related Products</h2>
            {related.length === 0 ? (
              <p>No related products found.</p>
            ) : (
              <div
                className="gallery-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                {related.map((rp) => (
                  <div
                    className="tilt reveal-on-scroll sr-zoom"
                    key={rp._id}
                    style={{
                      background: "white",
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/products/${rp._id}`)}
                  >
                    <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
                      <img
                        src={getImageUrl(rp.imageUrl)}
                        alt={rp.title}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }}
                        onError={(e) => (e.currentTarget.src = "http://localhost:5000/uploads/default-product.png")}
                      />
                    </div>
                    <div style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 700, marginBottom: "6px" }}>{rp.title}</div>
                      <div style={{ color: "#333" }}>${rp.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />

      {showCartNotification && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            border: "2px solid #514F6E",
            borderRadius: 8,
            padding: 15,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 300,
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>✅ Added to Cart!</p>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{product?.title} was added to your cart.</p>
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
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            View Cart
          </button>
          <button
            onClick={() => setShowCartNotification(false)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, marginLeft: 5, color: "#666" }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default ProductDetails;
