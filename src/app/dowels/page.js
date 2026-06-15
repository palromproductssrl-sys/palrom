'use client';

import React from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Dowels() {
  const { addToCart, setIsCartOpen } = useInquiry();

  const dowelProducts = [
    {
      id: 'dowel-small',
      name: 'Small Size (3 mm and up)',
      description: 'Our smallest calibrated dowel pins are designed for delicate joinery, architectural models, and craft projects. Despite their small diameter, they offer high structural density and stability.',
      image: '/images/dowelssmall-1.jpg',
      category: 'Dowels',
    },
    {
      id: 'dowel-medium-sticks',
      name: 'Sticks Small to Medium',
      description: 'Ideal dowel rods for standard carpentry applications, toys manufacturing, and general furniture assembly. Calibrated precisely to eliminate diameter variations.',
      image: '/images/dowelsmedium.jpg',
      category: 'Dowels',
    },
    {
      id: 'dowel-medium',
      name: 'Medium Size Dowel Rods',
      description: 'Dowel rods engineered for heavy furniture joints, shelving supports, and framework connections. Steamed beech provides extra dimensional resistance against bending.',
      image: '/images/dowels-medium-2.jpg',
      category: 'Dowels',
    },
    {
      id: 'dowel-big',
      name: 'Big Size (up to 60 mm)',
      description: 'Large-format dowel rods for industrial handles, structural partition columns, and heavy-duty carpentry connections. Available in custom lengths and sizes up to 60 mm.',
      image: '/images/dowelsbig-300x300-1.jpg',
      category: 'Dowels',
    },
    {
      id: 'dowel-rilled',
      name: 'Spiral Rilled Pins (6 to 20 mm)',
      description: 'Specifically grooved for automated furniture production lines. The spiral rills allow for uniform glue distribution, venting compressed air, and ensuring a locked joint.',
      image: '/images/dowelsrilled-300x300-1.jpg',
      category: 'Dowels',
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
            <Link href="/">Home</Link> / <Link href="/products">Our Products</Link> / <span>Beechwood Dowels</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Beechwood Dowels & Rods</h1>
          <p>
            PALROM Products manufactures an extensive range of precision-calibrated beechwood dowels, rods, and pins. Steamed or unsteamed, our dowels are crafted directly from sustainable timber to meet the highest woodworking specifications.
          </p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> FSC® Certified Available On Request
          </span>
        </div>
      </section>

      {/* Dowels Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {dowelProducts.map((p) => (
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
