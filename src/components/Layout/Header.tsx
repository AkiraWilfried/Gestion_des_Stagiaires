import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-icon">
            <GraduationCap />
          </div>
          <div className="header-title">
            <h1>Gestion des Stagiaires</h1>
            <p>Plateforme de suivi pour responsables d'entreprise</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
