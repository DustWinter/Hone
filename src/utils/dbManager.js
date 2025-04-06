import db from './db';

/**
 * Database Management Utility
 * Provides functions to manage the database state
 */

/**
 * Reset the database to its initial state and initialize with FST Tanger data
 * @param {boolean} withSampleData - Whether to initialize with sample data
 * @returns {Promise<object>} Result of the reset operation
 */
export const resetDatabase = async (withSampleData = true) => {
  try {
    // Clear any stored authentication tokens
    localStorage.removeItem('auth_token');
    
    // Reset the database
    const result = await db.resetDatabase(withSampleData);
    
    // Store reset date
    localStorage.setItem('last_reset_date', new Date().toISOString());
    
    return result;
  } catch (error) {
    console.error('Error in resetDatabase:', error);
    return { success: false, message: `Erreur: ${error.message}` };
  }
};

/**
 * Backup current database state
 * @returns {Promise<object>} Backup data object
 */
export const backupDatabase = async () => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      tables: {}
    };
    
    // Backup each table
    for (const tableName of Object.keys(db.tables)) {
      backup.tables[tableName] = await db.table(tableName).toArray();
    }
    
    // Store in localStorage or download as JSON
    const backupJson = JSON.stringify(backup);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `fstt_db_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    return { success: true, message: 'Sauvegarde créée avec succès' };
  } catch (error) {
    console.error('Error backing up database:', error);
    return { success: false, message: `Erreur: ${error.message}` };
  }
};

/**
 * Restore database from backup file
 * @param {File} backupFile - JSON backup file
 * @returns {Promise<object>} Result of the restore operation
 */
export const restoreDatabase = async (backupFile) => {
  try {
    // Read the backup file
    const fileContent = await backupFile.text();
    const backup = JSON.parse(fileContent);
    
    // Validate backup format
    if (!backup.tables || !backup.timestamp) {
      throw new Error('Format de sauvegarde invalide');
    }
    
    // Reset the current database
    await db.resetDatabase(false);
    
    // Restore data for each table
    for (const [tableName, tableData] of Object.entries(backup.tables)) {
      if (db[tableName] && Array.isArray(tableData) && tableData.length > 0) {
        await db[tableName].bulkAdd(tableData);
      }
    }
    
    return { 
      success: true, 
      message: `Restauration réussie. Sauvegarde du ${new Date(backup.timestamp).toLocaleString()}`
    };
  } catch (error) {
    console.error('Error restoring database:', error);
    return { success: false, message: `Erreur: ${error.message}` };
  }
};

/**
 * Export database statistics
 * @returns {Promise<object>} Database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const stats = {
      tables: {},
      totalRecords: 0,
      lastReset: localStorage.getItem('last_reset_date') || 'Jamais'
    };
    
    // Get count for each table
    for (const tableName of Object.keys(db.tables)) {
      const count = await db.table(tableName).count();
      stats.tables[tableName] = count;
      stats.totalRecords += count;
    }
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return { success: false, message: `Erreur: ${error.message}` };
  }
};

/**
 * Add a "metadata" table to the database for storing miscellaneous data
 * @returns {Promise<object>} Result of the operation
 */
export const ensureMetadataTable = async () => {
  try {
    if (!db.tables.metadata) {
      // Create metadata table in next version
      const currentVersion = db.verno;
      db.version(currentVersion + 1).stores({
        metadata: "key" // Simple key-value store
      });
      
      // Force upgrade
      await db.open();
    }
    return { success: true };
  } catch (error) {
    console.error('Error ensuring metadata table:', error);
    return { success: false, message: error.message };
  }
};

export default {
  resetDatabase,
  backupDatabase,
  restoreDatabase,
  getDatabaseStats,
  ensureMetadataTable
};
