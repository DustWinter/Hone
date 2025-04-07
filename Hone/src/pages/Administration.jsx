import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Administration.css';

/**
 * Administration page component
 * Provides administration tools for department management
 */
const Administration = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  
  // Redirect if no admin access
  useEffect(() => {
    if (currentUser && 
        !hasRole(ROLES.CHEF_DEPARTEMENT) && 
        !hasRole(ROLES.ADMIN) && 
        !hasRole(ROLES.COORDINATEUR)) {
      // Non-admin access, could redirect or show message
      console.warn('Unauthorized access attempt to Administration page');
    }
  }, [currentUser, hasRole, ROLES]);
  
  // Render user management tab
  const renderUsersTab = () => (
    <div className="fstt-admin-tab-content ns">
      <div className="fstt-admin-section">
        <h3>{t('admin.userManagement')}</h3>
        <p>{t('admin.userManagementDescription')}</p>
        
        <div className="fstt-admin-actions">
          <button className="fstt-btn fstt-btn-primary" onClick={() => alert('Add User')}>
            {t('admin.addUser')}
          </button>
          <button className="fstt-btn" onClick={() => alert('Import Users')}>
            {t('admin.importUsers')}
          </button>
          <button className="fstt-btn" onClick={() => alert('Export Users')}>
            {t('admin.exportUsers')} 
          </button>
        </div>
        
        <div className="fstt-admin-table-container">
          <h4>{t('admin.usersList')}</h4>
          <div className="fstt-admin-table-controls">
            <input 
              type="text" 
              placeholder={t('common.search')} 
              className="fstt-admin-search" 
            />
            <select className="fstt-admin-filter">
              <option value="all">{t('common.all')}</option>
              <option value="teacher">{t('admin.teachers')}</option>
              <option value="student">{t('admin.students')}</option>
              <option value="staff">{t('admin.staff')}</option>
            </select>
          </div>
          
          <table className="fstt-table fstt-admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('admin.name')}</th>
                <th>{t('admin.email')}</th>
                <th>{t('admin.role')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>EL BRAK Mohammed</td>
                <td>melbrak@yahoo.fr</td>
                <td>{t('admin.roles.departmentHead')}</td>
                <td>
                  <button className="fstt-btn fstt-btn-sm">
                    {t('common.view')}
                  </button>
                  <button className="fstt-btn fstt-btn-sm fstt-btn-secondary">
                    {t('common.edit')}
                  </button>
                  <button className="fstt-btn fstt-btn-sm fstt-btn-danger">
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>KOUNAIDI Mohamed</td>
                <td>m.kounaidi@uae.ac.ma</td>
                <td>{t('admin.roles.coordinator')}</td>
                <td>
                  <button className="fstt-btn fstt-btn-sm">
                    {t('common.view')}
                  </button>
                  <button className="fstt-btn fstt-btn-sm fstt-btn-secondary">
                    {t('common.edit')}
                  </button>
                  <button className="fstt-btn fstt-btn-sm fstt-btn-danger">
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
              <tr>
                <td>202</td>
                <td>RACHIDI Sara</td>
                <td>srachidi@uae.ac.ma</td>
                <td>{t('admin.roles.technician')}</td>
                <td>
                  <button className="fstt-btn fstt-btn-sm">
                    {t('common.view')}
                  </button>
                  <button className="fstt-btn fstt-btn-sm fstt-btn-secondary">
                    {t('common.edit')}
                  </button>
                  <button className="fstt-btn fstt-btn-sm fstt-btn-danger">
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="fstt-admin-pagination">
            <button className="fstt-btn fstt-btn-sm">&laquo;</button>
            <button className="fstt-btn fstt-btn-sm">1</button>
            <button className="fstt-btn fstt-btn-sm">2</button>
            <button className="fstt-btn fstt-btn-sm">3</button>
            <button className="fstt-btn fstt-btn-sm">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render reports tab
  const renderReportsTab = () => (
    <div className="fstt-admin-tab-content ns">
      <div className="fstt-admin-section">
        <h3>{t('admin.academicReports')}</h3>
        <p>{t('admin.reportsDescription')}</p>
        
        <div className="fstt-admin-reports-grid">
          <div className="fstt-admin-report-card" onClick={() => alert('Student Progress Report')}>
            <h4>{t('admin.reports.studentProgress')}</h4>
            <p>{t('admin.reports.studentProgressDesc')}</p>
          </div>
          
          <div className="fstt-admin-report-card" onClick={() => alert('Course Performance Report')}>
            <h4>{t('admin.reports.coursePerformance')}</h4>
            <p>{t('admin.reports.coursePerformanceDesc')}</p>
          </div>
          
          <div className="fstt-admin-report-card" onClick={() => alert('Department Statistics')}>
            <h4>{t('admin.reports.departmentStats')}</h4>
            <p>{t('admin.reports.departmentStatsDesc')}</p>
          </div>
          
          <div className="fstt-admin-report-card" onClick={() => alert('Incidents Report')}>
            <h4>{t('admin.reports.incidents')}</h4>
            <p>{t('admin.reports.incidentsDesc')}</p>
          </div>
        </div>
        
        <div className="fstt-admin-chart-preview">
          <h4>{t('admin.dataVisualization')}</h4>
          <div className="fstt-admin-chart-placeholder">
            {t('admin.chartPlaceholder')}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render system configuration tab
  const renderConfigTab = () => (
    <div className="fstt-admin-tab-content ns">
      <div className="fstt-admin-section">
        <h3>{t('admin.systemConfiguration')}</h3>
        <p>{t('admin.configDescription')}</p>
        
        <div className="fstt-admin-config-grid">
          <div className="fstt-admin-config-card">
            <h4>{t('admin.config.general')}</h4>
            <form className="fstt-admin-form">
              <div className="fstt-admin-form-group">
                <label>{t('admin.config.departmentName')}</label>
                <input type="text" defaultValue="GÉNIE INFORMATIQUE" />
              </div>
              <div className="fstt-admin-form-group">
                <label>{t('admin.config.academicYear')}</label>
                <input type="text" defaultValue="2023-2024" />
              </div>
              <div className="fstt-admin-form-group">
                <label>{t('admin.config.language')}</label>
                <select>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
              <button type="button" className="fstt-btn fstt-btn-primary">
                {t('common.save')}
              </button>
            </form>
          </div>
          
          <div className="fstt-admin-config-card">
            <h4>{t('admin.config.database')}</h4>
            <div className="fstt-admin-db-actions">
              <button className="fstt-btn" onClick={() => alert('Database Backup')}>
                {t('admin.config.backup')}
              </button>
              <button className="fstt-btn" onClick={() => alert('Database Restore')}>
                {t('admin.config.restore')}
              </button>
              <button className="fstt-btn fstt-btn-danger" onClick={() => alert('Reset Database')}>
                {t('admin.config.reset')}
              </button>
            </div>
          </div>
          
          <div className="fstt-admin-config-card">
            <h4>{t('admin.config.logs')}</h4>
            <div className="fstt-admin-log-viewer">
              <pre>[2023-11-15 10:30:22] System initialized\n[2023-11-15 10:45:15] User login: melbrak@yahoo.fr\n[2023-11-15 11:12:03] Course added: Introduction to Programming</pre>
            </div>
            <button className="fstt-btn" onClick={() => alert('Download Logs')}>
              {t('admin.config.downloadLogs')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // If not authorized, show access denied message
  if (currentUser && 
      !hasRole(ROLES.CHEF_DEPARTEMENT) && 
      !hasRole(ROLES.ADMIN) && 
      !hasRole(ROLES.COORDINATEUR)) {
    return (
      <div className="fstt-admin-access-denied ns">
        <h2>{t('common.accessDenied')}</h2>
        <p>{t('common.adminOnly')}</p>
      </div>
    );
  }

  return (
    <div className="fstt-admin ns">
      <h1>{t('nav.admin')}</h1>
      
      <div className="fstt-admin-welcome">
        <h2>{t('admin.welcomeTitle')}</h2>
        <p>{t('admin.welcomeMessage')}</p>
      </div>
      
      <div className="fstt-admin-tabs">
        <div className="fstt-admin-tab-header">
          <button 
            className={`fstt-admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`} 
            onClick={() => setActiveTab('users')}
          >
            {t('admin.userManagement')}
          </button>
          <button 
            className={`fstt-admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} 
            onClick={() => setActiveTab('reports')}
          >
            {t('admin.academicReports')}
          </button>
          <button 
            className={`fstt-admin-tab-btn ${activeTab === 'config' ? 'active' : ''}`} 
            onClick={() => setActiveTab('config')}
          >
            {t('admin.systemConfiguration')}
          </button>
        </div>
        
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'config' && renderConfigTab()}
      </div>
    </div>
  );
};

export default Administration;
