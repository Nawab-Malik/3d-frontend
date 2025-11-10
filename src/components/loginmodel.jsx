// components/LoginModal.js
import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./forgotpasswordmodal";

function LoginModal({ show, handleClose, handleLoginSuccess, showSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // CORRECTED API ENDPOINT - changed from /api/auth/login to /api/users/login
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        if (response.data.user?.role === "admin") {
          setError("Admin accounts cannot log in here. Please use the Admin portal at /admin.");
          setIsLoading(false);
          return;
        }
        // Store token and user data
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Call the success handler
        handleLoginSuccess(response.data.user);

        // Close modal and reset form
        handleClose();
        setEmail("");
        setPassword("");

        // Show success message
        alert(`Welcome back, ${response.data.user.name}!`);

        // Navigate to home page or dashboard
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaSignInAlt className="me-2" /> Login
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                className="position-absolute end-0 top-0"
                style={{ border: "none" }}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column">
          <Button
            type="submit"
            className="w-100 mb-2"
            disabled={isLoading}
            style={{ backgroundColor: "#514F6E", border: "none" }}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>

          <div className="text-center w-100">
            <span>Don't have an account? </span>
            <Button
              variant="link"
              className="p-0 ms-1 text-decoration-none"
              onClick={showSignup}
            >
              Sign Up
            </Button>
          </div>
        </Modal.Footer>
      </Form>
      <ForgotPasswordModal
        show={showForgot}
        handleClose={() => setShowForgot(false)}
        presetEmail={email}
      />
    </Modal>
  );
}

export default LoginModal;
