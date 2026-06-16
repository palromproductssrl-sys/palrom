'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function BricheteFag() {
  const { lang, setLang } = useInquiry();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);

  // Force language to Romanian
  useEffect(() => {
    if (setLang) {
      setLang('ro');
    }
  }, [setLang]);

  // Client-side Geo-blocking check (Romania only)
  useEffect(() => {
    async function verifyGeolocation() {
      const hostname = window.location.hostname;
      // Skip check for local development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
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
        <p>Se verifică disponibilitatea regională...</p>
      </div>
    );
  }

  if (!isAccessAllowed) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      {/* Product Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Acasă</Link> / <Link href="/products">Produse</Link> / <span>Brichete din lemn de fag</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Brichete din Lemn de Fag</h1>
          <p>
            Brichete de foc premium produse 100% din rumeguș de fag compactat, fără aditivi chimici, 
            direct din surplusul tehnologic al fabricii noastre de cherestea din Brad, Hunedoara.
          </p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> Certificat FSC® Recycled • Disponibil Exclusiv în România
          </span>
        </div>
      </section>

      {/* Product Information Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="grid grid-2 align-items-center" style={{ gap: '3.5rem' }}>
            <div className="animate-on-scroll">
              <img 
                src="/images/brichete_fag.png" 
                alt="Brichete premium din lemn de fag" 
                className="img-responsive rounded-lg shadow-lg"
                style={{ width: '100%', objectFit: 'cover', maxHeight: '480px' }}
              />
            </div>
            <div className="animate-on-scroll">
              <span className="section-badge">Calitate Premium locală</span>
              <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '1.25rem' }}>
                Energie Curată și Eficientă din Lemn de Fag
              </h2>
              <p style={{ color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: '1.7' }}>
                Brichetele noastre din fag reprezintă o soluție ecologică și extrem de eficientă pentru încălzirea 
                locuințelor sau spațiilor industriale. Obținute prin presarea la temperaturi ridicate a rumegușului curat 
                de fag rezultat din liniile de producție a profilelor și diblurilor, acestea nu conțin lianți chimici 
                sau adezivi, fiind 100% naturale.
              </p>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
                Datorită densității mari și a umidității extrem de scăzute, brichetele de fag oferă o ardere constantă, 
                degajă o cantitate mare de căldură și lasă o cantitate minimă de cenușă, protejând coșurile de fum și 
                sistemul de încălzire.
              </p>

              <div className="grid grid-3" style={{ gap: '1rem', marginTop: '2rem' }}>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <i className="fa-solid fa-fire text-accent" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-forest-dark)', margin: '0 0 5px 0' }}>Putere Calorică</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>~18.5 MJ/kg</p>
                </div>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <i className="fa-solid fa-droplet-slash text-accent" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-forest-dark)', margin: '0 0 5px 0' }}>Umiditate</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>&lt; 10%</p>
                </div>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <i className="fa-solid fa-recycle text-accent" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-forest-dark)', margin: '0 0 5px 0' }}>Cenușă</h4>
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
            <span className="section-badge">Fișă Tehnică</span>
            <h2 className="section-title">Specificații și Detalii de Livrare</h2>
            <p className="section-subtitle">
              Oferim livrare B2B direct de la fabrica noastră din Brad, Hunedoara, în condiții logistice optime.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '3rem auto 0 auto', background: '#f9f9f9', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <table className="specs-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Tip Lemn</td>
                  <td style={{ padding: '1rem', color: '#444' }}>100% Bej / Fag Curat (fără coajă sau aditivi)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Formă & Diametru</td>
                  <td style={{ padding: '1rem', color: '#444' }}>Cilindrice, Ø 90 mm</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Densitate brichetă</td>
                  <td style={{ padding: '1rem', color: '#444' }}>~1.2 g/cm³</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Mod de ambalare</td>
                  <td style={{ padding: '1rem', color: '#444' }}>Pachete în folie PE de 10 kg (5-6 role per pachet)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Configurație Palet</td>
                  <td style={{ padding: '1rem', color: '#444' }}>96 de pachete pe palet înfoliat (960 kg greutate netă)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Comandă minimă</td>
                  <td style={{ padding: '1rem', color: '#444' }}>1 Palet (pentru ridicare directă) sau camioane complete (pentru distribuție)</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>Certificare Ecologică</td>
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
