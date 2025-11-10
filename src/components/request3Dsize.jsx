import React, { useState, useMemo } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowRight } from "react-icons/fa";
import "./request3Dsize.css";
import shapeRect from "../assets/card1.png";
import shapeSquare from "../assets/card2.png";
import shapeCircle from "../assets/card3.png";
import shapeDiamond from "../assets/card4.png";
import shapeOval from "../assets/product1.jpg";
import sizeImg1 from "../assets/product1.jpg";
import sizeImg2 from "../assets/product2.jpg";
import sizeImg3 from "../assets/product3.jpg";

const steps = ["Shape", "Size", "Material", "Extras", "Summary"];

// Shapes data for Step 1
const shapes = [
  { name: "Rectangle", img: shapeRect },
  { name: "Square", img: shapeSquare },
  { name: "Circle", img: shapeCircle },
  { name: "Diamond", img: shapeDiamond },
  { name: "Oval", img: shapeOval },
];

// Sizes data for Step 2
const ALL_SIZES = [
  {
    id: 1,
    label: "20 x 10 mm",
    thumb: sizeImg1,
    img: sizeImg1,
  },
  {
    id: 2,
    label: "25 x 12 mm",
    thumb: sizeImg2,
    img: sizeImg2,
  },
  {
    id: 3,
    label: "30 x 15 mm",
    thumb: sizeImg3,
    img: sizeImg3,
  },
  {
    id: 4,
    label: "35 x 18 mm",
    thumb: sizeImg1,
    img: sizeImg1,
  },
  {
    id: 5,
    label: "40 x 20 mm",
    thumb: sizeImg2,
    img: sizeImg2,
  },
  {
    id: 6,
    label: "45 x 22 mm",
    thumb: sizeImg3,
    img: sizeImg3,
  },
  {
    id: 7,
    label: "50 x 25 mm",
    thumb: sizeImg1,
    img: sizeImg1,
  },
  {
    id: 8,
    label: "55 x 28 mm",
    thumb: sizeImg2,
    img: sizeImg2,
  },
  {
    id: 9,
    label: "60 x 30 mm",
    thumb: sizeImg3,
    img: sizeImg3,
  },
  {
    id: 10,
    label: "65 x 32 mm",
    thumb: sizeImg1,
    img: sizeImg1,
  },
];

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function Request3DPrint() {
  // Step & state
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 state: shape selection
  const [activeShape, setActiveShape] = useState(shapes[0].name);

  // Step 2 states: size selection
  const slides = useMemo(() => chunkArray(ALL_SIZES, 5), []);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState(ALL_SIZES[0].id);
  const selectedSize =
    ALL_SIZES.find((s) => s.id === selectedSizeId) || ALL_SIZES[0];

  const widthOptions = [
    "20 mm",
    "25 mm",
    "30 mm",
    "35 mm",
    "40 mm",
    "45 mm",
    "50 mm",
  ];
  const heightOptions = [
    "10 mm",
    "12 mm",
    "15 mm",
    "18 mm",
    "20 mm",
    "22 mm",
    "25 mm",
  ];
  const radiusOptions = ["0 mm", "1 mm", "2 mm", "3 mm", "4 mm", "5 mm"];

  const [width, setWidth] = useState(widthOptions[0]);
  const [height, setHeight] = useState(heightOptions[0]);
  const [radius, setRadius] = useState(radiusOptions[0]);
  const [quantity, setQuantity] = useState("1");

  // Step 3: materials
  const materialOptions = [
    { id: "pla", name: "PLA (Standard)", desc: "Affordable, easy to print, eco-friendly" },
    { id: "petg", name: "PETG (Durable)", desc: "Impact-resistant, slightly flexible" },
    { id: "abs", name: "ABS (Tough)", desc: "Heat-resistant, strong, requires enclosure" },
    { id: "resin", name: "Resin (High detail)", desc: "Crisp details, smooth finish" },
  ];
  const [material, setMaterial] = useState(materialOptions[0].id);

  // Step 4: extras
  const [extras, setExtras] = useState({
    sanding: false,
    priming: false,
    painting: false,
    adhesiveBack: false,
  });
  const toggleExtra = (key) => setExtras((e) => ({ ...e, [key]: !e[key] }));
  const [submitted, setSubmitted] = useState(false);

  const onSlide = (idx) => {
    setActiveSlide(idx);
    const firstOfSlide = slides[idx][0];
    if (firstOfSlide) setSelectedSizeId(firstOfSlide.id);
  };
  // Render the step content dynamically
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <p className="choose-shape-text mb-4 shape-text">Choose your shape:</p>
            <div className="shape-img row g-4 justify-content-center">
              {shapes.map((shape, index) => (
                <div
                  key={index}
                  className={`col-12 col-sm-6 ${index < 3 ? "col-md-4 col-lg-3" : "col-md-6 col-lg-4"}`}
                >
                  <div
                    className={`shape-card p-4 h-100 ${activeShape === shape.name ? "shape-selected" : ""}`}
                    onClick={() => setActiveShape(shape.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={shape.img} alt={shape.name} className="img-fluid mb-3 shape-image" />
                    <p className={`mb-0 shape-text ${activeShape === shape.name ? "text-colored" : "text-secondary"}`}>
                      {shape.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="size-carousel-wrapper mb-3 size-choices">
              <Carousel activeIndex={activeSlide} onSelect={onSlide} indicators={false} controls interval={null}>
                {slides.map((group, slideIdx) => (
                  <Carousel.Item key={slideIdx}>
                    <div className="d-flex justify-content-center flex-wrap gap-3 px-2 py-3">
                      {group.map((size) => (
                        <div
                          key={size.id}
                          className={`size-thumb-card text-center ${selectedSizeId === size.id ? "size-thumb-active" : ""}`}
                          onClick={() => setSelectedSizeId(size.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <img src={size.thumb} alt={size.label} className="img-fluid size-thumb-img" />
                          <div className="size-thumb-label mt-2">{size.label}</div>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            <div className="text-center mb-3">
              <p className="mb-1 choose-custom-label custom-paragraph">Choose your own <strong>custom size:</strong></p>
            </div>

            <div className="row gy-3 mb-4 size-controls">
              <div className="col-12 col-md-4 text-start">
                <label className="form-label control-label">Width</label>
                <select className="form-select" value={width} onChange={(e) => setWidth(e.target.value)}>
                  {widthOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4 text-start">
                <label className="form-label control-label">Height</label>
                <select className="form-select" value={height} onChange={(e) => setHeight(e.target.value)}>
                  {heightOptions.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4 text-start">
                <label className="form-label control-label">Corner Radius</label>
                <select className="form-select" value={radius} onChange={(e) => setRadius(e.target.value)}>
                  {radiusOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="selected-preview-wrapper text-center mb-3 finalized-img">
              <div className="selected-preview position-relative d-inline-block">
                <img src={sizeImg2} alt={selectedSize.label} className="img-fluid selected-image" />
                <div className="label-top-left">W: <span>{width}</span></div>
                <div className="label-top-right">R: <span>{radius}</span></div>
                <div className="label-bottom-center">H: <span>{height}</span></div>
              </div>
            </div>

            <div className="text-center mb-4">
              <label className="form-label d-block mb-2">Enter quantity</label>
              <select className="form-select w-auto d-inline-block" style={{ minWidth: 110 }} value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <div className="row gy-3 mt-3">
            {materialOptions.map((opt) => (
              <div key={opt.id} className="col-12 col-md-6">
                <label className={`d-flex align-items-start p-3 border rounded-3 w-100 ${material === opt.id ? "border-primary" : "border-light"}`} style={{ cursor: "pointer", background: "#fff" }}>
                  <input type="radio" name="material" className="form-check-input me-3 mt-1" checked={material === opt.id} onChange={() => setMaterial(opt.id)} />
                  <div>
                    <div className="fw-bold">{opt.name}</div>
                    <div className="text-muted small">{opt.desc}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="row gy-3 mt-3">
            {[
              { key: "sanding", label: "Sanding (smooth surface)" },
              { key: "priming", label: "Priming (ready for paint)" },
              { key: "painting", label: "Painting (single color)" },
              { key: "adhesiveBack", label: "Adhesive backing" },
            ].map((ex) => (
              <div className="col-12 col-md-6" key={ex.key}>
                <label className="d-flex align-items-center p-3 border rounded-3 w-100" style={{ cursor: "pointer", background: "#fff" }}>
                  <input type="checkbox" className="form-check-input me-3" checked={extras[ex.key]} onChange={() => toggleExtra(ex.key)} />
                  <div className="fw-semibold">{ex.label}</div>
                </label>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="row g-4 align-items-start mt-2">
            {submitted && (
              <div className="col-12">
                <div className="alert alert-success" role="alert">
                  Your quote request has been submitted. We will contact you soon.
                </div>
              </div>
            )}
            <div className="col-12 col-lg-6 text-center finalized-img">
              <div className="selected-preview position-relative d-inline-block">
                <img src={sizeImg2} alt="Preview" className="img-fluid selected-image" />
                <div className="label-top-left">W: <span>{width}</span></div>
                <div className="label-top-right">R: <span>{radius}</span></div>
                <div className="label-bottom-center">H: <span>{height}</span></div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="p-3 border rounded-3 bg-white">
                <h5 className="mb-3">Summary</h5>
                <ul className="list-unstyled mb-3">
                  <li><strong>Shape:</strong> {activeShape}</li>
                  <li><strong>Size:</strong> {selectedSize.label}</li>
                  <li><strong>Width:</strong> {width}</li>
                  <li><strong>Height:</strong> {height}</li>
                  <li><strong>Radius:</strong> {radius}</li>
                  <li><strong>Quantity:</strong> {quantity}</li>
                  <li><strong>Material:</strong> {materialOptions.find(m => m.id === material)?.name}</li>
                  <li><strong>Extras:</strong> {Object.entries(extras).filter(([, v]) => v).map(([k]) => ({ sanding: "Sanding", priming: "Priming", painting: "Painting", adhesiveBack: "Adhesive backing" })[k]).join(", ") || "None"}</li>
                </ul>
                <button className="btn btn-primary btn-next" style={{ background: "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)", border: "none" }} onClick={() => setSubmitted(true)}>Request Quote</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      <h2 className="request-title text-center mb-3">Request your <span className="title-colored">3D PRINT</span></h2>

      <div className="d-flex justify-content-center align-items-center flex-wrap mb-4 step-container">
        {steps.map((step, index) => (
          <div key={index} className="d-flex align-items-center step-wrapper mx-2" onClick={() => setActiveStep(index)} style={{ cursor: "pointer" }}>
            <div className={`step-circle ${activeStep === index ? "active-step" : "inactive-step"}`}>{index + 1}</div>
            <span className={`step-text ms-2 ${activeStep === index ? "text-black" : "text-secondary"}`}>{step}</span>
            {index < steps.length - 1 && (<FaArrowRight className="mx-3 text-secondary" />)}
          </div>
        ))}
      </div>

      {renderStepContent()}

      <div className="d-flex justify-content-between align-items-center mt-5" style={{ gap: "10px" }}>
        <button className="btn btn-outline-secondary" style={{ width: 214, height: 50, paddingTop: 12, paddingRight: 32, paddingBottom: 13, paddingLeft: 32, borderRadius: 8, opacity: 1, border: "1px solid #ccc", backgroundColor: "transparent", cursor: "pointer" }} onClick={() => setActiveStep((s) => Math.max(s - 1, 0))} disabled={activeStep === 0}>Back</button>
        <button className="btn" style={{ width: 214, height: 50, paddingTop: 12, paddingRight: 32, paddingBottom: 13, paddingLeft: 32, borderRadius: 8, opacity: 1, background: "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)", color: "#fff", border: "none", cursor: "pointer" }} onClick={() => setActiveStep((s) => Math.min(s + 1, steps.length - 1))} disabled={activeStep === steps.length - 1}>Next</button>
      </div>
    </div>
  );
}
