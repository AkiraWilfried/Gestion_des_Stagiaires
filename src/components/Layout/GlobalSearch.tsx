import { useState, useEffect } from 'react';
import { Search, X, User, CheckSquare } from 'lucide-react';
import type { Stagiaire, Tache } from '../../types';
import { searchStagiaires, searchTaches } from '../../lib/helpers';

interface GlobalSearchProps {
  stagiaires: Stagiaire[];
  taches: Tache[];
  onSelectStagiaire?: (stagiaire: Stagiaire) => void;
  onSelectTache?: (tache: Tache) => void;
}

export function GlobalSearch({ stagiaires, taches, onSelectStagiaire, onSelectTache }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    stagiaires: Stagiaire[];
    taches: Tache[];
  }>({ stagiaires: [], taches: [] });

  useEffect(() => {
    if (query.trim()) {
      setResults({
        stagiaires: searchStagiaires(stagiaires, query),
        taches: searchTaches(taches, query),
      });
      setIsOpen(true);
    } else {
      setResults({ stagiaires: [], taches: [] });
      setIsOpen(false);
    }
  }, [query, stagiaires, taches]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const totalResults = results.stagiaires.length + results.taches.length;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
      <div style={{ position: 'relative' }}>
        <Search 
          size={18} 
          style={{
            position: 'absolute',
            left: 'var(--spacing-md)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-gray-400)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Rechercher stagiaires ou tâches..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '2.5rem',
            paddingRight: query ? '2.5rem' : 'var(--spacing-lg)',
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: 'var(--spacing-sm)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-gray-500)',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && totalResults > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + var(--spacing-sm))',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000,
        }}>
          {results.stagiaires.length > 0 && (
            <div>
              <div style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-gray-50)',
                borderBottom: '1px solid var(--color-gray-200)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-gray-600)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}>
                <User size={12} />
                Stagiaires ({results.stagiaires.length})
              </div>
              {results.stagiaires.map((stagiaire) => (
                <div
                  key={stagiaire.id}
                  onClick={() => {
                    onSelectStagiaire?.(stagiaire);
                    handleClear();
                  }}
                  style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    borderBottom: '1px solid var(--color-gray-100)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>
                    {stagiaire.prenom} {stagiaire.nom}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                    {stagiaire.filiere} • {stagiaire.email}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.taches.length > 0 && (
            <div>
              <div style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-gray-50)',
                borderBottom: '1px solid var(--color-gray-200)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--color-gray-600)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}>
                <CheckSquare size={12} />
                Tâches ({results.taches.length})
              </div>
              {results.taches.map((tache) => (
                <div
                  key={tache.id}
                  onClick={() => {
                    onSelectTache?.(tache);
                    handleClear();
                  }}
                  style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    borderBottom: '1px solid var(--color-gray-100)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>
                    {tache.titre}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                    Échéance: {new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && totalResults === 0 && query && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + var(--spacing-sm))',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          color: 'var(--color-gray-500)',
          zIndex: 1000,
        }}>
          Aucun résultat trouvé pour "{query}"
        </div>
      )}
    </div>
  );
}
