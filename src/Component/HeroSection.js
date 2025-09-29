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
          background: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80') center/cover`,
          color: "white",
          padding: breakpoint === "mobile" ? "100px 0 50px" : "180px 0 100px",
          textAlign: "center",
          marginTop: breakpoint === "mobile" ? "0px" : "80px",
          position: "relative"
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
            maxWidth: "1200px", 
            margin: "0 auto", 
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: breakpoint === "mobile" ? "2.5rem" : "3.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
              textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            Find Your Dream Property
          </h1>
          <p style={{ 
            fontSize: "1.3rem", 
            marginBottom: "2rem", 
            opacity: 0.95,
            textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
          }}>
            Connecting Buyers, Sellers, and Builders with Trust & Transparency
          </p>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              padding: breakpoint === "mobile" ? "15px" : "30px",
              marginTop: "50px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              color: "#2c3e50",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
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
                    padding: "15px",
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
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Select City</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "1rem",
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
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Select Locality</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "1rem",
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
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Budget Range</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "1rem",
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
                padding: "15px 30px",
                borderRadius: "25px",
                fontWeight: "500",
                color: "white",
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%",
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
                  marginTop: "20px",
                  background: "linear-gradient(135deg, #f39c12, #e67e22)",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "25px",
                  fontWeight: "500",
                  color: "white",
                  fontSize: "1rem",
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