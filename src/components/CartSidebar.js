'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useInquiry } from './InquiryContext';

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    updateCartItem,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    isInitialized,
    lang,
  } = useInquiry();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNl = lang === 'nl';

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleQtyChange = (index, valStr) => {
    let val = parseInt(valStr);
    if (isNaN(val) || val < 1) val = 1;
    updateCartItem(index, { qty: val });
  };

  const handleGradeChange = (index, grade) => {
    updateCartItem(index, { grade });
  };

  const handleDimsChange = (index, dims) => {
    updateCartItem(index, { dims });
  };

  const t = {
    validationError: {
      nl: 'Vul alstublieft alle verplichte contactvelden in.',
      en: 'Please fill out all required contact fields.',
      de: 'Bitte füllen Sie alle Pflicht-Kontaktfelder aus.',
      ro: 'Vă rugăm să completați toate câmpurile obligatorii de contact.'
    },
    errorSubmit: {
      nl: 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.',
      en: 'Something went wrong while submitting. Please try again later.',
      de: 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.',
      ro: 'A apărut o eroare la trimitere. Vă rugăm să încercați din nou mai târziu.'
    },
    sidebarTitle: {
      nl: 'Uw Offerteaanvraag',
      en: 'Your Quote Inquiry',
      de: 'Ihre Angebotsanfrage',
      ro: 'Solicitarea Dvs. de Ofertă'
    },
    emptyMessage: {
      nl: 'Uw offertelijst is leeg. Voeg producten toe om een offerte aan te vragen.',
      en: 'Your inquiry list is empty. Add products to request a quote.',
      de: 'Ihre Anfrageliste ist leer. Fügen Sie Produkte hinzu, um ein Angebot anzufordern.',
      ro: 'Lista dvs. de solicitare este goală. Adăugați produse pentru a solicita o ofertă.'
    },
    goToProducts: {
      nl: 'Naar Producten',
      en: 'Go to Products',
      de: 'Zu den Produkten',
      ro: 'Mergi la Produse'
    },
    quantityLabel: {
      nl: 'Aantal',
      en: 'Quantity',
      de: 'Menge',
      ro: 'Cantitate'
    },
    woodGradeLabel: {
      nl: 'Kwaliteitsklasse',
      en: 'Wood Grade',
      de: 'Holzqualität',
      ro: 'Clasă Lemn'
    },
    dimsLabel: {
      nl: 'Afmetingen / Speciale Instructies',
      en: 'Dimensions / Special Instructions',
      de: 'Maße / Besondere Anweisungen',
      ro: 'Dimensiuni / Instrucțiuni Speciale'
    },
    dimsPlaceholder: {
      nl: 'bijv. Ø 12mm x 1000mm, specifieke lengtes...',
      en: 'e.g. Ø 12mm x 1000mm, custom specs...',
      de: 'z.B. Ø 12mm x 1000mm, spezifische Längen...',
      ro: 'ex. Ø 12mm x 1000mm, specificații personalizate...'
    },
    contactDetailsTitle: {
      nl: 'Contactgegevens Aanvraag',
      en: 'Inquiry Contact Details',
      de: 'Kontaktdaten für die Anfrage',
      ro: 'Date de Contact Solicitare'
    },
    nameLabel: {
      nl: 'Naam *',
      en: 'Name *',
      de: 'Name *',
      ro: 'Nume *'
    },
    emailLabel: {
      nl: 'E-mailadres *',
      en: 'Email Address *',
      de: 'E-Mail-Adresse *',
      ro: 'Adresă de E-mail *'
    },
    phoneLabel: {
      nl: 'Telefoonnummer *',
      en: 'Phone Number *',
      de: 'Telefonnummer *',
      ro: 'Număr de Telefon *'
    },
    notesLabel: {
      nl: 'Extra Notities',
      en: 'Additional Notes',
      de: 'Zusätzliche Notizen',
      ro: 'Note Suplimentare'
    },
    notesPlaceholder: {
      nl: 'Afleveringsschema, certificeringseisen...',
      en: 'Sourcing schedules, certification needs...',
      de: 'Lieferplan, Zertifizierungsanforderungen...',
      ro: 'Program de livrare, cerințe de certificare...'
    },
    submitBtn: {
      nl: 'Verzend Offerteaanvraag',
      en: 'Submit Quote Request',
      de: 'Angebotsanfrage absenden',
      ro: 'Trimite Cererea de Ofertă'
    },
    submittingBtn: {
      nl: 'Verzenden...',
      en: 'Submitting...',
      de: 'Wird gesendet...',
      ro: 'Se trimite...'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert(getTranslation('validationError'));
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to our Next.js backend endpoint /api/inquire
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          clientNotes: notes,
          items: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Inquiry submission failed');
      }

      // Format items for success alert
      const itemsList = cartItems
        .map((item) => {
          const gradeNames = {
            nl: {
              grade_a: 'Klasse A (Foutvrij)',
              grade_b: 'Klasse B (Meubelhout)',
              grade_ab: 'Klasse A/B Mix',
            },
            en: {
              grade_a: 'Class A (Clear)',
              grade_b: 'Class B (Cabinet)',
              grade_ab: 'Class A/B Mixed',
            },
            de: {
              grade_a: 'Klasse A (Astfrei)',
              grade_b: 'Klasse B (Möbelholz)',
              grade_ab: 'Klasse A/B gemischt',
            },
            ro: {
              grade_a: 'Clasa A (Fără noduri)',
              grade_b: 'Clasa B (Lemn pentru mobilă)',
              grade_ab: 'Clasa A/B amestecat',
            }
          };
          const currentGrades = gradeNames[lang] || gradeNames.nl;
          const gradeName = currentGrades[item.grade] || item.grade;
          const dimDesc = item.dims ? ` [Maat: ${item.dims}]` : '';
          return `- ${item.name} (${item.qty}x, ${gradeName}${dimDesc})`;
        })
        .join('\n');

      let alertMsg = '';
      if (lang === 'nl') {
        alertMsg = `Bedankt, ${name}! Uw offerteaanvraag voor de volgende product(en) is succesvol ontvangen door ons hoofdkantoor in Brad:\n\n${itemsList}\n\nWe zullen gedetailleerde specificaties en prijsopgaven voorbereiden en u binnen 24 uur e-mailen op ${email}.`;
      } else if (lang === 'de') {
        alertMsg = `Vielen Dank, ${name}! Ihre Angebotsanfrage für die folgenden Produkte ist erfolgreich in unserer Zentrale in Brad eingegangen:\n\n${itemsList}\n\nWir werden detaillierte Spezifikationen und Preisschätzungen vorbereiten und Ihnen innerhalb von 24 Stunden eine E-Mail an ${email} senden.`;
      } else if (lang === 'ro') {
        alertMsg = `Vă mulțumim, ${name}! Solicitarea dvs. de ofertă pentru următoarele produse a fost primită cu succes la sediul nostru din Brad:\n\n${itemsList}\n\nVom pregăti fișe tehnice detaliate și estimări de preț și vă vom trimite un e-mail la ${email} în termen de 24 de ore.`;
      } else {
        alertMsg = `Thank you, ${name}! Your inquiry for the following product(s) has been successfully received by our Brad headquarters:\n\n${itemsList}\n\nWe will prepare detailed sizing sheets and pricing estimates and email you at ${email} within 24 hours.`;
      }

      alert(alertMsg);

      // Clean up
      clearCart();
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
      alert(getTranslation('errorSubmit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) return null;

  return (
    <>
      <div
        className={`sidebar-overlay ${isCartOpen ? 'visible' : ''}`}
        onClick={handleClose}
      />
      <div className={`quote-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>{getTranslation('sidebarTitle')}</h3>
          <button className="sidebar-close-btn" onClick={handleClose} aria-label="Close Sidebar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-body">
          <div className="cart-items-container">
            {cartItems.length === 0 ? (
              <div className="cart-empty-message">
                <p>
                  {getTranslation('emptyMessage')}
                </p>
                <Link href="/products" className="cart-empty-action-btn" onClick={handleClose}>
                  {getTranslation('goToProducts')}{' '}
                  <i className="fa-solid fa-arrow-right icon-right"></i>
                </Link>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div className="cart-item" key={item.id + '-' + index}>
                  <div className="cart-item-header">
                    <div>
                      <span className="cart-item-category">{item.category}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(index)}
                      aria-label="Remove Item"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <div className="cart-item-specs">
                    <div className="cart-spec-row">
                      <div className="cart-spec-group">
                        <label>{getTranslation('quantityLabel')}</label>
                        <input
                          type="number"
                          className="cart-spec-qty"
                          value={item.qty}
                          min="1"
                          onChange={(e) => handleQtyChange(index, e.target.value)}
                        />
                      </div>
                      <div className="cart-spec-group">
                        <label>{getTranslation('woodGradeLabel')}</label>
                        <select
                          className="cart-spec-grade"
                          value={item.grade}
                          onChange={(e) => handleGradeChange(index, e.target.value)}
                        >
                          <option value="grade_a">
                            {lang === 'nl' ? 'Klasse A (Foutvrij)' : (lang === 'de' ? 'Klasse A (Astfrei)' : (lang === 'ro' ? 'Clasa A (Fără noduri)' : 'Class A (Clear)'))}
                          </option>
                          <option value="grade_b">
                            {lang === 'nl' ? 'Klasse B (Meubelhout)' : (lang === 'de' ? 'Klasse B (Möbelholz)' : (lang === 'ro' ? 'Clasa B (Lemn pentru mobilă)' : 'Class B (Cabinet)'))}
                          </option>
                          <option value="grade_ab">
                            {lang === 'nl' ? 'Klasse A/B Mix' : (lang === 'de' ? 'Klasse A/B gemischt' : (lang === 'ro' ? 'Clasa A/B amestecat' : 'Class A/B Mixed'))}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="cart-spec-group">
                      <label>
                        {getTranslation('dimsLabel')}
                      </label>
                      <input
                        type="text"
                        className="cart-spec-dims"
                        value={item.dims || ''}
                        placeholder={getTranslation('dimsPlaceholder')}
                        onChange={(e) => handleDimsChange(index, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-form-section">
              <h4>{getTranslation('contactDetailsTitle')}</h4>
              <form onSubmit={handleSubmit} className="cart-modern-form">
                <div className="form-group">
                  <label htmlFor="cart_name">{getTranslation('nameLabel')}</label>
                  <input
                    type="text"
                    id="cart_name"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cart_email">{getTranslation('emailLabel')}</label>
                  <input
                    type="email"
                    id="cart_email"
                    required
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cart_phone">{getTranslation('phoneLabel')}</label>
                  <input
                    type="tel"
                    id="cart_phone"
                    required
                    placeholder="+40 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cart_message">{getTranslation('notesLabel')}</label>
                  <textarea
                    id="cart_message"
                    rows="3"
                    placeholder={getTranslation('notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin icon-left"></i> {getTranslation('submittingBtn')}
                    </>
                  ) : (
                    <>
                      {getTranslation('submitBtn')} <i className="fa-solid fa-paper-plane icon-right"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
