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

  /**
   * Check if the room is available
   * @returns {Boolean} True if the room is available, false otherwise
   */
  verifierDisponibilite() {
    return this.disponibilite;
  }

  /**
   * Reserve the room if available
   * @returns {Boolean} True if reservation was successful, false otherwise
   */
  reserver() {
    if (this.disponibilite) {
      this.disponibilite = false;
      return true;
    }
    return false;
  }

  /**
   * Release the room's reservation
   * @returns {Boolean} True if the room was released successfully
   */
  liberer() {
    this.disponibilite = true;
    return true;
  }
}

/**
 * Class representing a DemandeRéservation entity
 */
export class DemandeReservation {
  constructor(id, dateDemande, dateReservation, statut, enseignant_id, salle_id, administration_id = null) {
    this.id = id;
    this.dateDemande = dateDemande;
    this.dateReservation = dateReservation;
    this.statut = statut;
    this.enseignant_id = enseignant_id;
    this.salle_id = salle_id;
    this.administration_id = administration_id;
  }

  static fromDb(demandeDb) {
    return new DemandeReservation(
      demandeDb.id,
      demandeDb.dateDemande,
      demandeDb.dateReservation,
      demandeDb.statut,
      demandeDb.enseignant_id,
      demandeDb.salle_id,
      demandeDb.administration_id
    );
  }

  toDb() {
    return {
      id: this.id,
      dateDemande: this.dateDemande,
      dateReservation: this.dateReservation,
      statut: this.statut,
      enseignant_id: this.enseignant_id,
      salle_id: this.salle_id,
      administration_id: this.administration_id
    };
  }

  /**
   * Get the current status of the reservation request
   * @returns {String} Current status of the reservation request
   */
  getStatut() {
    return this.statut;
  }

  /**
   * Update the status of the reservation request
   * @param {String} statut - New status (En attente, Acceptée, Refusée)
   */
  setStatut(statut) {
    if (['En attente', 'Acceptée', 'Refusée'].includes(statut)) {
      this.statut = statut;
    } else {
      throw new Error('Statut invalide. Les valeurs acceptées sont: En attente, Acceptée, Refusée');
    }
  }
}

/**
 * Class representing an IncidentTechnique entity
 */
export class IncidentTechnique {
  constructor(id, description, dateSoumission, statut, priorite, enseignant_id, technicien_id = null, administration_id = null) {
    this.id = id;
    this.description = description;
    this.dateSoumission = dateSoumission;
    this.statut = statut;
    this.priorite = priorite;
    this.enseignant_id = enseignant_id;
    this.technicien_id = technicien_id;
    this.administration_id = administration_id;
  }

  static fromDb(incidentDb) {
    return new IncidentTechnique(
      incidentDb.id,
      incidentDb.description,
      incidentDb.dateSoumission,
      incidentDb.statut,
      incidentDb.priorite,
      incidentDb.enseignant_id,
      incidentDb.technicien_id,
      incidentDb.administration_id
    );
  }

  toDb() {
    return {
      id: this.id,
      description: this.description,
      dateSoumission: this.dateSoumission,
      statut: this.statut,
      priorite: this.priorite,
      enseignant_id: this.enseignant_id,
      technicien_id: this.technicien_id,
      administration_id: this.administration_id
    };
  }

  /**
   * Get the current status of the incident
   * @returns {String} Current status of the incident
   */
  getStatut() {
    return this.statut;
  }

  /**
   * Update the status of the incident
   * @param {String} statut - New status (Soumis, Assigné, En cours, Résolu, Fermé)
   */
  setStatut(statut) {
    const statusOptions = ['Soumis', 'Assigné', 'En cours', 'Résolu', 'Fermé'];
    if (statusOptions.includes(statut)) {
      this.statut = statut;
    } else {
      throw new Error(`Statut invalide. Les valeurs acceptées sont: ${statusOptions.join(', ')}`);
    }
  }
  
  /**
   * Assign a technician to the incident
   * @param {Number} technicienId - ID of the technician
   * @returns {Object} Updated incident data
   */
  assignerTechnicien(technicienId) {
    this.technicien_id = technicienId;
    this.statut = 'Assigné';
    return this;
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
  constructor(id, nom, personnel, encadrant, chef_labo_id) {
    this.id = id;
    this.nom = nom;
    this.personnel = personnel;
    this.encadrant = encadrant;
    this.chef_labo_id = chef_labo_id;
  }

  static fromDb(projetDb) {
    return new Projet(
      projetDb.id,
      projetDb.nom,
      projetDb.personnel,
      projetDb.encadrant,
      projetDb.chef_labo_id
    );
  }

  toDb() {
    return {
      id: this.id,
      nom: this.nom,
      personnel: this.personnel,
      encadrant: this.encadrant,
      chef_labo_id: this.chef_labo_id
    };
  }
  
  /**
   * Add personnel to the project
   * @param {Number} personnelId - ID of the personnel to add
   * @returns {Object} Personnel assignment record
   */
  ajouterPersonnel(personnelId) {
    return {
      projet_id: this.id,
      personnel_id: personnelId,
      date_ajout: new Date()
    };
  }
}

/**
 * Class representing a Matériel entity
 */
export class Materiel {
  constructor(id, nom, type, quantite, chef_labo_id) {
    this.id = id;
    this.nom = nom;
    this.type = type;
    this.quantite = quantite;
    this.chef_labo_id = chef_labo_id;
  }

  static fromDb(materielDb) {
    return new Materiel(
      materielDb.id,
      materielDb.nom,
      materielDb.type,
      materielDb.quantite,
      materielDb.chef_labo_id
    );
  }

  toDb() {
    return {
      id: this.id,
      nom: this.nom,
      type: this.type,
      quantite: this.quantite,
      chef_labo_id: this.chef_labo_id
    };
  }
  
  /**
   * Update the quantity of equipment
   * @param {Number} nouvelleQuantite - New quantity value
   * @returns {Boolean} True if the update was successful
   */
  mettreAJourQuantite(nouvelleQuantite) {
    if (nouvelleQuantite >= 0) {
      this.quantite = nouvelleQuantite;
      return true;
    }
    return false;
  }
}
