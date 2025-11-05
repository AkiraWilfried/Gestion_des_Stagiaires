import { useState } from 'react';
import { Calendar, Users, Mail, MessageCircle, CheckCircle, Clock, XCircle, Edit2, Trash2 } from 'lucide-react';
import type { Tache, Stagiaire } from '../../types';
import { updateTache, deleteTache } from '../../lib/storage';
import { EmailPreview } from './EmailPreview';
import { WhatsAppPreview } from './WhatsAppPreview';

interface TacheCardProps {
  tache: Tache;
  stagiaires: Stagiaire[];
  onUpdate: () => void;
  onEdit: (tache: Tache) => void;
}

export function TacheCard({ tache, stagiaires, onUpdate, onEdit }: TacheCardProps) {
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);
  const assignedStagiaires = stagiaires.filter(s => tache.stagiaireIds.includes(s.id));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleStatusChange = (newStatus: Tache['statut']) => {
    updateTache(tache.id, { statut: newStatus });
    onUpdate();
  };

  const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      deleteTache(tache.id);
      onUpdate();
    }
  };

  const handleSendEmail = () => {
    setShowEmailPreview(true);
  };

  const handleSendWhatsApp = () => {
    setShowWhatsAppPreview(true);
  };

  const getStatusBadge = () => {
    switch (tache.statut) {
      case 'termine':
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Terminé
          </span>
        );
      case 'en-cours':
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> En cours
          </span>
        );
      default:
        return (
          <span className="badge badge-default">
            <XCircle size={12} /> Non commencé
          </span>
        );
    }
  };

  return (
    <>
      {showEmailPreview && (
        <EmailPreview 
          tache={tache}
          stagiaires={assignedStagiaires}
          onClose={() => setShowEmailPreview(false)}
        />
      )}

      {showWhatsAppPreview && (
        <WhatsAppPreview 
          tache={tache}
          stagiaires={assignedStagiaires}
          onClose={() => setShowWhatsAppPreview(false)}
        />
      )}
      
      <div className="tache-card">
        <div className="tache-header">
        <div style={{ flex: 1 }}>
          <h3 className="tache-title">
            {tache.titre}
            {tache.estGroupe && (
              <span className="group-indicator">
                <Users size={14} />
                Groupe
              </span>
            )}
          </h3>
          {getStatusBadge()}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(tache)}
            className="button button-icon button-outline"
            title="Modifier"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="button button-icon button-danger"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {tache.description && (
        <p className="tache-description">{tache.description}</p>
      )}

      <div className="tache-meta">
        <span>
          <Calendar size={14} />
          <span>Échéance: {formatDate(tache.dateEcheance)}</span>
        </span>
        <span>
          <Users size={14} />
          <span>
            {tache.estGroupe 
              ? `${assignedStagiaires.length} stagiaires`
              : assignedStagiaires.map(s => `${s.prenom} ${s.nom}`).join(', ')
            }
          </span>
        </span>
      </div>

      {tache.estGroupe && assignedStagiaires.length > 0 && (
        <div style={{ 
          fontSize: '0.875rem', 
          color: 'var(--color-gray-600)', 
          marginBottom: 'var(--spacing-lg)',
          lineHeight: '1.5'
        }}>
          <strong>Équipe:</strong> {assignedStagiaires.map(s => `${s.prenom} ${s.nom}`).join(', ')}
        </div>
      )}

      <div className="tache-actions">
        <select
          className="form-select"
          value={tache.statut}
          onChange={(e) => handleStatusChange(e.target.value as Tache['statut'])}
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="non-commence">Non commencé</option>
          <option value="en-cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>

        <button onClick={handleSendEmail} className="button button-outline button-sm">
          <Mail size={14} />
          Email
        </button>

        {assignedStagiaires.length > 0 && (
          <button onClick={handleSendWhatsApp} className="button button-outline button-sm">
            <MessageCircle size={14} />
            WhatsApp
          </button>
        )}
      </div>
    </div>
    </>
  );
}
