import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Dashboard.css';

/**
 * Dashboard page component
 * Displays role-specific information and quick actions
 */
const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [stats, setStats] = useState({
    cours: 0,
    etudiants: 0,
    enseignants: 0,
    salles: 0,
    incidents: 0
  });
  
  const [userSpecificData, setUserSpecificData] = useState({
    coursAssigned: [],
    pendingReservations: [],
    pendingIncidents: [],
    recentNotes: [],
    absences: []
  });
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      // Count entities for statistics
      const coursCount = await db.cours.count();
      const etudiantsCount = await db.etudiants.count();
      const enseignantsCount = await db.enseignants.count();
      const sallesCount = await db.sallesCoursLabo.count();
      const incidentsCount = await db.incidentsTechniques.count();
      
      setStats({
        cours: coursCount,
        etudiants: etudiantsCount,
        enseignants: enseignantsCount,
        salles: sallesCount,
        incidents: incidentsCount
      });
    };
    
    fetchStats();
  }, []);
  
  // Fetch user-specific data based on role
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      // Data for teachers
      if (hasRole(ROLES.ENSEIGNANT)) {
        // Get assigned courses
        const enseignant = await db.enseignants.get(currentUser.id);
        if (enseignant && enseignant.cours) {
          const coursData = await db.cours
            .where('id')
            .anyOf(enseignant.cours)
            .toArray();
          
          // Get pending reservations
          const reservations = await db.demandesReservation
            .where('enseignantId')
            .equals(currentUser.id)
            .and(item => item.statut === 'En attente')
            .toArray();
          
          // Get incidents submitted by this teacher
          const incidents = await db.incidentsTechniques
            .where('enseignantId')
            .equals(currentUser.id)
            .toArray();
          
          setUserSpecificData({
            ...userSpecificData,
            coursAssigned: coursData,
            pendingReservations: reservations,
            pendingIncidents: incidents
          });
        }
      }
      
      // Data for students
      if (hasRole(ROLES.ETUDIANT)) {
        // Get recent notes
        const notes = await db.notes
          .where('etudiantId')
          .equals(currentUser.id)
          .toArray();
        
        // Get related evaluations
        if (notes.length > 0) {
          const evaluationIds = [...new Set(notes.map(note => note.evaluationId))];
          const evaluations = await db.evaluations
            .where('id')
            .anyOf(evaluationIds)
            .toArray();
          
          // Combine notes with evaluations
          const notesWithDetails = notes.map(note => {
            const evaluation = evaluations.find(e => e.id === note.evaluationId);
            return {
              ...note,
              evaluation
            };
          });
          
          // Get absences
          const absences = await db.absences
            .where('etudiantId')
            .equals(currentUser.id)
            .toArray();
          
          setUserSpecificData({
            ...userSpecificData,
            recentNotes: notesWithDetails,
            absences
          });
        }
      }
      
      // Data for technicians
      if (hasRole(ROLES.TECHNICIEN)) {
        // Get assigned incidents
        const incidents = await db.incidentsTechniques
          .where('technicienId')
          .equals(currentUser.id)
          .toArray();
        
        setUserSpecificData({
          ...userSpecificData,
          pendingIncidents: incidents
        });
      }
    };
    
    fetchUserData();
  }, [currentUser, hasRole, ROLES]);
  
  // Render specific dashboard sections based on user role
  const renderRoleSpecificContent = () => {
    if (!currentUser) return null;
    
    // Teacher-specific content
    if (hasRole(ROLES.ENSEIGNANT)) {
      return (
        <div className="fstt-dashboard-role-content">
          <div className="fstt-dashboard-card">
            <h3>{t('courses.title')}</h3>
            {userSpecificData.coursAssigned.length > 0 ? (
              <ul className="fstt-dashboard-list">
                {userSpecificData.coursAssigned.map(cours => (
                  <li key={cours.id}>
                    <strong>{cours.code}</strong> - {cours.titre} ({cours.semestre})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fstt-dashboard-empty">{t('common.noData')}</p>
            )}
          </div>
          
          <div className="fstt-dashboard-card">
            <h3>{t('resources.reservations')}</h3>
            {userSpecificData.pendingReservations.length > 0 ? (
              <ul className="fstt-dashboard-list">
                {userSpecificData.pendingReservations.map(reservation => (
                  <li key={reservation.id}>
                    {new Date(reservation.dateReservation).toLocaleDateString()} - 
                    Salle: {reservation.salleId} - Status: {reservation.statut}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fstt-dashboard-empty">{t('common.noData')}</p>
            )}
          </div>
        </div>
      );
    }
    
    // Student-specific content
    if (hasRole(ROLES.ETUDIANT)) {
      return (
        <div className="fstt-dashboard-role-content">
          <div className="fstt-dashboard-card">
            <h3>{t('students.grades')}</h3>
            {userSpecificData.recentNotes.length > 0 ? (
              <ul className="fstt-dashboard-list">
                {userSpecificData.recentNotes.map(note => (
                  <li key={note.id}>
                    {note.evaluation?.matiere}: <strong>{note.valeur}/20</strong> (Coef: {note.coefficient})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fstt-dashboard-empty">{t('common.noData')}</p>
            )}
          </div>
          
          <div className="fstt-dashboard-card">
            <h3>{t('students.absences')}</h3>
            {userSpecificData.absences.length > 0 ? (
              <ul className="fstt-dashboard-list">
                {userSpecificData.absences.map(absence => (
                  <li key={absence.id}>
                    {new Date(absence.date).toLocaleDateString()} - 
                    Cours: {absence.coursId} - 
                    {absence.justifiee ? 
                      <span className="fstt-badge justified">Justifiée</span> : 
                      <span className="fstt-badge not-justified">Non justifiée</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fstt-dashboard-empty">{t('common.noData')}</p>
            )}
          </div>
        </div>
      );
    }
    
    // Technician-specific content
    if (hasRole(ROLES.TECHNICIEN)) {
      return (
        <div className="fstt-dashboard-role-content">
          <div className="fstt-dashboard-card">
            <h3>{t('incidents.title')}</h3>
            {userSpecificData.pendingIncidents.length > 0 ? (
              <ul className="fstt-dashboard-list">
                {userSpecificData.pendingIncidents.map(incident => (
                  <li key={incident.id}>
                    <div><strong>{incident.description}</strong></div>
                    <div>
                      {new Date(incident.dateSoumission).toLocaleDateString()} - 
                      <span className={`fstt-badge priority-${incident.priorite.toLowerCase()}`}>
                        {incident.priorite}
                      </span>
                      <span className={`fstt-badge status-${incident.statut.toLowerCase().replace(' ', '-')}`}>
                        {incident.statut}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fstt-dashboard-empty">{t('common.noData')}</p>
            )}
          </div>
        </div>
      );
    }
    
    // Admin-specific content
    if (hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.COORDINATEUR)) {
      return (
        <div className="fstt-dashboard-role-content">
          <div className="fstt-dashboard-card">
            <h3>Administration</h3>
            <p>Bienvenue dans le panneau d'administration du département.</p>
            <div className="fstt-admin-quick-actions">
              <button className="fstt-btn">Gestion des utilisateurs</button>
              <button className="fstt-btn">Rapports académiques</button>
              <button className="fstt-btn">Configuration du système</button>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  if (!currentUser) return <div>{t('common.loading')}</div>;
  
  return (
    <div className="fstt-dashboard">
      <h1>{t('nav.dashboard')}</h1>
      
      <div className="fstt-dashboard-welcome">
        <h2>{t('dashboard.welcome', { name: currentUser.nom })}</h2>
        <p>{t('dashboard.role')}: {currentUser.role}</p>
      </div>
      
      <div className="fstt-dashboard-stats">
        <div className="fstt-stat-card">
          <h3>{stats.cours}</h3>
          <p>{t('nav.courses')}</p>
        </div>
        
        <div className="fstt-stat-card">
          <h3>{stats.etudiants}</h3>
          <p>{t('nav.students')}</p>
        </div>
        
        <div className="fstt-stat-card">
          <h3>{stats.enseignants}</h3>
          <p>{t('nav.teachers')}</p>
        </div>
        
        <div className="fstt-stat-card">
          <h3>{stats.salles}</h3>
          <p>{t('nav.rooms')}</p>
        </div>
        
        <div className="fstt-stat-card">
          <h3>{stats.incidents}</h3>
          <p>{t('nav.incidents')}</p>
        </div>
      </div>
      
      {renderRoleSpecificContent()}
    </div>
  );
};

export default Dashboard;
