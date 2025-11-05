import { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { addTache, saveTacheDraft, updateTache } from '../../lib/storage';
import type { Stagiaire, TacheDraft, Tache } from '../../types';

interface TacheFormProps {
  stagiaires: Stagiaire[];
  onSuccess: () => void;
  draft?: TacheDraft;
  tacheToEdit?: Tache;
  onCloseDraft?: () => void;
  onCloseEdit?: () => void;
}

export function TacheForm({ 
  stagiaires, 
  onSuccess, 
  draft, 
  tacheToEdit,
  onCloseDraft,
  onCloseEdit 
}: TacheFormProps) {
  const [isOpen, setIsOpen] = useState(!!(draft || tacheToEdit));
  const [formData, setFormData] = useState({
    titre: draft?.titre || tacheToEdit?.titre || '',
    description: draft?.description || tacheToEdit?.description || '',
    stagiaireIds: draft?.stagiaireIds || tacheToEdit?.stagiaireIds || [] as string[],
    dateEcheance: draft?.dateEcheance || tacheToEdit?.dateEcheance || '',
    estGroupe: draft?.estGroupe || tacheToEdit?.estGroupe || false,
  });

  useEffect(() => {
    if (draft) {
      setIsOpen(true);
      setFormData({
        titre: draft.titre || '',
        description: draft.description || '',
        stagiaireIds: draft.stagiaireIds || [],
        dateEcheance: draft.dateEcheance || '',
        estGroupe: draft.estGroupe || false,
      });
    } else if (tacheToEdit) {
      setIsOpen(true);
      setFormData({
        titre: tacheToEdit.titre,
        description: tacheToEdit.description,
        stagiaireIds: tacheToEdit.stagiaireIds,
        dateEcheance: tacheToEdit.dateEcheance,
        estGroupe: tacheToEdit.estGroupe,
      });
    }
  }, [draft, tacheToEdit]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseDraft) onCloseDraft();
    if (onCloseEdit) onCloseEdit();
  };

  const handleStagiaireToggle = (id: string) => {
    setFormData(prev => {
      const newStagiaireIds = prev.stagiaireIds.includes(id)
        ? prev.stagiaireIds.filter(sid => sid !== id)
        : [...prev.stagiaireIds, id];
      
      return {
        ...prev,
        stagiaireIds: newStagiaireIds,
        estGroupe: newStagiaireIds.length > 1
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.stagiaireIds.length === 0) {
      alert('Veuillez sélectionner au moins un stagiaire');
      return;
    }

    if (tacheToEdit) {
      // Mode édition
      updateTache(tacheToEdit.id, {
        titre: formData.titre,
        description: formData.description,
        stagiaireIds: formData.stagiaireIds,
        dateEcheance: formData.dateEcheance,
        estGroupe: formData.stagiaireIds.length > 1,
      });
    } else {
      // Mode création
      addTache({
        titre: formData.titre,
        description: formData.description,
        stagiaireIds: formData.stagiaireIds,
        statut: 'non-commence',
        dateCreation: new Date().toISOString(),
        dateEcheance: formData.dateEcheance,
        estGroupe: formData.stagiaireIds.length > 1,
      });
    }

    setFormData({
      titre: '',
      description: '',
      stagiaireIds: [],
      dateEcheance: '',
      estGroupe: false,
    });
    handleClose();
    onSuccess();
  };

  const handleSaveDraft = () => {
    saveTacheDraft(formData, draft?.id);
    alert('Brouillon sauvegardé avec succès !');
    handleClose();
    onSuccess();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="button button-primary">
        <Plus />
        Créer une tâche
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {tacheToEdit 
              ? 'Modifier la tâche' 
              : draft 
                ? 'Continuer le brouillon' 
                : 'Nouvelle tâche'}
          </h2>
          <button onClick={handleClose} className="modal-close">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label className="form-label" htmlFor="titre">Titre de la tâche *</label>
              <input
                id="titre"
                type="text"
                className="form-input"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Décrivez la tâche en détail..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Assigner à (sélection multiple pour tâche de groupe) *
              </label>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '1px solid var(--color-gray-300)', 
                borderRadius: 'var(--radius)', 
                padding: '0.5rem' 
              }}>
                {stagiaires.length === 0 ? (
                  <p className="text-sm text-gray">Aucun stagiaire disponible</p>
                ) : (
                  stagiaires.map((stagiaire) => (
                    <div key={stagiaire.id} className="checkbox-wrapper" style={{ padding: '0.5rem 0' }}>
                      <input
                        type="checkbox"
                        id={`stagiaire-${stagiaire.id}`}
                        className="checkbox"
                        checked={formData.stagiaireIds.includes(stagiaire.id)}
                        onChange={() => handleStagiaireToggle(stagiaire.id)}
                      />
                      <label 
                        htmlFor={`stagiaire-${stagiaire.id}`} 
                        style={{ cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        {stagiaire.prenom} {stagiaire.nom} ({stagiaire.filiere})
                      </label>
                    </div>
                  ))
                )}
              </div>
              {formData.stagiaireIds.length > 1 && (
                <p className="text-sm" style={{ marginTop: '0.5rem', color: 'var(--color-orange)' }}>
                  ✓ Tâche de groupe ({formData.stagiaireIds.length} stagiaires)
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dateEcheance">Date d'échéance *</label>
              <input
                id="dateEcheance"
                type="date"
                className="form-input"
                value={formData.dateEcheance}
                onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            {!tacheToEdit && (
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
              {tacheToEdit ? 'Enregistrer les modifications' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
