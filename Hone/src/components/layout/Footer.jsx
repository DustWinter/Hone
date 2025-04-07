import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';


/**
 * Footer component
 */
const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="fstt-footer">
      <div className="fstt-footer-content">
        <div className="fstt-footer-logo ns">
          <img
            src='/assets/logo-fst.png'
            alt="FST Tanger"
          />
        </div>
        
        <div className="fstt-footer-column ns">
          <h3>{t('department.title')}</h3>
          <ul className="fstt-footer-links">
            <li><Link to="/courses">{t('nav.courses')}</Link></li>
            <li><Link to="/students">{t('nav.students')}</Link></li>
            <li><Link to="/deliberations">{t('nav.deliberations')}</Link></li>
            <li><Link to="/internships">{t('nav.internships')}</Link></li>
          </ul>
        </div>
        
        <div className="fstt-footer-column ns">
          <h3>{t('resources.title')}</h3>
          <ul className="fstt-footer-links">
            <li><Link to="/resources">{t('resources.rooms')}</Link></li>
            <li><Link to="/incidents">{t('nav.incidents')}</Link></li>
            <li><Link to="/schedule">{t('nav.schedule')}</Link></li>
          </ul>
        </div>
        
        <div className="fstt-footer-column">
          <h3 className='ns'>{t('department.contact')}</h3>
          <div className="fstt-footer-contact">
            <p>
              <span className="fstt-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              +212 539 39 39 54
            </p>
            <p>
              <span className="fstt-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              dept-info@fstt.ac.ma
            </p>
            <p>
              <span className="fstt-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              FST de Tanger, Ancienne Route de l'Aéroport, Km 10, Ziaten. BP 416. Tanger
            </p>
          </div>
          
          <div className="fstt-footer-social">
            <a href="https://www.facebook.com/fstt.ac.ma/?locale=fr_FR" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/school/fsttanger" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://www.youtube.com/@FST_TANGER" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="fstt-footer-bottom">
        <p>© {currentYear} {t('department.fullName')} - {t('department.university')}</p>
      </div>
    </footer>
  );
};

export default Footer;
