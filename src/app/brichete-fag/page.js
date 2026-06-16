'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

const t = {
  loadingText: {
    ro: 'Se verifică disponibilitatea regională...',
    en: 'Verifying regional availability...'
  },
  home: { ro: 'Acasă', en: 'Home' },
  products: { ro: 'Produse', en: 'Products' },
  breadcrumb: { ro: 'Brichete din lemn de fag', en: 'Beechwood briquettes' },
  title: { ro: 'Brichete din Lemn de Fag', en: 'Beechwood Heating Briquettes' },
  subtitle: {
    ro: 'Brichete de foc premium produse 100% din rumeguș de fag compactat, fără aditivi chimici, direct din surplusul tehnologic al fabricii noastre de cherestea din Brad, Hunedoara.',
    en: 'Premium heating briquettes made 100% from compacted beech sawdust, chemical-free, sourced directly from the production surplus of our sawmill in Brad, Hunedoara.'
  },
  fscNotice: {
    ro: 'Certificat FSC® Recycled • Disponibil Exclusiv în România',
    en: 'FSC® Recycled Certified • Available Exclusively in Romania'
  },
  badge: {
    ro: 'Calitate Premium locală',
    en: 'Local Premium Quality'
  },
  benefitTitle: {
    ro: 'Energie Curată și Eficientă din Lemn de Fag',
    en: 'Clean and Efficient Energy from Beechwood'
  },
  desc1: {
    ro: 'Brichetele noastre din fag reprezintă o soluție ecologică și extrem de eficientă pentru încălzirea locuințelor sau spațiilor industriale. Obținute prin presarea la temperaturi ridicate a rumegușului curat de fag rezultat din liniile de producție a profilelor și diblurilor, acestea nu conțin lianți chimici sau adezivi, fiind 100% naturale.',
    en: 'Our beech briquettes represent an eco-friendly and highly efficient heating solution for homes or industrial spaces. Produced by pressing clean beech sawdust from our dowel and profile production lines at high temperatures, they contain no chemical binders or adhesives, being 100% natural.'
  },
  desc2: {
    ro: 'Datorită densității mari și a umidității extrem de scăzute, brichetele de fag oferă o ardere constantă, degajă o cantitate mare de căldură și lasă o cantitate minimă de cenușă, protejând coșurile de fum și sistemul de încălzire.',
    en: 'Due to their high density and extremely low moisture content, beech briquettes offer constant combustion, generate high heat output, and leave minimal ash, protecting your chimney and heating system.'
  },
  caloricLabel: { ro: 'Putere Calorică', en: 'Calorific Value' },
  moistureLabel: { ro: 'Umiditate', en: 'Moisture' },
  ashLabel: { ro: 'Cenușă', en: 'Ash Content' },
  specsBadge: { ro: 'Fișă Tehnică', en: 'Technical Specs' },
  specsTitle: { ro: 'Specificații și Detalii de Livrare', en: 'Specifications & Delivery Details' },
  specsSub: {
    ro: 'Oferim livrare B2B direct de la fabrica noastră din Brad, Hunedoara, în condiții logistice optime.',
    en: 'We offer B2B delivery directly from our factory in Brad, Hunedoara, under optimal logistical conditions.'
  },
  woodTypeLabel: { ro: 'Tip Lemn', en: 'Wood Type' },
  woodTypeValue: {
    ro: '100% Bej / Fag Curat (fără coajă sau aditivi)',
    en: '100% Clean Beechwood (no bark or chemical additives)'
  },
  shapeLabel: { ro: 'Formă & Diametru', en: 'Shape & Diameter' },
  shapeValue: { ro: 'Cilindrice, Ø 90 mm', en: 'Cylindrical, Ø 90 mm' },
  densityLabel: { ro: 'Densitate brichetă', en: 'Briquette Density' },
  densityValue: { ro: '~1.2 g/cm³', en: '~1.2 g/cm³' },
  packLabel: { ro: 'Mod de ambalare', en: 'Packaging Mode' },
  packValue: {
    ro: 'Pachete în folie PE de 10 kg (5-6 role per pachet)',
    en: 'PE wrapped packages of 10 kg (5-6 logs per pack)'
  },
  palletLabel: { ro: 'Configurație Palet', en: 'Pallet Configuration' },
  palletValue: {
    ro: '96 de pachete pe palet înfoliat (960 kg greutate netă)',
    en: '96 packs per wrapped pallet (960 kg net weight)'
  },
  minOrderLabel: { ro: 'Comandă minimă', en: 'Minimum Order' },
  minOrderValue: {
    ro: '1 Palet (pentru ridicare directă) sau camioane complete (pentru distribuție)',
    en: '1 Pallet (for direct pick-up) or full truckloads (for distribution)'
  },
  certLabel: { ro: 'Certificare Ecologică', en: 'Eco Certification' }
};

export default function BricheteFag() {
  const { lang, setLang } = useInquiry();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);
  const [activeImage, setActiveImage] = useState('/images/brichete_fag_ambient.png');

  const activeLang = lang === 'en' ? 'en' : 'ro';

  // Default to RO if language is not RO or EN
  useEffect(() => {
    if (setLang && lang !== 'ro' && lang !== 'en') {
      setLang('ro');
    }
  }, [lang, setLang]);

  // Client-side Geo-blocking check (Romania only)
  useEffect(() => {
    async function verifyGeolocation() {
      const hostname = window.location.hostname;
      // Skip check for local development (localhost, 127.0.0.1, IPv6 loopback, private IPs, and local domains)
      const isLocal = 
        hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname === '::1' || 
        hostname.startsWith('192.168.') || 
        hostname.startsWith('10.') || 
        hostname.startsWith('172.') || 
        hostname.endsWith('.local');

      if (isLocal) {
        setIsAccessAllowed(true);
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code === 'RO') {
          setIsAccessAllowed(true);
        } else {
          // Redirect non-Romanian users to home page
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Geo verification failed. Access blocked.', err);
        window.location.href = '/';
      } finally {
        setIsVerifying(false);
      }
    }

    verifyGeolocation();
  }, []);

  if (isVerifying) {
    return (
      <div className="geo-loading-screen">
        <div className="geo-spinner"></div>
        <p>{t.loadingText[activeLang]}</p>
      </div>
    );
  }

  if (!isAccessAllowed) {
    return (
      <div className="geo-loading-screen">
        <div className="geo-spinner"></div>
        <p>{activeLang === 'ro' ? 'Se redirecționează...' : 'Redirecting...'}</p>
      </div>
    );
  }

  return (
    <>
      {/* Product Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{t.home[activeLang]}</Link> / <Link href="/products">{t.products[activeLang]}</Link> / <span>{t.breadcrumb[activeLang]}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{t.title[activeLang]}</h1>
          <p>{t.subtitle[activeLang]}</p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> {t.fscNotice[activeLang]}
          </span>
        </div>
      </section>

      {/* Product Information Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="grid grid-2 align-items-center" style={{ gap: '3.5rem' }}>
            <div className="animate-on-scroll">
              <img 
                src={activeImage} 
                alt={t.title[activeLang]} 
                className="img-responsive rounded-lg shadow-lg"
                style={{ width: '100%', objectFit: 'cover', height: '400px', borderRadius: '12px', display: 'block' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                <button 
                  onClick={() => setActiveImage('/images/brichete_fag.png')}
                  style={{
                    border: activeImage === '/images/brichete_fag.png' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none',
                    transition: 'var(--transition-fast)',
                    width: '90px',
                    height: '70px'
                  }}
                  aria-label="Studio product photo"
                >
                  <img 
                    src="/images/brichete_fag.png" 
                    alt="Studio" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </button>
                <button 
                  onClick={() => setActiveImage('/images/brichete_fag_ambient.png')}
                  style={{
                    border: activeImage === '/images/brichete_fag_ambient.png' ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none',
                    transition: 'var(--transition-fast)',
                    width: '90px',
                    height: '70px'
                  }}
                  aria-label="Homely ambient photo"
                >
                  <img 
                    src="/images/brichete_fag_ambient.png" 
                    alt="Ambient" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </button>
              </div>
            </div>
            <div className="animate-on-scroll">
              <span className="section-badge">{t.badge[activeLang]}</span>
              <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '1.25rem' }}>
                {t.benefitTitle[activeLang]}
              </h2>
              <p style={{ color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: '1.7' }}>
                {t.desc1[activeLang]}
              </p>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
                {t.desc2[activeLang]}
              </p>

              <div className="grid grid-3" style={{ gap: '1rem', marginTop: '2rem' }}>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <i className="fa-solid fa-fire text-accent" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-forest-dark)', margin: '0 0 5px 0' }}>{t.caloricLabel[activeLang]}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>~18.5 MJ/kg</p>
                </div>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <i className="fa-solid fa-droplet-slash text-accent" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-forest-dark)', margin: '0 0 5px 0' }}>{t.moistureLabel[activeLang]}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>&lt; 10%</p>
                </div>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <i className="fa-solid fa-recycle text-accent" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-forest-dark)', margin: '0 0 5px 0' }}>{t.ashLabel[activeLang]}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>&lt; 0.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="section-badge">{t.specsBadge[activeLang]}</span>
            <h2 className="section-title">{t.specsTitle[activeLang]}</h2>
            <p className="section-subtitle">
              {t.specsSub[activeLang]}
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '3rem auto 0 auto', background: '#f9f9f9', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <table className="specs-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.woodTypeLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>{t.woodTypeValue[activeLang]}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.shapeLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>{t.shapeValue[activeLang]}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.densityLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>{t.densityValue[activeLang]}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.packLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>{t.packValue[activeLang]}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.palletLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>{t.palletValue[activeLang]}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.minOrderLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>{t.minOrderValue[activeLang]}</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{t.certLabel[activeLang]}</td>
                  <td style={{ padding: '1rem', color: '#444' }}>FSC® Recycled (Chain of Custody)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Inquiries / Contact form */}
      <ContactSection />
    </>
  );
}
