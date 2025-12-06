// components/LoginModal.js
import React, { useState, useContext } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ForgotPasswordModal from "./forgotpasswordmodal";

function LoginModal({ show, handleClose, handleLoginSuccess, showSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginData = {
        email: email.trim().toLowerCase(),
        password,
      };

      console.log("Login attempt with email:", loginData.email);

      const response = await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/users/login",
        loginData
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        if (response.data.user?.role === "admin") {
          setError(
            "Admin accounts cannot log in here. Please use the Admin portal at /admin-login."
          );
          setIsLoading(false);
          return;
        }

        // Use AuthContext to store login state
        login(response.data.user, response.data.token, false);

        // Call the success handler
        handleLoginSuccess(response.data.user);

        // Close modal and reset form
        handleClose();
        setEmail("");
        setPassword("");

        // Show success message
        alert(`Welcome back, ${response.data.user.name}!`);

        // Navigate to home page
        navigate("/");
      }
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
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
