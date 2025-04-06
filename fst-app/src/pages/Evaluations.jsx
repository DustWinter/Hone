import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Evaluations.css';

/**
 * Evaluations page component
 * Manages course evaluations, grades input, and academic decisions
 */
const Evaluations = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    value: '',
    coefficient: 1,
    type: 'Examen'
  });
  
  // Modal states
  const [showModal, setShowModal] = useState({
    newEvaluation: false,
    enterGrades: false,
    validateCourse: false,
    studentDetails: false
  });
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  // Form for new evaluations
  const [evaluationForm, setEvaluationForm] = useState({
    type: 'Examen',
    date: new Date().toISOString().split('T')[0],
    matiere: '',
    description: ''
  });
  
  // Fetch courses based on user role
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let coursesData = [];
        
        if (hasRole(ROLES.ENSEIGNANT)) {
          // Get assigned courses for teacher
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
        else if (hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.COORDINATEUR) || hasRole(ROLES.ADMIN)) {
          // All courses for admin roles
          coursesData = await db.cours.toArray();
        }
        
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [currentUser, hasRole, ROLES]);
  
  // Fetch students and evaluations when a course is selected
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!selectedCourse) return;
      
      try {
        setLoading(true);
        
        // For demo purposes, we'll fetch all students
        // In a real app, you'd filter by course enrollment
        const studentsData = await db.etudiants.toArray();
        
        // Enhance with person data
        const enhancedStudents = await Promise.all(
          studentsData.map(async (student) => {
            const personData = await db.personnes.get(student.id);
            return {
              ...student,
              nom: personData?.nom || 'Unknown'
            };
          })
        );
        
        setStudents(enhancedStudents);
        
        // Fetch evaluations for this course
        const evaluationsData = await db.evaluations
          .where('cours_code')
          .equals(selectedCourse.code)
          .toArray();
        
        setEvaluations(evaluationsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [selectedCourse]);
  
  // Handle course selection
  const handleCourseSelect = (courseCode) => {
    const course = courses.find(c => c.code === courseCode);
    setSelectedCourse(course);
  };
  
  // Handle student selection for entering grades
  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s.id === parseInt(studentId));
    setSelectedStudent(student);
    setShowModal({...showModal, studentDetails: true});
  };
  
  // Handle evaluation selection for entering grades
  const handleEvaluationSelect = (evaluationId) => {
    const evaluation = evaluations.find(e => e.id === parseInt(evaluationId));
    setSelectedEvaluation(evaluation);
    setShowModal({...showModal, enterGrades: true});
  };
  
  // Handle form input changes
  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Create a new evaluation
  const handleCreateEvaluation = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) return;
    
    try {
      const newEvaluation = {
        type: evaluationForm.type,
        date: new Date(evaluationForm.date),
        matiere: evaluationForm.matiere || selectedCourse.titre,
        cours_code: selectedCourse.code
      };
      
      const evaluationId = await db.evaluations.add(newEvaluation);
      
      // Add the new evaluation to state
      setEvaluations([
        ...evaluations, 
        { ...newEvaluation, id: evaluationId }
      ]);
      
      // Reset form and close modal
      setEvaluationForm({
        type: 'Examen',
        date: new Date().toISOString().split('T')[0],
        matiere: '',
        description: ''
      });
      
      setShowModal({...showModal, newEvaluation: false});
    } catch (error) {
      console.error('Error creating evaluation:', error);
      alert(t('common.error'));
    }
  };
  
  // Submit a grade for a student
  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    
    if (!selectedEvaluation || !gradeForm.studentId) return;
    
    try {
      const noteValue = parseFloat(gradeForm.value);
      
      if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
        alert(t('evaluations.gradeValidationError'));
        return;
      }
      
      const newGrade = {
        valeur: noteValue,
        coefficient: parseFloat(gradeForm.coefficient) || 1,
        evaluation_id: selectedEvaluation.id,
        etudiant_id: parseInt(gradeForm.studentId)
      };
      
      // Check if a grade already exists for this student and evaluation
      const existingGrade = await db.notes
        .where({evaluation_id: selectedEvaluation.id, etudiant_id: parseInt(gradeForm.studentId)})
        .first();
      
      let gradeId;
      if (existingGrade) {
        // Update existing grade
        gradeId = existingGrade.id;
        await db.notes.update(gradeId, newGrade);
      } else {
        // Create new grade
        gradeId = await db.notes.add(newGrade);
      }
      
      // Reset form
      setGradeForm({
        studentId: '',
        value: '',
        coefficient: 1,
        type: 'Examen'
      });
      
      // Show success message
      alert(t('evaluations.gradeSavedSuccess'));
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert(t('common.error'));
    }
  };
  
  // Calculate the average grade for a student
  const calculateAverage = async (studentId, courseCode) => {
    try {
      // Get all evaluations for this course
      const courseEvaluations = await db.evaluations
        .where('cours_code')
        .equals(courseCode)
        .toArray();
      
      // Get all grades for this student in these evaluations
      const evaluationIds = courseEvaluations.map(e => e.id);
      
      const grades = await db.notes
        .where('etudiant_id')
        .equals(parseInt(studentId))
        .toArray();
      
      // Filter grades for the relevant evaluations
      const relevantGrades = grades.filter(grade => 
        evaluationIds.includes(grade.evaluation_id)
      );
      
      // Calculate weighted average
      if (relevantGrades.length === 0) {
        return null; // No grades yet
      }
      
      const totalWeightedValue = relevantGrades.reduce((sum, grade) => {
        return sum + (grade.valeur * grade.coefficient);
      }, 0);
      
      const totalCoefficients = relevantGrades.reduce((sum, grade) => {
        return sum + grade.coefficient;
      }, 0);
      
      if (totalCoefficients === 0) return 0;
      
      return totalWeightedValue / totalCoefficients;
    } catch (error) {
      console.error('Error calculating average:', error);
      return null;
    }
  };
  
  // Validate course for a student
  const validateCourse = async (studentId, courseCode, isValidated = true) => {
    try {
      // Create deliberation record
      const deliberationData = {
        date: new Date(),
        statut: isValidated ? 'Validé' : 'Non Validé',
        administration_id: null // In a real app, this would be set by admin
      };
      
      const deliberationId = await db.deliberations.add(deliberationData);
      
      // Associate the deliberation with the student and course
      await db.deliberationsEvaluations.add({
        deliberation_id: deliberationId,
        evaluation_id: evaluations[0]?.id // Using the first evaluation as a reference
      });
      
      // Update student status
      await db.etudiantsStatuts.put({
        etudiant_id: parseInt(studentId),
        cours_code: courseCode,
        statut: isValidated ? 'Validé' : 'Non Validé',
        date_validation: new Date()
      });
      
      // Show success message
      alert(isValidated ? 
        t('evaluations.courseValidatedSuccess') : 
        t('evaluations.courseNotValidatedSuccess'));
      
      return true;
    } catch (error) {
      console.error('Error validating course:', error);
      alert(t('common.error'));
      return false;
    }
  };
  
  // Handle suggesting retake or repeat
  const suggestRetakeOrRepeat = async (studentId, courseCode, suggestion) => {
    try {
      // Create a suggestion record
      await db.suggestions.add({
        etudiant_id: parseInt(studentId),
        cours_code: courseCode,
        suggestion,
        date: new Date(),
        enseignant_id: currentUser.id
      });
      
      // Show success message
      alert(t('evaluations.suggestionSubmitted'));
      return true;
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert(t('common.error'));
      return false;
    }
  };
  
  // Student details modal
  const StudentDetailsModal = () => {
    if (!selectedStudent) return null;
    
    const [average, setAverage] = useState(null);
    const [studentGrades, setStudentGrades] = useState([]);
    
    useEffect(() => {
      const fetchStudentData = async () => {
        try {
          // Calculate average
          const avg = await calculateAverage(selectedStudent.id, selectedCourse.code);
          setAverage(avg);
          
          // Get all grades for this student
          if (selectedCourse) {
            const courseEvaluations = await db.evaluations
              .where('cours_code')
              .equals(selectedCourse.code)
              .toArray();
              
            const evaluationIds = courseEvaluations.map(e => e.id);
            
            const grades = await db.notes
              .where('etudiant_id')
              .equals(selectedStudent.id)
              .toArray();
              
            // Filter and enhance grades
            const enhancedGrades = await Promise.all(
              grades
                .filter(grade => evaluationIds.includes(grade.evaluation_id))
                .map(async (grade) => {
                  const evaluation = courseEvaluations.find(e => e.id === grade.evaluation_id);
                  return {
                    ...grade,
                    evaluationType: evaluation ? evaluation.type : 'Unknown',
                    evaluationDate: evaluation ? evaluation.date : null
                  };
                })
            );
            
            setStudentGrades(enhancedGrades);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      };
      
      fetchStudentData();
    }, [selectedStudent, selectedCourse]);
    
    return (
      <div className={`fstt-modal ${showModal.studentDetails ? 'show' : ''}`}>
        <div className="fstt-modal-content">
          <div className="fstt-modal-header">
            <h3>{selectedStudent.nom}</h3>
            <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, studentDetails: false})}>×</button>
          </div>
          <div className="fstt-modal-body">
            <div className="fstt-student-detail-header">
              <p><strong>{t('students.appogee')}:</strong> {selectedStudent.appogee}</p>
              {average !== null && (
                <p className="fstt-student-average">
                  <strong>{t('evaluations.average')}:</strong> 
                  <span className={average >= 10 ? 'passing' : 'failing'}>
                    {average.toFixed(2)}/20
                  </span>
                </p>
              )}
            </div>
            
            <h4>{t('evaluations.grades')}</h4>
            {studentGrades.length > 0 ? (
              <table className="fstt-table">
                <thead>
                  <tr>
                    <th>{t('evaluations.type')}</th>
                    <th>{t('evaluations.date')}</th>
                    <th>{t('evaluations.grade')}</th>
                    <th>{t('evaluations.coefficient')}</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.map(grade => (
                    <tr key={grade.id}>
                      <td>{grade.evaluationType}</td>
                      <td>{grade.evaluationDate ? new Date(grade.evaluationDate).toLocaleDateString() : '-'}</td>
                      <td className={grade.valeur >= 10 ? 'passing' : 'failing'}>{grade.valeur}/20</td>
                      <td>{grade.coefficient}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t('common.noData')}</p>
            )}
            
            <div className="fstt-student-actions">
              <h4>{t('evaluations.actions')}</h4>
              <div className="fstt-button-group">
                <button 
                  className="fstt-btn fstt-btn-success"
                  onClick={() => validateCourse(selectedStudent.id, selectedCourse.code, true)}
                >
                  {t('evaluations.validateCourse')}
                </button>
                <button 
                  className="fstt-btn fstt-btn-danger"
                  onClick={() => validateCourse(selectedStudent.id, selectedCourse.code, false)}
                >
                  {t('evaluations.invalidateCourse')}
                </button>
              </div>
              
              <div className="fstt-button-group">
                <button 
                  className="fstt-btn fstt-btn-warning"
                  onClick={() => suggestRetakeOrRepeat(selectedStudent.id, selectedCourse.code, 'Rattrapage')}
                >
                  {t('evaluations.suggestRetake')}
                </button>
                <button 
                  className="fstt-btn fstt-btn-warning"
                  onClick={() => suggestRetakeOrRepeat(selectedStudent.id, selectedCourse.code, 'Redoublement')}
                >
                  {t('evaluations.suggestRepeat')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // New evaluation modal
  const NewEvaluationModal = () => (
    <div className={`fstt-modal ${showModal.newEvaluation ? 'show' : ''}`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('evaluations.newEvaluation')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, newEvaluation: false})}>×</button>
        </div>
        <div className="fstt-modal-body">
          <form onSubmit={handleCreateEvaluation}>
            <div className="fstt-form-group">
              <label htmlFor="type">{t('evaluations.type')}</label>
              <select
                id="type"
                name="type"
                value={evaluationForm.type}
                onChange={(e) => handleInputChange(e, setEvaluationForm)}
                required
              >
                <option value="Examen">{t('evaluations.exam')}</option>
                <option value="Contrôle">{t('evaluations.test')}</option>
                <option value="TP">{t('evaluations.practicalWork')}</option>
                <option value="Projet">{t('evaluations.project')}</option>
              </select>
            </div>
            
            <div className="fstt-form-group">
              <label htmlFor="date">{t('evaluations.date')}</label>
              <input
                type="date"
                id="date"
                name="date"
                value={evaluationForm.date}
                onChange={(e) => handleInputChange(e, setEvaluationForm)}
                required
              />
            </div>
            
            <div className="fstt-form-group">
              <label htmlFor="matiere">{t('evaluations.subject')}</label>
              <input
                type="text"
                id="matiere"
                name="matiere"
                value={evaluationForm.matiere}
                onChange={(e) => handleInputChange(e, setEvaluationForm)}
                placeholder={selectedCourse ? selectedCourse.titre : ''}
              />
            </div>
            
            <div className="fstt-form-group">
              <label htmlFor="description">{t('evaluations.description')}</label>
              <textarea
                id="description"
                name="description"
                value={evaluationForm.description}
                onChange={(e) => handleInputChange(e, setEvaluationForm)}
                rows="3"
              />
            </div>
            
            <div className="fstt-form-actions">
              <button type="button" className="fstt-btn" onClick={() => setShowModal({...showModal, newEvaluation: false})}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="fstt-btn fstt-btn-primary">
                {t('common.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  // Enter grades modal
  const EnterGradesModal = () => {
    if (!selectedEvaluation) return null;
    
    return (
      <div className={`fstt-modal ${showModal.enterGrades ? 'show' : ''}`}>
        <div className="fstt-modal-content">
          <div className="fstt-modal-header">
            <h3>{t('evaluations.enterGrades')} - {selectedEvaluation.type}</h3>
            <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, enterGrades: false})}>×</button>
          </div>
          <div className="fstt-modal-body">
            <form onSubmit={handleSubmitGrade}>
              <div className="fstt-form-group">
                <label htmlFor="studentId">{t('students.student')}</label>
                <select
                  id="studentId"
                  name="studentId"
                  value={gradeForm.studentId}
                  onChange={(e) => handleInputChange(e, setGradeForm)}
                  required
                >
                  <option value="">{t('common.select')}</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.nom}</option>
                  ))}
                </select>
              </div>
              
              <div className="fstt-form-group">
                <label htmlFor="value">{t('evaluations.grade')} (0-20)</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  min="0"
                  max="20"
                  step="0.5"
                  value={gradeForm.value}
                  onChange={(e) => handleInputChange(e, setGradeForm)}
                  required
                />
              </div>
              
              <div className="fstt-form-group">
                <label htmlFor="coefficient">{t('evaluations.coefficient')}</label>
                <input
                  type="number"
                  id="coefficient"
                  name="coefficient"
                  min="1"
                  max="5"
                  step="1"
                  value={gradeForm.coefficient}
                  onChange={(e) => handleInputChange(e, setGradeForm)}
                  required
                />
              </div>
              
              <div className="fstt-form-actions">
                <button type="button" className="fstt-btn" onClick={() => setShowModal({...showModal, enterGrades: false})}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="fstt-btn fstt-btn-primary">
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  // Validate course modal for final deliberations
  const ValidateCourseModal = () => (
    <div className={`fstt-modal ${showModal.validateCourse ? 'show' : ''}`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('evaluations.validateCourseTitle')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, validateCourse: false})}>×</button>
        </div>
        <div className="fstt-modal-body">
          <p>{t('evaluations.validateCourseDescription')}</p>
          
          <div className="fstt-form-actions">
            <button className="fstt-btn" onClick={() => setShowModal({...showModal, validateCourse: false})}>
              {t('common.cancel')}
            </button>
            <button 
              className="fstt-btn fstt-btn-primary"
              onClick={async () => {
                // In a real app, this would run validation for all students
                alert(t('evaluations.notImplementedYet'));
                setShowModal({...showModal, validateCourse: false});
              }}
            >
              {t('evaluations.validate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (loading && !courses.length) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }
  
  return (
    <div className="fstt-evaluations">
      <h1>{t('evaluations.title')}</h1>
      
      <div className="fstt-evaluations-header">
        <div className="fstt-course-selector">
          <label htmlFor="course-select">{t('evaluations.selectCourse')}</label>
          <select
            id="course-select"
            value={selectedCourse ? selectedCourse.code : ''}
            onChange={(e) => handleCourseSelect(e.target.value)}
          >
            <option value="">{t('common.select')}</option>
            {courses.map(course => (
              <option key={course.code} value={course.code}>
                {course.titre} ({course.code})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedCourse ? (
        <div className="fstt-evaluations-content">
          <div className="fstt-course-info">
            <h2>{selectedCourse.titre}</h2>
            <p>{t('courses.code')}: {selectedCourse.code}</p>
            <p>{t('courses.semester')}: {selectedCourse.semestre}</p>
          </div>
          
          <div className="fstt-evaluations-sections">
            <div className="fstt-section">
              <div className="fstt-section-header">
                <h3>{t('evaluations.evaluations')}</h3>
                <button 
                  className="fstt-btn fstt-btn-sm fstt-btn-primary"
                  onClick={() => setShowModal({...showModal, newEvaluation: true})}
                >
                  {t('evaluations.addEvaluation')}
                </button>
              </div>
              
              <div className="fstt-evaluations-list">
                {evaluations.length > 0 ? (
                  <table className="fstt-table">
                    <thead>
                      <tr>
                        <th>{t('evaluations.type')}</th>
                        <th>{t('evaluations.date')}</th>
                        <th>{t('evaluations.subject')}</th>
                        <th>{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluations.map(evaluation => (
                        <tr key={evaluation.id}>
                          <td>{evaluation.type}</td>
                          <td>{new Date(evaluation.date).toLocaleDateString()}</td>
                          <td>{evaluation.matiere}</td>
                          <td>
                            <button 
                              className="fstt-btn fstt-btn-sm fstt-btn-primary"
                              onClick={() => handleEvaluationSelect(evaluation.id)}
                            >
                              {t('evaluations.enterGrades')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="fstt-empty-state">{t('evaluations.noEvaluations')}</p>
                )}
              </div>
            </div>
            
            <div className="fstt-section">
              <div className="fstt-section-header">
                <h3>{t('students.title')}</h3>
                <div className="fstt-search">
                  <input type="text" placeholder={t('common.search')} />
                </div>
              </div>
              
              <div className="fstt-students-list">
                {students.length > 0 ? (
                  <table className="fstt-table">
                    <thead>
                      <tr>
                        <th>{t('students.appogee')}</th>
                        <th>{t('students.name')}</th>
                        <th>{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id}>
                          <td>{student.appogee}</td>
                          <td>{student.nom}</td>
                          <td>
                            <button 
                              className="fstt-btn fstt-btn-sm"
                              onClick={() => handleStudentSelect(student.id)}
                            >
                              {t('common.details')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="fstt-empty-state">{t('common.noData')}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="fstt-evaluations-actions">
            <button 
              className="fstt-btn fstt-btn-primary"
              onClick={() => setShowModal({...showModal, validateCourse: true})}
            >
              {t('evaluations.finalizeDeliberation')}
            </button>
          </div>
        </div>
      ) : (
        <div className="fstt-select-course-prompt">
          <p>{t('evaluations.selectCoursePrompt')}</p>
        </div>
      )}
      
      {/* Modals */}
      <NewEvaluationModal />
      <EnterGradesModal />
      <StudentDetailsModal />
      <ValidateCourseModal />
    </div>
  );
};

export default Evaluations;
