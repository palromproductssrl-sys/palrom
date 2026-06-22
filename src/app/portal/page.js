'use client';

import React, { useState, useEffect } from 'react';
import { useInquiry } from '@/components/InquiryContext';
import { useRouter } from 'next/navigation';

const t = {
  portalTitle: {
    nl: 'B2B Partner Portal',
    en: 'B2B Partner Portal',
    de: 'B2B-Partnerportal',
    ro: 'Portal Parteneri B2B'
  },
  portalSubtitle: {
    nl: 'Beheer uw offerteaanvragen en configureer bestellingen snel opnieuw',
    en: 'Manage your quote inquiries and quickly reconfigure orders',
    de: 'Verwalten Sie Ihre Angebotsanfragen und konfigurieren Sie Bestellungen schnell neu',
    ro: 'Gestionați cererile de ofertă și reconfigurați rapid comenzile'
  },
  emailLabel: {
    nl: 'Zakelijk E-mailadres *',
    en: 'Business Email Address *',
    de: 'Geschäftliche E-Mail-Adresse *',
    ro: 'Adresă de E-mail de Afaceri *'
  },
  emailPlaceholder: {
    nl: 'bijv. inkoper@bedrijf.nl',
    en: 'e.g. buyer@company.com',
    de: 'z.B. einkauf@firma.de',
    ro: 'de ex. achizitii@companie.ro'
  },
  sendCodeBtn: {
    nl: 'Ontvang Inlogcode',
    en: 'Request Login Code',
    de: 'Anmeldecode anfordern',
    ro: 'Solicită Cod de Conectare'
  },
  sendingText: {
    nl: 'Code verzenden...',
    en: 'Sending code...',
    de: 'Code wird gesendet...',
    ro: 'Se trimite codul...'
  },
  codeLabel: {
    nl: '6-cijferige Inlogcode *',
    en: '6-digit Verification Code *',
    de: '6-stelliger Verifizierungscode *',
    ro: 'Cod de Verificare din 6 cifre *'
  },
  codePlaceholder: {
    nl: 'Voer de 6 cijfers in',
    en: 'Enter 6 digits',
    de: 'Geben Sie 6 Ziffern ein',
    ro: 'Introduceți cele 6 cifre'
  },
  verifyBtn: {
    nl: 'Inloggen en Verifiëren',
    en: 'Verify & Log In',
    de: 'Verifizieren & Anmelden',
    ro: 'Verifică și Conectează-te'
  },
  verifyingText: {
    nl: 'Verifiëren...',
    en: 'Verifying...',
    de: 'Wird verifiziert...',
    ro: 'Se verifică...'
  },
  backToEmail: {
    nl: 'Terug naar e-mailinvoer',
    en: 'Back to email entry',
    de: 'Zurück zur E-Mail-Eingabe',
    ro: 'Înapoi la introducerea e-mailului'
  },
  otpSentSuccess: {
    nl: 'Een inlogcode is naar uw e-mailadres verzonden! (Gebruik "123456" voor snelle testdoeleinden)',
    en: 'A login code has been sent to your email! (Use "123456" for quick testing)',
    de: 'Ein Anmeldecode wurde an Ihre E-Mail gesendet! (Nutzen Sie "123456" für schnelle Tests)',
    ro: 'Un cod de conectare a fost trimis la e-mailul dvs.! (Folosiți "123456" pentru testare rapidă)'
  },
  logoutBtn: {
    nl: 'Uitloggen',
    en: 'Log Out',
    de: 'Abmelden',
    ro: 'Deconectare'
  },
  noInquiries: {
    nl: 'U heeft nog geen eerdere B2B-offerteaanvragen verzonden vanaf dit e-mailadres.',
    en: 'You have not submitted any B2B quote inquiries from this email address yet.',
    de: 'Sie haben von dieser E-Mail-Adresse noch keine B2B-Angebotsanfragen gesendet.',
    ro: 'Nu ați trimis încă nicio cerere de ofertă B2B de la această adresă de e-mail.'
  },
  tableDate: {
    nl: 'Datum',
    en: 'Date',
    de: 'Datum',
    ro: 'Data'
  },
  tableProducts: {
    nl: 'Producten',
    en: 'Products',
    de: 'Produkte',
    ro: 'Produse'
  },
  tableStatus: {
    nl: 'Status',
    en: 'Status',
    de: 'Status',
    ro: 'Status'
  },
  tableActions: {
    nl: 'Acties',
    en: 'Actions',
    de: 'Aktionen',
    ro: 'Acțiuni'
  },
  downloadPdfBtn: {
    nl: 'PDF Offerte',
    en: 'PDF Quote',
    de: 'PDF-Angebot',
    ro: 'Ofertă PDF'
  },
  reorderBtn: {
    nl: 'Configureer Opnieuw',
    en: 'Reconfigure',
    de: 'Erneut konfigurieren',
    ro: 'Reconfigurează'
  },
  reorderSuccess: {
    nl: 'Producten succesvol in uw winkelwagen geladen! U wordt nu doorgestuurd naar de configurator...',
    en: 'Products successfully loaded into your cart! Redirecting you to the configurator...',
    de: 'Produkte erfolgreich in den Warenkorb geladen! Sie werden nun zum Konfigurator weitergeleitet...',
    ro: 'Produse încărcate cu succes în coș! Veți fi redirecționat către configurator...'
  },
  dashboardHeader: {
    nl: 'Uw B2B Aanvraaghistorie',
    en: 'Your B2B Inquiry History',
    de: 'Ihre B2B-Anfragehistorie',
    ro: 'Istoricul Cererilor Dvs. B2B'
  },
  loadingHistory: {
    nl: 'Geschiedenis laden...',
    en: 'Loading history...',
    de: 'Verlauf wird geladen...',
    ro: 'Se încarcă istoricul...'
  },
  clientEmailLabel: {
    nl: 'Ingelogd als:',
    en: 'Logged in as:',
    de: 'Angemeldet als:',
    ro: 'Conectat ca:'
  }
};

export default function PortalPage() {
  const { lang, addToCart, clearCart, setIsCartOpen } = useInquiry();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'verify', 'dashboard'
  const [token, setToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState('');

  // Load session from local storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('palrom_portal_token');
    const savedEmail = localStorage.getItem('palrom_portal_email');
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setUserEmail(savedEmail);
      setStep('dashboard');
      fetchInquiries(savedToken);
    }
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError(lang === 'nl' ? 'Vul een geldig e-mailadres in.' : 'Please enter a valid email.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang })
      });

      const data = await res.json();
      if (res.ok) {
        setStep('verify');
        setSuccessMsg(t.otpSentSuccess[lang] || t.otpSentSuccess.en);
      } else {
        setError(data.error || 'Failed to send verification code.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setError(lang === 'nl' ? 'Vul de 6-cijferige code in.' : 'Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/portal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('palrom_portal_token', data.token);
        localStorage.setItem('palrom_portal_email', data.email);
        setToken(data.token);
        setUserEmail(data.email);
        setStep('dashboard');
        fetchInquiries(data.token);
      } else {
        setError(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async (sessionToken) => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/inquiries', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
      } else {
        console.error('Failed to fetch inquiries:', data.error);
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('palrom_portal_token');
    localStorage.removeItem('palrom_portal_email');
    setToken('');
    setUserEmail('');
    setEmail('');
    setCode('');
    setStep('email');
    setInquiries([]);
    setError('');
    setSuccessMsg('');
  };

  const handleReorder = (items) => {
    if (!items || items.length === 0) return;
    
    // Clear current cart items
    clearCart();
    
    // Load past products back into cart with new random IDs
    items.forEach(item => {
      addToCart({
        ...item,
        id: crypto.randomUUID(),
        isConfigured: true
      });
    });

    setReorderSuccessMsg(t.reorderSuccess[lang] || t.reorderSuccess.en);
    setIsCartOpen(true);

    setTimeout(() => {
      setReorderSuccessMsg('');
      router.push('/configurator');
    }, 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <main className="portal-main-section" style={{ minHeight: '80vh', padding: '120px 20px 80px', background: '#fdfbf7', fontFamily: 'Inter, sans-serif' }}>
      <div className="container" style={{ maxWidth: step === 'dashboard' ? '1000px' : '500px', margin: '0 auto' }}>
        
        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-forest-dark)', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            {t.portalTitle[lang] || t.portalTitle.en}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            {t.portalSubtitle[lang] || t.portalSubtitle.en}
          </p>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '0.5rem' }}></i> {error}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            <i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }}></i> {successMsg}
          </div>
        )}

        {reorderSuccessMsg && (
          <div style={{ position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 10000, padding: '1.25rem 2rem', backgroundColor: 'var(--color-primary-dark)', color: '#ffffff', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeInDown 0.3s ease' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ color: '#ffffff' }}></i> {reorderSuccessMsg}
          </div>
        )}

        {/* Step 1: Email Request form */}
        {step === 'email' && (
          <div className="portal-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
            <form onSubmit={handleSendCode}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-forest-dark)', marginBottom: '0.5rem' }}>
                  {t.emailLabel[lang] || t.emailLabel.en}
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder[lang] || t.emailPlaceholder.en}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.9rem' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> {t.sendingText[lang] || t.sendingText.en}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> {t.sendCodeBtn[lang] || t.sendCodeBtn.en}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Verification screen */}
        {step === 'verify' && (
          <div className="portal-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
            <form onSubmit={handleVerify}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-forest-dark)', marginBottom: '0.5rem' }}>
                  {t.codeLabel[lang] || t.codeLabel.en}
                </label>
                <input 
                  type="text" 
                  maxLength="6"
                  className="form-input" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t.codePlaceholder[lang] || t.codePlaceholder.en}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '8px', fontWeight: 800 }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1rem' }}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> {t.verifyingText[lang] || t.verifyingText.en}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-unlock-keyhole"></i> {t.verifyBtn[lang] || t.verifyBtn.en}
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('email')}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--color-primary-dark)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.3rem' }}></i> {t.backToEmail[lang] || t.backToEmail.en}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Inquiries History Dashboard */}
        {step === 'dashboard' && (
          <div className="portal-dashboard-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
            
            {/* Account meta bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {t.clientEmailLabel[lang] || t.clientEmailLabel.en}
                </span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                  {userEmail}
                </h4>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.82rem', border: '1px solid var(--color-border)', color: 'var(--color-text-dark)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> {t.logoutBtn[lang] || t.logoutBtn.en}
              </button>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
              {t.dashboardHeader[lang] || t.dashboardHeader.en}
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}></i>
                <p style={{ fontSize: '0.9rem' }}>{t.loadingHistory[lang] || t.loadingHistory.en}</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)' }}>
                <i className="fa-solid fa-folder-open fa-3x" style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--color-forest-dark)' }}></i>
                <p style={{ fontSize: '0.92rem', maxWidth: '350px', margin: '0 auto', lineHeight: 1.5 }}>
                  {t.noInquiries[lang] || t.noInquiries.en}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #edf2f7', color: 'var(--color-forest-dark)', fontWeight: 700 }}>
                      <th style={{ padding: '12px 10px' }}>{t.tableDate[lang] || t.tableDate.en}</th>
                      <th style={{ padding: '12px 10px' }}>{t.tableProducts[lang] || t.tableProducts.en}</th>
                      <th style={{ padding: '12px 10px' }}>{t.tableStatus[lang] || t.tableStatus.en}</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>{t.tableActions[lang] || t.tableActions.en}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="portal-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 10px', verticalAlign: 'top', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                          {formatDate(inquiry.created_at)}
                        </td>
                        <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {(inquiry.items || []).map((item, idx) => (
                              <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                <strong style={{ color: 'var(--color-forest-dark)' }}>{item.name}</strong>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block' }}>
                                  {item.dims || `${item.thickness || ''}x${item.diameter || item.width || ''}x${item.length || ''}`}{item.radius ? ` (Radius: ${item.radius})` : ''} • Grade {item.grade || 'A'} • AD/KD • {item.qty} pcs
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ padding: '14px 10px', verticalAlign: 'top' }}>
                          <span style={{ 
                            display: 'inline-block', 
                            padding: '0.2rem 0.6rem', 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            borderRadius: '50px', 
                            backgroundColor: inquiry.status === 'New' ? '#fef3c7' : '#dbeafe', 
                            color: inquiry.status === 'New' ? '#d97706' : '#2563eb' 
                          }}>
                            {inquiry.status || 'New'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {/* PDF Download link */}
                            <a 
                              href={`/api/portal/download-pdf?id=${inquiry.id}&token=${token}`}
                              className="btn btn-outline"
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.78rem', 
                                border: '1px solid #e7b124', 
                                color: 'var(--color-primary-dark)', 
                                borderRadius: '4px', 
                                textDecoration: 'none',
                                fontWeight: 700, 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.3rem' 
                              }}
                            >
                              <i className="fa-solid fa-file-pdf"></i> {t.downloadPdfBtn[lang] || t.downloadPdfBtn.en}
                            </a>
                            
                            {/* Re-order button */}
                            <button 
                              onClick={() => handleReorder(inquiry.items)}
                              className="btn btn-primary"
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.78rem', 
                                borderRadius: '4px', 
                                fontWeight: 700, 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.3rem',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <i className="fa-solid fa-arrows-rotate"></i> {t.reorderBtn[lang] || t.reorderBtn.en}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
