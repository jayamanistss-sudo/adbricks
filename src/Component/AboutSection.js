import React, { useState, useEffect } from "react";

const AboutSection = ({ data }) => {
  const [aboutData, setAboutData] = useState('');

  useEffect(() => {
    if (data?.data?.[0].about_us) {
      setAboutData(data?.data?.[0].about_us);
    }
  }, [data]);

  const services = [
    { icon: "fas fa-bullhorn", title: "Lead Generation", desc: "Convert prospects into customers" },
    { icon: "fas fa-rocket", title: "Brand Promotion", desc: "Elevate your brand presence" },
    { icon: "fas fa-laptop", title: "Digital Marketing", desc: "Online growth strategies" },
    { icon: "fas fa-newspaper", title: "Print Media", desc: "Newspaper advertisements" },
    { icon: "fas fa-billboard", title: "Outdoor Ads", desc: "Billboard and hoarding campaigns" },
    { icon: "fas fa-users", title: "BTL Advertising", desc: "Direct customer engagement" }
  ];

  const achievements = [
    { number: "20+", label: "Years Experience" },
    { number: "500+", label: "Successful Campaigns" },
    { number: "100+", label: "Happy Clients" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <section id="about" style={{
      padding: "100px 0",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5
      }} />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 20px",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "80px"
        }}>
          <div style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #3498db, #2c3e50)",
            padding: "8px 24px",
            borderRadius: "25px",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            About Our Company
          </div>
          <h2 style={{
            fontSize: "3.5rem",
            background: "linear-gradient(135deg, #2c3e50, #3498db)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "20px",
            fontWeight: "800",
            lineHeight: "1.2"
          }}>
            ADBRICKS MEDIA
          </h2>
          <p style={{
            fontSize: "1.3rem",
            color: "#6c757d",
            fontWeight: "400",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Leading advertisement company driving business growth through innovative strategies
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "60px",
          alignItems: "start",
          marginBottom: "80px"
        }}
        className="main-grid">
          <div>
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.8)",
              marginBottom: "30px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "25px"
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #3498db, #2c3e50)",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <i className="fas fa-building" style={{ color: "white", fontSize: "1.2rem" }}></i>
                </div>
                <h3 style={{
                  color: "#2c3e50",
                  fontSize: "1.8rem",
                  margin: 0,
                  fontWeight: "700"
                }}>
                  Industry Leadership
                </h3>
              </div>
              
              {aboutData ? (
                <div style={{
                  lineHeight: "1.8",
                  color: "#6c757d",
                  fontSize: "1.1rem"
                }}
                dangerouslySetInnerHTML={{ __html: aboutData }}
                />
              ) : (
                <>
                  <p style={{
                    lineHeight: "1.8",
                    color: "#6c757d",
                    fontSize: "1.1rem",
                    marginBottom: "25px"
                  }}>
                    ADBRICKS MEDIA is a leading advertisement company based in Chennai, backed by stakeholders with over 20 years of rich industry experience. We are experts in driving business growth by enhancing your revenue and profit through cost-effective strategies.
                  </p>
                  <p style={{
                    lineHeight: "1.8",
                    color: "#6c757d",
                    fontSize: "1.1rem"
                  }}>
                    Trust ADBRICKS MEDIA to take your business to the next level with tailored solutions that deliver measurable results.
                  </p>
                </>
              )}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px"
            }}
            className="stats-grid">
              {achievements.map((achievement, index) => (
                <div key={index} style={{
                  background: "white",
                  borderRadius: "15px",
                  padding: "25px 15px",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  transition: "transform 0.3s ease"
                }}>
                  <div style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#3498db",
                    marginBottom: "8px"
                  }}>
                    {achievement.number}
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#6c757d",
                    fontWeight: "600"
                  }}>
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.8)",
            height: "fit-content"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "30px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #e74c3c, #c0392b)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <i className="fas fa-cogs" style={{ color: "white", fontSize: "1.2rem" }}></i>
              </div>
              <h4 style={{
                color: "#2c3e50",
                fontSize: "1.6rem",
                margin: 0,
                fontWeight: "700"
              }}>
                Our Services
              </h4>
            </div>

            <p style={{
              marginBottom: "25px",
              color: "#6c757d",
              lineHeight: "1.6",
              fontSize: "1rem"
            }}>
              Our comprehensive range of services designed to accelerate your business growth:
            </p>

            <div style={{
              display: "grid",
              gap: "15px"
            }}>
              {services.map((service, index) => (
                <div key={index} style={{
                  padding: "15px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                  border: "1px solid #e9ecef",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <div style={{
                      background: "linear-gradient(135deg, #3498db, #2c3e50)",
                      borderRadius: "8px",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <i className={service.icon} style={{
                        color: "white",
                        fontSize: "0.9rem"
                      }}></i>
                    </div>
                    <div>
                      <div style={{
                        fontWeight: "600",
                        color: "#2c3e50",
                        fontSize: "1rem",
                        marginBottom: "2px"
                      }}>
                        {service.title}
                      </div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#6c757d"
                      }}>
                        {service.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #2c3e50, #3498db)",
          borderRadius: "20px",
          padding: "50px 40px",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}
        className="cta-section">
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "50%"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{
              fontSize: "2.2rem",
              marginBottom: "15px",
              fontWeight: "700"
            }}
            className="header">
              Ready to Grow Your Business?
            </h3>
            <p style={{
              fontSize: "1.1rem",
              marginBottom: "30px",
              opacity: 0.9,
              maxWidth: "600px",
              margin: "0 auto 30px"
            }}>
              Partner with ADBRICKS MEDIA and experience the difference that 20+ years of expertise can make for your brand.
            </p>
            <button style={{
              background: "white",
              color: "#2c3e50",
              border: "none",
              padding: "15px 35px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
            }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
              }}>
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .main-grid { 
            grid-template-columns: 1fr !important; 
            gap: 40px !important;
          }
          .stats-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
          }
          .header { 
            font-size: 2rem !important; 
          }
          .cta-section { 
            padding: 30px 20px !important; 
          }
        }
        @media (max-width: 480px) {
          .stats-grid { 
            grid-template-columns: 1fr !important; 
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;