/**
 * Model for Administration
 * Based on the UML class diagram
 */
export class Administration {
  constructor(id) {
    this.id = id;
  }

  static fromDb(adminDb) {
    return new Administration(
      adminDb.id
    );
  }

  toDb() {
    return {
      id: this.id
    };
  }

  planifierSeance(seance) {
    // Check if the seance's date is at least 7 days in the future (deadline requirement)
    const today = new Date();
    const seanceDate = new Date(seance.date);
    const diffTime = Math.abs(seanceDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      throw new Error("La séance doit être planifiée au moins 7 jours à l'avance.");
    }
    
    return seance;
  }

  gererReservation(demandeReservation, accepte = true) {
    demandeReservation.statut = accepte ? 'Acceptée' : 'Refusée';
    return demandeReservation;
  }

  transmettreIncident(incident, technicienId) {
    incident.statut = 'Assigné';
    incident.technicienId = technicienId;
    return incident;
  }

  genererBulletin(etudiantId, semestre, annee) {
    return {
      etudiantId,
      semestre,
      annee,
      dateGeneration: new Date(),
      statut: 'Généré'
    };
  }

  affecterCours(enseignantId, coursId) {
    return {
      enseignantId,
      coursId,
      dateAffectation: new Date()
    };
  }

  validerNotes(evaluationId, validate = true) {
    return {
      evaluationId,
      statut: validate ? 'Validée' : 'Rejetée',
      dateValidation: new Date()
    };
  }

  verifierDisponibiliteSalle(salleId, date) {
    // Logic to check room availability for a given date
    return true; // Placeholder
  }

  enregistrerIncident(incident) {
    incident.statut = 'Enregistré';
    return incident;
  }

  mettreAJourEtatIncident(incidentId, nouvelEtat) {
    return {
      incidentId,
      statut: nouvelEtat,
      dateMiseAJour: new Date()
    };
  }

  gererSalles(salleId, action) {
    // Logic to manage classrooms (add, modify, delete)
    return {
      salleId,
      action,
      dateAction: new Date()
    };
  }
}
