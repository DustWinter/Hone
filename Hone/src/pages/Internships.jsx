import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Stage } from '../models/Student';
import db from '../utils/db';
import './Internships.css';

/**
 * Internships page component
 * Manages student internships (stages) and related processes
 */
const Internships = () => {
  const { t } = useTranslation();
  const { currentUser, hasRole, ROLES } = useAuth();
  
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'new', 'details'
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // For creating/editing internships
  const [formData, setFormData] = useState({
    id: null,
    dateDebut: '',
    dateFin: '',
    entreprise: '',
    sujet: '',
    etudiant_id: '',
    studentName: ''
  });
  
  // For report submission
  const [reportForm, setReportForm] = useState({
    titre: '',
    contenu: '',
    file: null
  });
  
  // For defense scheduling
  const [defenseForm, setDefenseForm] = useState({
    date: '',
    jury: []
  });
  
  // For evaluation
  const [evaluationForm, setEvaluationForm] = useState({
    note: '',
    commentaire: ''
  });
  
  // For showing modals
  const [showModal, setShowModal] = useState({
    report: false,
    defense: false,
    evaluation: false,
    delete: false
  });
  
  // Fetch internships data
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        let internshipsData = [];
        
        if (hasRole(ROLES.ETUDIANT)) {
          // Students see only their own internships
          internshipsData = await db.stages
            .where('etudiant_id')
            .equals(currentUser.id)
            .toArray();
        } 
        else if (hasRole(ROLES.ENSEIGNANT)) {
          // Teachers see internships they supervise
          // This is simplified - in a real app, you'd have proper relationships
          internshipsData = await db.stages.toArray();
          // Filter for internships where teacher is in jury
          internshipsData = internshipsData.filter(stage => 
            stage.jury && stage.jury.includes(currentUser.id)
          );
        }
        else {
          // Admins see all internships
          internshipsData = await db.stages.toArray();
        }
        
        // Get student names for the internships
        const enhancedData = await Promise.all(internshipsData.map(async (internship) => {
          const etudiant = await db.personnes.get(internship.etudiant_id);
          const studentName = etudiant ? etudiant.nom : 'Étudiant inconnu';
          
          return {
            ...internship,
            studentName
          };
        }));
        
        setInternships(enhancedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, [currentUser, hasRole, ROLES]);
  
  // Filter internships based on search term and filter value
  const filteredInternships = internships.filter(internship => {
    // Apply search term
    const matchesSearch = 
      internship.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.sujet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply filter
    if (filter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && internship.statut === filter;
    }
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle student selection for new internship
  const handleStudentSelection = async (e) => {
    const studentId = parseInt(e.target.value);
    setFormData({
      ...formData,
      etudiant_id: studentId
    });
    
    if (studentId) {
      const student = await db.personnes.get(studentId);
      setFormData(prev => ({
        ...prev,
        studentName: student ? student.nom : ''
      }));
    }
  };
  
  // Handle form submission for creating/updating internship
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const internshipData = {
        dateDebut: new Date(formData.dateDebut),
        dateFin: new Date(formData.dateFin),
        entreprise: formData.entreprise,
        sujet: formData.sujet,
        etudiant_id: parseInt(formData.etudiant_id),
        statut: 'En cours',
        rapportSoumis: false
      };
      
      let id;
      
      if (formData.id) {
        // Update existing internship
        id = formData.id;
        await db.stages.update(id, internshipData);
      } else {
        // Create new internship
        id = await db.stages.add(internshipData);
      }
      
      // Refresh the list
      const newInternship = {
        id,
        ...internshipData,
        studentName: formData.studentName
      };
      
      if (formData.id) {
        setInternships(internships.map(i => 
          i.id === id ? newInternship : i
        ));
      } else {
        setInternships([...internships, newInternship]);
      }
      
      // Reset form and go back to list
      resetForm();
      setActiveTab('list');
      
    } catch (error) {
      console.error('Error saving internship:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };
  
  // Handle report submission
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedInternship) return;
      
      // Update internship status
      await db.stages.update(selectedInternship.id, {
        rapportSoumis: true,
        statut: 'Rapport soumis'
      });
      
      // Create report entry
      const reportData = {
        stage_id: selectedInternship.id,
        etudiant_id: selectedInternship.etudiant_id,
        titre: reportForm.titre,
        contenu: reportForm.contenu,
        date_soumission: new Date(),
        statut: 'Soumis'
      };
      
      await db.rapportsStage.add(reportData);
      
      // Update local state
      setInternships(internships.map(i => 
        i.id === selectedInternship.id 
          ? { ...i, rapportSoumis: true, statut: 'Rapport soumis' } 
          : i
      ));
      
      // Close modal and reset form
      setShowModal({ ...showModal, report: false });
      setReportForm({ titre: '', contenu: '', file: null });
      
      alert(t('internships.reportSubmittedSuccess'));
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };
  
  // Handle defense scheduling
  const handleDefenseSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedInternship) return;
      
      // Update internship with defense date
      await db.stages.update(selectedInternship.id, {
        dateSoutenance: new Date(defenseForm.date),
        jury: defenseForm.jury,
        statut: 'Soutenance planifiée'
      });
      
      // Update local state
      setInternships(internships.map(i => 
        i.id === selectedInternship.id 
          ? { 
              ...i, 
              dateSoutenance: new Date(defenseForm.date),
              jury: defenseForm.jury,
              statut: 'Soutenance planifiée'
            } 
          : i
      ));
      
      // Close modal and reset form
      setShowModal({ ...showModal, defense: false });
      setDefenseForm({ date: '', jury: [] });
      
      alert(t('internships.defenseScheduledSuccess'));
      
    } catch (error) {
      console.error('Error scheduling defense:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };
  
  // Handle internship evaluation
  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedInternship) return;
      
      const note = parseFloat(evaluationForm.note);
      
      // Validation
      if (isNaN(note) || note < 0 || note > 20) {
        alert(t('internships.gradeValidationError'));
        return;
      }
      
      // Define status based on grade
      const statut = note >= 10 ? 'Validé' : 'Non validé';
      
      // Update internship with evaluation
      await db.stages.update(selectedInternship.id, {
        note,
        statut
      });
      
      // Create evaluation entry
      const evaluationData = {
        stage_id: selectedInternship.id,
        etudiant_id: selectedInternship.etudiant_id,
        note,
        commentaire: evaluationForm.commentaire,
        date_evaluation: new Date(),
        statut
      };
      
      await db.evaluationsStage.add(evaluationData);
      
      // Update local state
      setInternships(internships.map(i => 
        i.id === selectedInternship.id 
          ? { ...i, note, statut } 
          : i
      ));
      
      // Close modal and reset form
      setShowModal({ ...showModal, evaluation: false });
      setEvaluationForm({ note: '', commentaire: '' });
      
      alert(t('internships.evaluationSubmittedSuccess'));
      
      // Check if conditions are met for diploma
      if (note >= 10) {
        const stage = new Stage(
          selectedInternship.id,
          selectedInternship.dateDebut,
          selectedInternship.dateFin,
          selectedInternship.entreprise,
          selectedInternship.sujet,
          selectedInternship.etudiant_id
        );
        stage.rapportSoumis = true;
        stage.dateSoutenance = selectedInternship.dateSoutenance;
        stage.note = note;
        
        if (stage.verifierConditions()) {
          // All conditions met for diploma
          await db.stages.update(selectedInternship.id, {
            statut: 'Diplôme autorisé'
          });
          
          // Update local state
          setInternships(internships.map(i => 
            i.id === selectedInternship.id 
              ? { ...i, statut: 'Diplôme autorisé' } 
              : i
          ));
          
          alert(t('internships.diplomaAuthorizedSuccess'));
        }
      }
      
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };
  
  // Delete internship
  const handleDelete = async () => {
    try {
      if (!selectedInternship) return;
      
      // Delete internship
      await db.stages.delete(selectedInternship.id);
      
      // Update local state
      setInternships(internships.filter(i => i.id !== selectedInternship.id));
      
      // Close modal and reset selection
      setShowModal({ ...showModal, delete: false });
      setSelectedInternship(null);
      
      alert(t('internships.deletedSuccess'));
      
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert(t('common.error') + ': ' + error.message);
    }
  };
  
  // Reset the form
  const resetForm = () => {
    setFormData({
      id: null,
      dateDebut: '',
      dateFin: '',
      entreprise: '',
      sujet: '',
      etudiant_id: '',
      studentName: ''
    });
  };
  
  // Edit an internship
  const handleEdit = (internship) => {
    setFormData({
      id: internship.id,
      dateDebut: internship.dateDebut ? new Date(internship.dateDebut).toISOString().split('T')[0] : '',
      dateFin: internship.dateFin ? new Date(internship.dateFin).toISOString().split('T')[0] : '',
      entreprise: internship.entreprise,
      sujet: internship.sujet,
      etudiant_id: internship.etudiant_id,
      studentName: internship.studentName
    });
    setActiveTab('new');
  };
  
  // View internship details
  const handleView = (internship) => {
    setSelectedInternship(internship);
    setActiveTab('details');
  };
  
  // Render internship list
  const renderInternshipList = () => (
    <div className="fstt-internships-list ns">
      <div className="fstt-internships-controls">
        <div className="fstt-search">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="fstt-filter">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="En cours">{t('internships.status.inProgress')}</option>
            <option value="Rapport soumis">{t('internships.status.reportSubmitted')}</option>
            <option value="Soutenance planifiée">{t('internships.status.defenseScheduled')}</option>
            <option value="Validé">{t('internships.status.validated')}</option>
            <option value="Non validé">{t('internships.status.notValidated')}</option>
            <option value="Diplôme autorisé">{t('internships.status.diplomaAuthorized')}</option>
          </select>
        </div>
        
        {(hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.ADMIN) || hasRole(ROLES.COORDINATEUR)) && (
          <button 
            className="fstt-btn fstt-btn-primary"
            onClick={() => setActiveTab('new')}
          >
            {t('internships.addNew')}
          </button>
        )}
      </div>
      
      {filteredInternships.length > 0 ? (
        <table className="fstt-table">
          <thead>
            <tr>
              <th>{t('internships.student')}</th>
              <th>{t('internships.company')}</th>
              <th>{t('internships.subject')}</th>
              <th>{t('internships.period')}</th>
              <th>{t('internships.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInternships.map(internship => (
              <tr key={internship.id}>
                <td>{internship.studentName}</td>
                <td>{internship.entreprise}</td>
                <td>{internship.sujet}</td>
                <td>
                  {internship.dateDebut && internship.dateFin ? 
                    `${new Date(internship.dateDebut).toLocaleDateString()} - ${new Date(internship.dateFin).toLocaleDateString()}` : 
                    t('common.notSpecified')}
                </td>
                <td>
                  <span className={`fstt-badge status-${internship.statut?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {internship.statut}
                  </span>
                </td>
                <td>
                  <div className="fstt-action-buttons">
                    <button 
                      className="fstt-btn fstt-btn-sm" 
                      onClick={() => handleView(internship)}
                    >
                      {t('common.view')}
                    </button>
                    
                    {(hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.ADMIN) || hasRole(ROLES.COORDINATEUR)) && (
                      <>
                        <button 
                          className="fstt-btn fstt-btn-sm fstt-btn-secondary" 
                          onClick={() => handleEdit(internship)}
                        >
                          {t('common.edit')}
                        </button>
                        <button 
                          className="fstt-btn fstt-btn-sm fstt-btn-danger"
                          onClick={() => {
                            setSelectedInternship(internship);
                            setShowModal({...showModal, delete: true});
                          }}
                        >
                          {t('common.delete')}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="fstt-empty-state">{t('common.noData')}</p>
      )}
    </div>
  );
  
  // Render internship form
  const renderInternshipForm = () => (
    <div className="fstt-internships-form ns">
      <h2>
        {formData.id ? t('internships.editInternship') : t('internships.addInternship')}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {!hasRole(ROLES.ETUDIANT) && (
          <div className="fstt-form-group">
            <label htmlFor="etudiant_id">{t('internships.student')}</label>
            <select 
              id="etudiant_id" 
              name="etudiant_id" 
              value={formData.etudiant_id} 
              onChange={handleStudentSelection}
              required
            >
              <option value="">{t('common.select')}</option>
              {/* In a real app, fetch this list from the database */}
              <option value="301">EL GORRIM MOHAMED</option>
              <option value="302">KCHIBAL ISMAIL</option>
              <option value="303">MOHAND OMAR MOUSSA</option>
              <option value="304">ESSALHI SALMA</option>
              <option value="305">ELAJBARI YOUSSEF</option>
            </select>
          </div>
        )}
        
        <div className="fstt-form-group">
          <label htmlFor="entreprise">{t('internships.company')}</label>
          <input 
            type="text" 
            id="entreprise" 
            name="entreprise" 
            value={formData.entreprise} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="fstt-form-group">
          <label htmlFor="sujet">{t('internships.subject')}</label>
          <textarea 
            id="sujet" 
            name="sujet" 
            value={formData.sujet} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="fstt-form-row">
          <div className="fstt-form-group">
            <label htmlFor="dateDebut">{t('internships.startDate')}</label>
            <input 
              type="date" 
              id="dateDebut" 
              name="dateDebut" 
              value={formData.dateDebut} 
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="fstt-form-group">
            <label htmlFor="dateFin">{t('internships.endDate')}</label>
            <input 
              type="date" 
              id="dateFin" 
              name="dateFin" 
              value={formData.dateFin} 
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="fstt-form-actions">
          <button 
            type="button" 
            className="fstt-btn" 
            onClick={() => {
              resetForm();
              setActiveTab('list');
            }}
          >
            {t('common.cancel')}
          </button>
          <button type="submit" className="fstt-btn fstt-btn-primary">
            {formData.id ? t('common.save') : t('common.add')}
          </button>
        </div>
      </form>
    </div>
  );
  
  // Render internship details
  const renderInternshipDetails = () => {
    if (!selectedInternship) return null;
    
    return (
      <div className="fstt-internships-details ns">
        <h2>{t('internships.details')}</h2>
        
        <div className="fstt-internship-header">
          <h3>{selectedInternship.sujet}</h3>
          <span className={`fstt-badge status-${selectedInternship.statut?.toLowerCase().replace(/\s+/g, '-')}`}>
            {selectedInternship.statut}
          </span>
        </div>
        
        <div className="fstt-internship-info">
          <div className="fstt-info-group">
            <h4>{t('internships.student')}</h4>
            <p>{selectedInternship.studentName}</p>
          </div>
          
          <div className="fstt-info-group">
            <h4>{t('internships.company')}</h4>
            <p>{selectedInternship.entreprise}</p>
          </div>
          
          <div className="fstt-info-group">
            <h4>{t('internships.period')}</h4>
            <p>
              {selectedInternship.dateDebut && selectedInternship.dateFin ? 
                `${new Date(selectedInternship.dateDebut).toLocaleDateString()} - ${new Date(selectedInternship.dateFin).toLocaleDateString()}` : 
                t('common.notSpecified')}
            </p>
          </div>
          
          {selectedInternship.rapportSoumis && (
            <div className="fstt-info-group">
              <h4>{t('internships.reportStatus')}</h4>
              <p>
                <span className="fstt-badge status-submitted">
                  {t('internships.reportSubmitted')}
                </span>
              </p>
            </div>
          )}
          
          {selectedInternship.dateSoutenance && (
            <div className="fstt-info-group">
              <h4>{t('internships.defenseDate')}</h4>
              <p>{new Date(selectedInternship.dateSoutenance).toLocaleDateString()}</p>
            </div>
          )}
          
          {selectedInternship.note !== null && selectedInternship.note !== undefined && (
            <div className="fstt-info-group">
              <h4>{t('internships.grade')}</h4>
              <p className={`fstt-grade ${selectedInternship.note >= 10 ? 'passing' : 'failing'}`}>
                {selectedInternship.note}/20
              </p>
            </div>
          )}
        </div>
        
        {/* Action buttons based on role and internship state */}
        <div className="fstt-internship-actions">
          {hasRole(ROLES.ETUDIANT) && selectedInternship.etudiant_id === currentUser.id && (
            <>
              {!selectedInternship.rapportSoumis && (
                <button 
                  className="fstt-btn fstt-btn-primary"
                  onClick={() => setShowModal({...showModal, report: true})}
                >
                  {t('internships.submitReport')}
                </button>
              )}
            </>
          )}
          
          {(hasRole(ROLES.CHEF_DEPARTEMENT) || hasRole(ROLES.ADMIN) || hasRole(ROLES.COORDINATEUR)) && (
            <>
              {selectedInternship.rapportSoumis && !selectedInternship.dateSoutenance && (
                <button 
                  className="fstt-btn fstt-btn-primary"
                  onClick={() => setShowModal({...showModal, defense: true})}
                >
                  {t('internships.scheduleDefense')}
                </button>
              )}
              
              {selectedInternship.dateSoutenance && selectedInternship.note === null && (
                <button 
                  className="fstt-btn fstt-btn-primary"
                  onClick={() => setShowModal({...showModal, evaluation: true})}
                >
                  {t('internships.evaluate')}
                </button>
              )}
              
              {selectedInternship.statut === 'Diplôme autorisé' && (
                <button 
                  className="fstt-btn fstt-btn-success"
                  onClick={async () => {
                    await db.stages.update(selectedInternship.id, {
                      statut: 'Diplôme remis'
                    });
                    
                    setInternships(internships.map(i => 
                      i.id === selectedInternship.id 
                        ? { ...i, statut: 'Diplôme remis' } 
                        : i
                    ));
                    
                    setSelectedInternship({
                      ...selectedInternship,
                      statut: 'Diplôme remis'
                    });
                    
                    alert(t('internships.diplomaDeliveredSuccess'));
                  }}
                >
                  {t('internships.deliverDiploma')}
                </button>
              )}
            </>
          )}
          
          <button 
            className="fstt-btn"
            onClick={() => {
              setSelectedInternship(null);
              setActiveTab('list');
            }}
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  };
  
  // Report submission modal
  const reportModal = (
    <div className={`fstt-modal ${showModal.report ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('internships.submitReport')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, report: false})}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <form onSubmit={handleReportSubmit}>
            <div className="fstt-form-group">
              <label htmlFor="titre">{t('internships.reportTitle')}</label>
              <input 
                type="text" 
                id="titre" 
                value={reportForm.titre} 
                onChange={(e) => setReportForm({...reportForm, titre: e.target.value})}
                required 
              />
            </div>
            
            <div className="fstt-form-group">
              <label htmlFor="contenu">{t('internships.reportContent')}</label>
              <textarea 
                id="contenu" 
                value={reportForm.contenu} 
                onChange={(e) => setReportForm({...reportForm, contenu: e.target.value})}
                required 
                rows={5}
              />
            </div>
            
            <div className="fstt-form-group">
              <label htmlFor="file">{t('internships.reportFile')}</label>
              <input 
                type="file" 
                id="file" 
                onChange={(e) => setReportForm({...reportForm, file: e.target.files[0]})}
              />
            </div>
            
            <div className="fstt-form-actions">
              <button type="button" className="fstt-btn" onClick={() => setShowModal({...showModal, report: false})}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="fstt-btn fstt-btn-primary">
                {t('common.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  // Defense scheduling modal
  const defenseModal = (
    <div className={`fstt-modal ${showModal.defense ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('internships.scheduleDefense')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, defense: false})}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <form onSubmit={handleDefenseSubmit}>
            <div className="fstt-form-group">
              <label htmlFor="defense-date">{t('internships.defenseDate')}</label>
              <input 
                type="date" 
                id="defense-date" 
                value={defenseForm.date} 
                onChange={(e) => setDefenseForm({...defenseForm, date: e.target.value})}
                required 
              />
            </div>
            
            <div className="fstt-form-group">
              <label>{t('internships.jury')}</label>
              <div className="fstt-checkbox-group">
                {/* In a real app, fetch this list from the database */}
                {[1, 2, 3, 8, 10, 16].map((teacherId) => (
                  <div className="fstt-checkbox-item" key={teacherId}>
                    <input 
                      type="checkbox" 
                      id={`teacher-${teacherId}`} 
                      value={teacherId} 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDefenseForm({
                            ...defenseForm,
                            jury: [...defenseForm.jury, teacherId]
                          });
                        } else {
                          setDefenseForm({
                            ...defenseForm,
                            jury: defenseForm.jury.filter(id => id !== teacherId)
                          });
                        }
                      }}
                      checked={defenseForm.jury.includes(teacherId)} 
                    />
                    <label htmlFor={`teacher-${teacherId}`}>
                      {teacherId === 1 ? 'BAIDA OUAFAE' :
                       teacherId === 2 ? 'KHALI ISSA SANAE' :
                       teacherId === 3 ? 'BENABDELWAHAB IKRAM' :
                       teacherId === 8 ? 'EL BRAK Mohammed' :
                       teacherId === 10 ? 'KOUNAIDI Mohamed' :
                       teacherId === 16 ? 'EL ACHAK Lotfi' : 
                       `Teacher ${teacherId}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="fstt-form-actions">
              <button type="button" className="fstt-btn" onClick={() => setShowModal({...showModal, defense: false})}>
                {t('common.cancel')}
              </button>
              <button 
                type="submit" 
                className="fstt-btn fstt-btn-primary"
                disabled={defenseForm.jury.length === 0}
              >
                {t('common.schedule')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  // Evaluation modal
  const evaluationModal = (
    <div className={`fstt-modal ${showModal.evaluation ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('internships.evaluateInternship')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, evaluation: false})}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <form onSubmit={handleEvaluationSubmit}>
            <div className="fstt-form-group">
              <label htmlFor="note">{t('internships.grade')} (0-20)</label>
              <input 
                type="number" 
                id="note" 
                min="0" 
                max="20" 
                step="0.5" 
                value={evaluationForm.note} 
                onChange={(e) => setEvaluationForm({...evaluationForm, note: e.target.value})}
                required 
              />
            </div>
            
            <div className="fstt-form-group">
              <label htmlFor="commentaire">{t('internships.comments')}</label>
              <textarea 
                id="commentaire" 
                value={evaluationForm.commentaire} 
                onChange={(e) => setEvaluationForm({...evaluationForm, commentaire: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="fstt-form-actions">
              <button type="button" className="fstt-btn" onClick={() => setShowModal({...showModal, evaluation: false})}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="fstt-btn fstt-btn-primary">
                {t('common.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  // Delete confirmation modal
  const deleteModal = (
    <div className={`fstt-modal ${showModal.delete ? 'show' : ''} ns`}>
      <div className="fstt-modal-content">
        <div className="fstt-modal-header">
          <h3>{t('internships.deleteInternship')}</h3>
          <button className="fstt-modal-close" onClick={() => setShowModal({...showModal, delete: false})}>&times;</button>
        </div>
        <div className="fstt-modal-body">
          <p>{t('internships.deleteConfirmation')}</p>
          
          <div className="fstt-form-actions">
            <button type="button" className="fstt-btn" onClick={() => setShowModal({...showModal, delete: false})}>
              {t('common.cancel')}
            </button>
            <button type="button" className="fstt-btn fstt-btn-danger" onClick={handleDelete}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Loading state
  if (loading) {
    return <div className="fstt-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="fstt-internships ns">
      <h1>{t('nav.internships')}</h1>
      
      {activeTab === 'list' && renderInternshipList()}
      {activeTab === 'new' && renderInternshipForm()}
      {activeTab === 'details' && renderInternshipDetails()}
      
      {/* Modals */}
      {reportModal}
      {defenseModal}
      {evaluationModal}
      {deleteModal}
    </div>
  );
};

export default Internships;
