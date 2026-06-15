'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ApplyFormContent() {
  const searchParams = useSearchParams();
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { text, type }
  
  const fileInputRef = useRef(null);

  // Set position based on URL param
  useEffect(() => {
    const jobParam = searchParams.get('job');
    if (jobParam) {
      const validJobs = {
        planing: 'planing_operator',
        quality: 'quality_inspector',
        logistics: 'logistics_coordinator',
        maintenance: 'maintenance_mechanic',
      };
      if (validJobs[jobParam]) {
        setPosition(validJobs[jobParam]);
      }
    }
  }, [searchParams]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    const ext = file.name.split('.').pop().toLowerCase();
    const isAllowedExt = ['pdf', 'doc', 'docx'].includes(ext);

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      setFeedback({
        text: 'Invalid file type. Please upload a PDF, DOC, or DOCX document.',
        type: 'error',
      });
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setFeedback({
        text: 'File size exceeds the 5MB limit.',
        type: 'error',
      });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFeedback(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !position || !message.trim()) {
      setFeedback({ text: 'Please fill out all required fields.', type: 'error' });
      return;
    }

    if (!selectedFile) {
      setFeedback({ text: 'Please upload your CV / Resume to proceed.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate upload / submit (1.8s)
    setTimeout(() => {
      setIsSubmitting(false);

      const jobNames = {
        planing_operator: 'Planing Machine Operator',
        quality_inspector: 'Quality & Defect Inspector',
        logistics_coordinator: 'Logistics & Inventory Coordinator',
        maintenance_mechanic: 'Maintenance Mechanic / Millwright',
        general_application: 'General Job Application',
      };
      
      const formattedJobName = jobNames[position] || position;

      setFeedback({
        text: `Thank you, ${name}! Your application for the "${formattedJobName}" position and your resume (${selectedFile.name}) have been successfully received by Anca Mihuț. We will review it and contact you at ${email} or ${phone} within 2 days.`,
        type: 'success',
      });

      // Clear states
      setName('');
      setEmail('');
      setPhone('');
      setPosition('');
      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1800);
  };

  return (
    <div className="apply-form-container">
      {/* Quick Chat Card */}
      <div className="quick-chat-card animate-on-scroll">
        <div className="quick-chat-content">
          <i className="fa-brands fa-whatsapp quick-chat-icon"></i>
          <div>
            <h3>Prefer a quick chat first?</h3>
            <p>
              Connect directly with Anca on WhatsApp to ask questions about the roles, working
              conditions, or benefits in Brad.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/40254606053?text=Hi%20Anca,%20I'm%20interested%20in%20a%20career%20at%20Palrom"
          target="_blank"
          rel="noopener noreferrer"
          className="chat-now-btn"
        >
          <i className="fa-brands fa-whatsapp"></i> Chat with Anca
        </a>
      </div>

      <div className="apply-form-card animate-on-scroll">
        <h3>Job Application Form</h3>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="apply_name">Your Name *</label>
              <input
                type="text"
                id="apply_name"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apply_email">Email Address *</label>
              <input
                type="email"
                id="apply_email"
                required
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="apply_phone">Phone Number *</label>
              <input
                type="tel"
                id="apply_phone"
                required
                placeholder="+40 700 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apply_job_type">Position Applied For *</label>
              <select
                id="apply_job_type"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="" disabled>
                  Select a position
                </option>
                <option value="planing_operator">Planing Machine Operator</option>
                <option value="quality_inspector">Quality & Defect Inspector</option>
                <option value="logistics_coordinator">Logistics & Inventory Coordinator</option>
                <option value="maintenance_mechanic">Maintenance Mechanic / Millwright</option>
                <option value="general_application">General Job Application</option>
              </select>
            </div>
          </div>

          {/* Resume Upload Dropzone */}
          <div className="form-group">
            <label>Upload Your CV / Resume *</label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <div
              className={`dropzone-area ${dragActive ? 'dragover' : ''} ${
                selectedFile ? 'has-file' : ''
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileBrowser}
              style={{ cursor: 'pointer' }}
            >
              <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
              <span className="dropzone-text">Drag & Drop your CV here, or click to browse</span>
              <span className="dropzone-subtext">
                Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
              </span>

              {selectedFile && (
                <div className="file-info-badge">
                  <i className="fa-solid fa-file-pdf"></i>
                  <span id="fileName">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    title="Remove file"
                    onClick={handleRemoveFile}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="apply_message">Cover Letter / Message Details *</label>
            <textarea
              id="apply_message"
              rows="6"
              required
              placeholder="Tell us about your background, years of woodworking or industrial experience, and why you want to work at PALROM..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin icon-left"></i> Submitting application...
              </>
            ) : (
              <>
                Submit Application <i className="fa-solid fa-paper-plane icon-right"></i>
              </>
            )}
          </button>
        </form>

        {feedback && <div className={`form-feedback ${feedback.type}`}>{feedback.text}</div>}
      </div>
    </div>
  );
}

export default function Apply() {
  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/careers">Careers</Link> / <span>Apply Now</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Apply Now</h1>
          <p>Ready to join our team? Submit your application details and resume below.</p>
        </div>
      </section>

      {/* HR Welcome Section */}
      <section className="hr-welcome-section section-padding">
        <div className="container">
          <div className="hr-welcome-grid">
            <div className="hr-image-wrapper animate-on-scroll">
              <img src="/images/anca_apply.png" alt="Anca Mihuț - PALROM Products HR Coordinator" />
            </div>
            <div className="hr-welcome-text animate-on-scroll">
              <h2>Meet Your HR Representative</h2>
              <p className="quote-lead">
                &quot;Welcome to PALROM Products! We believe that the key to our sustainable, premium
                woodworking is our dedicated team in Brad.&quot;
              </p>
              <p>
                I&apos;m <strong>Anca Mihuț</strong>, HR Coordinator at PALROM. We are committed to
                providing a stable, high-safety, and supportive working environment for our machine
                operators, quality inspectors, mechanics, and logistics handlers.
              </p>
              <p>
                Please complete the application form below and upload your CV (PDF or Word format).
                Once submitted, I will personally review your profile and get back to you within 2
                working days to schedule a chat.
              </p>

              <div className="hr-signoff">
                <strong>Anca Mihuț</strong>
                <span>Human Resources Coordinator, PALROM Products SRL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="apply-form-section section-padding">
        <div className="container">
          <Suspense fallback={<div>Loading application details...</div>}>
            <ApplyFormContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
