import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/admin/dashboard" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="logo-text">F-Pass</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/admin/dashboard" 
            className={`nav-link ${isActive('/admin/dashboard')}`}
            title="Overview"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Overview</span>
          </Link>
          <Link 
            to="/admin/dashboard/transactions" 
            className={`nav-link ${isActive('/admin/dashboard/transactions')}`}
            title="Transactions"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            <span>Transactions</span>
          </Link>
          <Link 
            to="/admin/dashboard/users" 
            className={`nav-link ${isActive('/admin/dashboard/users')}`}
            title="Users"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Users</span>
          </Link>
          <Link 
            to="/admin/dashboard/wallets" 
            className={`nav-link ${isActive('/admin/dashboard/wallets')}`}
            title="Wallets"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span>Wallets</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <button className="icon-button" aria-label="Notifications" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge">3</span>
          </button>

          {/* Profile Dropdown */}
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
              <div className="dropdown-menu">
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
                  to="/admin/profile" 
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </Link>
                <div className="dropdown-divider"></div>
                {/* Dark Mode Toggle in Dropdown */}
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

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;