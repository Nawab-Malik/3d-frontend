import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setError("");
      await axios.post("https://3-d-backend-3pgu.vercel.app/api/contact", {
        name,
        email,
        phone,
        message,
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 140, background: "#0b0b10" }}>
        <section
          style={{
            background:
              "radial-gradient(1000px 600px at 20% -10%, rgba(156,152,212,0.25), transparent 60%), radial-gradient(900px 500px at 100% -20%, rgba(81,79,110,0.35), transparent 60%)",
            color: "white",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "80px 20px 40px",
            }}
          >
            <h1
              style={{
                fontFamily: "Staatliches, sans-serif",
                fontSize: 72,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: 1,
              }}
            >
              Let's make it 3D.
            </h1>
            <p
              style={{
                color: "#cfd0d3",
                fontSize: 18,
                maxWidth: 680,
                marginTop: 14,
              }}
            >
              Tell us about your idea, and we'll craft a tailored solution with
              premium materials, meticulous finishing and white‑glove delivery.
            </p>
          </div>
        </section>

        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 20px 80px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 24,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 24,
                backdropFilter: "blur(8px)",
              }}
            >
              {submitted && (
                <div
                  style={{
                    background: "rgba(76,175,80,0.15)",
                    border: "1px solid rgba(76,175,80,0.35)",
                    color: "#b9ebc0",
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 16,
                  }}
                >
                  Thanks! Your message has been sent. We'll get back to you
                  shortly.
                </div>
              )}
              {!!error && (
                <div
                  style={{
                    background: "rgba(255, 99, 71, 0.15)",
                    border: "1px solid rgba(255, 99, 71, 0.35)",
                    color: "#ffb3b3",
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}
              <h3 style={{ color: "white", marginTop: 0, marginBottom: 12 }}>
                Send us a message
              </h3>
              <form onSubmit={submit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <div>
                    <label style={{ color: "#cfd0d3", fontSize: 13 }}>
                      Full name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        borderRadius: 10,
                        padding: "12px 14px",
                        marginTop: 6,
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: "#cfd0d3", fontSize: 13 }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        borderRadius: 10,
                        padding: "12px 14px",
                        marginTop: 6,
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: "#cfd0d3", fontSize: 13 }}>
                      Phone
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(+1) 555‑123‑4567"
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        borderRadius: 10,
                        padding: "12px 14px",
                        marginTop: 6,
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ color: "#cfd0d3", fontSize: 13 }}>
                    Project details
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your model, dimensions, material preferences, budget and timeline."
                    rows={6}
                    required
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "white",
                      borderRadius: 10,
                      padding: "12px 14px",
                      marginTop: 6,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      background:
                        "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px 22px",
                      borderRadius: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {sending ? "Sending..." : "Send message"}
                  </button>
                  <span style={{ color: "#a7a8ad", fontSize: 13 }}>
                    Average response time: under 2 hours
                  </span>
                </div>
              </form>
            </div>

            <aside style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  background:
                    "linear-gradient(180deg, rgba(81,79,110,0.15), rgba(156,152,212,0.15))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  color: "white",
                  padding: 20,
                }}
              >
                <h4 style={{ marginTop: 0, marginBottom: 10 }}>
                  Contact details
                </h4>
                <div style={{ color: "#cfd0d3", lineHeight: 1.8 }}>
                  <div>Email: hello@makeit3d.example</div>
                  <div>Phone: (+1) 555‑123‑4567</div>
                  <div>Hours: Mon–Sat 9:00–19:00</div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "white",
                  padding: 0,
                  overflow: "hidden",
                  minHeight: 260,
                }}
              >
                <div
                  style={{
                    padding: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Our studio
                </div>
                <div
                  style={{
                    height: 220,
                    background: "#11131a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#697085",
                  }}
                >
                  Map placeholder
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContactPage;
