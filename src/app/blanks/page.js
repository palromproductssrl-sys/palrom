'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Blanks() {
  const { lang } = useInquiry();

  const blankProducts = [
    {
      id: 'blank-rough-sawn',
      name: {
        nl: 'Fijnbezaagde blanks / bestekken',
        en: 'Fine-sawn beechwood blanks',
        de: 'Feingesägte Buchenholz-Blanks',
        ro: 'Piese brute din fag tăiate fin',
      },
      description: {
        nl: 'Kwalitatief fijnbezaagde blanks en gezaagde planken van geselecteerd Roemeens beukenhout. Uitermate geschikt voor verdere machinale verwerking en componenten in de meubelindustrie.',
        en: 'High-quality fine-sawn blanks and timber cut from selected Romanian beechwood. Perfectly suited for further mechanical processing and components in the furniture industry.',
        de: 'Hochwertige feingesägte Kanteln und Schnittholz aus ausgewähltem rumänischem Buchenholz. Bestens geeignet für die weitere maschinelle Verarbeitung und Komponenten in der Möbelindustrie.',
        ro: 'Piese brute de înaltă calitate tăiate fin și cherestea debitată din lemn de fag românesc selecționat. Perfect potrivite pentru prelucrări mecanice ulterioare și componente în industria mobilei.',
      },
      image: '/images/fine_sawn_blanks.png',
      category: {
        nl: 'Beukenhouten blanks',
        en: 'Beechwood blanks',
        de: 'Buchenholz-Blanks',
        ro: 'Piese brute din lemn de fag (blanks)'
      },
    },
    {
      id: 'blank-turning',
      name: {
        nl: 'Vierkante blanks voor draaiwerk',
        en: 'Square blanks for woodturning',
        de: 'Quadratische Drechselkanteln',
        ro: 'Piese brute pătrate pentru strunjire',
      },
      description: {
        nl: 'Dikkere, vierkant gezaagde beukenhouten blanks speciaal geproduceerd voor houtdraaiers. Ideaal voor trapleuningen, meubelpoten, sporten en diverse gereedschapshandvatten.',
        en: 'Thicker square-sawn beechwood blanks specifically manufactured for woodturners. Ideal for staircase balusters, furniture legs, rungs, and various tool handles.',
        de: 'Stärkere, quadratisch gesägte Buchenholz-Blanks, speziell für Drechsler hergestellt. Ideal für Geländerstäbe, Möbelbeine, Sprossen und verschiedene Werkzeuggriffe.',
        ro: 'Piese brute pătrate din lemn de fag mai groase, fabricate special pentru strunjire. Ideale pentru baluștri de scări, picioare de mobilier, trepte și diverse mânere de scule.',
      },
      image: '/images/special6.jpg',
      category: {
        nl: 'Beukenhouten blanks',
        en: 'Beechwood blanks',
        de: 'Buchenholz-Blanks',
        ro: 'Piese brute din lemn de fag (blanks)'
      },
    },
    {
      id: 'blank-fsc',
      name: {
        nl: 'FSC® Gecertificeerde blanks',
        en: 'FSC® Certified beechwood blanks',
        de: 'FSC®-zertifizierte Buchenholz-Kanteln',
        ro: 'Piese brute din fag certificate FSC®',
      },
      description: {
        nl: 'Blanks en gezaagd hout geproduceerd onder strenge ecologische en sociale normen. 100% afkomstig uit gecertificeerde, verantwoord en duurzaam beheerde bossen in de Karpaten.',
        en: 'Beechwood blanks produced under strict ecological and social standards. 100% sourced from certified, responsibly and sustainably managed Carpathian forests.',
        de: 'Buchenholz-Kanteln, hergestellt unter strengen ökologischen und sozialen Standards. Zu 100% aus zertifizierten, verantwortungsvoll und nachhaltig bewirtschafteten Karpatenwäldern bezogen.',
        ro: 'Piese brute din lemn de fag produse conform standardelor ecologice și sociale stricte. Provenite 100% din păduri din Carpați certificate și gestionate în mod responsabil și durabil.',
      },
      image: '/images/specials.png',
      category: {
        nl: 'Beukenhouten blanks',
        en: 'Beechwood blanks',
        de: 'Buchenholz-Blanks',
        ro: 'Piese brute din lemn de fag (blanks)'
      },
    },
    {
      id: 'blank-custom',
      name: {
        nl: 'Blanks op maat gesneden',
        en: 'Custom dimension blanks',
        de: 'Kanteln nach Maß',
        ro: 'Piese brute la dimensiuni personalizate',
      },
      description: {
        nl: 'Volledig klantspecifieke dikte-, breedte- en lengtespecificaties om afval en zaagverlies in uw fabriek te minimaliseren. Direct geproduceerd volgens uw technische tekeningen.',
        en: 'Fully customized thickness, width, and length specifications to minimize wood waste in your factory. Manufactured directly from your technical drawings.',
        de: 'Vollständig kundenspezifische Dicken-, Breiten- und Längenspezifikationen, um Holzabfälle in Ihrer Fabrik zu minimieren. Direkt nach Ihren technischen Zeichnungen gefertigt.',
        ro: 'Specificații de grosime, lățime și lungime complet personalizate pentru a minimiza deșeurile de lemn din fabrica dumneavoastră. Fabricate direct după desenele dumneavoastră tehnice.',
      },
      image: '/images/special5.jpg',
      category: {
        nl: 'Beukenhouten blanks',
        en: 'Beechwood blanks',
        de: 'Buchenholz-Blanks',
        ro: 'Piese brute din lemn de fag (blanks)'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten blanks',
      en: 'Home / Products / Beechwood blanks',
      de: 'Home / Produkte / Buchenholz-Blanks',
      ro: 'Home / Produse / Piese brute din lemn de fag'
    },
    title: {
      nl: 'Beukenhouten blanks',
      en: 'Beechwood blanks',
      de: 'Buchenholz-Blanks',
      ro: 'Piese brute din lemn de fag'
    },
    subtitle: {
      nl: 'PALROM Products produceert hoogwaardige fijnbezaagde beukenhouten blanks rechtstreeks uit onze eigen moderne zagerij in Brad. Gekalibreerd en gedroogd tot 8-12% vochtgehalte voor direct gebruik in de meubel- en houtbewerkingsindustrie.',
      en: 'PALROM Products manufactures premium fine-sawn beechwood blanks directly from our state-of-the-art sawmill in Brad. Calibrated and kiln-dried to 8-12% moisture content, ready for the furniture and woodworking industries.',
      de: 'PALROM Products stellt erstklassige feingesägte Buchenholz-Blanks direkt in unserem hochmodernen Sägewerk in Brad her. Kalibriert und kammergetrocknet auf 8-12% Holzfeuchte, bereit für die Möbel- und Holzbearbeitungsindustrie.',
      ro: 'PALROM Products fabrică piese brute din lemn de fag de calitate superioară direct de la gaterul nostru modern din Brad. Calibrate și uscate în camere de uscare la un conținut de umiditate de 8-12%, gata pentru industria mobilei și a prelucrării lemnului.'
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
          <div className="grid grid-3 detail-grid">
            {blankProducts.map((p) => (
              <div className="detail-card animate-on-scroll" key={p.id}>
                <div className="detail-img-wrapper">
                  <img src={p.image} alt={p.name[lang] || p.name.nl} />
                </div>
                <div className="detail-info">
                  <h3>{p.name[lang] || p.name.nl}</h3>
                  <p>{p.description[lang] || p.description.nl}</p>
                  <Link
                    href="#contact"
                    className="detail-cta add-to-inquiry-btn"
                  >
                    {getTranslation('requestQuoteBtn')} <i className="fa-solid fa-chevron-right icon-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
