'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Blanks() {
  const { lang } = useInquiry();

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten blanks',
      en: 'Home / Products / Beechwood blanks',
      de: 'Home / Produkte / Buchenholz-Blanks',
      ro: 'Home / Produse / Frize din lemn de fag'
    },
    title: {
      nl: 'Beukenhouten blanks',
      en: 'Beechwood blanks',
      de: 'Buchenholz-Blanks',
      ro: 'Frize din lemn de fag'
    },
    subtitle: {
      nl: 'PALROM Products produceert hoogwaardige fijnbezaagde beukenhouten blanks rechtstreeks uit onze eigen moderne zagerij in Brad. Gekalibreerd en gedroogd tot 8-12% vochtgehalte voor direct gebruik in de meubel- en houtbewerkingsindustrie.',
      en: 'PALROM Products manufactures premium fine-sawn beechwood blanks directly from our state-of-the-art sawmill in Brad. Calibrated and kiln-dried to 8-12% moisture content, ready for the furniture and woodworking industries.',
      de: 'PALROM Products stellt erstklassige feingesägte Buchenholz-Blanks direkt in unserem hochmodernen Sägewerk in Brad her. Kalibriert und kammergetrocknet auf 8-12% Holzfeuchte, bereit für die Möbel- und Holzbearbeitungsindustrie.',
      ro: 'PALROM Products fabrică frize din lemn de fag de calitate superioară direct de la gaterul nostru modern din Brad. Calibrate și uscate în camere de uscare la un conținut de umiditate de 8-12%, gata pentru industria mobilei și a prelucrării lemnului.'
    },
    fscNotice: {
      nl: 'FSC® Gecertificeerd op aanvraag beschikbaar',
      en: 'FSC® Certified Available On Request',
      de: 'FSC®-zertifiziert auf Anfrage erhältlich',
      ro: 'Certificat FSC® disponibil la cerere'
    },
    requestQuoteBtn: {
      nl: 'Offerte aanvragen',
      en: 'Request Quote',
      de: 'Angebot anfordern',
      ro: 'Solicită Ofertă'
    },
    badgeText: {
      nl: 'Beukenhouten blanks',
      en: 'Beechwood blanks',
      de: 'Buchenholz-Blanks',
      ro: 'Frize din lemn de fag'
    },
    blanksProductTitle: {
      nl: 'Fijnbezaagde blanks / bestekken',
      en: 'Fine-sawn beechwood blanks',
      de: 'Feingesägte Buchenholz-Blanks',
      ro: 'Frize din fag tăiate fin'
    },
    descText1: {
      nl: 'Kwalitatief fijnbezaagde blanks en gezaagde planken van geselecteerd Roemeens beukenhout. Uitermate geschikt voor verdere machinale verwerking en hoogwaardige componenten in de meubelindustrie.',
      en: 'High-quality fine-sawn blanks and timber cut from selected Romanian beechwood. Perfectly suited for further mechanical processing and premium components in the furniture industry.',
      de: 'Hochwertige feingesägte Kanteln und Schnittholz aus ausgewähltem rumänischem Buchenholz. Bestens geeignet für die weitere maschinelle Verarbeitung und Komponenten in der Möbelindustrie.',
      ro: 'Frize de înaltă calitate tăiate fin și cherestea debitată din lemn de fag românesc selecționat. Perfect potrivite pentru prelucrări mecanice ulterioare și componente în industria mobilei.'
    },
    descText2: {
      nl: 'Onze fijnbezaagde blanks worden direct in onze eigen zagerij geproduceerd en gekalibreerd. Ze zijn kammergedroogd tot 8-12% vochtgehalte om een maximale stabiliteit en minimale vervorming te garanderen tijdens verdere bewerking.',
      en: 'Our fine-sawn blanks are directly produced and calibrated in our own sawmill. They are kiln-dried to 8-12% moisture content to guarantee maximum stability and minimum deformation during subsequent processing.',
      de: 'Unsere feingesägten Kanteln werden direkt in unserem eigenen Sägewerk produziert und kalibriert. Sie sind kammergetrocknet auf 8-12% Holzfeuchte, um maximale Stabilität und minimale Verformung bei der Weiterverarbeitung zu gewährleisten.',
      ro: 'Frizele noastre tăiate fin sunt produse și calibrate direct în gaterul nostru propriu. Acestea sunt uscate în camere de uscare la un conținut de umiditate de 8-12% pentru a garanta stabilitate maximă și deformare minimă în timpul prelucrărilor ulterioare.'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <Link href="/products">{lang === 'nl' ? 'Producten' : (lang === 'de' ? 'Produkte' : (lang === 'ro' ? 'Produsele' : 'Products'))}</Link> / <span>{getTranslation('breadcrumb').split(' / ').pop()}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('title')}</h1>
          <p>{getTranslation('subtitle')}</p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> {getTranslation('fscNotice')}
          </span>
        </div>
      </section>

      {/* Blanks Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-2 align-items-center" style={{ gap: '3.5rem', marginTop: '2rem' }}>
            <div className="animate-on-scroll">
              <Image 
                src="/images/fine_sawn_blanks.png" 
                alt={getTranslation('blanksProductTitle')} 
                className="img-responsive rounded-lg shadow-lg"
                width={600}
                height={450}
                style={{ width: '100%', objectFit: 'cover', height: '380px', borderRadius: '12px', display: 'block' }}
                priority
              />
            </div>
            <div className="animate-on-scroll">
              <span className="section-badge">{getTranslation('badgeText')}</span>
              <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '1.25rem', color: 'var(--color-forest-dark)' }}>
                {getTranslation('blanksProductTitle')}
              </h2>
              <p style={{ color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: '1.7', fontSize: '1.02rem' }}>
                {getTranslation('descText1')}
              </p>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
                {getTranslation('descText2')}
              </p>
              <Link
                href="#contact"
                className="detail-cta add-to-inquiry-btn"
                style={{ maxWidth: '280px', display: 'inline-flex' }}
              >
                {getTranslation('requestQuoteBtn')} <i className="fa-solid fa-chevron-right icon-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
