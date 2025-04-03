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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await db.etudiants.toArray();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-students">
      <h1>{t('nav.students')}</h1>
      
      <div className="fstt-students-list">
        {students.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('students.id')}</th>
                <th>{t('students.name')}</th>
                <th>{t('students.program')}</th>
                <th>{t('students.level')}</th>
                <th>{t('students.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.nom} {student.prenom}</td>
                  <td>{student.programme}</td>
                  <td>{student.niveau}</td>
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

export default Students;
