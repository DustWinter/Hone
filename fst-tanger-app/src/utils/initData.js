import db from './db';

/**
 * Initialize the database with sample data for development
 * This function adds test data to IndexedDB for all major entities
 */
const initializeSampleData = async () => {
  console.log('Initializing sample data...');
  
  try {
    // Check if data already exists
    const personCount = await db.personnes.count();
    if (personCount > 0) {
      console.log('Sample data already initialized');
      return;
    }
    
    // Clear any existing data
    await db.delete();
    await db.open();
    
    // Add sample data for each entity
    await addSamplePersonnes();
    await addSampleEnseignants();
    await addSampleEtudiants();
    await addSampleTechniciens();
    await addRooms();
    await addPrograms();
    await addSampleFormations();
    await addSampleSalles();
    await addSampleCours();
    
    console.log('Sample data initialization complete');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Add sample Personne records
const addSamplePersonnes = async () => {
  await db.personnes.bulkAdd([
    { id: 1, nom: 'EL BRAK Mohamed', email: 'melbrak@uae.ac.ma' },
    { id: 2, nom: 'BENNIS Rachid', email: 'rbennis@uae.ac.ma' },
    { id: 3, nom: 'ZRIKEM Jamal', email: 'jzrikem@uae.ac.ma' },
    { id: 4, nom: 'OUAHIDI Bouabid', email: 'bouahidi@uae.ac.ma' },
    { id: 5, nom: 'MAMOUNI Abdallah', email: 'amamouni@uae.ac.ma' },
    { id: 6, nom: 'BENNOUNA Mohamed', email: 'mbennouna@uae.ac.ma' },
    { id: 7, nom: 'SAMIRA Rahali', email: 'srahali@uae.ac.ma' },
    { id: 8, nom: 'KHALDI Omar', email: 'okhaldi@uae.ac.ma' },
    { id: 9, nom: 'LAHMAR Ahmed', email: 'alahmar@uae.ac.ma' },
    { id: 10, nom: 'ALAOUI Karim', email: 'kalaoui@uae.ac.ma' },
    // Students
    { id: 101, nom: 'IDRISSI Mohammed', email: 'midrissi@student.uae.ac.ma' },
    { id: 102, nom: 'TAZI Nadia', email: 'ntazi@student.uae.ac.ma' },
    { id: 103, nom: 'BENZIANE Kamal', email: 'kbenziane@student.uae.ac.ma' },
    { id: 104, nom: 'BOUHLAL Fatima', email: 'fbouhlal@student.uae.ac.ma' },
    { id: 105, nom: 'LMAHJOUBI Younes', email: 'ylmahjoubi@student.uae.ac.ma' },
    // Technicians
    { id: 201, nom: 'BOUSSEFIANI Ahmed', email: 'aboussefiani@uae.ac.ma' },
    { id: 202, nom: 'ZOUGAGHI Mounir', email: 'mzougaghi@uae.ac.ma' },
  ]);
};

// Add sample Enseignant records
const addSampleEnseignants = async () => {
  await db.enseignants.bulkAdd([
    { id: 1, appogee: 'ENS001', specialite: 'Génie Informatique', cours: [] },
    { id: 2, appogee: 'ENS002', specialite: 'Réseaux et Systèmes', cours: [] },
    { id: 3, appogee: 'ENS003', specialite: 'Base de Données', cours: [] },
    { id: 4, appogee: 'ENS004', specialite: 'Intelligence Artificielle', cours: [] },
    { id: 5, appogee: 'ENS005', specialite: 'Analyse Numérique', cours: [] },
  ]);
  
  // Add admin roles
  await db.chefDepartement.add({ id: 1 });
  await db.coordinateurs.add({ id: 2 });
  await db.chefDeLabo.add({ id: 3 });
  
  // Add technicians
  await db.techniciens.bulkAdd([
    { id: 201, specialite: 'Maintenance Informatique' },
    { id: 202, specialite: 'Réseaux' },
  ]);
};

// Add sample Etudiant records
const addSampleEtudiants = async () => {
  await db.etudiants.bulkAdd([
    { 
      id: 101, 
      appogee: 18000001, 
      prenom: 'Mohammed', 
      dateNaissance: new Date(1998, 5, 15),
      adresse: 'Tanger, Rue Al Moujahidine N°35' 
    },
    { 
      id: 102, 
      appogee: 18000002, 
      prenom: 'Nadia', 
      dateNaissance: new Date(1999, 3, 22),
      adresse: 'Tanger, Avenue Moulay Ismail N°12' 
    },
    { 
      id: 103, 
      appogee: 18000003, 
      prenom: 'Kamal', 
      dateNaissance: new Date(1997, 11, 7),
      adresse: 'Tétouan, Rue Ben Karrich N°8' 
    },
    { 
      id: 104, 
      appogee: 18000004, 
      prenom: 'Fatima', 
      dateNaissance: new Date(1998, 8, 19),
      adresse: 'Tanger, Boulevard Mohamed VI N°45' 
    },
    { 
      id: 105, 
      appogee: 18000005, 
      prenom: 'Younes', 
      dateNaissance: new Date(1999, 1, 28),
      adresse: 'Tanger, Rue Al Andalous N°23' 
    }
  ]);
};

// Add sample Technicien records
const addSampleTechniciens = async () => {
  await db.techniciens.bulkAdd([
    { id: 201, specialite: 'Maintenance Informatique' },
    { id: 202, specialite: 'Réseaux' },
  ]);
};

// Add rooms data
const addRooms = async () => {
  await db.sallesCoursLabo.bulkAdd([
    // 1st floor
    {id: 'E01', etage: 1, type: 'Salle de cours', capacite: 30},
    {id: 'E02', etage: 1, type: 'Salle de cours', capacite: 30},
    
    // 2nd floor
    {id: 'E11', etage: 2, type: 'Salle de cours', capacite: 30},
    {id: 'E12', etage: 2, type: 'Salle de cours', capacite: 30},
    {id: 'E13', etage: 2, type: 'Laboratoire', capacite: 20},
    {id: 'E14', etage: 2, type: 'Laboratoire', capacite: 20},
    {id: 'E15', etage: 2, type: 'Salle de cours', capacite: 30},
    {id: 'E16', etage: 2, type: 'Salle de cours', capacite: 30},
    {id: 'E17', etage: 2, type: 'Laboratoire', capacite: 20},
    {id: 'E18', etage: 2, type: 'Laboratoire', capacite: 20},
    
    // 3rd floor
    {id: 'E21', etage: 3, type: 'Salle de cours', capacite: 30},
    {id: 'E22', etage: 3, type: 'Salle de cours', capacite: 30},
    {id: 'E23', etage: 3, type: 'Laboratoire', capacite: 20},
    {id: 'E24', etage: 3, type: 'Laboratoire', capacite: 20},
    {id: 'E25', etage: 3, type: 'Salle de cours', capacite: 30},
    {id: 'E26', etage: 3, type: 'Salle de cours', capacite: 30}
  ]);
};

// Add academic programs
const addPrograms = async () => {
  await db.programmes.bulkAdd([
    {
      id: 'LST-DA',
      nom: 'LST: Analytique des données',
      niveau: 'Licence',
      coordinateur: 'wbaida@uae.ac.ma',
      semestres: {
        5: {
          courses: [
            {nom: 'Mathématiques pour la science des données', credits: 4, professeurs: [1, 2]},
            {nom: 'Structures des données avancées', credits: 3, professeurs: [3]},
            {nom: 'Fondamentaux des bases de données', credits: 3, professeurs: [4]},
            {nom: 'Algorithmique avancée', credits: 4, professeurs: [5]},
            {nom: 'Développement WEB', credits: 3, professeurs: [1]},
            {nom: 'Soft skills', credits: 2, professeurs: [2]},
          ]
        },
        6: {
          courses: [
            {nom: 'Analyse et fouille de données', credits: 4, professeurs: [3]},
            {nom: 'Systèmes et réseaux', credits: 3, professeurs: [4]},
            {nom: 'Ingénierie des données', credits: 4, professeurs: [5]},
            {nom: 'PFE', credits: 6, professeurs: [1, 2, 3, 4, 5]},
          ]
        }
      }
    },
    {
      id: 'LST-IDAI',
      nom: 'LST: Ingénierie de développement',
      niveau: 'Licence',
      coordinateur: 'm.kounaidi@uae.ac.ma',
      semestres: {
        5: {
          courses: [
            {nom: 'Modélisations avancée', credits: 4, professeurs: [1]},
            {nom: 'Développement Web', credits: 3, professeurs: [2]},
            {nom: 'Bases de données', credits: 3, professeurs: [3]},
            {nom: 'Programmation OO', credits: 4, professeurs: [4]},
            {nom: 'Systèmes et réseaux', credits: 3, professeurs: [5]},
            {nom: 'Soft skills', credits: 2, professeurs: [1]},
          ]
        },
        6: {
          courses: [
            {nom: 'Innover et Entreprendre', credits: 4, professeurs: [2]},
            {nom: 'Développement mobile', credits: 3, professeurs: [3]},
            {nom: 'Développement web Back end', credits: 4, professeurs: [4]},
            {nom: 'PFE', credits: 6, professeurs: [1, 2, 3, 4, 5]},
          ]
        }
      }
    },
    {
      id: 'DI-LSI',
      nom: 'DI: Logiciels et Systèmes Intelligents',
      niveau: 'Ingénieurie',
      coordinateur: 'lelaachak@uae.ac.ma',
      semestres: {
        1: {
          courses: [
            {nom: 'Théorie des graphes', credits: 4, professeurs: [1]},
            {nom: 'Systèmes Linux', credits: 3, professeurs: [2]},
            {nom: 'Programmation OO', credits: 4, professeurs: [3]},
            {nom: 'Bases de données avancées', credits: 3, professeurs: [4]},
            {nom: 'Technologies web 1', credits: 3, professeurs: [5]},
            {nom: 'Digital skills', credits: 2, professeurs: [1]},
            {nom: 'Langues étrangères 1', credits: 2, professeurs: [2]},
          ]
        },
        2: {
          courses: [
            {nom: 'Technologies web 2', credits: 3, professeurs: [3]},
            {nom: 'Conception NoSQL', credits: 4, professeurs: [4]},
            {nom: 'JAVA avancé', credits: 4, professeurs: [5]},
            {nom: 'Architectures Réseau', credits: 3, professeurs: [1]},
            {nom: 'Systèmes embarqués', credits: 4, professeurs: [2]},
            {nom: 'Culture & arts', credits: 2, professeurs: [3]},
            {nom: 'Langues étrangères 2', credits: 2, professeurs: [4]},
          ]
        },
        3: {
          courses: [
            {nom: 'Méthodologies IA', credits: 4, professeurs: [5]},
            {nom: 'Admin bases de données', credits: 3, professeurs: [1]},
            {nom: 'IoT et applications', credits: 4, professeurs: [2]},
            {nom: 'Applications web JEE', credits: 4, professeurs: [3]},
            {nom: 'Génie Logiciel', credits: 3, professeurs: [4]},
            {nom: 'Intelligence artificielle', credits: 4, professeurs: [5]},
            {nom: 'Langues étrangères 3', credits: 2, professeurs: [1]},
          ]
        },
        4: {
          courses: [
            {nom: 'Admin réseaux', credits: 3, professeurs: [2]},
            {nom: 'Cryptographie', credits: 4, professeurs: [3]},
            {nom: 'Systèmes multi agents', credits: 4, professeurs: [4]},
            {nom: 'Applications mobiles', credits: 4, professeurs: [5]},
            {nom: 'Architecture BIG DATA', credits: 3, professeurs: [1]},
            {nom: 'Employment Skills', credits: 2, professeurs: [2]},
            {nom: 'Langues étrangères 4', credits: 2, professeurs: [3]},
          ]
        },
        5: {
          courses: [
            {nom: 'Vision artificielle', credits: 4, professeurs: [4]},
            {nom: 'Cloud computing', credits: 3, professeurs: [5]},
            {nom: 'Cybersécurité', credits: 4, professeurs: [1]},
            {nom: 'Deep Learning', credits: 4, professeurs: [2]},
            {nom: 'Aide à la décision', credits: 3, professeurs: [3]},
            {nom: 'Langues étrangères 5', credits: 2, professeurs: [4]},
            {nom: 'Gestion D\'entreprise', credits: 2, professeurs: [5]},
          ]
        },
        6: {
          courses: [
            {nom: 'Projet de fin d\'étude', credits: 12, professeurs: [1, 2, 3, 4, 5]},
          ]
        }
      }
    },
    {
      id: 'MST-IASD',
      nom: 'MST: Intelligence Artificielle',
      niveau: 'Master',
      coordinateur: 'mezziyyani@uae.ac.ma',
      semestres: {
        1: {
          courses: [
            {nom: 'Systèmes intelligents', credits: 4, professeurs: [1]},
            {nom: 'Mathématiques pour données', credits: 3, professeurs: [2]},
            {nom: 'Programmation avancée', credits: 4, professeurs: [3]},
            {nom: 'Bases de données avancées', credits: 3, professeurs: [4]},
            {nom: 'Machine Learning 1', credits: 4, professeurs: [5]},
            {nom: 'Anglais technique', credits: 2, professeurs: [1]},
          ]
        },
        2: {
          courses: [
            {nom: 'Architectures Big Data', credits: 3, professeurs: [2]},
            {nom: 'Technologies IoT', credits: 4, professeurs: [3]},
            {nom: 'Metaheuristiques', credits: 4, professeurs: [4]},
            {nom: 'SMA & NLP', credits: 4, professeurs: [5]},
            {nom: 'Dataming & BI', credits: 3, professeurs: [1]},
            {nom: 'Développement personnel', credits: 2, professeurs: [2]},
          ]
        },
        3: {
          courses: [
            {nom: 'Multimedia Mining', credits: 4, professeurs: [3]},
            {nom: 'Machine Learning 2', credits: 4, professeurs: [4]},
            {nom: 'Data Integration', credits: 3, professeurs: [5]},
            {nom: 'Blockchain', credits: 4, professeurs: [1]},
            {nom: 'Cloud Computing', credits: 3, professeurs: [2]},
            {nom: 'Digital Business', credits: 2, professeurs: [3]},
          ]
        },
        4: {
          courses: [
            {nom: 'Projet de fin d\'étude', credits: 12, professeurs: [1, 2, 3, 4, 5]},
          ]
        }
      }
    },
    {
      id: 'MST-SITBD',
      nom: 'MST: Sécurité IT et Big Data',
      niveau: 'Master',
      coordinateur: 'mstsit.bd@gmail.com',
      semestres: {
        1: {
          courses: [
            {nom: 'Programmation avancée', credits: 4, professeurs: [1]},
            {nom: 'Réseaux avancés', credits: 3, professeurs: [2]},
            {nom: 'Data Mining', credits: 4, professeurs: [3]},
            {nom: 'Admin systèmes', credits: 3, professeurs: [4]},
            {nom: 'Concepts IA', credits: 4, professeurs: [5]},
            {nom: 'Anglais technique', credits: 2, professeurs: [1]},
          ]
        },
        2: {
          courses: [
            {nom: 'IA Distribuée', credits: 3, professeurs: [2]},
            {nom: 'Technologies IoT', credits: 4, professeurs: [3]},
            {nom: 'Cloud Computing', credits: 3, professeurs: [4]},
            {nom: 'Cryptographie', credits: 4, professeurs: [5]},
            {nom: 'Architecture Big Data', credits: 3, professeurs: [1]},
            {nom: 'Management de projet', credits: 2, professeurs: [2]},
          ]
        },
        3: {
          courses: [
            {nom: 'Cybersecurity', credits: 4, professeurs: [3]},
            {nom: 'Calcul Haute Performance', credits: 4, professeurs: [4]},
            {nom: 'Deep learning', credits: 4, professeurs: [5]},
            {nom: 'Bases de données distribuées', credits: 3, professeurs: [1]},
            {nom: 'Audit systèmes', credits: 4, professeurs: [2]},
            {nom: 'Développement personnel', credits: 2, professeurs: [3]},
          ]
        },
        4: {
          courses: [
            {nom: 'Projet de fin d\'étude', credits: 12, professeurs: [1, 2, 3, 4, 5]},
          ]
        }
      }
    }
  ]);
};

// Add sample Formation records
const addSampleFormations = async () => {
  await db.formations.bulkAdd([
    { id: 1, code: 'LGI', intitule: 'Licence en Génie Informatique', duree: 3 },
    { id: 2, code: 'MGI', intitule: 'Master en Génie Informatique', duree: 2 },
    { id: 3, code: 'DGI', intitule: 'Doctorat en Génie Informatique', duree: 3 }
  ]);
  
  // Add sample inscriptions
  await db.inscriptions.bulkAdd([
    { id: 1, dateInscription: new Date(2023, 8, 15), statut: 'Validée', etudiantId: 101, formationId: 1 },
    { id: 2, dateInscription: new Date(2023, 8, 16), statut: 'Validée', etudiantId: 102, formationId: 1 },
    { id: 3, dateInscription: new Date(2023, 8, 16), statut: 'Validée', etudiantId: 103, formationId: 1 },
    { id: 4, dateInscription: new Date(2023, 8, 17), statut: 'Validée', etudiantId: 104, formationId: 1 },
    { id: 5, dateInscription: new Date(2023, 8, 17), statut: 'Validée', etudiantId: 105, formationId: 1 }
  ]);
};

// Add sample SalleCoursLabo records
const addSampleSalles = async () => {
  await db.sallesCoursLabo.bulkAdd([
    { id: 1, nomSalle: 'A101', capacite: 30, disponibilite: true },
    { id: 2, nomSalle: 'A102', capacite: 25, disponibilite: true },
    { id: 3, nomSalle: 'B201', capacite: 40, disponibilite: true },
    { id: 4, nomSalle: 'C305', capacite: 20, disponibilite: true },
    { id: 5, nomSalle: 'LAB-INFO-1', capacite: 15, disponibilite: true },
    { id: 6, nomSalle: 'LAB-INFO-2', capacite: 15, disponibilite: true }
  ]);
};

// Add sample Cours records with related entities
const addSampleCours = async () => {
  // Add courses
  await db.cours.bulkAdd([
    { 
      id: 1, 
      code: 'INF-1010', 
      titre: 'Programmation Orientée Objet', 
      semestre: 'S1', 
      annee: 2023,
      enseignantIds: [1, 2],
      chapitreIds: []
    },
    { 
      id: 2, 
      code: 'INF-1020', 
      titre: 'Algorithmes et Structures de Données', 
      semestre: 'S1', 
      annee: 2023,
      enseignantIds: [3],
      chapitreIds: []
    },
    { 
      id: 3, 
      code: 'INF-2010', 
      titre: 'Bases de Données', 
      semestre: 'S3', 
      annee: 2023,
      enseignantIds: [4],
      chapitreIds: []
    },
    { 
      id: 4, 
      code: 'INF-2020', 
      titre: 'Développement Web', 
      semestre: 'S3', 
      annee: 2023,
      enseignantIds: [5],
      chapitreIds: []
    },
    { 
      id: 5, 
      code: 'INF-3010', 
      titre: 'Intelligence Artificielle', 
      semestre: 'S5', 
      annee: 2023,
      enseignantIds: [1, 4],
      chapitreIds: []
    }
  ]);
  
  // Add chapters
  await db.chapitres.bulkAdd([
    { id: 1, titre: 'Introduction à la POO', contenu: 'Principes de base de la programmation orientée objet', coursId: 1 },
    { id: 2, titre: 'Classes et Objets', contenu: 'Définition et utilisation des classes et objets', coursId: 1 },
    { id: 3, titre: 'Héritage', contenu: 'Concept d\'héritage et polymorphisme', coursId: 1 },
    { id: 4, titre: 'Introduction aux Algorithmes', contenu: 'Notions fondamentales des algorithmes', coursId: 2 },
    { id: 5, titre: 'Tableaux et Listes', contenu: 'Manipulation des structures linéaires', coursId: 2 },
    { id: 6, titre: 'Arbres et Graphes', contenu: 'Structures de données hiérarchiques et non-linéaires', coursId: 2 },
    { id: 7, titre: 'Modèle Relationnel', contenu: 'Concepts fondamentaux des bases de données relationnelles', coursId: 3 },
    { id: 8, titre: 'Langage SQL', contenu: 'Interrogation et manipulation des données avec SQL', coursId: 3 }
  ]);
  
  // Update courses with chapter IDs
  await db.cours.update(1, { chapitreIds: [1, 2, 3] });
  await db.cours.update(2, { chapitreIds: [4, 5, 6] });
  await db.cours.update(3, { chapitreIds: [7, 8] });
  
  // Update enseignants with course IDs
  await db.enseignants.update(1, { cours: [1, 5] });
  await db.enseignants.update(2, { cours: [1] });
  await db.enseignants.update(3, { cours: [2] });
  await db.enseignants.update(4, { cours: [3, 5] });
  await db.enseignants.update(5, { cours: [4] });
  
  // Add sessions
  await db.seances.bulkAdd([
    { id: 1, date: new Date(2023, 9, 10, 9, 0), duree: 120, salle: 'A101', type: 'Cours', coursId: 1 },
    { id: 2, date: new Date(2023, 9, 12, 14, 0), duree: 90, salle: 'LAB-INFO-1', type: 'TP', coursId: 1 },
    { id: 3, date: new Date(2023, 9, 11, 9, 0), duree: 120, salle: 'A102', type: 'Cours', coursId: 2 },
    { id: 4, date: new Date(2023, 9, 13, 9, 0), duree: 90, salle: 'B201', type: 'TD', coursId: 2 },
    { id: 5, date: new Date(2023, 9, 10, 14, 0), duree: 120, salle: 'A101', type: 'Cours', coursId: 3 },
    { id: 6, date: new Date(2023, 9, 12, 9, 0), duree: 90, salle: 'LAB-INFO-2', type: 'TP', coursId: 3 }
  ]);
  
  // Add evaluations
  await db.evaluations.bulkAdd([
    { id: 1, type: 'Contrôle', date: new Date(2023, 10, 15, 9, 0), matiere: 'Programmation Orientée Objet', coursId: 1 },
    { id: 2, type: 'Examen', date: new Date(2024, 0, 15, 9, 0), matiere: 'Programmation Orientée Objet', coursId: 1 },
    { id: 3, type: 'Contrôle', date: new Date(2023, 10, 20, 9, 0), matiere: 'Algorithmes et Structures de Données', coursId: 2 },
    { id: 4, type: 'Examen', date: new Date(2024, 0, 20, 9, 0), matiere: 'Algorithmes et Structures de Données', coursId: 2 }
  ]);
  
  // Add notes
  await db.notes.bulkAdd([
    { id: 1, valeur: 14.5, coefficient: 0.3, evaluationId: 1, etudiantId: 101 },
    { id: 2, valeur: 12.0, coefficient: 0.3, evaluationId: 1, etudiantId: 102 },
    { id: 3, valeur: 16.0, coefficient: 0.3, evaluationId: 1, etudiantId: 103 },
    { id: 4, valeur: 13.5, coefficient: 0.3, evaluationId: 1, etudiantId: 104 },
    { id: 5, valeur: 15.0, coefficient: 0.3, evaluationId: 1, etudiantId: 105 },
    { id: 6, valeur: 11.5, coefficient: 0.3, evaluationId: 3, etudiantId: 101 },
    { id: 7, valeur: 14.0, coefficient: 0.3, evaluationId: 3, etudiantId: 102 },
    { id: 8, valeur: 13.0, coefficient: 0.3, evaluationId: 3, etudiantId: 103 },
    { id: 9, valeur: 12.5, coefficient: 0.3, evaluationId: 3, etudiantId: 104 },
    { id: 10, valeur: 16.5, coefficient: 0.3, evaluationId: 3, etudiantId: 105 }
  ]);
  
  // Add absences
  await db.absences.bulkAdd([
    { id: 1, date: new Date(2023, 9, 10), motif: null, justifiee: false, etudiantId: 102, coursId: 1 },
    { id: 2, date: new Date(2023, 9, 13), motif: 'Certificat médical', justifiee: true, etudiantId: 104, coursId: 2 },
    { id: 3, date: new Date(2023, 9, 12), motif: null, justifiee: false, etudiantId: 105, coursId: 3 }
  ]);
  
  // Add incidents
  await db.incidentsTechniques.bulkAdd([
    { 
      id: 1, 
      description: 'Projecteur défectueux dans la salle A101', 
      dateSoumission: new Date(2023, 9, 11), 
      statut: 'En cours', 
      priorite: 'Moyenne',
      enseignantId: 1,
      technicienId: 201
    },
    { 
      id: 2, 
      description: 'Problème de connexion réseau dans le laboratoire LAB-INFO-1', 
      dateSoumission: new Date(2023, 9, 12), 
      statut: 'Soumis', 
      priorite: 'Haute',
      enseignantId: 2,
      technicienId: null
    },
    { 
      id: 3, 
      description: 'Ordinateur en panne dans le laboratoire LAB-INFO-2', 
      dateSoumission: new Date(2023, 9, 13), 
      statut: 'Résolu', 
      priorite: 'Normale',
      enseignantId: 4,
      technicienId: 202
    }
  ]);
  
  // Add stages
  await db.stages.bulkAdd([
    { 
      id: 1, 
      dateDebut: new Date(2024, 5, 1), 
      dateFin: new Date(2024, 7, 31), 
      entreprise: 'Tanger Med Technology', 
      sujet: 'Développement d\'une application de gestion de flux portuaire',
      etudiantId: 101
    },
    { 
      id: 2, 
      dateDebut: new Date(2024, 5, 1), 
      dateFin: new Date(2024, 7, 31), 
      entreprise: 'Renault Tanger', 
      sujet: 'Implémentation d\'un système de surveillance de chaîne de production',
      etudiantId: 102
    },
    { 
      id: 3, 
      dateDebut: new Date(2024, 5, 1), 
      dateFin: new Date(2024, 7, 31), 
      entreprise: 'Office National de l\'Électricité', 
      sujet: 'Conception d\'un outil de suivi de consommation énergétique',
      etudiantId: 103
    }
  ]);
};

export default initializeSampleData;
