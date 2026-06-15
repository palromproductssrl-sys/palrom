'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { lang } = useInquiry();

  const products = [
    {
      id: 'planed',
      category: 'planed',
      name: lang === 'nl' ? 'Vierzijdig Geschaafd Hout' : (lang === 'de' ? 'Vierseitig gehobeltes Buchenholz' : (lang === 'ro' ? 'Cherestea de Fag Rinduită pe 4 Fețe' : 'Four-Sides Planed Timber')),
      description: lang === 'nl'
        ? 'Geschaafd tot op de millimeter nauwkeurig. Verkrijgbaar in diverse rechthoekige en vierkante secties, gekalibreerd voor timmerfabrieken en de meubelindustrie.'
        : (lang === 'de' ? 'Auf den Millimeter genau gehobelt. Erhältlich in verschiedenen rechteckigen und quadratischen Querschnitten, kalibriert für Tischlereien und die Möbelindustrie.' : (lang === 'ro' ? 'Rinduit la precizie de milimetru. Disponibil în diverse secțiuni rectangulare și pătrate, calibrat pentru fabricile de tâmplărie și industria mobilei.' : 'Planed to millimeter precision. Available in various rectangular and square sections, calibrated for joinery factories and the furniture industry.')),
      image: '/images/planed_wood.png',
      link: '/four-sides-planed',
      specs: [
        { label: lang === 'nl' ? 'Secties' : (lang === 'de' ? 'Querschnitte' : (lang === 'ro' ? 'Secțiuni' : 'Sections')), value: lang === 'nl' ? 'Vierkant & Rechthoekig' : (lang === 'de' ? 'Quadratisch & Rechteckig' : (lang === 'ro' ? 'Pătrat & Rectangular' : 'Square & Rectangular')) },
        { label: lang === 'nl' ? 'Randen' : (lang === 'de' ? 'Kanten' : (lang === 'ro' ? 'Margini' : 'Edges')), value: lang === 'nl' ? 'Scherp, Radius 3 of Radius 6' : (lang === 'de' ? 'Scharfkantig, Radius 3 oder Radius 6' : (lang === 'ro' ? 'Ascuțit, Rază 3 sau Rază 6' : 'Sharp, Radius 3 or Radius 6')) },
        { label: lang === 'nl' ? 'Vochtigheid' : (lang === 'de' ? 'Feuchtigkeit' : (lang === 'ro' ? 'Umiditate' : 'Moisture')), value: lang === 'nl' ? 'Kammergedroogd tot 8-12%' : (lang === 'de' ? 'Kammergetrocknet auf 8-12%' : (lang === 'ro' ? 'Uscat în camere de uscare la 8-12%' : 'Chamber-dried to 8-12%')) },
      ],
      tag: lang === 'nl' ? 'Geschaafd' : (lang === 'de' ? 'Gehobelt' : (lang === 'ro' ? 'Rinduit' : 'Planed')),
    },
    {
      id: 'dowels',
      category: 'dowels',
      name: lang === 'nl' ? 'Beukenhouten stokken' : (lang === 'de' ? 'Buchenholzstäbe' : (lang === 'ro' ? 'Tije din lemn de fag' : 'Beechwood sticks')),
      description: lang === 'nl' 
        ? 'Verkrijgbaar in diameters van 3 mm tot 60 mm. Kies tussen gladde houten pennen of spiraalvormig gegroefde deuvels voor een optimale lijmhechting.'
        : (lang === 'de' ? 'Erhältlich in Durchmessern von 3 mm bis 60 mm. Wählen Sie zwischen glatten Holzstiften oder spiralförmig geriffelten Dübeln für eine optimale Leimhaftung.' : (lang === 'ro' ? 'Disponibile în diametre de la 3 mm până la 60 mm. Alegeți între știfturi din lemn netede sau dibluri cu caneluri spirale pentru o aderență optimă a lipiciului.' : 'Available in diameters from 3 mm to 60 mm. Choose between smooth wooden pins or spiral grooved dowels for optimal glue adhesion.')),
      image: '/images/dowels.png',
      link: '/rods',
      specs: [
        { label: lang === 'nl' ? 'Diameter' : (lang === 'de' ? 'Durchmesser' : (lang === 'ro' ? 'Diametru' : 'Diameter')), value: lang === 'nl' ? '3mm tot 60mm' : (lang === 'de' ? '3mm bis 60mm' : (lang === 'ro' ? '3mm până la 60mm' : '3mm to 60mm')) },
        { label: lang === 'nl' ? 'Afwerking' : (lang === 'de' ? 'Ausführung' : (lang === 'ro' ? 'Finisaj' : 'Finish')), value: lang === 'nl' ? 'Glad / Gegroefd (6mm tot 20mm)' : (lang === 'de' ? 'Glatt / Geriffelt (6mm bis 20mm)' : (lang === 'ro' ? 'Neted / Canelat (6mm până la 20mm)' : 'Smooth / Grooved (6mm to 20mm)')) },
        { label: lang === 'nl' ? 'Houtsoort' : (lang === 'de' ? 'Holzart' : (lang === 'ro' ? 'Tip Lemn' : 'Wood Type')), value: lang === 'nl' ? 'Gestoomd of ongestoomd beuken' : (lang === 'de' ? 'Gedämpfte oder ungedämpfte Buche' : (lang === 'ro' ? 'Fag aburit sau neaburit' : 'Steamed or unsteamed beech')) },
      ],
      tag: lang === 'nl' ? 'Stokken' : (lang === 'de' ? 'Stäbe' : (lang === 'ro' ? 'Tije' : 'Sticks')),
    },
    {
      id: 'profiles',
      category: 'profiles',
      name: lang === 'nl' ? 'Houten Profielen & Lijsten' : (lang === 'de' ? 'Holzprofile & Leisten' : (lang === 'ro' ? 'Profile & Plinte din Lemn' : 'Wooden Profiles & Mouldings')),
      description: lang === 'nl'
        ? 'Groot assortiment decoratieve profielen, plinten en lijsten voor interieurafwerking en meubelproductie. Klantspecifieke profielen beschikbaar op aanvraag.'
        : (lang === 'de' ? 'Großes Sortiment an Zierleisten, Sockelleisten und Profilen für den Innenausbau und die Möbelproduktion. Sonderprofile auf Anfrage erhältlich.' : (lang === 'ro' ? 'Gamă largă de muluri decorative, plinte și profile pentru finisaje interioare și producția de mobilier. Profile personalizate disponibile la cerere.' : 'Large assortment of decorative mouldings, skirtings, and profiles for interior finishing and furniture production. Custom profiles available upon request.')),
      image: '/images/profiles.png',
      link: '/profiles',
      specs: [
        { label: lang === 'nl' ? 'Vormen' : (lang === 'de' ? 'Formen' : (lang === 'ro' ? 'Forme' : 'Shapes')), value: lang === 'nl' ? 'Halfrond, Kwartrond, Plinten' : (lang === 'de' ? 'Halbrund, Viertelrund, Sockelleisten' : (lang === 'ro' ? 'Semirotund, Sfert de cerc, Plinte' : 'Half-round, Quarter-round, Skirtings')) },
        { label: lang === 'nl' ? 'Maatwerk' : (lang === 'de' ? 'Anpassung' : (lang === 'ro' ? 'Personalizare' : 'Customization')), value: lang === 'nl' ? 'Hoekprofielen, draadsnijden, inkepingen' : (lang === 'de' ? 'Eckprofile, Gewinde, Kerben' : (lang === 'ro' ? 'Profile de colț, filet, crestături' : 'Corner profiles, threading, notches')) },
        { label: lang === 'nl' ? 'Retail' : (lang === 'de' ? 'Einzelhandel' : (lang === 'ro' ? 'Retail' : 'Retail')), value: lang === 'nl' ? 'EAN-barcode etikettering beschikbaar' : (lang === 'de' ? 'EAN-Barcode-Etikettierung verfügbar' : (lang === 'ro' ? 'Etichetare cu cod de bare EAN disponibilă' : 'EAN barcode labeling available')) },
      ],
      tag: lang === 'nl' ? 'Profielen' : (lang === 'de' ? 'Profile' : (lang === 'ro' ? 'Profile' : 'Profiles')),
    },
    {
      id: 'specials',
      category: 'specials',
      name: lang === 'nl' ? 'Speciale Componenten & Halffabrikaten' : (lang === 'de' ? 'Spezialkomponenten & Halbfabrikate' : (lang === 'ro' ? 'Componente Speciale & Produse Semifinite' : 'Special Components & Semi-Finished Products')),
      description: lang === 'nl'
        ? 'Halffabrikaten en op maat gemaakte houten onderdelen voor meubels, keukengerei, speelgoed en specifieke industriële toepassingen.'
        : (lang === 'de' ? 'Halbfabrikate und maßgefertigte Holzteile für Möbel, Küchenutensilien, Spielzeug und spezifische industrielle Anwendungen.' : (lang === 'ro' ? 'Piese din lemn semifinite și realizate la comandă pentru mobilier, ustensile de bucătărie, jucării și aplicații industriale specifice.' : 'Semi-finished and custom-made wooden parts for furniture, kitchen utensils, toys, and specific industrial applications.')),
      image: '/images/specials.png',
      link: '/specials',
      specs: [
        { label: lang === 'nl' ? 'Toepassingen' : (lang === 'de' ? 'Anwendungen' : (lang === 'ro' ? 'Aplicații' : 'Applications')), value: lang === 'nl' ? 'Meubelindustrie / Keukengerei / DIY' : (lang === 'de' ? 'Möbelindustrie / Küchenutensilien / Heimwerker' : (lang === 'ro' ? 'Industria mobilei / Ustensile bucătărie / DIY' : 'Furniture industry / Kitchen utensils / DIY')) },
        { label: lang === 'nl' ? 'FSC® Gecertificeerd' : (lang === 'de' ? 'FSC®-zertifiziert' : (lang === 'ro' ? 'Certificat FSC®' : 'FSC® Certified')), value: lang === 'nl' ? 'Beschikbaar op aanvraag' : (lang === 'de' ? 'Auf Anfrage erhältlich' : (lang === 'ro' ? 'Disponibil la cerere' : 'Available upon request')) },
        { label: lang === 'nl' ? 'Verpakking' : (lang === 'de' ? 'Verpackung' : (lang === 'ro' ? 'Ambalare' : 'Packaging')), value: lang === 'nl' ? 'Bulk of op maat verpakt' : (lang === 'de' ? 'Bulk oder kundenspezifisch verpackt' : (lang === 'ro' ? 'Vrac sau ambalat la comandă' : 'Bulk or custom packaged')) },
      ],
      tag: lang === 'nl' ? 'Specials' : (lang === 'de' ? 'Specials' : (lang === 'ro' ? 'Speciale' : 'Specials')),
    },
  ];

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category === activeFilter);



  const t = {
    heroBadge: {
      nl: 'FSC®-Gecertificeerde Houtindustrie',
      en: 'FSC®-Certified Wood Industry',
      de: 'FSC®-zertifizierte Holzindustrie',
      ro: 'Industria Lemnului Certificată FSC®'
    },
    heroTitle: {
      nl: 'Fabrikant van Beukenhouten Deuvels en Profielen',
      en: 'Manufacturer of Beechwood Dowels and Profiles',
      de: 'Hersteller von Buchenholzdübeln und Profilen',
      ro: 'Producător de Dibluri și Profile din Lemn de Fag'
    },
    heroSubtitle: {
      nl: 'Palrom Products combineert decennia aan ervaring met een moderne zagerij en droogkamers. Wij leveren hoogwaardige beukenhouten deuvels, profielen en geschaafde meubelcomponenten rechtstreeks aan de internationale meubel- en houtindustrie.',
      en: 'Palrom Products combines decades of experience with a modern sawmill and drying chambers. We supply high-quality beechwood dowels, profiles, and planed furniture components directly to the international furniture and wood industry.',
      de: 'Palrom Products verbindet jahrzehntelange Erfahrung mit einem modernen Sägewerk und Trockenkammern. Wir liefern hochwertige Buchenholzdübel, Profile und gehobelte Möbelkomponenten direkt an die internationale Möbel- und Holzindustrie.',
      ro: 'Palrom Products combină decenii de experiență cu un gater modern și camere de uscare. Furnizăm dibluri din lemn de fag, profile și componente de mobilier rinduite de înaltă calitate direct către industria internațională a mobilei și a lemnului.'
    },
    requestQuote: {
      nl: 'Offerte Aanvragen',
      en: 'Request a Quote',
      de: 'Angebot anfordern',
      ro: 'Solicită Ofertă'
    },
    viewProducts: {
      nl: 'Producten Bekijken',
      en: 'View Products',
      de: 'Produkte anzeigen',
      ro: 'Vezi Produse'
    },
    hiringTitle: {
      nl: 'We zoeken personeel! Bekijk onze vacatures',
      en: 'We are hiring! View our vacancies',
      de: 'Wir stellen ein! Sehen Sie sich unsere Stellenangebote an',
      ro: 'Angajăm! Vezi posturile noastre vacante'
    },
    hiringAlt: {
      nl: 'Vacatures bij Palrom Products - Solliciteer nu',
      en: 'Vacancies at Palrom Products - Apply now',
      de: 'Stellenangebote bei Palrom Products - Jetzt bewerben',
      ro: 'Locuri de muncă la Palrom Products - Aplică acum'
    },
    scrollDown: {
      nl: 'Scroll naar beneden',
      en: 'Scroll Down',
      de: 'Nach unten scrollen',
      ro: 'Derulați în jos'
    },
    welcomeBadge: {
      nl: 'Welkom bij PALROM',
      en: 'Welcome to PALROM',
      de: 'Willkommen bei PALROM',
      ro: 'Bun venit la PALROM'
    },
    certifiedTitle: {
      nl: 'FSC®-Gecertificeerd Beukenhout',
      en: 'FSC®-Certified Beechwood',
      de: 'FSC®-zertifiziertes Buchenholz',
      ro: 'Lemn de Fag Certificat FSC®'
    },
    introDesc1: {
      nl: 'Gevestigd in de bosrijke regio Brad (Hunedoara, Roemenië), exploiteert Palrom Products SRL een geavanceerde zagerij, moderne droogkamers en een professionele schaverij. Wij leveren hoogwaardig hout en meubelcomponenten rechtstreeks vanaf de bron.',
      en: 'Based in the forested region of Brad (Hunedoara, Romania), Palrom Products SRL operates an advanced sawmill, modern drying chambers, and a professional planing mill. We deliver high-quality lumber and furniture components directly from the source.',
      de: 'Mit Sitz in der waldreichen Region Brad (Hunedoara, Rumänien) betreibt Palrom Products SRL ein fortschrittliches Sägewerk, moderne Trockenkammern und ein professionelles Hobelwerk. Wir liefern hochwertiges Schnittholz und Möbelkomponenten direkt von der Quelle.',
      ro: 'Cu sediul în regiunea împădurită Brad (Hunedoara, România), Palrom Products SRL operează un gater avansat, camere moderne de uscare și o fabrică profesională de rindeluire. Livrăm cherestea și componente de mobilier de înaltă calitate direct de la sursă.'
    },
    introDesc2: {
      nl: 'Dankzij onze verticale integratie beheren we het gehele productieproces. We oogsten lokaal FSC®-gecertificeerd beukenhout, verwerken het met precisie, drogen het tot het optimale vochtgehalte en schaven het volgens de exacte specificaties van onze B2B-klanten in de Europese houtindustrie.',
      en: 'Thanks to our vertical integration, we control the entire production process. We harvest local FSC®-certified beechwood, process it with precision, dry it to the optimal moisture content, and plane it according to the exact specifications of our B2B customers in the European wood industry.',
      de: 'Dank unserer vertikalen Integration kontrollieren wir den gesamten Produktionsprozess. Wir ernten lokales, FSC®-zertifiziertes Buchenholz, verarbeiten es mit Präzision, trocknen es auf die optimale Feuchtigkeit und hobeln es genau nach den Spezifikationen unserer B2B-Kunden in der europäischen Holzindustrie.',
      ro: 'Datorită integrării noastre verticale, controlăm întregul proces de producție. Recoltăm lemn de fag local certificat FSC®, îl procesăm cu precizie, îl uscăm la conținutul optim de umiditate și îl rinduit conform specificațiilor exacte ale clienților noștri B2B din industria europeană a lemnului.'
    },
    sustainableTitle: {
      nl: '100% Duurzaam',
      en: '100% Sustainable',
      de: '100% Nachhaltig',
      ro: '100% Sustenabil'
    },
    sustainableDesc: {
      nl: 'Ons beukenhout is 100% FSC®-gecertificeerd en afkomstig uit verantwoord beheerde lokale bossen.',
      en: 'Our beechwood is 100% FSC®-certified and sourced from responsibly managed local forests.',
      de: 'Unser Buchenholz ist zu 100% FSC®-zertifiziert und stammt aus verantwortungsvoll bewirtschafteten lokalen Wäldern.',
      ro: 'Lemnul nostru de fag este 100% certificat FSC® și provine din păduri locale gestionate în mod responsabil.'
    },
    customTitle: {
      nl: 'Componenten op Maat',
      en: 'Custom Components',
      de: 'Komponenten nach Maß',
      ro: 'Componente la Comandă'
    },
    customDesc: {
      nl: 'Zagen, drogen, schaven en profileren gebeurt volledig volgens uw gewenste afmetingen.',
      en: 'Sawing, drying, planing, and profiling are done entirely according to your desired dimensions.',
      de: 'Sägen, Trocknen, Hobeln und Profilieren erfolgen ganz nach Ihren gewünschten Maßen.',
      ro: 'Tăierea, uscarea, rindeluirea și profilarea se fac în întregime conform dimensiunilor dorite.'
    },
    statsText: {
      nl: 'Jaar Ervaring',
      en: 'Years Experience',
      de: 'Jahre Erfahrung',
      ro: 'Ani de Experiență'
    },
    whyUsBadge: {
      nl: 'Waarom PALROM?',
      en: 'Why PALROM?',
      de: 'Warum PALROM?',
      ro: 'De ce PALROM?'
    },
    whyUsTitle: {
      nl: 'Grootschalige Productie & Maatwerk',
      en: 'Large-Scale Production & Customization',
      de: 'Großserienfertigung & Anpassung',
      ro: 'Producție de Mare Volum & Personalizare'
    },
    whyUsSub: {
      nl: 'Wij leveren niet alleen hout; wij ontwerpen oplossingen op maat die het rendement verhogen en de productiekosten verlagen voor meubelfabrikanten en houtbewerkers.',
      en: 'We do not just deliver timber; we design custom solutions that increase yield and lower production costs for furniture manufacturers and woodworkers.',
      de: 'Wir liefern nicht nur Holz; wir entwerfen maßgeschneiderte Lösungen, die den Ertrag steigern und die Produktionskosten für Möbelhersteller und Holzverarbeiter senken.',
      ro: 'Nu livrăm doar cherestea; proiectăm soluții personalizate care cresc randamentul și reduc costurile de producție pentru producătorii de mobilier și prelucrătorii de lemn.'
    },
    kilnsTitle: {
      nl: 'Moderne Droogkamers',
      en: 'Modern Drying Chambers',
      de: 'Moderne Trockenkammern',
      ro: 'Camere Moderne de Uscare'
    },
    kilnsDesc: {
      nl: 'Onze droogcapaciteit garandeert een stabiel vochtgehalte van 8-12%, wat kromtrekken of scheuren in uw meubelcomponenten voorkomt.',
      en: 'Our drying capacity guarantees a stable moisture content of 8-12%, preventing warping or cracking in your furniture components.',
      de: 'Unsere Trocknungskapazität garantiert eine stabile Holzfeuchtigkeit von 8-12 % und verhindert so ein Verziehen oder Reißen Ihrer Möbelkomponenten.',
      ro: 'Capacitatea noastră de uscare garantează o umiditate stabilă de 8-12%, prevenind deformarea sau crăparea componentelor dvs. de mobilier.'
    },
    labelingTitle: {
      nl: 'Winkelklare Etikettering',
      en: 'Retail-Ready Labeling',
      de: 'Einzelhandelsfertige Etikettierung',
      ro: 'Etichetare Gata pentru Retail'
    },
    labelingDesc: {
      nl: 'Voor de doe-het-zelfmarkt leveren we individueel gelabelde bundels met EAN-barcodes en verpakkingen op maat.',
      en: 'For DIY markets, we deliver individually labeled bundles with EAN barcodes and custom packaging.',
      de: 'Für Baumärkte liefern wir einzeln etikettierte Bündel mit EAN-Barcodes und kundenspezifischen Verpackungen.',
      ro: 'Pentru piețele de bricolaj, livrăm pachete etichetate individual cu coduri de bare EAN și ambalaje personalizate.'
    },
    logisticsTitle: {
      nl: 'Internationale Logistiek',
      en: 'International Logistics',
      de: 'Internationale Logistik',
      ro: 'Logistică Internațională'
    },
    logisticsDesc: {
      nl: 'Export naar Duitsland, Frankrijk, Oostenrijk en Japan. Inclusief grootschalige B2B-distributie en geoptimaliseerde opslag in Nederland.',
      en: 'Export to Germany, France, Austria, and Japan. Including large-scale B2B distribution and optimized warehousing in the Netherlands.',
      de: 'Export nach Deutschland, Frankreich, Österreich und Japan. Inklusive großflächigem B2B-Vertrieb und optimierter Lagerhaltung in den Niederlanden.',
      ro: 'Export în Germania, Franța, Austria și Japonia. Inclusiv distribuție B2B pe scară largă și depozitare optimizată în Olanda.'
    },
    brochureTitle: {
      nl: 'Wilt u technische afmetingen en specificaties bekijken?',
      en: 'Want to view technical dimensions and specifications?',
      de: 'Möchten Sie technische Maße und Spezifikationen einsehen?',
      ro: 'Doriți să vedeți dimensiunile și specificațiile tehnice?'
    },
    brochureDesc: {
      nl: 'Download onze officiële productbrochure met maattabellen, kwaliteitsklassen en verpakkingsopties.',
      en: 'Download our official product brochure with size tables, quality grades, and packaging options.',
      de: 'Laden Sie unsere offizielle Produktbroschüre mit Größentabellen, Qualitätsklassen und Verpackungsoptionen herunter.',
      ro: 'Descărcați broșura noastră oficială de produse cu tabele de dimensiuni, clase de calitate și opțiuni de ambalare.'
    },
    brochureBtn: {
      nl: 'Productbrochure Downloaden',
      en: 'Download Product Brochure',
      de: 'Produktbroschüre herunterladen',
      ro: 'Descărcați Broșura de Produse'
    },
    rangeBadge: {
      nl: 'Productassortiment',
      en: 'Product Range',
      de: 'Produktpalette',
      ro: 'Gama de Produse'
    },
    rangeTitle: {
      nl: 'Beukenhouten Deuvels & Meubelcomponenten',
      en: 'Beech Dowels & Furniture Components',
      de: 'Buchenholzdübel & Möbelkomponenten',
      ro: 'Dibluri de Fag & Componente de Mobilier'
    },
    rangeSub: {
      nl: 'Ontdek onze kernproducten, met uiterste precisie vervaardigd uit FSC®-gecertificeerd Roemeens beukenhout.',
      en: 'Discover our core products, crafted with extreme precision from FSC®-certified Romanian beechwood.',
      de: 'Entdecken Sie unsere Kernprodukte, die mit äußerster Präzision aus FSC®-zertifiziertem rumänischem Buchenholz gefertigt werden.',
      ro: 'Descoperiți produsele noastre de bază, realizate cu o precizie extremă din lemn de fag românesc certificat FSC®.'
    },
    filterAll: { nl: 'Alles', en: 'All', de: 'Alle', ro: 'Toate' },
    filterDowels: { nl: 'Beukenhouten stokken', en: 'Beechwood sticks', de: 'Buchenholzstäbe', ro: 'Tije din lemn de fag' },
    filterPlaned: { nl: 'Vierzijdig Geschaafd', en: 'Four-Sides Planed', de: 'Vierseitig Gehobelt', ro: 'Rinduit pe 4 Fețe' },
    filterProfiles: { nl: 'Houten Profielen', en: 'Wooden Profiles', de: 'Holzprofile', ro: 'Profile din Lemn' },
    filterSpecials: { nl: 'Speciale Componenten', en: 'Special Components', de: 'Spezialkomponenten', ro: 'Componente Speciale' }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <span className="hero-badge animate-fade-in">
            {getTranslation('heroBadge')}
          </span>
          <h1 className="hero-title animate-slide-up">
            {getTranslation('heroTitle')}
          </h1>
          <p className="hero-subtitle animate-slide-up-delay">
            {getTranslation('heroSubtitle')}
          </p>
          <div className="hero-buttons animate-slide-up-delay-2">
            <Link href="/configurator" className="btn btn-primary">
              {getTranslation('requestQuote')}
            </Link>
            <Link href="/products" className="btn btn-secondary">
              {getTranslation('viewProducts')}
            </Link>
          </div>
        </div>

        {/* Hiring Stamp on Hero Photo */}
        <Link href="/careers" className="hiring-stamp-hero" title={getTranslation('hiringTitle')}>
          <img src={`/images/hiring_stamp_${lang}.png`} alt={getTranslation('hiringAlt')} />
        </Link>

        <div className="scroll-indicator">
          <span>{getTranslation('scrollDown')}</span>
          <i className="fa-solid fa-chevron-down scroll-arrow"></i>
        </div>
      </section>

      {/* Introduction & Values Section */}
      <section className="intro-section section-padding">
        <div className="container">
          <div className="grid grid-2">
            <div className="intro-text-column animate-on-scroll">
              <span className="section-badge">
                {getTranslation('welcomeBadge')}
              </span>
              <h2 className="section-title">
                {getTranslation('certifiedTitle')}
              </h2>
              <p className="section-description">
                {getTranslation('introDesc1')}
              </p>
              <p className="section-description">
                {getTranslation('introDesc2')}
              </p>
              <div className="intro-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-tree"></i>
                  </div>
                  <div>
                    <h4>{getTranslation('sustainableTitle')}</h4>
                    <p>{getTranslation('sustainableDesc')}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h4>{getTranslation('customTitle')}</h4>
                    <p>{getTranslation('customDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-image-column animate-on-scroll">
              <div className="image-wrapper-decorative">
                <img
                  src="/images/sawmill.png"
                  alt="Automated wood processing Palrom"
                  className="img-responsive rounded-lg shadow-lg"
                />
                <div className="stats-badge">
                  <span className="stat-number">25+</span>
                  <span className="stat-text">{getTranslation('statsText')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section (Interactive Features Grid) */}
      <section className="why-us-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="section-badge">
              {getTranslation('whyUsBadge')}
            </span>
            <h2 className="section-title">
              {getTranslation('whyUsTitle')}
            </h2>
            <p className="section-subtitle">
              {getTranslation('whyUsSub')}
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <h3>{getTranslation('kilnsTitle')}</h3>
              <p>{getTranslation('kilnsDesc')}</p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-tag"></i>
              </div>
              <h3>{getTranslation('labelingTitle')}</h3>
              <p>{getTranslation('labelingDesc')}</p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>{getTranslation('logisticsTitle')}</h3>
              <p>{getTranslation('logisticsDesc')}</p>
            </div>
          </div>

          <div className="brochure-download-container animate-on-scroll">
            <div className="brochure-content">
              <i className="fa-solid fa-file-pdf pdf-large-icon"></i>
              <div>
                <h3>{getTranslation('brochureTitle')}</h3>
                <p>{getTranslation('brochureDesc')}</p>
              </div>
            </div>
            <a href="/palrom_brochure.pdf" download="palrom_brochure.pdf" className="btn btn-dark">
              <i className="fa-solid fa-download icon-left"></i> {getTranslation('brochureBtn')}
            </a>
          </div>
        </div>
      </section>

      {/* Products Catalogue Section */}
      <section id="products" className="products-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="section-badge">
              {getTranslation('rangeBadge')}
            </span>
            <h2 className="section-title">
              {getTranslation('rangeTitle')}
            </h2>
            <p className="section-subtitle">
              {getTranslation('rangeSub')}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="product-filters">
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
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <span className="product-tag">{p.tag}</span>
                </div>
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <ul className="product-specs">
                    {p.specs.map((spec, i) => (
                      <li key={i}>
                        <strong>{spec.label}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.link} className="product-link">
                    {activeFilter === 'all' 
                      ? (lang === 'nl' ? `Ontdek ${p.tag}` : (lang === 'de' ? `Entdecken Sie ${p.tag}` : (lang === 'ro' ? `Descoperă ${p.tag}` : `Discover ${p.tag}`)))
                      : (lang === 'nl' ? 'Bekijk details' : (lang === 'de' ? 'Details anzeigen' : (lang === 'ro' ? 'Vezi detalii' : 'View details')))}{' '}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reusable Contact & Team Section */}
      <ContactSection />
    </>
  );
}
