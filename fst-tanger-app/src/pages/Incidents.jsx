import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Incidents.css';

const Incidents = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        let incidentsData = [];
        
        if (hasRole(ROLES.TECHNICIEN)) {
          // Technicians see only incidents assigned to them
          incidentsData = await db.incidentsTechniques
            .where('technicienId')
            .equals(currentUser.id)
            .toArray();
        } else if (hasRole(ROLES.ENSEIGNANT)) {
          // Teachers see only incidents they reported
          incidentsData = await db.incidentsTechniques
            .where('enseignantId')
            .equals(currentUser.id)
            .toArray();
        } else {
          // Admins see all incidents
          incidentsData = await db.incidentsTechniques.toArray();
        }
        
        setIncidents(incidentsData);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [currentUser, hasRole, ROLES]);

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-incidents">
      <h1>{t('nav.incidents')}</h1>
      
      <div className="fstt-incidents-list">
        {incidents.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('incidents.id')}</th>
                <th>{t('incidents.description')}</th>
                <th>{t('incidents.priority')}</th>
                <th>{t('incidents.status')}</th>
                <th>{t('incidents.date')}</th>
                <th>{t('incidents.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(incident => (
                <tr key={incident.id}>
                  <td>{incident.id}</td>
                  <td>{incident.description}</td>
                  <td>
                    <span className={`fstt-badge priority-${incident.priorite.toLowerCase()}`}>
                      {incident.priorite}
                    </span>
                  </td>
                  <td>
                    <span className={`fstt-badge status-${incident.statut.toLowerCase()}`}>
                      {incident.statut}
                    </span>
                  </td>
                  <td>{new Date(incident.dateSoumission).toLocaleDateString()}</td>
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

export default Incidents;
