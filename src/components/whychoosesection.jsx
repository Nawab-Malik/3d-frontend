import React from "react";
import img1 from "../assets/card1.png";
import img2 from "../assets/card2.png";
import img3 from "../assets/card3.png";
import img4 from "../assets/card4.png";
import backgroundImage from "../assets/background.jpg";
import "./whychoosesection.css";

const cardData = [
  {
    id: 1,
    image: img1,
    title: "Advanced Printing Technology",
    description:
      "Our cutting-edge printers ensure precision and quality, delivering exceptional results for your projects.",
  },
  {
    id: 2,
    image: img2,
    title: "Quality Premium Materials",
    description:
      "We utilise durable, high-quality materials to guarantee the longevity and excellence of your products",
  },
  {
    id: 3,
    image: img3,
    title: "Personalized Services",
    description:
      "Tailored to your requirements, our bespoke 3D printing services cater to your individualized design and manufacturing needs",
  },
  {
    id: 4,
    image: img4,
    title: "Expert Guidance",
    description:
      "Our experienced advisors provide professional insights and support throughout your 3D printing journey.",
  },
];

function WhyChooseSection() {
  return (
    <section
      style={{
        position: "relative",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        paddingTop: "120px",
        paddingBottom: "60px",
        minHeight: "600px",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          className=" heading text-uppercase mb-3 text-start reveal-on-scroll sr-left sr-slow"
          style={{ fontFamily: "Staatliches, sans-serif", lineHeight: "1.2", fontSize: "72px" }}
        >
          WHY CHOOSE MAKEIT3D
        </h2>
        <p className=" para mb-5 fs-5 text-start reveal-on-scroll sr-right" style={{ color: "#ccc" }}>
          <strong>Custom solutions</strong> for your ideas — from 3D model to
          finished product
        </p>

        <div className="row justify-content-center g-4 gallery-grid">
          {cardData.map(({ id, image, title, description }) => (
            <div key={id} className="col-12 col-md-6">
              <div
                className="bg-dark position-relative glow-hover tilt reveal-on-scroll sr-zoom"
                style={{
                  backgroundColor: "#1F1F1E",
                  minHeight: "320px",
                  borderRadius: "30px",
                  padding: "40px",
                  margin: "0.5rem",
                  border: "2px solid transparent",
                  transition: "background-color 0.5s ease",
                }}
              >
                {/* Number badge top right */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    userSelect: "none",
                  }}
                >
                  {id < 10 ? `0${id}` : id}
                </div>

                <div className="mb-3 d-flex justify-content-start">
                  <img
                    src={image}
                    alt={title}
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="img-fluid mask-reveal"
                  />
                </div>

                <h5 className="fw-bold mb-2 text-start">{title}</h5>
                <p className="mb-0 text-start" style={{ color: "#ccc" }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for glow blink effect */}
      <style>{`
        @keyframes glowBlink {
          0%, 100% {
            box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0);
            border-color: transparent;
            background-color: #1F1F1E;
          }
          50% {
            box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.6);
            border-color: #fff;
            background-color: #292929;
          }
        }

        .glow-hover:hover {
          animation: glowBlink 1.8s ease-in-out infinite;
          cursor: pointer;
          background-color: #292929 !important;
        }
      `}</style>
    </section>
  );
}

export default WhyChooseSection;
