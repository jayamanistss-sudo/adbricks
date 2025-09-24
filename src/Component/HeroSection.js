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
    if (user) {
      const params = new URLSearchParams();
      if (activeTab) {
        params.append("is_resale", activeTab === "new" ? "0" : "1");
      }
      if (selectedDistrict) params.append("district", selectedDistrict);
      if (selectedCity) params.append("city", selectedCity);
      if (budgetRange) params.append("budget", budgetRange);
      window.location.href = `/properties?${params.toString()}`;
    } else {
      setShowLoginModal(true);
    }
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
          background: `linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(44, 62, 80, 0.9))`,
          color: "white",
          padding: breakpoint === "mobile" ? "100px 0 50px" : "180px 0 100px",
          textAlign: "center",
          marginTop: breakpoint === "mobile" ? "0px" : "80px",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <h1
            style={{
              fontSize: breakpoint === "mobile" ? "2.5rem" : "3.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Find Properties
          </h1>
          <p style={{ fontSize: "1.3rem", marginBottom: "2rem", opacity: 0.9 }}>
            Connecting Buyers, Sellers, and Builders with Trust & Transparency
          </p>
          <div
            style={{
              background: "white",
              borderRadius: "15px",
              padding: breakpoint === "mobile" ? "15px" : "30px",
              marginTop: "50px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              color: "#2c3e50",
            }}
          >
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: activeTab === "new" ? "0%" : "50%",
                  width: "50%",
                  height: "100%",
                  background: "#3498db",
                  transition: "all 0.3s ease",
                  zIndex: 0,
                }}
              />

              {["new", "resale"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: "15px",
                    background: "transparent", // make transparent, highlight comes from sliding div
                    color: activeTab === tab ? "white" : "#2c3e50",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "color 0.3s ease",
                    zIndex: 1, // keep text above sliding div
                    position: "relative",
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
              }}
            >
              <i className="fas fa-search"></i> Search Properties
            </button>
            {registeredUser && (
              <button
                onClick={handleViewContact}
                style={{
                  marginTop: "20px",
                  background: "#f39c12",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "25px",
                  fontWeight: "500",
                  color: "#2c3e50",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
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
