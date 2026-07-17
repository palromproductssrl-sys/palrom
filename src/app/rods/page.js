'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Dowels() {
  const { lang } = useInquiry();

  const dowelProducts = [
    {
      id: 'dowel-smooth',
      name: {
        nl: 'Stokken glad',
        en: 'Smooth sticks',
        de: 'Glatte Holzstäbe',
        ro: 'Tije netede (glad)',
      },
      description: {
        nl: 'Rond geschaafde, volledig gladde beukenhouten staven en deuvelstaven. Beschikbaar in diameters van 3 mm tot 60 mm. Ideaal voor meubelverbindingen, laddersporten, vlaggenstokken, handgrepen en diverse decoratieve of industriële toepassingen. Uiterst nauwkeurig gekalibreerd en gedroogd tot 8-12% vochtgehalte.',
        en: 'Round-planed, completely smooth beech wood rods and dowel sticks. Available in diameters from 3 mm to 60 mm. Ideal for furniture joints, ladder rungs, flagpoles, handles, and decorative or industrial applications. Milled to extreme tolerances and chamber-dried to 8-12% moisture.',
        de: 'Rund gehobelte, völlig glatte Buchenholzstäbe und Dübelstangen. Erhältlich in Durchmessern von 3 mm bis 60 mm. Ideal für Möbelverbindungen, Leitersprossen, Fahnenmasten, Griffe und dekorative oder industrielle Anwendungen. Extrem präzise kalibriert und getrocknet auf 8-12% Feuchtigkeit.',
        ro: 'Tije și dibluri din lemn de fag rinduite rotund, complet netede. Disponibile în diametre de la 3 mm până la 60 mm. Ideale pentru îmbinări de mobilier, trepte de scară, catarge de steag, mânere și diverse aplicații decorative sau industriale. Calibrate extrem de precis și uscate la 8-12% umiditate.',
      },
      image: '/images/dowelsmedium.jpg',
      category: {
        nl: 'Beukenhouten stokken',
        en: 'Beechwood sticks',
        de: 'Buchenholzstäbe',
        ro: 'Tije și bare cilindrice din fag'
      },
    },
    {
      id: 'dowel-rilled',
      name: {
        nl: 'Stokken gerild',
        en: 'Rilled sticks',
        de: 'Geriffelte Holzstäbe',
        ro: 'Tije profilate (gerild)',
      },
      description: {
        nl: 'Spiraalvormig gegroefde deuvelpennen en deuvelstaven, specifiek ontworpen voor geautomatiseerde meubelmontage en industriële verbindingen. Beschikbaar in diameters van 6 mm tot 20 mm. De canelures zorgen voor een gelijkmatige lijmverdeling, laten ingesloten lucht en lijm ontsnappen en garanderen een extreem sterke verbinding.',
        en: 'Spiral-grooved dowel pins and rods, specifically designed for automated furniture assembly and industrial joint networks. Available in diameters from 6 mm to 20 mm. The spiral rills ensure even glue distribution, venting compressed air and excess adhesive for an exceptionally strong lock.',
        de: 'Spiralförmig geriffelte Dübelstifte und Dübelstangen, speziell konzipiert für die automatische Möbelmontage und industrielle Holzverbindungen. Erhältlich in Durchmessern von 6 mm bis 20 mm. Die Spiralrillen sorgen für eine gleichmäßige Leimteilung, leiten Luft und überschüssigen Leim ab und garantieren eine extrem feste Verbindung.',
        ro: 'Dibluri și tije cu caneluri elicoidale, concepute special pentru asamblarea automată a mobilierului și îmbinări industriale. Disponibile în diametre de la 6 mm până la 20 mm. Canelurile asigură o distribuție uniformă a adezivului, permit evacuarea aerului și adezivului în exces și garantează o îmbinare extrem de puternică.',
      },
      image: '/images/dowelsrilled-300x300-1.jpg',
      category: {
        nl: 'Beukenhouten stokken',
        en: 'Beechwood sticks',
        de: 'Buchenholzstäbe',
        ro: 'Tije și bare cilindrice din fag'
      },
    }
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten stokken',
      en: 'Home / Products / Beechwood sticks',
      de: 'Home / Produkte / Buchenholzstäbe',
      ro: 'Home / Produse / Tije și bare cilindrice din fag'
    },
    title: {
      nl: 'Beukenhouten stokken',
      en: 'Beechwood sticks',
      de: 'Buchenholzstäbe',
      ro: 'Tije și bare cilindrice din fag'
    },
    subtitle: {
      nl: 'PALROM Products produceert een uitgebreid assortiment nauwkeurig gekalibreerde beukenhouten deuvels, staven en pennen. Onze stokken worden rechtstreeks gemaakt van duurzaam hout om aan de hoogste houtbewerkingsspecificaties te voldoen.',
      en: 'PALROM Products manufactures an extensive range of precision-calibrated beechwood dowels, rods, and pins. Our sticks are crafted directly from sustainable timber to meet the highest woodworking specifications.',
      de: 'PALROM Products stellt ein umfangreiches Sortiment an präzise kalibrierten Buchenholzdübeln, Stangen und Stiften her. Unsere Stäbe werden direkt aus nachhaltigem Holz gefertigt, um höchste Anforderungen an die Holzverarbeitung zu erfüllen.',
      ro: 'PALROM Products fabrică o gamă extinsă de dibluri, tije și știfturi din lemn de fag calibrate cu precizie. Tijele și barele noastre sunt realizate direct din lemn durabil pentru a îndeplini cele mai înalte specificații de prelucrare a lemnului.'
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

      {/* Dowels Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-2 detail-grid">
            {dowelProducts.map((p) => (
              <div className="detail-card animate-on-scroll" key={p.id}>
                <div className="detail-img-wrapper">
                  <Image 
                    src={p.image} 
                    alt={p.name[lang] || p.name.nl} 
                    width={400}
                    height={300}
                  />
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
