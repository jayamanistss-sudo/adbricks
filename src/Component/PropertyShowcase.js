import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Home, User, Square } from 'lucide-react';

const PropertyShowcase = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageSlides, setImageSlides] = useState({});
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
      } catch { }
    }
    return images;
  }, []);

  const handleImageError = useCallback((propertyId, imageIndex) => {
    setImageErrors(prev => new Set([...prev, `${propertyId}-${imageIndex}`]));
  }, []);

  const handleView = useCallback((id) => {
    window.location.href = `/propertiesDetails/${id}`;
  }, []);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigate(1);
    } else if (isRightSwipe) {
      navigate(-1);
    }
  };

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
          background: '#ECF4E8',
          borderRadius: isMobile ? '20px' : '20px',
          overflow: 'hidden',
          boxShadow: isMobile ? '0 10px 30px rgba(0,0,0,0.12)' : '0 20px 40px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          minWidth: isMobile ? '100%' : '380px',
          maxWidth: isMobile ? '100%' : '420px',
          cursor: 'pointer'
        }}
      >
        <div style={{ height: isMobile ? '280px' : '280px', position: 'relative', background: '#f8fafc' }}>
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
                  color: '#64748b', fontSize: '2rem', fontWeight: '600'
                }}>
                  <Home size={48} />
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }} />
            </>
          )}

          <div style={{
            position: 'absolute', bottom: isMobile ? '12px' : '15px', left: isMobile ? '12px' : '20px',
            background: 'rgba(44, 62, 80, 0.95)', color: 'white',
            padding: isMobile ? '8px 14px' : '8px 12px', borderRadius: '24px',
            fontSize: isMobile ? '0.85rem' : '0.85rem', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(10px)',
            maxWidth: 'calc(100% - 24px)'
          }}>
            <MapPin size={isMobile ? 14 : 14} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {property.city_name}, {property.district_name}
            </span>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNavigation(e, -1)}
                style={{
                  position: 'absolute', left: isMobile ? '12px' : '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '50%',
                  width: isMobile ? '36px' : '35px', height: isMobile ? '36px' : '35px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <ChevronLeft size={isMobile ? 18 : 18} color="rgb(44, 62, 80)" />
              </button>

              <button
                onClick={(e) => handleImageNavigation(e, 1)}
                style={{
                  position: 'absolute', right: isMobile ? '12px' : '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '50%',
                  width: isMobile ? '36px' : '35px', height: isMobile ? '36px' : '35px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <ChevronRight size={isMobile ? 18 : 18} color="rgb(44, 62, 80)" />
              </button>

              <div style={{
                position: 'absolute',
                bottom: isMobile ? '12px' : '10px',
                right: isMobile ? '12px' : '20px',
                display: 'flex',
                gap: isMobile ? '6px' : '5px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: isMobile ? '6px 10px' : '4px 8px',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)'
              }}>
                {images.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: isMobile ? '7px' : '8px',
                      height: isMobile ? '7px' : '8px',
                      borderRadius: '50%',
                      background: index === currentImageIndex ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={(e) => handleDotClick(e, index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: isMobile ? '24px 20px' : '25px', color: '#1a365d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Home size={isMobile ? 18 : 18} color="rgb(52, 152, 219)" />
            <h3 style={{
              fontSize: isMobile ? '1.25rem' : '1.3rem',
              fontWeight: '700',
              margin: 0,
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#000000',
            }}>
              {property.property_name}
            </h3>
          </div>

          <div style={{
            fontSize: isMobile ? "1.4rem" : "1.4rem",
            fontWeight: "800",
            color: "rgb(52, 152, 219)",
            marginBottom: isMobile ? "24px" : "20px",
            letterSpacing: '-0.02em'
          }}>
            ₹{parseFloat(property.price_per_sqft || 0).toLocaleString("en-IN")}/sq ft
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: isMobile ? '16px' : '15px',
            marginBottom: isMobile ? '24px' : '20px',
            fontSize: isMobile ? '0.85rem' : '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Square size={isMobile ? 16 : 14} color="rgb(52, 152, 219)" />
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: isMobile ? '0.75rem' : '0.8rem', marginBottom: '2px' }}>BHK</div>
                <div style={{ fontWeight: '700', color: '#1a365d', fontSize: isMobile ? '0.9rem' : '0.85rem' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={isMobile ? 16 : 14} color="rgb(52, 152, 219)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#64748b', fontSize: isMobile ? '0.75rem' : '0.8rem', marginBottom: '2px' }}>Owner</div>
                <div style={{
                  fontWeight: '700',
                  color: '#1a365d',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: isMobile ? '0.9rem' : '0.85rem'
                }}>
                  {property.owner_name || 'N/A'}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: isMobile ? '20px' : '18px',
                fontSize: isMobile ? '0.95rem' : '1rem',
                fontWeight: '700',
                color: '#1a365d'
              }}
            >
              {(() => {
                const builtupData = property.builtup_area_sqft;
                let allNumbers = [];

                try {
                  let parsedData = builtupData;
                  if (typeof builtupData === 'string') {
                    parsedData = JSON.parse(builtupData);
                  }

                  if (Array.isArray(parsedData)) {
                    parsedData.forEach(val => {
                      if (typeof val === 'string') {
                        const nums = val
                          .replace(/\s+/g, '')
                          .split('-')
                          .map(n => parseFloat(n))
                          .filter(n => !isNaN(n));
                        allNumbers.push(...nums);
                      }
                    });
                  } else if (typeof parsedData === 'object' && parsedData !== null) {
                    Object.values(parsedData).forEach(val => {
                      if (typeof val === 'string') {
                        const nums = val
                          .replace(/\s+/g, '')
                          .split('-')
                          .map(n => parseFloat(n))
                          .filter(n => !isNaN(n));
                        allNumbers.push(...nums);
                      }
                    });
                  }
                } catch (error) { }

                const validNumbers = allNumbers.filter(n => !isNaN(n) && n > 0);

                if (validNumbers.length > 0) {
                  const min = Math.min(...validNumbers);
                  const max = Math.max(...validNumbers);
                  return <span>{min === max ? `${min} Sq.ft` : `${min} - ${max} Sq.ft`}</span>;
                } else {
                  return 'N/A';
                }
              })()}
            </div>
          </div>

          <button
            style={{
              background: 'linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))',
              border: 'none',
              padding: isMobile ? '16px 24px' : '14px 24px',
              borderRadius: '30px',
              fontWeight: '700',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
              fontSize: isMobile ? '1rem' : '0.95rem',
              boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
              transition: 'transform 0.2s ease',
              letterSpacing: '0.02em'
            }}
            onClick={() => handleView(property.property_id)}
            onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            View Details
          </button>
        </div>
      </div>
    );
  });

  return (
    <section
      style={{
        padding: isMobile ? '50px 0 60px' : '100px 0',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        minHeight: isMobile ? '100vh' : 'auto'
      }}
      onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
      onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '60px' }}>
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: isMobile ? '2.2rem' : '3rem',
              marginBottom: isMobile ? '12px' : '15px',
              lineHeight: '1',
              letterSpacing: '0.01em',
              textAlign: 'center',
              textTransform: 'capitalize',
              color: '#1055C9' // new text color
            }}
          >
            Premium Properties
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              color: '#000000',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1',
              letterSpacing: '0.01em',
              textAlign: 'center',
              textTransform: 'capitalize',
              padding: isMobile ? '0 10px' : '0'
            }}
          >
            Discover exceptional properties from our handpicked premium collection
          </p>

        </div>

        {!properties.length ? (
          <div style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            padding: isMobile ? '50px 20px' : '60px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: isMobile ? '16px' : '20px',
            margin: isMobile ? '0 10px' : '0'
          }}>
            No premium properties available
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              gap: isMobile ? '0' : '30px',
              justifyContent: 'center',
              alignItems: 'stretch',
              overflowX: isMobile ? 'visible' : 'visible',
              scrollSnapType: 'none',
              paddingBottom: isMobile ? '20px' : '0'
            }}>
              {getVisibleCards().map((property, index) => (
                <div
                  key={`${property.property_id}-${currentSlide}-${index}`}
                  style={{
                    scrollSnapAlign: 'none',
                    flexShrink: isMobile ? 0 : 1,
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {properties.length > (isMobile ? 1 : 3) && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    position: 'absolute',
                    left: isMobile ? '-10px' : '-80px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid rgba(52, 152, 219, 0.2)',
                    borderRadius: '50%',
                    width: isMobile ? '44px' : '70px',
                    height: isMobile ? '44px' : '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(0.95)'}
                  onTouchEnd={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                  <ChevronLeft size={isMobile ? 20 : 28} color="rgb(44, 62, 80)" />
                </button>

                <button
                  onClick={() => navigate(1)}
                  style={{
                    position: 'absolute',
                    right: isMobile ? '-10px' : '-80px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid rgba(52, 152, 219, 0.2)',
                    borderRadius: '50%',
                    width: isMobile ? '44px' : '70px',
                    height: isMobile ? '44px' : '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(0.95)'}
                  onTouchEnd={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                  <ChevronRight size={isMobile ? 20 : 28} color="rgb(44, 62, 80)" />
                </button>

                {isMobile && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '24px'
                  }}>
                    {properties.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        style={{
                          width: index === currentSlide ? '24px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: index === currentSlide ? 'rgb(52, 152, 219)' : 'rgba(52, 152, 219, 0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyShowcase;