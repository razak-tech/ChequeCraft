import jsPDF from 'jspdf';
import { ChequeConfig, ChequeData } from '../types';

// Format numbers like 10000 -> 10,000.00
function formatAmount(value: unknown): string {
  const num = typeof value === 'number'
    ? value
    : parseFloat(String(value).replace(/,/g, '').trim());
  if (isNaN(num)) return String(value ?? '');
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function generateChequePDF(config: ChequeConfig, data: ChequeData): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [config.template.width, config.template.height]
  });
  
  // Process each field
  config.fields.forEach(field => {
    const value = data[field.id];
    if (value !== undefined && value !== null && value !== '') {
      let displayValue = '';
      
      if (field.type === 'date' && value instanceof Date) {
        displayValue = value.toLocaleDateString('fr-FR');
      } else if (field.type === 'number') {
        displayValue = formatAmount(value);
      } else {
        displayValue = value.toString();
      }
      
      // Append currency word only for the amount-in-words field
      if (field.id === 'amountWords') {
        displayValue = `${displayValue} Dinar`;
      }
      
      // Set font family and preferred font size
      const preferredFontSize = field.fontSize || 12;
      const fontFamily = field.fontFamily || 'courier';
      doc.setFont(fontFamily as any, 'normal');

      // Auto-shrink text to fit both width and height of the field's bounding box
      const maxWidth = field.width; // mm
      const maxHeight = field.height; // mm
      let fontSize = preferredFontSize;
      const minFontSize = 4; // sensible lower bound in pt to avoid unreadable text
      const step = 0.5; // pt

      // Helper to compute text height in mm. 1pt = 0.352778 mm (approx)
      const ptToMm = 0.352778;

      // Try preferred size first, then decrement until it fits
      while (fontSize >= minFontSize) {
        doc.setFontSize(fontSize);
        const width = doc.getTextWidth(displayValue);
        const height = fontSize * ptToMm; // single line height approximation

        if (width <= maxWidth && height <= maxHeight) {
          break;
        }
        fontSize -= step;
      }

      // Ensure font size is set before drawing
      doc.setFontSize(Math.max(fontSize, minFontSize));
      doc.text(displayValue, field.position.x, field.position.y);
    }
  });
  
  return doc;
}

export function savePDF(pdf: jsPDF, filename?: string): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = filename || `cheque-${timestamp}`;
  pdf.save(`${name}.pdf`);
}

export function printPDF(pdf: jsPDF): void {
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  
  const printWindow = window.open(url);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        URL.revokeObjectURL(url);
      };
    };
  }
}

// Returns a Blob URL for embedding the PDF in an <iframe src={...}>.
// Caller must revoke via URL.revokeObjectURL when finished.
export function getPdfBlobUrl(pdf: jsPDF): string {
  const pdfBlob = pdf.output('blob');
  return URL.createObjectURL(pdfBlob);
}