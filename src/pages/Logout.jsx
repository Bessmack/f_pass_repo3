import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Foot from '../components/Footer';

function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    // Simulate logout process
    const timer = setTimeout(() => {
      setIsLoggingOut(false);
      // Add your actual logout logic here
      // e.g., clear tokens, redirect to login, etc.
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    // Navigate back to dashboard or previous page
    console.log('Going back to dashboard');
    navigate('/admin/dashboard');
  };

  const handleLoginAgain = () => {
    // Navigate to login page
    console.log('Redirecting to login');
    navigate('/');
  };

  const navigate = useNavigate();

  if (isLoggingOut) {
    return (
      <div className="logout-container">
        <div className="logout-card logging-out">
          <div className="logout-spinner">
            <svg viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
            </svg>
          </div>
          <h2>Logging you out...</h2>
          <p>Please wait while we securely end your session</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-icon-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        
        <h1>You've Been Logged Out</h1>
        <p className="logout-message">
          Your session has been securely ended. Thank you for using our money transfer service!
        </p>

        <div className="logout-info-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <h3>Your account is secure</h3>
            <p>All your data has been safely protected and your session ended properly.</p>
          </div>
        </div>

        <div className="logout-actions">
          <button className="btn-primary" onClick={handleLoginAgain}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            Login Again
          </button>
        </div>

        <div className="logout-footer">
          <p className="footer-text">© 2025 MoneyTransfer. All rights reserved.</p>
        </div>
      </div>
    </div>
    <Foot/>
    </>
  );
}

export default Logout;