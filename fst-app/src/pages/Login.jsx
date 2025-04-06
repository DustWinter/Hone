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
  const [showExamples, setShowExamples] = useState(false);
  
  // Hardcoded example emails to avoid database issues
  const exampleEmails = [
    { email: 'melbrak@yahoo.fr', role: 'Chef de Département' },
    { email: 'wafaebaida@gmail.com', role: 'Coordinateur' },
    { email: 'lelaachak@uae.ac.ma', role: 'Enseignant' },
    { email: 'elgorrim.mohamed@etu.uae.ac.ma', role: 'Étudiant' },
    { email: 'abenali@uae.ac.ma', role: 'Technicien' }
  ];
  
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
    
    if (!email) {
      setErrorMessage(t('auth.emailRequired'));
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password || 'password');
      if (!result.success) {
        setErrorMessage(result.error || t('auth.loginError'));
      }
    } catch (err) {
      setErrorMessage(err.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };
  
  const setExampleEmail = (exampleEmail) => {
    setEmail(exampleEmail);
    setPassword('password');  // Set a dummy password
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
          <img src="/assets/logo-fst.png" alt="FSTT Logo" className="fstt-login-logo" onError={(e) => e.target.src = '/favicon.ico'} />
          <h1>{t('department.title')}</h1>
          <h2>{t('department.fullName')}</h2>
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
              placeholder="example@uae.ac.ma"
            />
          </div>
          
          <div className="fstt-login-field">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
            />
            <p className="fstt-login-hint">
              {t('auth.demoPasswordHint')}
            </p>
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
          
          <div className="fstt-login-examples">
            <button
              type="button"
              className="fstt-login-examples-toggle"
              onClick={() => setShowExamples(!showExamples)}
            >
              {showExamples ? t('auth.hideExamples') : t('auth.showExamples')}
            </button>
            
            {showExamples && (
              <div className="fstt-login-examples-list">
                <p>{t('auth.clickEmailInstructions')}</p>
                <ul>
                  {exampleEmails.map((example, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => setExampleEmail(example.email)}
                      >
                        <strong>{example.role}:</strong> {example.email}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
        
        <div className="fstt-login-footer">
          <p>Faculté des Sciences et Techniques de Tanger &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
