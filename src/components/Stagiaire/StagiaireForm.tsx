import { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { addStagiaire, saveStagiaireDraft, updateStagiaire } from '../../lib/storage';
import type { Filiere, StagiaireDraft, Stagiaire } from '../../types';

const filieres: Filiere[] = [
  'Développement Web',
  'Développement Mobile',
  'Data Science',
  'Cybersécurité',
  'Design UX/UI',
  'Marketing Digital',
  'Autre',
];

interface StagiaireFormProps {
  onSuccess: () => void;
  draft?: StagiaireDraft;
  stagiaireToEdit?: Stagiaire;
  onCloseDraft?: () => void;
  onCloseEdit?: () => void;
}

export function StagiaireForm({ onSuccess, draft, stagiaireToEdit, onCloseDraft, onCloseEdit }: StagiaireFormProps) {
  const [isOpen, setIsOpen] = useState(!!(draft || stagiaireToEdit));
  const [formData, setFormData] = useState({
    nom: draft?.nom || stagiaireToEdit?.nom || '',
    prenom: draft?.prenom || stagiaireToEdit?.prenom || '',
    filiere: draft?.filiere || stagiaireToEdit?.filiere || '',
    email: draft?.email || stagiaireToEdit?.email || '',
    telephone: draft?.telephone || stagiaireToEdit?.telephone || '',
    dateDebut: draft?.dateDebut || stagiaireToEdit?.dateDebut || '',
    dateFin: draft?.dateFin || stagiaireToEdit?.dateFin || '',
    nomParent: draft?.nomParent || stagiaireToEdit?.nomParent || '',
    numeroParent: draft?.numeroParent || stagiaireToEdit?.numeroParent || '',
  });

  useEffect(() => {
    if (draft) {
      setIsOpen(true);
      setFormData({
        nom: draft.nom || '',
        prenom: draft.prenom || '',
        filiere: draft.filiere || '',
        email: draft.email || '',
        telephone: draft.telephone || '',
        dateDebut: draft.dateDebut || '',
        dateFin: draft.dateFin || '',
        nomParent: draft.nomParent || '',
        numeroParent: draft.numeroParent || '',
      });
    } else if (stagiaireToEdit) {
      setIsOpen(true);
      setFormData({
        nom: stagiaireToEdit.nom,
        prenom: stagiaireToEdit.prenom,
        filiere: stagiaireToEdit.filiere,
        email: stagiaireToEdit.email,
        telephone: stagiaireToEdit.telephone || '',
        dateDebut: stagiaireToEdit.dateDebut,
        dateFin: stagiaireToEdit.dateFin,
        nomParent: stagiaireToEdit.nomParent,
        numeroParent: stagiaireToEdit.numeroParent,
      });
    }
  }, [draft, stagiaireToEdit]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseDraft) onCloseDraft();
    if (onCloseEdit) onCloseEdit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stagiaireToEdit) {
      // Mode édition
      updateStagiaire(stagiaireToEdit.id, formData);
    } else {
      // Mode création
      addStagiaire(formData);
    }
    
    setFormData({
      nom: '',
      prenom: '',
      filiere: '',
      email: '',
      telephone: '',
      dateDebut: '',
      dateFin: '',
      nomParent: '',
      numeroParent: '',
    });
    handleClose();
    onSuccess();
  };

  const handleSaveDraft = () => {
    saveStagiaireDraft(formData, draft?.id);
    alert('Brouillon sauvegardé avec succès !');
    handleClose();
    onSuccess();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="button button-primary">
        <Plus />
        Ajouter un stagiaire
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {stagiaireToEdit 
              ? 'Modifier le stagiaire'
              : draft 
                ? 'Continuer le brouillon' 
                : 'Nouveau stagiaire'}
          </h2>
          <button onClick={handleClose} className="modal-close">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label className="form-label" htmlFor="nom">Nom *</label>
              <input
                id="nom"
                type="text"
                className="form-input"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prenom">Prénom *</label>
              <input
                id="prenom"
                type="text"
                className="form-input"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="prenom.nom@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telephone">Téléphone</label>
              <input
                id="telephone"
                type="tel"
                className="form-input"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="nomParent">Nom du parent *</label>
              <input
                id="nomParent"
                type="text"
                className="form-input"
                value={formData.nomParent}
                onChange={(e) => setFormData({ ...formData, nomParent: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="numeroParent">Numéro du parent (WhatsApp) *</label>
              <input
                id="numeroParent"
                type="tel"
                className="form-input"
                value={formData.numeroParent}
                onChange={(e) => setFormData({ ...formData, numeroParent: e.target.value })}
                required
                placeholder="+33 6 12 34 56 78"
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
                Ce numéro sera utilisé pour envoyer les notifications WhatsApp
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filiere">Filière *</label>
              <select
                id="filiere"
                className="form-select"
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                required
              >
                <option value="">Sélectionner une filière</option>
                {filieres.map((filiere) => (
                  <option key={filiere} value={filiere}>
                    {filiere}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dateDebut">Date de début *</label>
              <input
                id="dateDebut"
                type="date"
                className="form-input"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dateFin">Date de fin *</label>
              <input
                id="dateFin"
                type="date"
                className="form-input"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            {!stagiaireToEdit && (
              <button type="button" onClick={handleSaveDraft} className="button button-outline">
                <Save size={16} />
                Sauvegarder en brouillon
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button type="button" onClick={handleClose} className="button button-secondary">
              Annuler
            </button>
            <button type="submit" className="button button-primary">
              {stagiaireToEdit ? 'Enregistrer les modifications' : 'Créer le stagiaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
