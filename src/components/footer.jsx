import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import axios from "axios";
import logo from "../assets/logo.svg"; // Adjust the relative path based on your folder structure

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "https://3-d-backend-3pgu.vercel.app";

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubLoading(true);
    setSubMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/subscriptions`, {
        email,
        source: "footer",
      });

      if (response.data && response.data.subscription) {
        setSubMessage(
          "Subscribed successfully! Check your email for your discount."
        );
        setEmail("");
      } else {
        setSubMessage(response.data?.message || "Subscribed successfully.");
        setEmail("");
      }
    } catch (error) {
      console.error("Footer subscription error:", error);
      setSubMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <>
      <footer className="bg-black text-white pt-5 pb-3">
        <div className="container">
          <div className="row gx-5">
            {/* Left Column */}
            <div className="col-md-4 mb-4 mb-md-0">
              <Link to="/">
                <img
                  src={logo} // Use imported logo here
                  alt="Logo"
                  className="mb-3"
                  style={{ maxWidth: "150px" }}
                />
              </Link>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <span style={{ opacity: 0.8 }}>Terms and Conditions</span>
                </li>
                <li className="mb-2">
                  <span style={{ opacity: 0.8 }}>Privacy Policy</span>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white text-decoration-none"
                  >
                    Stay in touch
                  </Link>
                </li>
              </ul>
            </div>

            {/* Center Column */}
            <div className="col-md-4 mb-4 mb-md-0 d-flex flex-column">
              <ul className="list-unstyled mb-3">
                {/* You can add center column links here if needed */}
              </ul>
              <Link
                to="/second"
                className="mb-2 text-white text-decoration-none"
              >
                Quote
              </Link>
              <Link
                to="/products"
                className="mb-2 text-white text-decoration-none"
              >
                Store
              </Link>
              <Link
                to="/delivery"
                className="mb-2 text-white text-decoration-none"
              >
                Delivery
              </Link>
              <Link to="/about" className="text-white text-decoration-none">
                About Us
              </Link>

              {/* Simple subscription form in footer */}
              <form onSubmit={handleSubscribe} className="mt-3">
                <label className="form-label" style={{ opacity: 0.9 }}>
                  Subscribe to our newsletter
                </label>
                <div className="input-group mb-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={subLoading}
                  >
                    {subLoading ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
                {subMessage && (
                  <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                    {subMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Right Column */}
            <div className="col-md-4 d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <FaPhoneAlt className="me-2" />
                <span>+1 234 567 890</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaEnvelope className="me-2" />
                <span>mi3duk@gmail.com</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaMapMarkerAlt className="me-2" />
                <span>1234 Random St, City, Country</span>
              </div>
              <div className="d-flex gap-3 mt-auto">
                <a
                  href="https://wa.me/15551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white fs-4"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white fs-4"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white fs-4"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom copyright bar */}
      <div
        className="bg-dark text-white text-center py-3"
        style={{ fontSize: "0.9rem" }}
      >
        © 2025 3D PRINTS
      </div>
    </>
  );
}
