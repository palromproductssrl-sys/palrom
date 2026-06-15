'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const teamMemberData = {
  gabriela: {
    id: 'gabriela',
    name: 'Gabriela Cioara',
    role: {
      nl: 'Algemeen Directeur',
      en: 'General Manager',
    },
    avatar: '/images/gabriela.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
    },
    bio: {
      nl: 'Gabriela leidt PALROM Products met meer dan 20 jaar ervaring in de B2B-houtindustrie. Zij richt zich op strategische groei, kwaliteitsborging en het behoud van onze premium FSC®-gecertificeerde toeleveringsketen.',
      en: 'Gabriela leads PALROM Products with over 20 years of experience in the B2B wood industry. She focuses on strategic growth, quality assurance, and maintaining our premium FSC®-certified supply chain.',
    },
    email: 'office@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Gabriela,%20ik%20heb%20een%20vraag%20over%20uw%20B2B-meubelcomponenten.',
  },
  ciprian: {
    id: 'ciprian',
    name: 'Ciprian Jude',
    role: {
      nl: 'Inkoopmanager',
      en: 'Purchase Manager',
    },
    avatar: '/images/ciprian.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
    },
    bio: {
      nl: 'Ciprian beheert onze houtinkoop en logistiek. Hij zorgt ervoor dat al onze beukenhouten grondstoffen afkomstig zijn uit duurzaam beheerde lokale bossen in de regio Brad en Hunedoara.',
      en: 'Ciprian manages our timber procurement and logistics. He ensures all our beechwood raw materials are sourced sustainably from managed local forests in the Brad and Hunedoara regions.',
    },
    email: 'ciprian.jude@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Ciprian,%20ik%20wil%20graag%20de%20beschikbaarheid%20en%20inkoop%20van%20hout%20bespreken.',
  },
  anca: {
    id: 'anca',
    name: 'Anca Mihuț',
    role: {
      nl: 'Personeelszaken (HR)',
      en: 'Human Resources',
    },
    avatar: '/images/anca.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
    },
    bio: {
      nl: 'Anca coördineert recruitment en personeelswelzijn binnen de Palrom-zagerij en -schaverij. Zij is uw directe aanspreekpunt voor openstaande vacatures en sollicitaties in Brad.',
      en: 'Anca coordinates recruitment and employee welfare within the Palrom sawmill and planing mill. She is your direct point of contact for open vacancies and job applications in Brad.',
    },
    email: 'anca.mihut@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Anca,%20ik%20heb%20een%20vraag%20over%20carri%C3%A8remogelijkheden%20bij%20Palrom.',
  },
  adi: {
    id: 'adi',
    name: 'Adi Cîra',
    role: {
      nl: 'Productiemanager',
      en: 'Production Manager',
    },
    avatar: '/images/adi_cira.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
    },
    bio: {
      nl: 'Adi houdt toezicht op onze ultramoderne zagerij- en schaaflijnen. Hij vertaalt klantspecifieke millimetertekeningen naar efficiënte en foutloze massaproductie.',
      en: 'Adi oversees our state-of-the-art sawmill and planing lines. He translates client-specific millimeter drawings into efficient, defect-free bulk production runs.',
    },
    email: 'production@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Adi,%20ik%20heb%20een%20technische%20vraag%20over%20de%20productie%20van%20houten%20componenten.',
  },
  bogdan: {
    id: 'bogdan',
    name: 'Bogdan Oprea',
    role: {
      nl: 'Orderverwerking',
      en: 'Order Intake',
    },
    avatar: '/images/bogdan_oprea.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
    },
    bio: {
      nl: 'Bogdan is verantwoordelijk voor B2B-orderinname, volume-offertes en leveringsplanning. Hij zorgt voor een snelle verwerking van aanvragen en stroomlijnt de administratieve flow.',
      en: 'Bogdan is responsible for B2B order intake, volume quotes, and delivery scheduling. He ensures fast processing of inquiries and streamlines the administrative flow.',
    },
    email: 'orders@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Bogdan,%20ik%20wil%20graag%20de%20status%20van%20een%20order%20of%20een%20offerteaanvraag%20bespreken.',
  },
};

export default function ContactSection() {
  const pathname = usePathname();
  const isNl = pathname === '/' || pathname === '/configurator';

  const [activeModalMember, setActiveModalMember] = useState(null);
  const [modalActiveState, setModalActiveState] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [productType, setProductType] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { text, type }

  const handleOpenModal = (member) => {
    setActiveModalMember(member);
    setTimeout(() => {
      setModalActiveState(true);
    }, 10);
  };

  const handleCloseModal = () => {
    setModalActiveState(false);
    setTimeout(() => {
      setActiveModalMember(null);
    }, 300);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    if (activeModalMember) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [activeModalMember]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !productType || !message.trim()) {
      setFeedback({
        text: isNl ? 'Vul alstublieft alle verplichte velden in.' : 'Please fill out all required fields.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate server request (1.8s)
    setTimeout(() => {
      setIsSubmitting(false);

      let feedbackMsg = '';
      if (isNl) {
        const productMsg =
          productType === 'careers'
            ? 'sollicitatie is ontvangen door onze afdeling Personeelszaken (HR)'
            : `aanvraag voor onze "${productType}" beukenhouten producten is verzonden naar ons kantoor in Brad`;
        feedbackMsg = `Bedankt, ${name}! Uw ${productMsg}. We reageren binnen 24 uur.`;
      } else {
        const productMsg =
          productType === 'careers'
            ? 'application has been received by our Human Resources department'
            : `inquiry regarding our "${productType}" beechwood products has been sent to our Brad office`;
        feedbackMsg = `Thank you, ${name}! Your ${productMsg}. We will reply in 24 hours.`;
      }

      setFeedback({ text: feedbackMsg, type: 'success' });

      // Reset
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setProductType('');
      setMessage('');
    }, 1800);
  };

  const currentLang = isNl ? 'nl' : 'en';

  return (
    <>
      <section id="contact" className="contact-section section-padding">
        <div className="container">
          <div className="grid grid-2">
            {/* Contact Info */}
            <div className="contact-info-column animate-on-scroll">
              <span className="section-badge">
                {isNl ? 'Contact & Offerte' : 'Contact & Quote'}
              </span>
              <h2 className="section-title">
                {isNl ? 'Vraag direct een offerte aan' : 'Request a direct quote'}
              </h2>
              <p className="section-description">
                {isNl
                  ? 'Wij reageren binnen 24 uur. Neem direct contact op met ons hoofdkantoor in Brad of vul het contactformulier in voor een snelle, vrijblijvende prijsopgave.'
                  : 'We reply within 24 hours. Contact our Brad headquarters directly or fill out the contact form for a quick, non-binding quote.'}
              </p>

              {/* B2B Configurator Box */}
              <div className="configurator-notice-box">
                <div className="notice-icon">
                  <i className="fa-solid fa-clipboard-list"></i>
                </div>
                <div className="notice-content">
                  <h4>
                    {isNl ? 'Palrom Offerte Configurator' : 'Palrom Quote Configurator'}
                  </h4>
                  <p>
                    {isNl
                      ? 'Bereken snel de benodigde volumes en specificaties voor uw beukenhouten pluggen of meubelcomponenten en ontvang direct een offerte op maat.'
                      : 'Quickly calculate required volumes and specifications for your beechwood dowels or furniture components and request a tailored quote.'}
                  </p>
                  <Link href="/configurator" className="notice-link">
                    {isNl ? 'Start de Offerte Configurator' : 'Start the Quote Configurator'}{' '}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>

              {/* Contact details */}
              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="detail-content">
                    <h3>{isNl ? 'Hoofdkantoor & Zagerij' : 'Headquarters & Sawmill'}</h3>
                    <p>
                      PALROM Products SRL
                      <br />8 Poienita St, Brad City, Hunedoara
                      <br />335200, {isNl ? 'ROEMENIË' : 'ROMANIA'}
                    </p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="detail-content">
                    <h3>{isNl ? 'Telefoon & Fax' : 'Phone & Fax'}</h3>
                    <p>
                      Tel: +40 254.60.60.53
                      <br />
                      Fax: +40 254.60.60.51
                    </p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="detail-content">
                    <h3>{isNl ? 'E-mailadres' : 'Email Address'}</h3>
                    <p>
                      <a href="mailto:office@palromproducts.ro">office@palromproducts.ro</a>
                    </p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-warehouse"></i>
                  </div>
                  <div className="detail-content">
                    <h3>
                      {isNl ? 'Vertegenwoordiging Nederland' : 'Netherlands Representation'}
                    </h3>
                    <p>
                      Van Soest International BV
                      <br />
                      {isNl
                        ? 'Centrale Europese logistiek & opslagondersteuning'
                        : 'Central European logistics & warehousing support'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-column animate-on-scroll">
              <div className="form-wrapper">
                <h3>{isNl ? 'Stuur ons een bericht' : 'Send us a message'}</h3>
                <p className="form-note">
                  {isNl ? 'Verplichte velden zijn gemarkeerd met *' : 'Required fields are marked with *'}
                </p>

                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="form_name">
                        {isNl ? 'Uw Naam *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        id="form_name"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="form_email">
                        {isNl ? 'E-mailadres *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        id="form_email"
                        required
                        placeholder={isNl ? 'john@bedrijf.nl' : 'john@company.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="form_phone">
                        {isNl ? 'Telefoonnummer' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        id="form_phone"
                        placeholder="+31 6 12345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="form_company">
                        {isNl ? 'Bedrijfsnaam' : 'Company Name'}
                      </label>
                      <input
                        type="text"
                        id="form_company"
                        placeholder={isNl ? 'Meubelfabriek B.V.' : 'Furniture Company Ltd'}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form_product_type">
                      {isNl ? 'Productinteresse *' : 'Product Interest *'}
                    </label>
                    <select
                      id="form_product_type"
                      required
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="" disabled>
                        {isNl ? 'Selecteer een categorie' : 'Select a category'}
                      </option>
                      <option value="dowels">
                        {isNl ? 'Beukenhouten Pluggen / Deuvels' : 'Beechwood Dowels / Pins'}
                      </option>
                      <option value="planed">
                        {isNl ? 'Vierzijdig Geschaafd Hout' : '4-Sides Planed Timber'}
                      </option>
                      <option value="profiles">
                        {isNl ? 'Houten Profielen & Sierlijsten' : 'Profiles & Mouldings'}
                      </option>
                      <option value="specials">
                        {isNl ? 'Speciale Componenten (Maatwerk)' : 'Special Components (Custom)'}
                      </option>
                      <option value="general">
                        {isNl ? 'Algemene Houtinkoop Aanvraag' : 'General Timber Sourcing'}
                      </option>
                      <option value="careers">
                        {isNl ? 'Sollicitatie / Werken bij' : 'Careers / Job Application'}
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form_message">
                      {isNl ? 'Bericht details *' : 'Message details *'}
                    </label>
                    <textarea
                      id="form_message"
                      rows="5"
                      required
                      placeholder={
                        isNl
                          ? 'Beschrijf uw gewenste afmetingen, aantallen en specificaties...'
                          : 'Describe your desired sizing, quantities, and specifications...'
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      isNl ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin icon-left"></i> Verzenden...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-spinner fa-spin icon-left"></i> Sending...
                        </>
                      )
                    ) : isNl ? (
                      <>
                        Verzend Aanvraag{' '}
                        <i className="fa-solid fa-paper-plane icon-right"></i>
                      </>
                    ) : (
                      <>
                        Submit Inquiry{' '}
                        <i className="fa-solid fa-paper-plane icon-right"></i>
                      </>
                    )}
                  </button>
                </form>

                {feedback && (
                  <div className={`form-feedback ${feedback.type}`}>
                    {feedback.text}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Direct Team Contacts */}
          <div className="team-contacts-section animate-on-scroll">
            <div className="text-center max-w-xl mx-auto mb-4" style={{ marginTop: '4.5rem' }}>
              <span className="section-badge">
                {isNl ? 'Direct Contact' : 'Direct Contact'}
              </span>
              <h3 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {isNl ? 'Neem rechtstreeks contact op met ons team' : 'Contact our team directly'}
              </h3>
              <p className="section-subtitle">
                {isNl
                  ? 'Neem contact op met onze afdelingshoofden voor specifieke vragen over bestellingen, inkoop en productie.'
                  : 'Get in touch with our department heads for specific questions regarding orders, purchasing, and production.'}
              </p>
            </div>

            <div className="team-grid">
              {Object.values(teamMemberData).map((member) => (
                <div
                  key={member.id}
                  className="team-card"
                  onClick={() => handleOpenModal(member)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="team-avatar">
                    <img src={member.avatar} alt={member.name} />
                  </div>
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role[currentLang]}</div>
                  <span className="team-languages">{member.languages[currentLang]}</span>
                  <a
                    href={`mailto:${member.email}`}
                    className="team-email-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fa-solid fa-envelope"></i> {member.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Profile Detail Modal */}
      {activeModalMember && (
        <div className={`team-modal ${modalActiveState ? 'active' : ''}`} id="teamModal">
          <div className="team-modal-overlay" onClick={handleCloseModal} />
          <div className="team-modal-container">
            <button
              className="team-modal-close"
              aria-label={isNl ? 'Sluiten' : 'Close'}
              onClick={handleCloseModal}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="team-modal-avatar">
              <img src={activeModalMember.avatar} alt={activeModalMember.name} />
            </div>
            <h2>{activeModalMember.name}</h2>
            <div className="team-modal-role">
              {activeModalMember.role[currentLang]}
            </div>
            <div className="team-modal-languages">
              {activeModalMember.languages[currentLang]}
            </div>
            <div className="team-modal-bio">
              {activeModalMember.bio[currentLang]}
            </div>

            <div className="team-modal-contacts">
              <a
                href={activeModalMember.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="team-contact-btn whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i>{' '}
                {isNl ? 'Direct WhatsApp-bericht' : 'Direct WhatsApp Chat'}
              </a>
              <a href={`tel:${activeModalMember.phone}`} className="team-contact-btn phone">
                <i className="fa-solid fa-phone"></i>{' '}
                {isNl ? 'Bellen naar kantoor' : 'Call Office Phone'}
              </a>
              <a href={`mailto:${activeModalMember.email}`} className="team-contact-btn email">
                <i className="fa-solid fa-envelope"></i>{' '}
                {isNl ? 'E-mail verzenden' : 'Send Direct Email'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
