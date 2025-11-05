import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import type { Tache, Stagiaire } from '../../types';
import { sendTaskByWhatsApp, sendTaskByWhatsAppGroup } from '../../lib/notifications';

interface WhatsAppPreviewProps {
  tache: Tache;
  stagiaires: Stagiaire[];
  onClose: () => void;
}

export function WhatsAppPreview({ tache, stagiaires, onClose }: WhatsAppPreviewProps) {
  const [sent, setSent] = useState(false);

  const isGroupe = stagiaires.length > 1;
  
  // Construction du message structuré
  const buildMessage = () => {
    let message = `🎓 *Nouvelle tâche assignée*\n\n`;
    message += `📋 *${tache.titre}*\n\n`;
    
    if (tache.description) {
      message += `📝 *Description :*\n${tache.description}\n\n`;
    }
    
    message += `📅 *Échéance :* ${new Date(tache.dateEcheance).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}\n\n`;
    
    if (isGroupe) {
      message += `👥 *Tâche de groupe*\n`;
      message += `Équipe :\n`;
      stagiaires.forEach((s, index) => {
        message += `${index + 1}. ${s.prenom} ${s.nom}\n`;
      });
      message += `\n`;
    }
    
    message += `_Message automatique - Système de gestion des stagiaires_`;
    
    return message;
  };

  const message = buildMessage();

  const handleSend = () => {
    if (isGroupe) {
      sendTaskByWhatsAppGroup(stagiaires, tache);
    } else {
      sendTaskByWhatsApp(stagiaires[0], tache);
    }
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
            <MessageCircle size={20} style={{ color: '#25D366' }} />
            Aperçu WhatsApp
          </h2>
          <button onClick={onClose} className="modal-close">
            <X />
          </button>
        </div>

        <div className="modal-content">
          {isGroupe ? (
            <div className="form-group">
              <label className="form-label">Mode d'envoi</label>
              <div style={{ 
                padding: 'var(--spacing-md)',
                backgroundColor: '#dcfce7',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <MessageCircle size={16} />
                <span>Message de groupe - Le lien s'ouvrira dans WhatsApp pour partager à un groupe</span>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Destinataire (Parent)</label>
              <div style={{ 
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <MessageCircle size={16} style={{ color: '#25D366' }} />
                <div>
                  <strong>{stagiaires[0].nomParent}</strong>
                  <div style={{ color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)' }}>
                    {stagiaires[0].numeroParent}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Aperçu du message</label>
            <div style={{
              backgroundColor: '#E5DDD5',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius)',
              position: 'relative'
            }}>
              <div style={{
                backgroundColor: '#DCF8C6',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                lineHeight: '1.6',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                {message}
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--color-gray-600)',
                  marginTop: 'var(--spacing-sm)',
                  textAlign: 'right'
                }}>
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-gray-500)', 
              marginTop: 'var(--spacing-sm)',
              lineHeight: '1.4'
            }}>
              Le message sera envoyé via WhatsApp. {isGroupe ? 'Vous pourrez choisir le groupe après avoir cliqué sur Envoyer.' : 'WhatsApp s\'ouvrira avec le message pré-rempli.'}
            </p>
          </div>

          {sent && (
            <div className="success-message">
              <Send size={16} />
              Redirection vers WhatsApp...
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="button button-secondary">
            Annuler
          </button>
          <button 
            onClick={handleSend} 
            className="button button-primary" 
            disabled={sent}
            style={{ backgroundColor: sent ? undefined : '#25D366' }}
          >
            <MessageCircle size={16} />
            {sent ? 'Envoyé !' : 'Ouvrir WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}
