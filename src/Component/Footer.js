import React, { useState } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Footer = ({ data }) => {
  const siteData = data?.data?.[0] || {};
  const [popup, setPopup] = useState(null);

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: siteData.contact_address || "Chennai, Tamil Nadu" },
    { icon: <FaPhone />, text: siteData.contact_phone || "+91 98765 43210" },
    { icon: <FaEnvelope />, text: siteData.contact_email || "info@Adbricks.com" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/profile.php?id=61561564230410" },
    { icon: <FaYoutube />, href: "https://www.youtube.com/@AdbricksMedia-1" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/adbricks_media/" },
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/adbricks-media-292a59381/" },
    {
      icon: <FaWhatsapp />,
      href: `https://wa.me/${siteData.contact_phone?.replace(/\D/g, "") || "919876543210"}`,
    },
  ];

  const links = [
    { href: "/#home", label: "Home", icon: "fas fa-home" },
    { href: "/#about", label: "About", icon: "fas fa-info-circle" },
    { href: "/properties", label: "Properties", icon: "fas fa-building" },
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
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginRight: "15px",
                    color: "white",
                    fontSize: "1.5rem",
                    textDecoration: "none",
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ color: "#f39c12", marginBottom: "20px" }}>Contact Info</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {contactInfo.map((info, index) => (
                <li key={index} style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  {info.icon} {info.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 style={{ color: "#f39c12", marginBottom: "20px" }}>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} style={navLinkStyle}>
                    <i className={`${link.icon}`}></i> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #34495e",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0 }}>&copy; 2025 {siteData.site_name || "Adbricks.com"}. All rights reserved.</p>
          <div>
            <span onClick={() => setPopup("privacy")} style={footerLinkStyle}>
              Privacy Policy *
            </span>
            <span onClick={() => setPopup("terms")} style={footerLinkStyle}>
              Terms of Service *
            </span>
          </div>
        </div>
      </div>

      {popup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2 style={{ color: "black" }}>
              {popup === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </h2>
            <p style={{ color: "black" }}>
              {popup === "privacy" ? siteData.privacy_policy : siteData.terms_of_service}
            </p>
            <button onClick={() => setPopup(null)} style={closeBtnStyle}>
              Close
            </button>
          </div>
        </div>
      )}

      <a
        href={`https://wa.me/${siteData.contact_phone?.replace(/\D/g, "") || "919876543210"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <FaWhatsapp size={40} color="white" />
      </a>

      <style>
        {`
          .whatsapp-float {
            position: fixed;
            width: 60px;
            height: 60px;
            bottom: 20px;
            right: 20px;
            background-color: #25d366;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: transform 0.2s;
          }
          .whatsapp-float:hover {
            transform: scale(1.1);
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  padding: "8px 8px",
  borderRadius: "20px",
  transition: "all 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  lineHeight: "1.5",
  verticalAlign: "middle",
};

const footerLinkStyle = {
  color: "white",
  cursor: "pointer",
  marginLeft: "20px",
};

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
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "700px",
  width: "90%",
  maxHeight: "90%",
  overflowY: "auto",
};

const closeBtnStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  cursor: "pointer",
};
