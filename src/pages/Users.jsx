import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Users.css';

/**
 * Users management page component
 * Manages all users in the system
 */
const Users = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    role: 'etudiant',
    specialite: '',
    appogee: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const personnes = await db.personnes.toArray();
        
        // Enhance user objects with role information
        const enhancedUsers = await Promise.all(personnes.map(async person => {
          // Check roles in order of priority
          const isChefDepartement = await db.chefDepartement.get(person.id);
          const isCoordinateur = await db.coordinateurs.get(person.id);
          const isEnseignant = await db.enseignants.get(person.id);
          const isTechnicien = await db.techniciens.get(person.id);
          const isEtudiant = await db.etudiants.get(person.id);
          
          let role = 'admin'; // Default role
          let additionalData = {};
          
          if (isChefDepartement) {
            role = 'chefDepartement';
          } else if (isCoordinateur) {
            role = 'coordinateur';
          } else if (isEnseignant) {
            role = 'enseignant';
            const data = await db.enseignants.get(person.id);
            additionalData = { specialite: data.specialite, appogee: data.appogee };
          } else if (isTechnicien) {
            role = 'technicien';
            const data = await db.techniciens.get(person.id);
            additionalData = { specialite: data.specialite };
          } else if (isEtudiant) {
            role = 'etudiant';
            const data = await db.etudiants.get(person.id);
            additionalData = { 
              appogee: data.appogee,
              prenom: data.prenom,
              dateNaissance: data.dateNaissance 
            };
          }
          
          return {
            ...person,
            role,
            ...additionalData
          };
        }));
        
        setUsers(enhancedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open the edit modal for a user
  const handleEdit = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        setFormData({
          nom: user.nom,
          email: user.email,
          role: user.role,
          specialite: user.specialite || '',
          appogee: user.appogee || ''
        });
        setCurrentUserId(userId);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error preparing edit form:', error);
    }
  };

  // Open the delete confirmation modal for a user
  const handleDeletePrompt = (userId) => {
    setCurrentUserId(userId);
    setShowDeleteModal(true);
  };

  // Submit new user form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.nom || !formData.email || !formData.role) {
        alert(t('users.validationError'));
        return;
      }

      // Create base person record
      const newPersonId = await db.personnes.add({
        nom: formData.nom,
        email: formData.email
      });

      // Create role-specific record
      switch (formData.role) {
        case 'enseignant':
          await db.enseignants.add({
            id: newPersonId,
            appogee: formData.appogee || `ENS${String(newPersonId).padStart(3, '0')}`,
            specialite: formData.specialite || 'Informatique'
          });
          break;
        case 'etudiant':
          await db.etudiants.add({
            id: newPersonId,
            appogee: formData.appogee || Math.floor(Math.random() * 90000) + 10000,
            prenom: '',
            dateNaissance: new Date(),
            adresse: ''
          });
          break;
        case 'technicien':
          await db.techniciens.add({
            id: newPersonId,
            specialite: formData.specialite || 'Maintenance'
          });
          break;
        case 'chefDepartement':
          await db.chefDepartement.add({
            id: newPersonId
          });
          break;
        case 'coordinateur':
          await db.coordinateurs.add({
            id: newPersonId
          });
          break;
        default:
          // Admin role doesn't need additional records
          break;
      }

      // Refresh user list
      const newUser = {
        id: newPersonId,
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        specialite: formData.specialite,
        appogee: formData.appogee
      };
      
      setUsers([...users, newUser]);
      setShowAddModal(false);
      resetForm();
      
      alert(t('users.userAddedSuccess'));
    } catch (error) {
      console.error('Error adding user:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };

  // Submit edit user form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.nom || !formData.email) {
        alert(t('users.validationError'));
        return;
      }

      // Update person record
      await db.personnes.update(currentUserId, {
        nom: formData.nom,
        email: formData.email
      });

      // Update role-specific info if needed
      switch (formData.role) {
        case 'enseignant':
          await db.enseignants.update(currentUserId, {
            specialite: formData.specialite
          });
          break;
        case 'technicien':
          await db.techniciens.update(currentUserId, {
            specialite: formData.specialite
          });
          break;
        default:
          break;
      }

      // Update user in the local state
      setUsers(users.map(user => 
        user.id === currentUserId 
          ? { ...user, nom: formData.nom, email: formData.email, specialite: formData.specialite }
          : user
      ));
      
      setShowEditModal(false);
      resetForm();
      
      alert(t('users.userUpdatedSuccess'));
    } catch (error) {
      console.error('Error updating user:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    try {
      // Delete from role-specific table first
      const user = users.find(u => u.id === currentUserId);
      if (user) {
        switch (user.role) {
          case 'enseignant':
            await db.enseignants.delete(currentUserId);
            break;
          case 'etudiant':
            await db.etudiants.delete(currentUserId);
            break;
          case 'technicien':
            await db.techniciens.delete(currentUserId);
            break;
          case 'chefDepartement':
            await db.chefDepartement.delete(currentUserId);
            break;
          case 'coordinateur':
            await db.coordinateurs.delete(currentUserId);
            break;
          default:
            break;
        }
      }

      // Then delete from personnes table
      await db.personnes.delete(currentUserId);
      
      // Update local state
      setUsers(users.filter(user => user.id !== currentUserId));
      setShowDeleteModal(false);
      setCurrentUserId(null);
      
      alert(t('users.userDeletedSuccess'));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };

  // Reset form for a new add
  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      role: 'etudiant',
      specialite: '',
      appogee: ''
    });
    setCurrentUserId(null);
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Role filter
    if (filter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && user.role === filter;
    }
  });

  // Get translated role name
  const getRoleName = (role) => {
    switch (role) {
      case 'chefDepartement': return t('admin.roles.departmentHead');
      case 'coordinateur': return t('admin.roles.coordinator');
      case 'enseignant': return t('admin.roles.teacher');
      case 'etudiant': return t('admin.roles.student');
      case 'technicien': return t('admin.roles.technician');
      case 'admin': return t('admin.roles.admin');
      default: return role;
    }
  };

  // Add User Modal
  const addUserModal = (
    <div className={`fstt-modal ${showAddModal ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('users.addUser')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <form onSubmit={handleAddSubmit}>
            <div className="fstt-form-group">
              <label htmlFor="nom">{t('users.name')}</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="fstt-form-group">
              <label htmlFor="email">{t('users.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="fstt-form-group">
              <label htmlFor="role">{t('users.role')}</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="etudiant">{t('admin.roles.student')}</option>
                <option value="enseignant">{t('admin.roles.teacher')}</option>
                <option value="technicien">{t('admin.roles.technician')}</option>
                <option value="coordinateur">{t('admin.roles.coordinator')}</option>
                <option value="chefDepartement">{t('admin.roles.departmentHead')}</option>
              </select>
            </div>
            
            {(formData.role === 'enseignant' || formData.role === 'technicien') && (
              <div className="fstt-form-group">
                <label htmlFor="specialite">{t('users.specialization')}</label>
                <input
                  type="text"
                  id="specialite"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {(formData.role === 'enseignant' || formData.role === 'etudiant') && (
              <div className="fstt-form-group">
                <label htmlFor="appogee">{t('users.appogee')}</label>
                <input
                  type="text"
                  id="appogee"
                  name="appogee"
                  value={formData.appogee}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="fstt-form-actions">
              <button type="button" className="fstt-btn" onClick={() => setShowAddModal(false)}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="fstt-btn fstt-btn-primary">
                {t('common.add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Edit User Modal
  const editUserModal = (
    <div className={`fstt-modal ${showEditModal ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('users.editUser')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <form onSubmit={handleEditSubmit}>
            <div className="fstt-form-group">
              <label htmlFor="edit-nom">{t('users.name')}</label>
              <input
                type="text"
                id="edit-nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="fstt-form-group">
              <label htmlFor="edit-email">{t('users.email')}</label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {(formData.role === 'enseignant' || formData.role === 'technicien') && (
              <div className="fstt-form-group">
                <label htmlFor="edit-specialite">{t('users.specialization')}</label>
                <input
                  type="text"
                  id="edit-specialite"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="fstt-form-actions">
              <button type="button" className="fstt-btn" onClick={() => setShowEditModal(false)}>
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

  // Delete User Modal
  const deleteUserModal = (
    <div className={`fstt-modal ${showDeleteModal ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('users.deleteUser')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowDeleteModal(false)}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <p>{t('users.deleteConfirmation')}</p>
          <div className="fstt-form-actions">
            <button type="button" className="fstt-btn" onClick={() => setShowDeleteModal(false)}>
              {t('common.cancel')}
            </button>
            <button type="button" className="fstt-btn fstt-btn-danger" onClick={handleDelete}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // If not admin, show access denied
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

  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-users ns">
      <h1>{t('nav.users')}</h1>
      
      <div className="fstt-users-controls">
        <div className="fstt-users-actions">
          <button className="fstt-btn fstt-btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> {t('users.addUser')}
          </button>
        </div>
        
        <div className="fstt-users-filters">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fstt-users-search"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="fstt-users-filter"
          >
            <option value="all">{t('common.all')}</option>
            <option value="enseignant">{t('admin.roles.teacher')}</option>
            <option value="etudiant">{t('admin.roles.student')}</option>
            <option value="technicien">{t('admin.roles.technician')}</option>
            <option value="coordinateur">{t('admin.roles.coordinator')}</option>
            <option value="chefDepartement">{t('admin.roles.departmentHead')}</option>
            <option value="admin">{t('admin.roles.admin')}</option>
          </select>
        </div>
      </div>
      
      {filteredUsers.length > 0 ? (
        <table className="fstt-table fstt-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('users.name')}</th>
              <th>{t('users.email')}</th>
              <th>{t('users.role')}</th>
              <th>{t('users.info')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{getRoleName(user.role)}</td>
                <td>
                  {user.specialite && <div><strong>{t('users.specialization')}:</strong> {user.specialite}</div>}
                  {user.appogee && <div><strong>{t('users.appogee')}:</strong> {user.appogee}</div>}
                </td>
                <td>
                  <div className="fstt-users-actions-cell">
                    <button className="fstt-btn fstt-btn-sm">
                      {t('common.view')}
                    </button>
                    <button 
                      className="fstt-btn fstt-btn-sm fstt-btn-secondary" 
                      onClick={() => handleEdit(user.id)}
                    >
                      {t('common.edit')}
                    </button>
                    <button 
                      className="fstt-btn fstt-btn-sm fstt-btn-danger"
                      onClick={() => handleDeletePrompt(user.id)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="fstt-empty">{t('common.noData')}</p>
      )}

      {addUserModal}
      {editUserModal}
      {deleteUserModal}
    </div>
  );
};

export default Users;
