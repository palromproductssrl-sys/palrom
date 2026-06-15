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
      name: 'Beechwood Dowels & Pins',
      description: 'Available in diameters from 3 mm to 60 mm. Choose between smooth wooden pins or spiral grooved dowels for optimal glue adhesion.',
      image: '/images/dowels.png',
      link: '/dowels',
      specs: [
        { label: 'Diameter', value: '3mm to 60mm' },
        { label: 'Finish', value: 'Smooth / Grooved (6mm to 20mm)' },
        { label: 'Wood Type', value: 'Steamed or unsteamed beech' },
      ],
      tag: 'Dowels',
    },
    {
      id: 'planed',
      category: 'planed',
      name: 'Four-Sides Planed Timber',
      description: 'Planed to millimeter precision. Available in various rectangular and square sections, calibrated for joinery factories and the furniture industry.',
      image: '/images/planed_wood.png',
      link: '/four-sides-planed',
      specs: [
        { label: 'Sections', value: 'Square & Rectangular' },
        { label: 'Edges', value: 'Sharp, Radius 3 or Radius 6' },
        { label: 'Moisture', value: 'Kiln-dried to 8-12%' },
      ],
      tag: 'Planed',
    },
    {
      id: 'profiles',
      category: 'profiles',
      name: 'Wooden Profiles & Mouldings',
      description: 'Large assortment of decorative mouldings, skirtings, and profiles for interior finishing and furniture production. Custom profiles available upon request.',
      image: '/images/profiles.png',
      link: '/profiles',
      specs: [
        { label: 'Shapes', value: 'Half-round, Quarter-round, Skirtings' },
        { label: 'Customization', value: 'Corner profiles, threading, notches' },
        { label: 'Retail', value: 'EAN barcode labeling available' },
      ],
      tag: 'Profiles',
    },
    {
      id: 'specials',
      category: 'specials',
      name: 'Special Components & Semi-Finished Products',
      description: 'Semi-finished and custom-made wooden parts for furniture, kitchen utensils, toys, and specific industrial applications.',
      image: '/images/specials.png',
      link: '/specials',
      specs: [
        { label: 'Applications', value: 'Furniture industry / Kitchen utensils / DIY' },
        { label: 'FSC Certified', value: 'Available upon request' },
        { label: 'Packaging', value: 'Bulk or custom packaged' },
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
    alert('Palrom Products Corporate Brochure download started (Sample).');
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <span className="hero-badge animate-fade-in">FSC®-Certified Wood Industry</span>
          <h1 className="hero-title animate-slide-up">
            Manufacturer of Beechwood Dowels and Profiles
          </h1>
          <p className="hero-subtitle animate-slide-up-delay">
            Palrom Products combines decades of experience with a modern sawmill and drying kilns. We supply high-quality beechwood dowels, profiles, and planed furniture components directly to the international furniture and wood industry.
          </p>
          <div className="hero-buttons animate-slide-up-delay-2">
            <Link href="/configurator" className="btn btn-primary">
              Request a Quote
            </Link>
            <Link href="/products" className="btn btn-secondary">
              View Products
            </Link>
          </div>
        </div>

        {/* Hiring Stamp on Hero Photo */}
        <Link href="/careers" className="hiring-stamp-hero" title="We are hiring! View our vacancies">
          <img src="/images/hiring_stamp.png" alt="Vacancies at Palrom Products - Apply now" />
        </Link>

        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <i className="fa-solid fa-chevron-down scroll-arrow"></i>
        </div>
      </section>

      {/* Introduction & Values Section */}
      <section className="intro-section section-padding">
        <div className="container">
          <div className="grid grid-2">
            <div className="intro-text-column animate-on-scroll">
              <span className="section-badge">Welcome to PALROM</span>
              <h2 className="section-title">FSC®-Certified Beechwood</h2>
              <p className="section-description">
                Based in the forested region of Brad (Hunedoara, Romania),{' '}
                <strong>Palrom Products SRL</strong> operates an advanced sawmill, modern drying kilns, and a professional planing mill. We deliver high-quality lumber and furniture components directly from the source.
              </p>
              <p className="section-description">
                Thanks to our vertical integration, we control the entire production process. We harvest local FSC®-certified beechwood, process it with precision, dry it to the optimal moisture content, and plane it according to the exact specifications of our B2B customers in the European wood industry.
              </p>
              <div className="intro-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-tree"></i>
                  </div>
                  <div>
                    <h4>100% Sustainable</h4>
                    <p>
                      Our beechwood is 100% FSC®-certified and sourced from responsibly managed local forests.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h4>Custom Components</h4>
                    <p>
                      Sawing, drying, planing, and profiling are done entirely according to your desired dimensions.
                    </p>
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
                  <span className="stat-text">Years Experience</span>
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
            <span className="section-badge">Why PALROM?</span>
            <h2 className="section-title">Large-Scale Production & Customization</h2>
            <p className="section-subtitle">
              We do not just deliver timber; we design custom solutions that increase yield and lower production costs for furniture manufacturers and woodworkers.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <h3>Modern Drying Kilns</h3>
              <p>
                Our drying capacity guarantees a stable moisture content of 8-12%, preventing warping or cracking in your furniture components.
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-tag"></i>
              </div>
              <h3>Retail-Ready Labeling</h3>
              <p>
                For DIY markets, we deliver individually labeled bundles with EAN barcodes and custom packaging.
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>International Logistics</h3>
              <p>
                Export to Germany, France, Austria, and Japan. Including B2B distribution and warehousing via Van Soest International in the Netherlands.
              </p>
            </div>
          </div>

          <div className="brochure-download-container animate-on-scroll">
            <div className="brochure-content">
              <i className="fa-solid fa-file-pdf pdf-large-icon"></i>
              <div>
                <h3>Want to view technical dimensions and specifications?</h3>
                <p>
                  Download our official product brochure with size tables, quality grades, and packaging options.
                </p>
              </div>
            </div>
            <a href="#" className="btn btn-dark" onClick={handleDownloadBrochure}>
              <i className="fa-solid fa-download icon-left"></i> Download Product Brochure
            </a>
          </div>
        </div>
      </section>

      {/* Products Catalogue Section */}
      <section id="products" className="products-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="section-badge">Product Range</span>
            <h2 className="section-title">Beech Dowels & Furniture Components</h2>
            <p className="section-subtitle">
              Discover our core products, crafted with extreme precision from FSC®-certified Romanian beechwood.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="product-filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${activeFilter === 'dowels' ? 'active' : ''}`}
              onClick={() => setActiveFilter('dowels')}
            >
              Beechwood Dowels
            </button>
            <button
              className={`filter-btn ${activeFilter === 'planed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('planed')}
            >
              Four-Sides Planed
            </button>
            <button
              className={`filter-btn ${activeFilter === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveFilter('profiles')}
            >
              Wooden Profiles
            </button>
            <button
              className={`filter-btn ${activeFilter === 'specials' ? 'active' : ''}`}
              onClick={() => setActiveFilter('specials')}
            >
              Special Components
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
                    {activeFilter === 'all' ? `Discover ${p.tag}` : 'View details'}{' '}
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
