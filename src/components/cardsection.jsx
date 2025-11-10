import React from "react";
import { FaPrint, FaBoxes, FaStopwatch } from "react-icons/fa";
import "./cardsection.css";

function CardsSection() {
  return (
    <div className="container-fluid px-0">
      <div
        className="mini-cards row g-4"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", marginTop: "40px" }}
      >
        {/* 1st Card */}
        <div
          className="col-md-3 d-flex flex-column justify-content-center px-4 py-4 hover-glow feature-card reveal-on-scroll"
          style={{
            background: "linear-gradient(135deg, #544f78 0%, #6f6aa4 100%)",
            borderRadius: "16px",
            color: "white",
            border: "1px solid transparent",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            zIndex: 0,
            minHeight: "160px",
          }}
        >
          <div className="cards-distance" style={{ position: "relative", zIndex: 2 }}>
            <div className="d-flex align-items-center mb-2">
              <div className="feature-icon me-3">
                <FaPrint size={20} />
              </div>
              <h5 className="mb-0">High-Precision Printing</h5>
            </div>
            <p className="mb-0" style={{ marginLeft: "52px", opacity: 0.95 }}>
              We use state-of-the-art printers to deliver incredibly detailed and accurate results.
            </p>
          </div>
        </div>

        {/* 2nd Card */}
        <div
          className="col-md-3 d-flex flex-column justify-content-center px-4 py-4 hover-glow feature-card reveal-on-scroll"
          style={{
            background: "linear-gradient(135deg, #e9e9ea 0%, #ffffff 100%)",
            borderRadius: "16px",
            color: "#1d1d1f",
            border: "1px solid #e5e5ea",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            zIndex: 0,
            minHeight: "160px",
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="d-flex align-items-center mb-2">
              <div className="feature-icon light me-3">
                <FaBoxes size={20} />
              </div>
              <h5 className="mb-0">Wide Range of Materials</h5>
            </div>
            <p className="mb-0" style={{ marginLeft: "52px", opacity: 0.8 }}>
              From PLA and PETG to flexible and industrial-grade resins.
            </p>
          </div>
        </div>

        {/* 3rd Card */}
        <div
          className="col-md-3 d-flex flex-column justify-content-center px-4 py-4 hover-glow feature-card reveal-on-scroll"
          style={{
            background: "linear-gradient(135deg, #544f78 0%, #6f6aa4 100%)",
            borderRadius: "16px",
            color: "white",
            border: "1px solid transparent",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            zIndex: 0,
            minHeight: "160px",
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="d-flex align-items-center mb-2">
              <div className="feature-icon me-3">
                <FaStopwatch size={20} />
              </div>
              <h5 className="mb-0">Rapid Turnaround</h5>
            </div>
            <p className="mb-0" style={{ marginLeft: "52px", opacity: 0.95 }}>
              Quick delivery without sacrificing quality.
            </p>
          </div>
        </div>

        {/* 4th Card */}
        <div
          className="col-md-3 d-flex justify-content-center align-items-center px-4 py-4 hover-glow feature-card reveal-on-scroll"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f6f6f8 100%)",
            borderRadius: "16px",
            border: "1px solid #e5e5ea",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            zIndex: 0,
            minHeight: "160px",
          }}
        >
          <button
            className="btn"
            style={{
              background: "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
              color: "white",
              padding: "12px 22px",
              fontWeight: "600",
              minWidth: "100%",
              position: "relative",
              zIndex: 2,
              border: "none",
              borderRadius: "12px",
            }}
          >
            Book Meeting
          </button>
        </div>
      </div>

      {/* Hover glow CSS */}
      <style>{`
        .hover-glow {
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.35s ease;
        }

        .hover-glow::before {
          content: "";
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 18px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
          box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.35);
          z-index: 1;
        }

        .hover-glow:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.45);
          box-shadow: 0 18px 40px rgba(17, 17, 26, 0.1);
        }

        .hover-glow:hover::before {
          opacity: 1;
          animation: pulseGlow 2.5s infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.35);
          }
          50% {
            box-shadow: 0 0 25px 6px rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
    </div>
  );
}

export default CardsSection;
