'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

// STAP 1: Upload de video naar YouTube (bijvoorbeeld als verborgen/unlisted of openbaar).
// STAP 2: Kopieer de video ID uit de YouTube link (bijv. 'y9vH9cM0J_4' uit 'https://www.youtube.com/watch?v=y9vH9cM0J_4').
// STAP 3: Vervang de onderstaande placeholder-ID 'dQw4w9WgXcQ' door uw eigen YouTube video ID.
const YOUTUBE_VIDEO_ID = '9c08nP2sCS8'; // Standaard placeholder video

export default function News() {
  const { lang } = useInquiry();
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    if (selectedArticle) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  const newsItems = [
    {
      id: 'configurator',
      tag: lang === 'nl' ? 'Digitale Bèta' : (lang === 'de' ? 'Digitale Beta' : (lang === 'ro' ? 'Beta Digitală' : 'Digital Beta')),
      tagClass: 'highlight-tag',
      date: lang === 'nl' ? '15 juni 2026' : (lang === 'de' ? '15. Juni 2026' : (lang === 'ro' ? '15 iunie 2026' : 'June 15, 2026')),
      author: 'IT & Sales Team',
      title: lang === 'nl' 
        ? 'Help Ons Testen: De Palrom Offerte Configurator is Live!' 
        : (lang === 'de' ? 'Helfen Sie uns beim Testen: Der Palrom Angebotskonfigurator ist live!' : (lang === 'ro' ? 'Ajută-ne să testăm: Configuratorul de Oferte Palrom este Live!' : 'Help Us Test: The Palrom Quote Configurator is Live!')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              We introduceren met trots de eerste bèta-versie van onze nieuwe B2B-productconfigurator: de{' '}
              <strong>Palrom Offerte Configurator</strong>. Met deze online tool kunnen inkopers en houtspecialisten direct de exacte millimeter-afmetingen, productgroepen (zoals houten staven, geschaafd hout en profielen) en gewenste afwerkingen invoeren voor grote volumebestellingen.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Wir freuen uns, die erste Beta-Version unseres neuen B2B-Produktkonfigurators vorzustellen: den{' '}
              <strong>Palrom Angebotskonfigurator</strong>. Mit diesem Online-Tool können Einkäufer und Holzspezialisten die genauen Millimeter-Maße, Produktgruppen (wie Dübel, gehobeltes Holz und Profile) und gewünschte Oberflächen für Großbestellungen direkt eingeben.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              Suntem mândri să vă prezentăm prima versiune beta a noului nostru configurator de produse B2B:{' '}
              <strong>Configurator de Oferte Palrom</strong>. Acest instrument online permite cumpărătorilor și specialiștilor în lemn să introducă direct dimensiunile exacte în milimetri, grupele de produse (cum ar fi dibluri, cherestea rinduită și profile) și finisajele dorite pentru comenzi de volum.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              We are proud to introduce the first beta version of our new B2B product configurator: the{' '}
              <strong>Palrom Quote Configurator</strong>. This online tool allows buyers and timber specialists to directly enter exact millimeter specifications, product groups (such as dowels, planed timber, and profiles), and desired finishes for volume orders.
            </p>
          )}
          
          {lang === 'nl' && (
            <p className="highlight-text">
              We zijn op zoek naar partners en B2B-klanten die deze configurator willen testen en hun feedback willen delen. Helpt u ons de flow te optimaliseren?
            </p>
          )}
          {lang === 'de' && (
            <p className="highlight-text">
              Wir suchen nach Partnern und B2B-Kunden, die diesen Konfigurator testen und ihr Feedback teilen möchten. Helfen Sie uns, den Ablauf zu optimieren?
            </p>
          )}
          {lang === 'ro' && (
            <p className="highlight-text">
              Căutăm parteneri și clienți B2B care doresc să testeze acest configurator și să își împărtășească feedback-ul. Ne ajutați să optimizăm fluxul?
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p className="highlight-text">
              We are looking for partners and B2B customers to test this configurator and share their feedback. Will you help us optimize the flow?
            </p>
          )}
          
          <div className="news-actions">
            <Link href="/configurator" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              {lang === 'nl' ? 'Start de Palrom Offerte Configurator' : (lang === 'de' ? 'Palrom Angebotskonfigurator starten' : (lang === 'ro' ? 'Start Configurator de Oferte Palrom' : 'Start the Palrom Quote Configurator'))}{' '}
              <i className="fa-solid fa-arrow-right icon-right"></i>
            </Link>
            <span className="badge badge-yellow" style={{ marginLeft: '1rem' }}>
              {lang === 'nl' ? 'Bèta Test' : (lang === 'de' ? 'Beta-Test' : (lang === 'ro' ? 'Testare Beta' : 'Beta Test'))}
            </span>
          </div>
        </>
      ),
    },
    {
      id: 'drying',
      tag: lang === 'nl' ? 'Productie' : (lang === 'de' ? 'Produktion' : (lang === 'ro' ? 'Producție' : 'Production')),
      date: lang === 'nl' ? '24 mei 2026' : (lang === 'de' ? '24. Mai 2026' : (lang === 'ro' ? '24 mai 2026' : 'May 24, 2026')),
      author: 'Sawmill Ops',
      title: lang === 'nl' 
        ? 'Uitbreiding van de droogkamercapaciteit in Brad' 
        : (lang === 'de' ? 'Erweiterung der Trockenkammerkapazität in Brad' : (lang === 'ro' ? 'Extinderea capacității camerelor de uscare în Brad' : 'Expansion of Drying Chamber Capacity in Brad')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              Om te voldoen aan de stijgende internationale vraag naar hoogwaardig FSC®-gecertificeerd beukenhout, hebben we twee nieuwe volautomatische droogkamers in gebruik genomen. Deze uitbreiding verhoogt onze totale droogcapaciteit met 15%.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Um die steigende internationale Nachfrage nach hochwertigem FSC®-zertifiziertem Buchenholz zu befriedigen, haben wir zwei neue vollautomatische Trockenkammern in Betrieb genommen. Diese Erweiterung erhöht unsere gesamte Trocknungskapazität um 15 %.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              Pentru a satisface cererea internațională în creștere de lemn de fag de înaltă calitate certificat FSC®, am pus în funcțiune două noi camere de uscare complet automatizate. Această extindere mărește capacitatea noastră totală de uscare cu 15%.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              To meet rising international demand for high-quality FSC®-certified beechwood, we have commissioned two new fully-automated drying chambers. This expansion increases our total drying chamber capacity by 15%.
            </p>
          )}
          <Link href="/about#timeline-details" className="news-link">
            {lang === 'nl' ? 'Lees onze geschiedenis' : (lang === 'de' ? 'Unsere Geschichte lesen' : (lang === 'ro' ? 'Citiți istoricul nostru' : 'Read our history'))}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/kilns_news.jpg',
    },
    {
      id: 'fsc',
      tag: lang === 'nl' ? 'Duurzaamheid' : (lang === 'de' ? 'Nachhaltigkeit' : (lang === 'ro' ? 'Sustenabilitate' : 'Sustainability')),
      date: lang === 'nl' ? '12 april 2026' : (lang === 'de' ? '12. April 2026' : (lang === 'ro' ? '12 april 2026' : 'April 12, 2026')),
      author: 'Ecology Lead',
      title: lang === 'nl' 
        ? 'FSC® Chain of Custody Hergecertificeerd' 
        : (lang === 'de' ? 'FSC® Chain of Custody rezertifiziert' : (lang === 'ro' ? 'Certificare FSC® Chain of Custody Reînnoită' : 'FSC® Chain of Custody Recertified')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              Na een uitgebreide audit is ons 100% FSC®-certificaat voor duurzaam bosbeheer en verwerking met succes verlengd. Wij garanderen een verantwoorde inkoop van al onze beukenhouten producten.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Nach einem umfassenden Audit wurde unser 100 % FSC®-Zertifikat für nachhaltige Waldbewirtschaftung und -verarbeitung erfolgreich verlängert. Wir garantieren die verantwortungsvolle Beschaffung aller unserer Buchenholzprodukte.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              În urma unui audit cuprinzător, certificarea noastră 100% FSC® pentru managementul durabil al pădurilor și procesare a fost reînnoită cu succes. Garantăm aprovizionarea responsabilă cu toate produsele noastre din lemn de fag.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              Following a comprehensive audit, our 100% FSC® certification for sustainable forest management and processing has been successfully renewed. We guarantee the responsible sourcing of all our beechwood products.
            </p>
          )}
          <Link href="/products" className="news-link">
            {lang === 'nl' ? 'Ontdek onze producten' : (lang === 'de' ? 'Unsere Produkte entdecken' : (lang === 'ro' ? 'Explorați produsele noastre' : 'Explore our products'))}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/hero_bg.jpg',
    },
  ];

  const galleryItems = [
    {
      id: 1,
      image: '/images/7.png',
      title: lang === 'nl' ? 'Sortering Grondstoffen' : (lang === 'de' ? 'Rohstoffsortierung' : (lang === 'ro' ? 'Sortare Materii Prime' : 'Raw Materials Sorting')),
      desc: lang === 'nl' ? 'Lokaal ingekochte duurzame beukenhouten stammen.' : (lang === 'de' ? 'Nachhaltige Buchenholzstämme aus lokaler Beschaffung.' : (lang === 'ro' ? 'Bușteni din lemn de fag sustenabili din surse locale.' : 'Locally sourced sustainable beech wood logs.')),
    },
    {
      id: 2,
      image: '/images/6.png',
      title: lang === 'nl' ? 'Eerste Zaagbewerkingen' : (lang === 'de' ? 'Primäre Sägearbeiten' : (lang === 'ro' ? 'Operațiuni de Tăiere Primară' : 'Primary Sawing Operations')),
      desc: lang === 'nl' ? 'Geavanceerde zaaglijnen en het zagen van planken.' : (lang === 'de' ? 'High-Tech-Stammzerlegung und Zuschnitt von Schnittholz.' : (lang === 'ro' ? 'Debitarea buștenilor și tăierea cherestelei cu tehnologie avansată.' : 'High-tech log breakdown and sawn timber cutting.')),
    },
    {
      id: 3,
      image: '/images/1.png',
      title: lang === 'nl' ? 'Stomen & Conditioneren' : (lang === 'de' ? 'Dämpfen & Bewittern' : (lang === 'ro' ? 'Aburire & Tratare' : 'Steaming & Weathering')),
      desc: lang === 'nl' ? 'Gecontroleerd stomen van het hout voor kleur en stabiliteit.' : (lang === 'de' ? 'Kontrolliertes Holzdämpfen für Farbe und Stabilität.' : (lang === 'ro' ? 'Aburirea controlată a lemnului pentru culoare și stabilitate.' : 'Controlled wood steaming for color and stability.')),
    },
    {
      id: 4,
      image: '/images/kilns.jpg',
      title: lang === 'nl' ? 'Geautomatiseerde Droogkamers' : (lang === 'de' ? 'Automatische Trockenkammern' : (lang === 'ro' ? 'Camere de Uscare Automatizate' : 'Automated Drying Chambers')),
      desc: lang === 'nl' ? 'Nauwkeurig drogen van hout tot 8-12% vochtigheid.' : (lang === 'de' ? 'Präzise Holztrocknung auf 8-12 % Feuchtigkeit.' : (lang === 'ro' ? 'Uscarea precisă a cherestelei la o umiditate de 8-12%.' : 'Drying timber precisely to 8-12% moisture.')),
    },
    {
      id: 5,
      image: '/images/5.png',
      title: lang === 'nl' ? 'Houtschaverij Werkplaats' : (lang === 'de' ? 'Hobelwerkstatt' : (lang === 'ro' ? 'Atelier de Rinduit Lemn' : 'Wood Planing Workshop')),
      desc: lang === 'nl' ? 'Kalibreren van houtprofielen tot de exacte toleranties van de klant.' : (lang === 'de' ? 'Kalibrierung von Holzprofilen nach exakten Kundentoleranzen.' : (lang === 'ro' ? 'Calibrarea profilelor din lemn conform toleranțelor exacte ale clienților.' : 'Calibrating timber profiles to exact customer tolerances.')),
    },
    {
      id: 6,
      image: '/images/2.png',
      title: lang === 'nl' ? 'Beukenhouten Deuvelproductie' : (lang === 'de' ? 'Buchenholzdübel-Produktion' : (lang === 'ro' ? 'Producție Dibluri din Lemn de Fag' : 'Beech Dowel Production')),
      desc: lang === 'nl' ? 'Hoge capaciteit gegroefde en gladde deuvelproductielijnen.' : (lang === 'de' ? 'Hochleistungslinien für geriffelte und glatte Dübel.' : (lang === 'ro' ? 'Linii de mare capacitate pentru dibluri canelate și netede.' : 'High capacity rilled and smooth dowel lines.')),
    },
    {
      id: 7,
      image: '/images/3.png',
      title: lang === 'nl' ? 'Kwaliteitsinspectie & Sortering' : (lang === 'de' ? 'Qualitätsprüfung & Sortierung' : (lang === 'ro' ? 'Inspecție de Calitate & Sortare' : 'Quality Inspection & Sorting')),
      desc: lang === 'nl' ? 'Strenge visuele controle om premium houtklassen te garanderen.' : (lang === 'de' ? 'Strenge visuelle Prüfung zur Gewährleistung erstklassiger Holzqualitäten.' : (lang === 'ro' ? 'Control vizual riguros pentru a garanta clase de lemn premium.' : 'Rigorous visual check to guarantee premium wood grades.')),
    },
    {
      id: 8,
      image: '/images/8.png',
      title: lang === 'nl' ? 'Logistieke Ondersteuning' : (lang === 'de' ? 'Globale Logistik-Unterstützung' : (lang === 'ro' ? 'Suport Logistic Global' : 'Global Logistics Support')),
      desc: lang === 'nl' ? 'Exportklare verpakking en bundeling voor doe-het-zelf-bouwmarkten.' : (lang === 'de' ? 'Exportfertige Verpackung und Bündelung für Baumärkte.' : (lang === 'ro' ? 'Ambalare pregătită pentru export și ambalare în pachete pentru hypermarketuri DIY.' : 'Export-ready packaging and DIY hypermarket bundling.')),
    },
    {
      id: 9,
      image: '/images/specials_gallery.jpg',
      title: lang === 'nl' ? 'Speciale Componenten Portfolio' : (lang === 'de' ? 'Spezialkomponenten-Portfolio' : (lang === 'ro' ? 'Portofoliu Componente Speciale' : 'Special Components Portfolio')),
      desc: lang === 'nl' ? 'Diverse op maat gemaakte draai- en freesonderdelen uit onze productie.' : (lang === 'de' ? 'Verschiedene kundenspezifische Dreh- und Frästeile aus unserer Produktion.' : (lang === 'ro' ? 'Diverse componente strunjite și frezate la comandă din producția noastră.' : 'Various custom-turned and milled beechwood components from our production.')),
    },
  ];

  const t = {
    newsBreadcrumb: { nl: 'Nieuws', en: 'News', de: 'Neuigkeiten', ro: 'Știri' },
    newsTitle: { nl: 'Nieuws & Updates', en: 'News & Updates', de: 'Neuigkeiten & Updates', ro: 'Știri & Noutăți' },
    newsSubtitle: {
      nl: 'Blijf op de hoogte van onze nieuwste investeringen, duurzaamheidsprestaties en digitale tools zoals onze nieuwe B2B-configurator.',
      en: 'Stay informed about our latest investments, sustainability achievements, and digital tools like our new B2B configurator.',
      de: 'Bleiben Sie auf dem Laufenden über unsere neuesten Investitionen, Nachhaltigkeitserfolge und digitalen Tools wie unseren neuen B2B-Konfigurator.',
      ro: 'Fii la curent cu ultimele noastre investiții, realizări în materie de sustenabilitate și instrumente digitale, cum ar fi noul nostru configurator B2B.'
    },
    latestUpdatesBadge: { nl: 'Nieuws & Updates', en: 'News & Updates', de: 'Neuigkeiten & Updates', ro: 'Știri & Noutăți' },
    latestUpdatesTitle: { nl: 'Laatste Updates', en: 'Latest Updates', de: 'Neueste Updates', ro: 'Ultimele Noutăți' },
    latestUpdatesSub: {
      nl: 'Blijf op de hoogte van onze nieuwste innovaties, fabrieksupgrades en digitale hulpmiddelen.',
      en: 'Stay up to date with our latest innovations, factory upgrades, and digital tools.',
      de: 'Bleiben Sie auf dem Laufenden mit unseren neuesten Innovationen, Fabrik-Upgrades und digitalen Tools.',
      ro: 'Fii la curent cu cele mai recente inovații, modernizări ale fabricii și instrumente digitale.'
    },
    galleryBadge: { nl: 'Media Galerij', en: 'Media Gallery', de: 'Mediengalerie', ro: 'Galerie Media' },
    galleryTitle: { nl: 'Fabrieks- & Productiemedia', en: 'Factory & Production Media', de: 'Fabrik- & Produktionsmedien', ro: 'Media Fabrică & Producție' },
    gallerySub: {
      nl: "Bekijk de foto's en video's van onze zagerij en op maat gemaakte productieprocessen in Brad, Roemenië.",
      en: "Explore the photos and videos of our sawmill operations and custom manufacturing processes in Brad, Romania.",
      de: "Entdecken Sie die Fotos und Videos unserer Sägewerksbetriebe und kundenspezifischen Fertigungsprozesse in Brad, Rumänien.",
      ro: "Explorați fotografiile și videoclipurile cu operațiunile gaterului și procesele de producție personalizate din Brad, România."
    },
    videoTitle: { nl: 'Ons Verwerkingsproces', en: 'Our Milling Process', de: 'Unser Fräsprozess', ro: 'Procesul Nostru de Frezare' },
    videoDesc: {
      nl: "Ervaar de precisie van houtbewerking. Onze ultramoderne zagerij combineert generaties Roemeens vakmanschap met geavanceerde Europese zaagtechnologieën, waarbij elke snede tot op de micrometer nauwkeurig wordt gekalibreerd voor hoogwaardige, duurzame beukenhouten componenten.",
      en: "Experience the precision of wood transformation. Our state-of-the-art milling facility combines generations of Romanian craftsmanship with advanced European sawing technologies, calibrating every cut to micron-level perfection for premium, sustainable beechwood components.",
      de: "Erleben Sie die Präzision der Holzverwandlung. Unsere hochmoderne Fräsanlage verbindet Generationen rumänischer Handwerkskunst mit fortschrittlichen europäischen Sägetechnologien und kalibriert jeden Schnitt bis zur Perfektion auf Mikrometer-Ebene für erstklassige, nachhaltige Buchenholzkomponenten.",
      ro: "Experimentați precizia transformării lemnului. Unitatea noastră de frezare de ultimă generație îmbină generații de meșteșug românesc cu tehnologii europene avansate de tăiere, calibrând fiecare tăietură la perfecțiune la nivel de microni pentru componente premium și durabile din lemn de fag."
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
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <span>{getTranslation('newsBreadcrumb')}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>
            {getTranslation('newsTitle')}
          </h1>
          <p>{getTranslation('newsSubtitle')}</p>
        </div>
      </section>

      {/* News / Updates Section */}
      <section id="news" className="news-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">
              {getTranslation('latestUpdatesBadge')}
            </span>
            <h2 className="section-title">
              {getTranslation('latestUpdatesTitle')}
            </h2>
            <p className="section-subtitle text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1.1rem', fontWeight: 300 }}>
              {getTranslation('latestUpdatesSub')}
            </p>
          </div>

          <div className="news-grid">
            {newsItems.map((item) => (
              <div
                className={`news-card animate-on-scroll ${item.id === 'configurator' ? 'configurator-featured' : ''}`}
                key={item.id}
                style={
                  item.id === 'configurator'
                    ? { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', cursor: 'pointer' }
                    : { cursor: 'pointer' }
                }
                onClick={(e) => {
                  if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                  }
                  setSelectedArticle(item);
                }}
              >
                <div className="news-image" style={item.id === 'configurator' ? { height: '340px' } : {}}>
                  <img src={item.image || '/images/config_dowels.png'} alt={item.title} />
                  <span className={`news-tag ${item.tagClass || ''}`}>{item.tag}</span>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">
                      <i className="fa-regular fa-calendar"></i> {item.date}
                    </span>
                    {item.author && (
                      <span className="news-author" style={{ marginLeft: '1rem' }}>
                        <i className="fa-regular fa-user"></i> {item.author}
                      </span>
                    )}
                  </div>
                  <h3>{item.title}</h3>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery-details" className="gallery-section section-padding bg-white">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">
              {getTranslation('galleryBadge')}
            </span>
            <h2 className="section-title">
              {getTranslation('galleryTitle')}
            </h2>
            <p className="section-subtitle">
              {getTranslation('gallerySub')}
            </p>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div className="gallery-item animate-on-scroll" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Video Item */}
            <div className="gallery-item video-item animate-on-scroll">
              <iframe
                className="gallery-video"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
                title={getTranslation('videoTitle')}
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <div className="gallery-overlay">
                <h3>{getTranslation('videoTitle')}</h3>
                <p>{getTranslation('videoDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {selectedArticle && (
        <div className="news-modal active" id="newsModal">
          <div className="news-modal-overlay" onClick={() => setSelectedArticle(null)}></div>
          <div className="news-modal-container">
            <button className="news-modal-close" onClick={() => setSelectedArticle(null)} aria-label="Close popup">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="news-modal-image">
              <img src={selectedArticle.image || '/images/config_dowels.png'} alt={selectedArticle.title} />
            </div>
            <div className="news-modal-body">
              <div className="news-modal-meta">
                <span className={`news-tag ${selectedArticle.tagClass || ''}`}>{selectedArticle.tag}</span>
                <span className="news-meta-item"><i className="fa-regular fa-calendar"></i> {selectedArticle.date}</span>
                {selectedArticle.author && (
                  <span className="news-meta-item"><i className="fa-regular fa-user"></i> {selectedArticle.author}</span>
                )}
              </div>
              <h2>{selectedArticle.title}</h2>
              <div className="news-modal-text">
                {selectedArticle.id === 'configurator' ? (
                  <>
                    {lang === 'nl' && (
                      <>
                        <p>We introduceren met trots de eerste bèta-versie van onze nieuwe B2B-productconfigurator: de <strong>Palrom Offerte Configurator</strong>. Met deze online tool kunnen inkopers en houtspecialisten direct de exacte millimeter-afmetingen, productgroepen (zoals houten staven, geschaafd hout en profielen) en gewenste afwerkingen invoeren voor grote volumebestellingen.</p>
                        <p>Met de introductie van deze digitale tool zetten we een grote stap in het optimaliseren van onze B2B-dienstverlening. In plaats van handmatige e-mailuitwisselingen over afmetingen en toleranties, kunnen onze partners nu in drie eenvoudige stappen hun gewenste productgroepen configureren. De tool berekent live volumes, toont live sliders voor dikte, breedte en lengte, en biedt een interactieve selectie van speciale houtproducten.</p>
                        <p>We nodigen al onze partners en B2B-klanten uit om deze configurator te testen en hun feedback te delen. Dit helpt ons de workflows te optimaliseren en de definitieve release perfect af te stemmen op uw inkoopbehoeften.</p>
                      </>
                    )}
                    {lang === 'de' && (
                      <>
                        <p>Wir freuen uns, die erste Beta-Version unseres neuen B2B-Produktkonfigurators vorzustellen: den <strong>Palrom Angebotskonfigurator</strong>. Mit diesem Online-Tool können Einkäufer und Holzspezialisten die genauen Millimeter-Maße, Produktgruppen (wie Dübel, gehobeltes Holz und Profile) und gewünschte Oberflächen für Großbestellungen direkt eingeben.</p>
                        <p>Mit der Einführung dieses digitalen Tools machen wir einen großen Schritt zur Optimierung unseres B2B-Service. Anstatt manueller E-Mail-Austausche über Abmessungen und Toleranzen können unsere Partner nun in drei einfachen Schritten ihre gewünschten Produktgruppen konfigurieren. Das Tool berechnet Live-Volumina, zeigt Live-Schieberegler für Dicke, Breite und Länge und bietet eine interaktive Auswahl spezieller Holzprodukte.</p>
                        <p>Wir laden alle unsere Partner und B2B-Kunden ein, diesen Konfigurator zu testen und ihr Feedback zu teilen. Dies hilft uns, die Abläufe zu optimieren und die endgültige Version perfekt auf Ihre Einkaufsbedürfnisse abzustimmen.</p>
                      </>
                    )}
                    {lang === 'ro' && (
                      <>
                        <p>Suntem mândri să vă prezentăm prima versiune beta a noului nostru configurator de produse B2B: <strong>Configurator de Oferte Palrom</strong>. Acest instrument online permite cumpărătorilor și specialiștilor în lemn să introducă direct dimensiunile exacte în milimetri, grupele de produse (cum ar fi dibluri, cherestea rinduită și profile) și finisajele dorite pentru comenzi de volum.</p>
                        <p>Odată cu introducerea acestui instrument digital, facem un pas mare în optimizarea serviciilor noastre B2B. În loc de schimburi manuale de e-mailuri despre dimensiuni și toleranțe, partenerii noștri își pot configura acum grupurile de produse dorite în trei pași simpli. Instrumentul calculează volume live, afișează glisoare live pentru grosime, lățime și lungime și oferă o selecție interactivă de produse din lemn speciale.</p>
                        <p>Invităm toți partenerii și clienții noștri B2B să testeze acest configurator și să își împărtășească feedback-ul. Acest lucru ne ajută să optimizăm fluxurile de lucru și să adaptăm perfect versiunea finală la nevoile dumneavoastră de achiziție.</p>
                      </>
                    )}
                    {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
                      <>
                        <p>We are proud to introduce the first beta version of our new B2B product configurator: the <strong>Palrom Quote Configurator</strong>. This online tool allows buyers and timber specialists to directly enter exact millimeter specifications, product groups (such as dowels, planed timber, and profiles), and desired finishes for volume orders.</p>
                        <p>With the introduction of this digital tool, we are taking a big step in optimizing our B2B services. Instead of manual email exchanges about dimensions and tolerances, our partners can now configure their desired product groups in three simple steps. The tool calculates live volumes, displays live sliders for thickness, width, and length, and offers an interactive selection of special wood products.</p>
                        <p>We invite all our partners and B2B customers to test this configurator and share their feedback. This helps us optimize the workflows and align the final release perfectly with your purchasing needs.</p>
                      </>
                    )}
                  </>
                ) : (
                  selectedArticle.content
                )}
              </div>
              <div className="news-modal-actions" style={{ marginTop: '1.5rem' }}>
                {selectedArticle.id === 'configurator' ? (
                  <Link href="/configurator" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Start de Palrom Offerte Configurator' : (lang === 'de' ? 'Palrom Angebotskonfigurator starten' : (lang === 'ro' ? 'Start Configurator de Oferte Palrom' : 'Start the Palrom Quote Configurator'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                ) : selectedArticle.id === 'drying' ? (
                  <Link href="/about#timeline-details" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Lees onze geschiedenis' : (lang === 'de' ? 'Unsere Geschichte lesen' : (lang === 'ro' ? 'Citiți istoricul nostru' : 'Read our history'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                ) : (
                  <Link href="/products" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Ontdek onze producten' : (lang === 'de' ? 'Unsere Produkte entdecken' : (lang === 'ro' ? 'Explorați produsele noastre' : 'Explore our products'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
