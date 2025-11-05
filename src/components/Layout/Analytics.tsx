import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Stagiaire, Tache } from '../../types';
import { BarChart3, TrendingUp, Users, CheckSquare, Target } from 'lucide-react';

interface AnalyticsProps {
  stagiaires: Stagiaire[];
  taches: Tache[];
}

type FilterType = 'filieres' | 'stagiaires' | 'statuts';

export function Analytics({ stagiaires, taches }: AnalyticsProps) {
  const [filter, setFilter] = useState<FilterType>('filieres');

  // Données: Tâches par filière
  const getTachesParFiliere = () => {
    const filieres: { [key: string]: { total: number; termine: number; enCours: number; nonCommence: number } } = {};
    
    taches.forEach(tache => {
      tache.stagiaireIds.forEach(stagiaireId => {
        const stagiaire = stagiaires.find(s => s.id === stagiaireId);
        if (stagiaire) {
          if (!filieres[stagiaire.filiere]) {
            filieres[stagiaire.filiere] = { total: 0, termine: 0, enCours: 0, nonCommence: 0 };
          }
          filieres[stagiaire.filiere].total += 1;
          if (tache.statut === 'termine') filieres[stagiaire.filiere].termine += 1;
          if (tache.statut === 'en-cours') filieres[stagiaire.filiere].enCours += 1;
          if (tache.statut === 'non-commence') filieres[stagiaire.filiere].nonCommence += 1;
        }
      });
    });
    
    return Object.entries(filieres).map(([filiere, stats]) => ({
      nom: filiere,
      'Terminé': stats.termine,
      'En cours': stats.enCours,
      'Non commencé': stats.nonCommence,
    }));
  };

  // Données: Tâches par stagiaire (top 10)
  const getTachesParStagiaire = () => {
    return stagiaires
      .map(stagiaire => {
        const stagiairesTaches = taches.filter(t => t.stagiaireIds.includes(stagiaire.id));
        const total = stagiairesTaches.length;
        const termine = stagiairesTaches.filter(t => t.statut === 'termine').length;
        const enCours = stagiairesTaches.filter(t => t.statut === 'en-cours').length;
        const nonCommence = stagiairesTaches.filter(t => t.statut === 'non-commence').length;
        
        return {
          nom: `${stagiaire.prenom} ${stagiaire.nom.charAt(0)}.`,
          'Terminé': termine,
          'En cours': enCours,
          'Non commencé': nonCommence,
          total,
        };
      })
      .filter(s => s.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  // Données: Vue globale des statuts
  const getStatutsGlobal = () => {
    return [{
      nom: 'Vue globale',
      'Terminé': taches.filter(t => t.statut === 'termine').length,
      'En cours': taches.filter(t => t.statut === 'en-cours').length,
      'Non commencé': taches.filter(t => t.statut === 'non-commence').length,
    }];
  };

  const getData = () => {
    switch (filter) {
      case 'filieres':
        return getTachesParFiliere();
      case 'stagiaires':
        return getTachesParStagiaire();
      case 'statuts':
        return getStatutsGlobal();
      default:
        return [];
    }
  };

  const data = getData();

  // Calculs des stats
  const totalTaches = taches.length;
  const tachesTerminees = taches.filter(t => t.statut === 'termine').length;
  const tachesEnCours = taches.filter(t => t.statut === 'en-cours').length;
  const tachesGroupe = taches.filter(t => t.estGroupe).length;
  const tauxCompletion = totalTaches > 0 ? Math.round((tachesTerminees / totalTaches) * 100) : 0;
  const moyenneTachesParStagiaire = stagiaires.length > 0 ? (totalTaches / stagiaires.length).toFixed(1) : 0;

  return (
    <div>
      {/* Stats rapides en haut */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <Target size={20} style={{ color: 'var(--color-orange)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-600)' }}>
              Taux de complétion
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-orange)' }}>
            {tauxCompletion}%
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)' }}>
            {tachesTerminees} / {totalTaches} tâches
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <CheckSquare size={20} style={{ color: 'var(--color-orange)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-600)' }}>
              En cours
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-orange)' }}>
            {tachesEnCours}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)' }}>
            {tachesGroupe} en groupe
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <Users size={20} style={{ color: 'var(--color-orange)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-600)' }}>
              Moyenne
            </span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-orange)' }}>
            {moyenneTachesParStagiaire}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)' }}>
            tâches / stagiaire
          </div>
        </div>
      </div>

      {/* Graphique principal avec filtre */}
      <div className="card">
        <div className="card-header">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-lg)',
          }}>
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                <BarChart3 size={24} style={{ color: 'var(--color-orange)' }} />
                Analyse détaillée
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', margin: 0 }}>
                {filter === 'filieres' && 'Répartition des tâches par filière'}
                {filter === 'stagiaires' && 'Top 10 des stagiaires les plus actifs'}
                {filter === 'statuts' && 'Vue globale des statuts'}
              </p>
            </div>

            {/* Filtre */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button
                onClick={() => setFilter('filieres')}
                className={`button ${filter === 'filieres' ? 'button-primary' : 'button-outline'}`}
              >
                Par filière
              </button>
              <button
                onClick={() => setFilter('stagiaires')}
                className={`button ${filter === 'stagiaires' ? 'button-primary' : 'button-outline'}`}
              >
                Par stagiaire
              </button>
              <button
                onClick={() => setFilter('statuts')}
                className={`button ${filter === 'statuts' ? 'button-primary' : 'button-outline'}`}
              >
                Par statut
              </button>
            </div>
          </div>
        </div>

        <div className="card-content">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis 
                  dataKey="nom" 
                  angle={filter === 'statuts' ? 0 : -45}
                  textAnchor={filter === 'statuts' ? 'middle' : 'end'}
                  height={filter === 'statuts' ? 50 : 120}
                  tick={{ fontSize: 12, fill: 'var(--color-gray-600)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-gray-600)' }}
                  label={{ 
                    value: 'Nombre de tâches', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: 'var(--color-gray-600)', fontSize: 12 }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    fontSize: '14px',
                  }}
                />
                <Bar dataKey="Terminé" fill="#22c55e" name="✓ Terminé" stackId="a" />
                <Bar dataKey="En cours" fill="#ff6600" name="⟳ En cours" stackId="a" />
                <Bar dataKey="Non commencé" fill="#a3a3a3" name="○ Non commencé" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <BarChart3 size={48} style={{ opacity: 0.3 }} />
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
