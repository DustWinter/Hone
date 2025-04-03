/**
 * Models related to course management
 * Based on the UML class diagram
 */

/**
 * Class representing a Cours entity
 */
export class Cours {
  constructor(id, code, titre, semestre, annee, enseignantIds = [], chapitreIds = []) {
    this.id = id;
    this.code = code;
    this.titre = titre;
    this.semestre = semestre;
    this.annee = annee;
    this.enseignantIds = enseignantIds;
    this.chapitreIds = chapitreIds;
  }

  static fromDb(coursDb) {
    return new Cours(
      coursDb.id,
      coursDb.code,
      coursDb.titre,
      coursDb.semestre,
      coursDb.annee,
      coursDb.enseignantIds || [],
      coursDb.chapitreIds || []
    );
  }

  toDb() {
    return {
      id: this.id,
      code: this.code,
      titre: this.titre,
      semestre: this.semestre,
      annee: this.annee,
      enseignantIds: this.enseignantIds,
      chapitreIds: this.chapitreIds
    };
  }

  ajouterChapitre(titre, contenu) {
    return {
      titre,
      contenu,
      coursId: this.id
    };
  }
}

/**
 * Class representing a Chapitre entity
 */
export class Chapitre {
  constructor(id, titre, contenu, coursId) {
    this.id = id;
    this.titre = titre;
    this.contenu = contenu;
    this.coursId = coursId;
  }

  static fromDb(chapitreDb) {
    return new Chapitre(
      chapitreDb.id,
      chapitreDb.titre,
      chapitreDb.contenu,
      chapitreDb.coursId
    );
  }

  toDb() {
    return {
      id: this.id,
      titre: this.titre,
      contenu: this.contenu,
      coursId: this.coursId
    };
  }
}

/**
 * Class representing a Séance entity
 */
export class Seance {
  constructor(id, date, duree, salle, type, coursId) {
    this.id = id;
    this.date = date;
    this.duree = duree;
    this.salle = salle;
    this.type = type;
    this.coursId = coursId;
  }

  static fromDb(seanceDb) {
    return new Seance(
      seanceDb.id,
      seanceDb.date,
      seanceDb.duree,
      seanceDb.salle,
      seanceDb.type,
      seanceDb.coursId
    );
  }

  toDb() {
    return {
      id: this.id,
      date: this.date,
      duree: this.duree,
      salle: this.salle,
      type: this.type,
      coursId: this.coursId
    };
  }
}

/**
 * Class representing an Evaluation entity
 */
export class Evaluation {
  constructor(id, type, date, matiere, coursId) {
    this.id = id;
    this.type = type;
    this.date = date;
    this.matiere = matiere;
    this.coursId = coursId;
  }

  static fromDb(evaluationDb) {
    return new Evaluation(
      evaluationDb.id,
      evaluationDb.type,
      evaluationDb.date,
      evaluationDb.matiere,
      evaluationDb.coursId
    );
  }

  toDb() {
    return {
      id: this.id,
      type: this.type,
      date: this.date,
      matiere: this.matiere,
      coursId: this.coursId
    };
  }

  calculerMoyenne(notes) {
    if (!notes || notes.length === 0) return 0;
    
    const totalWeightedValue = notes.reduce((sum, note) => {
      return sum + (note.valeur * note.coefficient);
    }, 0);
    
    const totalCoefficient = notes.reduce((sum, note) => {
      return sum + note.coefficient;
    }, 0);
    
    return totalCoefficient > 0 ? totalWeightedValue / totalCoefficient : 0;
  }

  remettreDevoir() {
    // Implementation logic for submitting homework
  }
}

/**
 * Class representing a Note entity
 */
export class Note {
  constructor(id, valeur, coefficient, evaluationId, etudiantId) {
    this.id = id;
    this.valeur = valeur;
    this.coefficient = coefficient;
    this.evaluationId = evaluationId;
    this.etudiantId = etudiantId;
  }

  static fromDb(noteDb) {
    return new Note(
      noteDb.id,
      noteDb.valeur,
      noteDb.coefficient,
      noteDb.evaluationId,
      noteDb.etudiantId
    );
  }

  toDb() {
    return {
      id: this.id,
      valeur: this.valeur,
      coefficient: this.coefficient,
      evaluationId: this.evaluationId,
      etudiantId: this.etudiantId
    };
  }
}

/**
 * Class representing a Formation entity
 */
export class Formation {
  constructor(id, code, intitule, duree) {
    this.id = id;
    this.code = code;
    this.intitule = intitule;
    this.duree = duree;
  }

  static fromDb(formationDb) {
    return new Formation(
      formationDb.id,
      formationDb.code,
      formationDb.intitule,
      formationDb.duree
    );
  }

  toDb() {
    return {
      id: this.id,
      code: this.code,
      intitule: this.intitule,
      duree: this.duree
    };
  }
}

/**
 * Class representing a Délibération entity
 */
export class Deliberation {
  constructor(id, date, statut) {
    this.id = id;
    this.date = date;
    this.statut = statut;
  }

  static fromDb(deliberationDb) {
    return new Deliberation(
      deliberationDb.id,
      deliberationDb.date,
      deliberationDb.statut
    );
  }

  toDb() {
    return {
      id: this.id,
      date: this.date,
      statut: this.statut
    };
  }

  deciderNV(etudiantId, coursId, motif) {
    // Implementation logic for deciding on NV (Non Validé) status
    return {
      etudiantId,
      coursId,
      status: 'NV',
      motif,
      date: new Date()
    };
  }
}
