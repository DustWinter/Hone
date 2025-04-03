import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Deliberations.css';

const Deliberations = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [deliberations, setDeliberations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliberations = async () => {
      try {
        let deliberationsData = [];
        
        if (hasRole(ROLES.ENSEIGNANT)) {
          // Teachers see only deliberations for their courses
          const enseignant = await db.enseignants.get(currentUser.id);
          if (enseignant && enseignant.cours) {
            deliberationsData = await db.deliberations
              .where('coursId')
              .anyOf(enseignant.cours)
              .toArray();
          }
        } else if (hasRole(ROLES.ETUDIANT)) {
          // Students see only their own deliberations
          const inscriptions = await db.inscriptions
            .where('etudiantId')
            .equals(currentUser.id)
            .toArray();
          
          if (inscriptions.length > 0) {
            const coursIds = inscriptions.map(i => i.coursId);
            deliberationsData = await db.deliberations
              .where('coursId')
              .anyOf(coursIds)
              .toArray();
          }
        } else {
          // Admins see all deliberations
          deliberationsData = await db.deliberations.toArray();
        }
        
        setDeliberations(deliberationsData);
      } catch (error) {
        console.error('Error fetching deliberations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliberations();
  }, [currentUser, hasRole, ROLES]);

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-deliberations">
      <h1>{t('nav.deliberations')}</h1>
      
      <div className="fstt-deliberations-list">
        {deliberations.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('deliberations.course')}</th>
                <th>{t('deliberations.session')}</th>
                <th>{t('deliberations.date')}</th>
                <th>{t('deliberations.result')}</th>
                <th>{t('deliberations.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {deliberations.map(deliberation => (
                <tr key={deliberation.id}>
                  <td>{deliberation.coursId}</td>
                  <td>{deliberation.session}</td>
                  <td>{new Date(deliberation.dateDeliberation).toLocaleDateString()}</td>
                  <td>
                    <span className={`fstt-badge result-${deliberation.resultat.toLowerCase()}`}>
                      {deliberation.resultat}
                    </span>
                  </td>
                  <td>
                    <button className="fstt-btn">
                      {t('common.view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="fstt-empty">{t('common.noData')}</p>
        )}
      </div>
    </div>
  );
};

export default Deliberations;
