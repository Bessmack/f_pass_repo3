// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Sign Up States
  const [signUpData, setSignUpData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInLoading(true);
    setSignInError('');

    try {
      const result = await login(signInEmail, signInPassword);
      
      if (!result.success) {
        setSignInError(result.error);
        return;
      }

      // Check if user role matches selected role
      if (result.user.role !== userRole) {
        setSignInError(`Please select the correct role. You are registered as ${result.user.role}.`);
        return;
      }

      // Navigate based on role
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSignInError('An unexpected error occurred. Please try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpLoading(true);
    setSignUpError('');

    // Basic validation
    if (signUpData.password.length < 6) {
      setSignUpError('Password must be at least 6 characters long');
      setSignUpLoading(false);
      return;
    }

    if (!signUpData.first_name || !signUpData.last_name) {
      setSignUpError('First name and last name are required');
      setSignUpLoading(false);
      return;
    }

    try {
      const userData = {
        ...signUpData,
        role: 'user' // Always register as user
      };

      const result = await register(userData);
      
      if (!result.success) {
        setSignUpError(result.error);
        return;
      }

      // Navigate to user dashboard after successful registration
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setSignUpError('An unexpected error occurred. Please try again.');
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="auth-page-container">
        <div className={`auth-slider-wrapper ${isSignUp ? 'slide-to-signup' : ''}`}>
          
          {/* Sign In Card */}
          <div className="auth-card auth-signin-card">
            <div className="auth-card-header">
              <div className="auth-logo-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to manage your transfers</p>
            </div>

            {/* Error Message */}
            {signInError && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #EF4444',
                borderRadius: '8px',
                color: '#DC2626',
                fontSize: '14px'
              }}>
                {signInError}
              </div>
            )}

            {/* Role Selection */}
            <div className="auth-role-selector">
              <button
                type="button"
                className={`auth-role-btn ${userRole === 'user' ? 'auth-role-active' : ''}`}
                onClick={() => setUserRole('user')}
              >
                <span className="auth-role-icon">👤</span>
                <div className="auth-role-info">
                  <div className="auth-role-name">User</div>
                  <div className="auth-role-description">Personal Account</div>
                </div>
              </button>
              <button
                type="button"
                className={`auth-role-btn ${userRole === 'admin' ? 'auth-role-active' : ''}`}
                onClick={() => setUserRole('admin')}
              >
                <span className="auth-role-icon">⚡</span>
                <div className="auth-role-info">
                  <div className="auth-role-name">Admin</div>
                  <div className="auth-role-description">Management Portal</div>
                </div>
              </button>
            </div>

            <form onSubmit={handleSignIn} className="auth-form-wrapper">
              <div className="auth-form-group">
                <label htmlFor="signin-email" className="auth-label">Email Address</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    id="signin-email"
                    className="auth-input"
                    placeholder="Enter your email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    disabled={signInLoading}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signin-password" className="auth-label">Password</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    id="signin-password"
                    className="auth-input"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={signInLoading}
                  />
                </div>
              </div>

              <div className="auth-form-options">
                <label className="auth-checkbox-wrapper">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="auth-checkbox-text">Remember me</span>
                </label>
                <a href="#" className="auth-forgot-link">Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                className="auth-submit-button"
                disabled={signInLoading}
              >
                {signInLoading ? 'Signing In...' : `Sign In as ${userRole === 'admin' ? 'Admin' : 'User'}`}
                <svg className="auth-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <div className="auth-card-footer">
              <p className="auth-footer-text">
                Don't have an account? {' '}
                <a 
                  href="#" 
                  className="auth-footer-link" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setIsSignUp(true);
                    setSignInError('');
                  }}
                >
                  Sign Up
                </a>
              </p>
            </div>

            <div className="auth-security-badge">
              <svg className="auth-security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="auth-security-text">Secured & Encrypted</span>
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="auth-card auth-signup-card">
            <div className="auth-card-header">
              <div className="auth-logo-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join us to manage your transfers</p>
            </div>

            {/* Error Message */}
            {signUpError && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #EF4444',
                borderRadius: '8px',
                color: '#DC2626',
                fontSize: '14px'
              }}>
                {signUpError}
              </div>
            )}

            <form onSubmit={handleSignUp} className="auth-form-wrapper">
              <div className="auth-form-group">
                <label htmlFor="signup-firstname" className="auth-label">First Name</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="signup-firstname"
                    name="first_name"
                    className="auth-input"
                    placeholder="Enter your first name"
                    value={signUpData.first_name}
                    onChange={handleSignUpChange}
                    required
                    disabled={signUpLoading}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-lastname" className="auth-label">Last Name</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="signup-lastname"
                    name="last_name"
                    className="auth-input"
                    placeholder="Enter your last name"
                    value={signUpData.last_name}
                    onChange={handleSignUpChange}
                    required
                    disabled={signUpLoading}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-email" className="auth-label">Email Address</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    className="auth-input"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    required
                    disabled={signUpLoading}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-phone" className="auth-label">Phone Number (Optional)</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    id="signup-phone"
                    name="phone"
                    className="auth-input"
                    placeholder="+1234567890"
                    value={signUpData.phone}
                    onChange={handleSignUpChange}
                    disabled={signUpLoading}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-password" className="auth-label">Password</label>
                <div className="auth-input-container">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    className="auth-input"
                    placeholder="Create a strong password"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    required
                    disabled={signUpLoading}
                    minLength="6"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-button"
                disabled={signUpLoading}
              >
                {signUpLoading ? 'Creating Account...' : 'Create Account'}
                <svg className="auth-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <div className="auth-card-footer">
              <p className="auth-footer-text">
                Already have an account? {' '}
                <a 
                  href="#" 
                  className="auth-footer-link" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setIsSignUp(false);
                    setSignUpError('');
                  }}
                >
                  Sign In
                </a>
              </p>
            </div>

            <div className="auth-security-badge">
              <svg className="auth-security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="auth-security-text">Secured & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;