import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Home, User, Square } from 'lucide-react';

const PropertyShowcase = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageSlides, setImageSlides] = useState({});
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const properties = React.useMemo(() => {
    return (data?.data || [])
      .filter(item => item.is_published === "1" && item.property_priority === "Premium")
      .slice(0, 6);
  }, [data]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useCallback((dir) => {
    setCurrentSlide(prev => (prev + dir + properties.length) % properties.length);
  }, [properties.length]);

  const navigateImage = useCallback((propertyId, images, dir) => {
    setImageSlides(prev => ({
      ...prev,
      [propertyId]: (((prev[propertyId] || 0) + dir + images.length) % images.length)
    }));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || properties.length <= 1) return;
    const timer = setInterval(() => navigate(1), 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, properties.length, navigate]);

  const getVisibleCards = useCallback(() => {
    if (!properties.length) return [];
    const cardsToShow = isMobile ? 1 : Math.min(3, properties.length);
    return [...Array(cardsToShow)].map((_, i) => ({
      ...properties[(currentSlide + i) % properties.length],
      slideIndex: i
    }));
  }, [properties, currentSlide, isMobile]);

  const getPropertyImages = useCallback((property) => {
    const images = [];
    if (property.image_url?.trim()) images.push(property.image_url);
    if (property.additional_images) {
      try {
        const additional = JSON.parse(property.additional_images);
        if (Array.isArray(additional)) {
          images.push(...additional.filter(img => img?.trim()));
        }
      } catch {}
    }
    return images;
  }, []);

  const handleImageError = useCallback((propertyId, imageIndex) => {
    setImageErrors(prev => new Set([...prev, `${propertyId}-${imageIndex}`]));
  }, []);

  const handleView = useCallback((id) => {
    window.location.href = `/propertiesDetails/${id}`;
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
          borderRadius: isMobile ? '16px' : '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          minWidth: isMobile ? '100%' : '380px',
          maxWidth: isMobile ? '100%' : '420px',
          cursor: 'pointer'
        }}
      >
        <div style={{ height: isMobile ? '240px' : '280px', position: 'relative', background: '#f8fafc' }}>
          {images.length > 0 && (
            <>
              {!imageErrors.has(`${property.property_id}-${currentImageIndex}`) ? (
                <img
                  src={images[currentImageIndex]}
                  alt={`${property.property_type_name} - ${property.bhk_configuration}`}
                  onError={() => handleImageError(property.property_id, currentImageIndex)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                  color: '#64748b', fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '600'
                }}>
                  <Home size={isMobile ? 36 : 48} />
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }} />
            </>
          )}

          <div style={{
            position: 'absolute', bottom: '15px', left: isMobile ? '15px' : '20px',
            background: 'rgba(44, 62, 80, 0.9)', color: 'white',
            padding: isMobile ? '6px 10px' : '8px 12px', borderRadius: '20px',
            fontSize: isMobile ? '0.75rem' : '0.85rem', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '5px', backdropFilter: 'blur(10px)',
            maxWidth: 'calc(100% - 30px)'
          }}>
            <MapPin size={isMobile ? 12 : 14} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {property.city_name}, {property.district_name}
            </span>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNavigation(e, -1)}
                style={{
                  position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%',
                  width: isMobile ? '30px' : '35px', height: isMobile ? '30px' : '35px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                }}
              >
                <ChevronLeft size={isMobile ? 16 : 18} color="rgb(44, 62, 80)" />
              </button>

              <button
                onClick={(e) => handleImageNavigation(e, 1)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%',
                  width: isMobile ? '30px' : '35px', height: isMobile ? '30px' : '35px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                }}
              >
                <ChevronRight size={isMobile ? 16 : 18} color="rgb(44, 62, 80)" />
              </button>

              <div style={{ position: 'absolute', bottom: '10px', right: isMobile ? '15px' : '20px', display: 'flex', gap: isMobile ? '3px' : '5px' }}>
                {images.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: isMobile ? '6px' : '8px', height: isMobile ? '6px' : '8px',
                      borderRadius: '50%', background: index === currentImageIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)', cursor: 'pointer'
                    }}
                    onClick={(e) => handleDotClick(e, index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: isMobile ? '20px' : '25px', color: '#1a365d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Home size={isMobile ? 16 : 18} color="rgb(52, 152, 219)" />
            <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: '700', margin: 0, lineHeight: '1.3' }}>
              {property.property_name}
            </h3>
          </div>

          <div style={{ fontSize: isMobile ? "1.2rem" : "1.4rem", fontWeight: "800", color: "rgb(52, 152, 219)", marginBottom: "20px" }}>
            Per sq ft ₹{parseFloat(property.price_per_sqft || 0).toLocaleString("en-IN")}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '12px' : '15px', marginBottom: '20px', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Square size={14} color="#64748b" />
              <div>
                <div style={{ color: '#64748b', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>BHK</div>
                <div style={{ fontWeight: '600', color: '#1a365d' }}>
                  {(() => {
                    let bhks = property.bhk_configuration;
                    if (typeof bhks === "string") {
                      try { bhks = JSON.parse(bhks); } catch { bhks = [bhks]; }
                    }
                    if (!Array.isArray(bhks)) bhks = bhks ? [bhks] : [];
                    return bhks.length > 0 ? bhks.join(", ") : "N/A";
                  })()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={14} color="#64748b" />
              <div>
                <div style={{ color: '#64748b', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>Owner</div>
                <div style={{ fontWeight: '600', color: '#1a365d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {property.owner_name || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <button
            style={{
              background: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
              border: 'none', padding: isMobile ? '12px 20px' : '14px 24px',
              borderRadius: '25px', fontWeight: '700', color: 'white',
              cursor: 'pointer', width: '100%', fontSize: isMobile ? '0.9rem' : '0.95rem'
            }}
            onClick={() => handleView(property.property_id)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  });

  return (
    <section
      style={{ padding: isMobile ? '60px 0' : '100px 0', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', position: 'relative' }}
      onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
      onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 15px' : '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
          <h2 style={{
            fontSize: isMobile ? '2rem' : '3rem', marginBottom: '15px', fontWeight: '800',
            background: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Premium Properties
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.2rem', color: '#64748b',
            maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'
          }}>
            Discover exceptional properties from our handpicked premium collection
          </p>
        </div>

        {!properties.length ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: isMobile ? '1rem' : '1.2rem', padding: isMobile ? '40px 20px' : '60px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '20px' }}>
            No premium properties available
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', gap: isMobile ? '20px' : '30px', justifyContent: 'center',
              alignItems: 'stretch', overflowX: isMobile ? 'auto' : 'visible',
              scrollSnapType: isMobile ? 'x mandatory' : 'none', paddingBottom: isMobile ? '10px' : '0'
            }}>
              {getVisibleCards().map((property, index) => (
                <div key={`${property.property_id}-${currentSlide}-${index}`} style={{ scrollSnapAlign: isMobile ? 'center' : 'none', flexShrink: isMobile ? 0 : 1 }}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {properties.length > (isMobile ? 1 : 3) && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    position: 'absolute', left: isMobile ? '10px' : '-80px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)', border: '2px solid rgba(52, 152, 219, 0.2)',
                    borderRadius: '50%', width: isMobile ? '50px' : '70px', height: isMobile ? '50px' : '70px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                  }}
                >
                  <ChevronLeft size={isMobile ? 20 : 28} color="rgb(44, 62, 80)" />
                </button>

                <button
                  onClick={() => navigate(1)}
                  style={{
                    position: 'absolute', right: isMobile ? '10px' : '-80px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)', border: '2px solid rgba(52, 152, 219, 0.2)',
                    borderRadius: '50%', width: isMobile ? '50px' : '70px', height: isMobile ? '50px' : '70px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                  }}
                >
                  <ChevronRight size={isMobile ? 20 : 28} color="rgb(44, 62, 80)" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyShowcase;
