import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const BrandStoreSection = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const builders = Array.from(new Map((data?.data || []).map(item => [item.id || item.name, item])).values());

  const navigate = dir => setCurrentSlide(prev => (prev + dir + builders.length) % builders.length);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !builders.length) return;
    const timer = setInterval(() => navigate(1), 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentSlide, builders.length]);

  const getCards = () => {
    if (!builders.length) return [];
    
    // On mobile, show only 1 card; on desktop, show up to 3
    const cardsToShow = isMobile ? 1 : Math.min(3, builders.length);
    
    return [...Array(cardsToShow)].map((_, i) => ({
      ...builders[(currentSlide + i) % builders.length],
      pos: i
    }));
  };

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

  const truncateText = (text, limit = 80) => text?.length > limit ? text.slice(0, limit) + '...' : text;

  const handleImageError = (builderId) => {
    setImageErrors(prev => new Set([...prev, builderId]));
  };

  const cardStyle = pos => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))',
    borderRadius: isMobile ? '16px' : '24px',
    overflow: 'hidden',
    boxShadow: isMobile 
      ? '0 15px 30px rgba(0,0,0,0.2)' 
      : (pos === 1 ? '0 30px 60px rgba(0,0,0,0.25)' : '0 20px 40px rgba(0,0,0,0.15)'),
    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(52, 152, 219, 0.2)',
    width: isMobile ? 'calc(100vw - 60px)' : '380px',
    maxWidth: isMobile ? '350px' : '380px',
    minWidth: isMobile ? '280px' : '320px',
    margin: isMobile ? '0 auto' : '0',
    transform: isMobile 
      ? 'scale(1)' 
      : `scale(${pos === 1 ? 1.05 : 0.95}) translateY(${pos === 1 ? '-10px' : '5px'}) rotateY(${pos === 0 ? '3deg' : pos === 2 ? '-3deg' : '0'})`,
    zIndex: pos === 1 ? 20 : 10
  });

  const btnStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(135deg, white, #f8fafc)',
    border: '2px solid rgba(52, 152, 219, 0.3)',
    borderRadius: '50%',
    width: isMobile ? '45px' : '55px',
    height: isMobile ? '45px' : '55px',
    fontSize: isMobile ? '18px' : '24px',
    color: '#2c3e50',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    zIndex: 30
  };

  function handleView(name) {
    if (user) {
      const params = new URLSearchParams();
      params.append('brand_id', name);
      window.location.href = `/properties?${params.toString()}`;
    } else {
      setShowLoginModal(true);
    }
  }

  return (
    <section
      id="brand-store"
      onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
      onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
      style={{ 
        padding: isMobile ? '40px 0' : '80px 0', 
        background: 'linear-gradient(180deg, #f8fafc, white)', 
        position: 'relative' 
      }}
    >
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
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '0 15px' : '0 20px' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? '40px' : '70px' 
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '2rem' : '3rem', 
            background: 'linear-gradient(135deg, #2c3e50, #3498db)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            marginBottom: '15px', 
            fontWeight: '800',
            lineHeight: '1.2'
          }}>
            Brand Store
          </h2>
          <p style={{ 
            fontSize: isMobile ? '1.1rem' : '1.3rem', 
            color: '#64748b', 
            maxWidth: '600px', 
            margin: '0 auto',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Premium verified builders with exclusive project deals
          </p>
        </div>

        {!builders.length ? (
          <div style={{ 
            textAlign: 'center', 
            padding: isMobile ? '40px 20px' : '60px', 
            fontSize: isMobile ? '1.1rem' : '1.2rem', 
            color: '#94a3b8', 
            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', 
            borderRadius: isMobile ? '16px' : '20px',
            margin: isMobile ? '0 10px' : '0'
          }}>
            No brands available
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '0' : '30px', 
              justifyContent: 'center', 
              padding: isMobile ? '10px 0' : '20px 0',
              flexWrap: isMobile ? 'nowrap' : 'wrap',
              overflowX: isMobile ? 'visible' : 'visible'
            }}>
              {getCards().map((builder, idx) => (
                <div key={`${builder.id}-${idx}`} style={cardStyle(builder.pos)}>
                  <div style={{
                    height: isMobile ? '180px' : '220px',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {builder.logo_url && !imageErrors.has(builder.id) ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white'
                      }}>
                        <img
                          src={builder.logo_url}
                          alt={builder.name || 'Brand logo'}
                          onError={() => handleImageError(builder.id)}
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            transition: 'all 0.3s ease',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          onLoad={(e) => {
                            e.target.style.opacity = '1';
                          }}
                          onLoadStart={(e) => {
                            e.target.style.opacity = '0';
                            e.target.style.transition = 'opacity 0.5s ease';
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                        color: '#64748b'
                      }}>
                        <div style={{
                          width: isMobile ? '60px' : '80px',
                          height: isMobile ? '60px' : '80px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #94a3b8, #64748b)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '1.5rem' : '2rem',
                          fontWeight: '700',
                          color: 'white',
                          marginBottom: '10px'
                        }}>
                          {builder.name?.charAt(0) || '?'}
                        </div>
                        <span style={{
                          fontSize: isMobile ? '0.8rem' : '0.9rem',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          {builder.name || 'Brand'}
                        </span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1))' }} />
                    <span style={{ 
                      position: 'absolute', 
                      top: isMobile ? 12 : 15, 
                      right: isMobile ? 12 : 15, 
                      background: 'linear-gradient(135deg, #10b981, #059669)', 
                      color: 'white', 
                      padding: isMobile ? '5px 12px' : '6px 14px', 
                      borderRadius: '20px', 
                      fontSize: isMobile ? '0.7rem' : '0.75rem', 
                      fontWeight: '700',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}>
                      ✓ Verified
                    </span>
                  </div>

                  <div style={{ padding: isMobile ? '20px' : '25px' }}>
                    <h3 style={{ 
                      fontSize: isMobile ? '1.2rem' : '1.4rem', 
                      fontWeight: '800', 
                      marginBottom: '12px', 
                      background: 'linear-gradient(135deg, #0f172a, #334155)', 
                      WebkitBackgroundClip: 'text', 
                      WebkitTextFillColor: 'transparent' 
                    }}>
                      {builder.name}
                    </h3>
                    <p style={{ 
                      color: '#64748b', 
                      marginBottom: '20px', 
                      fontSize: isMobile ? '0.9rem' : '0.95rem', 
                      lineHeight: '1.6', 
                      minHeight: isMobile ? 'auto' : '48px' 
                    }}>
                      {truncateText(builder.description, isMobile ? 60 : 80)}
                    </p>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3498db, #2c3e50)',
                        border: 'none',
                        padding: isMobile ? '10px 20px' : '12px 24px',
                        borderRadius: '25px',
                        color: 'white',
                        fontSize: isMobile ? '0.9rem' : '0.95rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(52,152,219,0.3)'
                      }}
                      onClick={() => handleView(builder.name)}
                    >
                      View Projects →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {builders.length > 1 && (
              <>
                <button 
                  onClick={() => navigate(-1)} 
                  style={{ 
                    ...btnStyle, 
                    left: isMobile ? 10 : -60,
                    display: isMobile && builders.length <= 1 ? 'none' : 'block'
                  }}
                >
                  ‹
                </button>
                <button 
                  onClick={() => navigate(1)} 
                  style={{ 
                    ...btnStyle, 
                    right: isMobile ? 10 : -60,
                    display: isMobile && builders.length <= 1 ? 'none' : 'block'
                  }}
                >
                  ›
                </button>
              </>
            )}

            {/* Mobile indicators */}
            {isMobile && builders.length > 1 && (
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
                      background: index === currentSlide 
                        ? 'linear-gradient(135deg, #3498db, #2c3e50)' 
                        : 'rgba(52, 152, 219, 0.3)',
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