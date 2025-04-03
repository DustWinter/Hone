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

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-resources">
      <h1>{t('nav.resources')}</h1>
      
      <div className="fstt-resources-list">
        {resources.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('resources.id')}</th>
                <th>{t('resources.type')}</th>
                <th>{t('resources.capacity')}</th>
                <th>{t('resources.status')}</th>
                <th>{t('resources.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource.id}</td>
                  <td>{resource.type}</td>
                  <td>{resource.capacite}</td>
                  <td>
                    <span className={`fstt-badge status-${resource.statut ? resource.statut.toLowerCase() : 'unknown'}`}>
                      {resource.statut || t('common.unknown')}
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

export default Resources;
