import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../common/Icons';
import './Sidebar.css';

/**
 * Sidebar navigation component
 * @param {Object} props Component props
 * @param {Boolean} props.isOpen Whether sidebar is open
 * @param {Function} props.closeSidebar Function to close sidebar
 */
const Sidebar = ({ isOpen, closeSidebar }) => {
  const { t } = useTranslation();
  const { currentUser, logout, hasRole, ROLES } = useAuth();
  
  // Check if user has admin privileges
  const isAdmin = currentUser && (
    hasRole(ROLES.CHEF_DEPARTEMENT) || 
    hasRole(ROLES.ADMIN) || 
    hasRole(ROLES.COORDINATEUR)
  );
  
  return (
    <>
      <div className={`fstt-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={closeSidebar} />
      
      <nav className={`fstt-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="fstt-sidebar-header">
          <h2 className="fstt-app-name">{t('department.title')}</h2>
          <button 
            className="fstt-sidebar-close" 
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <Icons.X />
          </button>
        </div>
        
        <div className="fstt-sidebar-content">
          <div className="fstt-nav">
            <NavLink 
              to="/" 
              className="fstt-nav-item" 
              onClick={closeSidebar} 
              end
            >
              <span className="fstt-nav-icon"><Icons.Home /></span>
              {t('nav.home')}
            </NavLink>
            
            {currentUser && (
              <NavLink 
                to="/dashboard" 
                className="fstt-nav-item" 
                onClick={closeSidebar}
              >
                <span className="fstt-nav-icon"><Icons.BarChart /></span>
                {t('nav.dashboard')}
              </NavLink>
            )}
            
            <div className="fstt-nav-category">{t('nav.teaching')}</div>
            
            <NavLink 
              to="/courses" 
              className="fstt-nav-item" 
              onClick={closeSidebar}
            >
              <span className="fstt-nav-icon"><Icons.Book /></span>
              {t('nav.courses')}
            </NavLink>
            
            <NavLink 
              to="/students" 
              className="fstt-nav-item" 
              onClick={closeSidebar}
            >
              <span className="fstt-nav-icon"><Icons.Users /></span>
              {t('nav.students')}
            </NavLink>
            
            <NavLink 
              to="/deliberations" 
              className="fstt-nav-item" 
              onClick={closeSidebar}
            >
              <span className="fstt-nav-icon"><Icons.CheckSquare /></span>
              {t('nav.deliberations')}
            </NavLink>
            
            <div className="fstt-nav-category">{t('nav.management')}</div>
            
            <NavLink 
              to="/resources" 
              className="fstt-nav-item" 
              onClick={closeSidebar}
            >
              <span className="fstt-nav-icon"><Icons.Monitor /></span>
              {t('nav.resources')}
            </NavLink>
            
            <NavLink 
              to="/incidents" 
              className="fstt-nav-item" 
              onClick={closeSidebar}
            >
              <span className="fstt-nav-icon"><Icons.AlertTriangle /></span>
              {t('nav.incidents')}
              {hasRole(ROLES.TECHNICIEN) && <span className="fstt-nav-badge">3</span>}
            </NavLink>
            
            {/* Admin-only sections */}
            {isAdmin && (
              <>
                <div className="fstt-nav-category">{t('nav.admin')}</div>
                
                <NavLink 
                  to="/administration" 
                  className="fstt-nav-item" 
                  onClick={closeSidebar}
                >
                  <span className="fstt-nav-icon"><Icons.Settings /></span>
                  {t('nav.admin')}
                </NavLink>
                
                <NavLink 
                  to="/users" 
                  className="fstt-nav-item" 
                  onClick={closeSidebar}
                >
                  <span className="fstt-nav-icon"><Icons.UserPlus /></span>
                  {t('nav.users')}
                </NavLink>
              </>
            )}
          </div>
        </div>
        
        <div className="fstt-sidebar-footer">
          {currentUser ? (
            <>
              <div className="fstt-user-info">
                <span className="fstt-user-name">{currentUser.nom}</span>
                <span className="fstt-user-role">{currentUser.role}</span>
              </div>
              <div className="fstt-user-actions">
                <Link 
                  to="/profile" 
                  className="fstt-btn fstt-btn-secondary" 
                  onClick={closeSidebar}
                >
                  {t('nav.profile')}
                </Link>
                <Link 
                  to="/settings" 
                  className="fstt-btn" 
                  onClick={closeSidebar}
                >
                  {t('nav.settings')}
                </Link>
              </div>
              <button 
                onClick={() => {
                  logout();
                  closeSidebar();
                }} 
                className="fstt-logout-btn"
              >
                <span className="fstt-btn-icon"><Icons.LogOut /></span>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="fstt-login-btn" 
              onClick={closeSidebar}
            >
              <span className="fstt-btn-icon"><Icons.LogIn /></span>
              {t('nav.login')}
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
