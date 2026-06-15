'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Specials() {
  const { addToCart, setIsCartOpen } = useInquiry();

  const specialProducts = [
    {
      id: 'special-keeplat-spruce',
      name: 'Keeplat Spruce',
      description: 'Specially grooved spruce mounting slats and components used in construction framing and high-end timber packaging grids. Highly stable and lightweight.',
      image: '/images/special1.jpg',
      category: 'Special Components',
    },
    {
      id: 'special-keeplat-beech',
      name: 'Keeplat Beech',
      description: 'Durable, solid steamed beechwood keeplats. Offers extreme shear resistance and longevity for heavy-duty industrial framing and custom furniture mounts.',
      image: '/images/special2.jpg',
      category: 'Special Components',
    },
    {
      id: 'special-distancer-mix',
      name: 'Distancers Color Mix',
      description: 'Color-coded wooden separator and distance blocks designed for packaging lines, shipping crates, and organized stock management.',
      image: '/images/special3.jpg',
      category: 'Special Components',
    },
    {
      id: 'special-threshold',
      name: 'Wooden Threshold',
      description: 'Calibrated door thresholds machined from dense beechwood. Provides structural protection and aesthetic transitions between flooring layouts.',
      image: '/images/special4.jpg',
      category: 'Special Components',
    },
    {
      id: 'special-distancer-ind',
      name: 'Industrial Distancer',
      description: 'Solid wood spacer bars and blocks designed for timber drying kilns, logistics stackers, and specialized packaging structures.',
      image: '/images/special5.jpg',
      category: 'Special Components',
    },
    {
      id: 'special-wood-iron',
      name: 'Wood with Iron Component',
      description: 'Composite structural blocks combining seasoned beechwood with integrated steel connectors. Tailored for heavy packaging and machinery mounting crates.',
      image: '/images/special6.jpg',
      category: 'Special Components',
    },
  ];

  const handleAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
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
            <Link href="/">Home</Link> / <Link href="/products">Our Products</Link> / <span>Special Components</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Special Furniture & Wood Elements</h1>
          <p>
            PALROM Products manufactures specialized semi-finished and finished wood parts for the furniture, packaging, and construction industries. From customized keeplats to distancers and wooden thresholds, we engineer bespoke wood solutions to your design.
          </p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> FSC® Certified Available On Request
          </span>
        </div>
      </section>

      {/* Specials Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {specialProducts.map((p) => (
              <div className="detail-card animate-on-scroll" key={p.id}>
                <div className="detail-img-wrapper">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="detail-info">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <button
                    className="detail-cta add-to-inquiry-btn"
                    onClick={() => handleAdd(p)}
                  >
                    Add to Inquiry <i className="fa-solid fa-plus icon-right"></i>
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
