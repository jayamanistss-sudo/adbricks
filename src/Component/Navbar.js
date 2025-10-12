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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
    window.location.hash = href;
  };

  const links = [
    { href: "#home", label: "Home", icon: "fas fa-home" },
    { href: "/properties", label: "Find Properties", icon: "fas fa-building" },
    { href: "#brand-store", label: "Brand Store", icon: "fas fa-store" },
    { href: "/homeloan", label: "Home Loan", icon: "fas fa-university" },
    { href: "/interiors", label: "Interiors", icon: "fas fa-couch" },
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
                ...(isMobile
                  ? isActive
                    ? { background: "#3498db", color: "white" }
                    : {}
                  : isActive
                  ? { borderBottom: "2px solid #f39c12" }
                  : {}),
              }}
            >
              <i className={icon}></i> {label}
            </a>
          </li>
        );
      })}

      {!user ? (
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowLoginModal(true);
              setMenuOpen(false);
            }}
            style={navLinkStyle}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </a>
        </li>
      ) : (
        <>
          <li>
            <a href="/profile" style={navLinkStyle}>
              <i className="fas fa-user"></i> Profile
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                setShowPostPropertyModal(true);
                setMenuOpen(false);
              }}
              style={{
                ...navLinkStyle,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <i className="fas fa-plus-circle"></i> Post Property
            </button>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav
      style={{
        background: isScrolled ? "rgba(44,62,80,0.95)" : "linear-gradient(135deg, #2c3e50, #3498db)",
        padding: "1rem 0",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
      }}
    >
      <div style={{ margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <a href="#home" style={{ textDecoration: "none" }}>
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: breakpoint === "mobile" ? "1.2rem" : "1.6rem",
                whiteSpace: "nowrap",
              }}
            >
              {navData.site_name || "Site Name"}
            </span>
          </a>

          <ul
            className="desktop-menu"
            style={{
              display: "flex",
              listStyle: "none",
              gap: breakpoint === "smallLaptop" ? "10px" : "20px",
              alignItems: "center",
              margin: 0,
              padding: 0,
              width: breakpoint === "smallLaptop" ? "100%" : "70%",
            }}
          >
            <NavLinks />
          </ul>

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
      </div>

      {menuOpen && (
        <div style={sidebarOverlay} onClick={() => setMenuOpen(false)}>
          <div style={sidebar} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMenuOpen(false)} style={closeBtn}>
              ✕
            </button>
            <ul style={sidebarList}>
              <NavLinks isMobile />
            </ul>
          </div>
        </div>
      )}

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </nav>
  );
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  padding: "8px 16px",
  borderRadius: "20px",
  transition: "all 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  lineHeight: "1.5",
  verticalAlign: "middle",
};

const hamburgerLine = {
  width: "25px",
  height: "3px",
  background: "white",
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
  height: "500px",
};

const sidebar = {
  width: "260px",
  background: "rgba(44,62,80,0.98)",
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
  fontSize: "20px",
  background: "transparent",
  border: "none",
  color: "white",
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
`;
document.head.appendChild(styleSheet);

export default Navbar;