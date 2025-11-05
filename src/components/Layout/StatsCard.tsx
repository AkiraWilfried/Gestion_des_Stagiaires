import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  label: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export function StatsCard({ title, value, label, icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        {icon}
        <span className="stat-title">{title}</span>
      </div>
      <div className={`stat-value ${variant}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
