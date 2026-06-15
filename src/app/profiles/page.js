'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Profiles() {
  const { addToCart, setIsCartOpen } = useInquiry();

  const profileProducts = [
    {
      id: 'profile-semiround',
      name: 'Semiround Profile',
      description: 'Perfectly rounded convex mouldings used as decorative cover strips, cabinet edging, and custom furniture embellishments. Delivers a soft, clean border.',
      image: '/images/profile1.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-strip',
      name: 'Profile Strip',
      description: 'Straight, thin flat wood strip profiles. Commonly utilized as cover mouldings, panel framing, or simple gap covers in interior finish carpentry.',
      image: '/images/profile2.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-finish-v1',
      name: 'Profile Finishing (Variant 1)',
      description: 'Specialty decorative finishing moulding with elegant curvature. Designed for transition joints between walls, ceilings, or furniture cabinets.',
      image: '/images/profile3.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-quarter-v1',
      name: 'Profile Quarter Round (Variant 1)',
      description: 'Classic 90-degree curved quarter-round profile, perfect for baseboard floor gaps, inside corner joints, and decorative carpentry casing.',
      image: '/images/profile4.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-finish-v2',
      name: 'Profile Finishing (Variant 2)',
      description: 'Alternate decorative border profile showing double-stepped details. Adds depth and a premium look to wood frames and door casings.',
      image: '/images/profile5.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-plinth-v1',
      name: 'Profile Plinth (Variant 1)',
      description: 'Standard plinth profile used as a robust wall-to-floor baseboard trim. Protects walls while creating an elegant wood border accent.',
      image: '/images/profile6.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-corner-v1',
      name: 'Profile Corner (Variant 1)',
      description: 'L-shaped outside corner moulding. Provides protective cover and high durability to vulnerable wall edges or cabinetry corners.',
      image: '/images/profile7.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-corner-v2',
      name: 'Profile Corner (Variant 2)',
      description: 'L-shaped corner cover showcasing subtle edge rounding. Provides a smooth, safe external edge corner for wood claddings.',
      image: '/images/profile8.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-triangular',
      name: 'Profile Triangular',
      description: 'Clean, triangular corner-block profiles. Typically used for internal support framing, concrete chamfering, or sharp inside corner decorations.',
      image: '/images/profile9.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-quarter-v2',
      name: 'Profile Quarter Round (Variant 2)',
      description: 'Larger format quarter-round wood trim designed to cover flooring transitions and floor expansion gaps with a smooth radius look.',
      image: '/images/profile10.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-thread',
      name: 'Profile Thread',
      description: 'Specialty grooved or threaded moulding strip profile. Tailored for decorative cabinetry rails and sliding track accents.',
      image: '/images/profile11.jpg',
      category: 'Profiles & Mouldings',
    },
    {
      id: 'profile-calbat',
      name: 'Profile Calbat',
      description: 'Unique concave-carved cove moulding profile. Replicates historic moldings to add classic styling to high-end furniture and ceiling transitions.',
      image: '/images/profile12.jpg',
      category: 'Profiles & Mouldings',
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
            <Link href="/">Home</Link> / <Link href="/products">Our Products</Link> / <span>Profiles & Mouldings</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Profiles & Mouldings</h1>
          <p>
            PALROM Products designs and manufactures an extensive catalogue of beechwood architectural profiles and mouldings. Precision-milled to achieve a perfect, smooth surface, our mouldings are ideal for cabinetry trim, flooring finishes, and wall decoration.
          </p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> FSC® Certified Available On Request
          </span>
        </div>
      </section>

      {/* Profiles Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {profileProducts.map((p) => (
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
