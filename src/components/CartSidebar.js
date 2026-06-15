'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInquiry } from './InquiryContext';

export default function CartSidebar() {
  const pathname = usePathname();
  const {
    cartItems,
    removeFromCart,
    updateCartItem,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    isInitialized,
  } = useInquiry();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNl = pathname === '/' || pathname === '/configurator';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert(
        isNl
          ? 'Vul alstublieft alle verplichte contactvelden in.'
          : 'Please fill out all required contact fields.'
      );
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
          const gradeNames = isNl
            ? {
                grade_a: 'Klasse A (Foutvrij)',
                grade_b: 'Klasse B (Meubelhout)',
                grade_ab: 'Klasse A/B Mix',
              }
            : {
                grade_a: 'Class A (Clear)',
                grade_b: 'Class B (Cabinet)',
                grade_ab: 'Class A/B Mixed',
              };
          const gradeName = gradeNames[item.grade] || item.grade;
          const dimDesc = item.dims ? ` [Maat: ${item.dims}]` : '';
          return `- ${item.name} (${item.qty}x, ${gradeName}${dimDesc})`;
        })
        .join('\n');

      const alertMsg = isNl
        ? `Bedankt, ${name}! Uw offerteaanvraag voor de volgende product(en) is succesvol ontvangen door ons hoofdkantoor in Brad:\n\n${itemsList}\n\nWe zullen gedetailleerde specificaties en prijsopgaven voorbereiden en u binnen 24 uur e-mailen op ${email}.`
        : `Thank you, ${name}! Your inquiry for the following product(s) has been successfully received by our Brad headquarters:\n\n${itemsList}\n\nWe will prepare detailed sizing sheets and pricing estimates and email you at ${email} within 24 hours.`;

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
      alert(
        isNl
          ? 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.'
          : 'Something went wrong while submitting. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) return null;

  return (
    <>
      <div
        className={`sidebar-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={handleClose}
      />
      <div className={`quote-sidebar ${isCartOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>{isNl ? 'Uw Offerteaanvraag' : 'Your Quote Inquiry'}</h3>
          <button className="sidebar-close-btn" onClick={handleClose} aria-label="Close Sidebar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-body">
          <div className="cart-items-container">
            {cartItems.length === 0 ? (
              <div className="cart-empty-message">
                <p>
                  {isNl
                    ? 'Uw offertelijst is leeg. Voeg producten toe om een offerte aan te vragen.'
                    : 'Your inquiry list is empty. Add products to request a quote.'}
                </p>
                <Link href="/products" className="cart-empty-action-btn" onClick={handleClose}>
                  {isNl ? 'Naar Producten' : 'Go to Products'}{' '}
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
                        <label>{isNl ? 'Aantal' : 'Quantity'}</label>
                        <input
                          type="number"
                          className="cart-spec-qty"
                          value={item.qty}
                          min="1"
                          onChange={(e) => handleQtyChange(index, e.target.value)}
                        />
                      </div>
                      <div className="cart-spec-group">
                        <label>{isNl ? 'Kwaliteitsklasse' : 'Wood Grade'}</label>
                        <select
                          className="cart-spec-grade"
                          value={item.grade}
                          onChange={(e) => handleGradeChange(index, e.target.value)}
                        >
                          <option value="grade_a">
                            {isNl ? 'Klasse A (Foutvrij)' : 'Class A (Clear)'}
                          </option>
                          <option value="grade_b">
                            {isNl ? 'Klasse B (Meubelhout)' : 'Class B (Cabinet)'}
                          </option>
                          <option value="grade_ab">
                            {isNl ? 'Klasse A/B Mix' : 'Class A/B Mixed'}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="cart-spec-group">
                      <label>
                        {isNl
                          ? 'Afmetingen / Speciale Instructies'
                          : 'Dimensions / Special Instructions'}
                      </label>
                      <input
                        type="text"
                        className="cart-spec-dims"
                        value={item.dims || ''}
                        placeholder={
                          isNl
                            ? 'bijv. Ø 12mm x 1000mm, specifieke lengtes...'
                            : 'e.g. Ø 12mm x 1000mm, custom specs...'
                        }
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
              <h4>{isNl ? 'Contactgegevens Aanvraag' : 'Inquiry Contact Details'}</h4>
              <form onSubmit={handleSubmit} className="cart-modern-form">
                <div className="form-group">
                  <label htmlFor="cart_name">{isNl ? 'Naam *' : 'Name *'}</label>
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
                  <label htmlFor="cart_email">{isNl ? 'E-mailadres *' : 'Email Address *'}</label>
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
                  <label htmlFor="cart_phone">{isNl ? 'Telefoonnummer *' : 'Phone Number *'}</label>
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
                  <label htmlFor="cart_message">{isNl ? 'Extra Notities' : 'Additional Notes'}</label>
                  <textarea
                    id="cart_message"
                    rows="3"
                    placeholder={
                      isNl
                        ? 'Afleveringsschema, certificeringseisen...'
                        : 'Sourcing schedules, certification needs...'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? (
                    isNl ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin icon-left"></i> Verzenden...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-spinner fa-spin icon-left"></i> Submitting...
                      </>
                    )
                  ) : isNl ? (
                    <>
                      Verzend Offerteaanvraag <i className="fa-solid fa-paper-plane icon-right"></i>
                    </>
                  ) : (
                    <>
                      Submit Quote Request <i className="fa-solid fa-paper-plane icon-right"></i>
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
