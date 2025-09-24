import React, { useEffect, useState } from "react";

const api = "https://demo.stss.in/admin/Config/router.php?router=";

const InteriorDesignSection = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}interior_providers`)
      .then((res) => res.json())
      .then((data) => {
        setProviders(data.data); // expecting API returns array with keys: name, logo, services, timeline, priceRange, phone, email, gradient
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching interior providers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", color: "white" }}>Loading interior providers...</p>;
  }

  return (
    <section style={{ padding: "100px 20px", background: "#4585b2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", color: "white", marginBottom: "20px" }}>
            Premium Home Interior Providers
          </h1>
          <p style={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.9)", maxWidth: "800px", margin: "0 auto" }}>
            Explore trusted brands delivering stylish, functional, and affordable home interiors tailored to your lifestyle
          </p>
        </div>

        {/* Providers Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "30px" }}>
          {providers.map((provider, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "24px",
                padding: "35px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px) scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "150px",
                  height: "150px",
                  background: provider.gradient,
                  borderRadius: "50%",
                  opacity: "0.1",
                  zIndex: "0"
                }}
              ></div>

              {/* Logo and Name */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", position: "relative", zIndex: "1" }}>
                <div
                  style={{
                    background: provider.gradient,
                    borderRadius: "20px",
                    width: "75px",
                    height: "75px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    overflow: "hidden"
                  }}
                >
                  <img src={provider.logo} alt={provider.name} style={{ width: "70%", height: "70%", objectFit: "contain" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1a202c", margin: "0 0 5px 0" }}>{provider.name}</h3>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#2d3748" }}>{provider.services}</div>
                </div>
              </div>

              {/* Timeline & Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "30px" }}>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.7)", borderRadius: "16px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "600", marginBottom: "8px" }}>Timeline</div>
                  <div style={{ fontWeight: "700", color: "#1a202c", fontSize: "1.1rem" }}>{provider.timeline}</div>
                </div>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.7)", borderRadius: "16px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "600", marginBottom: "8px" }}>Price Range</div>
                  <div style={{ fontWeight: "700", color: "#1a202c", fontSize: "1.1rem" }}>{provider.priceRange}</div>
                </div>
              </div>

              {/* Contact */}
              <div style={{ borderTop: "2px solid rgba(0,0,0,0.08)", paddingTop: "25px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0" }}>
                  <i className="fas fa-phone-alt" style={{ color: "#667eea", fontSize: "1rem" }}></i>
                  <span style={{ color: "#4a5568", fontWeight: "600" }}>{provider.phone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0" }}>
                  <i className="fas fa-envelope" style={{ color: "#667eea", fontSize: "1rem" }}></i>
                  <span style={{ color: "#4a5568", fontWeight: "600", wordBreak: "break-all" }}>{provider.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: "center", marginTop: "60px", padding: "30px", background: "rgba(255,255,255,0.1)", borderRadius: "20px" }}>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", margin: "0" }}>
            ✨ Prices and timelines may vary depending on project size, materials, and customization. Always consult providers for exact quotes.
          </p>
        </div>
      </div>

      {/* FontAwesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </section>
  );
};

export default InteriorDesignSection;
