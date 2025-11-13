import React, { useEffect, useState } from "react";
import api from "./Apiurl";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useResponsive } from "../hooks";

const HeroSection = ({ registeredUser }) => {
  const breakpoint = useResponsive();
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await api("district_type_list", "GET");
      if (res.status === 200) {
        const activeDistricts = res.data.filter((d) => d.active === "1");
        setDistricts(activeDistricts);
        if (activeDistricts.length > 0) {
          setSelectedDistrict(activeDistricts[0].district_id);
        }
      }
    };
    fetchDistricts();
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

  useEffect(() => {
    if (selectedDistrict) {
      const fetchCities = async () => {
        const res = await api("city_type_list", "GET");
        if (res.status === 200) {
          const filteredCities = res.data.filter(
            (city) => city.active === "1" && city.district_id === selectedDistrict
          );
          setCities(filteredCities);
          setSelectedCity("");
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedDistrict]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab) params.append("is_resale", activeTab === "buy" ? "0" : "1");
    if (selectedDistrict) params.append("district", selectedDistrict);
    if (selectedCity) params.append("city", selectedCity);
    if (budgetRange) params.append("budget", budgetRange);
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        setShowRegisterModal={setShowRegisterModal}
      />
      <RegisterModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        setShowLoginModal={setShowLoginModal}
      />

      <section
        id="home"
        style={{
          width: "100vw", // full width, removes side white gaps
          minHeight: "90vh",
          backgroundImage: "url('./Home.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Dark overlay for text clarity */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "white",
            padding: "0 5px",
            width: "100%",
            maxWidth: "950px",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: "800",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            BRICKS TO BUILD YOUR PROPERTY
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 20px)",
              fontWeight: "400",
              marginBottom: "35px",
            }}
          >
            Connecting Builders, Sellers, Buyers With Trust And Transparency
          </p>

          <h3
            style={{
              fontSize: "clamp(14px, 1.8vw, 18px)",
              fontWeight: "600",
              marginBottom: "18px",
            }}
          >
            Search Properties For Buy And Sale
          </h3>

          {/* Top Row */}
          <div
            className="filter-row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "15px",
            }}
          >
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              style={selectStyle}
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={selectStyle}
            >
              <option value="">Search By City</option>
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.district_name}
                </option>
              ))}
            </select>

            <button style={searchBtn} onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* Bottom Row */}
          <div
            className="filter-row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={selectStyle}
              disabled={!selectedDistrict}
            >
              <option value="">{selectedDistrict ? "Search By Locality" : "Select City First"}</option>
              {cities.map((c) => (
                <option key={c.city_id} value={c.city_id}>
                  {c.city_name}
                </option>
              ))}
            </select>

            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              style={selectStyle}
            >
              <option value="">Property Type</option>
              <option value="20L-50L">₹20L - ₹50L</option>
              <option value="50L-1Cr">₹50L - ₹1Cr</option>
              <option value="1Cr-2Cr">₹1Cr - ₹2Cr</option>
              <option value="2Cr+">₹2Cr+</option>
            </select>
          </div>
        </div>

        <style>
          {`
            /* Mobile Responsive */
            @media (max-width: 768px) {
              #home {
                background-position: center;
                background-size: cover;
                padding: 50px 0;
              }
              #home h1 {
                font-size: 26px !important;
                line-height: 1.3;
              }
              #home p {
                font-size: 14px !important;
              }
              .filter-row {
                flex-direction: column !important;
                align-items: stretch !important;
                width: 100% !important;
                gap: 12px !important;
              }
              #home select, #home button {
                width: 100% !important;
              }
            }

            /* Remove horizontal scrollbars */
            body, html {
              margin: 0;
              padding: 0;
              overflow-x: hidden;
            }
          `}
        </style>
      </section>
    </>
  );
};

/* Shared styles */
const selectStyle = {
  padding: "12px 15px",
  borderRadius: "6px",
  border: "none",
  fontSize: "16px",
  fontWeight: "500",
  backgroundColor: "white",
  minWidth: "200px",
  color: "#333",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  outline: "none",
  cursor: "pointer",
};

const searchBtn = {
  backgroundColor: "#f97316",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "12px 25px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
};

export default HeroSection;
