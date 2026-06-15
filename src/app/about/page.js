'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';

export default function About() {
  const timelineEvents = [
    {
      year: '1999',
      title: 'Founding & Vision',
      description:
        'Dutch investor Mr. Ernst Willemstein establishes Palrom Products SRL in Brad, Romania, choosing the site due to the high abundance and superior quality of surrounding beech forests. Initial land acquisitions and primary electrical and water utilities setup are completed.',
      align: 'left',
    },
    {
      year: '2001',
      title: 'Production Launch',
      description:
        'The sawmill is completed and primary processing operations kick off. The company implements its first automated planing and cutting machinery, hiring local woodcraft experts to supervise production lines.',
      align: 'right',
    },
    {
      year: '2010',
      title: 'FSC® Certification',
      description:
        'To support global supply chains and demonstrate environmental responsibility, Palrom adopts sustainable practices, receiving full FSC® Chain of Custody Certification. Sales expand into Japanese and Arabic carpentry markets.',
      align: 'left',
    },
    {
      year: '2021',
      title: 'Facility Expansion',
      description:
        'Palrom modernizes its yard, adding 7,000 square meters of concrete sorting areas and upgrading drying kiln software. A brand-new storage depot is developed in Brad to support growing export volumes.',
      align: 'right',
    },
    {
      year: 'Present',
      title: 'A Multinational Partner',
      description:
        'Operating as a key vendor to major European furniture components retailers, with central logistics managed in collaboration with Van Soest International in the Netherlands.',
      align: 'left',
    },
  ];

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>Company Profile</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Corporate Identity & Values</h1>
          <p>
            Direct from the source: Quality, reliability, and precision beechwood manufacturing from
            Hunedoara County, Romania.
          </p>
        </div>
      </section>

      {/* Company Profile & Environmental Commitment Section */}
      <section id="about-details" className="about-section section-padding bg-dark text-light">
        <div className="container">
          <div className="grid grid-2 align-items-center">
            <div className="about-image-column animate-on-scroll">
              <div className="image-stack">
                <img
                  src="/images/hero_bg.jpg"
                  alt="Aerial view of Palrom Products Brad sawmill facilities"
                  className="img-responsive rounded-lg shadow-lg"
                />
                <div className="about-floating-card">
                  <i className="fa-solid fa-leaf text-accent"></i>
                  <p>
                    We process 100% FSC® certified timber out of respect for our environment and
                    future generations.
                  </p>
                </div>
              </div>
            </div>
            <div className="about-text-column animate-on-scroll">
              <span className="section-badge badge-accent">Our Identity</span>
              <h2 className="section-title text-white">Who We Are</h2>
              <p className="lead">
                &quot;We are a multinational firm, tailor-making our products to fit our clients&apos;
                requirements.&quot;
              </p>
              <p>
                Founded in 1999, Palrom Products SRL has expanded its reach across the European
                continent. Our timber is harvested in sustainable forests surrounding our sawmill in
                Hunedoara county, allowing us to maintain a low carbon footprint for transport.
              </p>
              <p>
                Whether we are supplying custom furniture rails to cabinet makers in Germany, or
                retail-labeled beech dowels to DIY hypermarkets in France and Poland, our core value
                remains the same: <strong>uncompromising precision and ecological stewardship</strong>.
              </p>

              <div className="about-quote">
                <p className="quote-text">
                  &quot;We invite you to challenge us to find the solutions that will help your business
                  succeed.&quot;
                </p>
                <div className="quote-author">
                  <strong>Gabriela Cioara</strong>
                  <span>General Manager, Palrom Products SRL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PALROM Section */}
      <section className="why-us-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="section-badge">Why Choose PALROM?</span>
            <h2 className="section-title">High Capacity, Customized Execution</h2>
            <p className="section-subtitle">
              We don&apos;t just supply wood; we tailor solutions that increase yield and lower
              fabrication costs for your carpentry and manufacturing projects.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <h3>Massive Drying Capacity</h3>
              <p>
                Our modern kiln drying facilities guarantee stable moisture levels, preventing warping
                or splitting in furniture manufacturing.
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-tag"></i>
              </div>
              <h3>Retail-Ready Options</h3>
              <p>
                For Do-It-Yourself markets, we provide individual EAN barcode labeling and
                retail-ready bundles and custom packaging.
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>Multinational Reach</h3>
              <p>
                Serving clients in Germany, France, Austria, Poland, and Japan, with dedicated
                warehousing via Van Soest International in the Netherlands.
              </p>
            </div>
          </div>

          <div className="brochure-download-container animate-on-scroll">
            <div className="brochure-content">
              <i className="fa-solid fa-file-pdf pdf-large-icon"></i>
              <div>
                <h3>Interested in our technical dimensions and specifications?</h3>
                <p>
                  Download our official corporate brochure including all sizing tables, packaging
                  configurations, and grades.
                </p>
              </div>
            </div>
            <a
              href="#"
              className="btn btn-dark"
              onClick={(e) => {
                e.preventDefault();
                alert('Palrom Products Corporate Brochure download started (Sample Simulation).');
              }}
            >
              <i className="fa-solid fa-download icon-left"></i> Download Brochure
            </a>
          </div>
        </div>
      </section>

      {/* Interactive History Timeline Section */}
      <section id="timeline-details" className="timeline-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">Company Journey</span>
            <h2 className="section-title">Milestones of Growth</h2>
            <p className="section-subtitle">
              Follow our timeline to see how Palrom Products grew from a greenfield facility to an
              international beechwood manufacturer.
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>

            {timelineEvents.map((evt, i) => (
              <div key={i} className={`timeline-item animate-on-scroll ${evt.align}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content-card">
                  <span className="timeline-year">{evt.year}</span>
                  <h3>{evt.title}</h3>
                  <p>{evt.description}</p>
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
