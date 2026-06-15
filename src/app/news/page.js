'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';

export default function News() {
  const newsItems = [
    {
      id: 'configurator',
      tag: 'Digitale Bèta',
      tagClass: 'highlight-tag',
      date: '15 juni 2026',
      author: 'IT & Sales Team',
      title: 'Help Ons Testen: De Palrom Offerte Configurator is Live!',
      content: (
        <>
          <p>
            We introduceren met trots de eerste bèta-versie van onze nieuwe B2B-productconfigurator: de{' '}
            <strong>Palrom Offerte Configurator</strong>. Met deze online tool kunnen inkopers en houtspecialisten direct de exacte millimeter-afmetingen, productgroepen (zoals houten staven, geschaafd hout en profielen) en gewenste afwerkingen invoeren voor grote volumebestellingen.
          </p>
          <p className="highlight-text">
            We zijn op zoek naar partners en B2B-klanten die deze configurator willen testen en hun feedback willen delen. Helpt u ons de flow te optimaliseren?
          </p>
          <div className="news-actions">
            <Link href="/configurator" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Start de Palrom Offerte Configurator <i className="fa-solid fa-arrow-right icon-right"></i>
            </Link>
            <span className="badge badge-yellow" style={{ marginLeft: '1rem' }}>Bèta Test</span>
          </div>
        </>
      ),
    },
    {
      id: 'drying',
      tag: 'Production',
      date: 'May 24, 2026',
      author: 'Sawmill Ops',
      title: 'Expansion of Kiln Drying Capacity in Brad',
      content: (
        <>
          <p>
            To meet rising international demand for high-quality FSC-certified beechwood, we have commissioned two new fully-automated drying chambers. This expansion increases our total kiln drying capacity by 15%.
          </p>
          <Link href="/about#timeline-details" className="news-link">
            Read our history <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/kilns_news.jpg',
    },
    {
      id: 'fsc',
      tag: 'Sustainability',
      date: 'April 12, 2026',
      author: 'Ecology Lead',
      title: 'FSC® Chain of Custody Recertified',
      content: (
        <>
          <p>
            Following a comprehensive audit, our 100% FSC® certification for sustainable forest management and processing has been successfully renewed. We guarantee the responsible sourcing of all our beechwood products.
          </p>
          <Link href="/products" className="news-link">
            Explore our products <i className="fa-solid fa-arrow-right"></i>
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
      title: 'Raw Materials Sorting',
      desc: 'Locally sourced sustainable beech wood logs.',
    },
    {
      id: 2,
      image: '/images/2.png',
      title: 'Primary Sawing Operations',
      desc: 'High-tech log breakdown and sawn timber cutting.',
    },
    {
      id: 3,
      image: '/images/3.png',
      title: 'Steaming & Weathering',
      desc: 'Controlled wood steaming for color and stability.',
    },
    {
      id: 4,
      image: '/images/kilns.jpg',
      title: 'Automated Drying Kilns',
      desc: 'Drying timber precisely to 8-12% moisture.',
    },
    {
      id: 5,
      image: '/images/planed_wood.png',
      title: 'Wood Planing Workshop',
      desc: 'Calibrating timber profiles to exact customer tolerances.',
    },
    {
      id: 6,
      image: '/images/dowels.png',
      title: 'Beech Dowel Production',
      desc: 'High capacity rilled and smooth dowel lines.',
    },
    {
      id: 7,
      image: '/images/7.png',
      title: 'Quality Inspection & Sorting',
      desc: 'Rigorous visual check to guarantee premium wood grades.',
    },
    {
      id: 8,
      image: '/images/8.png',
      title: 'Global Logistics Support',
      desc: 'Export-ready packaging and DIY hypermarket bundling.',
    },
  ];

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>News</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>News & Updates</h1>
          <p>
            Stay informed about our latest investments, sustainability achievements, and digital tools like our new B2B configurator.
          </p>
        </div>
      </section>

      {/* News / Updates Section */}
      <section id="news" className="news-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">News & Updates</span>
            <h2 className="section-title">Latest Updates</h2>
            <p className="section-subtitle text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1.1rem', fontWeight: 300 }}>
              Stay up to date with our latest innovations, factory upgrades, and digital tools.
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
            <span className="section-badge">Media Gallery</span>
            <h2 className="section-title">Factory & Production Media</h2>
            <p className="section-subtitle">
              Explore the photos and videos of our sawmill operations and custom manufacturing processes in Brad, Romania.
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
                <h3>Our Milling Process</h3>
                <p>
                  Experience the precision of wood transformation. Our state-of-the-art milling
                  facility combines generations of Romanian craftsmanship with advanced European sawing
                  technologies, calibrating every cut to micron-level perfection for premium, sustainable
                  beechwood components.
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
