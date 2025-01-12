import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Add type augmentation for jspdf-autotable
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const generatePDF = (content: string, name: string): jsPDF => {
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(20);
  pdf.text(name, 20, 20);
  
  // Add timestamp
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

  // Convert markdown table to array for jspdf-autotable
  const rows = content
    .split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#'))
    .map(line => line.split('|').map(cell => cell.trim()));

  // Remove empty cells and markdown table formatting
  const cleanRows = rows
    .filter(row => row.length > 1)
    .map(row => row.filter(cell => cell !== '' && !cell.match(/^[-:]+$/)));

  if (cleanRows.length > 0) {
    pdf.autoTable({
      startY: 40,
      head: [cleanRows[0]],
      body: cleanRows.slice(1),
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [35, 47, 62],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });
  }

  return pdf;
};