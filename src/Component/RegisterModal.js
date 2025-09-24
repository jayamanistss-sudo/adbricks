import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from './Apiurl';
import Toast from './Toast';
const RegisterModal = ({ show, onClose, setShowLoginModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    userType: 'user'
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast("Please agree to the terms and conditions.", 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("name", `${formData.firstName} ${formData.lastName}`.trim());
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("password", formData.password);
      formPayload.append("user_type", formData.userType);

      const result = await api("user_register", "POST", formPayload, true);
      showToast(result.message || "Registered successfully!", 'success');
      setTimeout(() => {
        onClose();
        setShowLoginModal(true);
      }, 2000);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Registration failed. Please try again.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '14px 16px',
    border: `2px solid ${focusedField === fieldName ? '#3b82f6' : '#e5e7eb'}`,
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    backgroundColor: focusedField === fieldName ? '#fafbff' : 'white',
    outline: 'none',
    boxSizing: 'border-box'
  });

  const passwordContainerStyle = {
    position: 'relative',
    marginBottom: '20px'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.2s ease'
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
      <Modal show={show} onClose={onClose} title="Create Your Account">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField('')}
              style={inputStyle('firstName')}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField('')}
              style={inputStyle('lastName')}
              placeholder="Last Name"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              style={inputStyle('email')}
              placeholder="Email Address"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField('')}
              style={inputStyle('phone')}
              placeholder="Phone Number"
              required
            />
          </div>

          <div style={passwordContainerStyle}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              style={{
                ...inputStyle('password'),
                paddingRight: '80px'
              }}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                ...passwordToggleStyle,
                ':hover': { color: '#374151' }
              }}
              onMouseEnter={(e) => e.target.style.color = '#374151'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <select
              value={formData.userType}
              onChange={(e) => handleInputChange('userType', e.target.value)}
              onFocus={() => setFocusedField('userType')}
              onBlur={() => setFocusedField('')}
              style={inputStyle('userType')}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
          </div>

          <div style={{
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
            />
            <span>I agree to the Terms & Conditions</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <button type="button" style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }} onClick={(e) => {
              e.preventDefault();
              onClose();
              setShowLoginModal(true);
            }}>
              Sign in
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default RegisterModal;