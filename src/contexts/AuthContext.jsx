import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import db from '../utils/db';

/**
 * Authentication Context
 * Provides JWT-based authentication and RBAC (Role-Based Access Control)
 */
const AuthContext = createContext();

// Available user roles in the system
export const ROLES = {
  CHEF_DEPARTEMENT: 'ChefDepartement',
  ENSEIGNANT: 'Enseignant',
  ETUDIANT: 'Etudiant',
  TECHNICIEN: 'Technicien',
  COORDINATEUR: 'Coordinateur',
  CHEF_LABO: 'ChefDeLabo',
  PERSONNEL: 'Personnel',
  ADMIN: 'Admin'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Verify token validity
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('auth_token');
          setCurrentUser(null);
        } else {
          // Valid token, set current user
          fetchUserData(decodedToken.userId, decodedToken.role);
        }
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('auth_token');
        setCurrentUser(null);
      }
    }
    
    setLoading(false);
  }, []);
  
  /**
   * Fetches user data from the database based on user ID and role
   */
  const fetchUserData = async (userId, role) => {
    try {
      // First get basic person data
      const personneData = await db.personnes.get(userId);
      
      if (!personneData) {
        console.error('User not found');
        setCurrentUser(null);
        localStorage.removeItem('auth_token');
        return;
      }
      
      // Get role-specific data
      let roleData = {};
      
      switch(role) {
        case ROLES.CHEF_DEPARTEMENT: {
          const chefData = await db.chefDepartement.get(userId);
          if (chefData) roleData = chefData;
          break;
        }
        case ROLES.ENSEIGNANT: {
          const enseignantData = await db.enseignants.get(userId);
          if (enseignantData) roleData = enseignantData;
          break;
        }
        case ROLES.ETUDIANT: {
          const etudiantData = await db.etudiants.get(userId);
          if (etudiantData) roleData = etudiantData;
          break;
        }
        case ROLES.TECHNICIEN: {
          const technicienData = await db.techniciens.get(userId);
          if (technicienData) roleData = technicienData;
          break;
        }
        case ROLES.COORDINATEUR: {
          const coordinateurData = await db.coordinateurs.get(userId);
          if (coordinateurData) roleData = coordinateurData;
          break;
        }
        case ROLES.CHEF_LABO: {
          const chefLaboData = await db.chefDeLabo.get(userId);
          if (chefLaboData) roleData = chefLaboData;
          break;
        }
        case ROLES.PERSONNEL: {
          const personnelData = await db.personnels.get(userId);
          if (personnelData) roleData = personnelData;
          break;
        }
        default:
          break;
      }
      
      setCurrentUser({ 
        ...personneData,
        ...roleData,
        role 
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setCurrentUser(null);
    }
  };
  
  /**
   * Login function that authenticates the user with any password if the email exists
   * @param {string} email - User email
   * @param {string} password - Not checked in this implementation
   * @returns {Object} Login result with success flag
   */
  const login = async (email, password) => {
    setError(null);
    try {
      // Find person with the provided email
      const personnes = await db.personnes.where('email').equals(email).toArray();
      
      if (personnes.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const personne = personnes[0];
      let role = ROLES.ADMIN; // Default role
      
      // Check each role in priority order
      const isChefDepartement = await db.chefDepartement.get(personne.id);
      const isCoordinateur = await db.coordinateurs.get(personne.id);
      const isChefLabo = await db.chefDeLabo.get(personne.id);
      const isEnseignant = await db.enseignants.get(personne.id);
      const isPersonnel = await db.personnels.get(personne.id);
      const isTechnicien = await db.techniciens.get(personne.id);
      const isEtudiant = await db.etudiants.get(personne.id);
      
      // Determine role based on checks (higher privilege roles have priority)
      if (isChefDepartement) {
        role = ROLES.CHEF_DEPARTEMENT;
      } else if (isCoordinateur) {
        role = ROLES.COORDINATEUR;
      } else if (isChefLabo) {
        role = ROLES.CHEF_LABO;
      } else if (isEnseignant) {
        role = ROLES.ENSEIGNANT;
      } else if (isPersonnel) {
        role = ROLES.PERSONNEL;
      } else if (isTechnicien) {
        role = ROLES.TECHNICIEN;
      } else if (isEtudiant) {
        role = ROLES.ETUDIANT;
      }
      
      // Generate token and store it
      const token = createMockJwt(personne.id, role);
      localStorage.setItem('auth_token', token);
      
      // Set current user with role
      await fetchUserData(personne.id, role);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };
  
  /**
   * Logs the user out by removing the token and user state
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
  };
  
  /**
   * Creates a mock JWT token for demo purposes
   * In a real app, this would be generated by the server
   */
  const createMockJwt = (userId, role) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hour expiry
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('fakesignature'); // In real app, this would be cryptographically signed
    
    return `${header}.${payload}.${signature}`;
  };
  
  /**
   * Checks if the current user has a required role
   */
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    return currentUser.role === requiredRole;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole,
    ROLES
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
