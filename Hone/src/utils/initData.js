import db from './db';

/**
 * Initialize the database with sample data for FST Tanger Departmental Management System
 * Based on actual data from the FST Tanger Computer Science Department
 */
const initializeSampleData = async () => {
  console.log('Initializing department data...');
  
  try {
    // Check if data already exists
    const personCount = await db.personnes.count();
    if (personCount > 0) {
      console.log('Department data already initialized');
      return;
    }
    
    // Add sample data for each entity
    await addEnseignants();
    await addAdminStaff();
    await addStudents();
    await addClassrooms();
    await addFormations();
    await addCoursFromProgrammes();
    await addAssociationData();
    
    console.log('Department data initialization complete');
  } catch (error) {
    console.error('Error initializing department data:', error);
  }
};

/**
 * Add faculty members data
 */
const addEnseignants = async () => {
  const enseignantsList = [
    { id: 1, nom: 'BAIDA OUAFAE', email: 'wafaebaida@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 2, nom: 'KHALI ISSA SANAE', email: 'sanaeissa@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 3, nom: 'BENABDELWAHAB IKRAM', email: 'ibenabdelouahab@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 4, nom: 'EL YOUSSEFI Yassine', email: 'elyusufiyasyn@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 5, nom: 'JEBARI Khalid', email: 'khalid.jebari@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 6, nom: 'AZMANI Abdellah', email: 'abdellah.azmani@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 7, nom: 'Ait kbir M\'hamed', email: 'aitkbir@hotmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 8, nom: 'EL BRAK Mohammed', email: 'melbrak@yahoo.fr', affiliation: 'FST de Tanger, UAE' },
    { id: 9, nom: 'ZILI Hassan', email: 'hassan.zili@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 10, nom: 'KOUNAIDI Mohamed', email: 'm.kounaidi@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 11, nom: 'EZZIYYANI Mostafa', email: 'mezziyyani@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 12, nom: 'MAHBOUB Aziz', email: 'amahboub@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 13, nom: 'ZOUHAIR Abdelhamid', email: 'a.zouhair@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 14, nom: 'EN-NAIMI El Mokhtar', email: 'en-naimi@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 15, nom: 'GHADI Abderrahim', email: 'ghadi05@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 16, nom: 'EL ACHAK Lotfi', email: 'lelaachak@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 17, nom: 'BOUDHIR Abdelhakim Anouar', email: 'elbrak.m@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 18, nom: 'BOUHORMA Mohammed', email: 'mbouhorma@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 19, nom: 'BEN AHMED Mohamed', email: 'mbenahmed@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 20, nom: 'EL AMRANI Chaker', email: 'celamrani@uae.ac.ma', affiliation: 'FST de Tanger, UAE' },
    { id: 21, nom: 'FENNAN Abdelhadi', email: 'afennan@gmail.com', affiliation: 'FST de Tanger, UAE' },
    { id: 22, nom: 'BOUDRIKI SEMLALI Badr-Eddine', email: 'badreddine.boudrikisemlali@uae.ac.ma', affiliation: 'FST de Tanger, UAE' }
  ];

  // Add to personnes table
  await db.personnes.bulkAdd(enseignantsList);
  
  // Add to enseignants table with specializations
  const specializations = ['Génie Informatique', 'Intelligence Artificielle', 'Réseaux et Systèmes', 'Base de Données', 'Sécurité Informatique', 'Analyse Numérique'];
  
  const enseignantsData = enseignantsList.map((e, index) => ({
    id: e.id,
    appogee: `ENS${String(e.id).padStart(3, '0')}`,
    specialite: specializations[index % specializations.length]
  }));
  
  await db.enseignants.bulkAdd(enseignantsData);
  
  // Assign academic roles
  await db.chefDepartement.add({ id: 8 }); // EL BRAK Mohammed as Department Head
  await db.coordinateurs.bulkAdd([
    { id: 1 },  // BAIDA OUAFAE for LST-DA
    { id: 10 }, // KOUNAIDI Mohamed for LST-IDAI
    { id: 16 }, // EL ACHAK Lotfi for DI-LSI
    { id: 11 }, // EZZIYYANI Mostafa for MST-IASD
    { id: 13 }  // ZOUHAIR Abdelhamid for MST-SITBD
  ]);
};

/**
 * Add administrative staff (including technicians)
 */
const addAdminStaff = async () => {
  // Administration account
  await db.personnes.add({ id: 100, nom: 'Administration Génie Informatique', email: 'admin-info@uae.ac.ma' });
  await db.administration.add({ id: 100 });
  
  // Technicians
  const techniciens = [
    { id: 201, nom: 'BENALI Ahmed', email: 'abenali@uae.ac.ma', specialite: 'Maintenance Informatique' },
    { id: 202, nom: 'RACHIDI Sara', email: 'srachidi@uae.ac.ma', specialite: 'Réseaux' },
    { id: 203, nom: 'TAZI Karim', email: 'ktazi@uae.ac.ma', specialite: 'Support Logiciel' }
  ];
  
  await db.personnes.bulkAdd(techniciens);
  await db.techniciens.bulkAdd(techniciens.map(t => ({
    id: t.id,
    specialite: t.specialite
  })));
};

/**
 * Add sample student data
 */
const addStudents = async () => {
  const students = [
    { 
      id: 301, 
      nom: 'EL GORRIM MOHAMED', 
      email: 'elgorrim.mohamed@etu.uae.ac.ma',
      appogee: 22011229, 
      prenom: 'Mohamed', 
      dateNaissance: new Date(2005, 1, 8),
      adresse: 'Tetouan, Rif Avenue N°88'
    },
    { 
      id: 302, 
      nom: 'KCHIBAL ISMAIL', 
      email: 'kchibal.ismail@etu.uae.ac.ma',
      appogee: 24001002, 
      prenom: 'Ismail', 
      dateNaissance: new Date(2003, 4, 22),
      adresse: 'Fes, Avenue Moulay Ismail N°12' 
    },
    { 
      id: 303, 
      nom: 'MOHAND OMAR MOUSSA', 
      email: 'mohandomar.moussa@etu.uae.ac.ma',
      appogee: 22001003, 
      prenom: 'Moussa', 
      dateNaissance: new Date(2005, 3, 10),
      adresse: 'Al Hoceima, Rue N°8' 
    },
    { 
      id: 304, 
      nom: 'ESSALHI SALMA', 
      email: 'essalhi.salma@etu.uae.ac.ma',
      appogee: 24001004, 
      prenom: 'Salma', 
      dateNaissance: new Date(2003, 6, 19),
      adresse: 'Midelt, Boulevard Hassan II N°45' 
    },
    { 
      id: 305, 
      nom: 'ELAJBARI YOUSSEF', 
      email: 'elajbari.youssef@etu.uae.ac.ma',
      appogee: 24001005, 
      prenom: 'Youssef', 
      dateNaissance: new Date(2004, 9, 28),
      adresse: 'Tanger, Ancienne Medina N°23' 
    }
  ];
  
  await db.personnes.bulkAdd(students);
  await db.etudiants.bulkAdd(students.map(s => ({
    id: s.id,
    appogee: s.appogee,
    prenom: s.prenom,
    dateNaissance: s.dateNaissance,
    adresse: s.adresse
  })));
};

/**
 * Add classrooms data
 */
const addClassrooms = async () => {
  const classrooms = [
    // 1st floor
    { id: 'E01', nomSalle: 'Salle E01', capacite: 30, disponibilite: true },
    { id: 'E02', nomSalle: 'Salle E02', capacite: 30, disponibilite: true },
    
    // 2nd floor
    { id: 'E11', nomSalle: 'Salle E11', capacite: 30, disponibilite: true },
    { id: 'E12', nomSalle: 'Salle E12', capacite: 30, disponibilite: true },
    { id: 'E13', nomSalle: 'Laboratoire E13', capacite: 20, disponibilite: true },
    { id: 'E14', nomSalle: 'Laboratoire E14', capacite: 20, disponibilite: true },
    { id: 'E15', nomSalle: 'Salle E15', capacite: 80, disponibilite: true },
    { id: 'E16', nomSalle: 'Salle E16', capacite: 40, disponibilite: true },
    { id: 'E17', nomSalle: 'Laboratoire E17', capacite: 24, disponibilite: true },
    { id: 'E18', nomSalle: 'Laboratoire E18', capacite: 24, disponibilite: true },
    
    // 3rd floor
    { id: 'E21', nomSalle: 'Salle E21', capacite: 40, disponibilite: true },
    { id: 'E22', nomSalle: 'Salle E22', capacite: 40, disponibilite: true },
    { id: 'E23', nomSalle: 'Laboratoire E23', capacite: 20, disponibilite: true },
    { id: 'E24', nomSalle: 'Laboratoire E24', capacite: 80, disponibilite: true },
    { id: 'E25', nomSalle: 'Salle E25', capacite: 60, disponibilite: true },
    { id: 'E26', nomSalle: 'Salle E26', capacite: 30, disponibilite: true }
  ];
  
  await db.sallesCoursLabo.bulkAdd(classrooms);
};

/**
 * Add formation data (degree programs)
 */
const addFormations = async () => {
  const formations = [
    { code: 'LST-DA', intitule: 'LST: Analytique des données', duree: 2 },
    { code: 'LST-IDAI', intitule: 'LST: Ingénierie de développement d\'applications informatiques', duree: 2 },
    { code: 'DI-LSI', intitule: 'DI: Logiciels et Systèmes Intelligents', duree: 3 },
    { code: 'MST-IASD', intitule: 'MST: Intelligence Artificielle et Sciences de Données', duree: 2 },
    { code: 'MST-SITBD', intitule: 'MST: Sécurité IT et Big Data', duree: 2 }
  ];
  
  await db.formations.bulkAdd(formations);
  
  // Add sample inscriptions
  await db.inscriptions.bulkAdd([
    { id: 1, dateInscription: new Date(2023, 8, 15), statut: 'Validée', etudiant_id: 301, formation_code: 'LST-DA' },
    { id: 2, dateInscription: new Date(2023, 8, 16), statut: 'Validée', etudiant_id: 302, formation_code: 'LST-IDAI' },
    { id: 3, dateInscription: new Date(2023, 8, 16), statut: 'Validée', etudiant_id: 303, formation_code: 'DI-LSI' },
    { id: 4, dateInscription: new Date(2023, 8, 17), statut: 'Validée', etudiant_id: 304, formation_code: 'MST-IASD' },
    { id: 5, dateInscription: new Date(2023, 8, 17), statut: 'Validée', etudiant_id: 305, formation_code: 'MST-SITBD' }
  ]);
};

/**
 * Define program structures with courses
 */
const addProgramStructures = async () => {
  const programStructures = {
    'LST-DA': {
      coordinator: 1, // BAIDA OUAFAE
      semesters: {
        5: [
          'Mathématiques pour la science des données',
          'Structures des données avancées et théorie des graphes',
          'Fondamentaux des bases de données',
          'Algorithmique avancée et programmation',
          'Développement WEB',
          'Développement personnel et intelligence émotionnelle (Soft skills)'
        ],
        6: [
          'Analyse et fouille de données',
          'Systèmes et réseaux',
          'Ingénierie des données',
          'PFE'
        ]
      }
    },
    'LST-IDAI': {
      coordinator: 10, // KOUNAIDI Mohamed
      semesters: {
        5: [
          'Modélisations avancée et Méthodes de génie logiciel',
          'Développement Web',
          'Base de données Structurées et non Structurées',
          'Programmation Orientée Objet en C++/Java',
          'Systèmes et réseaux informatiques',
          'Développement de soft skills'
        ],
        6: [
          'Innover, Entreprendre et s\'initier à la Gestion d\'une Entreprise avec un ERP',
          'Initiation en développement mobile et Edge Computing',
          'Développement web avancé Back end (Python)',
          'PFE'
        ]
      }
    },
    'DI-LSI': {
      coordinator: 16, // EL ACHAK Lotfi
      semesters: {
        1: [
          'Théorie des graphes et applications',
          'Systèmes D\'exploitation Linux',
          'Programmation Orientée Objet',
          'Bases de données avancées',
          'Technologies web 1',
          'Digital skills',
          'Langues étrangères 1'
        ],
        2: [
          'Technologies web 2',
          'Conception orientée objet et NoSQL',
          'JAVA avancé et Design Patterns',
          'Architectures Réseau et Protocoles',
          'Technologies Arduino et Systèmes embarqués',
          'Culture & arts & sport skills',
          'Langues étrangères 2'
        ],
        3: [
          'Méthodologies de l\'intelligence artificielle',
          'Administration des bases de données',
          'Internet des objets et applications',
          'Applications web distribuées (JEE)',
          'Génie Logiciel et gestion de projets informatiques',
          'Intelligence artificielle',
          'Langues étrangères 3'
        ],
        4: [
          'Administration réseaux et systèmes',
          'Cryptographie et sécurité informatique',
          'Systèmes multi agents et Datamining',
          'Programmation des applications mobiles (Native / Hybride)',
          'Architecture BIG DATA',
          'Employment Skills',
          'Langues étrangères 4'
        ],
        5: [
          'Vision artificielle',
          'Virtualisation et Cloud computing',
          'Cybersécurité',
          'Deep Learning et Applications',
          'Système d\'aide à la décision',
          'Langues étrangères 5',
          'Culture Et Gestion D\'entreprise'
        ],
        6: [
          'Projet de fin d\'étude'
        ]
      }
    },
    'MST-IASD': {
      coordinator: 11, // EZZIYYANI Mostafa
      semesters: {
        1: [
          'THÉORIES ET SYSTÈMES DE RAISONNEMENTS INTELLIGENTS',
          'MATHÉMATIQUES POUR ANALYSE DE DONNÉES',
          'PROGRAMMATION AVANCÉE',
          'BASES DE DONNÉES AVANCÉES',
          'MACHINE LEARNING 1',
          'ANGLAIS ET TECHNIQUE D\'EXPRESSION'
        ],
        2: [
          'INFRASTRUCTURE ET ARCHITECTURE DES SYSTÈMES DISTRIBUES & BIG DATA',
          'PLATEFORMES IOT CORE: TECHNOLOGIES, DATA ET IA',
          'METAHEURISTIQUES & ALGORITHMES DE RECHERCHE STOCHASTIQUE',
          'SMA & NLP',
          'DATAMING & BI',
          'DEVELOPPEMENT PERSONNEL ET INTELLIGENCE EMOTIONNELL'
        ],
        3: [
          'MULTIMEDIA MINING AND INDEXING',
          'MACHINE LEARNING 2 : DEEP and TRANSFERT LEARNING',
          'DATA SPACES & DATA INTEGRATION & SEMANTIC INTEROPERABILITY',
          'BLOCKCHAIN & SECURITE APPLICATIVE',
          'VIRTUALIZATION, CLOUD AND EDGE COMPUTING',
          'DIGITAL BUSINESS STRATEGIES LEADERSHIP IN THE AGE OF AI'
        ],
        4: [
          'Projet de fin d\'étude'
        ]
      }
    },
    'MST-SITBD': {
      coordinator: 13, // ZOUHAIR Abdelhamid
      semesters: {
        1: [
          'Programmation Orientée Objet Avancée en Java / Python',
          'Réseaux avancés',
          'Data Mining (DM) et Systèmes d\'Aide à la Décision (DAS)',
          'Administration Systèmes et Réseaux',
          'Concepts fondamentaux de l\'intelligence artificielle',
          'Anglais et technique d\'expression'
        ],
        2: [
          'Intelligence Artificielle Distribuée (SMA) & Apprentissage Automatique (ML)',
          'Technologies IoT: Architectes, protocoles et applications',
          'Virtualisation, Cloud et Edge Computing',
          'Cryptographie Et Sécurité des Services',
          'Architecture et Technologies Big Data',
          'Gestion de l\'innovation et management de projet informatique'
        ],
        3: [
          'Cybersecurity & Ethical hacking',
          'Calcul Haute Performance et Applications en Big Data',
          'Deep learning et Applications',
          'Administration des Bases de Données Distribuées et Clusters Big Data',
          'Audit des systèmes d\'information et Management de la sécurité des systèmes d\'information',
          'Développement Personnel Et Intelligence Émotionnelle'
        ],
        4: [
          'Projet de fin d\'étude'
        ]
      }
    }
  };
  
  // Store program structure information in a simple object
  try {
    // First check if metadata table exists and is accessible
    try {
      const test = await db.metadata.get('test');
      console.log('Metadata table is accessible');
    } catch (err) {
      console.warn('Skipping metadata storage as table may not be ready');
      return;
    }
    
    await db.metadata.put({
      key: 'programStructures',
      value: JSON.stringify(programStructures)
    });
  } catch (e) {
    console.warn('Could not store program structures in metadata table:', e);
  }
};

/**
 * Create courses from program structures
 */
const addCoursFromProgrammes = async () => {
  let courseId = 1;
  const courses = [];
  const courseMap = {};
  const chapitres = [];
  
  // Generate courses from program structure
  const programStructures = {
    'LST-DA': {
      semesters: {
        5: [
          'Mathématiques pour la science des données',
          'Structures des données avancées et théorie des graphes',
          'Fondamentaux des bases de données',
          'Algorithmique avancée et programmation',
          'Développement WEB',
          'Développement personnel et intelligence émotionnelle'
        ],
        6: [
          'Analyse et fouille de données',
          'Systèmes et réseaux',
          'Ingénierie des données',
          'PFE'
        ]
      }
    },
    'LST-IDAI': {
      semesters: {
        5: [
          'Modélisations avancée et Méthodes de génie logiciel',
          'Développement Web',
          'Base de données Structurées et non Structurées',
          'Programmation Orientée Objet en C++/Java',
          'Systèmes et réseaux informatiques',
          'Développement de soft skills'
        ],
        6: [
          'Innover, Entreprendre et s\'initier à la Gestion',
          'Initiation en développement mobile et Edge Computing',
          'Développement web avancé Back end',
          'PFE'
        ]
      }
    },
    'DI-LSI': {
      semesters: {
        1: [
          'Théorie des graphes et applications',
          'Systèmes D\'exploitation Linux',
          'Programmation Orientée Objet',
          'Bases de données avancées',
          'Technologies web 1',
          'Digital skills',
          'Langues étrangères 1'
        ],
        2: [
          'Technologies web 2',
          'Conception orientée objet et NoSQL',
          'JAVA avancé et Design Patterns',
          'Architectures Réseau et Protocoles',
          'Technologies Arduino et Systèmes embarqués',
          'Culture & arts & sport skills',
          'Langues étrangères 2'
        ],
        3: [
          'Méthodologies de l’intelligence artificielle',
          `Administration des bases de données`,
          'Internet des objets et applications',
          'Applications web distribuées (JEE)',
          'Génie Logiciel et gestion de projets informatiques',
          'Intelligence artificielle',
          'Langues étrangères 3'
        ],
        4: [
          'Administration réseaux et systèmes',
          'Cryptographie et sécurité informatique',
          'Systèmes multi-agents et datamining',
          'Programmation des applications mobiles (Native / Hybride)',
          'Architecture BIG DATA',
          'Employment Skills',
          'Langues étrangères 4'
        ],
        5: [
          'Vision artificielle',
          'Virtualisation et Cloud computing',
          'Cybersécurité',
          'Deep Learning et Applications',
          'Système d\'aide à la décision',
          'Langues étrangères 5',
          'Culture Et Gestion D\'entreprise'
        ],
        6: [
          'Projet de fin d\'étude'
        ]
      }
    },
    'MST-IASD': {
      semesters: {
        1: [
          'THÉORIES ET SYSTÈMES DE RAISONNEMENTS INTELLIGENTS',
          'MATHÉMATIQUES POUR ANALYSE DE DONNÉES',
          'PROGRAMMATION AVANCÉE',
          'BASES DE DONNÉES AVANCÉES',
          'MACHINE LEARNING 1',
          'ANGLAIS ET TECHNIQUE D\'EXPRESSION'
        ],
        2: [
          'INFRASTRUCTURE ET ARCHITECTURE DES SYSTÈMES DISTRIBUES & BIG DATA',
          'PLATEFORMES IOT CORE: TECHNOLOGIES, DATA ET IA',
          'METAHEURISTIQUES & ALGORITHMES DE RECHERCHE STOCHASTIQUE',
          'SMA & NLP',
          'DATAMING & BI',
          'DEVELOPPEMENT PERSONNEL ET INTELLIGENCE EMOTIONNELL'
        ],
        3: [
          'MULTIMEDIA MINING AND INDEXING',
          'MACHINE LEARNING 2 : DEEP and TRANSFERT LEARNING',
          'DATA SPACES & DATA INTEGRATION & SEMANTIC INTEROPERABILITY',
          'BLOCKCHAIN & SECURITE APPLICATIVE',
          'VIRTUALIZATION, CLOUD AND EDGE COMPUTING',
          'DIGITAL BUSINESS STRATEGIES LEADERSHIP IN THE AGE OF AI'
        ],
        4: [
          'Projet de fin d\'étude'
        ]
      }
    },
    'MST-SITBD': {
      semesters: {
        1: [
          'Programmation Orientée Objet Avancée en Java / Python',
          'Réseaux avancés',
          'Data Mining (DM) et Systèmes d\'Aide à la Décision (DAS)',
          'Administration Systèmes et Réseaux',
          'Concepts fondamentaux de l\'intelligence artificielle',
          'Anglais et technique d\'expression'
        ],
        2: [
          'Intelligence Artificielle Distribuée (SMA) & Apprentissage Automatique (ML)',
          'Technologies IoT: Architectes, protocoles et applications',
          'Virtualisation, Cloud et Edge Computing',
          'Cryptographie Et Sécurité des Services',
          'Architecture et Technologies Big Data',
          'Gestion de l\'innovation et management de projet informatique'
        ],
        3: [
          'Cybersecurity & Ethical hacking',
          'Calcul Haute Performance et Applications en Big Data',
          'Deep learning et Applications',
          'Administration des Bases de Données Distribuées et Clusters Big Data',
          'Audit des systèmes d\'information et Management de la sécurité des systèmes d\'information',
          'Développement Personnel Et Intelligence Émotionnelle'
        ],
        4: [
          'Projet de fin d\'étude'
        ]
      }
    }
  };
  
  for (const [formationCode, formation] of Object.entries(programStructures)) {
    for (const [semester, coursesList] of Object.entries(formation.semesters)) {
      for (const courseTitle of coursesList) {
        const courseCode = `${formationCode}-S${semester}-${courseId}`;
        courses.push({
          code: courseCode,
          titre: courseTitle,
          semestre: `S${semester}`,
          annee: 2023
        });
        
        courseMap[courseTitle] = courseCode;
        
        // Create chapters for each course
        for (let i = 1; i <= 3; i++) {
          chapitres.push({
            id: chapitres.length + 1,
            titre: `Chapitre ${i} - ${courseTitle}`,
            contenu: `Contenu du chapitre ${i} pour ${courseTitle}`,
            cours_code: courseCode
          });
        }
        
        courseId++;
      }
    }
  }
  
  await db.cours.bulkAdd(courses);
  await db.chapitres.bulkAdd(chapitres);
};

/**
 * Add associations between entities
 */
const addAssociationData = async () => {
  // Assign courses to teachers
  const enseignantCourses = [];
  const enseignantIds = Array.from({length: 22}, (_, i) => i + 1);
  
  const courses = await db.cours.toArray();
  courses.forEach((course, index) => {
    // Assign 1-2 teachers per course
    const teacher1 = enseignantIds[index % enseignantIds.length];
    const teacher2 = enseignantIds[(index + 5) % enseignantIds.length];
    
    enseignantCourses.push(
      { enseignant_id: teacher1, cours_code: course.code },
      { enseignant_id: teacher2, cours_code: course.code }
    );
  });
  
  await db.enseignantsCours.bulkAdd(enseignantCourses);
  
  // Create séances (class sessions)
  const seances = [];
  
  for (let i = 0; i < 10 && i < courses.length; i++) {
    const course = courses[i];
    const salleId = `E${Math.floor(Math.random() * 26 + 1).toString().padStart(2, '0')}`;
    
    // CM (Course)
    seances.push({
      id: seances.length + 1,
      date: new Date(2023, 9, 10 + i, 9, 0),
      duree: 120,
      salle: salleId,
      type: 'CM',
      cours_code: course.code
    });
    
    // TD (Tutorial)
    seances.push({
      id: seances.length + 1,
      date: new Date(2023, 9, 12 + i, 14, 0),
      duree: 90,
      salle: salleId,
      type: 'TD',
      cours_code: course.code
    });
    
    // TP (Lab)
    if (i % 2 === 0) {
      const labId = `E${(Math.floor(Math.random() * 3) * 10 + Math.floor(Math.random() * 9) + 1).toString().padStart(2, '0')}`;
      seances.push({
        id: seances.length + 1,
        date: new Date(2023, 9, 14 + i, 10, 30),
        duree: 180,
        salle: labId,
        type: 'TP',
        cours_code: course.code
      });
    }
  }
  
  await db.seances.bulkAdd(seances);
  
  // Create incidents
  await db.incidentsTechniques.bulkAdd([
    { 
      id: 1, 
      description: 'Projecteur défectueux dans la salle E15', 
      dateSoumission: new Date(2023, 9, 11), 
      statut: 'En cours', 
      priorite: 'Moyenne',
      enseignant_id: 3,
      technicien_id: 201,
      administration_id: 100
    },
    { 
      id: 2, 
      description: 'Problème de connexion réseau en salle E22', 
      dateSoumission: new Date(2023, 9, 12), 
      statut: 'Soumis', 
      priorite: 'Haute',
      enseignant_id: 5,
      technicien_id: 202,
      administration_id: 100
    },
    { 
      id: 3, 
      description: 'Ordinateur en panne dans le laboratoire E26', 
      dateSoumission: new Date(2023, 9, 13), 
      statut: 'Résolu', 
      priorite: 'Normale',
      enseignant_id: 2,
      technicien_id: 203,
      administration_id: 100
    }
  ]);
};

export default initializeSampleData;
