import type { Stagiaire, Tache } from '../types/index';

/**
 * Génère un lien mailto pour envoyer une tâche par email
 */
export function sendTaskByEmail(stagiaires: Stagiaire[], tache: Tache): void {
  const emails = stagiaires.map(s => s.email).join(',');
  const subject = encodeURIComponent(`Nouvelle tâche assignée: ${tache.titre}`);
  
  const body = encodeURIComponent(
    `Bonjour,\n\n` +
    `Une nouvelle tâche vous a été assignée:\n\n` +
    `Titre: ${tache.titre}\n` +
    `Description: ${tache.description}\n` +
    `Date d'échéance: ${new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}\n\n` +
    `${tache.estGroupe ? 'Cette tâche est à réaliser en groupe.\n\n' : ''}` +
    `Cordialement,\n` +
    `L'équipe de gestion`
  );
  
  const mailtoLink = `mailto:${emails}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
}

/**
 * Génère un lien WhatsApp pour envoyer une tâche
 */
export function sendTaskByWhatsApp(stagiaire: Stagiaire, tache: Tache): void {
  // Nettoyer le numéro de téléphone
  const phoneNumber = stagiaire.numeroParent?.replace(/\s/g, '').replace(/\+/g, '');
  
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
  
  message += `_Message automatique - Système de gestion des stagiaires_`;
  
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
}

/**
 * Génère un lien WhatsApp pour un groupe
 */
export function sendTaskByWhatsAppGroup(stagiaires: Stagiaire[], tache: Tache): void {
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
  
  message += `👥 *Tâche de groupe*\n`;
  message += `Équipe :\n`;
  stagiaires.forEach((s, index) => {
    message += `${index + 1}. ${s.prenom} ${s.nom}\n`;
  });
  message += `\n`;
  
  message += `_Message automatique - Système de gestion des stagiaires_`;
  
  // Pour l'instant, on ouvre WhatsApp avec le message pré-rempli
  // L'utilisateur devra choisir le groupe manuellement
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
}
