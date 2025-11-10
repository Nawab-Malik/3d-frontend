import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Navbar from "./navbar"; // Make sure path is correct
import "./home.css";
import backgroundImage from "../assets/background1.jpg";
import rightSideImage1 from "../assets/right-image1.png";

const slides = [
  { id: 1, showContent: true },
  { id: 2, showContent: false },
  { id: 3, showContent: false },
];

function HomeCarousel() {
  return (
    <div className="position-relative">
      {/* Navbar over carousel */}
      <div className="position-absolute top-0 start-0 w-100 z-3">
        <Navbar />
      </div>

      <Carousel
        variant="white"
        indicators
        controls
        interval={null}
        fade={false}
        className="vh-100"
        style={{ overflow: "hidden" }}
      >
        {slides.map((slide) => (
          <Carousel.Item
            key={slide.id}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100vh",
            }}
          >
            {slide.showContent ? (
              <div
                className="container-fluid h-100 d-flex align-items-center justify-content-center flex-wrap"
                style={{ maxWidth: "1700px", padding: "0 40px", gap: "40px", marginTop: "100px" }}
              >
                {/* Left side - Title & text */}
                <div
                  className="text-white"
                  style={{
                    flex: "1 1 45%",
                    minWidth: "300px",
                    maxWidth: "600px",
                    width: "45%",
                  }}
                >
                  <h1 className="hero-heading carousel-title display-4 mb-4 reveal-on-scroll sr-left sr-slow">
                    INNOVATIVE 3D PRINTING
                    <br /> SOLUTION FOR YOUR <br /> IDEAS
                  </h1>
                  <p
                    className="mb-4 hero-para reveal-on-scroll sr-right"
                    style={{ maxWidth: "650px", fontSize: "1.3rem" }}
                  >
                    From concept to finished product — precise, fast, and
                    reliable with cutting-edge 3D printing technology
                  </p>
                  <button
                    className="btn carousel-button hero-btn reveal-on-scroll sr-zoom"
                    style={{
                      background: "#6B689C",
                      color: "white",
                      border: "none",
                      transition: "background-color 0.3s ease",
                      marginTop: "1rem",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#8079BE")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#6B689C")
                    }
                  >
                    Make My Design
                  </button>
                </div>

                {/* Right side - Image */}
                <div
                  className="d-flex justify-content-center"
                  style={{
                    flex: "1 1 45%",
                    minWidth: "300px",
                    maxWidth: "600px",
                    width: "45%",
                  }}
                >
                  <img
                    src={rightSideImage1}
                    alt="Right side visual"
                    className="img-fluid hero-image reveal-on-scroll mask-reveal parallax-y sr-slow"
                    data-speed="0.12"
                    style={{ maxHeight: "550px", maxWidth: "100%" }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ height: "100vh", width: "100%" }} />
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default HomeCarousel;
