import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Resources.css';

const Resources = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesData = await db.sallesCoursLabo.toArray();
        setResources(resourcesData);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on search term and filter value
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      (resource.nomSalle && resource.nomSalle.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (resource.id && resource.id.toLowerCase().includes(searchTerm.toLowerCase()));
      
    if (filter === 'all') {
      return matchesSearch;
    } else if (filter === 'available') {
      return matchesSearch && resource.disponibilite === true;
    } else if (filter === 'unavailable') {
      return matchesSearch && resource.disponibilite === false;
    }
    return matchesSearch;
  });

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-resources">
      <h1>{t('resources.title')}</h1>
      
      <div className="fstt-resources-controls">
        <div className="fstt-search">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="fstt-filter">
          <label htmlFor="availability-filter">{t('resources.availability')}:</label>
          <select 
            id="availability-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="available">{t('resources.available')}</option>
            <option value="unavailable">{t('resources.unavailable')}</option>
          </select>
        </div>
      </div>
      
      <div className="fstt-resources-list">
        {filteredResources.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('resources.id')}</th>
                <th>{t('resources.roomName')}</th>
                <th>{t('resources.capacity')}</th>
                <th>{t('resources.availability')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource.id}</td>
                  <td>{resource.nomSalle}</td>
                  <td>{resource.capacite}</td>
                  <td>
                    <span className={`fstt-badge ${resource.disponibilite ? 'status-available' : 'status-unavailable'}`}>
                      {resource.disponibilite ? t('resources.available') : t('resources.unavailable')}
                    </span>
                  </td>
                  <td>
                    <button className="fstt-btn">
                      {t('common.view')}
                    </button>
                    {hasRole(ROLES.ENSEIGNANT) && (
                      <button className="fstt-btn fstt-btn-secondary">
                        {t('resources.requestReservation')}
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
    </div>
  );
};

export default Resources;
