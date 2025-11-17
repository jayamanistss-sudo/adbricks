import React from 'react';

const PropertyTypeSection = () => {
  const propertyTypes = [
    {
      title: "APARTMENTS",
      projects: "1000 + Projects",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      bgColor: "#FFE893"
    },
    {
      title: "VILLAS",
      projects: "500 + Projects",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      bgColor: "#FFE893"
    },
    {
      title: "PLOTS",
      projects: "3000 + Projects",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      bgColor: "#FFE893"
    },
    {
      title: "COMMERCIAL",
      projects: "500 + Projects",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      bgColor: "#FFE893"
    }
  ];

  return (
    <section style={{
      padding: "50px 20px",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      position: "relative"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <h2 style={{
            fontSize: "2.2rem",
            color: "#0066CC",
            marginBottom: "8px",
            fontWeight: "700"
          }}>
            Explore By Property Type
          </h2>
          <p style={{
            fontSize: "1rem",
            color: "#666",
            fontWeight: "400"
          }}>
            Largest Consolidation Of 'exclusive' Plots In Your City
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "30px"
        }}
        className="property-grid">
          {propertyTypes.map((property, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "5px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{
                position: "relative",
                width: "100%",
                height: "320px",
                overflow: "hidden"
              }}>
                <img
                  src={property.image}
                  alt={property.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                />
                
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.4)",
                  borderRadius: "5px"
                }} />

                <div style={{
                  position: "absolute",
                  bottom: "25px",
                  // left: "25px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  <div style={{
                    width: "193px",
                    // height: "35px",
                    background: property.bgColor,
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    border: "3px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                  }}>
                    {property.title}
                  </div>

                  <div style={{
                    color: "white",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                    paddingLeft: "5px"
                  }}>
                    {property.projects}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 968px) {
          .property-grid {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
        }
        @media (max-width: 768px) {
          h2 {
            font-size: 1.8rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PropertyTypeSection;