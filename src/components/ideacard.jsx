import React from "react";
import backgroundImage from "../assets/machine.png"; // your local image

export default function IdeaCard() {
  return (
    <section
      style={{
        backgroundColor: "white",
        minHeight: "auto", // changed from 100vh to auto, so no extra vertical space
        padding: "20px 15px", // reduced vertical padding from 60px to 20px
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "3rem",
      }}
    >
      <div
        className="card shadow reveal-on-scroll sr-zoom"
        style={{
          background: "#01010166",
          borderRadius: 24,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#ddd",
          width: "100%",
          maxWidth: 1310,
          minHeight: 450,
          paddingTop: 100,
          paddingBottom: 100,
          paddingLeft: 70,
          paddingRight: 70,
          display: "flex",
          flexDirection: "row",
          gap: 60,
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {/* Left side content */}
        <div
          className="d-flex flex-column justify-content-center"
          style={{ flex: 1, color: "white", minWidth: 0 }}
        >
          <h2
            className="reveal-on-scroll sr-left sr-slow"
            style={{
              fontWeight: 700,
              fontSize: "3.2rem",
              textTransform: "uppercase",
              marginBottom: 20,
              lineHeight: 1.3,
              color: "white",
              fontFamily: "'Staatliches', sans-serif",
            }}
            title="Ready to bring your idea to life?"
          >
            Ready to{" "}
            <span
              style={{
                color: "#514F6E",
                backgroundColor: "transparent",
                padding: 0,
                borderRadius: 0,
              }}
            >
              bring your idea
            </span>{" "}
            to life?
          </h2>

          <p
            className="reveal-on-scroll sr-right"
            style={{
              fontSize: "1.3rem",
              lineHeight: 1.5,
              marginBottom: 40,
              maxWidth: 480,
              whiteSpace: "normal",
              color: "white",
            }}
          >
            Start your project with us today —{" "}
            <span
              style={{
                color: "#514F6E",
                backgroundColor: "transparent",
                padding: 0,
                borderRadius: 0,
              }}
            >
              free consultation, endless inspiration, and expert guidance every
              step of the way
            </span>
            . Our dedicated team ensures your ideas become reality with
            precision and creativity.
          </p>

          <button
            type="button"
            className="btn reveal-on-scroll sr-zoom"
            style={{
              background: "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
              color: "white",
              padding: "12px 36px",
              fontWeight: 600,
              fontSize: "1.1rem",
              borderRadius: 12,
              border: "none",
              maxWidth: 220,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Make my design
          </button>
        </div>

        {/* Right side image */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 0,
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          <img
            src={backgroundImage}
            alt="Creative idea"
            className="mask-reveal parallax-y"
            data-speed="0.1"
            style={{
              width: "100%",
              maxHeight: "100%",
              objectFit: "cover",
              borderRadius: 24,
              userSelect: "none",
              pointerEvents: "none",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 991.98px) {
          div.card {
            flex-direction: column !important;
            height: auto !important;
            min-height: auto !important;
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            overflow: visible !important;
          }
          div.card > div:first-child {
            text-align: center !important;
            padding-bottom: 30px;
          }
          div.card > div:first-child h2 {
            font-size: 2rem !important;
            white-space: normal !important;
          }
          div.card > div:first-child p {
            font-size: 1.1rem !important;
            max-width: 100% !important;
            white-space: normal !important;
          }
          div.card > div:last-child img {
            max-height: 300px !important;
            border-radius: 20px !important;
          }
        }
        @media (max-width: 575.98px) {
          div.card {
            padding-left: 30px !important;
            padding-right: 30px !important;
          }
          button.btn {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
