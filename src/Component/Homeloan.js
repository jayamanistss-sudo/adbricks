import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const api = "https://demo.stss.in/admin/Config/router.php?router=";

const HomeLoanProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${api}home_loan`)
      .then((res) => res.json())
      .then((data) => {
        setProviders(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching providers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", color: "white" }}>Loading providers...</p>;
  }

  return (
    <section style={{ padding: "100px 20px", background: "#4585b2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#4585b2",
            cursor: "pointer",
            marginBottom: "30px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          ← Back
        </button>

        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 style={{
            fontSize: "3.5rem", fontWeight: "900", color: "white",
            marginBottom: "20px", textShadow: "0 4px 20px rgba(0,0,0,0.3)", letterSpacing: "-0.02em"
          }}>
            Premium Home Loan Providers
          </h1>
          <p style={{
            fontSize: "1.3rem", color: "rgba(255,255,255,0.9)",
            maxWidth: "800px", margin: "0 auto", lineHeight: "1.6", fontWeight: "300"
          }}>
            Compare top-tier financial institutions offering competitive rates and streamlined loan processing
          </p>
          <div style={{
            width: "100px", height: "4px", background: "rgba(255,255,255,0.8)",
            margin: "30px auto", borderRadius: "2px"
          }}></div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "30px"
        }}>
          {providers.map((provider, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(20px)",
              borderRadius: "24px", padding: "35px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              position: "relative", overflow: "hidden"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)";
              }}
            >
              <div style={{
                position: "absolute", top: "-50px", right: "-50px",
                width: "150px", height: "150px", background: provider.gradient,
                borderRadius: "50%", opacity: "0.1", zIndex: 0
              }}></div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", position: "relative", zIndex: 1 }}>
                <div style={{
                  background: provider.gradient, borderRadius: "20px", width: "75px", height: "75px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}>
                  <i className={provider.icon} style={{ color: "white", fontSize: "1.8rem" }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1a202c", margin: "0 0 5px 0" }}>
                    {provider.name}
                  </h3>
                  <div style={{
                    fontSize: "1.3rem", fontWeight: "800", background: provider.gradient,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>
                    {provider.rate}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "30px", position: "relative", zIndex: 1 }}>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.7)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Processing Fee
                  </div>
                  <div style={{ fontWeight: "700", color: "#1a202c", fontSize: "1.1rem" }}>
                    {provider.processing}
                  </div>
                </div>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.7)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Max Tenure
                  </div>
                  <div style={{ fontWeight: "700", color: "#1a202c", fontSize: "1.1rem" }}>
                    {provider.tenure}
                  </div>
                </div>
                <div style={{ gridColumn: "1 / -1", padding: "20px", background: "rgba(255,255,255,0.7)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Maximum Loan Amount
                  </div>
                  <div style={{ fontWeight: "800", color: "#1a202c", fontSize: "1.3rem" }}>
                    {provider.amount}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "2px solid rgba(0,0,0,0.08)", paddingTop: "25px", position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(102, 126, 234, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fas fa-phone-alt" style={{ color: "#667eea", fontSize: "1rem" }}></i>
                  </div>
                  <span style={{ color: "#4a5568", fontWeight: "600", fontSize: "1rem" }}>{provider.phone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(102, 126, 234, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fas fa-envelope" style={{ color: "#667eea", fontSize: "1rem" }}></i>
                  </div>
                  <span style={{ color: "#4a5568", fontWeight: "600", fontSize: "1rem", wordBreak: "break-all" }}>{provider.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "60px", padding: "30px", background: "rgba(255,255,255,0.1)", borderRadius: "20px", backdropFilter: "blur(20px)" }}>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", margin: 0, fontWeight: 300, lineHeight: 1.6 }}>
            💡 Interest rates are subject to change and may vary based on loan amount, tenure, and creditworthiness. Contact providers directly for personalized quotes and current offers.
          </p>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </section>
  );
};

export default HomeLoanProviders;
