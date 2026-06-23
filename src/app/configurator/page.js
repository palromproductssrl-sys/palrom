'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import { sendGAEvent } from "@next/third-parties/google";


const t = {
  loading: { nl: 'Inladen portal...', en: 'Loading portal...', de: 'Portal wird geladen...', ro: 'Se încarcă portalul...' },
  passwordLabel: { nl: 'Wachtwoord *', en: 'Password *', de: 'Passwort *', ro: 'Parolă *' },
  passwordError: { nl: 'Ongeldig wachtwoord. Probeer het opnieuw.', en: 'Invalid password. Please try again.', de: 'Ungültiges Passwort. Bitte versuchen Sie es erneut.', ro: 'Parolă invalidă. Vă rugăm să încercați din nou.' },
  unlockButton: { nl: 'Toegang Ontgrendelen', en: 'Unlock Access', de: 'Zugang entsperren', ro: 'Deblochează Accesul' },
  portalTitle: { nl: 'B2B Partner Portal', en: 'B2B Partner Portal', de: 'B2B-Partnerportal', ro: 'Portal Partener B2B' },
  portalLead: { nl: 'Voer het wachtwoord in om toegang te krijgen tot de Palrom Offerte Configurator.', en: 'Enter the password to access the Palrom Quote Configurator.', de: 'Geben Sie das Passwort ein, um auf den Palrom Angebotskonfigurator zuzugreifen.', ro: 'Introduceți parola pentru a accesa Configuratorul de Oferte Palrom.' },
  showPasswordAria: { nl: 'Wachtwoord tonen/verbergen', en: 'Show/hide password', de: 'Passwort anzeigen/ausblenden', ro: 'Afișează/ascunde parola' },
  
  selectorTitle: { nl: 'B2B Offerte Configurator', en: 'B2B Quote Configurator', de: 'B2B-Angebotskonfigurator', ro: 'Configurator de Oferte B2B' },
  selectorSubtitle: { nl: 'Kies de gewenste interface om de configurator te testen en uw aanvraag samen te stellen.', en: 'Choose the desired interface to test the configurator and compile your request.', de: 'Wählen Sie die gewünschte Schnittstelle, um den Konfigurator zu testen und Ihre Anfrage zu erstellen.', ro: 'Alegeți interfața dorită pentru a testa configuratorul și a compila solicitarea dvs.' },
  
  v1Title: { nl: 'V1: Klassieke Accordeon', en: 'V1: Classic Accordion', de: 'V1: Klassisches Akkordeon', ro: 'V1: Acordeon clasic' },
  v1Desc: { nl: 'De vertrouwde, compacte interface. Alle configuratiestappen worden direct onder elkaar in een inklapbaar menu getoond. Ideaal voor snelle invoer.', en: 'The familiar, compact interface. All configuration steps are displayed directly below each other in a collapsible menu. Ideal for quick entry.', de: 'Die vertraute, kompakte Benutzeroberfläche. Alle Konfigurationsschritte werden direkt untereinander in einem faltbaren Menü angezeigt. Ideal für die schnelle Eingabe.', ro: 'Interfața familiară, compactă. Toți pașii de configurare sunt afișați direct unul sub celălalt într-un meniu pliabil. Ideal pentru introducere rapidă.' },
  v1Badge: { nl: 'Klassiek', en: 'Classic', de: 'Klassisch', ro: 'Clasic' },
  
  v2Title: { nl: 'V2: Multi-step Wizard', en: 'V2: Multi-step Wizard', de: 'V2: Multi-Step-Assistent', ro: 'V2: Asistent pas cu pas' },
  v2Desc: { nl: 'De nieuwe, intuïtieve interface. Leidt u stap-voor-stap door de configuratie met visuele hulpmiddelen, heldere slides en live previews.', en: 'The new, intuitive interface. Guides you step-by-step through the configuration with visual aids, clear slides, and live previews.', de: 'Die neue, intuitive Benutzeroberfläche. Führt Sie Schritt für Schritt mit visueller Auswahl, klaren Folien und Live-Vorschau durch die Konfiguration.', ro: 'Interfața nouă, intuitivă. Vă ghidează pas cu pas prin configurare cu opțiuni vizuale, diapozitive clare și previzualizări live.' },
  v2Badge: { nl: 'Nieuw', en: 'New', de: 'Neu', ro: 'Nou' },
  
  v3Title: { nl: 'V3: Chatbot Assistent', en: 'V3: Chatbot Assistant', de: 'V3: Chatbot-Assistent', ro: 'V3: Asistent Chatbot' },
  v3Desc: { nl: 'Configureer uw aanvraag in gesprek met onze virtuele adviseur PAL. Stapsgewijze begeleiding met interactieve invoer en live chatpreviews.', en: 'Configure your request in conversation with our virtual advisor PAL. Step-by-step guidance with interactive input and live chat previews.', de: 'Konfigurieren Sie Ihre Anfrage im Gespräch mit unserem virtuellen Berater PAL. Schritt-für-Schritt-Anleitung mit interaktiver Eingabe und Live-Chat-Vorschauen.', ro: 'Configurați-vă solicitarea în conversație cu consilierul nostru de vânzări virtual PAL. Ghidare pas cu pas cu introducere interactivă și previzualizări live pe chat.' },
  v3Badge: { nl: 'Chatbot', en: 'Chatbot', de: 'Chatbot', ro: 'Chatbot' },
  
  v4Title: { nl: 'V4: Open Chatbot (AI)', en: 'V4: Open Chatbot (AI)', de: 'V4: Offener Chatbot (KI)', ro: 'V4: Chatbot deschis (AI)' },
  v4Desc: { nl: 'Configureer uw aanvraag door vrijuit te chatten met PAL. Typ uw wensen in eigen woorden en de slimme assistent stelt uw offerte samen.', en: 'Configure your request by chatting freely with PAL. Type your wishes in your own words and our smart assistant will compile your quote.', de: 'Konfigurieren Sie Ihre Anfrage, indem Sie sich frei mit PAL unterhalten. Schreiben Sie Ihre Wünsche in eigenen Worten und der Assistent erstellt Ihr Angebot.', ro: 'Configurați-vă solicitarea discutând liber cu PAL. Scrieți cerințele dvs. în propriile cuvinte și asistentul inteligent vă va crea oferta.' },
  v4Badge: { nl: 'Open Chat', en: 'Open Chat', de: 'Offener Chat', ro: 'Chat deschis' },
  
  testButton: { nl: 'Configurator Starten', en: 'Start Configurator', de: 'Konfigurator starten', ro: 'Pornește configuratorul' },
  lockPortal: { nl: 'Portaal Vergrendelen', en: 'Lock Portal', de: 'Portal sperren', ro: 'Blochează Portalul' }
};

export default function ConfiguratorSelector() {
  const { lang } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_configurator_auth') === 'true';
      setIsAuthenticated(auth);
    }
    setIsLoading(false);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const validPasscodes = ['palrom2026', 'pal2026', 'palai2026'];
    if (validPasscodes.includes(password)) {
      sessionStorage.setItem('palrom_configurator_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('palrom_configurator_auth');
    setIsAuthenticated(false);
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '15rem 0', textAlign: 'center', background: '#f8fafc', color: '#1e293b' }}>
        <h3>{getTranslation('loading')}</h3>
      </div>
    );
  }

  // Not authenticated? Show passcode gate
  if (!isAuthenticated) {
    return (
      <>
        {/* Style injection to hide Header, Footer and Widget when auth is locked */}
        <style>{`
          .main-header, .main-footer, .floating-contact-widget { display: none !important; }
        `}</style>

        <div className="auth-gate-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
          <div className="auth-gate-card">
            <div className="auth-lock-icon">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2>{getTranslation('portalTitle')}</h2>
            <p>
              {getTranslation('portalLead')}
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <label
                  htmlFor="authPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: 'var(--color-text-dark)',
                  }}
                >
                  {getTranslation('passwordLabel')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="authPassword"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={getTranslation('showPasswordAria')}
                  >
                    <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>
                {authError && (
                  <div className="error-message">
                    <i className="fa-solid fa-triangle-exclamation"></i> {getTranslation('passwordError')}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%' }}>
                {getTranslation('unlockButton')} <i className="fa-solid fa-key icon-right"></i>
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .selector-card {
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          padding: 2.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-decoration: none !important;
        }
        .selector-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }
        .selector-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: transparent;
          transition: background-color 0.3s;
        }
        .selector-card:hover::before {
          background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
        }
        .card-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badge-classic {
          background: #e2e8f0;
          color: #475569;
        }
        .badge-new {
          background: rgba(231, 177, 36, 0.15);
          color: var(--color-primary-dark);
        }
        .card-icon-wrapper {
          width: 4.5rem;
          height: 4.5rem;
          border-radius: var(--border-radius-md);
          background: #f8fafc;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: var(--color-primary);
          margin-bottom: 2rem;
          transition: all 0.3s;
        }
        .selector-card:hover .card-icon-wrapper {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }
        .card-content h3 {
          font-size: 1.4rem;
          color: var(--color-text-dark);
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .card-content p {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .btn-lock {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 0.6rem 1.2rem;
          border-radius: var(--border-radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-lock:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
        .selector-card .btn-secondary {
          background-color: #ffffff !important;
          color: var(--color-text-dark) !important;
          border: 2px solid var(--color-text-dark) !important;
          backdrop-filter: none !important;
        }
        .selector-card .btn-secondary:hover {
          background-color: var(--color-text-dark) !important;
          color: #ffffff !important;
          border-color: var(--color-text-dark) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>

      {/* Hero Section */}
      <section className="configurator-hero" style={{ padding: '8.5rem 0 3rem', background: '#ffffff', borderBottom: '1px solid #edf2f7' }}>
        <div className="container text-center">
          <span className="hero-badge animate-fade-in" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            PALROM PORTAL
          </span>
          <h1 className="hero-title animate-slide-up" style={{ marginTop: '0.5rem', color: 'var(--color-text-dark)' }}>
            {getTranslation('selectorTitle')}
          </h1>
          <p className="hero-subtitle animate-slide-up-delay" style={{ maxWidth: '650px', margin: '1rem auto 0', color: 'var(--color-text-muted)' }}>
            {getTranslation('selectorSubtitle')}
          </p>
        </div>
      </section>

      {/* Grid selector cards */}
      <section className="selector-grid-section" style={{ padding: '4rem 0 6rem', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div className="selector-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {/* Card V1: Classic */}
            <Link href="/configurator/v1" className="selector-card" onClick={() => sendGAEvent({ event: 'configurator_start', value: 'v1' })}>
              <span className="card-badge badge-classic">{getTranslation('v1Badge')}</span>
              <div className="card-content">
                <div className="card-icon-wrapper">
                  <i className="fa-solid fa-list-ul"></i>
                </div>
                <h3>{getTranslation('v1Title')}</h3>
                <p>{getTranslation('v1Desc')}</p>
              </div>
              <span className="btn btn-secondary btn-block" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {getTranslation('testButton')} <i className="fa-solid fa-arrow-right icon-right"></i>
              </span>
            </Link>

            {/* Card V2: Stepper Wizard */}
            <Link href="/configurator/v2" className="selector-card" onClick={() => sendGAEvent({ event: 'configurator_start', value: 'v2' })}>
              <span className="card-badge badge-new">{getTranslation('v2Badge')}</span>
              <div className="card-content">
                <div className="card-icon-wrapper">
                  <i className="fa-solid fa-route"></i>
                </div>
                <h3>{getTranslation('v2Title')}</h3>
                <p>{getTranslation('v2Desc')}</p>
              </div>
              <span className="btn btn-primary btn-block" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {getTranslation('testButton')} <i className="fa-solid fa-arrow-right icon-right"></i>
              </span>
            </Link>

            {/* Card V3: Chatbot Assistent */}
            <Link href="/configurator/v3" className="selector-card" onClick={() => sendGAEvent({ event: 'configurator_start', value: 'v3' })}>
              <span className="card-badge badge-classic">{getTranslation('v3Badge')}</span>
              <div className="card-content">
                <div className="card-icon-wrapper">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h3>{getTranslation('v3Title')}</h3>
                <p>{getTranslation('v3Desc')}</p>
              </div>
              <span className="btn btn-secondary btn-block" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {getTranslation('testButton')} <i className="fa-solid fa-arrow-right icon-right"></i>
              </span>
            </Link>

            {/* Card V4: Open Chatbot Assistent */}
            <Link href="/configurator/v4" className="selector-card" style={{ border: '1px dashed var(--color-primary)' }} onClick={() => sendGAEvent({ event: 'configurator_start', value: 'v4' })}>
              <span className="card-badge badge-new" style={{ background: 'rgba(231, 177, 36, 0.25)' }}>{getTranslation('v4Badge')}</span>
              <div className="card-content">
                <div className="card-icon-wrapper" style={{ borderColor: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-comment-dots"></i>
                </div>
                <h3>{getTranslation('v4Title')}</h3>
                <p>{getTranslation('v4Desc')}</p>
              </div>
              <span className="btn btn-primary btn-block" style={{ width: '100%', textAlign: 'center', display: 'block', background: 'var(--color-primary-dark)', borderColor: 'var(--color-primary-dark)' }}>
                {getTranslation('testButton')} <i className="fa-solid fa-arrow-right icon-right"></i>
              </span>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <button onClick={handleLogout} className="btn-lock">
              <i className="fa-solid fa-lock"></i> {getTranslation('lockPortal')}
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
