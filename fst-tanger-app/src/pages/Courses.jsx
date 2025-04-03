import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Courses.css';

/**
 * Courses page component
 * Displays and manages courses information
 */
const Courses = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch courses based on user role
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let coursesData = [];
        
        // Teachers see only their assigned courses
        if (hasRole(ROLES.ENSEIGNANT)) {
          const enseignant = await db.enseignants.get(currentUser.id);
          if (enseignant && enseignant.cours) {
            coursesData = await db.cours
              .where('id')
              .anyOf(enseignant.cours)
              .toArray();
          }
        } 
        // Admins see all courses
        else if (hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.COORDINATEUR)) {
          coursesData = await db.cours.toArray();
        }
        
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [currentUser, hasRole, ROLES]);
  
  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }
  
  return (
    <div className="fstt-courses">
      <h1>{t('nav.courses')}</h1>
      
      <div className="fstt-courses-list">
        {courses.length > 0 ? (
          <table className="fstt-table">
            <thead>
              <tr>
                <th>{t('courses.code')}</th>
                <th>{t('courses.title')}</th>
                <th>{t('courses.semester')}</th>
                <th>{t('courses.credits')}</th>
                <th>{t('courses.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.titre}</td>
                  <td>{course.semestre}</td>
                  <td>{course.credits}</td>
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

export default Courses;
