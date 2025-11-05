import { useEffect, useState } from 'react';
import { FileText, Trash2, CheckCircle, Clock, Users } from 'lucide-react';
import  type { TacheDraft, Stagiaire } from '../../types';
import { getTacheDrafts, deleteTacheDraft, convertDraftToTache } from '../../lib/storage';

interface TacheDraftsProps {
  stagiaires: Stagiaire[];
  onUpdate: () => void;
  onEditDraft: (draft: TacheDraft) => void;
}

export function TacheDrafts({ stagiaires, onUpdate, onEditDraft }: TacheDraftsProps) {
  const [drafts, setDrafts] = useState<TacheDraft[]>([]);

  useEffect(() => {
    setDrafts(getTacheDrafts());
  }, [onUpdate]);

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce brouillon ?')) {
      deleteTacheDraft(id);
      setDrafts(getTacheDrafts());
      onUpdate();
    }
  };

  const handleConvert = (id: string) => {
    const result = convertDraftToTache(id);
    if (result) {
      setDrafts(getTacheDrafts());
      onUpdate();
      alert('Brouillon converti en tâche avec succès !');
    } else {
      alert('Impossible de convertir ce brouillon. Veuillez vérifier que tous les champs obligatoires sont remplis.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getDraftCompleteness = (draft: TacheDraft): number => {
    let filled = 0;
    let total = 3; // titre, stagiaires, dateEcheance
    
    if (draft.titre) filled++;
    if (draft.stagiaireIds && draft.stagiaireIds.length > 0) filled++;
    if (draft.dateEcheance) filled++;
    
    return Math.round((filled / total) * 100);
  };

  const getStagiairesNames = (stagiaireIds: string[] | undefined): string => {
    if (!stagiaireIds || stagiaireIds.length === 0) return 'Aucun stagiaire';
    const names = stagiaireIds
      .map(id => {
        const stagiaire = stagiaires.find(s => s.id === id);
        return stagiaire ? `${stagiaire.prenom} ${stagiaire.nom}` : null;
      })
      .filter(Boolean);
    
    if (names.length === 0) return 'Stagiaires supprimés';
    if (names.length === 1) return names[0] as string;
    return `${names.length} stagiaires`;
  };

  if (drafts.length === 0) {
    return (
      <div className="empty-state">
        <FileText />
        <p>Aucun brouillon de tâche</p>
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
                  {draft.titre || 'Sans titre'}
                </h4>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--color-gray-600)', 
                  marginTop: 'var(--spacing-sm)' 
                }}>
                  <div style={{ 
                    marginBottom: 'var(--spacing-xs)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-xs)' 
                  }}>
                    <Users size={14} />
                    <span>{getStagiairesNames(draft.stagiaireIds)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
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
                  Créer la tâche
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
