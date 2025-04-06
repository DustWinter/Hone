/**
 * Abstract class representing a Personne entity
 * Based on the UML class diagram
 */
export class Personne {
  constructor(id, nom, email) {
    this.id = id;
    this.nom = nom;
    this.email = email;
  }

  static fromDb(personneDb) {
    return new Personne(
      personneDb.id,
      personneDb.nom,
      personneDb.email
    );
  }

  toDb() {
    return {
      id: this.id,
      nom: this.nom,
      email: this.email
    };
  }
}

/**
 * Class representing an Enseignant entity
 * Extends Personne based on the UML class diagram
 */
export class Enseignant extends Personne {
  constructor(id, nom, email, appogee, specialite) {
    super(id, nom, email);
    this.appogee = appogee;
    this.specialite = specialite;
  }

  static fromDb(enseignantDb) {
    return new Enseignant(
      enseignantDb.id,
      enseignantDb.nom,
      enseignantDb.email,
      enseignantDb.appogee,
      enseignantDb.specialite
    );
  }

  toDb() {
    return {
      ...super.toDb(),
      appogee: this.appogee,
      specialite: this.specialite
    };
  }

  /**
   * Submit a room reservation request
   * @param {Date} dateDemande - Date of request
   * @param {Date} dateReservation - Requested reservation date
   * @param {Number} salleId - ID of the room to reserve
   * @returns {Object} Reservation request object
   */
  soumettreDemandeReservation(dateDemande, dateReservation, salleId) {
    return {
      dateDemande: dateDemande || new Date(),
      dateReservation,
      statut: 'En attente',
      enseignant_id: this.id,
      salle_id: salleId
    };
  }

  /**
   * Submit a technical incident report
   * @param {String} description - Description of the incident
   * @param {String} priorite - Priority level (Basse, Normale, Haute, Urgente)
   * @returns {Object} Incident report object
   */
  soumettreIncidentTechnique(description, priorite = 'Normale') {
    if (!['Basse', 'Normale', 'Haute', 'Urgente'].includes(priorite)) {
      priorite = 'Normale';
    }
    
    return {
      description,
      dateSoumission: new Date(),
      statut: 'Soumis',
      priorite,
      enseignant_id: this.id
    };
  }

  /**
   * Record teaching activities for a course
   * @param {String} coursCode - Code of the course
   * @param {String} activiteType - Type of teaching activity (CM, TD, TP)
   * @returns {Object} Teaching record
   */
  enseignerCours(coursCode, activiteType = 'CM') {
    return {
      enseignant_id: this.id,
      cours_code: coursCode,
      type_activite: activiteType,
      date: new Date()
    };
  }

  /**
   * Get student grades for a specific course
   * @param {String} coursCode - Code of the course
   * @returns {Promise<Array>} Array of student grades
   */
  async consulterNotes(coursCode) {
    // This would typically query a database
    // For this implementation, we'll return a mock structure
    return {
      cours_code: coursCode,
      enseignant_id: this.id,
      date_consultation: new Date(),
      etudiants: [] // Would contain student grades from database
    };
  }
}

/**
 * Class representing an Étudiant entity
 * Extends Personne based on the UML class diagram
 */
export class Etudiant extends Personne {
  constructor(id, nom, email, appogee, prenom, dateNaissance, adresse) {
    super(id, nom, email);
    this.appogee = appogee;
    this.prenom = prenom;
    this.dateNaissance = dateNaissance;
    this.adresse = adresse;
  }

  static fromDb(etudiantDb) {
    return new Etudiant(
      etudiantDb.id,
      etudiantDb.nom,
      etudiantDb.email,
      etudiantDb.appogee,
      etudiantDb.prenom,
      etudiantDb.dateNaissance,
      etudiantDb.adresse
    );
  }

  toDb() {
    return {
      ...super.toDb(),
      appogee: this.appogee,
      prenom: this.prenom,
      dateNaissance: this.dateNaissance,
      adresse: this.adresse
    };
  }

  /**
   * View student's academic record
   * @returns {Promise<Object>} Student's complete academic record
   */
  async consulterDossier() {
    // This would typically query a database for the student's information
    return {
      etudiant_id: this.id,
      inscriptions: [], // Would contain student registrations
      absences: [],     // Would contain absence records
      notes: [],        // Would contain grades
      stages: []        // Would contain internship information
    };
  }

  /**
   * Submit a registration request for a program
   * @param {String} formationCode - Code of the program to register for
   * @returns {Object} Registration request object
   */
  demanderInscription(formationCode) {
    return {
      dateInscription: new Date(),
      statut: 'En attente',
      etudiant_id: this.id,
      formation_code: formationCode
    };
  }

  /**
   * View student's own grades
   * @param {String} semestre - Optional semester filter
   * @returns {Promise<Object>} Student's grades
   */
  async consulterNotes(semestre = null) {
    // This would typically query a database
    const result = {
      etudiant_id: this.id,
      date_consultation: new Date(),
      notes: [] // Would contain grades from database
    };
    
    if (semestre) {
      result.semestre = semestre;
      // Would filter notes by semester
    }
    
    return result;
  }
}

/**
 * Class representing a ChefDeLabo entity
 * Extends Personne based on the UML class diagram
 */
export class ChefDeLabo extends Personne {
  constructor(id, nom, email) {
    super(id, nom, email);
  }

  /**
   * Supervise research activities in the laboratory
   * @param {Number} projetId - ID of the research project
   * @param {Array} personnelIds - IDs of personnel involved
   * @returns {Object} Research supervision record
   */
  encadrerRecherche(projetId, personnelIds = []) {
    return {
      chef_labo_id: this.id,
      projet_id: projetId,
      personnel_ids: personnelIds,
      date_encadrement: new Date(),
      statut: 'En cours'
    };
  }

  /**
   * Manage laboratory schedule
   * @param {Array} emplois - Array of schedule entries to manage
   * @returns {Object} Schedule management result
   */
  gererEmploiDuTemps(emplois = []) {
    return {
      chef_labo_id: this.id,
      date_modification: new Date(),
      emplois: emplois.map(emploi => ({
        ...emploi,
        chef_labo_id: this.id
      }))
    };
  }

  /**
   * Manage laboratory equipment
   * @param {String} action - Action to perform (ajouter, modifier, supprimer)
   * @param {Object} materiel - Equipment to manage
   * @returns {Object} Equipment management result
   */
  gererMateriel(action, materiel) {
    return {
      chef_labo_id: this.id,
      action,
      date_action: new Date(),
      materiel: {
        ...materiel,
        chef_labo_id: this.id
      }
    };
  }
}

/**
 * Class representing a Personnel entity
 * Extends Personne based on the UML class diagram
 */
export class Personnel extends Personne {
  constructor(id, nom, email, specialite, laboratoire_id) {
    super(id, nom, email);
    this.specialite = specialite;
    this.laboratoire_id = laboratoire_id;
  }

  static fromDb(personnelDb) {
    return new Personnel(
      personnelDb.id,
      personnelDb.nom,
      personnelDb.email,
      personnelDb.specialite,
      personnelDb.laboratoire_id
    );
  }

  toDb() {
    return {
      ...super.toDb(),
      specialite: this.specialite,
      laboratoire_id: this.laboratoire_id
    };
  }

  /**
   * Perform research activities
   * @param {Number} projetId - ID of the research project
   * @param {String} activiteType - Type of research activity
   * @returns {Object} Research activity record
   */
  effectuerRecherche(projetId, activiteType) {
    return {
      personnel_id: this.id,
      projet_id: projetId,
      activite_type: activiteType,
      date_debut: new Date(),
      statut: 'En cours'
    };
  }

  /**
   * Publish a scientific article
   * @param {String} titre - Title of the article
   * @param {String} contenu - Content of the article
   * @param {String} journal - Journal name
   * @returns {Object} Publication record
   */
  publierArticle(titre, contenu, journal) {
    return {
      personnel_id: this.id,
      titre,
      contenu,
      journal,
      date_publication: new Date(),
      statut: 'Publié'
    };
  }
}

/**
 * Class representing a Technicien entity
 * Extends Personne based on the UML class diagram
 */
export class Technicien extends Personne {
  constructor(id, nom, email, specialite) {
    super(id, nom, email);
    this.specialite = specialite;
  }

  static fromDb(technicienDb) {
    return new Technicien(
      technicienDb.id,
      technicienDb.nom,
      technicienDb.email,
      technicienDb.specialite
    );
  }

  toDb() {
    return {
      ...super.toDb(),
      specialite: this.specialite
    };
  }

  /**
   * Analyze a technical incident
   * @param {Number} incidentId - ID of the incident
   * @returns {Object} Incident analysis result
   */
  analyserIncident(incidentId) {
    return {
      technicien_id: this.id,
      incident_id: incidentId,
      date_analyse: new Date(),
      diagnostic: '',
      temps_estime: '',
      priorite_revisee: ''
    };
  }

  /**
   * Resolve a technical incident
   * @param {Number} incidentId - ID of the incident
   * @param {String} solution - Description of the solution
   * @returns {Object} Incident resolution result
   */
  resoudreIncident(incidentId, solution) {
    return {
      technicien_id: this.id,
      incident_id: incidentId,
      date_resolution: new Date(),
      solution,
      statut: 'Résolu'
    };
  }

  /**
   * Provide progress update on incident resolution
   * @param {Number} incidentId - ID of the incident
   * @param {String} avancement - Progress description
   * @param {Number} pourcentage - Progress percentage (0-100)
   * @returns {Object} Progress update record
   */
  fournirAvancement(incidentId, avancement, pourcentage = 0) {
    return {
      technicien_id: this.id,
      incident_id: incidentId,
      date_avancement: new Date(),
      description: avancement,
      pourcentage: Math.min(100, Math.max(0, pourcentage))
    };
  }
}

/**
 * Class representing a ChefDepartement entity
 * Extends Personne based on the UML class diagram
 */
export class ChefDepartement extends Personne {
  constructor(id, nom, email) {
    super(id, nom, email);
  }

  /**
   * Request a budget for department activities
   * @param {Number} montant - Requested amount
   * @param {String} justification - Justification for the budget
   * @param {String} annee - Academic year for the budget
   * @returns {Object} Budget request record
   */
  demanderBudget(montant, justification, annee) {
    return {
      chef_departement_id: this.id,
      montant,
      justification,
      annee,
      date_demande: new Date(),
      statut: 'En attente'
    };
  }
}

/**
 * Class representing a Coordinateur entity
 * Extends Personne based on the UML class diagram
 */
export class Coordinateur extends Personne {
  constructor(id, nom, email) {
    super(id, nom, email);
  }

  /**
   * Validate a course template/curriculum
   * @param {Number} maquetteId - ID of the template to validate
   * @param {Boolean} estApprouve - Whether the template is approved
   * @param {String} commentaire - Optional comment on the decision
   * @returns {Object} Template validation result
   */
  validerMaquette(maquetteId, estApprouve = true, commentaire = '') {
    return {
      coordinateur_id: this.id,
      maquette_id: maquetteId,
      est_approuve: estApprouve,
      commentaire,
      date_validation: new Date()
    };
  }

  /**
   * Manage subjects in the curriculum
   * @param {String} action - Action to perform (ajouter, modifier, supprimer)
   * @param {Object} matiere - Subject data
   * @returns {Object} Subject management result
   */
  gererMatieres(action, matiere) {
    return {
      coordinateur_id: this.id,
      action,
      date_action: new Date(),
      matiere: {
        ...matiere,
        derniere_modification_par: this.id
      }
    };
  }
}
