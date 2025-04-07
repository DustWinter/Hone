import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Students.css';

const Students = () => {
  const { t } = useTranslation();
  const { hasRole, ROLES } = useAuth();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get all students from database
        const studentsData = await db.etudiants.toArray();
        
        // Add additional fields for each student by joining with other data
        const enhancedStudents = await Promise.all(studentsData.map(async student => {
          // Get the person's basic info
          const personne = await db.personnes.get(student.id);
          
          // Get the student's inscriptions/registrations
          const inscriptions = await db.inscriptions
            .where('etudiant_id')
            .equals(student.id)
            .toArray();
          
          // Get program details for each inscription
          const formationCodes = inscriptions.map(ins => ins.formation_code).filter(Boolean);
          let formations = [];
          
          if (formationCodes.length > 0) {
            formations = await db.formations
              .where('code')
              .anyOf(formationCodes)
              .toArray();
          }
          
          // Calculate student level based on registration year
          // This is simplified - in a real app you'd have more complex logic
          const currentYear = new Date().getFullYear();
          const registrationYear = inscriptions.length > 0 
            ? new Date(inscriptions[0].dateInscription).getFullYear() 
            : currentYear;
          const level = currentYear - registrationYear + 1;
          
          return {
            ...student,
            ...personne,
            programme: formations.length > 0 ? formations[0].intitule : 'Non inscrit',
            niveau: `${level}ème année`,
          };
        }));
        
        setStudents(enhancedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by search term
  const filteredStudents = students.filter(student => {
    const fullName = `${student.nom} ${student.prenom}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           (student.appogee && student.appogee.toString().includes(searchLower)) ||
           (student.email && student.email.toLowerCase().includes(searchLower));
  });

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-students ns">
      <h1>{t('students.title')}</h1>
      
      <div className="fstt-students-controls">
        <div className="fstt-search">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {hasRole(ROLES.CHEF_DEPARTEMENT) && (
          <button className="fstt-btn fstt-btn-primary">
            {t('common.add')}
          </button>
        )}
      </div>
      
      <div className="fstt-students-list">
        {filteredStudents.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('students.appogee')}</th>
                <th>{t('students.name')}</th>
                <th>{t('students.program')}</th>
                <th>{t('students.level')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.appogee}</td>
                  <td>{student.nom}</td>
                  <td>{student.programme}</td>
                  <td>{student.niveau}</td>
                  <td>
                    <button className="fstt-btn">
                      {t('common.view')}
                    </button>
                    
                    {hasRole(ROLES.CHEF_DEPARTEMENT) && (
                      <>
                        <button className="fstt-btn fstt-btn-secondary">
                          {t('common.edit')}
                        </button>
                        <button className="fstt-btn fstt-btn-danger">
                          {t('common.delete')}
                        </button>
                      </>
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

export default Students;
