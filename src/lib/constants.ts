import type { Filiere } from '../types/index';

/**
 * Liste des filières disponibles pour les stagiaires
 */
export const FILIERES: Filiere[] = [
  'Développement Web',
  'Développement Mobile',
  'Data Science',
  'Cybersécurité',
  'Design UX/UI',
  'Marketing Digital',
  'Autre',
];

/**
 * Clés de stockage localStorage
 */
export const STORAGE_KEYS = {
  STAGIAIRES: 'stagiaires',
  TACHES: 'taches',
  STAGIAIRE_DRAFTS: 'stagiaire_drafts',
  TACHE_DRAFTS: 'tache_drafts',
} as const;

/**
 * Configuration des couleurs de l'application
 */
export const COLORS = {
  PRIMARY: '#ff6600',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: {
    50: '#f9f9f9',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  GREEN: '#22c55e',
  RED: '#ef4444',
} as const;

/**
 * Messages de confirmation
 */
export const CONFIRMATION_MESSAGES = {
  DELETE_STAGIAIRE: 'Voulez-vous vraiment supprimer ce stagiaire ?',
  DELETE_TACHE: 'Voulez-vous vraiment supprimer cette tâche ?',
  DELETE_DRAFT: 'Voulez-vous vraiment supprimer ce brouillon ?',
} as const;

/**
 * Messages de succès
 */
export const SUCCESS_MESSAGES = {
  DRAFT_SAVED: 'Brouillon sauvegardé avec succès !',
  DRAFT_CONVERTED: 'Brouillon converti avec succès !',
  EMAIL_SENT: 'Email envoyé avec succès !',
} as const;

/**
 * Messages d'erreur
 */
export const ERROR_MESSAGES = {
  DRAFT_INCOMPLETE: 'Impossible de convertir ce brouillon. Veuillez vérifier que tous les champs obligatoires sont remplis.',
  NO_STAGIAIRE_SELECTED: 'Veuillez sélectionner au moins un stagiaire',
} as const;
