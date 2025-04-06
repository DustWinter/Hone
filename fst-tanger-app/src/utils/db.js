import Dexie from 'dexie';

/**
 * Database schema for FST Tanger Departmental Management System
 * Based on UML class diagram
 */
class FSTTDatabase extends Dexie {
  constructor() {
    super('FSTT_GenieInfo2'); // Creating a new database to avoid schema conflicts
    
    // Database schema definition
    this.version(1).stores({
      personnes: '++id, nom, email',
      enseignants: 'id, appogee, specialite',
      etudiants: 'id, appogee, prenom, dateNaissance, adresse',
      sallesCoursLabo: 'id, nomSalle, capacite, disponibilite',
      demandesReservation: '++id, dateDemande, dateReservation, statut, enseignant_id, salle_id, administration_id',
      incidentsTechniques: '++id, description, dateSoumission, statut, priorite, enseignant_id, technicien_id, administration_id',
      cours: 'code, titre, semestre, annee',
      chapitres: '++id, titre, contenu, cours_code',
      seances: '++id, date, duree, salle, type, cours_code',
      evaluations: '++id, type, date, matiere, note, cours_code, etudiant_id',
      notes: '++id, valeur, coefficient, evaluation_id, etudiant_id',
      absences: '++id, date, motif, justifiee, etudiant_id, cours_code',
      inscriptions: '++id, dateInscription, statut, etudiant_id, formation_code',
      formations: 'code, intitule, duree',
      stages: '++id, dateDebut, dateFin, entreprise, sujet, etudiant_id',
      deliberations: '++id, date, statut, administration_id',
      laboratoires: '++id, encadrant_id',
      chefDeLabo: 'id',
      personnels: 'id, specialite, laboratoire_id',
      projets: '++id, nom, personnel, encadrant, chef_labo_id',
      materiels: '++id, nom, type, quantite, chef_labo_id',
      emploiDuTemps: '[idSession+jour+intervalle], idSession, jour, intervalle, utilisateur_id, chef_labo_id',
      administration: 'id',
      techniciens: 'id, specialite',
      chefDepartement: 'id',
      coordinateurs: 'id',
      enseignantsCours: '[enseignant_id+cours_code]',
      etudiantsNotes: '[etudiant_id+note_id]',
      personnelsProjets: '[personnel_id+projet_id]',
      deliberationsAbsences: '[deliberation_id+absence_id]',
      deliberationsEvaluations: '[deliberation_id+evaluation_id]',
      metadata: 'key'
    });

    // Define relationships and collections
    this.personnes = this.table('personnes');
    this.enseignants = this.table('enseignants');
    this.etudiants = this.table('etudiants');
    this.sallesCoursLabo = this.table('sallesCoursLabo');
    this.demandesReservation = this.table('demandesReservation');
    this.incidentsTechniques = this.table('incidentsTechniques');
    this.cours = this.table('cours');
    this.chapitres = this.table('chapitres');
    this.seances = this.table('seances');
    this.evaluations = this.table('evaluations');
    this.notes = this.table('notes');
    this.absences = this.table('absences');
    this.inscriptions = this.table('inscriptions');
    this.formations = this.table('formations');
    this.stages = this.table('stages');
    this.deliberations = this.table('deliberations');
    this.laboratoires = this.table('laboratoires');
    this.chefDeLabo = this.table('chefDeLabo');
    this.personnels = this.table('personnels');
    this.projets = this.table('projets');
    this.materiels = this.table('materiels');
    this.emploiDuTemps = this.table('emploiDuTemps');
    this.administration = this.table('administration');
    this.techniciens = this.table('techniciens');
    this.chefDepartement = this.table('chefDepartement');
    this.coordinateurs = this.table('coordinateurs');
    this.enseignantsCours = this.table('enseignantsCours');
    this.etudiantsNotes = this.table('etudiantsNotes');
    this.personnelsProjets = this.table('personnelsProjets');
    this.deliberationsAbsences = this.table('deliberationsAbsences');
    this.deliberationsEvaluations = this.table('deliberationsEvaluations');
    this.metadata = this.table('metadata');
  }

  /**
   * Reset the database by deleting all data, then reinitializing with sample data
   * @param {boolean} initSampleData - Whether to initialize with sample data after reset
   * @returns {Promise<Object>} Result of the operation
   */
  async resetDatabase(initSampleData = true) {
    try {
      console.log('Resetting database...');
      
      // Close current connection
      await this.close();
      
      // Delete the database
      await Dexie.delete('FSTT_GenieInfo2');
      
      // Reopen the database (this will trigger schema creation)
      await this.open();
      
      console.log('Database reset successfully');
      
      // Initialize with sample data if requested
      if (initSampleData) {
        const initData = await import('./initData').then(module => module.default);
        await initData();
      }
      
      return { success: true, message: 'Base de données réinitialisée avec succès' };
    } catch (error) {
      console.error('Error resetting database:', error);
      return { success: false, message: `Erreur lors de la réinitialisation: ${error.message}` };
    }
  }
  
  /**
   * Check if the database has been initialized with data
   * @returns {Promise<boolean>}
   */
  async isDatabaseInitialized() {
    try {
      const personCount = await this.personnes.count();
      return personCount > 0;
    } catch (error) {
      console.error('Error checking database initialization:', error);
      return false;
    }
  }

  // Département constants
  static département = {
    nom: "GÉNIE INFORMATIQUE",
    chef: "Pr.EL BRAK Mohamed",
    contact: "melbrak@uae.ac.ma",
    formations: ["LICENCE", "MASTER", "INGENIERIE", "DOCTORAT"],
    salles: {
      "1ere": ["E01", "E02"],
      "2eme": ["E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18"],
      "3eme": ["E21", "E22", "E23", "E24", "E25", "E26"]
    }
  };
}

// Create and export a singleton instance
const db = new FSTTDatabase();
export default db;
