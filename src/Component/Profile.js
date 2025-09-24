import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostPropertyModal from "./PostPropertyModal";

const Modal = ({ show, onClose, title, size = 'medium', children }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: size === 'large' ? '1000px' : '500px',
        maxHeight: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showPostPropertyModal, setShowPostPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetailModal, setShowPropertyDetailModal] = useState(false);

  const api = "https://demo.stss.in/admin/Config/router.php?router=";

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        fetch(`${api}property_list`)
          .then(res => res.json())
          .then(data => {
            const filtered = data.data.filter(p => p.contact_number === parsedUser.phone);
            setProperties(filtered);
            localStorage.setItem("userProperties", JSON.stringify(filtered));
          })
          .catch(err => console.error("Error fetching property list:", err));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  console.log(JSON.stringify(properties));

  const handleAddProperty = () => {
    setShowPostPropertyModal(true);
  };

  const handlePropertyAdded = () => {
    const storedUser = localStorage.getItem("userDetails");
    const storedProperties = localStorage.getItem("userProperties");
    
    if (storedUser && storedProperties) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedProperties = JSON.parse(storedProperties);
        const filtered = parsedProperties.filter(p => p.contact_number === parsedUser.phone);
        setProperties(filtered);
      } catch {
        setProperties([]);
      }
    }
    setShowPostPropertyModal(false);
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetailModal(true);
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)} Lakhs`;
  };

  const getPriorityBadgeStyle = (priority) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    };

    switch (priority?.toLowerCase()) {
      case 'premium':
        return { ...baseStyle, background: '#8B5CF6', color: 'white' };
      case 'featured':
        return { ...baseStyle, background: '#F59E0B', color: 'white' };
      default:
        return { ...baseStyle, background: '#6B7280', color: 'white' };
    }
  };

  const getTransactionBadgeStyle = (type) => {
    return {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      background: type === 'Sale' ? '#10B981' : '#3B82F6',
      color: 'white'
    };
  };

  return (
    <>
      <Modal
        show={showPostPropertyModal}
        onClose={() => setShowPostPropertyModal(false)}
        title="Post Your Property - FREE"
        size="large"
      >
        <PostPropertyModal
          onClose={() => setShowPostPropertyModal(false)}
          onSave={handlePropertyAdded}
        />
      </Modal>

      <Modal
        show={showPropertyDetailModal}
        onClose={() => setShowPropertyDetailModal(false)}
        title="Property Details"
        size="large"
      >
        {selectedProperty && (
          <div style={propertyDetailModalStyle}>
            <div style={propertyDetailImageSection}>
              <img
                src={selectedProperty.image_url}
                alt="Property"
                style={propertyDetailMainImage}
              />
              {selectedProperty.additional_images && (
                <div style={additionalImagesStyle}>
                  {JSON.parse(selectedProperty.additional_images).slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      style={additionalImageStyle}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div style={propertyDetailInfoSection}>
              <div style={propertyDetailHeader}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>
                  {selectedProperty.bhk_configuration} {selectedProperty.property_type_name}
                </h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <span style={getPriorityBadgeStyle(selectedProperty.property_priority)}>
                    {selectedProperty.property_priority}
                  </span>
                  <span style={getTransactionBadgeStyle(selectedProperty.transaction_type)}>
                    {selectedProperty.transaction_type}
                  </span>
                </div>
              </div>

              <div style={propertyDetailPrice}>
                <h2 style={{ margin: 0, color: '#059669' }}>
                  {formatPrice(selectedProperty.expected_price_lakhs)}
                </h2>
                <p style={{ margin: 0, color: '#6B7280' }}>
                  ₹{selectedProperty.price_per_sqft}/sq ft
                </p>
              </div>

              <div style={propertyDetailLocation}>
                <i className="fas fa-map-marker-alt"></i>
                <span>{selectedProperty.property_address}</span>
              </div>
              
              <div style={propertyDetailGrid}>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Area</span>
                  <span style={propertyDetailValue}>{selectedProperty.builtup_area_sqft} sq ft</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Configuration</span>
                  <span style={propertyDetailValue}>{selectedProperty.bhk_configuration}</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Property Type</span>
                  <span style={propertyDetailValue}>{selectedProperty.property_type_name}</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Transaction</span>
                  <span style={propertyDetailValue}>{selectedProperty.transaction_type}</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>City</span>
                  <span style={propertyDetailValue}>{selectedProperty.city_name}</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>District</span>
                  <span style={propertyDetailValue}>{selectedProperty.district_name}</span>
                </div>
                {selectedProperty.brand_store_name && (
                  <>
                    <div style={propertyDetailItem}>
                      <span style={propertyDetailLabel}>Builder</span>
                      <span style={propertyDetailValue}>{selectedProperty.brand_store_name}</span>
                    </div>
                  </>
                )}
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Owner</span>
                  <span style={propertyDetailValue}>{selectedProperty.owner_name}</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Contact</span>
                  <span style={propertyDetailValue}>{selectedProperty.contact_number}</span>
                </div>
                <div style={propertyDetailItem}>
                  <span style={propertyDetailLabel}>Interested</span>
                  <span style={propertyDetailValue}>
                    <i className="fas fa-heart" style={{ color: '#EF4444', marginRight: '5px' }}></i>
                    {selectedProperty.interested_count} people
                  </span>
                </div>
              </div>

              <div style={propertyDetailDescription}>
                <h4 style={{ margin: '0 0 10px 0' }}>Description</h4>
                <p style={{ margin: 0, lineHeight: '1.6', color: '#374151' }}>
                  {selectedProperty.property_description}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div style={pageWrapperStyle}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div style={profileCardStyle}>
          <div style={profileHeaderStyle}>
            {user?.profile_image ? (
              user.profile_image.endsWith(".mp4") ? (
                <video
                  src={user.profile_image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={profileImageStyle}
                />
              ) : (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  style={profileImageStyle}
                />
              )
            ) : (
              <video
                src="/Male Profile.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={profileImageStyle}
              />
            )}
            <div>
              <h2 style={{ margin: 0 }}>{user?.name || "User Name"}</h2>
              <p style={{ margin: 0, color: "#555" }}>{user?.email || "user@example.com"}</p>
            </div>
          </div>

          {properties.length !== 1 && (
            <button onClick={handleAddProperty} style={addPropertyBtnStyle}>
              <i className="fas fa-plus"></i> Add Property
            </button>
          )}

          <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Your Properties</h3>
          
          {properties.length === 0 ? (
            <p style={{ color: "#777" }}>You haven't added any properties yet.</p>
          ) : (
            <div style={propertyListStyle}>
              {properties.map((prop, idx) => (
                <div key={prop.property_id || idx} style={propertyCardStyle}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={prop.image_url || "/placeholder.png"}
                      alt={prop.property_description}
                      style={propertyImageStyle}
                    />
                    <div style={badgeContainerStyle}>
                      <span style={getPriorityBadgeStyle(prop.property_priority)}>
                        {prop.property_priority}
                      </span>
                      <span style={getTransactionBadgeStyle(prop.transaction_type)}>
                        {prop.transaction_type}
                      </span>
                    </div>
                    {prop.interested_count > 0 && (
                      <div style={interestBadgeStyle}>
                        <i className="fas fa-heart"></i> {prop.interested_count}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "15px" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {prop.bhk_configuration} {prop.property_type_name}
                      </h4>
                      <span style={priceStyle}>
                        {formatPrice(prop.expected_price_lakhs)}
                      </span>
                    </div>

                    <div style={locationStyle}>
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{prop.city_name}, {prop.district_name}</span>
                    </div>

                    <div style={detailsGridStyle}>
                      <div style={detailItemStyle}>
                        <span style={detailLabelStyle}>Area</span>
                        <span style={detailValueStyle}>{prop.builtup_area_sqft} sq ft</span>
                      </div>
                      <div style={detailItemStyle}>
                        <span style={detailLabelStyle}>Price/sq ft</span>
                        <span style={detailValueStyle}>₹{prop.price_per_sqft}</span>
                      </div>
                      {prop.brand_store_name && (
                        <div style={{ ...detailItemStyle, gridColumn: '1 / -1' }}>
                          <span style={detailLabelStyle}>Builder</span>
                          <span style={detailValueStyle}>{prop.brand_store_name}</span>
                        </div>
                      )}
                    </div>

                    {prop.property_description && (
                      <p style={descriptionStyle}>
                        {prop.property_description.length > 100
                          ? `${prop.property_description.substring(0, 100)}...`
                          : prop.property_description
                        }
                      </p>
                    )}

                    <div style={actionButtonsStyle}>
                      <button 
                        style={viewButtonStyle}
                        onClick={() => handleViewProperty(prop)}
                      >
                        <i className="fas fa-eye"></i> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </div>
    </>
  );
};

// Styles
const pageWrapperStyle = {
  maxWidth: "1200px",
  margin: "120px auto 50px auto",
  padding: "0 20px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const backBtnStyle = {
  marginBottom: "1rem",
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

const profileCardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const profileImageStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #3498db",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  backgroundColor: "#000"
};

const addPropertyBtnStyle = {
  marginTop: "1.5rem",
  background: "#f39c12",
  color: "#2c3e50",
  border: "none",
  padding: "10px 20px",
  borderRadius: "25px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const propertyListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "25px",
  marginTop: "1rem"
};

const propertyCardStyle = {
  background: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  border: "1px solid #e5e7eb",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer"
};

const propertyImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover"
};

const badgeContainerStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const interestBadgeStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: '#EF4444',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const priceStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#059669'
};

const locationStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  color: '#6B7280',
  fontSize: '0.9rem',
  marginBottom: '15px'
};

const detailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '15px'
};

const detailItemStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const detailLabelStyle = {
  fontSize: '0.8rem',
  color: '#6B7280',
  marginBottom: '2px'
};

const detailValueStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#374151'
};

const descriptionStyle = {
  margin: '10px 0',
  color: '#6B7280',
  fontSize: '0.9rem',
  lineHeight: '1.4'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '15px'
};

const viewButtonStyle = {
  width: '100%',
  background: '#3B82F6',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'background-color 0.2s'
};

const propertyDetailModalStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const propertyDetailImageSection = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const propertyDetailMainImage = {
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  borderRadius: '8px'
};

const additionalImagesStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '10px'
};

const additionalImageStyle = {
  width: '100%',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '6px',
  cursor: 'pointer'
};

const propertyDetailInfoSection = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const propertyDetailHeader = {
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '15px'
};

const propertyDetailPrice = {
  background: '#f8fafc',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center'
};

const propertyDetailLocation = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#374151',
  fontSize: '1rem',
  fontWeight: '500'
};

const propertyDetailGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  padding: '15px',
  background: '#f9fafb',
  borderRadius: '8px'
};

const propertyDetailItem = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const propertyDetailLabel = {
  fontSize: '0.8rem',
  color: '#6B7280',
  fontWeight: '600',
  textTransform: 'uppercase'
};

const propertyDetailValue = {
  fontSize: '1rem',
  color: '#374151',
  fontWeight: '500'
};

const propertyDetailDescription = {
  background: '#ffffff',
  padding: '15px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px'
};

export default ProfilePage;