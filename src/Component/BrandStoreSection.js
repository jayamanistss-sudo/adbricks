import React, { useState, useEffect, useRef } from 'react';

const BrandStoreSection = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);

  const currentSlideRef = useRef(currentSlide);
  currentSlideRef.current = currentSlide;

  const builders = Array.from(new Map((data?.data || []).map(item => [item.id || item.name, item])).values());

  const navigate = dir => {
    setCurrentSlide(prev => (prev + dir + builders.length) % builders.length);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || builders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % builders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, builders.length]);

  const handleImageError = (builderId) => {
    setImageErrors(prev => new Set([...prev, builderId]));
  };

  const currentBuilder = builders[currentSlide] || {};

  const btnStyle = {
    background: '#FF6B35',
    border: 'none',
    borderRadius: '50%',
    width: isMobile ? '40px' : '50px',
    height: isMobile ? '40px' : '50px',
    fontSize: isMobile ? '22px' : '28px',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  };

  function handleView(name) {
    const params = new URLSearchParams();
    params.append('brand_id', name);
    window.location.href = `/properties?${params.toString()}`;
  }

  const defaultDescription = 'A premier real estate developer committed to creating exceptional living spaces that blend modern design with quality craftsmanship.';

  return (
    <section
      id="brand-store"
      onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
      onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
      style={{
        padding: isMobile ? '30px 15px' : '60px 20px',
        background: 'linear-gradient(180deg, #f8fafc, white)',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '25px' : '40px' }}>
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            color: '#0056D2',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Brand Store
          </h2>
          <p style={{
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            color: '#000'
          }}>
            Premium Verified Builders With Exclusive Project Deals
          </p>
        </div>

        {!builders.length ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            fontSize: '1.1rem',
            color: '#94a3b8',
            background: '#f1f5f9',
            borderRadius: '100px'
          }}>
            No brands available
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{
              background: '#bde3c3',
              borderRadius: isMobile ? '14px' : '20px',
              border: '4px solid #bde3c3',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100%' : '900px',
              height: isMobile ? 'auto' : '260px',
              margin: '0 auto'
            }}>
              <div style={{
                flex: isMobile ? '1' : '0 0 350px',
                width: isMobile ? '100%' : '350px',
                position: 'relative',
                minHeight: isMobile ? '200px' : '260px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                {currentBuilder?.logo_url && !imageErrors.has(currentBuilder.id) ? (
                  <img
                    src={currentBuilder.logo_url}
                    alt={currentBuilder.name || 'Brand'}
                    onError={() => handleImageError(currentBuilder.id)}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: isMobile ? '3rem' : '4rem',
                    fontWeight: '700'
                  }}>
                    {currentBuilder?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              <div style={{
                flex: 1,
                padding: isMobile ? '20px' : '25px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h3 style={{
                  fontSize: isMobile ? '1.4rem' : '1.7rem',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '12px'
                }}>
                  {currentBuilder?.name || 'Brand Name'}
                </h3>

                <p style={{
                  color: '#2d5016',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  lineHeight: '1.5',
                  marginBottom: '18px'
                }}>
                  {currentBuilder?.description || defaultDescription}
                </p>

                <button
                  onClick={() => handleView(currentBuilder?.name || currentBuilder?.id)}
                  style={{
                    background: '#0056D2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: isMobile ? '9px 20px' : '10px 24px',
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    alignSelf: 'flex-start'
                  }}
                >
                  View Properties
                </button>
              </div>
            </div>

            {builders.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'absolute',
                top: '50%',
                left: isMobile ? '5px' : '-60px',
                right: isMobile ? '5px' : '-60px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{ ...btnStyle, pointerEvents: 'auto' }}
                >
                  ‹
                </button>
                <button
                  onClick={() => navigate(1)}
                  style={{ ...btnStyle, pointerEvents: 'auto' }}
                >
                  ›
                </button>
              </div>
            )}

            {builders.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                {builders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentSlide ? '#0056D2' : '#ccc',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandStoreSection;
