import { useState, useEffect } from 'react';
import { Users, CheckSquare, Download, FileText, Calendar, BarChart3, Tag } from 'lucide-react';
import './styles/app.css';

import { Header } from './components/Layout/Header';
import { StatsCard } from './components/Layout/StatsCard';
import { GlobalSearch } from './components/Layout/GlobalSearch';
import { Analytics } from './components/Layout/Analytics';
import { TagManager } from './components/Layout/TagManager';
import { StagiaireForm } from './components/Stagiaire/StagiaireForm';
import { StagiaireList } from './components/Stagiaire/StagiaireList';
import { StagiaireDrafts } from './components/Stagiaire/StagiaireDrafts';
import { TacheForm } from './components/Tache/TacheForm';
import { TacheList } from './components/Tache/TacheList';
import { TacheDrafts } from './components/Tache/TacheDrafts';
import { CalendarView } from './components/Tache/CalendarView';

import { getStagiaires, getTaches } from './lib/storage';
import { exportStagiairesToPDF } from './lib/export-pdf';
import { sortTaches } from './lib/helpers';
import type { Stagiaire, Tache, Filiere, StagiaireDraft, TacheDraft } from './types/index';

const filieres: Filiere[] = [
  'Développement Web',
  'Développement Mobile',
  'Data Science',
  'Cybersécurité',
  'Design UX/UI',
  'Marketing Digital',
  'Autre',
];

type MainTab = 'stagiaires' | 'taches' | 'analytics';
type SubTab = 'list' | 'drafts';
type TacheView = 'list' | 'calendar';

export default function App() {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<string>('all');
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('stagiaires');
  const [activeStagiaireSubTab, setActiveStagiaireSubTab] = useState<SubTab>('list');
  const [activeTacheSubTab, setActiveTacheSubTab] = useState<SubTab>('list');
  const [tacheView, setTacheView] = useState<TacheView>('list');
  const [tacheSortBy, setTacheSortBy] = useState<'date' | 'statut' | 'titre'>('date');
  const [refresh, setRefresh] = useState(0);
  
  // États pour les drafts en édition
  const [editingStagiaireDraft, setEditingStagiaireDraft] = useState<StagiaireDraft | undefined>();
  const [editingTacheDraft, setEditingTacheDraft] = useState<TacheDraft | undefined>();
  const [editingTache, setEditingTache] = useState<Tache | undefined>();
  const [editingStagiaire, setEditingStagiaire] = useState<Stagiaire | undefined>();

  useEffect(() => {
    setStagiaires(getStagiaires());
    setTaches(getTaches());
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  const filteredStagiaires = selectedFiliere === 'all'
    ? stagiaires
    : stagiaires.filter(s => s.filiere === selectedFiliere);

  const sortedTaches = sortTaches(taches, tacheSortBy);

  const totalTaches = taches.length;
  const tachesTerminees = taches.filter(t => t.statut === 'termine').length;
  const tachesEnCours = taches.filter(t => t.statut === 'en-cours').length;
  const tachesGroupe = taches.filter(t => t.estGroupe).length;

  const handleExportPDF = () => {
    exportStagiairesToPDF(
      stagiaires,
      selectedFiliere === 'all' ? undefined : selectedFiliere
    );
  };

  const handleEditStagiaireDraft = (draft: StagiaireDraft) => {
    setEditingStagiaireDraft(draft);
    setActiveStagiaireSubTab('list');
  };

  const handleEditTacheDraft = (draft: TacheDraft) => {
    setEditingTacheDraft(draft);
    setActiveTacheSubTab('list');
  };

  const handleEditTache = (tache: Tache) => {
    setEditingTache(tache);
  };

  const handleEditStagiaire = (stagiaire: Stagiaire) => {
    setEditingStagiaire(stagiaire);
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="container">
          {/* Recherche globale */}
          <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <GlobalSearch 
              stagiaires={stagiaires}
              taches={taches}
              onSelectStagiaire={(stagiaire) => {
                setEditingStagiaire(stagiaire);
                setActiveMainTab('stagiaires');
              }}
              onSelectTache={(tache) => {
                setEditingTache(tache);
                setActiveMainTab('taches');
              }}
            />
          </div>

          {/* Statistiques */}
          <div className="stats-grid">
            <StatsCard
              title="Stagiaires"
              value={stagiaires.length}
              label="stagiaires inscrits"
              icon={<Users />}
            />
            <StatsCard
              title="Tâches totales"
              value={totalTaches}
              label="tâches créées"
              icon={<CheckSquare />}
            />
            <StatsCard
              title="Terminées"
              value={tachesTerminees}
              label={`${totalTaches > 0 ? Math.round((tachesTerminees / totalTaches) * 100) : 0}% complété`}
              icon={<CheckSquare />}
              variant="success"
            />
            <StatsCard
              title="En cours"
              value={tachesEnCours}
              label={tachesGroupe > 0 ? `dont ${tachesGroupe} en groupe` : 'tâches actives'}
              icon={<CheckSquare />}
              variant="warning"
            />
          </div>

          {/* Onglets principaux */}
          <div className="tabs">
            <div className="tabs-list">
              <button
                className={`tab-trigger ${activeMainTab === 'stagiaires' ? 'active' : ''}`}
                onClick={() => setActiveMainTab('stagiaires')}
              >
                <Users size={16} />
                Stagiaires
              </button>
              <button
                className={`tab-trigger ${activeMainTab === 'taches' ? 'active' : ''}`}
                onClick={() => setActiveMainTab('taches')}
              >
                <CheckSquare size={16} />
                Tâches
              </button>
              <button
                className={`tab-trigger ${activeMainTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveMainTab('analytics')}
              >
                <BarChart3 size={16} />
                Analytics
              </button>
            </div>

            {/* Section Stagiaires */}
            {activeMainTab === 'stagiaires' && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-flex">
                    <div>
                      <h2 className="card-title">Gestion des stagiaires</h2>
                      <p className="card-description">
                        {filteredStagiaires.length} stagiaire(s)
                        {selectedFiliere !== 'all' && ` en ${selectedFiliere}`}
                      </p>
                    </div>
                    <div className="actions">
                      <TagManager type="stagiaire" onUpdate={handleRefresh} />
                      {editingStagiaireDraft ? (
                        <StagiaireForm 
                          onSuccess={handleRefresh} 
                          draft={editingStagiaireDraft}
                          onCloseDraft={() => setEditingStagiaireDraft(undefined)}
                        />
                      ) : editingStagiaire ? (
                        <StagiaireForm 
                          onSuccess={() => {
                            handleRefresh();
                            setEditingStagiaire(undefined);
                          }}
                          stagiaireToEdit={editingStagiaire}
                          onCloseEdit={() => setEditingStagiaire(undefined)}
                        />
                      ) : (
                        <StagiaireForm onSuccess={handleRefresh} />
                      )}
                    </div>
                  </div>

                  {/* Sous-onglets */}
                  <div className="tabs-list" style={{ marginTop: '1rem' }}>
                    <button
                      className={`tab-trigger ${activeStagiaireSubTab === 'list' ? 'active' : ''}`}
                      onClick={() => setActiveStagiaireSubTab('list')}
                    >
                      Liste
                    </button>
                    <button
                      className={`tab-trigger ${activeStagiaireSubTab === 'drafts' ? 'active' : ''}`}
                      onClick={() => setActiveStagiaireSubTab('drafts')}
                    >
                      <FileText size={16} />
                      Brouillons
                    </button>
                  </div>

                  {activeStagiaireSubTab === 'list' && (
                    <div className="filters">
                      <select
                        className="form-select"
                        value={selectedFiliere}
                        onChange={(e) => setSelectedFiliere(e.target.value)}
                        style={{ width: '250px' }}
                      >
                        <option value="all">Toutes les filières</option>
                        {filieres.map((filiere) => (
                          <option key={filiere} value={filiere}>
                            {filiere}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleExportPDF}
                        className="button button-outline"
                        disabled={filteredStagiaires.length === 0}
                      >
                        <Download />
                        Exporter en PDF
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-content">
                  {activeStagiaireSubTab === 'list' ? (
                    <StagiaireList 
                      stagiaires={filteredStagiaires}
                      onEdit={handleEditStagiaire}
                    />
                  ) : (
                    <StagiaireDrafts 
                      onUpdate={handleRefresh}
                      onEditDraft={handleEditStagiaireDraft}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Section Tâches */}
            {activeMainTab === 'taches' && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-flex">
                    <div>
                      <h2 className="card-title">Gestion des tâches</h2>
                      <p className="card-description">
                        Créez des tâches individuelles ou de groupe et envoyez-les par email/WhatsApp
                      </p>
                    </div>
                    <div className="actions">
                      <TagManager type="tache" onUpdate={handleRefresh} />
                      {editingTacheDraft ? (
                        <TacheForm 
                          stagiaires={stagiaires} 
                          onSuccess={handleRefresh}
                          draft={editingTacheDraft}
                          onCloseDraft={() => setEditingTacheDraft(undefined)}
                        />
                      ) : editingTache ? (
                        <TacheForm 
                          stagiaires={stagiaires} 
                          onSuccess={() => {
                            handleRefresh();
                            setEditingTache(undefined);
                          }}
                          tacheToEdit={editingTache}
                          onCloseEdit={() => setEditingTache(undefined)}
                        />
                      ) : (
                        <TacheForm stagiaires={stagiaires} onSuccess={handleRefresh} />
                      )}
                    </div>
                  </div>

                  {/* Sous-onglets */}
                  <div className="tabs-list" style={{ marginTop: '1rem' }}>
                    <button
                      className={`tab-trigger ${activeTacheSubTab === 'list' ? 'active' : ''}`}
                      onClick={() => setActiveTacheSubTab('list')}
                    >
                      Liste
                    </button>
                    <button
                      className={`tab-trigger ${activeTacheSubTab === 'drafts' ? 'active' : ''}`}
                      onClick={() => setActiveTacheSubTab('drafts')}
                    >
                      <FileText size={16} />
                      Brouillons
                    </button>
                  </div>

                  {/* Options de vue et tri */}
                  {activeTacheSubTab === 'list' && (
                    <div className="filters">
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button
                          onClick={() => setTacheView('list')}
                          className={`button ${tacheView === 'list' ? 'button-primary' : 'button-outline'}`}
                        >
                          <FileText size={16} />
                          Liste
                        </button>
                        <button
                          onClick={() => setTacheView('calendar')}
                          className={`button ${tacheView === 'calendar' ? 'button-primary' : 'button-outline'}`}
                        >
                          <Calendar size={16} />
                          Calendrier
                        </button>
                      </div>

                      {tacheView === 'list' && (
                        <select
                          className="form-select"
                          value={tacheSortBy}
                          onChange={(e) => setTacheSortBy(e.target.value as any)}
                          style={{ width: '200px' }}
                        >
                          <option value="date">Trier par date</option>
                          <option value="statut">Trier par statut</option>
                          <option value="titre">Trier par titre</option>
                        </select>
                      )}
                    </div>
                  )}
                </div>

                <div className="card-content">
                  {activeTacheSubTab === 'list' ? (
                    tacheView === 'list' ? (
                      <TacheList 
                        taches={sortedTaches} 
                        stagiaires={stagiaires} 
                        onUpdate={handleRefresh}
                        onEdit={handleEditTache}
                      />
                    ) : (
                      <CalendarView
                        taches={taches}
                        stagiaires={stagiaires}
                        onUpdate={handleRefresh}
                        onEdit={handleEditTache}
                      />
                    )
                  ) : (
                    <TacheDrafts
                      stagiaires={stagiaires}
                      onUpdate={handleRefresh}
                      onEditDraft={handleEditTacheDraft}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Section Analytics */}
            {activeMainTab === 'analytics' && (
              <div>
                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 600, 
                    marginBottom: 'var(--spacing-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                  }}>
                    <BarChart3 size={24} style={{ color: 'var(--color-orange)' }} />
                    Analytics & Statistiques
                  </h2>
                  <p style={{ color: 'var(--color-gray-500)' }}>
                    Vue d'ensemble détaillée de vos stagiaires et tâches
                  </p>
                </div>
                <Analytics stagiaires={stagiaires} taches={taches} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
