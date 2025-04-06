import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

/**
 * Language toggle component for switching between French and Arabic
 */
const LanguageToggle = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };
  
  return (
    <button 
      className="fstt-language-toggle" 
      onClick={toggleLanguage} 
      title={i18n.language === 'fr' ? 'العربية' : 'Français'}
      aria-label="Toggle language"
    >
      {i18n.language === 'fr' ? 'العربية' : 'FR'}
    </button>
  );
};

export default LanguageToggle;
