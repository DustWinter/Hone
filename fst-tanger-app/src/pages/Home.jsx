import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Home.css';

/**
 * Home page component - the landing page for the application
 * Showcases department information and quick access to key features
 */
const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  // Département data from static configuration
  const departmentInfo = db.constructor.département;
  
  return (
    <div className="fstt-home">
      <section className="fstt-hero">
        <div className="fstt-hero-content">
          <h1>{t('department.title')}</h1>
          <p className="fstt-subtitle">{t('app.subtitle')}</p>
          
          {!currentUser ? (
            <Link to="/login" className="fstt-btn fstt-btn-primary">
              {t('auth.login')}
            </Link>
          ) : (
            <Link to="/dashboard" className="fstt-btn fstt-btn-primary">
              {t('nav.dashboard')}
            </Link>
          )}
        </div>
      </section>
      
      <section className="fstt-department-section">
        <h2>{t('department.title')}</h2>
        
        <div className="fstt-department-card">
          <div className="fstt-department-info">
            <h3>{t('department.chief')}</h3>
            <p>{departmentInfo.chef}</p>
            <p><a href={`mailto:${departmentInfo.contact}`}>{departmentInfo.contact}</a></p>
          </div>
          
          <div className="fstt-department-programs">
            <h3>{t('department.programs')}</h3>
            <ul>
              {departmentInfo.formations.map((formation, index) => (
                <li key={index}>{formation}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      <section className="fstt-features-section">
        <h2>{t('app.title')}</h2>
        
        <div className="fstt-features-grid">
          <div className="fstt-feature-card">
            <div className="fstt-feature-icon courses-icon"></div>
            <h3>{t('courses.title')}</h3>
            <p>Gestion des cours, chapitres, et séances</p>
          </div>
          
          <div className="fstt-feature-card">
            <div className="fstt-feature-icon students-icon"></div>
            <h3>{t('students.title')}</h3>
            <p>Gestion des étudiants, inscriptions, et notes</p>
          </div>
          
          <div className="fstt-feature-card">
            <div className="fstt-feature-icon resources-icon"></div>
            <h3>{t('resources.title')}</h3>
            <p>Gestion des salles et réservations</p>
          </div>
          
          <div className="fstt-feature-card">
            <div className="fstt-feature-icon incidents-icon"></div>
            <h3>{t('incidents.title')}</h3>
            <p>Suivi des incidents techniques</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
