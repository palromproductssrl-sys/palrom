'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Products() {
  const { lang } = useInquiry();
  const [activeFilter, setActiveFilter] = useState('all');

  const productsList = [
    {
      id: 'planed',
      category: 'planed',
      name: {
        nl: 'Beukenhouten latten',
        en: 'Beechwood slats',
        de: 'Buchenholzleisten',
        ro: 'Șipci din lemn de fag',
      },
      description: {
        nl: 'Geschaafd op extreem nauwe toleranties, verkrijgbaar in zowel rechthoekige als vierkante secties. Gezaagd, gedroogd, op maat gezaagd en gekalibreerd voor doe-het-zelf-distributie en timmerwerkplaatsen.',
        en: 'Planed to extreme tolerances, available in both rectangular and square sections. Sawn, dried, cut to size, and calibrated for DIY distribution and carpentry shops.',
        de: 'Auf extreme Toleranzen gehobelt, sowohl in rechteckigen als auch in quadratischen Abschnitten erhältlich. Gesägt, getrocknet, zugeschnitten und kalibriert für den DIY-Vertrieb und Schreinereien.',
        ro: 'Rinduit la toleranțe extreme, disponibil atât în secțiuni rectangulare, cât și pătrate. Debitata, uscată, tăiată la dimensiune și calibrată pentru distribuția DIY și atelierele de tâmplărie.',
      },
      image: '/images/planed_wood.png',
      link: '/four-sides-planed',
      specs: [
        {
          label: { nl: 'Secties', en: 'Sections', de: 'Schnitte', ro: 'Secțiuni' },
          value: { nl: 'Vierkant & Rechthoekig', en: 'Square & Rectangular', de: 'Quadratisch & Rechteckig', ro: 'Pătrate & Rectangulare' }
        },
        {
          label: { nl: 'Randen', en: 'Edges', de: 'Kanten', ro: 'Margini' },
          value: { nl: 'Scherp of met afgeronde kanten', en: 'Sharp or with rounded edges', de: 'Scharf oder mit abgerundeten Kanten', ro: 'Ascuțit sau cu margini rotunjite' }
        },
        {
          label: { nl: 'Vochtgehalte', en: 'Moisture', de: 'Feuchtigkeit', ro: 'Umiditate' },
          value: { nl: 'Kammergedroogd tot 8-12%', en: 'Chamber-dried to 8-12%', de: 'Kammergetrocknet auf 8-12%', ro: 'Uscat în camere de uscare la 8-12%' }
        },
      ],
      tag: {
        nl: 'Latten',
        en: 'Slats',
        de: 'Leisten',
        ro: 'Șipci'
      },
    },
    {
      id: 'dowels',
      category: 'dowels',
      name: {
        nl: 'Beukenhouten stokken',
        en: 'Beechwood sticks',
        de: 'Buchenholzstäbe',
        ro: 'Tije din lemn de fag',
      },
      description: {
        nl: 'Verkrijgbaar in kleine maten vanaf 3 mm tot grote afmetingen van 60 mm. Opties zijn onder andere gladde pennen en spiraalvormig gegroefde afwerkingen voor optimale lijmhechting.',
        en: 'Available in small sizes starting at 3 mm up to large dimensions of 60 mm. Options include smooth sticks and spiral-rilled finishes for optimal glue adhesion.',
        de: 'Erhältlich in kleinen Größen ab 3 mm bis hin zu großen Dimensionen von 60 mm. Zu den Optionen gehören glatte Stäbe und spiralförmig geriffelten Ausführungen für optimale Leimhaftung.',
        ro: 'Disponibile în dimensiuni mici începând de la 3 mm până la dimensiuni mari de 60 mm. Opțiunile includ tije netede și finisaje cu caneluri elicoidale pentru o aderență optimă a lipiciului.',
      },
      image: '/images/dowels.png',
      link: '/rods',
      specs: [
        {
          label: { nl: 'Diameter', en: 'Diameter', de: 'Durchmesser', ro: 'Diametru' },
          value: { nl: '3mm tot 60mm', en: '3mm to 60mm', de: '3mm bis 60mm', ro: '3mm până la 60mm' }
        },
        {
          label: { nl: 'Afwerkingen', en: 'Finishes', de: 'Ausführungen', ro: 'Finisaje' },
          value: { nl: 'Glad / Gegroefd (6mm tot 20mm)', en: 'Smooth / Rilled (6mm to 20mm)', de: 'Glatt / Geriffelt (6mm bis 20mm)', ro: 'Netede / Canelate (6mm până la 20mm)' }
        },
        {
          label: { nl: 'Houtsoort', en: 'Wood Type', de: 'Holzart', ro: 'Tip Lemn' },
          value: { nl: 'Ongestoomd beukenhout', en: 'Unsteamed beech', de: 'Ungedämpfte Buche', ro: 'Fag neaburit' }
        },
      ],
      tag: {
        nl: 'Stokken',
        en: 'Sticks',
        de: 'Stäbe',
        ro: 'Tije'
      },
    },
    {
      id: 'profiles',
      category: 'profiles',
      name: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile din lemn de fag',
      },
      description: {
        nl: 'Een uitgebreid assortiment decoratieve lijsten voor binnenbekleding, timmerwerkafwerking en meubelafwerking. Maatwerk profielen zijn beschikbaar voor grote series.',
        en: 'An extensive range of decorative mouldings for interior cladding, carpentry finishing, and furniture trims. Custom profile cutting is available for large runs.',
        de: 'Ein umfangreiches Sortiment an Zierleisten für Innenverkleidungen, Schreinerarbeiten und Möbelverzierungen. Kundenspezifischer Profilzuschnitt ist für Großserien möglich.',
        ro: 'O gamă extinsă de șipci decorative pentru placări interioare, finisaje de tâmplărie și ornamente de mobilier. Tăierea personalizată a profilelor este disponibilă pentru serii mari.',
      },
      image: '/images/profiles.png',
      link: '/profiles',
      specs: [
        {
          label: { nl: 'Vormen', en: 'Shapes', de: 'Formen', ro: 'Forme' },
          value: { nl: 'Halfgrond, Kwartrond, Plint', en: 'Semiround, Quarter round, Plinth', de: 'Halbrunnd, Viertelrund, Sockelleiste', ro: 'Semirotund, Sfert de cerc, Plintă' }
        },
        {
          label: { nl: 'Maatwerk', en: 'Customization', de: 'Anpassung', ro: 'Personalizare' },
          value: { nl: 'Hoekprofielen, Draad, Calbat', en: 'Corner profiles, Thread, Calbat', de: 'Eckprofile, Gewinde, Calbat', ro: 'Profile de colț, Filet, Calbat' }
        },
        {
          label: { nl: 'Retail', en: 'Retail', de: 'Einzelhandel', ro: 'Retail' },
          value: { nl: 'Voorzien van EAN-barcodes', en: 'Pre-labeled with EAN codes', de: 'Voretikettiert mit EAN-Codes', ro: 'Pre-etichetate cu coduri EAN' }
        },
      ],
      tag: {
        nl: 'Profielen',
        en: 'Profiles',
        de: 'Profile',
        ro: 'Profile'
      },
    },
    {
      id: 'specials',
      category: 'specials',
      name: {
        nl: 'Beukenhouten bestekken',
        en: 'Beechwood blanks',
        de: 'Buchenholz-Zuschnitte',
        ro: 'Piese brute din lemn de fag',
      },
      description: {
        nl: 'Op maat gemaakte halffabrikaten en afgewerkte beukenhouten componenten voor timmerwerk, kastenbouw, kinderspeelgoed, keukengerei en de voedingsmiddelenindustrie.',
        en: 'Custom semi-finished and finished beech wood components for carpentry, cabinet making, children\'s toys, kitchen utensils, and the food packaging industry.',
        de: 'Maßgeschneiderte Halbzeuge und Fertigteile aus Buchenholz für Zimmereien, Möbelbau, Kinderspielzeug, Küchenutensilien und die Lebensmittelverpackungsindustrie.',
        ro: 'Componente personalizate semifinite și finite din lemn de fag pentru tâmplărie, fabricarea dulapurilor, jucării pentru copii, ustensile de bucătărie și industria ambalajelor alimentare.',
      },
      image: '/images/specials.png',
      link: '/specials',
      specs: [
        {
          label: { nl: 'Toepassingen', en: 'Applications', de: 'Anwendungen', ro: 'Aplicații' },
          value: { nl: 'Timmerwerk / Voeding / Doe-het-zelf', en: 'Carpentry / Food / DIY', de: 'Zimmerei / Lebensmittel / DIY', ro: 'Tâmplărie / Alimentație / DIY' }
        },
        {
          label: { nl: 'FSC® Gecertificeerd', en: 'FSC® Certified', de: 'FSC®-zertifiziert', ro: 'Certificat FSC®' },
          value: { nl: 'Op aanvraag beschikbaar', en: 'Available on request', de: 'Auf Anfrage erhältlich', ro: 'Disponibil la cerere' }
        },
        {
          label: { nl: 'Verpakking', en: 'Packaging', de: 'Verpackung', ro: 'Ambalare' },
          value: { nl: 'Op maat gemaakte bulk of individueel', en: 'Customized bulk or individual', de: 'Kundenspezifische Großpackung oder Einzelverpackung', ro: 'Vrac personalizat sau individual' }
        },
      ],
      tag: {
        nl: 'Bestekken',
        en: 'Blanks',
        de: 'Zuschnitte',
        ro: 'Piese brute'
      },
    },
  ];

  if (lang === 'ro') {
    productsList.push({
      id: 'brichete',
      category: 'specials',
      name: {
        nl: 'Brichete din lemn de fag',
        en: 'Brichete din lemn de fag',
        de: 'Brichete din lemn de fag',
        ro: 'Brichete din lemn de fag',
      },
      description: {
        nl: 'Brichete de foc premium produse din rumeguș compactat de fag, ecologice, 100% naturale și cu putere calorică mare. Destinate exclusiv pieței din România.',
        en: 'Brichete de foc premium produse din rumeguș compactat de fag, ecologice, 100% naturale și cu putere calorică mare. Destinate exclusiv pieței din România.',
        de: 'Brichete de foc premium produse din rumeguș compactat de fag, ecologice, 100% naturale și cu putere calorică mare. Destinate exclusiv pieței din România.',
        ro: 'Brichete de foc premium produse din rumeguș compactat de fag, ecologice, 100% naturale și cu putere calorică mare. Destinate exclusiv pieței din România.',
      },
      image: '/images/brichete_fag.png',
      link: '/brichete-fag',
      specs: [
        {
          label: { nl: 'Putere Calorică', en: 'Putere Calorică', de: 'Putere Calorică', ro: 'Putere Calorică' },
          value: { nl: '~18.5 MJ/kg', en: '~18.5 MJ/kg', de: '~18.5 MJ/kg', ro: '~18.5 MJ/kg' }
        },
        {
          label: { nl: 'Umiditate', en: 'Umiditate', de: 'Umiditate', ro: 'Umiditate' },
          value: { nl: '< 10%', en: '< 10%', de: '< 10%', ro: '< 10%' }
        },
        {
          label: { nl: 'Ambalare', en: 'Ambalare', de: 'Ambalare', ro: 'Ambalare' },
          value: { nl: 'Saci de 10 kg (96 saci/palet)', en: 'Saci de 10 kg (96 saci/palet)', de: 'Saci de 10 kg (96 saci/palet)', ro: 'Saci de 10 kg (96 saci/palet)' }
        },
      ],
      tag: {
        nl: 'Exclusiv RO',
        en: 'Exclusiv RO',
        de: 'Exclusiv RO',
        ro: 'Exclusiv RO'
      },
    });
  }

  const t = {
    breadcrumb: {
      nl: 'Producten',
      en: 'Products',
      de: 'Produkte',
      ro: 'Produsele'
    },
    title: {
      nl: 'Precisie Houtcatalogus',
      en: 'Precision Wood Catalogue',
      de: 'Präzisions-Holzkatalog',
      ro: 'Catalog Lemn de Precizie'
    },
    subtitle: {
      nl: 'Al meer dan 25 jaar levert PALROM Products hoogwaardige Roemeense beukenhouten componenten aan timmerlieden, meubelfabrieken en doe-het-zelf-winkels wereldwijd. Ontdek onze catalogus hieronder om specifieke subcategorieën te bekijken.',
      en: 'For more than 25 years, PALROM Products has delivered first-grade Romanian beechwood components to carpenters, furniture factories, and DIY retailers worldwide. Explore our directory below to view specific subcategories.',
      de: 'Seit mehr als 25 Jahren liefert PALROM Products erstklassige rumänische Buchenholzkomponenten an Schreiner, Möbelfabriken und Baumärkte weltweit. Erkunden Sie unser Verzeichnis unten, um die einzelnen Unterkategorien anzuzeigen.',
      ro: 'De peste 25 de ani, PALROM Products livrează componente din lemn de fag românesc de primă clasă tâmplarilor, fabricilor de mobilă și retailerilor DIY din întreaga lume. Explorați directorul de mai jos pentru a vizualiza subcategoriile specifice.'
    },
    fscNotice: {
      nl: 'FSC® Gecertificeerd op aanvraag beschikbaar',
      en: 'FSC® Certified Available On Request',
      de: 'FSC®-zertifiziert auf Anfrage erhältlich',
      ro: 'Certificat FSC® disponibil la cerere'
    },
    filterAll: {
      nl: 'Alle Producten',
      en: 'All Products',
      de: 'Alle Produkte',
      ro: 'Toate Produsele'
    },
    filterDowels: {
      nl: 'Stokken',
      en: 'Sticks',
      de: 'Stäbe',
      ro: 'Tije'
    },
    filterPlaned: {
      nl: 'Latten',
      en: 'Slats',
      de: 'Leisten',
      ro: 'Șipci'
    },
    filterProfiles: {
      nl: 'Profielen',
      en: 'Profiles',
      de: 'Profile',
      ro: 'Profile'
    },
    filterSpecials: {
      nl: 'Bestekken',
      en: 'Blanks',
      de: 'Zuschnitte',
      ro: 'Piese brute'
    },
    exploreDetails: {
      nl: 'Details Bekijken',
      en: 'Explore Details',
      de: 'Details anzeigen',
      ro: 'Explorați Detalii'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  const filteredProducts =
    activeFilter === 'all'
      ? productsList
      : productsList.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <span>{getTranslation('breadcrumb')}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('title')}</h1>
          <p>{getTranslation('subtitle')}</p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> {getTranslation('fscNotice')}
          </span>
        </div>
      </section>

      {/* Products Catalogue Section */}
      <section className="section-padding bg-light products-grid-section">
        <div className="container">
          {/* Category Filter Tabs */}
          <div className="product-filters" style={{ marginBottom: '3rem' }}>
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {getTranslation('filterAll')}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'planed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('planed')}
            >
              {getTranslation('filterPlaned')}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'dowels' ? 'active' : ''}`}
              onClick={() => setActiveFilter('dowels')}
            >
              {getTranslation('filterDowels')}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveFilter('profiles')}
            >
              {getTranslation('filterProfiles')}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'specials' ? 'active' : ''}`}
              onClick={() => setActiveFilter('specials')}
            >
              {getTranslation('filterSpecials')}
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-3 product-grid">
            {filteredProducts.map((p) => (
              <div className="product-card" key={p.id} data-category={p.category}>
                <div className="product-img-wrapper">
                  <Link href={p.link} className="product-img-link">
                    <img src={p.image} alt={p.name[lang] || p.name.nl} />
                  </Link>
                  <span className="product-tag">{p.tag[lang] || p.tag.nl}</span>
                </div>
                <div className="product-info">
                  <h3>{p.name[lang] || p.name.nl}</h3>
                  <p>{p.description[lang] || p.description.nl}</p>
                  <ul className="product-specs">
                    {p.specs.map((spec, idx) => (
                      <li key={idx}>
                        <strong>{spec.label[lang] || spec.label.nl}:</strong> {spec.value[lang] || spec.value.nl}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.link} className="product-link">
                    {getTranslation('exploreDetails')} <i className="fa-solid fa-arrow-right"></i>
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
