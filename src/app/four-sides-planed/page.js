'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function FourSidesPlaned() {
  const { lang, addToCart, setIsCartOpen } = useInquiry();

  const planedProducts = [
    {
      id: 'planed-rect-v1',
      name: {
        nl: 'Geschaafd rechthoekig beukenhout (Variant 1)',
        en: 'Planed Rectangular (Variant 1)',
        de: 'Gehobelt Rechteckig (Variante 1)',
        ro: 'Fag Rinduit Rectangular (Varianta 1)',
      },
      description: {
        nl: 'Hoge-tolerantie rechthoekige beuken latten, gedroogd tot 8-12% vochtgehalte. Ideaal voor de productie van bedbodems, meubelframes en hoogwaardige interieurafwerking.',
        en: 'High-tolerance rectangular beech slats and slats, dried to 8-12% moisture. Ideal for manufacturing bed frames, furniture framing, and premium interior trim boards.',
        de: 'Hochtolerante rechteckige Buchenleisten, getrocknet auf 8-12% Feuchtigkeit. Ideal für die Herstellung von Bettgestellen, Möbelrahmen und hochwertigen Innenverkleidungsbrettern.',
        ro: 'Șipci din fag rectangulare cu toleranță ridicată, uscate la 8-12% umiditate. Ideale pentru fabricarea cadrelor de pat, cadrelor de mobilier și plintelor de interior premium.',
      },
      image: '/images/4sides1.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-rect-v2',
      name: {
        nl: 'Geschaafd rechthoekig beukenhout (Variant 2)',
        en: 'Planed Rectangular (Variant 2)',
        de: 'Gehobelt Rechteckig (Variante 2)',
        ro: 'Fag Rinduit Rectangular (Varianta 2)',
      },
      description: {
        nl: 'Gekalibreerde beukenhouten componenten met scherpe hoeken van 90 graden. Afgestemd op industriële meubelproductielijnen, kastrails en architecturale scheidingswanden.',
        en: 'Calibrated beechwood components with sharp 90-degree corners. Tailored for industrial furniture assembly lines, cabinet rails, and architectural partition components.',
        de: 'Kalibrierte Buchenholzkomponenten mit scharfen 90-Grad-Kanten. Maßgeschneidert für industrielle Möbelmontagelinien, Schrankschienen und architektonische Trennwandkomponenten.',
        ro: 'Componente calibrate din lemn de fag cu colțuri ascuțite la 90 de grade. Create special pentru liniile industriale de asamblare a mobilierului, șine de dulap și componente de compartimentare arhitecturală.',
      },
      image: '/images/4sides2.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-rect-v3',
      name: {
        nl: 'Geschaafd rechthoekig beukenhout (Variant 3)',
        en: 'Planed Rectangular (Variant 3)',
        de: 'Gehobelt Rechteckig (Variante 3)',
        ro: 'Fag Rinduit Rectangular (Varianta 3)',
      },
      description: {
        nl: 'Duurzame, massief beuken geschaafde planken voorbereid voor planken, meubelpanelen en zware timmerwerkzaamheden. Volledig gladde afwerking zonder uitgescheurde vezels.',
        en: 'Durable, solid beech planed planks prepared for shelving, furniture panels, and heavy-duty carpentry tasks. Completely smooth finish with no fiber tear-out.',
        de: 'Langlebige, gehobelte Bretter aus massivem Buchenholz, vorbereitet für Regale, Möbelplatten und schwere Holzarbeiten. Völlig glatte Oberfläche ohne Faserausrisse.',
        ro: 'Scânduri rinduite din fag masiv, durabile, pregătite pentru rafturi, panouri de mobilier și sarcini grele de tâmplărie. Finisaj complet neted, fără rupere a fibrelor.',
      },
      image: '/images/4sides3.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-rect-v4',
      name: {
        nl: 'Geschaafd rechthoekig beukenhout (Variant 4)',
        en: 'Planed Rectangular (Variant 4)',
        de: 'Gehobelt Rechteckig (Variante 4)',
        ro: 'Fag Rinduit Rectangular (Varianta 4)',
      },
      description: {
        nl: 'Nauwkeurig op dikte gemaakte rechthoekige secties ontworpen voor hoogwaardige doe-het-zelf-verpakkingen. Verpakt in op maat gemaakte bundels met individuele etiketteringsopties.',
        en: 'Precisely thicknessed rectangular sections designed for high-end DIY retail packaging. Packaged in customized bundles with individual labeling options.',
        de: 'Präzise dickengehobelte rechteckige Abschnitte, konzipiert für hochwertige DIY-Verpackungen. Verpackt in kundenspezifischen Bündeln mit individuellen Etikettierungsoptionen.',
        ro: 'Secțiuni rectangulare calibrate cu precizie la grosime, proiectate pentru ambalaje de retail DIY premium. Ambalate în pachete personalizate cu opțiuni individuale de etichetare.',
      },
      image: '/images/4sides4.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-sq-v1',
      name: {
        nl: 'Geschaafd vierkant beukenhout (Variant 1)',
        en: 'Planed Square (Variant 1)',
        de: 'Gehobelt Quadratisch (Variante 1)',
        ro: 'Fag Rinduit Pătrat (Varianta 1)',
      },
      description: {
        nl: 'Nauwkeurig gefreesde vierkante beukenhouten staven. Ontworpen als halffabrikaat voor houtdraaiwerk, trapsijlen, tafelpoten en kinderspeelgoed.',
        en: 'Precision-milled square beech wood bars and rods. Designed as blanks for woodturning, stair balusters, table leg manufacturing, and children\'s toys.',
        de: 'Präzise gefräste quadratische Buchenholzstäbe. Entworfen als Rohlinge für Holzdreharbeiten, Treppengeländerstäbe, Tischbeinherstellung und Kinderspielzeug.',
        ro: 'Bare și tije pătrate din lemn de fag frezate cu precizie. Proiectate ca semifabricate pentru strunjirea lemnului, baluștri de scară, fabricarea picioarelor de masă și jucării pentru copii.',
      },
      image: '/images/4sides5.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-sq-v2',
      name: {
        nl: 'Geschaafd vierkant beukenhout (Variant 2)',
        en: 'Planed Square (Variant 2)',
        de: 'Gehobelt Quadratisch (Variante 2)',
        ro: 'Fag Rinduit Pătrat (Varianta 2)',
      },
      description: {
        nl: 'Compacte, hoogwaardige Karpatische beuken vierkante elementen. Foutloos, noestvrij hout, ontwikkeld om zware constructieve belastingen te weerstaan.',
        en: 'Dense, high-quality Carpathian beech square elements. Free of defects, knot-free quality options, engineered to withstand structural woodworking stresses.',
        de: 'Dichte, hochwertige quadratische Elemente aus Karpatenbuche. Defektfreie, astfreie Qualitätsoptionen, entwickelt, um statischen Belastungen im Holzbau standzuhalten.',
        ro: 'Elemente pătrate dense, de înaltă calitate, din fag carpatin. Fără defecte, opțiuni de calitate fără noduri, proiectate pentru a rezista la solicitările structurale ale prelucrării lemnului.',
      },
      image: '/images/4sides6.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-rad3',
      name: {
        nl: 'Geschaafde elementen met Radius 3',
        en: 'Planed Elements with Radius 3',
        de: 'Gehobelte Elemente mit Radius 3',
        ro: 'Elemente Rinduite cu Rază 3',
      },
      description: {
        nl: 'Vierzijdig geschaafde elementen met een subtiele afgeronde rand van 3 mm. De zachte randen verminderen het risico op houtsplijten en verbeteren de handlingveiligheid voor consumenten.',
        en: 'Four-sides planed elements featuring a subtle 3 mm rounded edge radius. The soft edges decrease wood splitting risks and improve user handling safety in retail environments.',
        de: 'Vierzifig gehobelte Elemente mit einem subtilen abgerundeten Kantenradius von 3 mm. Die weichen Kanten verringern das Risiko von Holzsplittern und verbessern die Handhabungssicherheit im Einzelhandel.',
        ro: 'Elemente rinduite pe patru fețe având o rază subtilă de margine rotunjită de 3 mm. Marginile moi reduc riscurile de despicare a lemnului și îmbunătățesc siguranța manipulării de către utilizatori în medii de retail.',
      },
      image: '/images/4sides7.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
    {
      id: 'planed-rad6',
      name: {
        nl: 'Geschaafde elementen met Radius 6',
        en: 'Planed Elements with Radius 6',
        de: 'Gehobelte Elemente mit Radius 6',
        ro: 'Elemente Rinduite cu Rază 6',
      },
      description: {
        nl: 'Geschaafde beuken componenten met een duidelijke afgeronde rand van 6 mm. Ideaal voor constructief speelgoed, kindvriendelijke meubelcomponenten en voorgefabriceerde timmerwerkonderdelen.',
        en: 'Planed beech components displaying a distinct 6 mm rounded edge radius. Ideal for structural toys, child-friendly furniture components, and pre-finished carpentry parts.',
        de: 'Gehobelte Buchenholzkomponenten mit einem ausgeprägten abgerundeten Kantenradius von 6 mm. Ideal für Konstruktionsspielzeug, kinderfreundliche Möbelkomponenten und vorgefertigte Schreinereiteile.',
        ro: 'Componente din fag rinduit care prezintă o rază distinctă a marginii rotunjites de 6 mm. Ideale pentru jucării structurale, componente de mobilier prietenoase cu copiii și piese de tâmplărie pre-finisate.',
      },
      image: '/images/4sides8.jpg',
      category: {
        nl: '4-Zijdig Geschaafd Hout',
        en: '4-Sides Planed Lumber',
        de: '4-seitig gehobeltes Holz',
        ro: 'Lemn Rinduit pe 4 Laturi'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / 4-Zijdig Geschaafd Hout',
      en: 'Home / Products / 4-Sides Planed Lumber',
      de: 'Home / Produkte / 4-seitig gehobeltes Holz',
      ro: 'Home / Produsele / Lemn Rinduit pe 4 Laturi'
    },
    title: {
      nl: '4-Zijdig Geschaafd Beukenhout',
      en: '4-Sides Planed Beech Lumber',
      de: '4-seitig gehobeltes Buchenholz',
      ro: 'Lemn de Fag Rinduit pe 4 Laturi'
    },
    subtitle: {
      nl: 'Onze vierzijdig geschaafde houtelementen worden met extreem nauwe toleranties geproduceerd. Afkomstig uit duurzaam bosbeheer in de Karpaten, worden ze gezaagd, in de oven gedroogd tot 8-12%, op lengte gezaagd en gekalibreerd voor meubelfabrikanten en doe-het-zelf-distributeurs.',
      en: 'Our four-sides planed wood elements are processed to extreme tolerances. Sourced from sustainable forest management in the Carpathian region, they are sawn, kiln-dried to 8-12%, cut to length, and calibrated for furniture manufacturers and DIY distributors.',
      de: 'Unsere vierseitig gehobelten Holzelemente werden mit extrem engen Toleranzen verarbeitet. Sie stammen aus nachhaltiger Forstwirtschaft in der Karpatenregion, werden gesägt, auf 8-12% kammergetrocknet, auf Länge geschnitten und für Möbelhersteller und DIY-Händler kalibriert.',
      ro: 'Elementele noastre din lemn rinduit pe patru fețe sunt procesate la toleranțe extreme. Provenite din managementul forestier durabil din regiunea Carpaților, acestea sunt debitate, uscate în cuptor la 8-12%, tăiate la lungime și calibrate pentru producătorii de mobilă și distribuitorii DIY.'
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

      {/* Planed Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {planedProducts.map((p) => (
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
