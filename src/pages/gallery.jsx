import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function useScrollReveal(containerRef) {
  useEffect(() => {
    const container = containerRef?.current || document;
    const elements = container.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr-show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => {
      el.classList.add("sr-init");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [containerRef]);
}

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useScrollReveal(containerRef);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://3-d-backend-3pgu.vercel.app/api/gallery"
        );
        setImages(res.data || []);
      } catch (err) {
        setError("Failed to load gallery. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <>
      <Navbar />
      <main
        style={{ paddingTop: 140, background: "#ffffff", minHeight: "100vh" }}
      >
        <section
          style={{
            background:
              "radial-gradient(1000px 600px at 20% -10%, rgba(0,0,0,0.03), transparent 60%), radial-gradient(900px 500px at 100% -20%, rgba(0,0,0,0.05), transparent 60%)",
            color: "#111",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "80px 20px 40px",
            }}
          >
            <h1
              className="reveal-on-scroll"
              style={{
                fontFamily: "Staatliches, sans-serif",
                fontSize: 64,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: 1,
              }}
            >
              Gallery
            </h1>
            <p
              className="reveal-on-scroll"
              style={{
                color: "#4a4a4a",
                fontSize: 18,
                maxWidth: 680,
                marginTop: 14,
              }}
            >
              A curated showcase of our product images. Pure visuals, no
              distractions.
            </p>
          </div>
        </section>

        <section
          ref={containerRef}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 20px 80px",
          }}
        >
          {loading && (
            <div className="reveal-on-scroll" style={{ color: "#6b6b6b" }}>
              Loading...
            </div>
          )}
          {!!error && (
            <div className="reveal-on-scroll" style={{ color: "#b00020" }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div
              className="gallery-grid"
              style={{
                display: "grid",
                gap: 14,
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {images.length === 0 && (
                <div className="reveal-on-scroll" style={{ color: "#6b6b6b" }}>
                  No images yet.
                </div>
              )}
              {images.map((img) => (
                <div
                  key={img._id}
                  className="reveal-on-scroll tilt sr-zoom mask-reveal"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #eaeaea",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={`https://3-d-backend-3pgu.vercel.app${img.imageUrl}`}
                    alt="Gallery"
                    style={{
                      width: "100%",
                      display: "block",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.opacity = 0.2;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default GalleryPage;
