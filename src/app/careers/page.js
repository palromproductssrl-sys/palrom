'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';

export default function Careers() {
  const jobs = [
    {
      id: 'planing',
      title: 'Planing Machine Operator',
      department: 'Production',
      location: 'Brad, RO',
      type: 'Full-Time',
      description: 'Responsible for setting up, calibrating, and feeding our high-speed profiling and wood planing machines to shape raw beechwood boards into premium dowels and architectural mouldings.',
      requirements: [
        'Prior experience in wood processing or sawmill machine operation is highly valued.',
        'High attention to detail and dimensional accuracy (using calipers).',
        'Understanding of industrial safety guidelines and equipment maintenance.',
      ],
      salary: 'Competitive Pay + Bonus',
    },
    {
      id: 'quality',
      title: 'Quality & Defect Inspector',
      department: 'Quality Control',
      location: 'Brad, RO',
      type: 'Full-Time',
      description: 'Visual and physical inspection of finished wood dowels, boards, and custom furniture elements. Sort out natural knots, splits, and grading anomalies to ensure client specifications are met.',
      requirements: [
        'Strong observation skills and familiarity with standard timber grades (A, B, C).',
        'Reliability, patience, and ability to document defect logs.',
        'FSC® chain-of-custody documentation training is a plus (provided in-house).',
      ],
      salary: 'Stable Salary + Safety Bonus',
    },
    {
      id: 'logistics',
      title: 'Logistics & Inventory Coordinator',
      department: 'Administration',
      location: 'Brad, RO',
      type: 'Full-Time',
      description: 'Coordinate domestic transport and European export shipping (primarily to our central Dutch warehouse partner). Manage wood inventory levels, drying kiln records, and loading manifests.',
      requirements: [
        'Experience in warehouse management, shipping paperwork, or transportation planning.',
        'Basic computer skills (Excel/Word) and familiarity with logistics software.',
        'Conversational Romanian & basic English for international logistics communication.',
      ],
      salary: 'Attractive Salary Package',
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mechanic / Millwright',
      department: 'Maintenance',
      location: 'Brad, RO',
      type: 'Full-Time',
      description: 'Perform mechanical preventive maintenance and emergency troubleshooting on our automated kiln systems, sawmill blades, dust extraction blowers, and profiling machinery.',
      requirements: [
        'Professional qualification as a mechanical technician, fitter, or millwright.',
        'Experience repairing bearings, gearboxes, belts, and hydraulic cylinders.',
        'Ability to read technical layouts and troubleshoot machine breakdowns.',
      ],
      salary: 'Top-Tier Salary + Overtime',
    },
  ];

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>Careers</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Careers at PALROM</h1>
          <p>
            Shape your future with a stable, sustainable leader in hardwood lumber and beechwood manufacturing in Brad, Romania.
          </p>
        </div>

        {/* Hiring Stamp on Hero */}
        <a href="#positions" className="hiring-stamp-hero" title="View our open positions!">
          <img src="/images/hiring_stamp.png" alt="We are Hiring Stamp" />
        </a>
      </section>

      {/* Careers Info & Benefits Section */}
      <section className="careers-info-section section-padding bg-dark text-light">
        <div className="container">
          <div className="careers-info-grid">
            <div className="animate-on-scroll">
              <span className="section-badge badge-accent">Work With Us</span>
              <h2 className="section-title text-white">Why Join the PALROM Team?</h2>
              <p className="lead">
                For over 25 years, Palrom Products SRL has been a cornerstone of manufacturing stability in Hunedoara County. We offer more than just a job – we build lifelong carpentry and industrial professions.
              </p>
              <p>
                At our sawmill and planing shop in Brad, we combine traditional wood craftsmanship with modern automation. We operate under strict FSC® ecological principles, respecting the forests around us and the safety of our operators.
              </p>
            </div>
            <div className="animate-on-scroll">
              <div className="careers-benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Competitive Salary</h4>
                    <p>
                      Fair compensation reflecting your experience, plus bonuses for efficiency and safety.
                    </p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Safe Work Environment</h4>
                    <p>
                      Top-tier machinery safeguards, clean workshops, and certified protective equipment.
                    </p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-bus"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Transport Support</h4>
                    <p>
                      Daily transportation allowances or organized shuttle options for employees from surrounding areas.
                    </p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Professional Training</h4>
                    <p>
                      Learn machine calibration, sawmill operation, and timber grading from industry experts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="jobs-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">Active Openings</span>
            <h2 className="section-title">Open Positions at Brad Factory</h2>
            <p className="section-subtitle">
              We are looking for dedicated professionals to join our production, quality, and shipping departments. Apply directly below.
            </p>
          </div>

          <div className="jobs-grid">
            {jobs.map((job) => (
              <div className="job-card animate-on-scroll" key={job.id}>
                <div className="job-header">
                  <div className="job-title-area">
                    <h3>{job.title}</h3>
                    <div className="job-tags">
                      <span className="job-tag tag-dept">{job.department}</span>
                      <span className="job-tag tag-loc">{job.location}</span>
                      <span className="job-tag tag-type">{job.type}</span>
                    </div>
                  </div>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="job-requirements">
                  <h4>Key Requirements</h4>
                  <ul>
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="job-footer">
                  <span className="job-salary">{job.salary}</span>
                  <Link href={`/apply?job=${job.id}`} className="btn btn-dark btn-sm">
                    Apply Now
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
