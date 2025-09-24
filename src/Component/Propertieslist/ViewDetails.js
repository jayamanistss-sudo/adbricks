import React, { useState, useEffect } from 'react';
import api from '../Apiurl';
import { useParams, useNavigate } from "react-router-dom";
import Toast from '../Toast';
const PropertyDetailsPage = () => {
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const showToast = (message, type = 'info') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: '', type: 'info' });
  const apiBase = "https://demo.stss.in/admin/Config/router.php?router=";

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
    const addInterestedProperty = async () => {
      try {
        const payload = new FormData();
        payload.append("userId", user.user_id);
        payload.append("property_id", id);
        await api("interested_properties_add", "POST", payload, true);
      } catch (err) {
        console.error("Error adding interested property:", err);
      }
    };
    if (user?.user_id && id) {
      addInterestedProperty();
    }
  }, [user, id]);

  useEffect(() => {
    fetch(`${apiBase}property_list&property_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && data.data.length > 0) {
          const prop = data.data[0];
          setProperty({
            ...prop,
            additional_images: prop.additional_images
              ? JSON.parse(prop.additional_images)
              : []
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching property:", err);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = price => {
    const numPrice = parseFloat(price);
    return numPrice >= 100
      ? `₹${(numPrice / 100).toFixed(1)} Cr`
      : `₹${numPrice} L`;
  };

  const getPriorityBadge = priority => {
    switch (priority) {
      case "Featured":
        return { text: "Featured", class: "badge-featured", icon: "⭐" };
      case "Premium":
        return { text: "Premium", class: "badge-premium", icon: "💎" };
      case "Normal":
        return { text: "Normal", class: "badge-normal", icon: "🏠" };
      default:
        return null;
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", contactForm.name);
    payload.append("email", contactForm.email);
    payload.append("phone", contactForm.phone);
    payload.append("message", contactForm.message);
    payload.append("property_id", id);
    const result = await api("add_contact_us", "POST", payload, true);
    if (result.status === 200) {
      showToast("Your message has been sent successfully. We will contact you shortly.");
      setShowContactForm(false);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }

  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container">
        <h2>Property Not Found</h2>
        <button className="btn-primary" onClick={() => navigate("/properties")}>
          Back to Properties
        </button>
      </div>
    );
  }

  const priorityBadge = getPriorityBadge(property.property_priority);
  const allImages = [property.image_url, ...property.additional_images];

  return (
    <div className="property-details">
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
      <style jsx>{`
        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }
        
        .property-details {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #fafbfc;
          min-height: 100vh;
          color: #1a202c;
          line-height: 1.6;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #1a365d;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.1);
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-btn {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          color: #4a5568;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
          color: #2d3748;
        }

        .property-id {
          font-size: 14px;
          color: #718096;
          font-weight: 500;
        }

        .container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .property-header {
          background: #ffffff;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .property-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .title-section h1 {
          font-size: 32px;
          color: #1a202c;
          margin-bottom: 12px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .location {
          color: #718096;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .badges {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .badge-featured {
          background: #fef5e7;
          color: #975a16;
          border: 1px solid #f6e05e;
        }

        .badge-premium {
          background: #f7fafc;
          color: #553c9a;
          border: 1px solid #d6bcfa;
        }

        .badge-normal {
          background: #ebf8ff;
          color: #2c5282;
          border: 1px solid #90cdf4;
        }

        .badge-new {
          background: #f0fff4;
          color: #276749;
          border: 1px solid #9ae6b4;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0 0 0;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 20px;
        }

        .price-info {
          display: flex;
          align-items: baseline;
          gap: 16px;
        }

        .main-price {
          font-size: 36px;
          font-weight: 800;
          color: #e53e3e;
          letter-spacing: -0.025em;
        }

        .price-sqft {
          color: #718096;
          font-size: 16px;
          font-weight: 500;
        }

        .interested-count {
          background: #1a365d;
          color: white;
          padding: 12px 20px;
          border-radius: 24px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .left-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .image-gallery {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .main-image {
          width: 100%;
          height: 400px;
          border-radius: 8px;
          object-fit: cover;
          margin-bottom: 16px;
          background: #f7fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a0aec0;
          font-size: 48px;
          border: 1px solid #e2e8f0;
        }

        .image-thumbnails {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
        }

        .thumbnail {
          width: 100%;
          height: 80px;
          border-radius: 6px;
          object-fit: cover;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid #e2e8f0;
        }

        .thumbnail:hover {
          border-color: #3182ce;
          transform: scale(1.02);
        }

        .thumbnail.active {
          border-color: #3182ce;
          transform: scale(1.02);
        }

        .property-info {
          background: #ffffff;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .info-section {
          margin-bottom: 32px;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .info-section h3 {
          color: #1a202c;
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 600;
          padding-bottom: 12px;
          border-bottom: 2px solid #f7fafc;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .spec-item {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .spec-item:hover {
          background: #edf2f7;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .spec-icon {
          font-size: 24px;
          margin-bottom: 8px;
          display: block;
        }

        .spec-label {
          color: #718096;
          font-size: 14px;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .spec-value {
          color: #1a202c;
          font-weight: 600;
          font-size: 16px;
        }

        .description {
          color: #4a5568;
          line-height: 1.7;
          font-size: 16px;
        }

        .right-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .contact-card, .owner-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .contact-card h3, .owner-card h3 {
          color: #1a202c;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: 600;
        }

        .btn-primary {
          background: #3182ce;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          width: 100%;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary:hover {
          background: #2c5282;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .btn-secondary {
          background: #ffffff;
          color: #3182ce;
          border: 1px solid #3182ce;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-secondary:hover {
          background: #3182ce;
          color: white;
          transform: translateY(-1px);
        }

        .owner-info {
          text-align: center;
        }

        .owner-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 16px;
          font-weight: 700;
          border: 4px solid #e2e8f0;
        }

        .owner-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .owner-phone {
          color: #718096;
          font-size: 14px;
          font-weight: 500;
        }

        .property-stats {
          background: #1a365d;
          color: white;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }

        .property-stats h3 {
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          opacity: 0.9;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .contact-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 32, 44, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-header h3 {
          color: #1a202c;
          font-size: 20px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #a0aec0;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: #718096;
          background: #f7fafc;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1a202c;
          font-size: 14px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .property-title {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .price-section {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .title-section h1 {
            font-size: 28px;
          }
          
          .main-price {
            font-size: 32px;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .container {
            padding: 20px 16px;
          }
          
          .property-header, .property-info, .contact-card, .owner-card {
            padding: 20px;
          }
          
          .specs-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            padding: 24px;
            margin: 16px;
          }
        }
      `}</style>
      <div className="header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate("/properties")}>
            ← Back to Properties
          </button>
          <div className="property-id">
            Property ID: #{property.property_id}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="property-header">
          <div className="property-title">
            <div className="title-section">
              <h1>{property.bhk_configuration} {property.property_type_name}</h1>
              <div className="location">
                📍 {property.property_address}, {property.city_name}, {property.district_name}
              </div>
              <div className="badges">
                {priorityBadge && (
                  <span className={`badge ${priorityBadge.class}`}>
                    {priorityBadge.icon} {priorityBadge.text}
                  </span>
                )}
                {property.is_resale === "0" && (
                  <span className="badge badge-new">🆕 New Launch</span>
                )}
                {property.is_resale === "1" && (
                  <span className="badge badge-new">🔄 Resale</span>
                )}
              </div>
            </div>
          </div>

          <div className="price-section">
            <div className="price-info">
              <div className="main-price">
                {formatPrice(property.expected_price_lakhs)}
              </div>
              <div className="price-sqft">
                ₹{parseFloat(property.price_per_sqft).toLocaleString()}/sq ft
              </div>
            </div>
            <div className="interested-count">
              ❤️ {property.interested_count} interested
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="left-section">
            <div className="image-gallery">
              <img
                src={allImages[selectedImage]}
                alt="Property"
                className="main-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none' }} className="main-image">
                🏠
              </div>

              {allImages.length > 1 && (
                <div className="image-thumbnails">
                  {allImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Property ${index + 1}`}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="property-info">
              <div className="info-section">
                <h3>Property Specifications</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-icon">🏠</span>
                    <div className="spec-label">Configuration</div>
                    <div className="spec-value">{property.bhk_configuration}</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">📏</span>
                    <div className="spec-label">Built-up Area</div>
                    <div className="spec-value">{parseFloat(property.builtup_area_sqft).toLocaleString()} sq ft</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">🏢</span>
                    <div className="spec-label">Property Type</div>
                    <div className="spec-value">{property.property_type_name}</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">💰</span>
                    <div className="spec-label">Transaction</div>
                    <div className="spec-value">{property.transaction_type}</div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Description</h3>
                <p className="description">{property.property_description}</p>
              </div>

              <div className="info-section">
                <h3>Location Details</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-icon">🏛️</span>
                    <div className="spec-label">State</div>
                    <div className="spec-value">{property.state}</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">🌆</span>
                    <div className="spec-label">District</div>
                    <div className="spec-value">{property.district_name}</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">🏙️</span>
                    <div className="spec-label">City</div>
                    <div className="spec-value">{property.city_name}</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">📅</span>
                    <div className="spec-label">Listed On</div>
                    <div className="spec-value">{new Date(property.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-section">
            <div className="contact-card">
              <h3>Interested in this property?</h3>
              <button className="btn-primary" onClick={() => setShowContactForm(true)}>
                Contact Owner
              </button>
              <button className="btn-secondary">
                📞 Call Now
              </button>
            </div>

            <div className="owner-card">
              <h3>Property Owner</h3>
              <div className="owner-info">
                <div className="owner-avatar">
                  {property.owner_name.charAt(0).toUpperCase()}
                </div>
                <div className="owner-name">{property.owner_name}</div>
                <div className="owner-phone">{property.contact_number}</div>
              </div>
            </div>

            <div className="property-stats">
              <h3>Property Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{property.interested_count}</div>
                  <div className="stat-label">Interested</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{Math.floor(Math.random() * 50) + 10}</div>
                  <div className="stat-label">Views</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{property.property_priority}</div>
                  <div className="stat-label">Priority</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{property.is_published === "1" ? "Published" : "Draft"}</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <div className="contact-modal" onClick={(e) => {
          if (e.target.className === 'contact-modal') setShowContactForm(false);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Contact Property Owner</h3>
              <button className="close-btn" onClick={() => setShowContactForm(false)}>×</button>
            </div>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="I'm interested in this property. Please share more details."
                />
              </div>
              <button type="submit" className="btn-primary" onClick={(e) => handleContactSubmit(e)}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
