import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import './Header.css';

/**
 * Header component for the application
 * @param {Object} props Component props
 * @param {Function} props.toggleSidebar Function to toggle sidebar state
 */
const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Function to toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // Function to close dropdown when an item is clicked
  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  
  return (
    <header className="fstt-header ns">
      <div className="fstt-header-start ns">
        <button 
          className="fstt-menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <img 
            src="https://img.icons8.com/ios-filled/50/ffffff/menu--v1.png" 
            alt="Menu" 
            className="fstt-menu-icon"
            width="24" 
            height="24" 
          />
        </button>
      </div>
      <Link to="/" className="ns" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="fstt-header-title" style={{ fontFamily: 'Roboto, sans-serif' }} >
          <h1>{t('department.title')}</h1>
        </div>
      </Link>
      
      <div className="fstt-header-end">
        <ThemeToggle />
        <LanguageToggle />
        
        {currentUser ? (
          <div className={`fstt-user-dropdown ${dropdownOpen ? 'active' : ''}`}>
            <button 
              className="fstt-user-button" 
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <span className="fstt-user-avatar">
                {currentUser.nom?.charAt(0)}
              </span>
            </button>
            
            <div className="fstt-dropdown-content">
              <div className="fstt-dropdown-header">
                <span className="fstt-dropdown-name">{currentUser.nom}</span>
                <span className="fstt-dropdown-role">{currentUser.role}</span>
              </div>
              
              <Link 
                to="/profile" 
                className="fstt-dropdown-item" 
                onClick={closeDropdown}
              >
                <svg className="fstt-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {t('nav.profile')}
              </Link>
              
              <Link 
                to="/settings" 
                className="fstt-dropdown-item" 
                onClick={closeDropdown}
              >
                <svg className="fstt-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                {t('nav.settings')}
              </Link>
              
              <button 
                onClick={() => {
                  logout();
                  closeDropdown();
                }} 
                className="fstt-dropdown-item fstt-logout"
              >
                <svg className="fstt-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                {t('nav.logout')}
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="fstt-login-link">
            <svg className="fstt-login-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span className="fstt-login-text">{t('nav.login')}</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
