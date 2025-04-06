/**
 * Models related to student management
 * Based on the UML class diagram
 */

/**
 * Class representing an Absence entity
 */
export class Absence {
  constructor(id, date, motif, justifiee, etudiant_id, cours_code) {
    this.id = id;
    this.date = date;
    this.motif = motif;
    this.justifiee = justifiee;
    this.etudiant_id = etudiant_id;
    this.cours_code = cours_code;
  }

  static fromDb(absenceDb) {
    return new Absence(
      absenceDb.id,
      absenceDb.date,
      absenceDb.motif,
      absenceDb.justifiee,
      absenceDb.etudiant_id,
      absenceDb.cours_code
    );
  }

  toDb() {
    return {
      id: this.id,
      date: this.date,
      motif: this.motif,
      justifiee: this.justifiee,
      etudiant_id: this.etudiant_id,
      cours_code: this.cours_code
    };
  }

  /**
   * Justify an absence with a reason
   * @param {String} justificatif - Justification for the absence
   * @returns {Boolean} True if the absence was successfully justified
   */
  justifierAbsence(justificatif) {
    if (justificatif && justificatif.trim()) {
      this.justifiee = true;
      this.motif = justificatif;
      return true;
    }
    return false;
  }

  /**
   * Get absence details
   * @returns {Object} Absence details
   */
  consulterAbsence() {
    return {
      id: this.id,
      date: this.date,
      motif: this.motif,
      justifiee: this.justifiee,
      etudiant_id: this.etudiant_id,
      cours_code: this.cours_code
    };
  }
}

/**
 * Class representing an Inscription entity
 */
export class Inscription {
  constructor(id, dateInscription, statut, etudiant_id, formation_code) {
    this.id = id;
    this.dateInscription = dateInscription;
    this.statut = statut;
    this.etudiant_id = etudiant_id;
    this.formation_code = formation_code;
  }

  static fromDb(inscriptionDb) {
    return new Inscription(
      inscriptionDb.id,
      inscriptionDb.dateInscription,
      inscriptionDb.statut,
      inscriptionDb.etudiant_id,
      inscriptionDb.formation_code
    );
  }

  toDb() {
    return {
      id: this.id,
      dateInscription: this.dateInscription,
      statut: this.statut,
      etudiant_id: this.etudiant_id,
      formation_code: this.formation_code
    };
  }

  /**
   * Create a new registration record
   * @returns {Object} The created registration data
   */
  creerInscription() {
    // Set the date to current date if not already set
    if (!this.dateInscription) {
      this.dateInscription = new Date();
    }
    
    return {
      ...this.toDb(),
      dateModification: new Date()
    };
  }

  /**
   * Create a student file based on the registration
   * @returns {Object} New student file data
   */
  creerDossier() {
    return {
      inscription_id: this.id,
      etudiant_id: this.etudiant_id,
      formation_code: this.formation_code,
      documents: [],
      dateCreation: new Date(),
      statut: 'Créé'
    };
  }
  
  /**
   * Update the registration status
   * @param {String} nouveauStatut - New status (En attente, Acceptée, Refusée, Complétée)
   * @returns {Boolean} True if the status was successfully updated
   */
  mettreAJourStatut(nouveauStatut) {
    const statutsValides = ['En attente', 'Acceptée', 'Refusée', 'Complétée'];
    if (statutsValides.includes(nouveauStatut)) {
      this.statut = nouveauStatut;
      return true;
    }
    return false;
  }
}

/**
 * Class representing a Stage entity
 */
export class Stage {
  constructor(id, dateDebut, dateFin, entreprise, sujet, etudiant_id) {
    this.id = id;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.entreprise = entreprise;
    this.sujet = sujet;
    this.etudiant_id = etudiant_id;
    this.statut = 'En cours'; // Initial status
    this.rapportSoumis = false;
    this.dateSoutenance = null;
    this.note = null;
    this.jury = [];
  }

  static fromDb(stageDb) {
    const stage = new Stage(
      stageDb.id,
      stageDb.dateDebut,
      stageDb.dateFin,
      stageDb.entreprise,
      stageDb.sujet,
      stageDb.etudiant_id
    );
    
    // Set additional properties if they exist
    if (stageDb.statut) stage.statut = stageDb.statut;
    if (stageDb.rapportSoumis) stage.rapportSoumis = stageDb.rapportSoumis;
    if (stageDb.dateSoutenance) stage.dateSoutenance = stageDb.dateSoutenance;
    if (stageDb.note) stage.note = stageDb.note;
    if (stageDb.jury) stage.jury = stageDb.jury;
    
    return stage;
  }

  toDb() {
    return {
      id: this.id,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      entreprise: this.entreprise,
      sujet: this.sujet,
      etudiant_id: this.etudiant_id,
      statut: this.statut,
      rapportSoumis: this.rapportSoumis,
      dateSoutenance: this.dateSoutenance,
      note: this.note,
      jury: this.jury
    };
  }

  /**
   * Record internship activities
   * @param {String} activite - Description of the activity
   * @param {Date} date - Date of the activity
   * @returns {Object} Recorded internship activity
   */
  realiserStage(activite, date = new Date()) {
    return {
      stage_id: this.id,
      etudiant_id: this.etudiant_id,
      activite,
      date,
      statut: 'Réalisé'
    };
  }
  
  /**
   * Submit an internship report
   * @param {String} titre - Report title
   * @param {String} contenu - Report content
   * @returns {Object} Submitted report data
   */
  soumettreLivrable(titre, contenu) {
    this.rapportSoumis = true;
    
    return {
      stage_id: this.id,
      etudiant_id: this.etudiant_id,
      titre,
      contenu,
      date_soumission: new Date(),
      statut: 'Soumis'
    };
  }
  
  /**
   * Present the internship report to jury
   * @returns {Object} Presentation record
   */
  presenterRapport() {
    return {
      stage_id: this.id,
      etudiant_id: this.etudiant_id,
      date_presentation: new Date(),
      statut: 'Présenté'
    };
  }
  
  /**
   * Set the internship defense date
   * @param {Date} date - Defense date
   */
  planifierSoutenance(date) {
    this.dateSoutenance = date;
    return {
      stage_id: this.id,
      date_soutenance: date,
      statut: 'Planifiée'
    };
  }
  
  /**
   * Add jury members for the defense
   * @param {Array} juryMembers - Array of jury member IDs
   */
  convoquerSoutenance(juryMembers) {
    this.jury = juryMembers;
    return {
      stage_id: this.id,
      jury: juryMembers,
      date_convocation: new Date(),
      statut: 'Convoqué'
    };
  }
  
  /**
   * Evaluate student's performance
   * @param {Number} note - Grade for the internship (0-20)
   * @param {String} commentaire - Evaluation comments
   * @returns {Object} Evaluation record
   */
  evaluerPerformance(note, commentaire) {
    if (note < 0 || note > 20) {
      throw new Error('La note doit être comprise entre 0 et 20');
    }
    
    this.note = note;
    
    if (note >= 10) {
      this.statut = 'Validé';
    } else {
      this.statut = 'Non validé';
    }
    
    return {
      stage_id: this.id,
      etudiant_id: this.etudiant_id,
      note,
      commentaire,
      date_evaluation: new Date(),
      statut: this.statut
    };
  }
  
  /**
   * Verify if all conditions are met for diploma issuance
   * @returns {Boolean} True if all conditions are met
   */
  verifierConditions() {
    return this.rapportSoumis && 
           this.dateSoutenance && 
           this.note !== null && 
           this.note >= 10;
  }
  
  /**
   * Update internship status
   * @param {String} nouveauStatut - New status
   * @returns {Object} Status update record
   */
  mettreAJourStatut(nouveauStatut) {
    const statutsValides = [
      'En cours', 
      'Rapport soumis', 
      'Soutenance planifiée', 
      'Soutenance effectuée', 
      'Validé', 
      'Non validé', 
      'Diplôme autorisé', 
      'Diplôme remis'
    ];
    
    if (statutsValides.includes(nouveauStatut)) {
      this.statut = nouveauStatut;
      
      return {
        stage_id: this.id,
        ancien_statut: this.statut,
        nouveau_statut: nouveauStatut,
        date_mise_a_jour: new Date()
      };
    } else {
      throw new Error('Statut non valide');
    }
  }
}

/**
 * Class representing an EmploiDuTemps entity
 */
export class EmploiDuTemps {
  constructor(idSession, intervalle, jour, utilisateur_id, chef_labo_id) {
    this.idSession = idSession;
    this.intervalle = intervalle;
    this.jour = jour;
    this.utilisateur_id = utilisateur_id;
    this.chef_labo_id = chef_labo_id;
  }

  static fromDb(emploiDb) {
    return new EmploiDuTemps(
      emploiDb.idSession,
      emploiDb.intervalle,
      emploiDb.jour,
      emploiDb.utilisateur_id,
      emploiDb.chef_labo_id
    );
  }

  toDb() {
    return {
      idSession: this.idSession,
      intervalle: this.intervalle,
      jour: this.jour,
      utilisateur_id: this.utilisateur_id,
      chef_labo_id: this.chef_labo_id
    };
  }
  
  /**
   * Check for schedule conflicts
   * @param {Object} autreEmploi - Another schedule entry to check against
   * @returns {Boolean} True if there's a conflict, false otherwise
   */
  verifierConflit(autreEmploi) {
    return this.jour === autreEmploi.jour && this.intervalle === autreEmploi.intervalle;
  }
}
