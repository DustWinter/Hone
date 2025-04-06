import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

/**
 * Settings page component
 * Allows users to customize their experience
 */
const Settings = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    language: i18n.language || 'fr',
    theme: theme || 'light',
    notifications: true,
    emailNotifications: false,
    autoSave: true,
    denseMode: false,
    fontSize: 'medium'
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);
  
  // Handle settings changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSettings({
      ...settings,
      [name]: newValue
    });
    
    // Apply specific settings immediately
    if (name === 'language') {
      i18n.changeLanguage(value);
      document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
    } else if (name === 'theme') {
      setTheme(value);
    }
  };
  
  // Save settings to localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem('user_settings', JSON.stringify(settings));
      alert(t('settings.savedSuccess'));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t('settings.savedError'));
    }
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    const defaultSettings = {
      language: 'fr',
      theme: 'light',
      notifications: true,
      emailNotifications: false,
      autoSave: true,
      denseMode: false,
      fontSize: 'medium'
    };
    
    setSettings(defaultSettings);
    i18n.changeLanguage(defaultSettings.language);
    document.documentElement.dir = defaultSettings.language === 'ar' ? 'rtl' : 'ltr';
    setTheme(defaultSettings.theme);
    
    try {
      localStorage.setItem('user_settings', JSON.stringify(defaultSettings));
      alert(t('settings.resetSuccess'));
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert(t('settings.resetError'));
    }
  };

  return (
    <div className="fstt-settings">
      <h1>{t('nav.settings')}</h1>
      
      <div className="fstt-settings-container">
        <div className="fstt-settings-section">
          <h2>{t('settings.appearance')}</h2>
          
          <div className="fstt-setting-item">
            <label htmlFor="language">{t('settings.language')}</label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          
          <div className="fstt-setting-item">
            <label htmlFor="theme">{t('settings.theme')}</label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="light">{t('settings.lightTheme')}</option>
              <option value="dark">{t('settings.darkTheme')}</option>
              <option value="system">{t('settings.systemTheme')}</option>
            </select>
          </div>
          
          <div className="fstt-setting-item">
            <label htmlFor="fontSize">{t('settings.fontSize')}</label>
            <select
              id="fontSize"
              name="fontSize"
              value={settings.fontSize}
              onChange={handleChange}
            >
              <option value="small">{t('settings.small')}</option>
              <option value="medium">{t('settings.medium')}</option>
              <option value="large">{t('settings.large')}</option>
            </select>
          </div>
          
          <div className="fstt-setting-item fstt-setting-checkbox">
            <input
              type="checkbox"
              id="denseMode"
              name="denseMode"
              checked={settings.denseMode}
              onChange={handleChange}
            />
            <label htmlFor="denseMode">{t('settings.denseMode')}</label>
          </div>
        </div>
        
        <div className="fstt-settings-section">
          <h2>{t('settings.notifications')}</h2>
          
          <div className="fstt-setting-item fstt-setting-checkbox">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            <label htmlFor="notifications">{t('settings.enableNotifications')}</label>
          </div>
          
          <div className="fstt-setting-item fstt-setting-checkbox">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
            <label htmlFor="emailNotifications">{t('settings.emailNotifications')}</label>
          </div>
        </div>
        
        <div className="fstt-settings-section">
          <h2>{t('settings.behavior')}</h2>
          
          <div className="fstt-setting-item fstt-setting-checkbox">
            <input
              type="checkbox"
              id="autoSave"
              name="autoSave"
              checked={settings.autoSave}
              onChange={handleChange}
            />
            <label htmlFor="autoSave">{t('settings.autoSave')}</label>
          </div>
        </div>
        
        {currentUser && (
          <div className="fstt-settings-section">
            <h2>{t('settings.account')}</h2>
            
            <div className="fstt-user-info">
              <div className="fstt-user-avatar">
                {currentUser.nom.charAt(0).toUpperCase()}
              </div>
              <div className="fstt-user-details">
                <h3>{currentUser.nom}</h3>
                <p>{currentUser.email}</p>
                <span className="fstt-badge">{currentUser.role}</span>
              </div>
            </div>
            
            <div className="fstt-settings-account-actions">
              <button className="fstt-btn fstt-btn-secondary">
                {t('settings.changePassword')}
              </button>
              <button className="fstt-btn">
                {t('settings.exportData')}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="fstt-settings-actions">
        <button className="fstt-btn" onClick={resetSettings}>
          {t('settings.resetDefaults')}
        </button>
        <button className="fstt-btn fstt-btn-primary" onClick={saveSettings}>
          {t('common.save')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
