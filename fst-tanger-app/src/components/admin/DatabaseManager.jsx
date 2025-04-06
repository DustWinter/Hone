import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { resetDatabase, backupDatabase, restoreDatabase, getDatabaseStats } from '../../utils/dbManager';
import './DatabaseManager.css';

/**
 * Database Manager Component
 * Provides admin UI for database operations
 */
const DatabaseManager = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  const [isReset, setIsReset] = useState(false);
  const [backupFile, setBackupFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Only allow admins to access this component
  const isAdmin = currentUser && hasRole(ROLES.ADMIN);
  
  useEffect(() => {
    // Load database statistics on component mount
    const loadStats = async () => {
      const result = await getDatabaseStats();
      if (result.success) {
        setStats(result.data);
      }
    };
    
    loadStats();
  }, []);
  
  const handleReset = async (withSampleData = true) => {
    // Ask for confirmation
    if (!window.confirm(t('admin.resetConfirm'))) {
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await resetDatabase(withSampleData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setIsReset(true);
        
        // Store reset date
        localStorage.setItem('last_reset_date', new Date().toISOString());
        
        // Reload page after 3 seconds to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackup = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await backupDatabase();
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestore = async () => {
    if (!backupFile) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier de sauvegarde' });
      return;
    }
    
    // Ask for confirmation
    if (!window.confirm(t('admin.restoreConfirm'))) {
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await restoreDatabase(backupFile);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setIsReset(true);
        
        // Reload page after 3 seconds to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  // If not admin, don't render component
  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h3>{t('common.accessDenied')}</h3>
        <p>{t('common.adminOnly')}</p>
      </div>
    );
  }

  return (
    <div className="database-manager">
      <h2>{t('admin.databaseManager')}</h2>
      
      {/* Database Stats */}
      {stats && (
        <div className="database-stats">
          <h3>{t('admin.databaseStats')}</h3>
          <p><strong>{t('admin.totalRecords')}:</strong> {stats.totalRecords}</p>
          <p><strong>{t('admin.lastReset')}:</strong> {stats.lastReset}</p>
          
          <details>
            <summary>{t('admin.tableDetails')}</summary>
            <table>
              <thead>
                <tr>
                  <th>{t('admin.tableName')}</th>
                  <th>{t('admin.recordCount')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.tables).map(([table, count]) => (
                  <tr key={table}>
                    <td>{table}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
      
      {/* Database Operations */}
      <div className="database-operations">
        <h3>{t('admin.operations')}</h3>
        
        {/* Backup Database */}
        <div className="operation-card">
          <h4>{t('admin.backupDatabase')}</h4>
          <p>{t('admin.backupDescription')}</p>
          <button
            className="primary-button"
            onClick={handleBackup}
            disabled={loading}
          >
            {loading ? t('common.processing') : t('admin.createBackup')}
          </button>
        </div>
        
        {/* Restore Database */}
        <div className="operation-card">
          <h4>{t('admin.restoreDatabase')}</h4>
          <p>{t('admin.restoreDescription')}</p>
          <input
            type="file"
            accept=".json"
            onChange={(e) => setBackupFile(e.target.files[0])}
          />
          <button
            className="secondary-button"
            onClick={handleRestore}
            disabled={!backupFile || loading}
          >
            {loading ? t('common.processing') : t('admin.restoreBackup')}
          </button>
        </div>
        
        {/* Reset Database */}
        <div className="operation-card warning">
          <h4>{t('admin.resetDatabase')}</h4>
          <p>{t('admin.resetDescription')}</p>
          <div className="button-group">
            <button
              className="primary-button danger-button"
              onClick={() => handleReset(true)}
              disabled={loading || isReset}
            >
              {loading ? t('common.processing') : "Initialiser avec données FST Tanger"}
            </button>
            <button
              className="danger-button"
              onClick={() => handleReset(false)}
              disabled={loading || isReset}
            >
              {loading ? t('common.processing') : t('admin.resetEmpty')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default DatabaseManager;
