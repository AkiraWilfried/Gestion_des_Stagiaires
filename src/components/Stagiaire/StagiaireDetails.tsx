import { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Stagiaire, Tache } from '../../types';
import { getTachesByStagiaire } from '../../lib/storage';

interface StagiaireDetailsProps {
  stagiaire: Stagiaire;
  onClose: () => void;
}

export function StagiaireDetails({ stagiaire, onClose }: StagiaireDetailsProps) {
  const [taches, setTaches] = useState<Tache[]>([]);

  useEffect(() => {
    setTaches(getTachesByStagiaire(stagiaire.id));
  }, [stagiaire.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const tachesTerminees = taches.filter(t => t.statut === 'termine').length;
  const tachesEnCours = taches.filter(t => t.statut === 'en-cours').length;
  const tachesNonCommencees = taches.filter(t => t.statut === 'non-commence').length;

  const getStatutIcon = (statut: Tache['statut']) => {
    switch (statut) {
      case 'termine':
        return <CheckCircle size={16} style={{ color: 'var(--color-green)' }} />;
      case 'en-cours':
        return <Clock size={16} style={{ color: 'var(--color-orange)' }} />;
      default:
        return <XCircle size={16} style={{ color: 'var(--color-gray-400)' }} />;
    }
  };

  const getStatutLabel = (statut: Tache['statut']) => {
    switch (statut) {
      case 'termine':
        return 'Terminé';
      case 'en-cours':
        return 'En cours';
      default:
        return 'Non commencé';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {stagiaire.prenom} {stagiaire.nom}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X />
          </button>
        </div>

        <div className="modal-content">
          {/* Informations personnelles */}
          <div style={{ 
            backgroundColor: 'var(--color-gray-50)', 
            padding: '1rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Informations</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Mail size={14} />
                  <strong style={{ fontSize: '0.875rem' }}>Email</strong>
                </div>
                <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem' }}>{stagiaire.email}</p>
              </div>

              {stagiaire.telephone && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Phone size={14} />
                    <strong style={{ fontSize: '0.875rem' }}>Téléphone</strong>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem' }}>{stagiaire.telephone}</p>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Users size={14} />
                  <strong style={{ fontSize: '0.875rem' }}>Parent</strong>
                </div>
                <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem' }}>{stagiaire.nomParent}</p>
                <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem', color: 'var(--color-gray-600)' }}>
                  {stagiaire.numeroParent}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Calendar size={14} />
                  <strong style={{ fontSize: '0.875rem' }}>Période</strong>
                </div>
                <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                  {formatDate(stagiaire.dateDebut)} - {formatDate(stagiaire.dateFin)}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.875rem' }}>Filière</strong>
                <p style={{ marginTop: '0.25rem' }}>
                  <span className="badge badge-primary">{stagiaire.filiere}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques des tâches */}
          <h3 style={{ marginBottom: '1rem' }}>Tâches assignées</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              padding: '1rem',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-green)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Terminées</span>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{tachesTerminees}</p>
            </div>

            <div style={{ 
              padding: '1rem',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--color-orange)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>En cours</span>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{tachesEnCours}</p>
            </div>

            <div style={{ 
              padding: '1rem',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <XCircle size={16} style={{ color: 'var(--color-gray-400)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Non commencées</span>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{tachesNonCommencees}</p>
            </div>
          </div>

          {/* Liste des tâches */}
          {taches.length > 0 ? (
            <div>
              <h4 style={{ marginBottom: '0.75rem' }}>Détails des tâches ({taches.length})</h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {taches.map((tache) => (
                  <div 
                    key={tache.id}
                    style={{
                      border: '1px solid var(--color-gray-200)',
                      borderRadius: 'var(--radius)',
                      padding: '0.75rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {getStatutIcon(tache.statut)}
                      <strong style={{ fontSize: '0.875rem' }}>{tache.titre}</strong>
                      <span className={`badge badge-${
                        tache.statut === 'termine' ? 'success' : 
                        tache.statut === 'en-cours' ? 'warning' : 
                        'default'
                      }`} style={{ marginLeft: 'auto' }}>
                        {getStatutLabel(tache.statut)}
                      </span>
                    </div>
                    {tache.description && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '0.5rem' }}>
                        {tache.description}
                      </p>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Échéance : {formatDate(tache.dateEcheance)}
                      {tache.estGroupe && (
                        <span style={{ marginLeft: '1rem' }}>
                          <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Tâche de groupe
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
              <p>Aucune tâche assignée pour le moment</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="button button-primary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
