import { CheckSquare } from 'lucide-react';
import type { Tache, Stagiaire } from '../../types';
import { TacheCard } from './TacheCard';

interface TacheListProps {
  taches: Tache[];
  stagiaires: Stagiaire[];
  onUpdate: () => void;
  onEdit: (tache: Tache) => void;
}

export function TacheList({ taches, stagiaires, onUpdate, onEdit }: TacheListProps) {
  if (taches.length === 0) {
    return (
      <div className="empty-state">
        <CheckSquare />
        <p>Aucune tâche créée</p>
        <p className="text-sm">Commencez par créer une tâche et l'assigner à un ou plusieurs stagiaires</p>
      </div>
    );
  }

  return (
    <div>
      {taches.map((tache) => (
        <TacheCard 
          key={tache.id} 
          tache={tache} 
          stagiaires={stagiaires}
          onUpdate={onUpdate}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
