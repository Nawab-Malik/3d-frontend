import React, { useState, useContext } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SignupModal({ show, handleClose, handleSignupSuccess, showLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(""); // NEW: Referral code field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      // Add phone only if provided
      if (phone.trim()) {
        signupData.phone = phone.trim();
      }

      // Add referral code only if provided (don't send empty string)
      if (referralCode.trim()) {
        signupData.referralCode = referralCode.trim().toUpperCase();
      }

      console.log("Signup data being sent:", {
        ...signupData,
        password: "[HIDDEN]",
        passwordLength: password.length,
      });

      const response = await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/users/signup",
        signupData
      );

      console.log("Signup response:", response.data);

      if (response.data.success && response.data.token) {
        // Backend returned token - user is automatically logged in
        login(response.data.user, response.data.token, false);

        handleSignupSuccess(response.data.user);

        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setReferralCode("");
        handleClose();

        alert(
          `Welcome, ${response.data.user.name}! Your account has been created and you are now logged in.`
        );
        navigate("/");
      } else if (response.data.success && !response.data.token) {
        // Backend created user but didn't return token
        alert(
          `Account created successfully! Please log in with your credentials.`
        );
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setReferralCode("");
        handleClose();
        showLogin(); // Open login modal
      }
    } catch (err) {
      console.error("Signup error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // More specific error messages
      let errorMessage = "Signup failed. Please try again.";

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
          <FaUserPlus className="me-2" /> Sign Up
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address *</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (min. 6 characters)"
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

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                className="position-absolute end-0 top-0"
                style={{ border: "none" }}
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
              placeholder="e.g., REFABC123"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
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
