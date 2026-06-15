'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');

  const products = [
    {
      id: 'dowels',
      category: 'dowels',
      name: 'Beukenhouten Pluggen & Deuvels',
      description: 'Verkrijgbaar in diameters van 3 mm tot 60 mm. Keuze uit gladde houten pinnen of spiraalgegroefde deuvels voor een optimale lijmhechting.',
      image: '/images/dowels.png',
      link: '/dowels',
      specs: [
        { label: 'Diameter', value: '3mm tot 60mm' },
        { label: 'Afwerking', value: 'Glad / Gegroefd (6mm tot 20mm)' },
        { label: 'Houtsoort', value: 'Gestoomd of ongestoomd beuken' },
      ],
      tag: 'Pluggen',
    },
    {
      id: 'planed',
      category: 'planed',
      name: 'Vierzijdig Geschaafd Timmerhout',
      description: 'Geschaafd tot op de millimeter nauwkeurig. Leverbaar in diverse rechthoekige en vierkante secties, gekalibreerd voor timmerfabrieken en de meubelindustrie.',
      image: '/images/planed_wood.png',
      link: '/four-sides-planed',
      specs: [
        { label: 'Secties', value: 'Vierkant & Rechthoekig' },
        { label: 'Randen', value: 'Scherp, Radius 3 of Radius 6' },
        { label: 'Vochtigheid', value: 'Oven-gedroogd tot 8-12%' },
      ],
      tag: 'Geschaafd',
    },
    {
      id: 'profiles',
      category: 'profiles',
      name: 'Houten Profielen & Sierlijsten',
      description: 'Groot assortiment decoratieve lijsten, plinten en profielen voor interieurafwerking en meubelproductie. Maatwerk profielen mogelijk op aanvraag.',
      image: '/images/profiles.png',
      link: '/profiles',
      specs: [
        { label: 'Vormen', value: 'Halfrond, Kwartrond, Plinten' },
        { label: 'Maatwerk', value: 'Hoekprofielen, schroefdraad, inkepingen' },
        { label: 'Retail', value: 'EAN barcode labeling mogelijk' },
      ],
      tag: 'Profielen',
    },
    {
      id: 'specials',
      category: 'specials',
      name: 'Speciale Componenten & Halffabrikaten',
      description: 'Halffabrikaten en op maat gemaakte houten onderdelen voor meubels, keukengerei, speelgoed en specifieke industriële toepassingen.',
      image: '/images/specials.png',
      link: '/specials',
      specs: [
        { label: 'Toepassingen', value: 'Meubelindustrie / Keukengerei / DHZ' },
        { label: 'FSC Gecertificeerd', value: 'Leverbaar op aanvraag' },
        { label: 'Verpakking', value: 'Bulk of op maat verpakt' },
      ],
      tag: 'Specials',
    },
  ];

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category === activeFilter);

  const handleDownloadBrochure = (e) => {
    e.preventDefault();
    alert('Palrom Products Corporate Brochure download gestart (Voorbeeld).');
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <span className="hero-badge animate-fade-in">FSC®-Gecertificeerde Houtindustrie</span>
          <h1 className="hero-title animate-slide-up">
            Fabrikant van beukenhouten pluggen en profielen
          </h1>
          <p className="hero-subtitle animate-slide-up-delay">
            Palrom Products combineert decennia aan ervaring met een moderne houtzagerij en droogkamers. Wij leveren hoogwaardige beukenhouten pluggen, profielen en geschaafde meubelcomponenten rechtstreeks aan de internationale meubel- en houtindustrie.
          </p>
          <div className="hero-buttons animate-slide-up-delay-2">
            <Link href="/configurator" className="btn btn-primary">
              Vraag direct een offerte aan
            </Link>
            <Link href="/products" className="btn btn-secondary">
              Bekijk Producten
            </Link>
          </div>
        </div>

        {/* Hiring Stamp on Hero Photo */}
        <Link href="/careers" className="hiring-stamp-hero" title="We zoeken versterking! Bekijk onze vacatures">
          <img src="/images/hiring_stamp.png" alt="Vacatures bij Palrom Products - Solliciteer nu" />
        </Link>

        <div className="scroll-indicator">
          <span>Scroll naar beneden</span>
          <i className="fa-solid fa-chevron-down scroll-arrow"></i>
        </div>
      </section>

      {/* Introduction & Values Section */}
      <section className="intro-section section-padding">
        <div className="container">
          <div className="grid grid-2">
            <div className="intro-text-column animate-on-scroll">
              <span className="section-badge">Welkom bij PALROM</span>
              <h2 className="section-title">FSC®-Gecertificeerd Beukenhout</h2>
              <p className="section-description">
                Gevestigd in de bosrijke regio Brad (Hunedoara, Roemenië) beheert{' '}
                <strong>Palrom Products SRL</strong> een geavanceerde houtzagerij, moderne droogkamers en een professionele schaverij. Wij leveren hoogwaardig timmerhout en meubelcomponenten rechtstreeks vanaf de bron.
              </p>
              <p className="section-description">
                Dankzij onze verticale integratie controleren we het volledige productieproces. We oogsten lokaal FSC®-gecertificeerd beukenhout, verwerken het met precisie, drogen het tot het optimale vochtpercentage en schaven het volgens de exacte specificaties van onze B2B-klanten in de Europese houtindustrie.
              </p>
              <div className="intro-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-tree"></i>
                  </div>
                  <div>
                    <h4>100% Duurzaam</h4>
                    <p>
                      Ons beukenhout is 100% FSC®-gecertificeerd en afkomstig uit verantwoord beheerde lokale bossen.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h4>Maatwerk Componenten</h4>
                    <p>
                      Zagen, drogen, schaven en profileren gebeurt volledig volgens uw gewenste afmetingen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-image-column animate-on-scroll">
              <div className="image-wrapper-decorative">
                <img
                  src="/images/sawmill.png"
                  alt="Geautomatiseerde houtverwerking Palrom"
                  className="img-responsive rounded-lg shadow-lg"
                />
                <div className="stats-badge">
                  <span className="stat-number">25+</span>
                  <span className="stat-text">Jaar Ervaring</span>
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
            <span className="section-badge">Waarom PALROM?</span>
            <h2 className="section-title">Grootschalige Production & Maatwerk</h2>
            <p className="section-subtitle">
              Wij leveren niet alleen timmerhout; we ontwerpen maatwerkoplossingen die het rendement verhogen en productiekosten verlagen voor meubelfabrikanten en houtbewerkers.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <h3>Moderne Droogkamers</h3>
              <p>
                Onze droogcapaciteit garandeert een stabiel vochtpercentage van 8-12%, wat kromtrekken of scheuren in uw meubelcomponenten voorkomt.
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-tag"></i>
              </div>
              <h3>Retail-Ready Labeling</h3>
              <p>
                Voor DHZ-markten leveren we individueel gelabelde bundels met EAN-barcodes en op maat gemaakte verpakkingen.
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>Internationale Logistiek</h3>
              <p>
                Export naar Duitsland, Frankrijk, Oostenrijk en Japan. Inclusief B2B-distributie en opslag via Van Soest International in Nederland.
              </p>
            </div>
          </div>

          <div className="brochure-download-container animate-on-scroll">
            <div className="brochure-content">
              <i className="fa-solid fa-file-pdf pdf-large-icon"></i>
              <div>
                <h3>Technische afmetingen en specificaties inzien?</h3>
                <p>
                  Download onze officiële productbrochure met maattabellen, kwaliteitsklassen en verpakkingsopties.
                </p>
              </div>
            </div>
            <a href="#" className="btn btn-dark" onClick={handleDownloadBrochure}>
              <i className="fa-solid fa-download icon-left"></i> Download Productbrochure
            </a>
          </div>
        </div>
      </section>

      {/* Products Catalogue Section */}
      <section id="products" className="products-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="section-badge">Productassortiment</span>
            <h2 className="section-title">Beuken Pluggen & Meubelcomponenten</h2>
            <p className="section-subtitle">
              Ontdek onze kernproducten, met uiterste precisie vervaardigd uit FSC®-gecertificeerd Roemeens beukenhout.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="product-filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Alles
            </button>
            <button
              className={`filter-btn ${activeFilter === 'dowels' ? 'active' : ''}`}
              onClick={() => setActiveFilter('dowels')}
            >
              Beukenhouten Pluggen
            </button>
            <button
              className={`filter-btn ${activeFilter === 'planed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('planed')}
            >
              Vierzijdig Geschaafd
            </button>
            <button
              className={`filter-btn ${activeFilter === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveFilter('profiles')}
            >
              Houten Profielen
            </button>
            <button
              className={`filter-btn ${activeFilter === 'specials' ? 'active' : ''}`}
              onClick={() => setActiveFilter('specials')}
            >
              Speciale Componenten
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
                    {activeFilter === 'all' ? `Ontdek ${p.name.split(' ')[0]}` : 'Bekijk details'}{' '}
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
