import React, { useState } from "react";

const Footer = ({ data }) => {
  const siteData = data?.data?.[0] || {};
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const contactInfo = [
    { icon: "map-marker-alt", text: siteData.contact_address || "Chennai, Tamil Nadu" },
    { icon: "phone", text: siteData.contact_phone || "+91 98765 43210" },
    { icon: "envelope", text: siteData.contact_email || "info@Adbricks.com" }
  ];

  const socialLinks = [
    { icon: "facebook-f", href: "#" },
    { icon: "twitter", href: "#" },
    { icon: "instagram", href: "#" },
    { icon: "linkedin-in", href: "#" }
  ];

  return (
    <footer style={{ background: "#2c3e50", color: "white", padding: "50px 0 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
          <div>
            <h5 style={{ color: "#f39c12", marginBottom: "20px" }}>
              <img src={siteData.logo_url} alt={siteData.site_name} style={{ width: "150px" }} />
            </h5>
            <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>{siteData.about_us}</p>
            <div style={{ marginTop: "20px" }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  style={{ display: "inline-block", marginRight: "15px", color: "white", fontSize: "1.2rem", textDecoration: "none" }}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ color: "#f39c12", marginBottom: "20px" }}>Contact Info</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {contactInfo.map((info, index) => (
                <li key={index} style={{ margin: "10px 0" }}>
                  <i className={`fas fa-${info.icon}`}></i> {info.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #34495e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0 }}>&copy; 2025 {siteData.site_name || "Adbricks.com"}. All rights reserved.</p>
          <div>
            <span onClick={() => setShowPrivacy(true)} style={{ color: "white", cursor: "pointer", marginLeft: "20px" }}>Privacy Policy *</span>
            <span onClick={() => setShowTerms(true)} style={{ color: "white", cursor: "pointer", marginLeft: "20px" }}>Terms of Service *</span>
          </div>
        </div>
      </div>

      {showPrivacy && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "12px", maxWidth: "700px", width: "90%", maxHeight: "90%", overflowY: "auto" }}>
            <h2 style={{color:"black"}}>Privacy Policy</h2>
            <p style={{color:"black"}}>{siteData.privacy_policy}</p>
            <button onClick={() => setShowPrivacy(false)} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {showTerms && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "12px", maxWidth: "700px", width: "90%", maxHeight: "90%", overflowY: "auto" }}>
            <h2 style={{color:"black"}}>Terms of Service</h2>
            <p style={{color:"black"}}>{siteData.terms_of_service}</p>
            <button onClick={() => setShowTerms(false)} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </footer>
  );
};

export default Footer;
