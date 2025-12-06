// components/SignupModal.js
import React, { useState, useContext } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SignupModal({ show, handleClose, showLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    referralCode: "", // NEW: Referral code field
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    let value = e.target.value;

    // Auto-uppercase referral code
    if (e.target.name === "referralCode") {
      value = value.toUpperCase();
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // Add phone only if provided
      if (formData.phone.trim()) {
        signupData.phone = formData.phone.trim();
      }

      // Add referral code only if provided (don't send empty string)
      if (formData.referralCode.trim()) {
        signupData.referralCode = formData.referralCode.trim().toUpperCase();
      }

      console.log("Signup data being sent:", {
        ...signupData,
        password: "[HIDDEN]",
        passwordLength: formData.password.length,
      });

      const response = await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/users/signup",
        signupData
      );

      console.log("Signup response:", response.data);

      if (response.data.success && response.data.token) {
        // Backend returned token - user is automatically logged in
        login(response.data.user, response.data.token, false);

        handleClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          referralCode: "",
        });

        alert(
          `Welcome, ${response.data.user.name}! Your account has been created and you are now logged in.`
        );
        navigate("/");
      } else if (response.data.success && !response.data.token) {
        // Backend created user but didn't return token
        // Show message and redirect to login
        alert(
          `Account created successfully! Please log in with your credentials.`
        );
        handleClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          referralCode: "",
        });
        showLogin(); // Open login modal
      }
    } catch (err) {
      console.error("Signup error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // More specific error messages
      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.status === 400) {
        if (err.response?.data?.message?.includes("already exists")) {
          errorMessage =
            "An account with this email already exists. Please login instead.";
        } else {
          errorMessage = err.response?.data?.message || errorMessage;
        }
      } else if (err.response?.status === 500) {
        errorMessage =
          "Server error. Please try again later or contact support.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaUserPlus className="me-2" /> Create Account
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <Button
                variant="outline-secondary"
                className="position-absolute end-0 top-0"
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                className="position-absolute end-0 top-0"
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {/* NEW: Referral Code Input Field */}
          <Form.Group className="mb-3">
            <Form.Label>
              Referral Code{" "}
              <span style={{ color: "#999", fontSize: "0.85rem" }}>
                (Optional)
              </span>
            </Form.Label>
            <Form.Control
              type="text"
              name="referralCode"
              placeholder="e.g., REFABC123"
              value={formData.referralCode}
              onChange={handleChange}
              style={{
                textTransform: "uppercase",
              }}
            />
            <Form.Text className="text-muted d-block mt-2">
              💡 Have a friend on our platform? Enter their referral code here
              to unlock rewards!
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column">
          <Button
            type="submit"
            className="w-100 mb-2"
            disabled={isLoading}
            style={{ backgroundColor: "#514F6E", border: "none" }}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center w-100">
            <span>Already have an account? </span>
            <Button
              variant="link"
              className="p-0 ms-1 text-decoration-none"
              onClick={showLogin}
            >
              Login
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SignupModal;
