/**
 * Models related to student management
 * Based on the UML class diagram
 */

/**
 * Class representing an Absence entity
 */
export class Absence {
  constructor(id, date, motif, justifiee, etudiantId, coursId) {
    this.id = id;
    this.date = date;
    this.motif = motif;
    this.justifiee = justifiee;
    this.etudiantId = etudiantId;
    this.coursId = coursId;
  }

  static fromDb(absenceDb) {
    return new Absence(
      absenceDb.id,
      absenceDb.date,
      absenceDb.motif,
      absenceDb.justifiee,
      absenceDb.etudiantId,
      absenceDb.coursId
    );
  }

  toDb() {
    return {
      id: this.id,
      date: this.date,
      motif: this.motif,
      justifiee: this.justifiee,
      etudiantId: this.etudiantId,
      coursId: this.coursId
    };
  }

  justifierAbsence(justificatif) {
    this.justifiee = true;
    this.motif = justificatif;
    return true;
  }

  consulterAbsence() {
    return {
      date: this.date,
      motif: this.motif,
      justifiee: this.justifiee,
      coursId: this.coursId
    };
  }
}

/**
 * Class representing an Inscription entity
 */
export class Inscription {
  constructor(id, dateInscription, statut, etudiantId, formationId) {
    this.id = id;
    this.dateInscription = dateInscription;
    this.statut = statut;
    this.etudiantId = etudiantId;
    this.formationId = formationId;
  }

  static fromDb(inscriptionDb) {
    return new Inscription(
      inscriptionDb.id,
      inscriptionDb.dateInscription,
      inscriptionDb.statut,
      inscriptionDb.etudiantId,
      inscriptionDb.formationId
    );
  }

  toDb() {
    return {
      id: this.id,
      dateInscription: this.dateInscription,
      statut: this.statut,
      etudiantId: this.etudiantId,
      formationId: this.formationId
    };
  }

  creerInscription() {
    return {
      ...this.toDb(),
      dateInscription: new Date()
    };
  }

  creerDossier() {
    return {
      inscriptionId: this.id,
      dateCreation: new Date(),
      statut: 'Créé'
    };
  }
}

/**
 * Class representing a Stage entity
 */
export class Stage {
  constructor(id, dateDebut, dateFin, entreprise, sujet, etudiantId) {
    this.id = id;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.entreprise = entreprise;
    this.sujet = sujet;
    this.etudiantId = etudiantId;
  }

  static fromDb(stageDb) {
    return new Stage(
      stageDb.id,
      stageDb.dateDebut,
      stageDb.dateFin,
      stageDb.entreprise,
      stageDb.sujet,
      stageDb.etudiantId
    );
  }

  toDb() {
    return {
      id: this.id,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      entreprise: this.entreprise,
      sujet: this.sujet,
      etudiantId: this.etudiantId
    };
  }

  realiserStage() {
    // Implementation for stage execution logic
  }
}

/**
 * Class representing an EmploiDuTemps entity
 */
export class EmploiDuTemps {
  constructor(id, id_session, intervalle, jour, utilisateur_id) {
    this.id = id;
    this.id_session = id_session;
    this.intervalle = intervalle;
    this.jour = jour;
    this.utilisateur_id = utilisateur_id;
  }

  static fromDb(emploiDb) {
    return new EmploiDuTemps(
      emploiDb.id,
      emploiDb.id_session,
      emploiDb.intervalle,
      emploiDb.jour,
      emploiDb.utilisateur_id
    );
  }

  toDb() {
    return {
      id: this.id,
      id_session: this.id_session,
      intervalle: this.intervalle,
      jour: this.jour,
      utilisateur_id: this.utilisateur_id
    };
  }
}
