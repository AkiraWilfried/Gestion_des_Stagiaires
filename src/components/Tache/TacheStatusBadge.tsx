import { CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Tache } from '../../types';

interface TacheStatusBadgeProps {
  statut: Tache['statut'];
  size?: 'sm' | 'md' | 'lg';
}

export function TacheStatusBadge({ statut, size = 'md' }: TacheStatusBadgeProps) {
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  const configs = {
    'termine': {
      icon: <CheckCircle size={iconSize} />,
      label: 'Terminé',
      className: 'badge-success',
    },
    'en-cours': {
      icon: <Clock size={iconSize} />,
      label: 'En cours',
      className: 'badge-warning',
    },
    'non-commence': {
      icon: <XCircle size={iconSize} />,
      label: 'Non commencé',
      className: 'badge-default',
    },
  };

  const config = configs[statut];

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
