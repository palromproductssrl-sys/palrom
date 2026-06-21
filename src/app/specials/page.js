'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Specials() {
  const { lang } = useInquiry();

  const specialProducts = [
    {
      id: 'special-keeplat-spruce',
      name: {
        nl: 'Vuren keeplat (spie)',
        en: 'Keeplat Spruce',
        de: 'Keilleiste Fichte',
        ro: 'Pană din Lemn de Molid',
      },
      description: {
        nl: 'Speciaal gegroefde vurenhouten montagelatten en componenten gebruikt in de bouw en hoogwaardige houten verpakkingsroosters. Zeer stabiel en licht van gewicht.',
        en: 'Specially grooved spruce mounting slats and components used in construction framing and high-end timber packaging grids. Highly stable and lightweight.',
        de: 'Speziell genutete Fichten-Montageleisten und Komponenten für den Bau und hochwertige Holzverpackungsgitter. Sehr stabil und leicht.',
        ro: 'Șipci de montare din molid canelate special și componente utilizate în structurile de construcții și rețelele de ambalare din lemn premium. Foarte stabile și ușoare.',
      },
      image: '/images/special1.jpg',
      category: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood specials',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag'
      },
    },
    {
      id: 'special-keeplat-beech',
      name: {
        nl: 'Beuken keeplat (spie)',
        en: 'Keeplat Beech',
        de: 'Keilleiste Buche',
        ro: 'Pană din Lemn de Fag',
      },
      description: {
        nl: 'Duurzame, massief beukenhouten keeplatten. Biedt extreme schuifweerstand en een lange levensduur voor zwaar industrieel raamwerk en op maat gemaakte meubelmontages.',
        en: 'Durable, solid beechwood keeplats. Offers extreme shear resistance and longevity for heavy-duty industrial framing and custom furniture mounts.',
        de: 'Langlebige Keilleisten aus massivem Buchenholz. Bietet extreme Scherfestigkeit und Langlebigkeit für schwere Industrierahmen und maßgeschneiderte Möbelhalterungen.',
        ro: 'Pane durabile din lemn de fag masiv. Oferă rezistență extremă la forfecare și longevitate pentru cadre industriale grele și monturi de mobilier personalizate.',
      },
      image: '/images/special2.jpg',
      category: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood specials',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag'
      },
    },
    {
      id: 'special-distancer-mix',
      name: {
        nl: 'Afstandhouders kleurenmix',
        en: 'Distancers Color Mix',
        de: 'Abstandhalter Farbmix',
        ro: 'Distanțiere Mix de Culori',
      },
      description: {
        nl: 'Kleurgecodeerde houten scheidings- en afstandblokken ontworpen voor verpakkingslijnen, transportkisten en georganiseerd voorraadbeheer.',
        en: 'Color-coded wooden separator and distance blocks designed for packaging lines, shipping crates, and organized stock management.',
        de: 'Farbcodierte Trenn- und Abstandsblöcke aus Holz für Verpackungslinien, Transportkisten und organisiertes Lagerbestandsmanagement.',
        ro: 'Blocuri separatoare și distanțiere din lemn codificate pe culori, concepute pentru liniile de ambalare, lăzile de transport și managementul organizat al stocurilor.',
      },
      image: '/images/special3.jpg',
      category: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood specials',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag'
      },
    },
    {
      id: 'special-threshold',
      name: {
        nl: 'Componenten voedingsindustrie',
        en: 'Food industry components',
        de: 'Lebensmittelindustrie-Komponenten',
        ro: 'Componente pentru industria alimentară',
      },
      description: {
        nl: 'Houten onderdelen speciaal geproduceerd en gecertificeerd voor direct contact met voedsel en verpakkingen.',
        en: 'Wooden components specially manufactured and certified for direct food contact and packaging.',
        de: 'Holzkomponenten, speziell hergestellt und zertifiziert für den direkten kontakt mit Lebensmitteln und Verpackungen.',
        ro: 'Componente din lemn special fabricate și certificate pentru contactul direct cu alimentele și ambalajele.',
      },
      image: '/images/special4.jpg',
      category: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood specials',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag'
      },
    },
    {
      id: 'special-distancer-ind',
      name: {
        nl: 'Industriële afstandhouder',
        en: 'Industrial Distancer',
        de: 'Industrieller Abstandhalter',
        ro: 'Distanțier Industrial',
      },
      description: {
        nl: 'Massief houten afstandslatten en -blokken ontworpen voor houtdroogkamers, logistieke stapelaars en gespecialiseerde verpakkingsstructuren.',
        en: 'Solid wood spacer bars and blocks designed for timber drying chambers, logistics stackers, and specialized packaging structures.',
        de: 'Distanzleisten und -blöcke aus Massivholz für Holztrockenkammern, Logistikstapler und spezielle Verpackungsstrukturen.',
        ro: 'Bare și blocuri distanțiere din lemn masiv concepute pentru camerele de uscare a lemnului, stivuitoarele logistice și structurile de ambalare specializate.',
      },
      image: '/images/special5.jpg',
      category: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood specials',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag'
      },
    },
    {
      id: 'special-wood-iron',
      name: {
        nl: 'Gezaagde bestekken (fijnbezaagd)',
        en: 'Rough-sawn specials (fine-sawn)',
        de: 'Sägerauhe Zuschnitte',
        ro: 'Piese brute netăiate',
      },
      description: {
        nl: 'Ruwe, op maat gezaagde beukenhouten bestekken voor verdere industriële verwerking in meubelfabrieken.',
        en: 'Rough, custom-cut beechwood specials for further industrial processing in furniture factories.',
        de: 'Sägerauhe Buchenholz-Zuschnitte für die weitere industrielle Verarbeitung in Möbelfabriken.',
        ro: 'Piese brute din lemn de fag tăiate la comandă, pentru procesare industrială ulterioară în fabrici de mobilă.',
      },
      image: '/images/special6.jpg',
      category: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood specials',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten bestekken',
      en: 'Home / Products / Beechwood specials',
      de: 'Home / Produkte / Buchenholz-Zuschnitte',
      ro: 'Home / Produsele / Piese brute din lemn de fag'
    },
    title: {
      nl: 'Beukenhouten bestekken',
      en: 'Beechwood specials',
      de: 'Buchenholz-Zuschnitte',
      ro: 'Piese brute din lemn de fag'
    },
    subtitle: {
      nl: 'PALROM Products produceert gespecialiseerde halffabrikaten en beukenhouten bestekken voor de meubel-, verpakkings- en voedingsindustrie. Van op maat gemaakte keeplatten tot afstandhouders en componenten voor de voedingsindustrie.',
      en: 'PALROM Products manufactures specialized semi-finished products and beechwood specials for the furniture, packaging, and food industries. From customized keeplats to distancers and food industry components.',
      de: 'PALROM Products stellt spezialisierte Halbfabrikate und Buchenholz-Zuschnitte für die Möbel-, Verpackungs- und Lebensmittelindustrie her. Von maßgeschneiderten Keilleisten bis hin zu Abstandhaltern und Lebensmittelkomponenten.',
      ro: 'PALROM Products produce semifabricate specializate și piese brute din lemn de fag pentru industria de mobilier, ambalaje și alimentară. De la pane personalizate la distanțiere și componente pentru industria alimentară.'
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

      {/* Specials Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {specialProducts.map((p) => (
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
