import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function ForgotPasswordModal({ show, handleClose, presetEmail = "" }) {
  const [email, setEmail] = useState(presetEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    setDevResetUrl("");

    try {
      const res = await axios.post(
        "https://3-d-backend-3pgu.vercel.app/api/users/forgot-password",
        {
          email,
        }
      );
      setMessage(
        res.data?.message || "If an account exists, a reset link has been sent."
      );
      if (res.data?.resetUrl) {
        setDevResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {message && <Alert variant="success">{message}</Alert>}
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
          {devResetUrl && (
            <Alert variant="info">
              Development reset link: <a href={devResetUrl}>{devResetUrl}</a>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: "#514F6E", border: "none" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ForgotPasswordModal;
