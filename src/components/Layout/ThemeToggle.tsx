import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getPreferences, toggleTheme, applyTheme } from '../../lib/preferences';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefs = getPreferences();
    setTheme(prefs.theme);
    applyTheme(prefs.theme);
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        backgroundColor: theme === 'dark' ? '#262626' : '#f5f5f5',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        border: `2px solid ${theme === 'dark' ? '#404040' : '#e5e5e5'}`,
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'all 0.3s ease',
        boxShadow: theme === 'dark' 
          ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 4px 12px rgba(0, 0, 0, 0.6)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 2px 8px rgba(0, 0, 0, 0.5)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      {theme === 'light' ? (
        <>
          <Moon size={18} />
          <span>Mode sombre</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span>Mode clair</span>
        </>
      )}
    </button>
  );
}
