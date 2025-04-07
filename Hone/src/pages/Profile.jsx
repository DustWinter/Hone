import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import db from '../utils/db';
import './Profile.css';

/**
 * User profile page component
 */
const Profile = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    specialite: '',
    adresse: '',
    telephone: ''
  });
  
  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Start with basic info from current user
        const profile = {
          id: currentUser.id,
          nom: currentUser.nom,
          email: currentUser.email,
          role: currentUser.role,
          specialite: currentUser.specialite || '',
          adresse: '',
          telephone: ''
        };
        
        // Add role-specific information
        if (currentUser.role === 'etudiant') {
          const etudiant = await db.etudiants.get(currentUser.id);
          if (etudiant) {
            profile.prenom = etudiant.prenom;
            profile.adresse = etudiant.adresse;
            profile.dateNaissance = etudiant.dateNaissance;
            profile.appogee = etudiant.appogee;
            
            // Get student's enrollment information
            const inscriptions = await db.inscriptions
              .where('etudiant_id')
              .equals(currentUser.id)
              .toArray();
            
            if (inscriptions.length > 0) {
              const formationCode = inscriptions[0].formation_code;
              const formation = await db.formations.get(formationCode);
              if (formation) {
                profile.formation = formation.intitule;
              }
            }
          }
        } 
        else if (currentUser.role === 'enseignant') {
          const enseignant = await db.enseignants.get(currentUser.id);
          if (enseignant) {
            profile.specialite = enseignant.specialite;
            profile.appogee = enseignant.appogee;
            
            // Get teacher's courses
            const cours = await db.enseignantsCours
              .where('enseignant_id')
              .equals(currentUser.id)
              .toArray();
            
            profile.coursCount = cours.length;
          }
        }
        
        setProfileData(profile);
        setFormData({
          nom: profile.nom || '',
          email: profile.email || '',
          specialite: profile.specialite || '',
          adresse: profile.adresse || '',
          telephone: profile.telephone || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [currentUser]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update personne record
      await db.personnes.update(currentUser.id, {
        nom: formData.nom,
        email: formData.email
      });
      
      // Update role-specific records
      if (currentUser.role === 'etudiant') {
        await db.etudiants.update(currentUser.id, {
          adresse: formData.adresse
        });
      } else if (currentUser.role === 'enseignant') {
        await db.enseignants.update(currentUser.id, {
          specialite: formData.specialite
        });
      }
      
      // Update profile data
      setProfileData({
        ...profileData,
        nom: formData.nom,
        email: formData.email,
        specialite: formData.specialite,
        adresse: formData.adresse,
        telephone: formData.telephone
      });
      
      setEditing(false);
      alert(t('profile.updateSuccess'));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('profile.updateError'));
    }
  };
  
  // Not logged in
  if (!currentUser) {
    return (
      <div className="fstt-profile-not-logged-in ns">
        <h2>{t('profile.notLoggedIn')}</h2>
        <p>{t('profile.pleaseLogin')}</p>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return <div className="fstt-loading ns">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-profile ns">
      <h1>{t('nav.profile')}</h1>
      
      <div className="fstt-profile-content">
        {/* Profile header with avatar and basic info */}
        <div className="fstt-profile-header">
          <div className="fstt-profile-avatar">
            {profileData.nom.charAt(0).toUpperCase()}
          </div>
          <div className="fstt-profile-header-info">
            <h2>{profileData.nom}</h2>
            <p className="fstt-profile-email">{profileData.email}</p>
          </div>
          <div className="fstt-profile-actions">
            {!editing ? (
              <button 
                className="fstt-btn fstt-btn-secondary"
                onClick={() => setEditing(true)}
              >
                {t('common.edit')}
              </button>
            ) : (
              <button 
                className="fstt-btn fstt-btn-danger"
                onClick={() => setEditing(false)}
              >
                {t('common.cancel')}
              </button>
            )}
          </div>
        </div>
        
        {editing ? (
          /* Edit form */
          <form className="fstt-profile-edit-form" onSubmit={handleSubmit}>
            <div className="fstt-form-group">
              <label htmlFor="nom">{t('profile.name')}</label>
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
              <label htmlFor="email">{t('profile.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {currentUser.role === 'enseignant' && (
              <div className="fstt-form-group">
                <label htmlFor="specialite">{t('profile.specialization')}</label>
                <input
                  type="text"
                  id="specialite"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {currentUser.role === 'etudiant' && (
              <div className="fstt-form-group">
                <label htmlFor="adresse">{t('profile.address')}</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="fstt-form-group">
              <label htmlFor="telephone">{t('profile.phone')}</label>
              <input
                type="text"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="fstt-profile-form-actions">
              <button type="submit" className="fstt-btn fstt-btn-primary">
                {t('common.save')}
              </button>
            </div>
          </form>
        ) : (
          /* Profile details */
          <div className="fstt-profile-details">
            <div className="fstt-profile-section">
              <h3>{t('profile.personalInfo')}</h3>
              <div className="fstt-profile-field">
                <span className="fstt-profile-field-label">{t('profile.name')}</span>
                <span className="fstt-profile-field-value">{profileData.nom}</span>
              </div>
              <div className="fstt-profile-field">
                <span className="fstt-profile-field-label">{t('profile.email')}</span>
                <span className="fstt-profile-field-value">{profileData.email}</span>
              </div>
              {profileData.appogee && (
                <div className="fstt-profile-field">
                  <span className="fstt-profile-field-label">{t('profile.appogee')}</span>
                  <span className="fstt-profile-field-value">{profileData.appogee}</span>
                </div>
              )}
              {profileData.telephone && (
                <div className="fstt-profile-field">
                  <span className="fstt-profile-field-label">{t('profile.phone')}</span>
                  <span className="fstt-profile-field-value">{profileData.telephone}</span>
                </div>
              )}
              {profileData.role && (
              <div className="fstt-profile-field">
                <span className="fstt-profile-field-label">{t('Role')}</span>
                <span className="fstt-profile-field-value">{profileData.role}</span>
              </div>
              )}
            </div>
            
            {profileData.role === 'etudiant' && (
              <div className="fstt-profile-section">
                <h3>{t('profile.academicInfo')}</h3>
                {profileData.formation && (
                  <div className="fstt-profile-field">
                    <span className="fstt-profile-field-label">{t('profile.program')}</span>
                    <span className="fstt-profile-field-value">{profileData.formation}</span>
                  </div>
                )}
                {profileData.adresse && (
                  <div className="fstt-profile-field">
                    <span className="fstt-profile-field-label">{t('profile.address')}</span>
                    <span className="fstt-profile-field-value">{profileData.adresse}</span>
                  </div>
                )}
                {profileData.dateNaissance && (
                  <div className="fstt-profile-field">
                    <span className="fstt-profile-field-label">{t('profile.birthDate')}</span>
                    <span className="fstt-profile-field-value">
                      {new Date(profileData.dateNaissance).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {profileData.role === 'enseignant' && (
              <div className="fstt-profile-section">
                <h3>{t('profile.professionalInfo')}</h3>
                <div className="fstt-profile-field">
                  <span className="fstt-profile-field-label">{t('profile.specialization')}</span>
                  <span className="fstt-profile-field-value">
                    {profileData.specialite || t('profile.notSpecified')}
                  </span>
                </div>
                <div className="fstt-profile-field">
                  <span className="fstt-profile-field-label">{t('profile.coursesCount')}</span>
                  <span className="fstt-profile-field-value">{profileData.coursCount || 0}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
