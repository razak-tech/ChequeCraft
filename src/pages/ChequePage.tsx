import React from 'react';
import { Link } from 'react-router-dom';
import ChequeGenerator from '../components/ChequeGenerator';

type Lang = 'en' | 'fr';

type AppDict = ReturnType<() => never> extends never
  ? {
      en: any;
      fr: any;
    }
  : never;

interface Props {
  lang: Lang;
  t: AppDict;
}

const ChequePage: React.FC<Props> = ({ lang, t }) => {
  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex justify-center mb-8">
        <Link to="/" className="glow-btn glow-red" aria-label="Back to Home" title="Back to Home">
          <span className="btn-icon icon-glow" aria-hidden="true">
            {/* Home icon (duotone minimal) */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path opacity=".9" d="M12 3l9 8h-2v8a2 2 0 0 1-2 2h-3v-6H10v6H7a2 2 0 0 1-2-2v-8H3l9-8z" />
            </svg>
          </span>
          <span className="btn-label text-lg md:text-xl">Back to Home</span>
        </Link>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <ChequeGenerator lang={lang} t={t} />
      </div>
    </div>
  );
};

export default ChequePage;
