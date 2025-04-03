import Dexie from 'dexie';

/**
 * Database schema for FST Tanger Departmental Management System
 * Based on UML class diagram
 */
class FSTTDatabase extends Dexie {
  constructor() {
    super('FSTT_GenieInfo');
    
    // Database schema definition based on class diagram
    this.version(1).stores({
      personnes: '++id, nom, email',
      enseignants: 'id, appogee, spécialité, *cours', // Enseignant extends Personne
      etudiants: 'id, appogee, prenom, dateNaissance, adresse', // Étudiant extends Personne
      sallesCoursLabo: '++id, nomSalle, capacité, disponibilité',
      demandesReservation: '++id, dateDemande, dateReservation, statut, enseignantId, salleId',
      incidentsTechniques: '++id, description, dateSoumission, statut, priorité, enseignantId, technicienId',
      cours: '++id, code, titre, semestre, annee, *enseignantIds, *chapitreIds',
      chapitres: '++id, titre, contenu, coursId',
      seances: '++id, date, durée, salle, type, coursId',
      evaluations: '++id, type, date, matiere, coursId',
      notes: '++id, valeur, coefficient, evaluationId, etudiantId',
      absences: '++id, date, motif, justifiée, etudiantId, coursId',
      inscriptions: '++id, dateInscription, statut, etudiantId, formationId',
      formations: '++id, code, intitule, duree',
      stages: '++id, dateDebut, dateFin, entreprise, sujet, etudiantId',
      deliberations: '++id, date, statut',
      laboratoires: '++id, encadrant_id',
      chefDeLabo: 'id', // Extends Personne
      personnels: 'id, spécialité', // Extends Personne
      projets: '++id, nom, personnel, encadrant',
      materiels: '++id, nom, type, quantité, laboratoireId',
      emploiDuTemps: '++id, id_session, intervalle, jour, utilisateur_id',
      administration: '++id',
      techniciens: 'id, spécialité', // Extends Personne
      chefDepartement: 'id', // Extends Personne
      coordinateurs: 'id' // Extends Personne
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
  }

  // Département constants
  static département = {
    nom: "GÉNIE INFORMATIQUE",
    chef: "Pr.EL BRAK Mohamed",
    contact: "melbrak@uae.ac.ma",
    formations: ["LICENCE", "MASTER", "INGENIERIE", "DOCTORAT"]
  };
}

// Create and export a singleton instance
const db = new FSTTDatabase();
export default db;
