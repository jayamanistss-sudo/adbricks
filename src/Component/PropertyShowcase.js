import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Home, User, Square } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const PropertyShowcase = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageSlides, setImageSlides] = useState({});
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  // Filter and slice properties
  const properties = React.useMemo(() => {
    return (data?.data || [])
      .filter(item => item.is_published === "1" && item.property_priority === "Premium")
      .slice(0, 6);
  }, [data]);

  // Navigation functions
  const navigate = useCallback((dir) => {
    setCurrentSlide(prev => (prev + dir + properties.length) % properties.length);
  }, [properties.length]);

  const navigateImage = useCallback((propertyId, images, dir) => {
    setImageSlides(prev => ({
      ...prev,
      [propertyId]: (((prev[propertyId] || 0) + dir + images.length) % images.length)
    }));
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || properties.length <= 1) return;
    
    const timer = setInterval(() => navigate(1), 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, properties.length, navigate]);

  // Check user authentication on mount
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

  // Get visible cards for current slide
  const getVisibleCards = useCallback(() => {
    if (!properties.length) return [];
    
    return [...Array(Math.min(3, properties.length))].map((_, i) => ({
      ...properties[(currentSlide + i) % properties.length],
      slideIndex: i
    }));
  }, [properties, currentSlide]);

  // Get property images
  const getPropertyImages = useCallback((property) => {
    const images = [];
    
    if (property.image_url?.trim()) {
      images.push(property.image_url);
    }
    
    if (property.additional_images) {
      try {
        const additional = JSON.parse(property.additional_images);
        if (Array.isArray(additional)) {
          images.push(...additional.filter(img => img?.trim()));
        }
      } catch (e) {
        console.warn('Failed to parse additional_images:', e);
      }
    }
    
    return images;
  }, []);

  // Handle image error
  const handleImageError = useCallback((propertyId, imageIndex) => {
    setImageErrors(prev => new Set([...prev, `${propertyId}-${imageIndex}`]));
  }, []);

  // Handle view details
  const handleView = useCallback((id) => {
    if (user) {
      window.location.href = `/propertiesDetails/${id}`;
    } else {
      setShowLoginModal(true);
    }
  }, [user]);

  // Handle modal transitions
  const handleShowRegister = useCallback(() => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  }, []);

  const handleShowLogin = useCallback(() => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  }, []);

  const PropertyCard = React.memo(({ property }) => {
    const images = getPropertyImages(property);
    const currentImageIndex = imageSlides[property.property_id] || 0;

    const handleImageNavigation = useCallback((e, direction) => {
      e.stopPropagation();
      navigateImage(property.property_id, images, direction);
    }, [images, property.property_id]);

    const handleDotClick = useCallback((e, index) => {
      e.stopPropagation();
      setImageSlides(prev => ({ ...prev, [property.property_id]: index }));
    }, [property.property_id]);

    return (
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          minWidth: '380px',
          maxWidth: '420px',
          cursor: 'pointer',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        }}
      >
        <div style={{ height: '280px', position: 'relative', background: '#f8fafc' }}>
          {/* Image Display */}
          {images.length > 0 && (
            <>
              {!imageErrors.has(`${property.property_id}-${currentImageIndex}`) ? (
                <img
                  src={images[currentImageIndex]}
                  alt={`${property.property_type_name} - ${property.bhk_configuration}`}
                  onError={() => handleImageError(property.property_id, currentImageIndex)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                  color: '#64748b',
                  fontSize: '2rem',
                  fontWeight: '600'
                }}>
                  <Home size={48} />
                </div>
              )}

              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'
              }} />
            </>
          )}

          {/* Location Badge */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '20px',
            background: 'rgba(44, 62, 80, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backdropFilter: 'blur(10px)'
          }}>
            <MapPin size={14} />
            {property.city_name}, {property.district_name}
          </div>

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNavigation(e, -1)}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronLeft size={18} color="rgb(44, 62, 80)" />
              </button>

              <button
                onClick={(e) => handleImageNavigation(e, 1)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronRight size={18} color="rgb(44, 62, 80)" />
              </button>

              {/* Image Dots */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '20px',
                display: 'flex',
                gap: '5px'
              }}>
                {images.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index === currentImageIndex
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={(e) => handleDotClick(e, index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Card Content */}
        <div style={{ padding: '25px', color: '#1a365d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Home size={18} color="rgb(52, 152, 219)" />
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700', 
              margin: 0,
              lineHeight: '1.3'
            }}>
              {property.property_type_name} - {property.bhk_configuration}
            </h3>
          </div>

          <div style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: 'rgb(52, 152, 219)',
            marginBottom: '20px'
          }}>
            ₹{parseFloat(property.expected_price_lakhs || 0).toLocaleString('en-IN')} Lakh
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Square size={16} color="#64748b" />
              <div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Area</div>
                <div style={{ fontWeight: '600', color: '#1a365d' }}>
                  {parseFloat(property.builtup_area_sqft || 0).toLocaleString()} sq ft
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#64748b" />
              <div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Owner</div>
                <div style={{ fontWeight: '600', color: '#1a365d' }}>
                  {property.owner_name || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <button 
            style={{
              background: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
              border: 'none',
              padding: '14px 24px',
              borderRadius: '25px',
              fontWeight: '700',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleView(property.property_id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  });

  return (
    <>
      {/* Modals */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        setShowRegisterModal={handleShowRegister}
      />
      <RegisterModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        setShowLoginModal={handleShowLogin}
      />

      <section
        style={{
          padding: '100px 0',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative'
        }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '3rem',
              marginBottom: '15px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Premium Properties
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Discover exceptional properties from our handpicked premium collection
            </p>
          </div>

          {!properties.length ? (
            <div style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: '1.2rem',
              padding: '60px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px'
            }}>
              No premium properties available
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                gap: '30px',
                justifyContent: 'center',
                alignItems: 'stretch'
              }}>
                {getVisibleCards().map((property, index) => (
                  <PropertyCard 
                    key={`${property.property_id}-${currentSlide}-${index}`} 
                    property={property} 
                  />
                ))}
              </div>

              {properties.length > 3 && (
                <>
                  <button
                    onClick={() => navigate(-1)}
                    style={{
                      position: 'absolute',
                      left: '-80px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid rgba(52, 152, 219, 0.2)',
                      borderRadius: '50%',
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.borderColor = 'rgba(52, 152, 219, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.borderColor = 'rgba(52, 152, 219, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <ChevronLeft size={28} color="rgb(44, 62, 80)" />
                  </button>

                  <button
                    onClick={() => navigate(1)}
                    style={{
                      position: 'absolute',
                      right: '-80px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid rgba(52, 152, 219, 0.2)',
                      borderRadius: '50%',
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.borderColor = 'rgba(52, 152, 219, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.borderColor = 'rgba(52, 152, 219, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <ChevronRight size={28} color="rgb(44, 62, 80)" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PropertyShowcase;