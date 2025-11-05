import { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';
import type { Tache, Stagiaire } from '../../types';
import { sendTaskByEmail } from '../../lib/notifications';

interface EmailPreviewProps {
  tache: Tache;
  stagiaires: Stagiaire[];
  onClose: () => void;
}

export function EmailPreview({ tache, stagiaires, onClose }: EmailPreviewProps) {
  const [sent, setSent] = useState(false);

  const emails = stagiaires.map(s => s.email).join(', ');
  const subject = `Nouvelle tâche assignée: ${tache.titre}`;
  
  const body = 
    `Bonjour,\n\n` +
    `Une nouvelle tâche vous a été assignée:\n\n` +
    `Titre: ${tache.titre}\n` +
    `Description: ${tache.description}\n` +
    `Date d'échéance: ${new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}\n\n` +
    `${tache.estGroupe ? 'Cette tâche est à réaliser en groupe.\n\n' : ''}` +
    `Cordialement,\n` +
    `L'équipe de gestion`;

  const handleSend = () => {
    sendTaskByEmail(stagiaires, tache);
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Mail size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Aperçu de l'email
          </h2>
          <button onClick={onClose} className="modal-close">
            <X />
          </button>
        </div>

        <div className="email-modal-content">
          <div className="form-group">
            <label className="form-label">Destinataires</label>
            <div style={{ 
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem'
            }}>
              {emails}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Objet</label>
            <div style={{ 
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {subject}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <div className="email-preview">
              {body}
            </div>
          </div>

          {sent && (
            <div className="success-message">
              <Send size={16} />
              Email envoyé avec succès !
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="button button-secondary">
            Annuler
          </button>
          <button onClick={handleSend} className="button button-primary" disabled={sent}>
            <Send size={16} />
            {sent ? 'Envoyé !' : 'Envoyer l\'email'}
          </button>
        </div>
      </div>
    </div>
  );
}
