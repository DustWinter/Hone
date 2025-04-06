import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

/**
 * Language toggle component
 * Switches between available languages
 */
const LanguageToggle = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
    
    // Set text direction based on language
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button 
      className="language-toggle-btn"
      onClick={toggleLanguage}
      aria-label={i18n.language === 'fr' ? 'Switch to Arabic' : 'Passer au français'}
    >
      {i18n.language === 'fr' ? 'العربية' : 'FR'}
    </button>
  );
};

export default LanguageToggle;
