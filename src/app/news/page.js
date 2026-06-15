'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

export default function News() {
  const { lang } = useInquiry();

  const newsItems = [
    {
      id: 'configurator',
      tag: lang === 'nl' ? 'Digitale Bèta' : 'Digital Beta',
      tagClass: 'highlight-tag',
      date: lang === 'nl' ? '15 juni 2026' : 'June 15, 2026',
      author: 'IT & Sales Team',
      title: lang === 'nl' 
        ? 'Help Ons Testen: De Palrom Offerte Configurator is Live!' 
        : 'Help Us Test: The Palrom Quote Configurator is Live!',
      content: (
        <>
          {lang === 'nl' ? (
            <p>
              We introduceren met trots de eerste bèta-versie van onze nieuwe B2B-productconfigurator: de{' '}
              <strong>Palrom Offerte Configurator</strong>. Met deze online tool kunnen inkopers en houtspecialisten direct de exacte millimeter-afmetingen, productgroepen (zoals houten staven, geschaafd hout en profielen) en gewenste afwerkingen invoeren voor grote volumebestellingen.
            </p>
          ) : (
            <p>
              We are proud to introduce the first beta version of our new B2B product configurator: the{' '}
              <strong>Palrom Quote Configurator</strong>. This online tool allows buyers and timber specialists to directly enter exact millimeter specifications, product groups (such as dowels, planed timber, and profiles), and desired finishes for volume orders.
            </p>
          )}
          
          {lang === 'nl' ? (
            <p className="highlight-text">
              We zijn op zoek naar partners en B2B-klanten die deze configurator willen testen en hun feedback willen delen. Helpt u ons de flow te optimaliseren?
            </p>
          ) : (
            <p className="highlight-text">
              We are looking for partners and B2B customers to test this configurator and share their feedback. Will you help us optimize the flow?
            </p>
          )}
          
          <div className="news-actions">
            <Link href="/configurator" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              {lang === 'nl' ? 'Start de Palrom Offerte Configurator' : 'Start the Palrom Quote Configurator'}{' '}
              <i className="fa-solid fa-arrow-right icon-right"></i>
            </Link>
            <span className="badge badge-yellow" style={{ marginLeft: '1rem' }}>
              {lang === 'nl' ? 'Bèta Test' : 'Beta Test'}
            </span>
          </div>
        </>
      ),
    },
    {
      id: 'drying',
      tag: lang === 'nl' ? 'Productie' : 'Production',
      date: lang === 'nl' ? '24 mei 2026' : 'May 24, 2026',
      author: 'Sawmill Ops',
      title: lang === 'nl' 
        ? 'Uitbreiding van de droogkamercapaciteit in Brad' 
        : 'Expansion of Kiln Drying Capacity in Brad',
      content: (
        <>
          {lang === 'nl' ? (
            <p>
              Om te voldoen aan de stijgende internationale vraag naar hoogwaardig FSC-gecertificeerd beukenhout, hebben we twee nieuwe volautomatische droogkamers in gebruik genomen. Deze uitbreiding verhoogt onze totale droogcapaciteit met 15%.
            </p>
          ) : (
            <p>
              To meet rising international demand for high-quality FSC-certified beechwood, we have commissioned two new fully-automated drying chambers. This expansion increases our total kiln drying capacity by 15%.
            </p>
          )}
          <Link href="/about#timeline-details" className="news-link">
            {lang === 'nl' ? 'Lees onze geschiedenis' : 'Read our history'}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/kilns_news.jpg',
    },
    {
      id: 'fsc',
      tag: lang === 'nl' ? 'Duurzaamheid' : 'Sustainability',
      date: lang === 'nl' ? '12 april 2026' : 'April 12, 2026',
      author: 'Ecology Lead',
      title: lang === 'nl' 
        ? 'FSC® Chain of Custody Hergecertificeerd' 
        : 'FSC® Chain of Custody Recertified',
      content: (
        <>
          {lang === 'nl' ? (
            <p>
              Na een uitgebreide audit is ons 100% FSC®-certificaat voor duurzaam bosbeheer en verwerking met succes verlengd. Wij garanderen een verantwoorde inkoop van al onze beukenhouten producten.
            </p>
          ) : (
            <p>
              Following a comprehensive audit, our 100% FSC® certification for sustainable forest management and processing has been successfully renewed. We guarantee the responsible sourcing of all our beechwood products.
            </p>
          )}
          <Link href="/products" className="news-link">
            {lang === 'nl' ? 'Ontdek onze producten' : 'Explore our products'}{' '}
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
      image: '/images/hero_bg.jpg',
      title: lang === 'nl' ? 'Sortering Grondstoffen' : 'Raw Materials Sorting',
      desc: lang === 'nl' ? 'Lokaal ingekochte duurzame beukenhouten stammen.' : 'Locally sourced sustainable beech wood logs.',
    },
    {
      id: 2,
      image: '/images/2.png',
      title: lang === 'nl' ? 'Eerste Zaagbewerkingen' : 'Primary Sawing Operations',
      desc: lang === 'nl' ? 'Geavanceerde zaaglijnen en het zagen van planken.' : 'High-tech log breakdown and sawn timber cutting.',
    },
    {
      id: 3,
      image: '/images/3.png',
      title: lang === 'nl' ? 'Stomen & Conditioneren' : 'Steaming & Weathering',
      desc: lang === 'nl' ? 'Gecontroleerd stomen van het hout voor kleur en stabiliteit.' : 'Controlled wood steaming for color and stability.',
    },
    {
      id: 4,
      image: '/images/kilns.jpg',
      title: lang === 'nl' ? 'Geautomatiseerde Droogkamers' : 'Automated Drying Kilns',
      desc: lang === 'nl' ? 'Nauwkeurig drogen van hout tot 8-12% vochtigheid.' : 'Drying timber precisely to 8-12% moisture.',
    },
    {
      id: 5,
      image: '/images/planed_wood.png',
      title: lang === 'nl' ? 'Houtschaverij Werkplaats' : 'Wood Planing Workshop',
      desc: lang === 'nl' ? 'Kalibreren van houtprofielen tot de exacte toleranties van de klant.' : 'Calibrating timber profiles to exact customer tolerances.',
    },
    {
      id: 6,
      image: '/images/dowels.png',
      title: lang === 'nl' ? 'Beukenhouten Deuvelproductie' : 'Beech Dowel Production',
      desc: lang === 'nl' ? 'Hoge capaciteit gegroefde en gladde deuvelproductielijnen.' : 'High capacity rilled and smooth dowel lines.',
    },
    {
      id: 7,
      image: '/images/7.png',
      title: lang === 'nl' ? 'Kwaliteitsinspectie & Sortering' : 'Quality Inspection & Sorting',
      desc: lang === 'nl' ? 'Strenge visuele controle om premium houtklassen te garanderen.' : 'Rigorous visual check to guarantee premium wood grades.',
    },
    {
      id: 8,
      image: '/images/8.png',
      title: lang === 'nl' ? 'Logistieke Ondersteuning' : 'Global Logistics Support',
      desc: lang === 'nl' ? 'Exportklare verpakking en bundeling voor doe-het-zelf-bouwmarkten.' : 'Export-ready packaging and DIY hypermarket bundling.',
    },
  ];

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <span>{lang === 'nl' ? 'Nieuws' : 'News'}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>
            {lang === 'nl' ? 'Nieuws & Updates' : 'News & Updates'}
          </h1>
          <p>
            {lang === 'nl'
              ? 'Blijf op de hoogte van onze nieuwste investeringen, duurzaamheidsprestaties en digitale tools zoals onze nieuwe B2B-configurator.'
              : 'Stay informed about our latest investments, sustainability achievements, and digital tools like our new B2B configurator.'}
          </p>
        </div>
      </section>

      {/* News / Updates Section */}
      <section id="news" className="news-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">
              {lang === 'nl' ? 'Nieuws & Updates' : 'News & Updates'}
            </span>
            <h2 className="section-title">
              {lang === 'nl' ? 'Laatste Updates' : 'Latest Updates'}
            </h2>
            <p className="section-subtitle text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1.1rem', fontWeight: 300 }}>
              {lang === 'nl'
                ? 'Blijf op de hoogte van onze nieuwste innovaties, fabrieksupgrades en digitale hulpmiddelen.'
                : 'Stay up to date with our latest innovations, factory upgrades, and digital tools.'}
            </p>
          </div>

          <div className="news-grid">
            {newsItems.map((item) => (
              <div
                className={`news-card animate-on-scroll ${item.id === 'configurator' ? 'configurator-featured' : ''}`}
                key={item.id}
                style={item.id === 'configurator' ? { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' } : {}}
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
              {lang === 'nl' ? 'Media Galerij' : 'Media Gallery'}
            </span>
            <h2 className="section-title">
              {lang === 'nl' ? 'Fabrieks- & Productiemedia' : 'Factory & Production Media'}
            </h2>
            <p className="section-subtitle">
              {lang === 'nl'
                ? "Bekijk de foto's en video's van onze zagerij en op maat gemaakte productieprocessen in Brad, Roemenië."
                : 'Explore the photos and videos of our sawmill operations and custom manufacturing processes in Brad, Romania.'}
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
              <video autoPlay muted loop playsInline controls className="gallery-video">
                <source src="/images/production-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="gallery-overlay">
                <h3>
                  {lang === 'nl' ? 'Ons Verwerkingsproces' : 'Our Milling Process'}
                </h3>
                <p>
                  {lang === 'nl'
                    ? 'Ervaar de precisie van houtbewerking. Onze ultramoderne zagerij combineert generaties Roemeens vakmanschap met geavanceerde Europese zaagtechnologieën, waarbij elke snede tot op de micrometer nauwkeurig wordt gekalibreerd voor hoogwaardige, duurzame beukenhouten componenten.'
                    : 'Experience the precision of wood transformation. Our state-of-the-art milling facility combines generations of Romanian craftsmanship with advanced European sawing technologies, calibrating every cut to micron-level perfection for premium, sustainable beechwood components.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
