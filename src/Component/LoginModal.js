import React, { useState } from 'react';
import Modal from './Modal';
import api from './Apiurl';
import Toast from './Toast';

const LoginModal = ({ show, onClose, setShowRegisterModal }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '', rememberMe: false });
  const [forgotData, setForgotData] = useState({ emailOrPhone: '', otp: '', newPassword: '' });
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: '', type: 'info' });

  const handleInputChange = (field, value, isForgotScreen = false) => {
    if (isForgotScreen) {
      setForgotData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("email_or_phone", formData.emailOrPhone);
      payload.append("password", formData.password);
      const result = await api("user_login", "POST", payload, true);
      if (result.status === 200) {
        localStorage.setItem("userDetails", JSON.stringify(result.data));
        setShowRegisterModal(false);
        showToast(result.message || "Login successful!", "success");
        onClose();
        window.location.reload();
      } else {
        showToast(result.message || "Login failed. Please try again.", "error");
      }
    } catch (err) {
      showToast(err.message || "Login failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!forgotData.emailOrPhone) {
      showToast("Please enter your email or phone", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("email_or_phone", forgotData.emailOrPhone);
      const result = await api("send_otp", "POST", payload, true);
      if (result.status === 200) {
        showToast(result.message || "OTP sent successfully!", "success");
        setStep(2);
      } else {
        showToast(result.message || "Failed to send OTP.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to send OTP.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!forgotData.otp || !forgotData.newPassword) {
      showToast("Please enter OTP and new password", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("email_or_phone", forgotData.emailOrPhone);
      payload.append("otp", forgotData.otp);
      payload.append("new_password", forgotData.newPassword);
      const result = await api("update_password", "POST", payload, true);
      if (result.status === 200) {
        showToast(result.message || "Password updated successfully!", "success");
        setTimeout(() => setStep(0), 2000);
      } else {
        showToast(result.message || "Failed to update password.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to update password.", "error");
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

  const submitButtonStyle = (isLoading) => ({
    width: '100%',
    padding: '14px',
    background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <>
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
      <Modal show={show} onClose={onClose} title={step === 0 ? "Welcome Back" : step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Set New Password"}>
        {step === 0 && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label>Email or Phone</label>
              <input
                type="text"
                value={formData.emailOrPhone}
                onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                onFocus={() => setFocusedField('emailOrPhone')}
                onBlur={() => setFocusedField('')}
                style={inputStyle('emailOrPhone')}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                style={inputStyle('password')}
                required
              />
            </div>
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.rememberMe} onChange={(e) => handleInputChange('rememberMe', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }} /> Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '14px', cursor: 'pointer' }} onClick={() => setStep(1)}>Forgot password?</button>
            </div>
            <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>{isLoading ? 'Signing in...' : 'Sign In'}</button>
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
              Don't have an account? <button type="button" style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setShowRegisterModal(true)}>Sign up</button>
            </div>
          </form>
        )}
        {step === 1 && (
          <form onSubmit={sendOtp}>
            <div style={{ marginBottom: '24px' }}>
              <label>Email</label>
              <input type="text" value={forgotData.emailOrPhone} onChange={(e) => handleInputChange('emailOrPhone', e.target.value, true)} onFocus={() => setFocusedField('forgotEmail')} onBlur={() => setFocusedField('')} style={inputStyle('forgotEmail')} required />
            </div>
            <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>Send OTP</button>
            <div style={{ marginTop: '16px', textAlign: 'center', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setStep(0)}>Back to Login</div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={updatePassword}>
            <div style={{ marginBottom: '24px' }}>
              <label>OTP</label>
              <input type="text" value={forgotData.otp} onChange={(e) => handleInputChange('otp', e.target.value, true)} onFocus={() => setFocusedField('otp')} onBlur={() => setFocusedField('')} style={inputStyle('otp')} required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>New Password</label>
              <input type="password" value={forgotData.newPassword} onChange={(e) => handleInputChange('newPassword', e.target.value, true)} onFocus={() => setFocusedField('newPassword')} onBlur={() => setFocusedField('')} style={inputStyle('newPassword')} required />
            </div>
            <button type="submit" disabled={isLoading} style={submitButtonStyle(isLoading)}>Update Password</button>
            <div style={{ marginTop: '16px', textAlign: 'center', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setStep(1)}>Back</div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default LoginModal;
