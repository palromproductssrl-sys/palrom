'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInquiry } from './InquiryContext';

const teamMemberData = {
  gabriela: {
    id: 'gabriela',
    name: 'Gabriela Cioara',
    role: {
      nl: 'Algemeen Directeur',
      en: 'General Manager',
      de: 'Geschäftsführerin',
      ro: 'Director General'
    },
    avatar: '/images/gabriela.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
      de: 'Englisch, Rumänisch',
      ro: 'Engleză, Română'
    },
    bio: {
      nl: 'Gabriela leidt PALROM Products met meer dan 20 jaar ervaring in de B2B-houtindustrie. Zij richt zich op strategische groei, kwaliteitsborging en het behoud van onze premium FSC®-gecertificeerde toeleveringsketen.',
      en: 'Gabriela leads PALROM Products with over 20 years of experience in the B2B wood industry. She focuses on strategic growth, quality assurance, and maintaining our premium FSC®-certified supply chain.',
      de: 'Gabriela leitet PALROM Products mit über 20 Jahren Erfahrung in der B2B-Holzindustrie. Ihr Fokus liegt auf strategischem Wachstum, Qualitätssicherung und dem Erhalt unserer erstklassigen FSC®-zertifizierten Lieferkette.',
      ro: 'Gabriela conduce PALROM Products cu o experiență de peste 20 de ani în industria lemnului B2B. Ea se concentrează pe creșterea strategică, asigurarea calității și menținerea lanțului nostru premium de aprovizionare certificat FSC®.'
    },
    email: 'office@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Gabriela,%20ik%20heb%20een%20vraag%20over%20uw%20B2B-meubelcomponenten.',
  },
  adi: {
    id: 'adi',
    name: 'Adi Cîra',
    role: {
      nl: 'Productiemanager',
      en: 'Production Manager',
      de: 'Produktionsleiter',
      ro: 'Manager Producție'
    },
    avatar: '/images/adi_cira.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
      de: 'Englisch, Rumänisch',
      ro: 'Engleză, Română'
    },
    bio: {
      nl: 'Adi houdt toezicht op onze ultramoderne zagerij- en schaaflijnen. Hij vertaalt klantspecifieke millimetertekeningen naar efficiënte en foutloze massaproductie.',
      en: 'Adi oversees our state-of-the-art sawmill and planing lines. He translates client-specific millimeter drawings into efficient, defect-free bulk production runs.',
      de: 'Adi beaufsichtigt unsere hochmodernen Sägewerks- und Hobellinien. Er setzt kundenspezifische Millimeter-Zeichnungen in effiziente und fehlerfreie Massenproduktionsserien um.',
      ro: 'Adi supraveghează liniile noastre moderne de tăiere și rindeluire. El transpune desenele tehnice la nivel de milimetru ale clienților în loturi de producție în masă eficiente și fără defecte.'
    },
    email: 'production@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Adi,%20ik%20heb%20een%20technische%20vraag%20over%20de%20productie%20van%20houten%20componenten.',
  },
  ciprian: {
    id: 'ciprian',
    name: 'Ciprian Jude',
    role: {
      nl: 'Inkoopmanager',
      en: 'Purchase Manager',
      de: 'Einkaufsleiter',
      ro: 'Manager Achiziții'
    },
    avatar: '/images/ciprian.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
      de: 'Englisch, Rumänisch',
      ro: 'Engleză, Română'
    },
    bio: {
      nl: 'Ciprian beheert onze houtinkoop en logistiek. Hij zorgt ervoor dat al onze beukenhouten grondstoffen afkomstig zijn uit duurzaam beheerde lokale bossen in de regio Brad en Hunedoara.',
      en: 'Ciprian manages our timber procurement and logistics. He ensures all our beechwood raw materials are sourced sustainably from managed local forests in the Brad and Hunedoara regions.',
      de: 'Ciprian leitet unseren Holzeinkauf und die Logistik. Er stellt sicher, dass alle unsere Buchenholz-Rohstoffe nachhaltig aus bewirtschafteten lokalen Wäldern in den Regionen Brad und Hunedoara bezogen werden.',
      ro: 'Ciprian administrează achizițiile noastre de cherestea și logistica. El se asigură că toate materiile noastre prime din lemn de fag sunt obținute în mod durabil din păduri locale gestionate în regiunile Brad și Hunedoara.'
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
      de: 'Personalwesen (HR)',
      ro: 'Resurse Umane (HR)'
    },
    avatar: '/images/anca.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
      de: 'Englisch, Rumänisch',
      ro: 'Engleză, Română'
    },
    bio: {
      nl: 'Anca coördineert recruitment en personeelswelzijn binnen de Palrom-zagerij en -schaverij. Zij is uw directe aanspreekpunt voor openstaande vacatures en sollicitaties in Brad.',
      en: 'Anca coordinates recruitment and employee welfare within the Palrom sawmill and planing mill. She is your direct point of contact for open vacancies and job applications in Brad.',
      de: 'Anca koordiniert die Personalrekrutierung und das Wohlergehen der Mitarbeiter im Sägewerk und Hobelwerk in Brad. Sie ist Ihre direkte Ansprechpartnerin für offene Stellen und Bewerbungen.',
      ro: 'Anca coordonează recrutarea și bunăstarea angajaților în cadrul fabricii de cherestea și rindeluire Palrom din Brad. Ea este punctul dumneavoastră direct de contact pentru posturile vacante și aplicațiile de angajare.'
    },
    email: 'anca.mihut@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Anca,%20ik%20heb%20een%20vraag%20over%20carri%C3%A8remogelijkheden%20bij%20Palrom.',
  },
  bogdan: {
    id: 'bogdan',
    name: 'Bogdan Oprea',
    role: {
      nl: 'Orderverwerking',
      en: 'Order Intake',
      de: 'Auftragsabwicklung',
      ro: 'Preluare Comenzi'
    },
    avatar: '/images/bogdan_oprea.png',
    languages: {
      nl: 'Engels, Roemeens',
      en: 'English, Romanian',
      de: 'Englisch, Rumänisch',
      ro: 'Engleză, Română'
    },
    bio: {
      nl: 'Bogdan is verantwoordelijk voor B2B-orderinname, volume-offertes en leveringsplanning. Hij zorgt voor een snelle verwerking van aanvragen en stroomlijnt de administratieve flow.',
      en: 'Bogdan is responsible for B2B order intake, volume quotes, and delivery scheduling. He ensures fast processing of inquiries and streamlines the administrative flow.',
      de: 'Bogdan ist verantwortlich für die B2B-Auftragsabwicklung, Volumenangebote und Lieferplanung. Er sorgt für eine schnelle Bearbeitung von Anfragen und optimiert den administrativen Ablauf.',
      ro: 'Bogdan este responsabil de preluarea comenzilor B2B, ofertele de volum și programarea livrărilor. El asigură procesarea rapidă a cererilor și eficientizează fluxul administrativ.'
    },
    email: 'orders@palromproducts.ro',
    phone: '+40254606053',
    whatsapp: 'https://wa.me/40254606053?text=Hallo%20Bogdan,%20ik%20wil%20graag%20de%20status%20van%20een%20order%20of%20een%20offerteaanvraag%20bespreken.',
  },
};

export default function ContactSection() {
  const { lang } = useInquiry();

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

  const t = {
    validationError: {
      nl: 'Vul alstublieft alle verplichte velden in.',
      en: 'Please fill out all required fields.',
      de: 'Bitte füllen Sie alle Pflichtfelder aus.',
      ro: 'Vă rugăm să completați toate câmpurile obligatorii.'
    },
    contactBadge: {
      nl: 'Contact & Offerte',
      en: 'Contact & Quote',
      de: 'Kontakt & Angebot',
      ro: 'Contact & Ofertă'
    },
    contactTitle: {
      nl: 'Vraag direct een offerte aan',
      en: 'Request a direct quote',
      de: 'Fordern Sie ein direktes Angebot an',
      ro: 'Solicitați o ofertă directă'
    },
    contactDesc: {
      nl: 'Wij reageren binnen 24 uur. Neem direct contact op met ons hoofdkantoor in Brad of vul het contactformulier in voor een snelle, vrijblijvende prijsopgave.',
      en: 'We reply within 24 hours. Contact our Brad headquarters directly or fill out the contact form for a quick, non-binding quote.',
      de: 'Wir antworten innerhalb von 24 Stunden. Kontaktieren Sie unsere Zentrale in Brad direkt oder füllen Sie das Kontaktformular aus für ein schnelles, unverbindliches Angebot.',
      ro: 'Răspundem în termen de 24 de ore. Contactați sediul nostru din Brad direct sau completați formularul de contact pentru o ofertă rapidă, fără obligații.'
    },
    hqSawmill: {
      nl: 'Hoofdkantoor & Zagerij',
      en: 'Headquarters & Sawmill',
      de: 'Hauptsitz & Sägewerk',
      ro: 'Sediu Central & Gater'
    },
    romania: {
      nl: 'ROEMENIË',
      en: 'ROMANIA',
      de: 'RUMÄNIEN',
      ro: 'ROMÂNIA'
    },
    phoneFax: {
      nl: 'Telefoon',
      en: 'Phone',
      de: 'Telefon',
      ro: 'Telefon'
    },
    emailAddr: {
      nl: 'E-mailadres',
      en: 'Email Address',
      de: 'E-Mail-Adresse',
      ro: 'Adresă de E-mail'
    },
    nlRep: {
      nl: 'Vertegenwoordiging Nederland',
      en: 'Netherlands Representation',
      de: 'Vertretung in den Niederlanden',
      ro: 'Reprezentanța în Olanda'
    },
    nlRepDesc: {
      nl: 'Centrale Europese logistiek & opslagondersteuning',
      en: 'Central European logistics & warehousing support',
      de: 'Zentraleuropäische Logistik- und Lagerunterstützung',
      ro: 'Suport logistic și de depozitare în Europa Centrală'
    },
    sendMsg: {
      nl: 'Stuur ons een bericht',
      en: 'Send us a message',
      de: 'Schreiben Sie uns eine Nachricht',
      ro: 'Trimiteți-ne un mesaj'
    },
    requiredFields: {
      nl: 'Verplichte velden zijn gemarkeerd met *',
      en: 'Required fields are marked with *',
      de: 'Pflichtfelder sind mit * gekennzeichnet',
      ro: 'Câmpurile obligatorii sunt marcate cu *'
    },
    yourName: {
      nl: 'Uw Naam *',
      en: 'Your Name *',
      de: 'Ihr Name *',
      ro: 'Numele Dvs. *'
    },
    emailAddressLabel: {
      nl: 'E-mailadres *',
      en: 'Email Address *',
      de: 'E-Mail-Adresse *',
      ro: 'Adresă de E-mail *'
    },
    phoneNumberLabel: {
      nl: 'Telefoonnummer',
      en: 'Phone Number',
      de: 'Telefonnummer',
      ro: 'Număr de Telefon'
    },
    companyNameLabel: {
      nl: 'Bedrijfsnaam',
      en: 'Company Name',
      de: 'Firmenname',
      ro: 'Numele Companiei'
    },
    productInterestLabel: {
      nl: 'Productinteresse *',
      en: 'Product Interest *',
      de: 'Produktinteresse *',
      ro: 'Interes Produs *'
    },
    selectCategory: {
      nl: 'Selecteer een categorie',
      en: 'Select a category',
      de: 'Kategorie auswählen',
      ro: 'Selectați o categorie'
    },
    interestDowels: {
      nl: 'Beukenhouten stokken',
      en: 'Beechwood sticks',
      de: 'Buchenholzstäbe',
      ro: 'Tije din lemn de fag'
    },
    interestPlaned: {
      nl: 'Beukenhouten latten',
      en: 'Beechwood slats',
      de: 'Buchenholzleisten',
      ro: 'Șipci din lemn de fag'
    },
    interestProfiles: {
      nl: 'Beukenhouten profielen',
      en: 'Beechwood profiles',
      de: 'Buchenholzprofile',
      ro: 'Profile din lemn de fag'
    },
    interestSpecials: {
      nl: 'Beukenhouten bestekken',
      en: 'Beechwood blanks',
      de: 'Buchenholz-Zuschnitte',
      ro: 'Piese brute din lemn de fag'
    },
    interestGeneral: {
      nl: 'Algemene Houtinkoop Aanvraag',
      en: 'General Timber Sourcing',
      de: 'Allgemeine Holzanfrage',
      ro: 'Cerere Generală de Aprovizionare'
    },
    interestCareers: {
      nl: 'Sollicitatie / Werken bij',
      en: 'Careers / Job Application',
      de: 'Karriere / Bewerbung',
      ro: 'Cariere / Solicitare Job'
    },
    messageLabel: {
      nl: 'Bericht details *',
      en: 'Message details *',
      de: 'Nachrichtendetails *',
      ro: 'Detalii Mesaj *'
    },
    messagePlaceholder: {
      nl: 'Beschrijf uw gewenste afmetingen, aantallen en specificaties...',
      en: 'Describe your desired sizing, quantities, and specifications...',
      de: 'Beschreiben Sie Ihre gewünschten Maße, Mengen und Spezifikationen...',
      ro: 'Descrieți dimensiunile, cantitățile și specificațiile dorite...'
    },
    submitBtn: {
      nl: 'Verzend Aanvraag',
      en: 'Submit Inquiry',
      de: 'Anfrage absenden',
      ro: 'Trimite Solicitarea'
    },
    sendingBtn: {
      nl: 'Verzenden...',
      en: 'Sending...',
      de: 'Wird gesendet...',
      ro: 'Se trimite...'
    },
    directContactBadge: {
      nl: 'Direct Contact',
      en: 'Direct Contact',
      de: 'Direkter Kontakt',
      ro: 'Contact Direct'
    },
    directContactTitle: {
      nl: 'Neem rechtstreeks contact op met ons team',
      en: 'Contact our team directly',
      de: 'Wenden Sie sich direkt an unser Team',
      ro: 'Contactați direct echipa noastră'
    },
    directContactSub: {
      nl: 'Neem contact op met onze afdelingshoofden voor specifieke vragen over bestellingen, inkoop en productie.',
      en: 'Get in touch with our department heads for specific questions regarding orders, purchasing, and production.',
      de: 'Wenden Sie sich an unsere Abteilungsleiter bei spezifischen Fragen zu Bestellungen, Einkauf und Produktion.',
      ro: 'Contactați șefii noștri de departament pentru întrebări specifice referitoare la comenzi, achiziții și producție.'
    },
    whatsappBtn: {
      nl: 'Direct WhatsApp-bericht',
      en: 'Direct WhatsApp Chat',
      de: 'Direkter WhatsApp-Chat',
      ro: 'Chat Direct pe WhatsApp'
    },
    callOfficeBtn: {
      nl: 'Bellen naar kantoor',
      en: 'Call Office Phone',
      de: 'Büronummer anrufen',
      ro: 'Sunați la Birou'
    },
    emailBtn: {
      nl: 'E-mail verzenden',
      en: 'Send Direct Email',
      de: 'E-Mail senden',
      ro: 'Trimite E-mail Direct'
    },
    closeBtn: {
      nl: 'Sluiten',
      en: 'Close',
      de: 'Schließen',
      ro: 'Închide'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !productType || !message.trim()) {
      setFeedback({
        text: getTranslation('validationError'),
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          productType: productType,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Contact submission failed');
      }

      let feedbackMsg = '';
      const feedbackMsgs = {
        nl: {
          careers: 'sollicitatie is ontvangen door onze afdeling Personeelszaken (HR)',
          general: `aanvraag voor onze "${productType}" beukenhouten producten is verzonden naar ons kantoor in Brad`
        },
        en: {
          careers: 'application has been received by our Human Resources department',
          general: `inquiry regarding our "${productType}" beechwood products has been sent to our Brad office`
        },
        de: {
          careers: 'Bewerbung ist bei unserer Personalabteilung (HR) eingegangen',
          general: `Anfrage bezüglich unserer "${productType}" Buchenholzprodukte wurde an unser Büro in Brad gesendet`
        },
        ro: {
          careers: 'candidatura a fost primită de departamentul nostru de Resurse Umane (HR)',
          general: `solicitarea pentru produsele noastre din lemn de fag "${productType}" a fost trimisă la biroul nostru din Brad`
        }
      };

      const currentMsgs = feedbackMsgs[lang] || feedbackMsgs.nl;
      const productMsg = productType === 'careers' ? currentMsgs.careers : currentMsgs.general;

      if (lang === 'nl') {
        feedbackMsg = `Bedankt, ${name}! Uw ${productMsg}. We reageren binnen 24 uur.`;
      } else if (lang === 'de') {
        feedbackMsg = `Vielen Dank, ${name}! Ihre ${productMsg}. Wir werden innerhalb von 24 Stunden antworten.`;
      } else if (lang === 'ro') {
        feedbackMsg = `Vă mulțumim, ${name}! Solicitarea dvs. pentru ${productMsg}. Vom răspunde în termen de 24 de ore.`;
      } else {
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
    } catch (err) {
      console.error(err);
      const errorMsgs = {
        nl: 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.',
        en: 'Something went wrong while submitting. Please try again later.',
        de: 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.',
        ro: 'A apărut o eroare la trimitere. Vă rugăm să încercați din nou mai târziu.'
      };
      setFeedback({
        text: errorMsgs[lang] || errorMsgs.nl,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="contact-section section-padding">
        <div className="container">
          <div className="grid grid-2">
            {/* Contact Info */}
            <div className="contact-info-column animate-on-scroll">
              <span className="section-badge">
                {getTranslation('contactBadge')}
              </span>
              <h2 className="section-title">
                {getTranslation('contactTitle')}
              </h2>
              <p className="section-description">
                {getTranslation('contactDesc')}
              </p>

              {/* Contact details */}
              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="detail-content">
                    <h3>{getTranslation('hqSawmill')}</h3>
                    <p>
                      PALROM Products SRL
                      <br />8 Poienita St, Brad City, Hunedoara
                      <br />335200, {getTranslation('romania')}
                    </p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="detail-content">
                    <h3>{getTranslation('phoneFax')}</h3>
                    <p>
                      Tel: +40 254.60.60.53
                    </p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="detail-content">
                    <h3>{getTranslation('emailAddr')}</h3>
                    <p>
                      <a href="mailto:office@palromproducts.ro">office@palromproducts.ro</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-column animate-on-scroll">
              <div className="form-wrapper">
                <h3>{getTranslation('sendMsg')}</h3>
                <p className="form-note">
                  {getTranslation('requiredFields')}
                </p>

                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="form_name">
                        {getTranslation('yourName')}
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
                        {getTranslation('emailAddressLabel')}
                      </label>
                      <input
                        type="email"
                        id="form_email"
                        required
                        placeholder={lang === 'nl' ? 'john@bedrijf.nl' : 'john@company.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="form_phone">
                        {getTranslation('phoneNumberLabel')}
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
                        {getTranslation('companyNameLabel')}
                      </label>
                      <input
                        type="text"
                        id="form_company"
                        placeholder={lang === 'nl' ? 'Meubelfabriek B.V.' : 'Furniture Company Ltd'}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form_product_type">
                      {getTranslation('productInterestLabel')}
                    </label>
                    <select
                      id="form_product_type"
                      required
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="" disabled>
                        {getTranslation('selectCategory')}
                      </option>
                      <option value="dowels">
                        {getTranslation('interestDowels')}
                      </option>
                      <option value="planed">
                        {getTranslation('interestPlaned')}
                      </option>
                      <option value="profiles">
                        {getTranslation('interestProfiles')}
                      </option>
                      <option value="specials">
                        {getTranslation('interestSpecials')}
                      </option>
                      <option value="general">
                        {getTranslation('interestGeneral')}
                      </option>
                      <option value="careers">
                        {getTranslation('interestCareers')}
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form_message">
                      {getTranslation('messageLabel')}
                    </label>
                    <textarea
                      id="form_message"
                      rows="5"
                      required
                      placeholder={getTranslation('messagePlaceholder')}
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
                      <>
                        <i className="fa-solid fa-spinner fa-spin icon-left"></i> {getTranslation('sendingBtn')}
                      </>
                    ) : (
                      <>
                        {getTranslation('submitBtn')}{' '}
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
                {getTranslation('directContactBadge')}
              </span>
              <h3 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {getTranslation('directContactTitle')}
              </h3>
              <p className="section-subtitle">
                {getTranslation('directContactSub')}
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
                  <div className="team-role">{member.role[lang] || member.role.nl}</div>
                  <span className="team-languages">{member.languages[lang] || member.languages.nl}</span>
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
              aria-label={getTranslation('closeBtn')}
              onClick={handleCloseModal}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="team-modal-avatar">
              <img src={activeModalMember.avatar} alt={activeModalMember.name} />
            </div>
            <h2>{activeModalMember.name}</h2>
            <div className="team-modal-role">
              {activeModalMember.role[lang] || activeModalMember.role.nl}
            </div>
            <div className="team-modal-languages">
              {activeModalMember.languages[lang] || activeModalMember.languages.nl}
            </div>
            <div className="team-modal-bio">
              {activeModalMember.bio[lang] || activeModalMember.bio.nl}
            </div>

            <div className="team-modal-contacts">
              <a
                href={activeModalMember.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="team-contact-btn whatsapp"
              >
                <i className="fa-brands fa-whatsapp"></i>{' '}
                {getTranslation('whatsappBtn')}
              </a>
              <a href={`tel:${activeModalMember.phone}`} className="team-contact-btn phone">
                <i className="fa-solid fa-phone"></i>{' '}
                {getTranslation('callOfficeBtn')}
              </a>
              <a href={`mailto:${activeModalMember.email}`} className="team-contact-btn email">
                <i className="fa-solid fa-envelope"></i>{' '}
                {getTranslation('emailBtn')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
