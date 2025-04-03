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
  constructor(id, nom, email, appogee, specialite, cours = []) {
    super(id, nom, email);
    this.appogee = appogee;
    this.specialite = specialite;
    this.cours = cours;
  }

  static fromDb(enseignantDb) {
    return new Enseignant(
      enseignantDb.id,
      enseignantDb.nom,
      enseignantDb.email,
      enseignantDb.appogee,
      enseignantDb.specialite,
      enseignantDb.cours || []
    );
  }

  toDb() {
    return {
      ...super.toDb(),
      appogee: this.appogee,
      specialite: this.specialite,
      cours: this.cours
    };
  }

  soumettreDemandeReservation(dateDemande, dateReservation, salleId) {
    return {
      dateDemande,
      dateReservation,
      statut: 'En attente',
      enseignantId: this.id,
      salleId
    };
  }

  soumettreIncidentTechnique(description, priorite = 'Normale') {
    return {
      description,
      dateSoumission: new Date(),
      statut: 'Soumis',
      priorite,
      enseignantId: this.id
    };
  }

  enseignerCours() {
    // Implementation logic for teaching courses
  }

  consulterNotes(coursId) {
    // Implementation logic to view notes
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

  consulterDossier() {
    // Implementation logic to view student file
  }

  demanderInscription(formationId) {
    return {
      dateInscription: new Date(),
      statut: 'En attente',
      etudiantId: this.id,
      formationId
    };
  }

  consulterNotes() {
    // Implementation logic to view notes
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

  encadrerRecherche() {
    // Implementation logic for research supervision
  }

  gererEmploiDuTemps() {
    // Implementation logic for schedule management
  }

  gererMateriel() {
    // Implementation logic for equipment management
  }
}

/**
 * Class representing a Personnel entity
 * Extends Personne based on the UML class diagram
 */
export class Personnel extends Personne {
  constructor(id, nom, email, specialite) {
    super(id, nom, email);
    this.specialite = specialite;
  }

  effectuerRecherche() {
    // Implementation logic for conducting research
  }

  publierArticle() {
    // Implementation logic for publishing articles
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

  analyserIncident(incidentId) {
    // Implementation logic for analyzing an incident
  }

  resoudreIncident(incidentId) {
    // Implementation logic for resolving an incident
  }

  fournirAvancement(incidentId, avancement) {
    // Implementation logic for providing progress updates
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

  demanderBudget(montant, justification) {
    // Implementation logic for budget requests
    return {
      montant,
      justification,
      date: new Date(),
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

  validerMaquette(maquetteId) {
    // Implementation logic for validating course templates
  }

  gererMatieres() {
    // Implementation logic for managing subjects
  }
}
