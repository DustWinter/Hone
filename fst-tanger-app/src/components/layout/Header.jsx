import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/image.png';
import './Header.css';

/**
 * Header component for the FST Tanger application
 * Styled according to FSTT's official website
 */
const Header = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
    // For RTL support with Arabic
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="fstt-header">
      <div className="fstt-header-top">
        <div className="fstt-logo-container">
          <Link to="/">
            <img src={logo} alt="FST Tanger Logo" className="fstt-logo fstt-logo-large" />
          </Link>
          <h1>{t('department.title')}</h1>
        </div>
        
        <div className="fstt-header-actions">
          <button onClick={toggleLanguage} className="fstt-lang-toggle">
            {i18n.language === 'fr' ? 'العربية' : 'Français'}
          </button>
          
          {currentUser ? (
            <div className="fstt-user-menu">
              <span className="fstt-user-name">{currentUser.nom}</span>
              <button className="fstt-btn fstt-btn-logout" onClick={logout}>
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="fstt-btn fstt-btn-login">
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
      
      <div className="fstt-header-nav">
        <button className="fstt-menu-toggle" onClick={toggleSidebar}>
          <span className="fstt-menu-icon"></span>
        </button>
        
        <nav className="fstt-main-nav">
          <ul>
            <li>
              <Link to="/">{t('nav.home')}</Link>
            </li>
            {currentUser && (
              <>
                <li>
                  <Link to="/dashboard">{t('nav.dashboard')}</Link>
                </li>
                <li>
                  <Link to="/courses">{t('nav.courses')}</Link>
                </li>
                <li>
                  <Link to="/students">{t('nav.students')}</Link>
                </li>
                <li>
                  <Link to="/resources">{t('nav.rooms')}</Link>
                </li>
                <li>
                  <Link to="/incidents">{t('nav.incidents')}</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
