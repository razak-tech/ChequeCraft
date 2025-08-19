import React, { useState, useEffect, useRef } from 'react';
import { DocumentTextIcon, PrinterIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChequeConfig, ChequeData } from '../types';
import { numberToFrenchWords } from '../utils/numberToWords';
import { generateChequePDF, getPdfBlobUrl } from '../utils/pdfGenerator';
import ChequeForm from './ChequeForm';
import Toast from './Toast';
import chequeFieldsConfig from '../config/chequeFields.json';

interface ChequeGeneratorProps {
  lang: 'en' | 'fr';
  // shape matches keys used below; kept broad to avoid tight coupling
  t: any;
}

const ChequeGenerator: React.FC<ChequeGeneratorProps> = ({ lang, t }) => {
  const [config] = useState<ChequeConfig>(chequeFieldsConfig as ChequeConfig);
  const [chequeData, setChequeData] = useState<ChequeData>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Initialize with current date
  useEffect(() => {
    setChequeData(prev => ({
      ...prev,
      date: new Date()
    }));
  }, []);

  // Auto-convert amount to words when amount changes
  useEffect(() => {
    if (chequeData.amount && typeof chequeData.amount === 'number') {
      const wordsValue = numberToFrenchWords(chequeData.amount);
      setChequeData(prev => ({
        ...prev,
        amountWords: wordsValue
      }));
    }
  }, [chequeData.amount]);

  const handleDataChange = (field: string, value: any) => {
    setChequeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrintCheque = () => {
    try {
      // Generate the cheque PDF
      const pdf = generateChequePDF(config, chequeData);
      // Create blob URL and open modal preview
      const url = getPdfBlobUrl(pdf);
      // Revoke old URL if any
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setShowPreview(true);
      setToast({
        message: t[lang]?.toasts?.success ?? 'Cheque sent to print preview!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error printing cheque:', error);
      setToast({
        message: t[lang]?.toasts?.error ?? 'Error printing cheque. Please try again.',
        type: 'error'
      });
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  // Close preview helper
  const closePreview = () => {
    setShowPreview(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Print from iframe
  const printFromIframe = () => {
    const node = iframeRef.current;
    try {
      if (node && node.contentWindow) {
        node.contentWindow.focus();
        node.contentWindow.print();
      }
    } catch (e) {
      console.warn('Unable to trigger print from iframe:', e);
    }
  };

  // Esc to close modal
  useEffect(() => {
    if (!showPreview) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showPreview]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8 flex">
          <div className="card group hover:scale-[1.01] transition-transform duration-300 h-full flex-1">
            <div className="card-header">
              <div>
                <h2 className="text-3xl font-bold font-display text-neutral-800 dark:text-neutral-100">
                  {t[lang]?.generator?.sectionTitle ?? 'Cheque Information'}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{t[lang]?.generator?.sectionDesc ?? 'Fill in the details for your cheque'}</p>
              </div>
              <div className="neo-icon">
                <DocumentTextIcon className="w-6 h-6" aria-hidden />
              </div>
            </div>
            <ChequeForm
              config={config}
              data={chequeData}
              onChange={handleDataChange}
              lang={lang}
              t={t}
            />
          </div>
        </div>
        
        {/* Action Panel */}
        <div className="lg:col-span-1 space-y-8 flex">
          <div className="card group hover:scale-[1.01] transition-transform duration-300 h-full flex-1">
            <div className="card-header">
              <div>
                <h3 className="text-xl font-bold font-display text-neutral-800 dark:text-neutral-100">
                  {t[lang]?.generator?.panelTitle ?? 'Generate Cheque'}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{t[lang]?.generator?.panelDesc ?? 'Ready to create your cheque?'}</p>
              </div>
              <div className="neo-icon">
                <PrinterIcon className="w-5 h-5" aria-hidden />
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handlePrintCheque}
                className="btn-cta text-xl md:text-2xl font-semibold group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {t[lang]?.generator?.btnGeneratePrint ?? 'Generate & Print'}
                </span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              
              <div className="rounded-xl p-4 border bg-white/80 border-primary-100 dark:bg-white/5 dark:border-white/10">
                <div className="flex items-start space-x-3">
                  <span className="neo-mini-icon mt-0.5 flex-shrink-0">
                    <InformationCircleIcon className="w-5 h-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">{t[lang]?.generator?.infoTitle ?? 'Auto-save enabled'}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {t[lang]?.generator?.infoBody ?? 'Your cheque will be automatically generated as a PDF and saved to your downloads folder'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="text-center p-3 bg-neutral-50 dark:bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-300">{t[lang]?.generator?.pdf ?? 'PDF'}</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{t[lang]?.generator?.format ?? 'Format'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-100" onClick={closePreview} />
          {/* Modal */}
          <div className="relative w-[96vw] max-w-6xl h-[90vh] transform transition-all duration-200 ease-out scale-100">
            <div className="relative bg-white/95 dark:bg-neutral-900/95 rounded-2xl shadow-2xl border border-neutral-200/80 dark:border-white/10 ring-1 ring-black/5 overflow-hidden h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/80 dark:border-white/10 bg-neutral-50/60 dark:bg-white/5">
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                  <span className="neo-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V4h12v5M6 14h12v6H6zM8 9h8" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold tracking-wide">
                    {t[lang]?.generator?.pdf ?? 'PDF'} · {t[lang]?.generator?.panelTitle ?? 'Preview'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={printFromIframe} className="glow-btn glow-red glow-sm">
                    {lang === 'fr' ? 'Imprimer' : 'Print'}
                  </button>
                  <button onClick={closePreview} className="glow-btn glow-sm" aria-label="Close preview">
                    {lang === 'fr' ? 'Fermer' : 'Close'}
                  </button>
                </div>
              </div>
              {/* Body */}
              <div className="w-full h-[calc(90vh-52px)] bg-neutral-100 dark:bg-neutral-950">
                <iframe
                  ref={iframeRef}
                  title="Cheque PDF Preview"
                  src={previewUrl}
                  className="w-full h-full bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          headings={{
            success: t[lang]?.toasts?.headingSuccess ?? 'Success!',
            error: t[lang]?.toasts?.headingError ?? 'Error!',
          }}
        />
      )}
    </div>
  );
};

export default ChequeGenerator;