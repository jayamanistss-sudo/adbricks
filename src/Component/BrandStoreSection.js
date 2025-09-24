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

  const builders = Array.from(new Map((data?.data || []).map(item => [item.id || item.name, item])).values());

  const navigate = dir => setCurrentSlide(prev => (prev + dir + builders.length) % builders.length);

  useEffect(() => {
    if (!isAutoPlaying || !builders.length) return;
    const timer = setInterval(() => navigate(1), 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentSlide, builders.length]);

  const getCards = () => builders.length ? [...Array(Math.min(3, builders.length))].map((_, i) => ({
    ...builders[(currentSlide + i) % builders.length],
    pos: i
  })) : [];

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
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: pos === 1 ? '0 30px 60px rgba(0,0,0,0.25)' : '0 20px 40px rgba(0,0,0,0.15)',
    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(52, 152, 219, 0.2)',
    width: '380px',
    transform: `scale(${pos === 1 ? 1.1 : 1}) translateY(${pos === 1 ? '-15px' : '0'}) rotateY(${pos === 0 ? '8deg' : pos === 2 ? '-8deg' : '0'})`,
    zIndex: pos === 1 ? 20 : 10
  });

  const btnStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(135deg, white, #f8fafc)',
    border: '2px solid rgba(52, 152, 219, 0.3)',
    borderRadius: '50%',
    width: '55px',
    height: '55px',
    fontSize: '24px',
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
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{ padding: '80px 0', background: 'linear-gradient(180deg, #f8fafc, white)', position: 'relative' }}
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <h2 style={{ fontSize: '3rem', background: 'linear-gradient(135deg, #2c3e50, #3498db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '15px', fontWeight: '800' }}>
            Brand Store
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Premium verified builders with exclusive project deals
          </p>
        </div>

        {!builders.length ? (
          <div style={{ textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: '#94a3b8', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: '20px' }}>
            No brands available
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', padding: '20px 0' }}>
              {getCards().map((builder, idx) => (
                <div key={`${builder.id}-${idx}`} style={cardStyle(builder.pos)}>
                  <div style={{
                    height: '200px',
                    position: 'relative',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {builder.logo_url && !imageErrors.has(builder.id) ? (
                      <img
                        src={builder.logo_url}
                        alt={builder.name || 'Brand logo'}
                        onError={() => handleImageError(builder.id)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          transition: 'transform 0.3s ease'
                        }}
                        onLoad={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        onLoadStart={(e) => {
                          e.target.style.opacity = '0';
                          e.target.style.transition = 'opacity 0.3s ease';
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
                        fontSize: '1.2rem',
                        fontWeight: '600'
                      }}>
                        {builder.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))' }} />
                    <span style={{ position: 'absolute', top: 15, right: 15, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                      ✓ Verified
                    </span>
                  </div>

                  <div style={{ padding: '25px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '12px', background: 'linear-gradient(135deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {builder.name}
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem', lineHeight: '1.6', minHeight: '48px' }}>
                      {truncateText(builder.description)}
                    </p>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3498db, #2c3e50)',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        color: 'white',
                        fontSize: '0.95rem',
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
                <button onClick={() => navigate(-1)} style={{ ...btnStyle, left: -60 }}>‹</button>
                <button onClick={() => navigate(1)} style={{ ...btnStyle, right: -60 }}>›</button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandStoreSection;