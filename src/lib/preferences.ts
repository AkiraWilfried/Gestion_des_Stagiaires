import type { UserPreferences } from '../types/index';

const PREFERENCES_KEY = 'boss-preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  showCalendar: false,
  showAnalytics: true,
  defaultView: 'list',
};

export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error);
  }
}

export function toggleTheme(): 'light' | 'dark' {
  const current = getPreferences();
  const newTheme = current.theme === 'light' ? 'dark' : 'light';
  savePreferences({ theme: newTheme });
  return newTheme;
}

export function applyTheme(theme: 'light' | 'dark'): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Génère une couleur cohérente basée sur un string
export function generateColorFromString(str: string): string {
  const colors = [
    '#ff6600', // Orange
    '#3b82f6', // Bleu
    '#10b981', // Vert
    '#f59e0b', // Jaune
    '#8b5cf6', // Violet
    '#ec4899', // Rose
    '#14b8a6', // Teal
    '#f97316', // Orange foncé
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
