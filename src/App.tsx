import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ChequePage from './pages/ChequePage'
import BackToTop from './components/BackToTop'
import ChatWidget from './components/ChatWidget'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [lang, setLang] = useState<'en' | 'fr'>(() => {
    const saved = localStorage.getItem('lang') as 'en' | 'fr' | null;
    if (saved) return saved;
    return 'en';
  });

  // Minimal i18n dictionary for visible UI text
  const t = {
    en: {
      beta: 'Beta',
      titleCreate: 'Create',
      titleYourCheque: 'Your Cheque',
      subtitle: 'Fill your information below to generate a professional cheque with auto-formatting and instant PDF export.',
      themeLight: 'Light',
      themeDark: 'Dark',
      toggleLanguageTitle: 'Toggle language',
      placeholders: {
        selectDate: 'Select date...'
      },
      fields: {
        name: 'Pay to the order of',
        date: 'Date',
        address: 'Address',
        amount: 'Amount (Numbers)',
        amountWords: 'Amount in Words (Dinar Algerien)',
      },
      generator: {
        sectionTitle: 'Cheque Information',
        sectionDesc: 'Fill in the details for your cheque',
        panelTitle: 'Generate Cheque',
        panelDesc: 'Ready to create your cheque?',
        btnGeneratePrint: 'Print',
        infoTitle: 'Print preview',
        infoBody: 'Your cheque opens in the browser\'s print preview. Choose your printer or save as PDF there.',
        pdf: 'PDF',
        format: 'Format',
      },
      toasts: {
        success: 'Cheque sent to print preview!',
        error: 'Error printing cheque. Please try again.',
        headingSuccess: 'Success!',
        headingError: 'Error!'
      },
    },
    fr: {
      beta: 'Bêta',
      titleCreate: 'Créer',
      titleYourCheque: 'Votre chèque',
      subtitle: "Renseignez vos informations ci‑dessous pour générer un chèque professionnel avec auto‑mise en forme et export PDF instantané.",
      themeLight: 'Clair',
      themeDark: 'Sombre',
      toggleLanguageTitle: 'Changer de langue',
      placeholders: {
        selectDate: 'Sélectionner une date...'
      },
      fields: {
        name: 'Bénéficiaire',
        date: 'Date',
        address: 'Adresse',
        amount: 'Montant (chiffres)',
        amountWords: 'Montant en lettres (Dinar Algerien)',
      },
      generator: {
        sectionTitle: 'Informations du chèque',
        sectionDesc: 'Renseignez les détails de votre chèque',
        panelTitle: 'Générer le chèque',
        panelDesc: 'Prêt à créer votre chèque ?',
        btnGeneratePrint: 'Imprimer',
        infoTitle: 'Aperçu avant impression',
        infoBody: "Le chèque s'ouvre dans l'aperçu d'impression du navigateur. Choisissez votre imprimante ou enregistrez en PDF depuis cette fenêtre.",
        pdf: 'PDF',
        format: 'Format',
      },
      toasts: {
        success: 'Chèque envoyé à l\'aperçu avant impression !',
        error: 
          'Erreur lors de l\'impression du chèque. Veuillez réessayer.',
        headingSuccess: 'Succès !',
        headingError: 'Erreur !'
      },
    },
  } as const;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'fr' : 'en'));

  return (
    <div className="app">
      <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen py-12 px-4 relative overflow-hidden hero-gradient-light hero-gradient-dark">
            {/* Top Bar: Logo (left), Centered Nav (center), Language/Theme (right) */}
            <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 relative">
              {/* Text Logo */}
              <div className="flex items-center space-x-3 select-none">
                <Link to="/" className="text-2xl font-extrabold font-display tracking-tight">
                  <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">Cheque</span>
                  <span className="text-neutral-900 dark:text-neutral-100">Craft</span>
                </Link>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-white/10 dark:text-neutral-200 dark:border-white/10">{t[lang].beta}</span>
              </div>

              {/* Centered simple navigation */}
              <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-6 text-sm">
                <Link to="/" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">Home</Link>
                <Link to="/about" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">About</Link>
                <Link to="/services" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">Services</Link>
                <Link to="/contact" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">Contact</Link>
              </nav>

              {/* Futuristic glowing pill buttons (Language + Theme) */}
              <div className="flex items-center gap-3">
                {/* Language button */}
                <button
                  onClick={toggleLang}
                  className="glow-btn glow-red glow-sm"
                  aria-label={t[lang].toggleLanguageTitle}
                  title={t[lang].toggleLanguageTitle}
                >
                  <span className="sparkles" aria-hidden="true">
                    <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 4.2L18 8l-4.2 1.8L12 14l-1.8-4.2L6 8l4.2-1.8L12 2z"/></svg>
                    <svg className="sparkle delay-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.2 2.8L16 7l-2.8 1.2L12 11l-1.2-2.8L8 7l2.8-1.2L12 3z"/></svg>
                    <svg className="sparkle delay-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l1 2.2L15 7l-2.2 1L12 10l-1-2L9 7l2-0.8L12 4z"/></svg>
                  </span>
                  <span className="btn-icon icon-glow" aria-hidden="true">
                    {/* Stylized translation icon (duotone, minimal) */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <rect x="3" y="4" width="8" height="8" rx="2" opacity=".55" />
                      <rect x="13" y="12" width="8" height="8" rx="2" opacity=".9" />
                      <path d="M6 8h2m-1 0v3M16 15h3M17.5 15v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9"/>
                      <path d="M12 12l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
                    </svg>
                  </span>
                  <span className="btn-label">{lang.toUpperCase()}</span>
                </button>

                {/* Theme button */}
                <button
                  onClick={toggleTheme}
                  className="glow-btn glow-red glow-sm"
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  <span className="sparkles" aria-hidden="true">
                    <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 4.2L18 8l-4.2 1.8L12 14l-1.8-4.2L6 8l4.2-1.8L12 2z"/></svg>
                    <svg className="sparkle delay-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.2 2.8L16 7l-2.8 1.2L12 11l-1.2-2.8L8 7l2.8-1.2L12 3z"/></svg>
                    <svg className="sparkle delay-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l1 2.2L15 7l-2.2 1L12 10l-1-2L9 7l2-0.8L12 4z"/></svg>
                  </span>
                  <span className="btn-icon icon-glow" aria-hidden="true">
                    {theme === 'dark' ? (
                      // Sun (duotone minimal)
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <circle cx="12" cy="12" r="4.5" opacity=".9" />
                        <g opacity=".6">
                          <circle cx="12" cy="3.5" r="1" />
                          <circle cx="12" cy="20.5" r="1" />
                          <circle cx="3.5" cy="12" r="1" />
                          <circle cx="20.5" cy="12" r="1" />
                          <circle cx="5.8" cy="5.8" r="1" />
                          <circle cx="18.2" cy="5.8" r="1" />
                          <circle cx="5.8" cy="18.2" r="1" />
                          <circle cx="18.2" cy="18.2" r="1" />
                        </g>
                      </svg>
                    ) : (
                      // Moon (duotone minimal)
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path opacity=".9" d="M21 12.8A9.1 9.1 0 1111.2 3a7.1 7.1 0 009.8 9.8z" />
                        <circle cx="17.5" cy="6.5" r="1" opacity=".6" />
                        <circle cx="19.5" cy="9.5" r=".8" opacity=".6" />
                      </svg>
                    )}
                  </span>
                  <span className="btn-label">{theme === 'dark' ? t[lang].themeLight : t[lang].themeDark}</span>
                </button>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="dot-grid-left-bottom-light"></div>
              <div className="dot-grid-left-bottom"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <header className="text-center mt-24 md:mt-40 lg:mt-48 mb-16 animate-slide-up">
                <h1 className="title-hero font-display mb-3">
                  <span className="title-primary">{t[lang].titleCreate}</span>
                  <br />
                  <span className="title-secondary">{t[lang].titleYourCheque}</span>
                </h1>
                <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                  {t[lang].subtitle}
                </p>
              </header>

              {/* Button to navigate to cheque page */}
              <div className="flex justify-center">
                <Link to="/cheque" className="glow-btn glow-red" aria-label="Create Cheque" title="Create Cheque">
                  <span className="sparkles" aria-hidden="true">
                    <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 4.2L18 8l-4.2 1.8L12 14l-1.8-4.2L6 8l4.2-1.8L12 2z"/></svg>
                    <svg className="sparkle delay-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.2 2.8L16 7l-2.8 1.2L12 11l-1.2-2.8L8 7l2.8-1.2L12 3z"/></svg>
                    <svg className="sparkle delay-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l1 2.2L15 7l-2.2 1L12 10l-1-2L9 7l2-0.8L12 4z"/></svg>
                  </span>
                  <span className="btn-label text-lg md:text-xl">Create Cheque</span>
                  <span className="btn-icon icon-glow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Feature grid: Why ChequeCraft? */}
            <section className="max-w-7xl mx-auto mt-20 md:mt-28">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-center mb-3">
                <span className="text-neutral-900 dark:text-white">Why </span>
                <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">ChequeCraft?</span>
              </h2>
              <p className="text-center text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-10">
                We make cheque creation fast, accurate, and professional—no design skills required.
              </p>
              <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Card 1 */}
                <div className="feature-card rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 backdrop-blur shadow-medium hover:shadow-strong transition-shadow">
                  <div className="neo-mini-icon icon-breath">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 7h16v2H4zM4 11h10v2H4zM4 15h16v2H4z"/></svg>
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Smart Formatting</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">Amounts and dates auto‑formatted to regional standards.</p>
                </div>
                {/* Card 2 */}
                <div className="feature-card rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 backdrop-blur shadow-medium hover:shadow-strong transition-shadow">
                  <div className="neo-mini-icon icon-breath">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2l4 4-7 7-4 1 1-4z"/><path d="M14 4l6 6-8 8H6v-6z" opacity=".5"/></svg>
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Professional Layouts</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">Crisp, print‑ready cheques that look great every time.</p>
                </div>
                {/* Card 3 */}
                <div className="feature-card rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 backdrop-blur shadow-medium hover:shadow-strong transition-shadow">
                  <div className="neo-mini-icon icon-breath">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3a9 9 0 100 18 9 9 0 000-18zm-1 5h2v5h-2V8zm0 6h2v2h-2v-2z"/></svg>
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Error Prevention</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">Inline guidance helps avoid costly mistakes.</p>
                </div>
                {/* Card 4 */}
                <div className="feature-card rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-5 backdrop-blur shadow-medium hover:shadow-strong transition-shadow">
                  <div className="neo-mini-icon icon-breath">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 6h16v10H4z" opacity=".5"/><path d="M6 8h8v2H6zm0 4h12v2H6z"/></svg>
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">Instant PDF</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">One‑click export for printing or sharing.</p>
                </div>
              </div>
            </section>

            {/* Split Section: Why it matters */}
            <section className="max-w-7xl mx-auto mt-20 md:mt-28 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold mb-3">
                  <span className="text-neutral-900 dark:text-white">Why </span>
                  <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">It Matters</span>
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Cheques are still widely used for rent, invoices, and formal payments. ChequeCraft reduces errors,
                  keeps formatting consistent, and saves time with a guided flow that works on any device.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link to="/cheque" className="glow-btn glow-red glow-sm" aria-label="Create Cheque" title="Create Cheque">
                    <span className="btn-label">Start Now</span>
                    <span className="btn-icon icon-glow" aria-hidden="true">→</span>
                  </Link>
                  <a href="#how" className="rounded-xl px-4 py-2 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50/60 dark:hover:bg-white/5 transition">Learn More</a>
                </div>
              </div>
              {/* Illustrative graphic: document + shield */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="relative rounded-3xl p-8 bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur">
                  <svg viewBox="0 0 400 260" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="20" width="240" height="160" rx="16" fill="currentColor" className="text-white/80 dark:text-white/5"/>
                    <rect x="60" y="45" width="120" height="14" rx="7" fill="url(#g1)"/>
                    <rect x="60" y="75" width="200" height="10" rx="5" fill="url(#g2)"/>
                    <rect x="60" y="95" width="130" height="10" rx="5" fill="url(#g2)"/>
                    <rect x="60" y="115" width="180" height="10" rx="5" fill="url(#g2)"/>
                    <g transform="translate(280,60)">
                      <path d="M40 0l40 12v32c0 24-16 44-40 52-24-8-40-28-40-52V12L40 0z" fill="url(#g3)"/>
                      <path d="M40 20a30 30 0 1030 30A30 30 0 0040 20zm-6 33l-9-9 5-5 4 4 12-12 5 5z" fill="white" opacity=".9"/>
                    </g>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f43f5e"/>
                        <stop offset="100%" stopColor="#ef4444"/>
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fecaca"/>
                        <stop offset="100%" stopColor="#fecaca" stopOpacity=".6"/>
                      </linearGradient>
                      <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity=".9"/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity=".9"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </section>

            {/* How it works */}
            <section id="how" className="max-w-7xl mx-auto mt-20 md:mt-28">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-center mb-12">
                <span className="text-neutral-900 dark:text-white">How It </span>
                <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">Works</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { n: '1', t: 'Fill Details', d: 'Enter payee, amount, date, and optional notes.' },
                  { n: '2', t: 'Preview & Adjust', d: 'Live preview with guidance to avoid mistakes.' },
                  { n: '3', t: 'Print or Save', d: 'Export a crisp PDF or print directly.' },
                ].map(step => (
                  <div key={step.n} className="rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-6 backdrop-blur shadow-medium">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-center font-semibold shadow-soft">
                      {step.n}
                    </div>
                    <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">{step.t}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{step.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto mt-24 md:mt-32 py-10 text-center text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-white/10">
              <p>
                © {new Date().getFullYear()} ChequeCraft. All rights reserved.
                <span className="mx-2">•</span>
                <a className="hover:text-neutral-900 dark:hover:text-neutral-200" href="#">Privacy</a>
                <span className="mx-2">•</span>
                <a className="hover:text-neutral-900 dark:hover:text-neutral-200" href="#">Terms</a>
              </p>
            </footer>
            {/* AI Chat floating widget (home screen only) */}
            <ChatWidget title="ChequeCraft AI" />
          </div>
        }
      />
      <Route
        path="/cheque"
        element={
          <div className="min-h-screen py-12 px-4 relative overflow-hidden hero-gradient-light hero-gradient-dark">
            {/* Top Bar duplicated on Cheque page */}
            <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 relative">
              <div className="flex items-center space-x-3 select-none">
                <Link to="/" className="text-2xl font-extrabold font-display tracking-tight">
                  <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">Cheque</span>
                  <span className="text-neutral-900 dark:text-neutral-100">Craft</span>
                </Link>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-white/10 dark:text-neutral-200 dark:border-white/10">{t[lang].beta}</span>
              </div>
              <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-6 text-sm">
                <Link to="/" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">Home</Link>
                <Link to="/about" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">About</Link>
                <Link to="/services" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">Services</Link>
                <Link to="/contact" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">Contact</Link>
              </nav>
              <div className="flex items-center gap-3">
                <button onClick={toggleLang} className="glow-btn glow-red glow-sm" aria-label={t[lang].toggleLanguageTitle} title={t[lang].toggleLanguageTitle}>
                  <span className="sparkles" aria-hidden="true">
                    <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 4.2L18 8l-4.2 1.8L12 14l-1.8-4.2L6 8l4.2-1.8L12 2z"/></svg>
                    <svg className="sparkle delay-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.2 2.8L16 7l-2.8 1.2L12 11l-1.2-2.8L8 7l2.8-1.2L12 3z"/></svg>
                    <svg className="sparkle delay-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l1 2.2L15 7l-2.2 1L12 10l-1-2L9 7l2-0.8L12 4z"/></svg>
                  </span>
                  <span className="btn-icon icon-glow" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <rect x="3" y="4" width="8" height="8" rx="2" opacity=".55" />
                      <rect x="13" y="12" width="8" height="8" rx="2" opacity=".9" />
                      <path d="M6 8h2m-1 0v3M16 15h3M17.5 15v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9"/>
                      <path d="M12 12l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
                    </svg>
                  </span>
                  <span className="btn-label">{lang.toUpperCase()}</span>
                </button>
                <button onClick={toggleTheme} className="glow-btn glow-red glow-sm" aria-label="Toggle theme" title="Toggle theme">
                  <span className="sparkles" aria-hidden="true">
                    <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 4.2L18 8l-4.2 1.8L12 14l-1.8-4.2L6 8l4.2-1.8L12 2z"/></svg>
                    <svg className="sparkle delay-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.2 2.8L16 7l-2.8 1.2L12 11l-1.2-2.8L8 7l2.8-1.2L12 3z"/></svg>
                    <svg className="sparkle delay-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l1 2.2L15 7l-2.2 1L12 10l-1-2L9 7l2-0.8L12 4z"/></svg>
                  </span>
                  <span className="btn-icon icon-glow" aria-hidden="true">
                    {theme === 'dark' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <circle cx="12" cy="12" r="4.5" opacity=".9" />
                        <g opacity=".6">
                          <circle cx="12" cy="3.5" r="1" />
                          <circle cx="12" cy="20.5" r="1" />
                          <circle cx="3.5" cy="12" r="1" />
                          <circle cx="20.5" cy="12" r="1" />
                          <circle cx="5.8" cy="5.8" r="1" />
                          <circle cx="18.2" cy="5.8" r="1" />
                          <circle cx="5.8" cy="18.2" r="1" />
                          <circle cx="18.2" cy="18.2" r="1" />
                        </g>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path opacity=".9" d="M21 12.8A9.1 9.1 0 1111.2 3a7.1 7.1 0 009.8 9.8z" />
                        <circle cx="17.5" cy="6.5" r="1" opacity=".6" />
                        <circle cx="19.5" cy="9.5" r=".8" opacity=".6" />
                      </svg>
                    )}
                  </span>
                  <span className="btn-label">{theme === 'dark' ? t[lang].themeLight : t[lang].themeDark}</span>
                </button>
              </div>
            </div>

            {/* Keep background for visual consistency */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="dot-grid-left-bottom-light"></div>
              <div className="dot-grid-left-bottom"></div>
            </div>
            <ChequePage lang={lang} t={t} />
          </div>
        }
      />
      <Route
        path="/about"
        element={
          <div className="min-h-screen py-12 px-4 relative overflow-hidden hero-gradient-light hero-gradient-dark">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold mb-4">About</h2>
              <p className="text-neutral-600 dark:text-neutral-300">This is a placeholder About page.</p>
            </div>
          </div>
        }
      />
      <Route
        path="/services"
        element={
          <div className="min-h-screen py-12 px-4 relative overflow-hidden hero-gradient-light hero-gradient-dark">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold mb-4">Services</h2>
              <p className="text-neutral-600 dark:text-neutral-300">This is a placeholder Services page.</p>
            </div>
          </div>
        }
      />
      <Route
        path="/contact"
        element={
          <div className="min-h-screen py-12 px-4 relative overflow-hidden hero-gradient-light hero-gradient-dark">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold mb-4">Contact</h2>
              <p className="text-neutral-600 dark:text-neutral-300">This is a placeholder Contact page.</p>
            </div>
          </div>
        }
      />
      </Routes>
      <BackToTop />
    </div>
  )
}

export default App