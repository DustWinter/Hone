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
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        let incidentsData = [];
        
        if (hasRole(ROLES.TECHNICIEN)) {
          // Technicians see only incidents assigned to them
          incidentsData = await db.incidentsTechniques
            .where('technicien_id')
            .equals(currentUser.id)
            .toArray();
        } else if (hasRole(ROLES.ENSEIGNANT)) {
          // Teachers see only incidents they reported
          incidentsData = await db.incidentsTechniques
            .where('enseignant_id')
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

  // Filter incidents based on search term and status
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && incident.statut.toLowerCase() === filter;
  });

  if (loading) {
    return <div className="fstt-loading ns">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-incidents ns">
      <h1>{t('incidents.title')}</h1>
      
      <div className="fstt-incidents-controls">
        <div className="fstt-search">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="fstt-filter">
          <label htmlFor="status-filter">{t('incidents.status')}:</label>
          <select 
            id="status-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="soumis">{t('incidents.statusPending')}</option>
            <option value="assigné">{t('incidents.statusAssigned')}</option>
            <option value="en cours">{t('incidents.statusInProgress')}</option>
            <option value="résolu">{t('incidents.statusResolved')}</option>
            <option value="clôturé">{t('incidents.statusClosed')}</option>
          </select>
        </div>
      </div>
      
      <div className="fstt-incidents-list">
        {filteredIncidents.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('incidents.id')}</th>
                <th>{t('incidents.description')}</th>
                <th>{t('incidents.priority')}</th>
                <th>{t('incidents.status')}</th>
                <th>{t('incidents.date')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map(incident => (
                <tr key={incident.id}>
                  <td>{incident.id}</td>
                  <td>{incident.description}</td>
                  <td>
                    <span className={`fstt-badge priority-${incident.priorite.toLowerCase()}`}>
                      {incident.priorite}
                    </span>
                  </td>
                  <td>
                    <span className={`fstt-badge status-${incident.statut.toLowerCase().replace(' ', '-')}`}>
                      {incident.statut}
                    </span>
                  </td>
                  <td>{new Date(incident.dateSoumission).toLocaleDateString()}</td>
                  <td>
                    <button className="fstt-btn">
                      {t('common.view')}
                    </button>
                    {hasRole(ROLES.TECHNICIEN) && incident.statut !== 'Résolu' && (
                      <button className="fstt-btn fstt-btn-success">
                        {t('incidents.resolution')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="fstt-empty">{t('common.noData')}</p>
        )}
      </div>
      
      {hasRole(ROLES.ENSEIGNANT) && (
        <div className="fstt-incidents-actions">
          <button className="fstt-btn fstt-btn-primary">
            {t('incidents.reportIncident')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Incidents;
