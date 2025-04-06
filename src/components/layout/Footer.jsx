import { useTranslation } from 'react-i18next';
import './Footer.css';

/**
 * Footer component for the FST Tanger application
 * Styled according to FSTT's official website
 */
const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="fstt-footer">
      <div className="fstt-footer-content">
        <div className="fstt-footer-logo">
          <img src="/src/assets/fstt-logo.png" alt="FST Tanger" />
        </div>
        
        <div className="fstt-footer-info">
          <p>© {new Date().getFullYear()} - {t('app.subtitle')}</p>
          <p>{t('department.title')}</p>
        </div>
        
        <div className="fstt-footer-contact">
          <p>BP 416, Tanger Principale, Tanger, Maroc</p>
          <p>Tel: +212 (0)5 39 39 39 54 / 55</p>
          <p>Fax: +212 (0)5 39 39 39 53</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
