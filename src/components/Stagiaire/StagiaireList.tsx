import { Users } from 'lucide-react';
import type { Stagiaire } from '../../types';
import { StagiaireCard } from './StagiaireCard';

interface StagiaireListProps {
  stagiaires: Stagiaire[];
  onEdit: (stagiaire: Stagiaire) => void;
}

export function StagiaireList({ stagiaires, onEdit }: StagiaireListProps) {
  if (stagiaires.length === 0) {
    return (
      <div className="empty-state">
        <Users />
        <p>Aucun stagiaire enregistré</p>
        <p className="text-sm">Commencez par ajouter un stagiaire</p>
      </div>
    );
  }

  return (
    <div>
      {stagiaires.map((stagiaire) => (
        <StagiaireCard 
          key={stagiaire.id} 
          stagiaire={stagiaire}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
