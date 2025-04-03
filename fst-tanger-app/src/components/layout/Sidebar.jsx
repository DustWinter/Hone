import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import db from '../../utils/db';
import './Sidebar.css';

/**
 * Sidebar navigation component
 * Provides role-based menu items following FSTT design
 */
const Sidebar = ({ isOpen }) => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  if (!currentUser) return null;

  // Get department info safely
  const department = db.département || {};

  return (
    <aside className={`fstt-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="fstt-sidebar-header">
        <h3>{t('department.title')}</h3>
        <p>{currentUser.nom}</p>
        <p className="fstt-role">{currentUser.role}</p>
      </div>
      
      <nav className="fstt-sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.dashboard')}
            </NavLink>
          </li>
          
          {/* Course management - available to all roles except students */}
          {currentUser.role !== ROLES.ETUDIANT && (
            <li>
              <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>
                {t('nav.courses')}
              </NavLink>
            </li>
          )}
          
          {/* Student management - available to administrative roles and teachers */}
          {(hasRole(ROLES.CHEF_DEPARTEMENT) || 
            hasRole(ROLES.COORDINATEUR) || 
            hasRole(ROLES.ENSEIGNANT)) && (
            <li>
              <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
                {t('nav.students')}
              </NavLink>
            </li>
          )}
          
          {/* Resources management - available to all */}
          <li>
            <NavLink to="/resources" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.rooms')}
            </NavLink>
          </li>
          
          {/* Incidents - available to all */}
          <li>
            <NavLink to="/incidents" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.incidents')}
            </NavLink>
          </li>
          
          {/* Schedule - available to all */}
          <li>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.schedule')}
            </NavLink>
          </li>
          
          {/* Deliberations - available to administrative roles and teachers */}
          {(hasRole(ROLES.CHEF_DEPARTEMENT) || 
            hasRole(ROLES.COORDINATEUR) || 
            hasRole(ROLES.ENSEIGNANT)) && (
            <li>
              <NavLink to="/deliberations" className={({ isActive }) => isActive ? 'active' : ''}>
                {t('nav.deliberations')}
              </NavLink>
            </li>
          )}
          
          {/* Internships - available to administrative roles, teachers, and students */}
          <li>
            <NavLink to="/internships" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.internships')}
            </NavLink>
          </li>
          
          {/* Administration - only for administrative roles */}
          {(hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.COORDINATEUR)) && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                {t('nav.admin')}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="fstt-sidebar-footer">
        <div className="fstt-department-info">
          <p><strong>{t('department.chief')}:</strong> {department.chef || t('department.unknown')}</p>
          <p><strong>{t('department.contact')}:</strong> {department.contact || t('department.unknown')}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
