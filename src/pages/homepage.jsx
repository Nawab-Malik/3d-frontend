// HomePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import HomeCarousel from "../components/home";
import CardsSection from "../components/cardsection";
import WhyChooseSection from "../components/whychoosesection";
import PopularProduct from "../components/popularproducts";
import ReviewSection from "../components/reviewsection";
import IdeaCard from "../components/ideacard";
import Footer from "../components/footer";
import localProducts from "../data/products.json";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchFeedback();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/products");
      let list = response.data.products || response.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        list = (localProducts || []).map((p, i) => {
          const fileName = String(p.imageUrl || "").split("/").pop();
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
      }
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
      const list = (localProducts || []).map((p, i) => {
        const fileName = String(p.imageUrl || "").split("/").pop();
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

  const fetchFeedback = async () => {
    try {
      setLoadingFeedback(true);
      setFeedbackError("");
      const res = await axios.get("http://localhost:5000/api/feedback");
      const list = res.data?.feedback || [];
      setFeedbacks(list);
    } catch (err) {
      setFeedbackError("Failed to load feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar variant="transparent" />
      <HomeCarousel />
      <CardsSection />
      <WhyChooseSection />
      {/* Pass products prop here */}
      <PopularProduct products={products} />
      <ReviewSection />
      {/* Feedback Section */}
      <section style={{ background: "#f9f9fb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
          <h2 style={{ marginBottom: 16 }}>What our customers say</h2>
          {loadingFeedback && <div style={{ color: "#6b6b6b" }}>Loading feedback...</div>}
          {!!feedbackError && <div style={{ color: "#b00020" }}>{feedbackError}</div>}
          {!loadingFeedback && !feedbackError && (
            feedbacks.length === 0 ? (
              <div style={{ color: "#6b6b6b" }}>No feedback yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                {feedbacks.map((fb) => {
                  const displayName = fb?.user?.name || (fb?.email || "").split("@")[0] || "Customer";
                  const initial = displayName.substring(0, 1).toUpperCase();
                  return (
                    <div key={fb._id} style={{
                      background: "white",
                      border: "1px solid #eaeaea",
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        {fb.avatarUrl ? (
                          <img
                            src={fb.avatarUrl}
                            alt="Avatar"
                            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#e9e9ef",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#666",
                            fontWeight: 600,
                          }}>
                            {initial}
                          </div>
                        )}
                        <div style={{ fontWeight: 600, color: "#333" }}>{displayName}</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#333", whiteSpace: "pre-wrap" }}>{fb.message}</div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </section>
      <IdeaCard />
      <Footer />
    </>
  );
}

export default HomePage;
