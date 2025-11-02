import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function UserTopNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    navigate('/loggedout');
    setIsProfileOpen(false);
  };

  return (
    <nav className="navbarhome">
      <div className="navbar-container">
        <Link to="/user/dashboard" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="logo-text">F-Pass</span>
        </Link>

        <div className="navbar-actions">
          <button className="icon-button" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge">2</span>
          </button>

          <div className="profile-dropdown">
            <button className="profile-button" onClick={toggleProfile}>
              <div className="profile-avatar">
                <span>JD</span>
              </div>
              <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="dropdown-menu" style={{ zIndex: 1001 }}>
                <div className="dropdown-header">
                  <div className="profile-avatar-large">
                    <span>JD</span>
                  </div>
                  <div className="profile-info">
                    <p className="profile-name">John Doe</p>
                    <p className="profile-email">john.doe@email.com</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link 
                  to="/user/profile" 
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </Link>
                <Link 
                  to="/user/wallet" 
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>My Wallet</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item dropdown-dark-mode" onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
                <div className="dropdown-divider"></div>
                <a onClick={handleLogout} className="dropdown-item logout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UserTopNavbar;