import React from 'react';
import { ChequeConfig, ChequeData } from '../types';

interface ChequePreviewProps {
  config: ChequeConfig;
  data: ChequeData;
}

const ChequePreview: React.FC<ChequePreviewProps> = ({ config, data }) => {
  const scaleX = 400 / config.template.width; // Scale to fit preview
  const scaleY = 180 / config.template.height;
  const scale = Math.min(scaleX, scaleY);
  
  const previewWidth = config.template.width * scale;
  const previewHeight = config.template.height * scale;

  // Format numbers like 10000 -> 10,000.00
  const formatAmount = (value: unknown) => {
    const num = typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/,/g, '').trim());
    if (isNaN(num)) return String(value ?? '');
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-neutral-50 border-2 border-neutral-200 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
      <div 
        className="relative bg-gradient-to-br from-white via-neutral-50/50 to-primary-50/20"
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          margin: '0 auto'
        }}
      >
        {/* Cheque Background */}
        <div className="absolute inset-2 border-2 border-primary-200 rounded-lg bg-white/90 backdrop-blur-sm shadow-soft">
          {/* Bank Header */}
          <div className="absolute top-2 left-2">
            <div className="font-bold text-sm bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">BANQUE MODERNE</div>
            <div className="text-xs text-neutral-600 font-medium">123 Avenue des Finances, 75001 Paris</div>
          </div>
          
          {/* Cheque Number */}
          <div className="absolute top-2 right-2 text-xs font-mono bg-primary-100 px-2 py-1 rounded-md text-primary-700 font-semibold">
            No. 001234
          </div>
          
          {/* Amount Box */}
          <div 
            className="absolute border-2 border-primary-300 bg-gradient-to-r from-primary-50 to-accent-50 rounded-md shadow-soft"
            style={{
              left: `${145 * scale}px`,
              top: `${25 * scale}px`,
              width: `${45 * scale}px`,
              height: `${12 * scale}px`
            }}
          >
          </div>
          
          {/* Signature Line */}
          <div 
            className="absolute border-b-2 border-primary-300 rounded-sm"
            style={{
              left: `${130 * scale}px`,
              top: `${70 * scale}px`,
              width: `${60 * scale}px`
            }}
          ></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full opacity-60"></div>
        </div>
        
        {/* Dynamic Fields */}
        {config.fields.map((field) => {
          const value = data[field.id];
          if (value === undefined || value === null || value === '') return null;
          
          let displayValue = '';
          if (field.type === 'date' && value instanceof Date) {
            displayValue = value.toLocaleDateString('fr-FR');
          } else if (field.type === 'number') {
            displayValue = formatAmount(value);
          } else {
            displayValue = value.toString();
          }
          
          const fontSize = Math.max(8, (field.fontSize || 12) * scale * 0.8);
          
          return (
            <div
              key={field.id}
              className="absolute font-cheque"
              style={{
                left: `${field.position.x * scale}px`,
                top: `${field.position.y * scale}px`,
                width: `${field.width * scale}px`,
                height: `${field.height * scale}px`,
                fontSize: `${fontSize}px`,
                overflow: 'hidden',
                lineHeight: '1.2'
              }}
            >
              {displayValue}
            </div>
          );
        })}
      </div>
      
      {/* Preview Label */}
      <div className="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white pl-2 pr-3 py-1.5 rounded-full text-xs font-semibold shadow-soft flex items-center gap-1.5">
        <span className="neo-mini-icon-sm">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </span>
        <span>Live Preview</span>
      </div>
    </div>
  );
};

export default ChequePreview;