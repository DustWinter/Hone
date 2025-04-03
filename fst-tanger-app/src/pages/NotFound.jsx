import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFound.css';

/**
 * NotFound page component
 * Displayed when a user navigates to an invalid route
 */
const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="fstt-not-found">
      <div className="fstt-not-found-content">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link to="/" className="fstt-btn fstt-btn-primary">
          Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
