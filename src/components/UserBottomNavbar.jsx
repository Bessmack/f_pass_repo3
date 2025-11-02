import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function UserBottomNavbar() {
  const location = useLocation();

  const navItems = [
    {
      path: '/user/dashboard',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="bottom-nav__icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      path: '/user/wallet',
      label: 'Wallet',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="bottom-nav__icon">
          <path d="M22 2L11 13M22 2l-7 20-9-9-4 20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      path: '/user/transactions',
      label: 'Transactions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="bottom-nav__icon">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="2" width="8" height="4" rx="1" strokeWidth="2" />
        </svg>
      )
    },
    {
      path: '/user/contacts',
      label: 'Contacts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="bottom-nav__icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeWidth="2" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav" id="userBottomNavigation">
        <div className="bottom-nav__container">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav__item ${isActive(item.path) ? 'bottom-nav__item--active' : ''}`}
              aria-label={item.label}
            >
              <div className="bottom-nav__icon-wrapper">
                {item.icon}
                {isActive(item.path) && (
                  <div className="bottom-nav__indicator" />
                )}
              </div>
              <span className="bottom-nav__label">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default UserBottomNavbar;