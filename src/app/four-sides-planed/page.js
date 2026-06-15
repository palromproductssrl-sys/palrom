'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function FourSidesPlaned() {
  const { addToCart, setIsCartOpen } = useInquiry();

  const planedProducts = [
    {
      id: 'planed-rect-v1',
      name: 'Planed Rectangular (Variant 1)',
      description: 'High-tolerance rectangular beech slats and slats, dried to 8-12% moisture. Ideal for manufacturing bed frames, furniture framing, and premium interior trim boards.',
      image: '/images/4sides1.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-rect-v2',
      name: 'Planed Rectangular (Variant 2)',
      description: 'Calibrated beechwood components with sharp 90-degree corners. Tailored for industrial furniture assembly lines, cabinet rails, and architectural partition components.',
      image: '/images/4sides2.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-rect-v3',
      name: 'Planed Rectangular (Variant 3)',
      description: 'Durable, solid beech planed planks prepared for shelving, furniture panels, and heavy-duty carpentry tasks. Completely smooth finish with no fiber tear-out.',
      image: '/images/4sides3.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-rect-v4',
      name: 'Planed Rectangular (Variant 4)',
      description: 'Precisely thicknessed rectangular sections designed for high-end DIY retail packaging. Packaged in customized bundles with individual labeling options.',
      image: '/images/4sides4.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-sq-v1',
      name: 'Planed Square (Variant 1)',
      description: 'Precision-milled square beech wood bars and rods. Designed as blanks for woodturning, stair balusters, table leg manufacturing, and children\'s toys.',
      image: '/images/4sides5.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-sq-v2',
      name: 'Planed Square (Variant 2)',
      description: 'Dense, high-quality Carpathian beech square elements. Free of defects, knot-free quality options, engineered to withstand structural woodworking stresses.',
      image: '/images/4sides6.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-rad3',
      name: 'Planed Elements with Radius 3',
      description: 'Four-sides planed elements featuring a subtle 3 mm rounded edge radius. The soft edges decrease wood splitting risks and improve user handling safety in retail environments.',
      image: '/images/4sides7.jpg',
      category: 'Four-Sides Planed',
    },
    {
      id: 'planed-rad6',
      name: 'Planed Elements with Radius 6',
      description: 'Planed beech components displaying a distinct 6 mm rounded edge radius. Ideal for structural toys, child-friendly furniture components, and pre-finished carpentry parts.',
      image: '/images/4sides8.jpg',
      category: 'Four-Sides Planed',
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
            <Link href="/">Home</Link> / <Link href="/products">Our Products</Link> / <span>4-Sides Planed Lumber</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>4-Sides Planed Beech Lumber</h1>
          <p>
            Our four-sides planed wood elements are processed to extreme tolerances. Sourced from sustainable forest management in the Carpathian region, they are sawn, kiln-dried to 8-12%, cut to length, and calibrated for furniture manufacturers and DIY distributors.
          </p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> FSC® Certified Available On Request
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
