import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Stagiaire, Tache } from '../types/index';
import { getTachesByStagiaire } from './storage';

export const exportStagiairesToPDF = (stagiaires: Stagiaire[], filiere?: string) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(20);
  doc.setTextColor(255, 102, 0); // Orange
  const title = filiere ? `Liste des stagiaires - ${filiere}` : 'Liste de tous les stagiaires';
  doc.text(title, 14, 20);
  
  // Date du rapport
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);
  
  // Préparer les données par filière
  const stagiairesByFiliere: { [key: string]: Stagiaire[] } = {};
  const filteredStagiaires = filiere 
    ? stagiaires.filter(s => s.filiere === filiere)
    : stagiaires;
  
  filteredStagiaires.forEach(stagiaire => {
    if (!stagiairesByFiliere[stagiaire.filiere]) {
      stagiairesByFiliere[stagiaire.filiere] = [];
    }
    stagiairesByFiliere[stagiaire.filiere].push(stagiaire);
  });
  
  let currentY = 35;
  
  // Pour chaque filière
  Object.entries(stagiairesByFiliere).forEach(([filiereNom, stagiairesList]) => {
    // Titre de la filière
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(filiereNom, 14, currentY);
    currentY += 7;
    
    // Préparer les données du tableau
    const tableData = stagiairesList.map(stagiaire => {
      const taches = getTachesByStagiaire(stagiaire.id);
      const tachesTerminees = taches.filter(t => t.statut === 'termine').length;
      const tachesTotales = taches.length;
      
      return [
        `${stagiaire.prenom} ${stagiaire.nom}`,
        stagiaire.email,
        stagiaire.nomParent,
        stagiaire.numeroParent,
        `${new Date(stagiaire.dateDebut).toLocaleDateString('fr-FR')} - ${new Date(stagiaire.dateFin).toLocaleDateString('fr-FR')}`,
        `${tachesTerminees}/${tachesTotales}`,
      ];
    });
    
    // Créer le tableau
    autoTable(doc, {
      startY: currentY,
      head: [['Nom complet', 'Email', 'Parent', 'Téléphone', 'Période', 'Tâches']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 102, 0], // Orange
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 14, right: 14 },
    });
    
    // @ts-ignore - autoTable adds finalY to the doc
    currentY = doc.lastAutoTable.finalY + 10;
    
    // Vérifier si on doit ajouter une nouvelle page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
  });
  
  // Résumé global
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total de stagiaires: ${filteredStagiaires.length}`, 14, currentY);
  
  // Sauvegarder le PDF
  const fileName = filiere 
    ? `stagiaires-${filiere.toLowerCase().replace(/\s+/g, '-')}.pdf`
    : 'stagiaires.pdf';
  doc.save(fileName);
};
