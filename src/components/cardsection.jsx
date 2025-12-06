import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPrint, FaBoxes, FaStopwatch, FaGift } from "react-icons/fa";
import "./cardsection.css";

function CardsSection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const handleBookMeeting = () => {
    if (!isAuthenticated || !user) {
      alert("Please log in first to access referral benefits!");
      navigate("/");
      return;
    }

    // Navigate to referral page
    navigate("/referrals");
  };

  return (
    <div className="container-fluid px-0">
      <div
        className="mini-cards row g-4"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          marginTop: "40px",
        }}
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
          <div
            className="cards-distance"
            style={{ position: "relative", zIndex: 2 }}
          >
            <div className="d-flex align-items-center mb-2">
              <div className="feature-icon me-3">
                <FaPrint size={20} />
              </div>
              <h5 className="mb-0">High-Precision Printing</h5>
            </div>
            <p className="mb-0" style={{ marginLeft: "52px", opacity: 0.95 }}>
              We use state-of-the-art printers to deliver incredibly detailed
              and accurate results.
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

        {/* 4th Card - REFERRAL GIFTS CARD */}
        <div
          className="col-md-3 d-flex flex-column justify-content-between px-4 py-4 hover-glow feature-card reveal-on-scroll"
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
            borderRadius: "16px",
            border: "2px solid #ffc700",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            zIndex: 0,
            minHeight: "160px",
            boxShadow: "0 8px 24px rgba(255, 200, 0, 0.3)",
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="d-flex align-items-center mb-2">
              <div className="feature-icon" style={{ color: "#ff6b00" }}>
                <FaGift size={24} />
              </div>
              <h5
                className="mb-0"
                style={{ color: "#1d1d1f", fontWeight: "700" }}
              >
                Referral Rewards
              </h5>
            </div>
            <p
              className="mb-3"
              style={{ marginLeft: "52px", color: "#333", fontWeight: "500" }}
            >
              🎁 Get Exclusive Rewards for each friend who signs up!
            </p>
          </div>

          <button
            onClick={handleBookMeeting}
            style={{
              background: "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
              color: "white",
              padding: "12px 22px",
              fontWeight: "600",
              width: "100%",
              position: "relative",
              zIndex: 2,
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: "700",
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(90deg, #3a3551 0%, #6f6aa4 100%)";
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 8px 20px rgba(81, 79, 110, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            {isAuthenticated ? "View Referrals" : "Login & Refer"}
          </button>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <small style={{ color: "#555", fontWeight: "500" }}>
              ⭐ Share your code, earn rewards
            </small>
          </div>
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
