import { useState } from 'react';
import { Mail, Calendar, Users, Edit2 } from 'lucide-react';
import type { Stagiaire } from '../../types';
import { StagiaireDetails } from './StagiaireDetails';

interface StagiaireCardProps {
  stagiaire: Stagiaire;
  onEdit: (stagiaire: Stagiaire) => void;
}

export function StagiaireCard({ stagiaire, onEdit }: StagiaireCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <>
      {showDetails && (
        <StagiaireDetails 
          stagiaire={stagiaire}
          onClose={() => setShowDetails(false)}
        />
      )}
      
      <div className="stagiaire-card">
      <div className="stagiaire-header">
        <div onClick={() => setShowDetails(true)} style={{ flex: 1, cursor: 'pointer' }}>
          <h3 className="stagiaire-name">
            {stagiaire.prenom} {stagiaire.nom}
          </h3>
          <span className="badge badge-primary">{stagiaire.filiere}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(stagiaire);
          }}
          className="button button-icon button-outline"
          title="Modifier"
        >
          <Edit2 size={16} />
        </button>
      </div>

      <div className="stagiaire-info">
        <div className="info-item">
          <Mail size={14} />
          <div>
            <strong>Email:</strong> {stagiaire.email}
          </div>
        </div>
        
        <div className="info-item">
          <Calendar size={14} />
          <div>
            <strong>Période:</strong> {formatDate(stagiaire.dateDebut)} - {formatDate(stagiaire.dateFin)}
          </div>
        </div>

        <div className="info-item">
          <Users size={14} />
          <div>
            <strong>Parent:</strong> {stagiaire.nomParent}
          </div>
        </div>

        <div className="info-item">
          <Users size={14} />
          <div>
            <strong>Contact:</strong> {stagiaire.numeroParent}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
