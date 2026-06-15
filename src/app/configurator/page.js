'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Configurator Sizing Rules
const categoryData = {
  pluggen: {
    id: 'pluggen',
    name: 'Beuken Pluggen',
    length: { min: 30, max: 3000, default: 500, label: 'Lengte (mm)' },
    diameter: { min: 3, max: 60, default: 20, label: 'Diameter (mm)' },
    finish: 'Industrieel geschuurd',
  },
  dowels: {
    id: 'dowels',
    name: 'Beukenhouten Dowels & Staven',
    length: { min: 30, max: 3000, default: 1000, label: 'Lengte (mm)' },
    diameter: { min: 3, max: 60, default: 10, label: 'Diameter (mm)' },
    finish: 'Gladgeschaafd',
  },
  planed: {
    id: 'planed',
    name: '4-Zijdig Geschaafd Beukenhout',
    length: { min: 100, max: 4000, default: 2400, label: 'Lengte (mm)' },
    diameter: { min: 15, max: 300, default: 50, label: 'Breedte (mm)' },
    thickness: { min: 10, max: 100, default: 20, label: 'Dikte/Hoogte (mm)' },
    finish: 'Vierzijdig geschaafd',
  },
  profiles: {
    id: 'profiles',
    name: 'Houten Profielen & Lijsten',
    length: { min: 500, max: 3000, default: 2000, label: 'Lengte (mm)' },
    diameter: { min: 10, max: 120, default: 18, label: 'Afmeting (mm)' },
    finish: 'Geprofileerd',
  },
  specials: {
    id: 'specials',
    name: 'Speciale Houtcomponenten',
    length: { min: 50, max: 2000, default: 500, label: 'Lengte (mm)' },
    diameter: { min: 5, max: 500, default: 40, label: 'Breedte (mm)' },
    finish: 'Op specificatie',
  },
};

// Specials prices
const specialsPrices = {
  'Keeplat Spruce': 1.25,
  'Keeplat Beech': 1.55,
  'Distancers Color Mix': 0.85,
  'Wooden Threshold': 3.55,
  'Industrial Distancer': 2.15,
  'Wood with Iron Component': 4.85,
};

function formatEuro(val, decimals = 2) {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export default function Configurator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Configurator states
  const [category, setCategory] = useState('pluggen');
  const [subCategoryDowels, setSubCategoryDowels] = useState('dowel-small');
  const [subCategoryProfiles, setSubCategoryProfiles] = useState('profile-semiround');
  const [subCategorySpecials, setSubCategorySpecials] = useState('special-keeplat-spruce');
  
  const [length, setLength] = useState(500);
  const [diameter, setDiameter] = useState(20);
  const [thickness, setThickness] = useState(20);
  const [quantity, setQuantity] = useState(10000);

  // Combined configurations state
  const [configuredItems, setConfiguredItems] = useState([]);

  // Modals state
  const [showCombineModal, setShowCombineModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Contact form details
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket success details
  const [ticketNum, setTicketNum] = useState('');
  const [successItems, setSuccessItems] = useState([]);
  const [successTotal, setSuccessTotal] = useState(0);

  // Load session storage check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_configurator_auth') === 'true';
      setIsAuthenticated(auth);
    }
    setIsLoading(false);
  }, []);

  // Sync sliders default when category changes
  useEffect(() => {
    const data = categoryData[category];
    if (data) {
      setLength(data.length.default);
      setDiameter(data.diameter.default);
      if (data.thickness) {
        setThickness(data.thickness.default);
      }
    }
  }, [category]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'palrom2026') {
      sessionStorage.setItem('palrom_configurator_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPassword('');
    }
  };

  // Pricing calculations
  const calculatePriceDetails = (cat, len, diam, thick, qtyVal) => {
    let unitPrice = 0.0;

    let subcatName = '';
    if (cat === 'specials') {
      const names = {
        'special-keeplat-spruce': 'Keeplat Spruce',
        'special-keeplat-beech': 'Keeplat Beech',
        'special-distancer-mix': 'Distancers Color Mix',
        'special-threshold': 'Wooden Threshold',
        'special-distancer-ind': 'Industrial Distancer',
        'special-wood-iron': 'Wood with Iron Component',
      };
      subcatName = names[subCategorySpecials] || 'Keeplat Spruce';
    } else if (cat === 'profiles') {
      const names = {
        'profile-semiround': 'Semiround Profile',
        'profile-strip': 'Profile Strip',
        'profile-finish-v1': 'Profile Finishing (Variant 1)',
        'profile-quarter-v1': 'Profile Quarter Round (Variant 1)',
        'profile-finish-v2': 'Profile Finishing (Variant 2)',
        'profile-plinth-v1': 'Profile Plinth (Variant 1)',
        'profile-corner-v1': 'Profile Corner (Variant 1)',
        'profile-corner-v2': 'Profile Corner (Variant 2)',
        'profile-triangular': 'Profile Triangular',
        'profile-quarter-v2': 'Profile Quarter Round (Variant 2)',
        'profile-thread': 'Profile Thread',
        'profile-calbat': 'Profile Calbat',
      };
      subcatName = names[subCategoryProfiles] || 'Semiround Profile';
    } else if (cat === 'dowels') {
      const names = {
        'dowel-small': 'Small Size (3 mm and up)',
        'dowel-medium-sticks': 'Sticks Small to Medium',
        'dowel-medium': 'Medium Size Dowel Rods',
        'dowel-big': 'Big Size (up to 60 mm)',
        'dowel-rilled': 'Spiral Rilled Pins (6 to 20 mm)',
      };
      subcatName = names[subCategoryDowels] || 'Small Size (3 mm and up)';
    }

    if (cat === 'pluggen' || cat === 'dowels') {
      const baseLength = 40.0;
      const baseDiameter = 8.0;
      const basePrice = 0.03;

      const lengthFactor = len / baseLength;
      const diameterFactor = Math.pow(diam / baseDiameter, 2);

      unitPrice = basePrice * lengthFactor * diameterFactor;
      if (unitPrice < 0.01) unitPrice = 0.01;
    } else if (cat === 'planed') {
      const volumeDm3 = (len * diam * thick) / 1000000.0;
      unitPrice = 1.65 * volumeDm3;
      if (unitPrice < 0.25) unitPrice = 0.25;
    } else if (cat === 'profiles') {
      const lengthM = len / 1000.0;
      const widthFactor = diam / 50.0;
      unitPrice = 0.95 * lengthM * widthFactor;
      if (unitPrice < 0.20) unitPrice = 0.20;
    } else if (cat === 'specials') {
      const basePrice = specialsPrices[subcatName] || 1.25;
      const lengthFactor = len / 500.0;
      unitPrice = basePrice * lengthFactor;
      if (unitPrice < 0.35) unitPrice = 0.35;
    }

    let discountPercent = 0;
    if (qtyVal >= 100000) {
      discountPercent = 15;
    } else if (qtyVal >= 50000) {
      discountPercent = 10;
    } else if (qtyVal >= 10000) {
      discountPercent = 5;
    }

    const discountFactor = (100 - discountPercent) / 100.0;
    const discountedUnitPrice = unitPrice * discountFactor;
    const totalPrice = discountedUnitPrice * qtyVal;

    return {
      unitPrice,
      discountPercent,
      discountedUnitPrice,
      totalPrice,
      subcatName,
    };
  };

  const getActiveSelectionDetails = () => {
    const data = categoryData[category];
    const details = calculatePriceDetails(category, length, diameter, thickness, quantity);
    
    let subName = data.name;
    if (details.subcatName) {
      subName = `${data.name} - ${details.subcatName}`;
    }

    let dims = `${length}mm x ${diameter}mm`;
    if (category === 'planed') {
      dims = `${thickness}mm x ${diameter}mm x ${length}mm`;
    }

    return {
      productName: subName,
      dimensions: dims,
      qtyText: `${quantity.toLocaleString('nl-NL')} stuks`,
      qtyVal: quantity,
      finish: data.finish,
      price: details.totalPrice,
      unitPrice: details.unitPrice,
      discountPercent: details.discountPercent,
    };
  };

  const activeSelection = getActiveSelectionDetails();

  const handleAddConfiguration = () => {
    setConfiguredItems((prev) => [...prev, activeSelection]);
    // Reset configurator fields
    const data = categoryData[category];
    setLength(data.length.default);
    setDiameter(data.diameter.default);
    if (data.thickness) {
      setThickness(data.thickness.default);
    }
  };

  const handleRemoveItem = (index) => {
    setConfiguredItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowCombineModal(true);
  };

  const handleConfigureAnother = () => {
    handleAddConfiguration();
    setShowCombineModal(false);
  };

  const handleFinishAndSubmit = () => {
    // Add current selection and open modal
    const current = activeSelection;
    setConfiguredItems((prev) => {
      const updated = [...prev, current];
      setSuccessItems(updated);
      let tot = 0;
      updated.forEach((x) => (tot += x.price));
      setSuccessTotal(tot);
      return updated;
    });

    setShowCombineModal(false);
    setShowContactModal(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientCompany.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      alert('Vul a.u.b. alle verplichte contactvelden in.');
      return;
    }

    setIsSubmitting(true);

    try {
      // API request to Next.js API route
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${clientName} (${clientCompany})`,
          clientEmail,
          clientPhone,
          clientNotes: clientNotes,
          items: successItems.map((item) => ({
            name: item.productName,
            category: item.productName.split(' - ')[0],
            qty: item.qtyVal,
            grade: 'grade_a', // default
            dims: item.dimensions,
            notes: `Finish: ${item.finish}, Richtprijs: € ${formatEuro(item.price)}`,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Database inquiry recording failed.');
      }

      const resData = await response.json();
      
      const randomTicket = 'PLR-2026-' + Math.floor(10000 + Math.random() * 90000);
      setTicketNum(randomTicket);
      
      setShowContactModal(false);
      setShowSuccessOverlay(true);
    } catch (err) {
      console.error(err);
      alert('Er is een fout opgetreden bij het verwerken van uw aanvraag. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setConfiguredItems([]);
    setSuccessItems([]);
    setSuccessTotal(0);
    setCategory('pluggen');
    setClientName('');
    setClientCompany('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
    setShowSuccessOverlay(false);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '15rem 0', textAlign: 'center', background: '#f8fafc', color: '#1e293b' }}>
        <h3>Inladen portal...</h3>
      </div>
    );
  }

  // Not authenticated? Show passcode gate
  if (!isAuthenticated) {
    return (
      <>
        {/* Style injection to hide Header, Footer and Widget when auth is locked */}
        <style>{`
          .main-header, .main-footer, .floating-contact-widget { display: none !important; }
        `}</style>

        <div className="auth-gate-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
          <div className="auth-gate-card">
            <div className="auth-lock-icon">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2>B2B Partner Portal</h2>
            <p>
              Voer het wachtwoord in om toegang te krijgen tot de{' '}
              <strong>Palrom Offerte Configurator</strong>.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <label
                  htmlFor="authPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: 'var(--color-text-dark)',
                  }}
                >
                  Wachtwoord *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="authPassword"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Wachtwoord tonen"
                  >
                    <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>
                {authError && (
                  <div className="error-message">
                    <i className="fa-solid fa-triangle-exclamation"></i> Ongeldig wachtwoord. Probeer
                    het opnieuw.
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%' }}>
                Toegang Ontgrendelen <i className="fa-solid fa-key icon-right"></i>
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // Cumulative total price for rendering
  let cumulativeTotal = 0;
  configuredItems.forEach((x) => (cumulativeTotal += x.price));

  return (
    <>
      {/* Hero Section */}
      <section className="configurator-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>Palrom Offerte Configurator</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Palrom Offerte Configurator</h1>
          <p>
            Stel direct de gewenste specificaties, millimeter-afmetingen en bewerkingen in voor uw zakelijke volume-aanvraag.
          </p>
        </div>
      </section>

      {/* Main dashboard config section */}
      <section className="configurator-dark-section">
        <div className="container">
          <div className="configurator-dashboard-container">
            <form onSubmit={handleFormSubmit} className="configurator-dashboard-form">
              <h2 className="dashboard-title">Palrom Offerte Configurator</h2>

              {/* Wizard fields */}
              <div className="dashboard-controls-grid">
                <div className="control-group">
                  <label htmlFor="dbCategory">Productcategorie</label>
                  <select
                    id="dbCategory"
                    className="dashboard-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="pluggen">Beuken Pluggen</option>
                    <option value="dowels">Beukenhouten Dowels & Staven</option>
                    <option value="planed">4-Zijdig Geschaafd Beukenhout</option>
                    <option value="profiles">Houten Profielen & Lijsten</option>
                    <option value="specials">Speciale Houtcomponenten</option>
                  </select>
                </div>

                {/* Subcategory: Dowels */}
                {category === 'dowels' && (
                  <div className="control-group" id="controlGroupSubCategoryDowels">
                    <label>Subcategorie Dowels *</label>
                    <div className="dowels-subcat-grid">
                      {[
                        { id: 'dowel-small', name: 'Small Size (3 mm and up)', img: '/images/dowelssmall-1.jpg' },
                        { id: 'dowel-medium-sticks', name: 'Sticks Small to Medium', img: '/images/dowelsmedium.jpg' },
                        { id: 'dowel-medium', name: 'Medium Size Dowel Rods', img: '/images/dowels-medium-2.jpg' },
                        { id: 'dowel-big', name: 'Big Size (up to 60 mm)', img: '/images/dowelsbig-300x300-1.jpg' },
                        { id: 'dowel-rilled', name: 'Spiral Rilled Pins (6 to 20 mm)', img: '/images/dowelsrilled-300x300-1.jpg' },
                      ].map((d) => (
                        <label key={d.id} className="dowels-subcat-card">
                          <input
                            type="radio"
                            name="subCategoryDowels"
                            value={d.id}
                            checked={subCategoryDowels === d.id}
                            onChange={() => setSubCategoryDowels(d.id)}
                          />
                          <div className="card-content">
                            <div className="card-icon">
                              <img src={d.img} alt={d.name} />
                            </div>
                            <span className="card-label">{d.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory: Profiles */}
                {category === 'profiles' && (
                  <div className="control-group" id="controlGroupSubCategoryProfiles">
                    <label>Subcategorie Profiel *</label>
                    <div className="profiles-subcat-grid">
                      {[
                        {
                          id: 'profile-semiround',
                          name: 'Semiround Profile',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,48 C 10,38 26,46 26,56 L 50,32 C 50,22 34,14 34,24 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 C 26,46 10,38 10,48 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-strip',
                          name: 'Profile Strip',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,49 L 26,52 L 50,40 L 34,37 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,56 L 26,52 L 50,40 L 50,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,53 L 26,56 L 26,52 L 10,49 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-finish-v1',
                          name: 'Profile Finishing (Variant 1)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 22,54 L 26,56 L 50,44 L 46,42 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 C 16,44 18,50 22,54 L 46,42 C 42,38 40,32 38,26 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 C 16,44 18,50 22,54 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-quarter-v1',
                          name: 'Profile Quarter Round (Variant 1)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 C 22,38 26,46 26,56 L 50,44 C 50,34 46,26 34,24 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 C 22,38 26,46 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-finish-v2',
                          name: 'Profile Finishing (Variant 2)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,41 L 18,43 L 42,31 L 38,29 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 18,46 L 22,48 L 46,36 L 42,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 22,51 L 26,53 L 50,41 L 46,39 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 14,41 L 38,29 L 38,26 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 18,43 L 18,46 L 42,34 L 42,31 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 22,48 L 22,51 L 46,39 L 46,36 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,53 L 26,56 L 50,44 L 50,41 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 L 14,41 L 18,43 L 18,46 L 22,48 L 22,51 L 26,53 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-plinth-v1',
                          name: 'Profile Plinth (Variant 1)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 16,57 L 16,39 L 46,24 L 46,42 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 16,39 C 16,36 13,36 13,38 L 10,39.5 L 40,24.5 L 43,23 C 43,21 46,21 46,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,54 L 16,57 L 16,39 C 16,36 13,36 13,38 L 10,39.5 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-corner-v1',
                          name: 'Profile Corner (Variant 1)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 34,24 L 34,36 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 14,46 L 38,34 L 38,26 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,46 L 26,52 L 50,40 L 38,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,52 L 26,56 L 50,44 L 50,40 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 L 14,46 L 26,52 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-corner-v2',
                          name: 'Profile Corner (Variant 2)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 12,36 C 10,38 10,44 12,48 L 36,36 C 34,32 34,26 36,24 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 14,46 L 38,34 L 38,26 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,46 L 26,52 L 50,40 L 38,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,52 L 26,56 L 50,44 L 50,40 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 12,48 C 10,44 10,38 12,36 L 15,38 L 14,44 L 26,50 L 26,54 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-triangular',
                          name: 'Profile Triangular',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,48 L 10,36 L 34,24 L 34,36 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,56 L 50,44 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-quarter-v2',
                          name: 'Profile Quarter Round (Variant 2)',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 13,37.5 C 21,41.5 24,49.5 24,53 L 48,41 C 48,37.5 45,29.5 37,25.5 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 13,37.5 L 37,25.5 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 24,53 L 26,56 L 50,44 L 48,41 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 13,37.5 C 21,41.5 24,49.5 24,53 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-thread',
                          name: 'Profile Thread',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 38,26" stroke="#c2410c" strokeWidth="1.2" />
                              <path d="M 18,40 L 42,28" stroke="#c2410c" strokeWidth="1.2" />
                              <path d="M 22,42 L 46,30" stroke="#c2410c" strokeWidth="1.2" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'profile-calbat',
                          name: 'Profile Calbat',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 C 18,46 22,52 26,56 L 50,44 C 46,40 42,34 38,26 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 C 18,46 22,52 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                      ].map((p) => (
                        <label key={p.id} className="profiles-subcat-card">
                          <input
                            type="radio"
                            name="subCategoryProfiles"
                            value={p.id}
                            checked={subCategoryProfiles === p.id}
                            onChange={() => setSubCategoryProfiles(p.id)}
                          />
                          <div className="card-content">
                            <div className="card-icon">{p.svg}</div>
                            <span className="card-label">{p.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory: Specials */}
                {category === 'specials' && (
                  <div className="control-group" id="controlGroupSubCategorySpecials">
                    <label>Subcategorie Specials *</label>
                    <div className="specials-subcat-grid">
                      {[
                        {
                          id: 'special-keeplat-spruce',
                          name: 'Keeplat Spruce',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 15,38.5 L 15,43.5 L 39,31.5 L 39,26.5 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 15,43.5 L 21,46.5 L 45,34.5 L 39,31.5 Z" fill="#ca8a04" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 15,38.5 L 39,26.5 L 34,24 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 21,41.5 L 26,44 L 50,32 L 45,29.5 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 26,44 L 21,41.5 L 21,46.5 L 15,43.5 L 15,38.5 L 10,36 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'special-keeplat-beech',
                          name: 'Keeplat Beech',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'special-distancer-mix',
                          name: 'Distancers Color Mix',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 44,41 L 54,36 L 54,26 L 44,31 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 34,26 L 44,31 L 54,26 L 44,21 Z" fill="#f87171" stroke="#991b1b" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 34,36 L 44,41 L 44,31 L 34,26 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 32,46 L 42,41 L 42,31 L 32,36 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 22,31 L 32,36 L 42,31 L 32,26 Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 22,41 L 32,46 L 32,36 L 22,31 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 20,51 L 30,46 L 30,36 L 20,41 Z" fill="#059669" stroke="#065f46" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 10,36 L 20,41 L 30,36 L 20,31 Z" fill="#34d399" stroke="#065f46" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 10,46 L 20,51 L 20,41 L 10,36 Z" fill="#10b981" stroke="#065f46" strokeWidth="1.2" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'special-threshold',
                          name: 'Wooden Threshold',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 30,60 L 30,55 L 50,45 L 50,50 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,51 L 30,55 L 50,45 L 46,41 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,45 L 26,51 L 46,41 L 34,35 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,47 L 14,45 L 34,35 L 30,37 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,50 L 30,60 L 30,55 L 26,51 L 14,45 L 10,47 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                        {
                          id: 'special-distancer-ind',
                          name: 'Industrial Distancer',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <ellipse cx="18" cy="46" rx="3.5" ry="4.5" fill="#451a03" stroke="#c2410c" strokeWidth="1" />
                            </svg>
                          ),
                        },
                        {
                          id: 'special-wood-iron',
                          name: 'Wood with Iron Component',
                          svg: (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 20,35 L 28,39 L 40,33 L 32,29 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 28,34 L 28,26 L 32,24 L 32,32 Z" fill="#64748b" stroke="#475569" strokeWidth="1" strokeLinejoin="round" />
                              <ellipse cx="30" cy="24" rx="2" ry="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                      ].map((s) => (
                        <label key={s.id} className="specials-subcat-card">
                          <input
                            type="radio"
                            name="subCategorySpecials"
                            value={s.id}
                            checked={subCategorySpecials === s.id}
                            onChange={() => setSubCategorySpecials(s.id)}
                          />
                          <div className="card-content">
                            <div className="card-icon">{s.svg}</div>
                            <span className="card-label">{s.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizing: Length */}
                <div className="control-group">
                  <div className="slider-header">
                    <label htmlFor="dbLength">{categoryData[category].length.label}</label>
                  </div>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      id="dbLength"
                      min={categoryData[category].length.min}
                      max={categoryData[category].length.max}
                      value={length}
                      className="dashboard-slider"
                      onChange={(e) => setLength(parseInt(e.target.value))}
                    />
                    <span className="slider-value-display">{length}</span>
                  </div>
                </div>

                {/* Sizing: Width / Diameter */}
                <div className="control-group">
                  <div className="slider-header">
                    <label htmlFor="dbDiameter">{categoryData[category].diameter.label}</label>
                  </div>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      id="dbDiameter"
                      min={categoryData[category].diameter.min}
                      max={categoryData[category].diameter.max}
                      value={diameter}
                      className="dashboard-slider"
                      onChange={(e) => setDiameter(parseInt(e.target.value))}
                    />
                    <span className="slider-value-display">{diameter}</span>
                  </div>
                </div>

                {/* Sizing: Thickness (conditional) */}
                {categoryData[category].thickness && (
                  <div className="control-group" id="controlGroupThickness">
                    <div className="slider-header">
                      <label htmlFor="dbThickness">{categoryData[category].thickness.label}</label>
                    </div>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        id="dbThickness"
                        min={categoryData[category].thickness.min}
                        max={categoryData[category].thickness.max}
                        value={thickness}
                        className="dashboard-slider"
                        onChange={(e) => setThickness(parseInt(e.target.value))}
                      />
                      <span className="slider-value-display">{thickness}</span>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="control-group">
                  <label htmlFor="dbOplage">Oplage (stuks)</label>
                  <select
                    id="dbOplage"
                    className="dashboard-select"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  >
                    <option value="500">500 stuks</option>
                    <option value="1000">1.000 stuks</option>
                    <option value="5000">5.000 stuks</option>
                    <option value="10000">10.000 stuks</option>
                    <option value="25000">25.000 stuks</option>
                    <option value="50000">50.000 stuks</option>
                    <option value="100000">100.000 stuks</option>
                  </select>
                </div>
              </div>

              {/* Added Configurations List Block */}
              {configuredItems.length > 0 && (
                <div className="control-group" style={{ gridColumn: 'span 2', marginBottom: '2rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    Toegevoegde configuraties in deze offerteaanvraag
                  </label>
                  <div className="configured-items-list">
                    {configuredItems.map((item, idx) => (
                      <div className="configured-item-row" key={idx}>
                        <div>
                          <span className="item-info">{item.productName}</span>
                          <span className="item-specs">
                            ({item.dimensions} | {item.finish} | {item.qtyText} | € {formatEuro(item.price)})
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(idx)}
                          aria-label="Verwijder product"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    <span>Totaal gecumuleerde richtprijs:</span>
                    <span style={{ color: 'var(--color-primary-dark)' }}>
                      € {formatEuro(cumulativeTotal)}
                    </span>
                  </div>
                </div>
              )}

              {/* Summary Table */}
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Configuratie Detail</th>
                      <th>Uw Selectie</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Product</td>
                      <td>{activeSelection.productName}</td>
                    </tr>
                    <tr>
                      <td>Afmetingen</td>
                      <td>{activeSelection.dimensions}</td>
                    </tr>
                    <tr>
                      <td>Oplage</td>
                      <td>{activeSelection.qtyText}</td>
                    </tr>
                    <tr>
                      <td>Materiaal</td>
                      <td>
                        <span className="material-leaf">🌿</span> 100% FSC® Beukenhout
                      </td>
                    </tr>
                    <tr>
                      <td>Afwerking</td>
                      <td>{activeSelection.finish}</td>
                    </tr>
                    <tr>
                      <td>Richtprijs (p.st.)</td>
                      <td>€ {formatEuro(activeSelection.unitPrice, 4)}</td>
                    </tr>
                    <tr>
                      <td>Staffelkorting</td>
                      <td>
                        {activeSelection.discountPercent > 0 ? (
                          <span
                            className="discount-badge"
                            style={{
                              background: 'rgba(231,177,36,0.15)',
                              color: 'var(--color-primary-dark)',
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--border-radius-sm)',
                              fontWeight: 600,
                            }}
                          >
                            {activeSelection.discountPercent}% B2B Staffelkorting
                          </span>
                        ) : (
                          'Geen (min. 10.000 voor 5%)'
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Totale Richtprijs</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        € {formatEuro(activeSelection.price)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status Bar */}
              <div className="dashboard-status-bar">
                <div className="status-col">
                  <span className="status-label">Certificering</span>
                  <span className="status-value">100% FSC® Beukenhout</span>
                </div>
                <div className="status-col">
                  <span className="status-label">Status</span>
                  <span className="status-value status-ready">Ready</span>
                </div>
              </div>

              <button type="submit" className="dashboard-submit-btn">
                Vraag Direct Offerte Aan
              </button>
            </form>

            {/* Success Overlay view */}
            {showSuccessOverlay && (
              <div className="configurator-success-overlay" id="configuratorSuccessOverlay">
                <div className="success-card dark-success-card">
                  <div className="success-icon-circle">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h2>Aanvraag Succesvol Ontvangen</h2>
                  <p className="success-lead">
                    Bedankt! Uw specificaties zijn geregistreerd in ons B2B-offertesysteem. We nemen
                    binnen 24 uur contact met u op.
                  </p>

                  <div className="ticket-summary-box dark-ticket-box">
                    <div className="ticket-header">
                      <span>OFFERTE TICKETAANVRAAG</span>
                      <strong>{ticketNum}</strong>
                    </div>
                    <div className="ticket-body">
                      <p
                        className="ticket-status-label"
                        style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', fontSize: '1.05rem' }}
                      >
                        Je aanvraag is geworden:
                      </p>
                      <ul
                        style={{
                          listStyle: 'none',
                          paddingLeft: 0,
                          marginBottom: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.50rem',
                          color: '#f8fafc',
                        }}
                      >
                        {successItems.map((item, idx) => (
                          <li
                            key={idx}
                            style={{
                              padding: '0.5rem 0',
                              borderBottom: '1px solid rgba(255,255,255,0.08)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <strong>{item.productName}</strong>
                              <br />
                              <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                                Dimensions: {item.dimensions} | Finish: {item.finish} | Aantal:{' '}
                                {item.qtyText}
                              </span>
                            </div>
                            <strong style={{ whiteSpace: 'nowrap', color: 'var(--color-primary)' }}>
                              € {formatEuro(item.price)}
                            </strong>
                          </li>
                        ))}
                      </ul>
                      <div
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.15)',
                          paddingTop: '1rem',
                          marginBottom: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '1.1rem',
                          color: '#ffffff',
                        }}
                      >
                        <strong>Totale geschatte richtprijs:</strong>
                        <strong style={{ color: 'var(--color-primary)' }}>
                          € {formatEuro(successTotal)}
                        </strong>
                      </div>
                      <ul style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', listStyle: 'none', paddingLeft: 0, color: '#f8fafc' }}>
                        <li>
                          <strong>Organisatie:</strong> <span>{clientCompany}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="success-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        alert(
                          'Uw specificatiesheet (PDF) is klaargemaakt voor download en naar uw e-mailadres verzonden!'
                        )
                      }
                    >
                      <i className="fa-solid fa-file-pdf icon-left"></i> Download Specificatiesheet
                    </button>
                    <button className="btn btn-secondary" onClick={handleRestart}>
                      Configureer Nieuw Product
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Combine Request Prompt Modal */}
            {showCombineModal && (
              <div className="dashboard-modal-overlay" onClick={() => setShowCombineModal(false)}>
                <div
                  className="dashboard-modal-card text-center"
                  style={{ maxWidth: '500px', padding: '3rem 2.5rem' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowCombineModal(false)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <i
                    className="fa-solid fa-folder-plus"
                    style={{
                      fontSize: '3.5rem',
                      color: 'var(--color-primary)',
                      marginBottom: '1.5rem',
                      display: 'block',
                    }}
                  ></i>
                  <h3>Wilt u nog een product toevoegen?</h3>
                  <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                    U kunt nog een product configureren en toevoegen aan deze offerteaanvraag, of direct
                    uw offerte afronden met de huidige selectie.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      type="button"
                      className="dashboard-modal-submit-btn"
                      style={{
                        marginTop: 0,
                        backgroundColor: '#ffffff',
                        color: 'var(--color-text-dark)',
                        border: '2px solid var(--color-primary)',
                      }}
                      onClick={handleConfigureAnother}
                    >
                      <i className="fa-solid fa-plus icon-left"></i> Ja, voeg nog een product toe
                    </button>
                    <button
                      type="button"
                      className="dashboard-modal-submit-btn"
                      style={{ marginTop: 0 }}
                      onClick={handleFinishAndSubmit}
                    >
                      Nee, offerte afronden <i className="fa-solid fa-chevron-right icon-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* B2B Contact Details Form Modal */}
            {showContactModal && (
              <div className="dashboard-modal-overlay" onClick={() => setShowContactModal(false)}>
                <div className="dashboard-modal-card" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowContactModal(false)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <h3>Contactgegevens B2B Aanvraag</h3>
                  <p>
                    Voer uw bedrijfsgegevens in om uw offerteaanvraag te voltooien. U ontvangt direct
                    een specificatiedocument.
                  </p>

                  <form onSubmit={handleInquirySubmit} className="dashboard-modal-form">
                    <div className="form-group-db">
                      <label htmlFor="dbName">Uw Naam *</label>
                      <input
                        type="text"
                        id="dbName"
                        required
                        placeholder="bijv. Jan de Vries"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbCompany">Bedrijfsnaam *</label>
                      <input
                        type="text"
                        id="dbCompany"
                        required
                        placeholder="bijv. Houtbewerking De Vries BV"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbEmail">Zakelijk E-mailadres *</label>
                      <input
                        type="email"
                        id="dbEmail"
                        required
                        placeholder="bijv. j.devries@houtbedrijf.nl"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbPhone">Telefoonnummer *</label>
                      <input
                        type="tel"
                        id="dbPhone"
                        required
                        placeholder="bijv. +31 6 12345678"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbNotes">Aanvullende opmerkingen of logistieke eisen</label>
                      <textarea
                        id="dbNotes"
                        rows="3"
                        placeholder="bijv. Gewenste leverdatum, specifieke transportbundeling..."
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="dashboard-modal-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin icon-left"></i> Verzenden...
                        </>
                      ) : (
                        <>
                          Verstuur Aanvraag <i className="fa-solid fa-paper-plane icon-right"></i>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
