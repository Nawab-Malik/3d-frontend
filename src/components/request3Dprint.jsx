import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowRight } from "react-icons/fa";
import "./request3Dprint.css";

function Request3DPrint() {
  const steps = ["Shape", "Size", "Material", "Extras", "Summary"];
  const shapes = [
    { name: "Rectangle", img: "/images/rectangle.png" },
    { name: "Square", img: "/images/square.png" },
    { name: "Circle", img: "/images/circle.png" },
    { name: "Diamond", img: "/images/diamond.png" },
    { name: "Oval", img: "/images/oval.png" },
  ];

  const [activeStep, setActiveStep] = useState(0); // Shape step active by default
  const [activeShape, setActiveShape] = useState(shapes[0].name); // First shape selected by default

  return (
    <div className="container py-5 text-center">
      {/* Title */}
      <h2
        className="request-title mb-4"
        style={{
          fontFamily: "Staatliches, sans-serif",
          lineHeight: "1.2",
          fontSize: "72px",
        }}
      >
        <span className="text-black">Request your</span>{" "}
        <span className="title-colored">3D PRINT</span>
      </h2>

      {/* Steps */}
      <div className="d-flex justify-content-center align-items-center flex-wrap mb-4 step-container">
        {steps.map((step, index) => (
          <div
            key={index}
            className="d-flex align-items-center step-wrapper mx-2"
            onClick={() => setActiveStep(index)}
            style={{ cursor: "pointer" }}
          >
            <div
              className={`step-circle ${
                activeStep === index ? "active-step" : "inactive-step"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`step-text ms-2 ${
                activeStep === index ? "text-black" : "text-secondary"
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <FaArrowRight className="mx-3 text-secondary" />
            )}
          </div>
        ))}
      </div>

      {/* Section Label */}
      <p className="choose-shape-text mb-4 shape-text">Choose your shape:</p>

      {/* Shapes */}
      <div className=" shape-img row g-4 justify-content-center" >
        {shapes.map((shape, index) => (
          <div
            key={index}
            className={`col-12 col-sm-6 ${
              index < 3 ? "col-md-4 col-lg-3" : "col-md-6 col-lg-4"
            }`}
          >
            <div
              className={`shape-card p-4 h-100 ${
                activeShape === shape.name ? "shape-selected" : ""
              }`}
              onClick={() => setActiveShape(shape.name)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={shape.img}
                alt={shape.name}
                className="img-fluid mb-3 shape-image"
              />
              <p
                className={`mb-0 shape-text ${
                  activeShape === shape.name ? "text-colored" : "text-secondary"
                }`}
              >
                {shape.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <div className="mt-5">
        <button className="btn btn-silver-gradient px-5 py-2">Next</button>
      </div>
    </div>
  );
}

export default Request3DPrint;
