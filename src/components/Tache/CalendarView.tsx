import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { Tache, Stagiaire } from '../../types';
import { TacheCard } from './TacheCard';

interface CalendarViewProps {
  taches: Tache[];
  stagiaires: Stagiaire[];
  onUpdate: () => void;
  onEdit: (tache: Tache) => void;
}

export function CalendarView({ taches, stagiaires, onUpdate, onEdit }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const getTachesForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    
    return taches.filter(tache => {
      const tacheDate = new Date(tache.dateEcheance).toISOString().split('T')[0];
      return tacheDate === dateString;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = [];
  
  // Cellules vides avant le premier jour
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} style={{ 
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-gray-50)',
    }} />);
  }

  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTaches = getTachesForDate(day);
    const isTodayDate = isToday(day);
    
    days.push(
      <div
        key={day}
        style={{
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius)',
          backgroundColor: isTodayDate ? '#fff7ed' : 'var(--color-white)',
          border: isTodayDate ? '2px solid var(--color-orange)' : '1px solid var(--color-gray-200)',
          minHeight: '120px',
          cursor: 'pointer',
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => {
          if (!isTodayDate) {
            e.currentTarget.style.borderColor = 'var(--color-gray-300)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isTodayDate) {
            e.currentTarget.style.borderColor = 'var(--color-gray-200)';
          }
        }}
      >
        <div style={{
          fontWeight: isTodayDate ? 700 : 500,
          marginBottom: 'var(--spacing-sm)',
          color: isTodayDate ? 'var(--color-orange)' : 'var(--color-black)',
        }}>
          {day}
        </div>
        
        {dayTaches.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--spacing-xs)' 
          }}>
            {dayTaches.slice(0, 3).map(tache => {
              const statusColor = 
                tache.statut === 'termine' ? 'var(--color-green)' :
                tache.statut === 'en-cours' ? 'var(--color-orange)' :
                'var(--color-gray-400)';
              
              return (
                <div
                  key={tache.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(tache);
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: statusColor + '20',
                    borderLeft: `3px solid ${statusColor}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = statusColor + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = statusColor + '20';
                  }}
                  title={tache.titre}
                >
                  <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}>
                    {tache.titre}
                  </div>
                  {tache.estGroupe && (
                    <div style={{ 
                      fontSize: '0.65rem', 
                      color: 'var(--color-gray-600)',
                      marginTop: '2px',
                    }}>
                      👥 Groupe
                    </div>
                  )}
                </div>
              );
            })}
            
            {dayTaches.length > 3 && (
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--color-gray-500)',
                padding: 'var(--spacing-xs)',
                textAlign: 'center',
              }}>
                +{dayTaches.length - 3} autre(s)
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header du calendrier */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-2xl)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-gray-200)',
      }}>
        <button onClick={previousMonth} className="button button-icon button-outline">
          <ChevronLeft size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <CalendarIcon size={20} style={{ color: 'var(--color-orange)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button onClick={today} className="button button-secondary">
            Aujourd'hui
          </button>
          <button onClick={nextMonth} className="button button-icon button-outline">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grille du calendrier */}
      <div>
        {/* Noms des jours */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-sm)',
        }}>
          {dayNames.map(day => (
            <div
              key={day}
              style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-gray-600)',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--spacing-sm)',
        }}>
          {days}
        </div>
      </div>

      {/* Légende */}
      <div style={{
        marginTop: 'var(--spacing-2xl)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-gray-50)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        gap: 'var(--spacing-2xl)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: 'var(--color-gray-400)',
            borderRadius: 'var(--radius-sm)',
          }} />
          <span style={{ fontSize: '0.875rem' }}>Non commencé</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: 'var(--color-orange)',
            borderRadius: 'var(--radius-sm)',
          }} />
          <span style={{ fontSize: '0.875rem' }}>En cours</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: 'var(--color-green)',
            borderRadius: 'var(--radius-sm)',
          }} />
          <span style={{ fontSize: '0.875rem' }}>Terminé</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--color-orange)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#fff7ed',
          }} />
          <span style={{ fontSize: '0.875rem' }}>Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
