import { useState, useEffect } from 'react';
import { Tag as TagIcon, Plus, X, Edit2, Trash2 } from 'lucide-react';
import type { Tag } from '../../types';
import { getTags, addTag, updateTag, deleteTag } from '../../lib/storage';
import { generateColorFromString } from '../../lib/preferences';

interface TagManagerProps {
  type?: 'stagiaire' | 'tache' | 'all';
  onUpdate?: () => void;
}

export function TagManager({ type = 'all', onUpdate }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [selectedColor, setSelectedColor] = useState('');

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

  useEffect(() => {
    loadTags();
  }, [type]);

  const loadTags = () => {
    const allTags = getTags();
    setTags(type === 'all' ? allTags : allTags.filter(t => t.type === type));
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const tagType = type === 'all' ? 'stagiaire' : type;
    const color = selectedColor || generateColorFromString(newTagName);
    
    addTag({
      nom: newTagName.trim(),
      couleur: color,
      type: tagType,
    });
    
    setNewTagName('');
    setSelectedColor('');
    loadTags();
    onUpdate?.();
  };

  const handleUpdateTag = () => {
    if (!editingTag || !newTagName.trim()) return;
    
    updateTag(editingTag.id, {
      nom: newTagName.trim(),
      couleur: selectedColor || editingTag.couleur,
    });
    
    setEditingTag(null);
    setNewTagName('');
    setSelectedColor('');
    loadTags();
    onUpdate?.();
  };

  const handleDeleteTag = (id: string) => {
    if (!confirm('Supprimer ce tag ? Il sera retiré de tous les éléments.')) return;
    
    deleteTag(id);
    loadTags();
    onUpdate?.();
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.nom);
    setSelectedColor(tag.couleur);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
    setSelectedColor('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="button button-outline"
      >
        <TagIcon size={16} />
        Gérer les tags
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <TagIcon size={20} />
            Gestion des tags
          </h2>
          <button onClick={() => setIsOpen(false)} className="modal-close">
            <X />
          </button>
        </div>

        <div className="modal-content">
          {/* Formulaire d'ajout/édition */}
          <div className="form-group">
            <label className="form-label">
              {editingTag ? 'Modifier le tag' : 'Nouveau tag'}
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <input
                type="text"
                placeholder="Nom du tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="form-input"
                style={{ flex: 1 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    editingTag ? handleUpdateTag() : handleAddTag();
                  }
                }}
              />
              {editingTag ? (
                <>
                  <button
                    onClick={handleUpdateTag}
                    className="button button-primary"
                    disabled={!newTagName.trim()}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="button button-secondary"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddTag}
                  className="button button-primary"
                  disabled={!newTagName.trim()}
                >
                  <Plus size={16} />
                  Ajouter
                </button>
              )}
            </div>
          </div>

          {/* Sélection de couleur */}
          <div className="form-group">
            <label className="form-label">Couleur</label>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              flexWrap: 'wrap' 
            }}>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: color,
                    border: selectedColor === color 
                      ? '3px solid var(--color-black)' 
                      : '2px solid var(--color-gray-200)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Liste des tags */}
          <div className="form-group">
            <label className="form-label">
              Tags existants ({tags.length})
            </label>
            {tags.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--spacing-2xl)' }}>
                <TagIcon size={48} style={{ opacity: 0.3, margin: '0 auto var(--spacing-lg)' }} />
                <p>Aucun tag créé</p>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--spacing-sm)' 
              }}>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--color-gray-50)',
                      borderRadius: 'var(--radius)',
                      border: editingTag?.id === tag.id 
                        ? '2px solid var(--color-orange)' 
                        : '1px solid var(--color-gray-200)',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: tag.couleur,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{tag.nom}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                        Type: {tag.type === 'stagiaire' ? 'Stagiaire' : 'Tâche'}
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(tag)}
                      className="button button-icon button-outline"
                      title="Modifier"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="button button-icon button-danger"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => setIsOpen(false)} className="button button-primary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
