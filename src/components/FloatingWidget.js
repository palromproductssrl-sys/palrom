'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInquiry } from './InquiryContext';

const teamMembers = [
  {
    id: 'willem',
    name: 'Willem Roest',
    role: {
      nl: 'Vertegenwoordiging Nederland',
      en: 'Netherlands Representative',
      de: 'Vertreter Niederlande',
      ro: 'Reprezentant Olanda'
    },
    avatar: '/images/willem.png',
    languages: {
      nl: 'Nederlands, Engels, Duits',
      en: 'Dutch, English, German',
      de: 'Niederländisch, Englisch, Deutsch',
      ro: 'Olandeză, Engleză, Germană'
    },
    phone: '31628621019',
    greetings: {
      nl: "Hallo Willem, ik heb een vraag over uw B2B-meubelcomponenten.",
      en: "Hello Willem, I have a question about your B2B furniture components.",
      de: "Hallo Willem, ich habe eine Frage zu Ihren B2B-Möbelkomponenten.",
      ro: "Bună ziua Willem, am o întrebare despre componentele dvs. de mobilier B2B."
    }
  },
  {
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
    phone: '40254606053',
    greetings: {
      nl: "Hallo Gabriela, ik heb een vraag over uw B2B-meubelcomponenten.",
      en: "Hello Gabriela, I have a question about your B2B furniture components.",
      de: "Hallo Gabriela, ich habe eine Frage zu Ihren B2B-Möbelkomponenten.",
      ro: "Bună ziua Gabriela, am o întrebare despre componentele dvs. de mobilier B2B."
    }
  },
  {
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
    phone: '40254606053',
    greetings: {
      nl: "Hallo Bogdan, ik wil graag de status van een order of een offerteaanvraag bespreken.",
      en: "Hello Bogdan, I would like to discuss the status of an order or a quote request.",
      de: "Hallo Bogdan, ich möchte den Status einer Bestellung oder einer Angebotsanfrage besprechen.",
      ro: "Bună ziua Bogdan, aș dori să discut despre stadiul unei comenzi sau al unei cereri de ofertă."
    }
  },
  {
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
    phone: '40254606053',
    greetings: {
      nl: "Hallo Adi, ik heb een technische vraag over de productie van houten componenten.",
      en: "Hello Adi, I have a technical question about the production of wooden components.",
      de: "Hallo Adi, ich habe eine technische Frage zur Herstellung von Holzkomponenten.",
      ro: "Bună ziua Adi, am o întrebare tehnică despre producția componentelor din lemn."
    }
  },
  {
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
    phone: '40254606053',
    greetings: {
      nl: "Hallo Ciprian, ik wil graag de beschikbaarheid en inkoop van hout bespreken.",
      en: "Hello Ciprian, I would like to discuss wood availability and purchasing.",
      de: "Hallo Ciprian, ich möchte die Verfügbarkeit und den Einkauf von Holz besprechen.",
      ro: "Bună ziua Ciprian, aș dori să discut despre disponibilitatea și achiziția de lemn."
    }
  },
  {
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
    phone: '40254606053',
    greetings: {
      nl: "Hallo Anca, ik heb een vraag over carrièremogelijkheden bij Palrom.",
      en: "Hello Anca, I have a question about career opportunities at Palrom.",
      de: "Hallo Anca, ich habe eine Frage zu Karrieremöglichkeiten bei Palrom.",
      ro: "Bună ziua Anca, am o întrebare despre oportunitățile de carieră la Palrom."
    }
  }
];

const t = {
  headerTitle: {
    nl: 'PALROM B2B Support',
    en: 'PALROM B2B Support',
    de: 'PALROM B2B-Support',
    ro: 'Suport B2B PALROM'
  },
  headerSubtitle: {
    nl: 'Chat direct via WhatsApp met ons team',
    en: 'Chat directly via WhatsApp with our team',
    de: 'Chatten Sie direkt per WhatsApp mit uns',
    ro: 'Discutați direct pe WhatsApp cu echipa'
  },
  languagesLabel: {
    nl: 'Spreekt:',
    en: 'Speaks:',
    de: 'Spricht:',
    ro: 'Vorbește:'
  },
  chatBtn: {
    nl: 'Chat',
    en: 'Chat',
    de: 'Chat',
    ro: 'Chat'
  },
  footerText: {
    nl: 'We reageren doorgaans binnen 24 uur.',
    en: 'We typically reply within 24 hours.',
    de: 'Wir antworten in der Regel binnen 24 Std.',
    ro: 'De obicei răspundem în 24 de ore.'
  },
  closeBtn: {
    nl: 'Sluit venster',
    en: 'Close window',
    de: 'Fenster schließen',
    ro: 'Închide fereastra'
  },
  triggerLabel: {
    nl: 'Open WhatsApp Support',
    en: 'Open WhatsApp Support',
    de: 'WhatsApp-Support öffnen',
    ro: 'Deschide suportul WhatsApp'
  }
};

export default function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useInquiry();
  const activeLang = lang || 'nl';
  const widgetRef = useRef(null);

  // Close when clicking outside the widget
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close when pressing Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={`floating-whatsapp-widget ${isOpen ? 'active' : ''}`} 
      ref={widgetRef} 
      id="floatingWhatsapp"
    >
      {/* WhatsApp Card Window */}
      <div className="whatsapp-card">
        {/* Card Header */}
        <div className="whatsapp-card-header">
          <div className="whatsapp-header-info">
            <div className="whatsapp-header-icon-container">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h4>{t.headerTitle[activeLang]}</h4>
              <p>{t.headerSubtitle[activeLang]}</p>
            </div>
          </div>
          <button 
            className="whatsapp-card-close" 
            onClick={() => setIsOpen(false)} 
            aria-label={t.closeBtn[activeLang]}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Card Body - Team List */}
        <div className="whatsapp-card-body">
          {teamMembers.map((member) => {
            const greeting = member.greetings[activeLang] || member.greetings.nl;
            const waLink = `https://wa.me/${member.phone}?text=${encodeURIComponent(greeting)}`;
            return (
              <div className="whatsapp-member-row" key={member.id}>
                <div className="whatsapp-member-avatar-wrapper">
                  <img src={member.avatar} alt={member.name} className="whatsapp-member-avatar" />
                  <span className="whatsapp-online-badge"></span>
                </div>
                <div className="whatsapp-member-details">
                  <span className="whatsapp-member-name">{member.name}</span>
                  <span className="whatsapp-member-role">{member.role[activeLang] || member.role.nl}</span>
                  <span className="whatsapp-member-languages">
                    <strong>{t.languagesLabel[activeLang]}</strong> {member.languages[activeLang] || member.languages.nl}
                  </span>
                </div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-member-chat-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>{t.chatBtn[activeLang]}</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Card Footer */}
        <div className="whatsapp-card-footer">
          <p>{t.footerText[activeLang]}</p>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button 
        className="whatsapp-trigger-btn" 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={t.triggerLabel[activeLang]}
        aria-expanded={isOpen}
      >
        <div className="whatsapp-trigger-icon-wrapper">
          <i className={`fa-brands fa-whatsapp whatsapp-icon-open ${isOpen ? 'hidden' : ''}`}></i>
          <i className={`fa-solid fa-xmark whatsapp-icon-close ${isOpen ? '' : 'hidden'}`}></i>
        </div>
        <span className="whatsapp-pulse-ring"></span>
        <span className="whatsapp-trigger-badge">1</span>
      </button>
    </div>
  );
}
