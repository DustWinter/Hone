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
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Fetch courses based on user role
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let coursesData = [];
        
        // Teachers see only their assigned courses
        if (hasRole(ROLES.ENSEIGNANT)) {
          // Get courses assigned to this teacher
          const enseignantCourses = await db.enseignantsCours
            .where('enseignant_id')
            .equals(currentUser.id)
            .toArray();
          
          if (enseignantCourses.length > 0) {
            const coursesCodes = enseignantCourses.map(ec => ec.cours_code);
            coursesData = await db.cours
              .where('code')
              .anyOf(coursesCodes)
              .toArray();
          }
        } 
        // Students see courses they're enrolled in through their programs
        else if (hasRole(ROLES.ETUDIANT)) {
          // Get student's program
          const inscriptions = await db.inscriptions
            .where('etudiant_id')
            .equals(currentUser.id)
            .toArray();
          
          if (inscriptions.length > 0) {
            // For simplicity, just get all courses for now
            // In a real app, you would filter by the program and semester
            coursesData = await db.cours.toArray();
          }
        }
        // Admins see all courses
        else {
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
  
  // Filter and search courses
  const filteredCourses = courses.filter(course => {
    // Apply search term
    const matchesSearch = course.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply filters
    if (filter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && course.semestre === filter;
    }
  });
  
  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }
  
  return (
    <div className="fstt-courses ns">
      <h1>{t('courses.title')}</h1>
      
      <div className="fstt-courses-controls">
        <div className="fstt-search">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="fstt-filter">
          <label htmlFor="semester-filter">{t('courses.semesterFilter')}</label>
          <select 
            id="semester-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            <option value="S4">S4</option>
            <option value="S5">S5</option>
            <option value="S6">S6</option>
          </select>
        </div>
      </div>
      
      <div className="fstt-courses-list">
        {filteredCourses.length > 0 ? (
          <div className="fstt-courses-grid">
            {filteredCourses.map(course => (
              <div key={course.code} className="fstt-course-card">
                <div className="fstt-course-header">
                  <span className="fstt-course-code">{course.code}</span>
                  <span className="fstt-course-semester">{course.semestre}</span>
                </div>
                <h3 className="fstt-course-title">{course.titre}</h3>
                <div className="fstt-course-footer">
                  <span className="fstt-course-year">{course.annee}</span>
                  <button className="fstt-btn fstt-btn-sm">
                    {t('common.details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="fstt-empty">{t('common.noData')}</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
