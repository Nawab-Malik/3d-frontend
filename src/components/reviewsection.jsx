import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./reviewsection.css";

const reviews = [
  {
    id: 1,
    stars: 5,
    description:
      "Absolutely love the anime-style figure I ordered! The details are amazing, and the paint job is top-notch. Will definitely come back for more!",
    name: "Julia M. - Berlin",
  },
  {
    id: 2,
    stars: 4,
    description:
      "Great quality and very detailed. The shipping was fast, and the customer support was very helpful.",
    name: "Liam K. - New York",
  },
  {
    id: 3,
    stars: 5,
    description:
      "Amazing craftsmanship! I’m really impressed with how the figure turned out. Highly recommend this service.",
    name: "Sophia T. - Tokyo",
  },
  {
    id: 4,
    stars: 4,
    description:
      "Love it! The paint colors and sculpting are excellent. I’ll definitely be ordering again soon.",
    name: "Ethan W. - London",
  },
  {
    id: 5,
    stars: 3,
    description:
      "Good detail but expected a little more polish on the finish. Still a great product for the price.",
    name: "Mia P. - Paris",
  },
  {
    id: 6,
    stars: 5,
    description:
      "Top quality and fast delivery. I’m very happy with my purchase. Customer service was also very responsive.",
    name: "Noah J. - Sydney",
  },
  {
    id: 7,
    stars: 4,
    description:
      "Beautifully detailed and very well packaged. Will buy again for sure!",
    name: "Olivia S. - Toronto",
  },
  {
    id: 8,
    stars: 5,
    description:
      "Exceeded expectations! The level of detail and quality is outstanding. Highly recommend!",
    name: "James L. - San Francisco",
  },
];

const Star = ({ filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "#FFD700" : "#ccc"}
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: 2 }}
  >
    <path d="M12 .587l3.668 7.431 8.214 1.193-5.941 5.787 1.402 8.186L12 18.897l-7.343 3.847 1.402-8.186-5.941-5.787 8.214-1.193z" />
  </svg>
);

const ReviewCard = ({ stars, description, name }) => {
  const starsArray = Array(5)
    .fill(0)
    .map((_, i) => i < stars);

  return (
    <div
      className="review-item reveal-on-scroll sr-zoom"
      style={{
        backgroundColor: "white",
        borderRadius: 15,
        padding: "25px 20px",
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        minHeight: 220,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        userSelect: "none",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-10px, 10px)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0, 0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
      }}
    >
      <div style={{ display: "flex", marginBottom: 14 }}>
        {starsArray.map((filled, idx) => (
          <Star key={idx} filled={filled} />
        ))}
      </div>
      <p
        style={{
          color: "#777",
          fontSize: 15,
          lineHeight: 1.4,
          flexGrow: 1,
          marginBottom: 15,
        }}
      >
        {description}
      </p>
      <h4
        style={{
          color: "#222",
          fontWeight: 700,
          fontSize: 18,
          margin: 0,
        }}
      >
        {name}
      </h4>
    </div>
  );
};

export default function ReviewSection() {
  const navigate = useNavigate();
  useEffect(() => {
    // Inject responsive styles for small devices
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @media (max-width: 900px) {
        .reviews-container {
          flex-wrap: wrap !important;
        }
        .reviews-column {
          width: 100% !important;
          max-height: none !important;
          margin-top: 0 !important;
          overflow: visible !important;
        }
        .right-side {
          flex: 1 1 100% !important;
          margin-top: 30px;
          padding: 0 20px;
          text-align: center !important;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const cardHeightWithMargin = 240;
  const containerHeight = 4 * cardHeightWithMargin;

  return (
    <section
      className="section-rev"
      style={{
        backgroundColor: "#000",
        padding: "60px 50px",
        width: "100vw",
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      <div
        className="reviews-container review-block"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          gap: 40,
          flexWrap: "nowrap",
          color: "white",
          alignItems: "center",
        }}
      >
        {/* Left side: reviews */}
        <div
          className="reviews-cards"
          style={{
            display: "flex",
            flex: "1 1 auto",
            marginLeft: -50,
            maxWidth: 850,
          }}
        >
          {/* First column - shifted down */}
          <div
            className="reviews-column reviews-column-left gallery-grid"
            style={{
              width: "50%", // increased width a bit
              maxHeight: containerHeight,
              overflow: "visible", // no scroll
              borderRadius: 15,
              marginTop: 30, // Shift down
              paddingRight: 15, // padding to prevent cut
            }}
          >
            {reviews.slice(0, 4).map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>

          {/* Second column - shifted up with overflow fix, no scroll */}
          <div
            className="reviews-column reviews-column-right gallery-grid"
            style={{
              width: "50%", // increased width a bit
              maxHeight: containerHeight,
              overflow: "visible", // no scroll at all
              borderRadius: 15,
              marginTop: -20, // Shift up
            }}
          >
            {reviews.slice(4, 8).map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        </div>

        {/* Right side: heading + paragraph + button */}
        <div
          className="right-side review-right"
          style={{
            flex: "0 0 320px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            gap: 16,
            padding: "10px 0",
            userSelect: "none",
            whiteSpace: "nowrap",
            marginLeft: "6rem",
          }}
        >
          <h2
            className="reveal-on-scroll sr-left sr-slow"
            style={{
              fontFamily: "Staatliches, sans-serif",
              lineHeight: "1.2",
              fontSize: "72px",
              color: "white",
              textTransform: "uppercase",
              margin: 0,
              userSelect: "none",
            }}
          >
            WHAT OUR CUSTOMERS{" "}
            <span
              style={{
                color: "#514F6E",
                userSelect: "none",
                fontWeight: 400,
              }}
            >
              SAY
            </span>
          </h2>

          <p
            className="reveal-on-scroll sr-right"
            style={{
              color: "#ccc",
              fontSize: "1.1rem",
              lineHeight: 1.5,
              margin: 0,
              userSelect: "none",
            }}
          >
            Real feedback from people who’ve experienced our 3D printing
            services and products.
          </p>

          <button
            className="reveal-on-scroll sr-zoom"
            style={{
              backgroundColor: "black",
              color: "white",
              border: "1.5px solid white",
              padding: "14px 36px",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: 10,
              cursor: "pointer",
              userSelect: "none",
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              alignSelf: "center",
              minWidth: 160,
              marginTop: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#514F6E";
              e.currentTarget.style.borderColor = "#514F6E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "black";
              e.currentTarget.style.borderColor = "white";
            }}
            onClick={() => navigate('/feedback')}
          >
            Leave Feedback
          </button>
        </div>
      </div>
    </section>
  );
}
