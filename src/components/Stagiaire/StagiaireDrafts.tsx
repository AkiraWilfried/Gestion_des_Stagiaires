import { useEffect, useState } from 'react';
import { FileText, Trash2, CheckCircle, Clock } from 'lucide-react';
import type { StagiaireDraft } from '../../types';
import { getStagiaireDrafts, deleteStagiaireDraft, convertDraftToStagiaire } from '../../lib/storage';

interface StagiaireDraftsProps {
  onUpdate: () => void;
  onEditDraft: (draft: StagiaireDraft) => void;
}

export function StagiaireDrafts({ onUpdate, onEditDraft }: StagiaireDraftsProps) {
  const [drafts, setDrafts] = useState<StagiaireDraft[]>([]);

  useEffect(() => {
    setDrafts(getStagiaireDrafts());
  }, [onUpdate]);

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce brouillon ?')) {
      deleteStagiaireDraft(id);
      setDrafts(getStagiaireDrafts());
      onUpdate();
    }
  };

  const handleConvert = (id: string) => {
    const result = convertDraftToStagiaire(id);
    if (result) {
      setDrafts(getStagiaireDrafts());
      onUpdate();
      alert('Brouillon converti en stagiaire avec succès !');
    } else {
      alert('Impossible de convertir ce brouillon. Veuillez vérifier que tous les champs obligatoires sont remplis.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getDraftCompleteness = (draft: StagiaireDraft): number => {
    const requiredFields = ['nom', 'prenom', 'filiere', 'email', 'dateDebut', 'dateFin', 'nomParent', 'numeroParent'];
    const filledFields = requiredFields.filter(field => draft[field as keyof StagiaireDraft]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  if (drafts.length === 0) {
    return (
      <div className="empty-state">
        <FileText />
        <p>Aucun brouillon de stagiaire</p>
        <p className="text-sm">Les brouillons vous permettent de sauvegarder votre travail en cours</p>
      </div>
    );
  }

  return (
    <div>
      {drafts.map((draft) => {
        const completeness = getDraftCompleteness(draft);
        const canConvert = completeness === 100;

        return (
          <div key={draft.id} className="list-item">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 style={{ marginBottom: '0.25rem' }}>
                  {draft.prenom || 'Sans prénom'} {draft.nom || 'Sans nom'}
                </h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  {draft.filiere && <span className="badge badge-default">{draft.filiere}</span>}
                  <div style={{ 
                    marginTop: 'var(--spacing-sm)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-xs)' 
                  }}>
                    <Clock size={14} />
                    <span>Modifié le {formatDate(draft.dateModification)}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: completeness === 100 ? 'var(--color-green)' : 'var(--color-orange)',
                  fontWeight: 500
                }}>
                  {completeness}%
                </span>
              </div>
            </div>

            <div style={{ 
              width: '100%', 
              height: '6px', 
              backgroundColor: 'var(--color-gray-200)', 
              borderRadius: '3px',
              marginBottom: 'var(--spacing-lg)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completeness}%`,
                height: '100%',
                backgroundColor: completeness === 100 ? 'var(--color-green)' : 'var(--color-orange)',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onEditDraft(draft)}
                className="button button-secondary button-sm"
              >
                Continuer l'édition
              </button>
              
              {canConvert && (
                <button
                  onClick={() => handleConvert(draft.id)}
                  className="button button-primary button-sm"
                >
                  <CheckCircle size={14} />
                  Créer le stagiaire
                </button>
              )}
              
              <button
                onClick={() => handleDelete(draft.id)}
                className="button button-danger button-sm"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
