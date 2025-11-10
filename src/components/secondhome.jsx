import React from "react";
import "./secondhome.css";

function SecondHome() {
  return (
    <div
      className="hero-section position-relative"
      style={{
        backgroundImage: `url(/images/bg-image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "80px 0",
        color: "#fff",
        fontFamily: "'Staatliches', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Strong black glass + vignette overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.65) 100%),
            rgba(0,0,0,0.35)
          `,
          zIndex: 1,
        }}
      ></div>

      <div className="middle-content container h-100 position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center h-100">

          {/* Left Side - Text (safe from overlay) */}
          <div className="col-lg-6 text-left" style={{ position: "relative", zIndex: 3 }}>
            <h1
              className="hero-title"
              style={{
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "92px",
                lineHeight: "95px",
                textTransform: "capitalize",
                color: "#fff", // pure bright white
                textShadow: "0px 0px 8px rgba(0,0,0,0.4)", // slight glow to make text pop
              }}
            >
              <span>Unleash Your</span>
              <br />
              <span>Creativity with</span>
              <br />
              <span>MakeIt3D</span>
            </h1>
            <p
              className="hero-subtitle"
              style={{
                fontSize: "15px",
                marginTop: "10px",
                color: "#fff",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
                textShadow: "0px 0px 4px rgba(0,0,0,0.3)",
              }}
            >
              Bring Your Designs to Life
            </p>
          </div>

          {/* Right Side - Image with same dark tone */}
          <div className="col-lg-6 text-center" style={{ position: "relative", zIndex: 3 }}>
            <img
              src="/images/right-image.png"
              alt="3D Print Example"
              className="img-fluid hero-image"
              style={{
                maxWidth: "100%",
                height: "auto",
                filter: "brightness(0.65) contrast(1.05)", // darker + richer tone
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondHome;
