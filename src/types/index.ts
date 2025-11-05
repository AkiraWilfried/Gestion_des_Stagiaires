export interface Stagiaire {
  id: string;
  nom: string;
  prenom: string;
  filiere: string;
  email: string;
  telephone?: string;
  dateDebut: string;
  dateFin: string;
  nomParent: string;
  numeroParent: string;
  tags?: string[]; // IDs des tags
}

export interface Tache {
  id: string;
  titre: string;
  description: string;
  stagiaireIds: string[]; // Support pour tâches en groupe
  statut: 'en-cours' | 'termine' | 'non-commence';
  dateCreation: string;
  dateEcheance: string;
  estGroupe: boolean; // Indique si c'est une tâche de groupe
  tags?: string[]; // IDs des tags
}

export interface StagiaireDraft {
  id: string;
  nom?: string;
  prenom?: string;
  filiere?: string;
  email?: string;
  telephone?: string;
  dateDebut?: string;
  dateFin?: string;
  nomParent?: string;
  numeroParent?: string;
  dateCreation: string;
  dateModification: string;
}

export interface TacheDraft {
  id: string;
  titre?: string;
  description?: string;
  stagiaireIds?: string[];
  dateEcheance?: string;
  estGroupe?: boolean;
  dateCreation: string;
  dateModification: string;
}

export type Filiere = 
  | 'Développement Web'
  | 'Développement Mobile'
  | 'Data Science'
  | 'Cybersécurité'
  | 'Design UX/UI'
  | 'Marketing Digital'
  | 'Autre';

// Tags personnalisés
export interface Tag {
  id: string;
  nom: string;
  couleur: string;
  type: 'stagiaire' | 'tache';
}

// Préférences utilisateur
export interface UserPreferences {
  theme: 'light' | 'dark';
  showCalendar: boolean;
  showAnalytics: boolean;
  defaultView: 'list' | 'calendar';
}

// Analytics
export interface AnalyticsData {
  tachesParFiliere: { filiere: string; count: number }[];
  tachesParStatut: { statut: string; count: number }[];
  tauxCompletionParStagiaire: { nom: string; taux: number }[];
  evolutionTaches: { date: string; termine: number; enCours: number; nonCommence: number }[];
}
