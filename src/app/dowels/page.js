'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Dowels() {
  const { lang, addToCart, setIsCartOpen } = useInquiry();

  const dowelProducts = [
    {
      id: 'dowel-small',
      name: {
        nl: 'Kleine deuvelspelden (vanaf 3 mm)',
        en: 'Small Size (3 mm and up)',
        de: 'Kleine Holzstifte (ab 3 mm)',
        ro: 'Dibluri de Mici Dimensiuni (de la 3 mm)',
      },
      description: {
        nl: 'Onze kleinste gekalibreerde houten pennen zijn ontworpen voor delicaat timmerwerk, architectonische modellen en knutselprojecten. Ondanks hun kleine diameter bieden ze een hoge structurele dichtheid en stabiliteit.',
        en: 'Our smallest calibrated dowel pins are designed for delicate joinery, architectural models, and craft projects. Despite their small diameter, they offer high structural density and stability.',
        de: 'Unsere kleinsten kalibrierten Holzdübel sind für feine Tischlerarbeiten, Architekturmodelle und Bastelprojekte konzipiert. Trotz ihres geringen Durchmessers bieten sie eine hohe Gefügedichte und Stabilität.',
        ro: 'Cele mai mici dibluri calibrate ale noastre sunt proiectate pentru tâmplărie fină, machete arhitecturale și proiecte de artizanat. În ciuda diametrului lor mic, acestea oferă densitate structurală și stabilitate ridicate.',
      },
      image: '/images/dowelssmall-1.jpg',
      category: {
        nl: 'Deuvels',
        en: 'Dowels',
        de: 'Dübel',
        ro: 'Dibluri'
      },
    },
    {
      id: 'dowel-medium-sticks',
      name: {
        nl: 'Houten staven (klein tot medium)',
        en: 'Sticks Small to Medium',
        de: 'Dübelstäbe (klein bis mittel)',
        ro: 'Tije din Fag (mici spre medii)',
      },
      description: {
        nl: 'Ideale deuvelstaven voor standaard timmerwerktoepassingen, speelgoedproductie en algemene meubelmontage. Precies gekalibreerd om diametervariaties te elimineren.',
        en: 'Ideal dowel rods for standard carpentry applications, toys manufacturing, and general furniture assembly. Calibrated precisely to eliminate diameter variations.',
        de: 'Ideale Dübelstangen für Standard-Zimmereianwendungen, Spielzeugherstellung und allgemeine Möbelmontage. Präzise kalibriert, um Durchmesservariationen auszuschließen.',
        ro: 'Tije ideale din lemn pentru aplicații standard de tâmplărie, fabricarea jucăriilor și asamblarea generală a mobilierului. Calibrate cu precizie pentru a elimina variațiile de diametru.',
      },
      image: '/images/dowelsmedium.jpg',
      category: {
        nl: 'Deuvels',
        en: 'Dowels',
        de: 'Dübel',
        ro: 'Dibluri'
      },
    },
    {
      id: 'dowel-medium',
      name: {
        nl: 'Medium deuvelstaven',
        en: 'Medium Size Dowel Rods',
        de: 'Mittlere Dübelstangen',
        ro: 'Tije din Fag de Dimensiuni Medii',
      },
      description: {
        nl: 'Deuvelstaven ontworpen voor zware meubelverbindingen, plankdragers en raamwerkverbindingen. Gestoomd beukenhout biedt extra dimensionale weerstand tegen buigen.',
        en: 'Dowel rods engineered for heavy furniture joints, shelving supports, and framework connections. Steamed beech provides extra dimensional resistance against bending.',
        de: 'Dübelstangen für schwere Möbelverbindungen, Regalkonstruktionen und Rahmenverbindungen. Gedämpfte Buche bietet zusätzliche Formstabilität gegen Verbiegen.',
        ro: 'Tije de dibluri proiectate pentru îmbinări grele de mobilier, suporturi de rafturi și conexiuni de cadre. Fagul aburit oferă rezistență dimensională suplimentară împotriva îndoirii.',
      },
      image: '/images/dowels-medium-2.jpg',
      category: {
        nl: 'Deuvels',
        en: 'Dowels',
        de: 'Dübel',
        ro: 'Dibluri'
      },
    },
    {
      id: 'dowel-big',
      name: {
        nl: 'Grote deuvelstaven (tot 60 mm)',
        en: 'Big Size (up to 60 mm)',
        de: 'Große Dübelstangen (bis zu 60 mm)',
        ro: 'Tije din Fag de Mari Dimensiuni (până la 60 mm)',
      },
      description: {
        nl: 'Grootformaat deuvelstaven voor industriële handgrepen, structurele scheidingskolommen en zware timmerverbindingen. Verkrijgbaar in aangepaste lengtes en maten tot 60 mm.',
        en: 'Large-format dowel rods for industrial handles, structural partition columns, and heavy-duty carpentry connections. Available in custom lengths and sizes up to 60 mm.',
        de: 'Großformatige Dübelstangen für Industriegriffe, Raumteilerstützen und schwere Holzbauverbindungen. Erhältlich in kundenspezifischen Längen und Größen bis zu 60 mm.',
        ro: 'Tije de mari dimensiuni pentru mânere industriale, coloane structurale de compartimentare și conexiuni de tâmplărie de mare rezistență. Disponibile în lungimi personalizate și dimensiuni de până la 60 mm.',
      },
      image: '/images/dowelsbig-300x300-1.jpg',
      category: {
        nl: 'Deuvels',
        en: 'Dowels',
        de: 'Dübel',
        ro: 'Dibluri'
      },
    },
    {
      id: 'dowel-rilled',
      name: {
        nl: 'Spiraal gegroefde deuvels (6 tot 20 mm)',
        en: 'Spiral Rilled Pins (6 to 20 mm)',
        de: 'Spiralförmig geriffelte Dübel (6 bis 20 mm)',
        ro: 'Dibluri cu Caneluri Elicoidale (6 până la 20 mm)',
      },
      description: {
        nl: 'Speciaal gegroefd voor geautomatiseerde meubelproductielijnen. De spiraalvormige groeven zorgen voor een gelijkmatige lijmverdeling, laten samengeperste lucht ontsnappen en garanderen een stevige verbinding.',
        en: 'Specifically grooved for automated furniture production lines. The spiral rills allow for uniform glue distribution, venting compressed air, and ensuring a locked joint.',
        de: 'Speziell geriffelt für automatisierte Möbelproduktionslinien. Die Spiralrillen sorgen für eine gleichmäßige Leimteilung, leiten komprimierte Luft ab und garantieren eine feste Verbindung.',
        ro: 'Canelate special pentru liniile automate de producție de mobilier. Canelurile elicoidale permit distribuirea uniformă a lipiciului, eliminarea aerului comprimat și asigurarea unei îmbinări blocate.',
      },
      image: '/images/dowelsrilled-300x300-1.jpg',
      category: {
        nl: 'Deuvels',
        en: 'Dowels',
        de: 'Dübel',
        ro: 'Dibluri'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten Deuvels',
      en: 'Home / Products / Beechwood Dowels',
      de: 'Home / Produkte / Buchenholzdübel',
      ro: 'Home / Produsele / Dibluri din Lemn de Fag'
    },
    title: {
      nl: 'Beukenhouten Deuvels & Staven',
      en: 'Beechwood Dowels & Rods',
      de: 'Buchenholzdübel & -stäbe',
      ro: 'Dibluri și Tije din Lemn de Fag'
    },
    subtitle: {
      nl: 'PALROM Products produceert een uitgebreid assortiment nauwkeurig gekalibreerde beukenhouten deuvels, staven en pennen. Gestoomd of ongestoomd, onze deuvels worden rechtstreeks gemaakt van duurzaam hout om aan de hoogste houtbewerkingsspecificaties te voldoen.',
      en: 'PALROM Products manufactures an extensive range of precision-calibrated beechwood dowels, rods, and pins. Steamed or unsteamed, our dowels are crafted directly from sustainable timber to meet the highest woodworking specifications.',
      de: 'PALROM Products stellt ein umfangreiches Sortiment an präzise kalibrierten Buchenholzdübeln, Stangen und Stiften her. Ob gedämpft oder ungedämpft – unsere Dübel werden direkt aus nachhaltigem Holz gefertigt, um höchste Anforderungen an die Holzverarbeitung zu erfüllen.',
      ro: 'PALROM Products fabrică o gamă extinsă de dibluri, tije și știfturi din lemn de fag calibrate cu precizie. Aburit sau neaburit, diblurile noastre sunt realizate direct din lemn durabil pentru a îndeplini cele mai înalte specificații de prelucrare a lemnului.'
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

      {/* Dowels Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {dowelProducts.map((p) => (
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
