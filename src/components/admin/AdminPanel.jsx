import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import DatabaseManager from './DatabaseManager';
import './AdminPanel.css';

/**
 * Admin Panel Component
 * Provides access to administrative functions
 */
const AdminPanel = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  // Check if user has admin permissions
  const isAdmin = currentUser && (
    hasRole(ROLES.ADMIN) || 
    hasRole(ROLES.CHEF_DEPARTEMENT) || 
    hasRole(ROLES.COORDINATEUR)
  );
  
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>{t('common.accessDenied')}</h2>
        <p>{t('common.adminOnly')}</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>{t('admin.panel')}</h1>
        <p>{t('admin.welcomeMessage', { name: currentUser.nom })}</p>
      </header>
      
      <div className="admin-tabs">
        <div className="admin-tab-content">
          <h2>{t('admin.databaseManagement')}</h2>
          <DatabaseManager />
        </div>
        
        {/* Add more admin sections as needed */}
      </div>
    </div>
  );
};

export default AdminPanel;
