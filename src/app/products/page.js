'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all');

  const productsList = [
    {
      id: 'dowels',
      category: 'dowels',
      name: 'Beechwood Dowel Pins & Rods',
      description: 'Available in small sizes starting at 3 mm up to large dimensions of 60 mm. Options include smooth sticks and spiral-rilled finishes for optimal glue adhesion.',
      image: '/images/dowels.png',
      link: '/dowels',
      specs: [
        { label: 'Diameter', value: '3mm to 60mm' },
        { label: 'Finishes', value: 'Smooth / Rilled (6mm to 20mm)' },
        { label: 'Wood Type', value: 'Steamed or unsteamed beech' },
      ],
      tag: 'Dowels',
    },
    {
      id: 'planed',
      category: 'planed',
      name: '4-Sides Planed Lumber',
      description: 'Planed to extreme tolerances, available in both rectangular and square sections. Sawn, dried, cut to size, and calibrated for DIY distribution and carpentry shops.',
      image: '/images/planed_wood.png',
      link: '/four-sides-planed',
      specs: [
        { label: 'Sections', value: 'Square & Rectangular' },
        { label: 'Edges', value: 'Sharp edge, Radius 3, or Radius 6' },
        { label: 'Moisture', value: 'Kiln dried to 8-12%' },
      ],
      tag: 'Planed',
    },
    {
      id: 'profiles',
      category: 'profiles',
      name: 'Architectural Profiles & Mouldings',
      description: 'An extensive range of decorative mouldings for interior cladding, carpentry finishing, and furniture trims. Custom profile cutting is available for large runs.',
      image: '/images/profiles.png',
      link: '/profiles',
      specs: [
        { label: 'Shapes', value: 'Semiround, Quarter round, Plinth' },
        { label: 'Customization', value: 'Corner profiles, Thread, Calbat' },
        { label: 'Retail', value: 'Pre-labeled with EAN codes' },
      ],
      tag: 'Profiles',
    },
    {
      id: 'specials',
      category: 'specials',
      name: 'Furniture & Food Industry Specials',
      description: 'Custom semi-finished and finished beech wood components for carpentry, cabinet making, children\'s toys, kitchen utensils, and the food packaging industry.',
      image: '/images/specials.png',
      link: '/specials',
      specs: [
        { label: 'Applications', value: 'Carpentry / Food / DIY' },
        { label: 'FSC Certified', value: 'Available on demand' },
        { label: 'Packaging', value: 'Customized bulk or individual' },
      ],
      tag: 'Specials',
    },
  ];

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
            <Link href="/">Home</Link> / <span>Our Products</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Precision Wood Catalogue</h1>
          <p>
            For more than 25 years, PALROM Products has delivered first-grade Romanian beechwood components to carpenters, furniture factories, and DIY retailers worldwide. Explore our directory below to view specific subcategories.
          </p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> FSC® Certified Available On Request
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
              All Products
            </button>
            <button
              className={`filter-btn ${activeFilter === 'dowels' ? 'active' : ''}`}
              onClick={() => setActiveFilter('dowels')}
            >
              Beech Dowels
            </button>
            <button
              className={`filter-btn ${activeFilter === 'planed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('planed')}
            >
              4-Sides Planed
            </button>
            <button
              className={`filter-btn ${activeFilter === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveFilter('profiles')}
            >
              Profiles & Mouldings
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
                    {p.specs.map((spec, idx) => (
                      <li key={idx}>
                        <strong>{spec.label}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.link} className="product-link">
                    Explore Details <i className="fa-solid fa-arrow-right"></i>
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
