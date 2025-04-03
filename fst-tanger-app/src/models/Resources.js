/**
 * Models related to resource management
 * Based on the UML class diagram
 */

/**
 * Class representing a SalleCoursLabo entity
 */
export class SalleCoursLabo {
  constructor(id, nomSalle, capacite, disponibilite = true) {
    this.id = id;
    this.nomSalle = nomSalle;
    this.capacite = capacite;
    this.disponibilite = disponibilite;
  }

  static fromDb(salleDb) {
    return new SalleCoursLabo(
      salleDb.id,
      salleDb.nomSalle,
      salleDb.capacite,
      salleDb.disponibilite
    );
  }

  toDb() {
    return {
      id: this.id,
      nomSalle: this.nomSalle,
      capacite: this.capacite,
      disponibilite: this.disponibilite
    };
  }

  verifierDisponibilite() {
    return this.disponibilite;
  }

  reserver() {
    if (this.disponibilite) {
      this.disponibilite = false;
      return true;
    }
    return false;
  }
}

/**
 * Class representing a DemandeRéservation entity
 */
export class DemandeReservation {
  constructor(id, dateDemande, dateReservation, statut, enseignantId, salleId) {
    this.id = id;
    this.dateDemande = dateDemande;
    this.dateReservation = dateReservation;
    this.statut = statut;
    this.enseignantId = enseignantId;
    this.salleId = salleId;
  }

  static fromDb(demandeDb) {
    return new DemandeReservation(
      demandeDb.id,
      demandeDb.dateDemande,
      demandeDb.dateReservation,
      demandeDb.statut,
      demandeDb.enseignantId,
      demandeDb.salleId
    );
  }

  toDb() {
    return {
      id: this.id,
      dateDemande: this.dateDemande,
      dateReservation: this.dateReservation,
      statut: this.statut,
      enseignantId: this.enseignantId,
      salleId: this.salleId
    };
  }

  getStatut() {
    return this.statut;
  }

  setStatut(statut) {
    this.statut = statut;
  }
}

/**
 * Class representing an IncidentTechnique entity
 */
export class IncidentTechnique {
  constructor(id, description, dateSoumission, statut, priorite, enseignantId, technicienId = null) {
    this.id = id;
    this.description = description;
    this.dateSoumission = dateSoumission;
    this.statut = statut;
    this.priorite = priorite;
    this.enseignantId = enseignantId;
    this.technicienId = technicienId;
  }

  static fromDb(incidentDb) {
    return new IncidentTechnique(
      incidentDb.id,
      incidentDb.description,
      incidentDb.dateSoumission,
      incidentDb.statut,
      incidentDb.priorite,
      incidentDb.enseignantId,
      incidentDb.technicienId
    );
  }

  toDb() {
    return {
      id: this.id,
      description: this.description,
      dateSoumission: this.dateSoumission,
      statut: this.statut,
      priorite: this.priorite,
      enseignantId: this.enseignantId,
      technicienId: this.technicienId
    };
  }

  getStatut() {
    return this.statut;
  }

  setStatut(statut) {
    this.statut = statut;
  }
}

/**
 * Class representing a Laboratoire entity
 */
export class Laboratoire {
  constructor(id, encadrant_id) {
    this.id = id;
    this.encadrant_id = encadrant_id;
  }

  static fromDb(laboratoireDb) {
    return new Laboratoire(
      laboratoireDb.id,
      laboratoireDb.encadrant_id
    );
  }

  toDb() {
    return {
      id: this.id,
      encadrant_id: this.encadrant_id
    };
  }
}

/**
 * Class representing a Projet entity
 */
export class Projet {
  constructor(id, nom, personnel, encadrant) {
    this.id = id;
    this.nom = nom;
    this.personnel = personnel;
    this.encadrant = encadrant;
  }

  static fromDb(projetDb) {
    return new Projet(
      projetDb.id,
      projetDb.nom,
      projetDb.personnel,
      projetDb.encadrant
    );
  }

  toDb() {
    return {
      id: this.id,
      nom: this.nom,
      personnel: this.personnel,
      encadrant: this.encadrant
    };
  }
}

/**
 * Class representing a Matériel entity
 */
export class Materiel {
  constructor(id, nom, type, quantite, laboratoireId) {
    this.id = id;
    this.nom = nom;
    this.type = type;
    this.quantite = quantite;
    this.laboratoireId = laboratoireId;
  }

  static fromDb(materielDb) {
    return new Materiel(
      materielDb.id,
      materielDb.nom,
      materielDb.type,
      materielDb.quantite,
      materielDb.laboratoireId
    );
  }

  toDb() {
    return {
      id: this.id,
      nom: this.nom,
      type: this.type,
      quantite: this.quantite,
      laboratoireId: this.laboratoireId
    };
  }
}
