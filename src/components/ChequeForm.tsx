import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ChequeConfig, ChequeData } from '../types';
import 'react-datepicker/dist/react-datepicker.css';

interface ChequeFormProps {
  config: ChequeConfig;
  data: ChequeData;
  onChange: (field: string, value: any) => void;
  lang: 'en' | 'fr';
  // shape matches keys used in App dictionary
  t: any;
}

const ChequeForm: React.FC<ChequeFormProps> = ({ config, data, onChange, lang, t }) => {
  const [openHistoryFor, setOpenHistoryFor] = useState<string | null>(null);
  const [histories, setHistories] = useState<Record<string, string[]>>({});

  const getKey = (id: string) => `cheque_history_${id}`;

  // Load histories (we only care about 'address')
  useEffect(() => {
    const next: Record<string, string[]> = {};
    const addrKey = getKey('address');
    try {
      const raw = localStorage.getItem(addrKey);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) next['address'] = arr.map(String).slice(0, 2);
      }
    } catch {}
    setHistories(next);
  }, [config.fields]);

  const saveToHistory = (fieldId: string, value: any) => {
    if (fieldId !== 'address') return; // only address keeps history
    if (value === undefined || value === null || value === '') return;
    let str: string;
    if (value instanceof Date) {
      str = value.toISOString();
    } else {
      str = String(value).trim();
    }
    if (!str) return;

    setHistories(prev => {
      const existing = prev[fieldId] || [];
      const withoutDup = [str, ...existing.filter(v => v !== str)];
      const limited = withoutDup.slice(0, 2); // keep only last 2
      try {
        localStorage.setItem(getKey(fieldId), JSON.stringify(limited));
      } catch {}
      return { ...prev, [fieldId]: limited };
    });
  };

  // History opens on focus and closes on blur; no toggle function needed

  const pickHistory = (field: { id: string; type: string }, stored: string) => {
    if (field.type === 'date') {
      const d = new Date(stored);
      if (!isNaN(d.getTime())) onChange(field.id, d);
    } else if (field.type === 'number') {
      const num = parseFloat(stored);
      if (!isNaN(num)) onChange(field.id, num);
    } else {
      onChange(field.id, stored);
    }
    setOpenHistoryFor(null);
  };

  const handleChange = (fieldId: string, value: any) => {
    onChange(fieldId, value);
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.fields.map((field) => (
          <div key={field.id} className={`space-y-3 ${field.id === 'amountWords' ? 'md:col-span-2' : ''}`}>
            <label className="form-label flex items-center space-x-2">
              <span>{t[lang]?.fields?.[field.id] ?? field.label}</span>
            </label>
            
            {field.type === 'text' && (
              <div className="relative group">
                <input
                  type="text"
                  className="form-input group-hover:shadow-soft transition-all duration-300"
                  value={data[field.id]?.toString() || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onFocus={() => {
                    if (field.id === 'address' && (histories['address']?.length ?? 0) > 0) setOpenHistoryFor('address');
                  }}
                  onBlur={(e) => {
                    saveToHistory(field.id, e.target.value);
                    if (field.id === 'address') setOpenHistoryFor(null);
                  }}
                  maxLength={field.maxLength}
                  required={field.required}
                  placeholder={`${lang === 'fr' ? 'Saisir' : 'Enter'} ${(t[lang]?.fields?.[field.id] ?? field.label).toLowerCase()}...`}
                />
                {/* Right decorative icon only */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="neo-mini-icon-sm">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                </div>

                {/* History dropdown (only for address) */}
                {field.id === 'address' && openHistoryFor === field.id && (histories[field.id]?.length ?? 0) > 0 && (
                  <ul
                    className="absolute z-20 mt-1 w-full max-h-44 overflow-auto rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-medium"
                    onMouseDown={(e) => e.preventDefault()}>{/* keep focus on input while selecting */}
                    {histories[field.id]!.map((val, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/10"
                          onClick={() => pickHistory(field as any, val)}
                        >
                          {val}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {field.type === 'number' && (
              <div className="relative group">
                <input
                  type="number"
                  className="form-input group-hover:shadow-soft transition-all duration-300"
                  value={data[field.id]?.toString() || ''}
                  onChange={(e) => handleChange(field.id, parseFloat(e.target.value) || 0)}
                  onBlur={(e) => saveToHistory(field.id, e.target.value)}
                  step="0.01"
                  min="0"
                  required={field.required}
                  placeholder={lang === 'fr' ? '0,00' : '0.00'}
                />
                {/* No history UI for numbers */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10">
                  <span className="neo-mini-icon-sm">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
                {/* No history dropdown for numbers */}
              </div>
            )}
            
            {field.type === 'date' && (
              <div className="relative group">
                <DatePicker
                  selected={data[field.id] as Date || new Date()}
                  onChange={(date) => handleChange(field.id, date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-input group-hover:shadow-soft transition-all duration-300"
                  onCalendarClose={() => saveToHistory(field.id, data[field.id])}
                  required={field.required}
                  placeholderText={t[lang]?.placeholders?.selectDate ?? 'Select date...'}
                />
                {/* No history UI for dates */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="neo-mini-icon-sm">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
                {/* No history dropdown for dates */}
              </div>
            )}
            
            {field.id === 'amountWords' && null}
          </div>
        ))}
      </div>
    </form>
  );
};

export default ChequeForm;