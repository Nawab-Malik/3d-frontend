import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

const AnnouncementPopup = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/announcements/active`);
      const data = res.data;

      if (data && (Array.isArray(data) ? data.length > 0 : data.message)) {
        const ann = Array.isArray(data) ? data[0] : data;
        if (ann && ann.message) {
          setAnnouncement(ann);
          setTimeout(() => setShow(true), 800);
        }
      }
    } catch (error) {
      console.log("No announcements available");
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShow(false);
      setIsClosing(false);
    }, 400);
  };

  if (!show || !announcement) return null;

  const bgColor = announcement.backgroundColor || "#6366f1";
  const textColor = announcement.textColor || "#ffffff";

  return (
    <>
      {/* Backdrop with blur */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 99998,
          opacity: isClosing ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Main Popup Container */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${
            isClosing
              ? "scale(0.85) translateY(30px)"
              : "scale(1) translateY(0)"
          }`,
          zIndex: 99999,
          width: "92%",
          maxWidth: "480px",
          opacity: isClosing ? 0 : 1,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Outer Glow */}
        <div
          style={{
            position: "absolute",
            inset: "-30px",
            background: `radial-gradient(ellipse at center, ${bgColor}40 0%, transparent 70%)`,
            borderRadius: "50%",
            filter: "blur(40px)",
            zIndex: -1,
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        />

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.1),
              0 30px 100px -20px rgba(0,0,0,0.5),
              0 0 80px ${bgColor}30
            `,
          }}
        >
          {/* Top Gradient Section */}
          <div
            style={{
              background: `linear-gradient(145deg, ${bgColor} 0%, ${adjustColor(
                bgColor,
                -40
              )} 100%)`,
              padding: "50px 35px 60px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "100px",
                height: "100px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "50%",
              }}
            />

            {/* Floating sparkles */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "12%",
                fontSize: "20px",
                opacity: 0.7,
                animation: "sparkle 2s ease-in-out infinite",
              }}
            >
              ✨
            </div>
            <div
              style={{
                position: "absolute",
                top: "25%",
                right: "15%",
                fontSize: "16px",
                opacity: 0.6,
                animation: "sparkle 2.5s ease-in-out infinite 0.3s",
              }}
            >
              ⭐
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "35%",
                left: "18%",
                fontSize: "14px",
                opacity: 0.5,
                animation: "sparkle 2s ease-in-out infinite 0.6s",
              }}
            >
              ✦
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "25%",
                right: "12%",
                fontSize: "18px",
                opacity: 0.6,
                animation: "sparkle 2.2s ease-in-out infinite 0.9s",
              }}
            >
              🌟
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontSize: "22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "rotate(0) scale(1)";
              }}
            >
              ×
            </button>

            {/* Animated Icon */}
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px",
                fontSize: "45px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                animation: "iconBounce 2s ease-in-out infinite",
              }}
            >
              🎉
            </div>

            {/* Badge */}
            <div
              style={{
                display: "inline-block",
                padding: "8px 20px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "30px",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "white",
                marginBottom: "18px",
                backdropFilter: "blur(5px)",
              }}
            >
              ✨ Special Offer
            </div>

            {/* Message */}
            <h2
              style={{
                color: textColor,
                fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
                fontWeight: "800",
                margin: 0,
                lineHeight: 1.35,
                textShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              {announcement.message}
            </h2>
          </div>

          {/* Bottom Section */}
          <div
            style={{
              padding: "35px",
              textAlign: "center",
              background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
            }}
          >
            {/* CTA Button */}
            {announcement.link?.url ? (
              <a
                href={announcement.link.url}
                onClick={handleClose}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "18px 45px",
                  background: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(
                    bgColor,
                    -30
                  )} 100%)`,
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "50px",
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  boxShadow: `0 15px 40px ${bgColor}50, 0 5px 15px rgba(0,0,0,0.1)`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 20px 50px ${bgColor}60, 0 8px 20px rgba(0,0,0,0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = `0 15px 40px ${bgColor}50, 0 5px 15px rgba(0,0,0,0.1)`;
                }}
              >
                <span>{announcement.link.text || "Shop Now"}</span>
                <span
                  style={{
                    fontSize: "1.3rem",
                    transition: "transform 0.3s",
                  }}
                >
                  →
                </span>
              </a>
            ) : (
              <button
                onClick={handleClose}
                style={{
                  padding: "18px 45px",
                  background: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(
                    bgColor,
                    -30
                  )} 100%)`,
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  cursor: "pointer",
                  boxShadow: `0 15px 40px ${bgColor}50`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Got It! 🎊
              </button>
            )}

            {/* Dismiss link */}
            <p
              onClick={handleClose}
              style={{
                marginTop: "22px",
                color: "#999",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#666")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
            >
              Maybe later
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.4; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-8px) scale(1.2); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-5deg); }
          75% { transform: translateY(-4px) rotate(5deg); }
        }
      `}</style>
    </>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  if (!color || typeof color !== "string") return "#4f46e5";
  let c = color.startsWith("#") ? color.slice(1) : color;
  if (c.length !== 6) return "#4f46e5";
  const num = parseInt(c, 16);
  if (isNaN(num)) return "#4f46e5";
  let r = Math.max(0, Math.min(255, (num >> 16) + amount));
  let g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  let b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

export default AnnouncementPopup;
