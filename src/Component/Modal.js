import React, { useState } from 'react';

const Modal = ({ show, onClose, title, children, size = '' }) => {
  if (!show) return null;
     
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        backdropFilter: 'blur(4px)',
        animation: 'modalFadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: size === 'large' ? '800px' : '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 32px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            margin: 0,
            color: '#1a1a1a',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              color: '#666',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              lineHeight: '1'
            }}
            onMouseOver={e => {
              e.target.style.background = '#f5f5f5';
              e.target.style.color = '#333';
            }}
            onMouseOut={e => {
              e.target.style.background = 'none';
              e.target.style.color = '#666';
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;