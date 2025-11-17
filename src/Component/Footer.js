import React, { useState } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Phone, Mail } from "lucide-react";

const Footer = ({ data }) => {
  const siteData = data?.data?.[0] || {};
  const [popup, setPopup] = useState(null);

  const socialLinks = [
    { icon: <FaInstagram />, href: "https://www.instagram.com", color: "#E4405F" },
    { icon: <FaFacebookF />, href: "https://www.facebook.com/profile.php?id=61561564230410", color: "#1877F2" },
    { icon: <FaYoutube />, href: "https://www.youtube.com/@Adbricks.in-1", color: "#FF0000" },
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/adbricks-in-292a59381/", color: "#0A66C2" },
    { icon: <FaWhatsapp />, href: `https://wa.me/918270333377`, color: "#25D366" },
  ];

  const quickLinks = [
    { label: "Find Properties", href: "/properties" },
    { label: "Brand Store", href: "/brand-store" },
    { label: "Interior", href: "/interior" },
    { label: "Home Loan", href: "/home-loan" },
  ];

  return (
    <footer style={{ background: "#f8f9fa", padding: "50px 0 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "60px",
            marginBottom: "40px",
          }}
        >
          {/* Company Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "28px", color: "#333" }}>
                <img src="/Group 37.png" style={{ width: '50%' }} />
              </h2>
            </div>
            <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "20px", fontSize: "14px" }}>
              Adbricks.In Is Your Trusted Partner Indiscovering Premium Homes, Plots, And Investments Across Chennai.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: social.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "16px",
                    transition: "transform 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                color: "#333",
                marginBottom: "4px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Quick Links
            </h3>
            <div
              style={{
                width: "110px",
                borderBottom: "3px solid #FF6E00",
                opacity: 1,
                marginBottom: "20px",
              }}
            ></div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {quickLinks.map((link, index) => (
                <li key={index} style={{ marginBottom: "20px" }}>
                  <a
                    href={link.href}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "1%",
                      textTransform: "capitalize",
                      textAlign: "center",
                      color: "#000000",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B35")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
                  >
                    <span style={{ marginRight: "8px", color: "#FF6B35" }}>●</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

          </div>

          {/* Get In Touch */}
          <div>
            <h3
              style={{
                color: "#333",
                marginBottom: "4px",
                fontSize: "18px",
                fontWeight: "600"
              }}
            >
              Get In Touch
            </h3>

            <div
              style={{
                width: "110px",
                borderBottom: "3px solid #FF6E00",
                opacity: 1
              }}
            ></div>

            <p style={{ color: "#000000", lineHeight: "1.6", marginBottom: "20px", fontSize: "14px" }}>
              Get In Touch With Us, We Would Be More Than Happy To Help
            </p>
            <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF3E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone size={16} color="#FF6B35" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#000000" }}>Phone:</p>
                <a
                  href="tel:+918270333377"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "1%",
                    textTransform: "capitalize",
                    color: "#000000",
                    textDecoration: "none"
                  }}
                >
                  +91 8270333377
                </a>

              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF3E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={16} color="#FF6B35" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#000000" }}>Email:</p>
                <a
                  href="mailto:Support@Adbricks.In"
                  style={{ color: "#000000", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                >
                  Support@Adbricks.In
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            paddingTop: "20px",
            borderTop: "1px solid #e0e0e0",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            © 2025 Adbricks.In. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/918270333377"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <FaWhatsapp size={30} color="white" />
      </a>

      {/* Popup */}
      {popup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2 style={{ color: "#333", marginBottom: "20px" }}>
              {popup === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </h2>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              {popup === "privacy"
                ? siteData.privacy_policy || "Privacy policy content goes here."
                : siteData.terms_of_service || "Terms of service content goes here."}
            </p>
            <button onClick={() => setPopup(null)} style={closeBtnStyle}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .whatsapp-float {
            position: fixed;
            width: 60px;
            height: 60px;
            bottom: 30px;
            right: 30px;
            background-color: #25d366;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
          }
          .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
          }
          @media (max-width: 768px) {
            footer > div > div:first-child {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popupStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  maxWidth: "600px",
  width: "90%",
  maxHeight: "80%",
  overflowY: "auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
};

const closeBtnStyle = {
  marginTop: "20px",
  padding: "12px 30px",
  cursor: "pointer",
  backgroundColor: "#FF6B35",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  transition: "background-color 0.2s",
};