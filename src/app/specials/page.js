'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Specials() {
  const { lang, addToCart, setIsCartOpen } = useInquiry();

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
        nl: 'Speciale Componenten',
        en: 'Special Components',
        de: 'Spezialkomponenten',
        ro: 'Componente Speciale'
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
        nl: 'Duurzame, massief gestoomde beukenhouten keeplatten. Biedt extreme schuifweerstand en een lange levensduur voor zwaar industrieel raamwerk en op maat gemaakte meubelmontages.',
        en: 'Durable, solid steamed beechwood keeplats. Offers extreme shear resistance and longevity for heavy-duty industrial framing and custom furniture mounts.',
        de: 'Langlebige Keilleisten aus massivem, gedämpftem Buchenholz. Bietet extreme Scherfestigkeit und Langlebigkeit für schwere Industrierahmen und maßgeschneiderte Möbelhalterungen.',
        ro: 'Pane durabile din lemn de fag masiv aburit. Oferă rezistență extremă la forfecare și longevitate pentru cadre industriale grele și monturi de mobilier personalizate.',
      },
      image: '/images/special2.jpg',
      category: {
        nl: 'Speciale Componenten',
        en: 'Special Components',
        de: 'Spezialkomponenten',
        ro: 'Componente Speciale'
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
        nl: 'Speciale Componenten',
        en: 'Special Components',
        de: 'Spezialkomponenten',
        ro: 'Componente Speciale'
      },
    },
    {
      id: 'special-threshold',
      name: {
        nl: 'Houten drempel',
        en: 'Wooden Threshold',
        de: 'Holzschwelle',
        ro: 'Prag din Lemn',
      },
      description: {
        nl: 'Gekalibreerde deurdrempels machinaal bewerkt uit dicht beukenhout. Biedt structurele bescherming en esthetische overgangen tussen verschillende vloeren.',
        en: 'Calibrated door thresholds machined from dense beechwood. Provides structural protection and aesthetic transitions between flooring layouts.',
        de: 'Kalibrierte Türschwellen aus dichtem Buchenholz. Bietet strukturellen Schutz und ästhetische Übergänge zwischen verschiedenen Bodenbelägen.',
        ro: 'Praguri de uși calibrate prelucrate din lemn dens de fag. Oferă protecție structurală și tranziții estetice între finisajele de pardoseală.',
      },
      image: '/images/special4.jpg',
      category: {
        nl: 'Speciale Componenten',
        en: 'Special Components',
        de: 'Spezialkomponenten',
        ro: 'Componente Speciale'
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
        en: 'Solid wood spacer bars and blocks designed for timber drying kilns, logistics stackers, and specialized packaging structures.',
        de: 'Distanzleisten und -blöcke aus Massivholz für Holztrockenkammern, Logistikstapler und spezielle Verpackungsstrukturen.',
        ro: 'Bare și blocuri distanțiere din lemn masiv concepute pentru cuptoarele de uscare a lemnului, stivuitoarele logistice și structurile de ambalare specializate.',
      },
      image: '/images/special5.jpg',
      category: {
        nl: 'Speciale Componenten',
        en: 'Special Components',
        de: 'Spezialkomponenten',
        ro: 'Componente Speciale'
      },
    },
    {
      id: 'special-wood-iron',
      name: {
        nl: 'Hout met ijzeren component',
        en: 'Wood with Iron Component',
        de: 'Holz mit Eisenkomponente',
        ro: 'Lemn cu Componentă din Fier',
      },
      description: {
        nl: 'Composiet structurele blokken die gedroogd beukenhout combineren met geïntegreerde stalen connectoren. Gemaakt voor zware verpakkingen en machine-montagekisten.',
        en: 'Composite structural blocks combining seasoned beechwood with integrated steel connectors. Tailored for heavy packaging and machinery mounting crates.',
        de: 'Verbundstrukturblöcke, die gelagertes Buchenholz mit integrierten Stahlverbindern kombinieren. Maßgeschneidert für schwere Verpackungen und Maschinenmontagekisten.',
        ro: 'Blocuri structurale compozite care combină lemnul de fag uscat cu conectori din oțel integrați. Concepute pentru ambalaje grele și lăzi de montare a utilajelor.',
      },
      image: '/images/special6.jpg',
      category: {
        nl: 'Speciale Componenten',
        en: 'Special Components',
        de: 'Spezialkomponenten',
        ro: 'Componente Speciale'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Speciale Componenten',
      en: 'Home / Products / Special Components',
      de: 'Home / Produkte / Spezialkomponenten',
      ro: 'Home / Produsele / Componente Speciale'
    },
    title: {
      nl: 'Speciale meubel- & houtcomponenten',
      en: 'Special Furniture & Wood Elements',
      de: 'Spezialkomponenten für Möbel & Holz',
      ro: 'Elemente Speciale din Lemn și Mobilier'
    },
    subtitle: {
      nl: 'PALROM Products produceert gespecialiseerde halffabrikaten en afgewerkte houten onderdelen voor de meubel-, verpakkings- en bouwsector. Van op maat gemaakte keeplatten tot afstandhouders en houten drempels, wij ontwerpen houtoplossingen op maat voor uw ontwerp.',
      en: 'PALROM Products manufactures specialized semi-finished and finished wood parts for the furniture, packaging, and construction industries. From customized keeplats to distancers and wooden thresholds, we engineer bespoke wood solutions to your design.',
      de: 'PALROM Products stellt spezialisierte halbfertige und fertige Holzteile für die Möbel-, Verpackungs- und Bauindustrie her. Von maßgeschneiderten Keilleisten bis hin zu Abstandhaltern und Holzschwellen entwickeln wir maßgeschneiderte Holzlösungen für Ihr Design.',
      ro: 'PALROM Products fabrică piese de lemn specializate semifinite și finite pentru industriile de mobilier, ambalaje și construcții. De la pane personalizate până la distanțiere și praguri de lemn, proiectăm soluții din lemn la comandă pentru designul dvs.'
    },
    fscNotice: {
      nl: 'FSC® Gecertificeerd op aanvraag beschikbaar',
      en: 'FSC® Certified Available On Request',
      de: 'FSC®-zertifiziert auf Anfrage erhältlich',
      ro: 'Certificat FSC® disponibil la cerere'
    },
    addToInquiry: {
      nl: 'Toevoegen aan offerteaanvraag',
      en: 'Add to Inquiry',
      de: 'Zur Anfrage hinzufügen',
      ro: 'Adaugă la Solicitare'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  const handleAdd = (product) => {
    const resolvedName = product.name[lang] || product.name.nl;
    const resolvedCategory = product.category[lang] || product.category.nl;
    addToCart({
      id: product.id,
      name: resolvedName,
      category: resolvedCategory,
      qty: 1,
      grade: 'grade_a',
      dims: '',
    });
    setIsCartOpen(true);
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
                  <img src={p.image} alt={p.name[lang] || p.name.nl} />
                </div>
                <div className="detail-info">
                  <h3>{p.name[lang] || p.name.nl}</h3>
                  <p>{p.description[lang] || p.description.nl}</p>
                  <button
                    className="detail-cta add-to-inquiry-btn"
                    onClick={() => handleAdd(p)}
                  >
                    {getTranslation('addToInquiry')} <i className="fa-solid fa-plus icon-right"></i>
                  </button>
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
