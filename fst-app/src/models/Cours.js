/**
 * Models related to course management
 * Based on the UML class diagram
 */

/**
 * Class representing a Cours entity
 */
export class Cours {
  constructor(code, titre, semestre, annee) {
    this.code = code;
    this.titre = titre;
    this.semestre = semestre;
    this.annee = annee;
  }

  static fromDb(coursDb) {
    return new Cours(
      coursDb.code,
      coursDb.titre,
      coursDb.semestre,
      coursDb.annee
    );
  }

  toDb() {
    return {
      code: this.code,
      titre: this.titre,
      semestre: this.semestre,
      annee: this.annee
    };
  }

  /**
   * Add a new chapter to the course
   * @param {String} titre - Chapter title
   * @param {String} contenu - Chapter content
   * @returns {Object} New chapter data
   */
  ajouterChapitre(titre, contenu) {
    if (!titre || !titre.trim()) {
      throw new Error('Le titre du chapitre ne peut pas être vide');
    }
    
    return {
      titre,
      contenu: contenu || '',
      cours_code: this.code,
      date_creation: new Date()
    };
  }
  
  /**
   * Get all enrolled students for the course
   * @returns {Promise<Array>} List of enrolled students
   */
  async getEtudiantsInscrits() {
    // This would typically query a database
    return []; // Placeholder, would return actual students from DB
  }
}

/**
 * Class representing a Chapitre entity
 */
export class Chapitre {
  constructor(id, titre, contenu, cours_code) {
    this.id = id;
    this.titre = titre;
    this.contenu = contenu;
    this.cours_code = cours_code;
  }

  static fromDb(chapitreDb) {
    return new Chapitre(
      chapitreDb.id,
      chapitreDb.titre,
      chapitreDb.contenu,
      chapitreDb.cours_code
    );
  }

  toDb() {
    return {
      id: this.id,
      titre: this.titre,
      contenu: this.contenu,
      cours_code: this.cours_code
    };
  }
  
  /**
   * Update chapter content
   * @param {String} nouveauContenu - New content for the chapter
   * @returns {Object} Updated chapter data
   */
  mettreAJourContenu(nouveauContenu) {
    this.contenu = nouveauContenu;
    return {
      ...this.toDb(),
      date_modification: new Date()
    };
  }
}

/**
 * Class representing a Séance entity
 */
export class Seance {
  constructor(id, date, duree, salle, type, cours_code) {
    this.id = id;
    this.date = date;
    this.duree = duree;
    this.salle = salle;
    this.type = type;
    this.cours_code = cours_code;
  }

  static fromDb(seanceDb) {
    return new Seance(
      seanceDb.id,
      seanceDb.date,
      seanceDb.duree,
      seanceDb.salle,
      seanceDb.type,
      seanceDb.cours_code
    );
  }

  toDb() {
    return {
      id: this.id,
      date: this.date,
      duree: this.duree,
      salle: this.salle,
      type: this.type,
      cours_code: this.cours_code
    };
  }
  
  /**
   * Reschedule a class session
   * @param {Date} nouvelleDate - New date for the session
   * @param {String} nouvelleSalle - New room for the session
   * @returns {Object} Updated session data
   */
  replanifier(nouvelleDate, nouvelleSalle = null) {
    this.date = nouvelleDate;
    if (nouvelleSalle) {
      this.salle = nouvelleSalle;
    }
    
    return {
      ...this.toDb(),
      date_modification: new Date()
    };
  }
}

/**
 * Class representing an Evaluation entity
 */
export class Evaluation {
  constructor(id, type, date, matiere, note, cours_code, etudiant_id) {
    this.id = id;
    this.type = type;
    this.date = date;
    this.matiere = matiere;
    this.note = note;
    this.cours_code = cours_code;
    this.etudiant_id = etudiant_id;
  }

  static fromDb(evaluationDb) {
    return new Evaluation(
      evaluationDb.id,
      evaluationDb.type,
      evaluationDb.date,
      evaluationDb.matiere,
      evaluationDb.note,
      evaluationDb.cours_code,
      evaluationDb.etudiant_id
    );
  }

  toDb() {
    return {
      id: this.id,
      type: this.type,
      date: this.date,
      matiere: this.matiere,
      note: this.note,
      cours_code: this.cours_code,
      etudiant_id: this.etudiant_id
    };
  }

  /**
   * Calculate average grade from a collection of grades
   * @param {Array} notes - Array of grade objects with values and coefficients
   * @returns {Number} Calculated weighted average
   */
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

  /**
   * Submit homework or assignment
   * @param {String} contenu - Content of the submission
   * @param {Array} pieceJointes - Array of attachments
   * @returns {Object} Submission record
   */
  remettreDevoir(contenu, pieceJointes = []) {
    return {
      evaluation_id: this.id,
      etudiant_id: this.etudiant_id,
      contenu,
      piece_jointes: pieceJointes,
      date_remise: new Date(),
      statut: 'Remis'
    };
  }
}

/**
 * Class representing a Note entity
 */
export class Note {
  constructor(id, valeur, coefficient, evaluation_id, etudiant_id) {
    this.id = id;
    this.valeur = valeur;
    this.coefficient = coefficient;
    this.evaluation_id = evaluation_id;
    this.etudiant_id = etudiant_id;
  }

  static fromDb(noteDb) {
    return new Note(
      noteDb.id,
      noteDb.valeur,
      noteDb.coefficient,
      noteDb.evaluation_id,
      noteDb.etudiant_id
    );
  }

  toDb() {
    return {
      id: this.id,
      valeur: this.valeur,
      coefficient: this.coefficient,
      evaluation_id: this.evaluation_id,
      etudiant_id: this.etudiant_id
    };
  }
  
  /**
   * Convert the numeric grade to a letter grade
   * @returns {String} Letter grade (A, B, C, D, F)
   */
  convertirEnLettre() {
    if (this.valeur >= 16) return 'A';
    if (this.valeur >= 14) return 'B';
    if (this.valeur >= 12) return 'C';
    if (this.valeur >= 10) return 'D';
    return 'F';
  }
}

/**
 * Class representing a Formation entity
 */
export class Formation {
  constructor(code, intitule, duree) {
    this.code = code;
    this.intitule = intitule;
    this.duree = duree;
  }

  static fromDb(formationDb) {
    return new Formation(
      formationDb.code,
      formationDb.intitule,
      formationDb.duree
    );
  }

  toDb() {
    return {
      code: this.code,
      intitule: this.intitule,
      duree: this.duree
    };
  }
  
  /**
   * Get all courses for this program
   * @param {String} semestre - Optional semester filter
   * @returns {Promise<Array>} List of courses
   */
  async getCours(semestre = null) {
    // This would typically query a database
    return []; // Placeholder, would return courses from DB
  }
}

/**
 * Class representing a Délibération entity
 */
export class Deliberation {
  constructor(id, date, statut, administration_id) {
    this.id = id;
    this.date = date;
    this.statut = statut;
    this.administration_id = administration_id;
  }

  static fromDb(deliberationDb) {
    return new Deliberation(
      deliberationDb.id,
      deliberationDb.date,
      deliberationDb.statut,
      deliberationDb.administration_id
    );
  }

  toDb() {
    return {
      id: this.id,
      date: this.date,
      statut: this.statut,
      administration_id: this.administration_id
    };
  }

  /**
   * Decide on a "Non Validé" status for a student in a course
   * @param {Number} etudiantId - ID of the student
   * @param {String} coursCode - Code of the course
   * @param {String} motif - Reason for the NV status
   * @returns {Object} NV decision record
   */
  deciderNV(etudiantId, coursCode, motif) {
    return {
      deliberation_id: this.id,
      etudiant_id: etudiantId,
      cours_code: coursCode,
      status: 'NV',
      motif,
      date: new Date()
    };
  }
  
  /**
   * Validate all grades for a specific course
   * @param {String} coursCode - Code of the course
   * @returns {Object} Validation record
   */
  validerNotes(coursCode) {
    return {
      deliberation_id: this.id,
      cours_code: coursCode,
      date_validation: new Date(),
      statut: 'Validé'
    };
  }
}

/**
 * Class representing association tables for many-to-many relationships
 */
export class Enseignant_Cours {
  constructor(enseignant_id, cours_code) {
    this.enseignant_id = enseignant_id;
    this.cours_code = cours_code;
  }
  
  static fromDb(relationDb) {
    return new Enseignant_Cours(
      relationDb.enseignant_id,
      relationDb.cours_code
    );
  }
  
  toDb() {
    return {
      enseignant_id: this.enseignant_id,
      cours_code: this.cours_code
    };
  }
}

export class Etudiant_Note {
  constructor(etudiant_id, note_id) {
    this.etudiant_id = etudiant_id;
    this.note_id = note_id;
  }
  
  static fromDb(relationDb) {
    return new Etudiant_Note(
      relationDb.etudiant_id,
      relationDb.note_id
    );
  }
  
  toDb() {
    return {
      etudiant_id: this.etudiant_id,
      note_id: this.note_id
    };
  }
}

export class Personnel_Projet {
  constructor(personnel_id, projet_id) {
    this.personnel_id = personnel_id;
    this.projet_id = projet_id;
  }
  
  static fromDb(relationDb) {
    return new Personnel_Projet(
      relationDb.personnel_id,
      relationDb.projet_id
    );
  }
  
  toDb() {
    return {
      personnel_id: this.personnel_id,
      projet_id: this.projet_id
    };
  }
}

export class Deliberation_Absence {
  constructor(deliberation_id, absence_id) {
    this.deliberation_id = deliberation_id;
    this.absence_id = absence_id;
  }
  
  static fromDb(relationDb) {
    return new Deliberation_Absence(
      relationDb.deliberation_id,
      relationDb.absence_id
    );
  }
  
  toDb() {
    return {
      deliberation_id: this.deliberation_id,
      absence_id: this.absence_id
    };
  }
}

export class Deliberation_Evaluation {
  constructor(deliberation_id, evaluation_id) {
    this.deliberation_id = deliberation_id;
    this.evaluation_id = evaluation_id;
  }
  
  static fromDb(relationDb) {
    return new Deliberation_Evaluation(
      relationDb.deliberation_id,
      relationDb.evaluation_id
    );
  }
  
  toDb() {
    return {
      deliberation_id: this.deliberation_id,
      evaluation_id: this.evaluation_id
    };
  }
}
