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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDeliberations = async () => {
      try {
        let deliberationsData = [];
        
        if (hasRole(ROLES.ENSEIGNANT)) {
          // Teachers see deliberations for their courses
          const enseignantCourses = await db.enseignantsCours
            .where('enseignant_id')
            .equals(currentUser.id)
            .toArray();
          
          if (enseignantCourses.length > 0) {
            const coursesCodes = enseignantCourses.map(ec => ec.cours_code);
            
            // For each course, find related deliberations
            // This is a simplified approach - in a real app, you'd have direct relations
            deliberationsData = await db.deliberations.toArray();
            
            // We'll just use all deliberations for this demo since 
            // we don't have direct course-deliberation connections
          }
        } else if (hasRole(ROLES.ETUDIANT)) {
          // Students see only their own deliberations
          // In a real app, we'd need to join with course registrations
          deliberationsData = await db.deliberations.toArray();
        } else {
          // Admins see all deliberations
          deliberationsData = await db.deliberations.toArray();
        }
        
        // Add course information for display
        const enhancedData = await Promise.all(deliberationsData.map(async (delib) => {
          // In a real app, we'd join with course data
          // For now, we'll use dummy data
          return {
            ...delib,
            coursId: `COURSE-${Math.floor(Math.random() * 1000)}`,
            session: `Session ${Math.floor(Math.random() * 3) + 1} - ${new Date().getFullYear()}`,
            dateDeliberation: delib.date || new Date(),
            resultat: Math.random() > 0.5 ? 'Validé' : 'Non Validé'
          };
        }));
        
        setDeliberations(enhancedData);
      } catch (error) {
        console.error('Error fetching deliberations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliberations();
  }, [currentUser, hasRole, ROLES]);

  // Filter deliberations by search term
  const filteredDeliberations = deliberations.filter(deliberation => {
    return (
      deliberation.coursId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliberation.session.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-deliberations ns">
      <h1>{t('deliberations.title')}</h1>
      
      <div className="fstt-deliberations-controls">
        <div className="fstt-search">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="fstt-deliberations-list">
        {filteredDeliberations.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('deliberations.course')}</th>
                <th>{t('deliberations.session')}</th>
                <th>{t('deliberations.date')}</th>
                <th>{t('deliberations.result')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliberations.map(deliberation => (
                <tr key={deliberation.id}>
                  <td>{deliberation.coursId}</td>
                  <td>{deliberation.session}</td>
                  <td>{new Date(deliberation.dateDeliberation).toLocaleDateString()}</td>
                  <td>
                    <span className={`fstt-badge result-${deliberation.resultat.toLowerCase().replace(' ', '-')}`}>
                      {deliberation.resultat}
                    </span>
                  </td>
                  <td>
                    <button className="fstt-btn">
                      {t('common.view')}
                    </button>
                    
                    {hasRole(ROLES.CHEF_DEPARTEMENT) && (
                      <button className="fstt-btn fstt-btn-success">
                        {t('deliberations.validate')}
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

export default Deliberations;
