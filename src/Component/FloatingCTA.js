import React from 'react';

const FloatingCTA = ({ showFloatingCTA, setShowPostPropertyModal }) => {
  return (
    <button
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#e74c3c',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
        animation: 'pulse 2s infinite',
        zIndex: 1000,
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.3s ease',
        transform: showFloatingCTA ? 'translateX(0)' : 'translateX(100%)',
        opacity: showFloatingCTA ? 1 : 0
      }}
      onClick={() => setShowPostPropertyModal(true)}
    >
      <i className="fas fa-plus"></i> Post Property
    </button>
  );
};

export default FloatingCTA;