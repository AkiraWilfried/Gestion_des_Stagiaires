/**
 * Utilitaires de formatage et helpers
 */

import type { Tache, Stagiaire } from '../types';

/**
 * Formate une date ISO en format français
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR');
}

/**
 * Formate une date ISO en format français avec heure
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('fr-FR');
}

/**
 * Calcule le nombre de jours entre deux dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Vérifie si une date est passée
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Formate un numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
  // Supprime tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format français : +33 6 12 34 56 78
  if (cleaned.startsWith('+33')) {
    const number = cleaned.substring(3);
    return `+33 ${number.substring(0, 1)} ${number.substring(1, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7, 9)}`;
  }
  
  // Format par défaut
  return cleaned;
}

/**
 * Calcule le pourcentage de complétion
 */
export function calculateCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Tronque un texte avec ellipse
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Génère un ID unique basé sur le timestamp
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone (format international)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Capitalise la première lettre d'un texte
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Obtient les initiales d'un nom complet
 */
export function getInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return firstInitial + lastInitial;
}

/**
 * Formate une durée en jours en texte lisible
 */
export function formatDuration(days: number): string {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "1 jour";
  if (days < 7) return `${days} jours`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 semaine";
  if (weeks < 4) return `${weeks} semaines`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return "1 mois";
  return `${months} mois`;
}

/**
 * Détermine si une échéance est proche (dans les 3 jours)
 */
export function isDeadlineNear(dateEcheance: string): boolean {
  const daysUntil = daysBetween(new Date().toISOString(), dateEcheance);
  return daysUntil <= 3 && !isPastDate(dateEcheance);
}

/**
 * Obtient la couleur selon le statut
 */
export function getStatusColor(statut: 'en-cours' | 'termine' | 'non-commence'): string {
  switch (statut) {
    case 'termine':
      return 'var(--color-green)';
    case 'en-cours':
      return 'var(--color-orange)';
    default:
      return 'var(--color-gray-400)';
  }
}

/**
 * Recherche globale dans les stagiaires
 */
export function searchStagiaires(stagiaires: Stagiaire[], query: string): Stagiaire[] {
  if (!query.trim()) return stagiaires;
  
  const lowerQuery = query.toLowerCase();
  return stagiaires.filter(s => 
    s.nom?.toLowerCase().includes(lowerQuery) ||
    s.prenom?.toLowerCase().includes(lowerQuery) ||
    s.email?.toLowerCase().includes(lowerQuery) ||
    s.filiere?.toLowerCase().includes(lowerQuery) ||
    s.nomParent?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Recherche globale dans les tâches
 */
export function searchTaches(taches: Tache[], query: string): Tache[] {
  if (!query.trim()) return taches;
  
  const lowerQuery = query.toLowerCase();
  return taches.filter(t =>
    t.titre?.toLowerCase().includes(lowerQuery) ||
    t.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Tri des tâches
 */
export function sortTaches(taches: Tache[], sortBy: 'date' | 'statut' | 'titre'): Tache[] {
  const copy = [...taches];
  
  switch (sortBy) {
    case 'date':
      return copy.sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime());
    case 'statut':
      const statusOrder: Record<Tache['statut'], number> = { 'non-commence': 0, 'en-cours': 1, 'termine': 2 };
      return copy.sort((a: Tache, b: Tache) => statusOrder[a.statut] - statusOrder[b.statut]);
    case 'titre':
      return copy.sort((a, b) => a.titre.localeCompare(b.titre));
    default:
      return copy;
  }
}

/**
 * Filtre les tâches par tags
 */
export function filterByTags<T extends { tags?: string[] }>(items: T[], selectedTags: string[]): T[] {
  if (selectedTags.length === 0) return items;

  return items.filter(item =>
    item.tags?.some((tag: string) => selectedTags.includes(tag)) ?? false
  );
}
