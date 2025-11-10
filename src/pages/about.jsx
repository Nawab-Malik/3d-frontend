import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function AboutPage() {
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
              Crafting the future in 3D
            </h1>
            <p style={{ color: "#cfd0d3", fontSize: 18, maxWidth: 760, marginTop: 14 }}>
              We blend precision engineering with artisanal finishing to deliver premium 3D prints that feel
              as exceptional as they look.
            </p>
          </div>
        </section>

        {/* Story + Highlights */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 24,
                color: "#e9eaf0",
                backdropFilter: "blur(8px)",
              }}
            >
              <h3 style={{ color: "white", marginTop: 0 }}>Our story</h3>
              <p style={{ color: "#cfd0d3", lineHeight: 1.8 }}>
                What began as a small studio of makers has evolved into a full‑service 3D printing atelier. Today we
                help startups and global brands prototype, iterate and produce with confidence—unit by unit or at
                scale—without compromising finish, fit or function.
              </p>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(81,79,110,0.18), rgba(156,152,212,0.18))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  color: "white",
                  padding: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>6+</div>
                  <div style={{ color: "#cfd0d3" }}>Years</div>
                </div>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>2k+</div>
                  <div style={{ color: "#cfd0d3" }}>Projects</div>
                </div>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>30+</div>
                  <div style={{ color: "#cfd0d3" }}>Materials</div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "white",
                  padding: 20,
                }}
              >
                <div style={{ color: "#cfd0d3" }}>Trusted by product teams, architects and artists worldwide.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 80px" }}>
          <h3 style={{ color: "white", margin: "0 0 16px 0" }}>Our values</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { title: "Precision", text: "Tolerances you can trust. Every micron matters." },
              { title: "Craftsmanship", text: "From surface prep to paint, finish is everything." },
              { title: "Care", text: "White‑glove service from brief to delivery." },
            ].map((v) => (
              <div
                key={v.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "white",
                  padding: 20,
                  minHeight: 140,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{v.title}</div>
                <div style={{ color: "#cfd0d3" }}>{v.text}</div>
              </div>
            ))}
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
            <div style={{ color: "#e9eaf0" }}>Ready to bring your idea to life?</div>
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
              Start a project
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage;
