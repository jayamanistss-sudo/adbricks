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

  const handlePostAssetClick = () => {
    setMenuOpen(false);
    if (user) {
      setShowPostPropertyModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const links = [
    // { href: "#home", label: "Home", icon: "fas fa-home" },
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

      <li>
        <button
          onClick={handlePostAssetClick}
          className="glow-button"
          style={{
            ...postAssetButtonStyle,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <i className="fas fa-plus-circle"></i> Post your property ( Free)
        </button>
      </li>
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
           {/* Logo */}
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {navData.logo_url ? (
              <img
                src={navData.logo_url}
                alt={navData.site_name}
                style={{ height: breakpoint === "mobile" ? "50px" : "60px", borderRadius: "6px" }}
              />
            ) : (
              <i className="fas fa-home" style={{ color: "white", fontSize: "1.8rem" }} />
            )}
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

const postAssetButtonStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  padding: "10px 20px",
  borderRadius: "25px",
  transition: "all 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  lineHeight: "1.5",
  verticalAlign: "middle",
  background: "linear-gradient(135deg, #f39c12, #e74c3c)",
  boxShadow: "0 0 20px rgba(243, 156, 18, 0.6)",
  animation: "glow 2s ease-in-out infinite",
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
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(243, 156, 18, 0.6), 0 0 30px rgba(243, 156, 18, 0.4);
    }
    50% {
      box-shadow: 0 0 30px rgba(243, 156, 18, 0.8), 0 0 40px rgba(243, 156, 18, 0.6);
    }
  }
  .glow-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 35px rgba(243, 156, 18, 0.9), 0 0 50px rgba(243, 156, 18, 0.7) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Navbar