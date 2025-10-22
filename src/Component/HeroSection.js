import React, { useEffect, useState } from "react";
import api from "./Apiurl";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useResponsive } from "../hooks";

const HeroSection = ({ registeredUser }) => {
  const breakpoint = useResponsive();
  const [activeTab, setActiveTab] = useState("new");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await api("district_type_list", "GET");
      if (res.status === 200) setDistricts(res.data.filter((d) => d.active === "1"));
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
    if (activeTab) {
      params.append("is_resale", activeTab === "new" ? "0" : "1");
    }
    if (selectedDistrict) params.append("district", selectedDistrict);
    if (selectedCity) params.append("city", selectedCity);
    if (budgetRange) params.append("budget", budgetRange);
    window.location.href = `/properties?${params.toString()}`;
  };

  const handleViewContact = () => {
    if (!registeredUser) {
      alert("Please login to view contact details");
      return;
    }
    console.log("Lead saved for contact view");
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
          backgroundImage: "url('./Home.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
          padding: isMobile ? "60px 20px 30px" : "100px 20px 80px",
          textAlign: "center",
          position: "relative",
          minHeight: isMobile ? "auto" : "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-start" : "center",
          alignItems: "center",
        }}
      >
        {/* Alternative background overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />

        <div
          className="container"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              padding: breakpoint === "mobile" ? "12px" : "20px",
              marginTop: "326px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              color: "#2c3e50",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              width: "630px",
            }}
          >
            <div
              style={{
                display: "flex",
                marginBottom: "15px",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
                background: "rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: activeTab === "new" ? "0%" : "50%",
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(135deg, #3498db, #2980b9)",
                  transition: "all 0.3s ease",
                  zIndex: 0,
                  borderRadius: "8px",
                }}
              />

              {["new", "resale"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "transparent",
                    color: activeTab === tab ? "white" : "#2c3e50",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "color 0.3s ease",
                    zIndex: 1,
                    position: "relative",
                    textShadow: activeTab === tab ? "1px 1px 2px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {tab === "new" ? "New Properties" : "Resale"}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "15px",
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", fontSize: "0.9rem" }}>Select City</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    padding: "10px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    width: "100%",
                    background: "white",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <option value="">Select City</option>
                  {districts.map((d) => (
                    <option key={d.district_id} value={d.district_id}>
                      {d.district_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", fontSize: "0.9rem" }}>Select Locality</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    padding: "10px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    width: "100%",
                    background: "white",
                    transition: "border-color 0.3s ease",
                  }}
                  disabled={!selectedDistrict}
                >
                  <option value="">{selectedDistrict ? "Select Locality" : "Select City First"}</option>
                  {cities.map((c) => (
                    <option key={c.city_id} value={c.city_id}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", fontSize: "0.9rem" }}>Budget Range</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  style={{
                    padding: "10px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    width: "100%",
                    background: "white",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <option value="">Budget Range</option>
                  <option value="20L-50L">₹20L - ₹50L</option>
                  <option value="50L-1Cr">₹50L - ₹1Cr</option>
                  <option value="1Cr-2Cr">₹1Cr - ₹2Cr</option>
                  <option value="2Cr+">₹2Cr+</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              style={{
                background: "linear-gradient(135deg, #3498db, #2980b9)",
                border: "none",
                padding: "12px 25px",
                borderRadius: "25px",
                fontWeight: "500",
                color: "white",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "50%",
                boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
              }}
            >
              <i className="fas fa-search"></i> Search Properties
            </button>
            {registeredUser && (
              <button
                onClick={handleViewContact}
                style={{
                  marginTop: "15px",
                  background: "linear-gradient(135deg, #f39c12, #e67e22)",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  fontWeight: "500",
                  color: "white",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(243, 156, 18, 0.3)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(243, 156, 18, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(243, 156, 18, 0.3)";
                }}
              >
                View Contact
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;