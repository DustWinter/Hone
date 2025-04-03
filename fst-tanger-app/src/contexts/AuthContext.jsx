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
      let userData = null;
      
      switch(role) {
        case ROLES.CHEF_DEPARTEMENT:
          userData = await db.chefDepartement.get(userId);
          break;
        case ROLES.ENSEIGNANT:
          userData = await db.enseignants.get(userId);
          break;
        case ROLES.ETUDIANT:
          userData = await db.etudiants.get(userId);
          break;
        case ROLES.TECHNICIEN:
          userData = await db.techniciens.get(userId);
          break;
        case ROLES.COORDINATEUR:
          userData = await db.coordinateurs.get(userId);
          break;
        case ROLES.CHEF_LABO:
          userData = await db.chefDeLabo.get(userId);
          break;
        case ROLES.PERSONNEL:
          userData = await db.personnels.get(userId);
          break;
        default:
          console.error('Unknown role:', role);
          break;
      }
      
      if (userData) {
        setCurrentUser({ ...userData, role });
      } else {
        console.error('User not found');
        setCurrentUser(null);
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };
  
  /**
   * Login function that authenticates the user and stores the JWT token
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const personnes = await db.personnes.where('email').equals(email).toArray();
      
      if (personnes.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const personne = personnes[0];
      let role = null;
      let roleData = {};
      
      // Check each role-specific table
      const [
        chefDepartement, 
        enseignant, 
        etudiant, 
        technicien, 
        coordinateur, 
        chefLabo, 
        personnel
      ] = await Promise.all([
        db.chefDepartement.get(personne.id),
        db.enseignants.get(personne.id),
        db.etudiants.get(personne.id),
        db.techniciens.get(personne.id),
        db.coordinateurs.get(personne.id),
        db.chefDeLabo.get(personne.id),
        db.personnels.get(personne.id)
      ]);

      if (chefDepartement) role = ROLES.CHEF_DEPARTEMENT;
      else if (enseignant) {
        role = ROLES.ENSEIGNANT;
        roleData = {
          appogee: enseignant.appogee,
          specialite: enseignant.specialite,
          cours: enseignant.cours || []
        };
      }
      else if (etudiant) {
        role = ROLES.ETUDIANT;
        roleData = {
          appogee: etudiant.appogee,
          prenom: etudiant.prenom,
          dateNaissance: etudiant.dateNaissance,
          adresse: etudiant.adresse
        };
      }
      else if (technicien) {
        role = ROLES.TECHNICIEN;
        roleData = { specialite: technicien.specialite };
      }
      else if (coordinateur) role = ROLES.COORDINATEUR;
      else if (chefLabo) role = ROLES.CHEF_LABO;
      else if (personnel) {
        role = ROLES.PERSONNEL;
        roleData = { specialite: personnel.specialite };
      }

      setCurrentUser({
        id: personne.id,
        nom: personne.nom,
        email: personne.email,
        role,
        ...roleData
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
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
