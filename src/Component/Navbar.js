import React, { useEffect, useState } from "react";
import { useResponsive } from "../hooks";

const Navbar = ({ setShowLoginModal, setShowPostPropertyModal, generalStatsdata }) => {
  const navData = generalStatsdata?.data?.[0] || {};
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(window.location.hash || "#home");
  const breakpoint = useResponsive();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleHashChange = () => setActiveHash(window.location.hash || "#home");
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    window.location.hash = href;
  };

  const handlePostAssetClick = () => {
    setMenuOpen(false);
    if (user) {
      setShowPostPropertyModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const links = [
    { href: "/properties", label: "Find Properties", icon: "fas fa-building" },
    { href: "#brand-store", label: "Brand Store", icon: "fas fa-store" },
    { href: "/interiors", label: "Interior", icon: "fas fa-couch" },
    { href: "/homeloan", label: "Home Loan", icon: "fas fa-university" },
  ];

  const NavLinks = ({ isMobile = false }) => (
    <>
      {links.map(({ href, label, icon }) => {
        const isActive = activeHash === href || window.location.pathname === href;
        return (
          <li key={href}>
            <a
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              style={{
                ...navLinkStyle,
                fontSize: isMobile ? "1rem" : "1.05rem",
                fontWeight: "600",
                ...(isMobile
                  ? isActive
                    ? { background: "#007bff", color: "#fff" }
                    : {}
                  : isActive
                  ? { color: "#007bff", borderBottom: "2px solid #007bff" }
                  : {}),
              }}
            >
              <i className={icon}></i> {label}
            </a>
          </li>
        );
      })}
    </>
  );

  return (
    <nav
      style={{
        background: "#fff",
        padding: "0.8rem 1.5rem",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <a
          href="#home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          {navData.logo_url ? (
            <img
              src={navData.logo_url}
              alt={navData.site_name}
              style={{ height: "45px", borderRadius: "6px" }}
            />
          ) : (
            <>
              <img
                src="/adbricks-logo.png"
                alt="Adbricks Logo"
                style={{ height: "40px", borderRadius: "6px" }}
              />
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "1.4rem",
                  color: "#004aad",
                  letterSpacing: "0.5px",
                }}
              >
                Adbricks<span style={{ color: "#ff6f00" }}>.In</span>
              </span>
            </>
          )}
        </a>

        {/* Desktop Links */}
        <ul
          className="desktop-menu"
          style={{
            display: "flex",
            listStyle: "none",
            gap: "1.8rem",
            alignItems: "center",
            margin: 0,
            padding: 0,
          }}
        >
          <NavLinks />
          <li>
            <button onClick={handlePostAssetClick} style={uploadBtnStyle}>
              <i className="fas fa-upload"></i> Upload Property Free
            </button>
          </li>
        </ul>

        {/* Hamburger Menu */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <span style={hamburgerLine}></span>
          <span style={hamburgerLine}></span>
          <span style={hamburgerLine}></span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div style={sidebarOverlay} onClick={() => setMenuOpen(false)}>
          <div style={sidebar} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMenuOpen(false)} style={closeBtn}>
              ✕
            </button>
            <ul style={sidebarList}>
              <NavLinks isMobile />
              <li>
                <button onClick={handlePostAssetClick} style={mobileUploadBtn}>
                  <i className="fas fa-upload"></i> Upload Property Free
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
    </nav>
  );
};

// ---------- STYLES ----------

const navLinkStyle = {
  color: "#004aad",
  textDecoration: "none",
  fontWeight: "600",
  padding: "8px 12px",
  transition: "all 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

const uploadBtnStyle = {
  background: "#ff6f00",
  color: "#fff",
  border: "none",
  borderRadius: "25px",
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "1rem",
  transition: "all 0.3s ease",
};

const mobileUploadBtn = {
  ...uploadBtnStyle,
  width: "100%",
  justifyContent: "center",
  borderRadius: "8px",
};

const hamburgerLine = {
  width: "25px",
  height: "3px",
  background: "#004aad",
  borderRadius: "3px",
};

const sidebarOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 1200,
  display: "flex",
  justifyContent: "flex-end",
};

const sidebar = {
  width: "250px",
  background: "#fff",
  height: "100%",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  animation: "slideIn 0.3s ease",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  fontSize: "22px",
  background: "transparent",
  border: "none",
  color: "#004aad",
  cursor: "pointer",
};

const sidebarList = {
  listStyle: "none",
  padding: 0,
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @media (max-width: 768px) {
    .desktop-menu { display: none !important; }
    .hamburger { display: flex !important; }
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  button:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;
