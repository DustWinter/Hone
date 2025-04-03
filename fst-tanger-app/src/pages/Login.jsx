import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

/**
 * Login page component
 * Handles user authentication using JWT
 */
const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, currentUser, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage(t('auth.fieldsRequired'));
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.error || t('auth.loginError'));
      }
    } catch (err) {
      setErrorMessage(err.message || t('auth.loginError'));
    }
    
    setLoading(false);
  };
  
  return (
    <div className="fstt-login-container">
      <div className="fstt-login-language">
        <button onClick={toggleLanguage} className="fstt-login-lang-toggle">
          {i18n.language === 'fr' ? 'العربية' : 'Français'}
        </button>
      </div>
      
      <div className="fstt-login-card">
        <div className="fstt-login-header">
          <img src="/src/assets/image.png" alt="FSTT Logo" className="fstt-login-logo" />
          <h1>{t('app.title')}</h1>
          <h2>{t('app.subtitle')}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="fstt-login-form">
          <div className="fstt-login-field">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="fstt-login-field">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {errorMessage && (
            <div className="fstt-login-error">
              {errorMessage}
            </div>
          )}
          
          <button 
            type="submit" 
            className="fstt-login-button" 
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.loginButton')}
          </button>
          
          <a href="#" className="fstt-login-forgot">
            {t('auth.forgotPassword')}
          </a>
        </form>
        
        <div className="fstt-login-footer">
          <p>Faculté des Sciences et Techniques de Tanger &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
