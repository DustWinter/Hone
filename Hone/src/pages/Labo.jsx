import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
// Import Icons component but we'll use emoji fallbacks
import { Icons } from '../components/common/Icons';
import './Labo.css';

const Labo = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  // States
  const [projects, setProjects] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [projectFilter, setProjectFilter] = useState('all');
  const [isChefLabo, setIsChefLabo] = useState(false);
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  
  // Form states
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
  
  useEffect(() => {
    // Check if user is Chef de Labo
    setIsChefLabo(hasRole(ROLES.CHEF_LABO));
    
    // Fetch projects and time slots
    fetchProjects();
    fetchTimeSlots();
  }, [hasRole, ROLES.CHEF_LABO]);
  
  const fetchProjects = () => {
    // Mock data for projects
    const mockProjects = [
      { id: 1, name: 'Smart Agriculture System', status: 'ongoing', description: 'Development of IoT-based agriculture monitoring system', participants: ['John Doe', 'Jane Smith'], startDate: '2023-01-15', endDate: '2023-06-30' },
      { id: 2, name: 'Computer Vision for Security', status: 'finished', description: 'Advanced security system using computer vision and AI', participants: ['Robert Johnson', 'Emily Brown'], startDate: '2022-08-01', endDate: '2023-02-28' },
      { id: 3, name: 'Renewable Energy Optimization', status: 'ongoing', description: 'Algorithms for optimizing renewable energy consumption', participants: ['Michael Wilson', 'Sarah Davis'], startDate: '2023-03-10', endDate: '2023-12-15' },
      { id: 4, name: 'Blockchain Data Management', status: 'dropped', description: 'Secure data management system using blockchain technology', participants: ['David Miller', 'Lisa Anderson'], startDate: '2022-11-20', endDate: '2023-04-30' },
    ];
    
    setProjects(mockProjects);
  };
  
  const fetchTimeSlots = () => {
    // Mock data for time slots
    const mockTimeSlots = [
      { id: 1, date: '2023-10-20', startTime: '09:00', endTime: '12:00', lab: 'Lab A', bookedBy: 'Michael Wilson', project: 'Renewable Energy Optimization' },
      { id: 2, date: '2023-10-21', startTime: '14:00', endTime: '17:00', lab: 'Lab B', bookedBy: 'John Doe', project: 'Smart Agriculture System' },
      { id: 3, date: '2023-10-23', startTime: '10:00', endTime: '13:00', lab: 'Lab A', bookedBy: null, project: null },
      { id: 4, date: '2023-10-24', startTime: '13:00', endTime: '16:00', lab: 'Lab C', bookedBy: null, project: null },
    ];
    
    setTimeSlots(mockTimeSlots);
  };
  
  const handleCreateProject = () => {
    setCurrentProject(null);
    setShowProjectModal(true);
  };
  
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setShowProjectModal(true);
  };
  
  const handleDeleteProject = (projectId) => {
    if (window.confirm(t('labo.confirmDeleteProject'))) {
      setProjects(projects.filter(project => project.id !== projectId));
    }
  };
  
  const handleCreateTimeSlot = () => {
    setCurrentTimeSlot(null);
    setShowTimeSlotModal(true);
  };
  
  const handleEditTimeSlot = (timeSlot) => {
    setCurrentTimeSlot(timeSlot);
    setShowTimeSlotModal(true);
  };
  
  const handleDeleteTimeSlot = (timeSlotId) => {
    if (window.confirm(t('labo.confirmDeleteTimeSlot'))) {
      setTimeSlots(timeSlots.filter(timeSlot => timeSlot.id !== timeSlotId));
    }
  };
  
  const handleRequestTimeSlot = (timeSlot) => {
    setCurrentTimeSlot(timeSlot);
    setShowRequestModal(true);
  };
  
  const handleManageMaterials = () => {
    setShowMaterialModal(true);
  };
  
  const filteredProjects = projectFilter === 'all' 
    ? projects 
    : projects.filter(project => project.status === projectFilter);
  
  return (
    <div className="fstt-labo ns">
      <h1>{t('labo.title')}</h1>
      
      {/* Welcome Section */}
      <div className="fstt-labo-welcome">
        <h2>{t('labo.welcome')}</h2>
        <p>{t('labo.welcomeMessage')}</p>
      </div>
      
      {/* Quick Actions */}
      {isChefLabo && (
        <div className="fstt-labo-quick-actions">
          <button className="fstt-btn fstt-btn-primary" onClick={handleCreateProject}>
            ➕ {t('labo.newProject')}
          </button>
          <button className="fstt-btn fstt-btn-secondary" onClick={handleCreateTimeSlot}>
            📅 {t('labo.newTimeSlot')}
          </button>
          <button className="fstt-btn fstt-btn-accent" onClick={handleManageMaterials}>
            🔧 {t('labo.manageMaterials')}
          </button>
        </div>
      )}
      
      {/* Projects Section */}
      <div className="fstt-labo-section">
        <div className="fstt-labo-section-header">
          <h2>{t('labo.projects')}</h2>
          <div className="fstt-labo-filters">
            <button 
              className={`fstt-labo-filter ${projectFilter === 'all' ? 'active' : ''}`}
              onClick={() => setProjectFilter('all')}
            >
              {t('labo.allProjects')}
            </button>
            <button 
              className={`fstt-labo-filter ${projectFilter === 'ongoing' ? 'active' : ''}`}
              onClick={() => setProjectFilter('ongoing')}
            >
              {t('labo.ongoingProjects')}
            </button>
            <button 
              className={`fstt-labo-filter ${projectFilter === 'finished' ? 'active' : ''}`}
              onClick={() => setProjectFilter('finished')}
            >
              {t('labo.finishedProjects')}
            </button>
            <button 
              className={`fstt-labo-filter ${projectFilter === 'dropped' ? 'active' : ''}`}
              onClick={() => setProjectFilter('dropped')}
            >
              {t('labo.droppedProjects')}
            </button>
          </div>
        </div>
        
        <div className="fstt-labo-projects">
          {filteredProjects.length === 0 ? (
            <div className="fstt-labo-empty">{t('labo.noProjects')}</div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} className="fstt-labo-project-card">
                <div className="fstt-labo-project-header">
                  <h3>{project.name}</h3>
                  <span className={`fstt-labo-status fstt-labo-status-${project.status}`}>
                    {t(`labo.status.${project.status}`)}
                  </span>
                </div>
                <p className="fstt-labo-project-description">{project.description}</p>
                <div className="fstt-labo-project-details">
                  <div className="fstt-labo-project-dates">
                    <div><strong>{t('labo.startDate')}:</strong> {project.startDate}</div>
                    <div><strong>{t('labo.endDate')}:</strong> {project.endDate}</div>
                  </div>
                  <div className="fstt-labo-project-participants">
                    <strong>{t('labo.participants')}:</strong>
                    <ul>
                      {project.participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {isChefLabo && (
                  <div className="fstt-labo-project-actions">
                    <button className="fstt-btn fstt-btn-text" onClick={() => handleEditProject(project)}>
                      ✏️ {t('common.edit')}
                    </button>
                    <button className="fstt-btn fstt-btn-text fstt-btn-danger" onClick={() => handleDeleteProject(project.id)}>
                      🗑️ {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Time Slots Section */}
      <div className="fstt-labo-section">
        <h2>{t('labo.timeSlots')}</h2>
        <div className="fstt-labo-time-slots">
          {timeSlots.length === 0 ? (
            <div className="fstt-labo-empty">{t('labo.noTimeSlots')}</div>
          ) : (
            <table className="fstt-labo-table">
              <thead>
                <tr>
                  <th>{t('labo.date')}</th>
                  <th>{t('labo.time')}</th>
                  <th>{t('labo.lab')}</th>
                  <th>{t('labo.status')}</th>
                  <th>{t('labo.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot.id} className={slot.bookedBy ? 'booked' : 'available'}>
                    <td>{slot.date}</td>
                    <td>{slot.startTime} - {slot.endTime}</td>
                    <td>{slot.lab}</td>
                    <td>
                      {slot.bookedBy ? (
                        <span className="fstt-labo-status fstt-labo-status-booked">
                          {t('labo.booked')} ({slot.project})
                        </span>
                      ) : (
                        <span className="fstt-labo-status fstt-labo-status-available">
                          {t('labo.available')}
                        </span>
                      )}
                    </td>
                    <td>
                      {isChefLabo ? (
                        <>
                          <button className="fstt-btn fstt-btn-text" onClick={() => handleEditTimeSlot(slot)}>
                            ✏️ {t('common.edit')}
                          </button>
                          <button className="fstt-btn fstt-btn-text fstt-btn-danger" onClick={() => handleDeleteTimeSlot(slot.id)}>
                            🗑️ {t('common.delete')}
                          </button>
                        </>
                      ) : (
                        !slot.bookedBy && (
                          <button className="fstt-btn fstt-btn-text" onClick={() => handleRequestTimeSlot(slot)}>
                            📅 {t('labo.requestTimeSlot')}
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Modals would be implemented here */}
      
    </div>
  );
};

export default Labo;
