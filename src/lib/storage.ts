import type { Stagiaire, Tache, StagiaireDraft, TacheDraft, Tag } from '../types/index';

const STAGIAIRES_KEY = 'stagiaires';
const TACHES_KEY = 'taches';
const STAGIAIRE_DRAFTS_KEY = 'stagiaire_drafts';
const TACHE_DRAFTS_KEY = 'tache_drafts';
const TAGS_KEY = 'tags';

// Stagiaires
export function getStagiaires(): Stagiaire[] {
  const data = localStorage.getItem(STAGIAIRES_KEY);
  return data ? JSON.parse(data) : [];
}

export function addStagiaire(stagiaire: Omit<Stagiaire, 'id'>): Stagiaire {
  const stagiaires = getStagiaires();
  const newStagiaire: Stagiaire = {
    ...stagiaire,
    id: Date.now().toString(),
  };
  stagiaires.push(newStagiaire);
  localStorage.setItem(STAGIAIRES_KEY, JSON.stringify(stagiaires));
  return newStagiaire;
}

export function updateStagiaire(id: string, updates: Partial<Stagiaire>): void {
  const stagiaires = getStagiaires();
  const index = stagiaires.findIndex(s => s.id === id);
  if (index !== -1) {
    stagiaires[index] = { ...stagiaires[index], ...updates };
    localStorage.setItem(STAGIAIRES_KEY, JSON.stringify(stagiaires));
  }
}

export function deleteStagiaire(id: string): void {
  const stagiaires = getStagiaires();
  const filtered = stagiaires.filter(s => s.id !== id);
  localStorage.setItem(STAGIAIRES_KEY, JSON.stringify(filtered));
}

// Tâches
export function getTaches(): Tache[] {
  const data = localStorage.getItem(TACHES_KEY);
  return data ? JSON.parse(data) : [];
}

export function addTache(tache: Omit<Tache, 'id'>): Tache {
  const taches = getTaches();
  const newTache: Tache = {
    ...tache,
    id: Date.now().toString(),
  };
  taches.push(newTache);
  localStorage.setItem(TACHES_KEY, JSON.stringify(taches));
  return newTache;
}

export function updateTache(id: string, updates: Partial<Tache>): void {
  const taches = getTaches();
  const index = taches.findIndex(t => t.id === id);
  if (index !== -1) {
    taches[index] = { ...taches[index], ...updates };
    localStorage.setItem(TACHES_KEY, JSON.stringify(taches));
  }
}

export function deleteTache(id: string): void {
  const taches = getTaches();
  const filtered = taches.filter(t => t.id !== id);
  localStorage.setItem(TACHES_KEY, JSON.stringify(filtered));
}

export function getTachesByStagiaire(stagiaireId: string): Tache[] {
  const taches = getTaches();
  return taches.filter(t => t.stagiaireIds.includes(stagiaireId));
}

// Brouillons de stagiaires
export function getStagiaireDrafts(): StagiaireDraft[] {
  const data = localStorage.getItem(STAGIAIRE_DRAFTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveStagiaireDraft(draft: Partial<StagiaireDraft>, id?: string): StagiaireDraft {
  const drafts = getStagiaireDrafts();
  const now = new Date().toISOString();
  
  if (id) {
    // Mise à jour d'un brouillon existant
    const index = drafts.findIndex(d => d.id === id);
    if (index !== -1) {
      drafts[index] = {
        ...drafts[index],
        ...draft,
        dateModification: now,
      };
      localStorage.setItem(STAGIAIRE_DRAFTS_KEY, JSON.stringify(drafts));
      return drafts[index];
    }
  }
  
  // Nouveau brouillon
  const newDraft: StagiaireDraft = {
    ...draft,
    id: id || Date.now().toString(),
    dateCreation: now,
    dateModification: now,
  } as StagiaireDraft;
  
  drafts.push(newDraft);
  localStorage.setItem(STAGIAIRE_DRAFTS_KEY, JSON.stringify(drafts));
  return newDraft;
}

export function deleteStagiaireDraft(id: string): void {
  const drafts = getStagiaireDrafts();
  const filtered = drafts.filter(d => d.id !== id);
  localStorage.setItem(STAGIAIRE_DRAFTS_KEY, JSON.stringify(filtered));
}

export function convertDraftToStagiaire(draftId: string): Stagiaire | null {
  const drafts = getStagiaireDrafts();
  const draft = drafts.find(d => d.id === draftId);
  
  if (!draft) return null;
  
  // Vérifier que tous les champs requis sont présents
  const requiredFields: (keyof StagiaireDraft)[] = [
    'nom', 'prenom', 'filiere', 'email', 'dateDebut', 'dateFin', 'nomParent', 'numeroParent'
  ];
  
  const isComplete = requiredFields.every(field => {
    const value = draft[field];
    return value !== undefined && value !== '';
  });
  
  if (!isComplete) return null;
  
  // Créer le stagiaire
  const stagiaire = addStagiaire({
    nom: draft.nom!,
    prenom: draft.prenom!,
    filiere: draft.filiere!,
    email: draft.email!,
    telephone: draft.telephone,
    dateDebut: draft.dateDebut!,
    dateFin: draft.dateFin!,
    nomParent: draft.nomParent!,
    numeroParent: draft.numeroParent!,
  });
  
  // Supprimer le brouillon
  deleteStagiaireDraft(draftId);
  
  return stagiaire;
}

// Brouillons de tâches
export function getTacheDrafts(): TacheDraft[] {
  const data = localStorage.getItem(TACHE_DRAFTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTacheDraft(draft: Partial<TacheDraft>, id?: string): TacheDraft {
  const drafts = getTacheDrafts();
  const now = new Date().toISOString();
  
  if (id) {
    // Mise à jour d'un brouillon existant
    const index = drafts.findIndex(d => d.id === id);
    if (index !== -1) {
      drafts[index] = {
        ...drafts[index],
        ...draft,
        dateModification: now,
      };
      localStorage.setItem(TACHE_DRAFTS_KEY, JSON.stringify(drafts));
      return drafts[index];
    }
  }
  
  // Nouveau brouillon
  const newDraft: TacheDraft = {
    ...draft,
    id: id || Date.now().toString(),
    dateCreation: now,
    dateModification: now,
  } as TacheDraft;
  
  drafts.push(newDraft);
  localStorage.setItem(TACHE_DRAFTS_KEY, JSON.stringify(drafts));
  return newDraft;
}

export function deleteTacheDraft(id: string): void {
  const drafts = getTacheDrafts();
  const filtered = drafts.filter(d => d.id !== id);
  localStorage.setItem(TACHE_DRAFTS_KEY, JSON.stringify(filtered));
}

// Tags
export function getTags(): Tag[] {
  const data = localStorage.getItem(TAGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addTag(tag: Omit<Tag, 'id'>): Tag {
  const tags = getTags();
  const newTag: Tag = {
    ...tag,
    id: Date.now().toString(),
  };
  tags.push(newTag);
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  return newTag;
}

export function updateTag(id: string, updates: Partial<Tag>): void {
  const tags = getTags();
  const index = tags.findIndex(t => t.id === id);
  if (index !== -1) {
    tags[index] = { ...tags[index], ...updates };
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }
}

export function deleteTag(id: string): void {
  const tags = getTags().filter(t => t.id !== id);
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  
  // Supprimer le tag des stagiaires et tâches
  const stagiaires = getStagiaires();
  stagiaires.forEach(s => {
    if (s.tags?.includes(id)) {
      updateStagiaire(s.id, { tags: s.tags.filter(t => t !== id) });
    }
  });
  
  const taches = getTaches();
  taches.forEach(t => {
    if (t.tags?.includes(id)) {
      updateTache(t.id, { tags: t.tags.filter(tag => tag !== id) });
    }
  });
}

export function convertDraftToTache(draftId: string): Tache | null {
  const drafts = getTacheDrafts();
  const draft = drafts.find(d => d.id === draftId);
  
  if (!draft) return null;
  
  // Vérifier que tous les champs requis sont présents
  if (!draft.titre || !draft.stagiaireIds || draft.stagiaireIds.length === 0 || !draft.dateEcheance) {
    return null;
  }
  
  // Créer la tâche
  const tache = addTache({
    titre: draft.titre,
    description: draft.description || '',
    stagiaireIds: draft.stagiaireIds,
    statut: 'non-commence',
    dateCreation: new Date().toISOString(),
    dateEcheance: draft.dateEcheance,
    estGroupe: draft.stagiaireIds.length > 1,
  });
  
  // Supprimer le brouillon
  deleteTacheDraft(draftId);
  
  return tache;
}
