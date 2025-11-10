import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function DeliveryPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 140, background: "#0b0b10" }}>
        {/* Hero */}
        <section
          style={{
            background:
              "radial-gradient(1000px 600px at 15% -10%, rgba(156,152,212,0.25), transparent 60%), radial-gradient(900px 500px at 100% -20%, rgba(81,79,110,0.35), transparent 60%)",
            color: "white",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px 40px" }}>
            <h1
              style={{
                fontFamily: "Staatliches, sans-serif",
                fontSize: 72,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: 1,
              }}
            >
              White‑glove delivery
            </h1>
            <p style={{ color: "#cfd0d3", fontSize: 18, maxWidth: 760, marginTop: 14 }}>
              From our studio to your doorstep, every print is protected, tracked and delivered with care.
            </p>
          </div>
        </section>

        {/* Options */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 64px" }}>
          <h3 style={{ color: "white", margin: "0 0 16px 0" }}>Shipping options</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { title: "Standard", text: "3–5 business days with tracking" },
              { title: "Express", text: "1–2 business days via priority carriers" },
              { title: "Local pickup", text: "Pick up from our studio by appointment" },
            ].map((opt) => (
              <div
                key={opt.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "white",
                  padding: 20,
                  minHeight: 120,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{opt.title}</div>
                <div style={{ color: "#cfd0d3" }}>{opt.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Packaging */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                color: "white",
                padding: 20,
              }}
            >
              <h4 style={{ marginTop: 0 }}>Packaging & handling</h4>
              <p style={{ color: "#cfd0d3", lineHeight: 1.8 }}>
                Each item is inspected, cushioned and sealed to protect surfaces and structural integrity. Fragile
                finishes receive additional wrapping and corner protection.
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(180deg, rgba(81,79,110,0.18), rgba(156,152,212,0.18))",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                color: "white",
                padding: 20,
              }}
            >
              <h4 style={{ marginTop: 0 }}>Typical timeline</h4>
              <ol style={{ margin: 0, paddingLeft: 18, color: "#cfd0d3", lineHeight: 1.8 }}>
                <li>Print & finishing: 1–3 business days</li>
                <li>Quality check & pack: same day</li>
                <li>Courier pickup & tracking activation</li>
                <li>Delivery: per option selected</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 80px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              color: "white",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Coverage</div>
            <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#697085", background: "#11131a" }}>
              Nationwide shipping (map placeholder)
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 100px" }}>
          <div
            style={{
              background: "linear-gradient(90deg, rgba(81,79,110,0.25), rgba(156,152,212,0.25))",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "#e9eaf0" }}>Have a deadline? We can expedite.</div>
            <a
              href="/contact"
              style={{
                background: "linear-gradient(90deg, #514F6E 0%, #9C98D4 100%)",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Talk to us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default DeliveryPage;
