'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useInquiry } from './InquiryContext';

const translations = {
  launcherTooltip: {
    nl: 'Chat met PAL (AI)',
    en: 'Chat with PAL (AI)',
    de: 'Chat mit PAL (KI)',
    ro: 'Chat cu PAL (AI)'
  },
  statusOnline: {
    nl: 'Online • B2B Houtadviseur',
    en: 'Online • B2B Timber Advisor',
    de: 'Online • B2B-Holzberater',
    ro: 'Online • Consilier Lemn B2B'
  },
  resetTooltip: {
    nl: 'Gesprek wissen',
    en: 'Clear chat',
    de: 'Chat löschen',
    ro: 'Șterge conversația'
  },
  closeTooltip: {
    nl: 'Sluit assistent',
    en: 'Close assistant',
    de: 'Schließen',
    ro: 'Închide'
  },
  inputPlaceholder: {
    nl: 'Stel een vraag over blanks, stokken, levertijden...',
    en: 'Ask a question about blanks, dowels, delivery...',
    de: 'Fragen Sie nach Blanks, Rundstäben, Lieferzeiten...',
    ro: 'Întrebați despre frize, tije cilindrice, livrare...'
  },
  sendAria: {
    nl: 'Verstuur bericht',
    en: 'Send message',
    de: 'Nachricht senden',
    ro: 'Trimite mesajul'
  },
  footerBrand: {
    nl: 'PALROM B2B Assistent • Aangedreven door PAL AI',
    en: 'PALROM B2B Assistant • Powered by PAL AI',
    de: 'PALROM B2B-Assistent • Unterstützt durch PAL KI',
    ro: 'Asistent B2B PALROM • Susținut de PAL AI'
  },
  quickChips: {
    nl: [
      { text: '🪵 Welke houtproducten maken jullie?', query: 'Welke houtproducten maken jullie?' },
      { text: '📐 Help mij een offerte samenstellen', query: 'Ik wil graag een offerte samenstellen voor maatwerk hout.' },
      { text: '⏱️ Wat is de minimale afname (MOQ)?', query: 'Wat is jullie minimale bestelhoeveelheid (MOQ)?' },
      { text: '📍 Waar staat jullie fabriek?', query: 'Waar is jullie fabriek en zagerij gevestigd?' }
    ],
    en: [
      { text: '🪵 What wood products do you make?', query: 'What timber products do you manufacture?' },
      { text: '📐 Help me configure a quote', query: 'I would like to configure a custom quote for timber products.' },
      { text: '⏱️ What is the minimum order quantity (MOQ)?', query: 'What is your minimum order quantity (MOQ)?' },
      { text: '📍 Where is your factory located?', query: 'Where is your sawmill and factory located?' }
    ],
    de: [
      { text: '🪵 Welche Holzprodukte stellen Sie her?', query: 'Welche Holzprodukte stellen Sie her?' },
      { text: '📐 Angebot zusammenstellen', query: 'Ich möchte ein Angebot für Buchenholz zusammenstellen.' },
      { text: '⏱️ Mindestbestellmenge (MOQ)', query: 'Wie hoch ist die Mindestbestellmenge?' },
      { text: '📍 Wo befindet sich das Sägewerk?', query: 'Wo befindet sich Ihr Sägewerk und Werk?' }
    ],
    ro: [
      { text: '🪵 Ce produse din lemn fabricați?', query: 'Ce produse din lemn produceți?' },
      { text: '📐 Configurează o ofertă', query: 'Doresc să configurez o ofertă de preț pentru produse din fag.' },
      { text: '⏱️ Cantitate minimă de comandă (MOQ)', query: 'Care este cantitatea minimă pe care o puteți livra?' },
      { text: '📍 Unde este fabrica voastră?', query: 'Unde se află fabrica și gaterul vostru?' }
    ]
  },
  welcomeMessage: {
    nl: "Hallo! Ik ben **PAL**, uw virtuele B2B-assistent voor PALROM Products. 🪵\n\nIk help u graag met specificaties, afmetingen van onze beukenhouten producten (blanks, deuvels, latten, profielen), droging (KD 8-12%) of het opstellen van een offerte op maat.\n\nWaarmee kan ik u van dienst zijn?",
    en: "Hello! I am **PAL**, your virtual B2B advisor for PALROM Products. 🪵\n\nI can help you with timber specifications, dimensions of our beechwood products (blanks, dowels, slats, profiles), kiln-drying (KD 8-12%), or setting up a custom quote.\n\nHow can I help you today?",
    de: "Hallo! Ich bin **PAL**, Ihr virtueller B2B-Berater für PALROM Products. 🪵\n\nIch helfe Ihnen gerne bei Spezifikationen, Maßen unserer Buchenholzprodukte (Blanks, Rundstäbe, Leisten, Profile), Kammertrocknung (KD 8-12%) oder bei der Erstellung eines Angebots.\n\nWie kann ich Ihnen behilflich sein?",
    ro: "Bună ziua! Sunt **PAL**, consilierul dvs. virtual B2B pentru PALROM Products. 🪵\n\nVă pot ajuta cu specificații, dimensiuni ale produselor din lemn de fag (frize, tije cilindrice, șipci, profile), uscare în uscător (KD 8-12%) sau configurarea unei oferte.\n\nCu ce vă pot fi de folos?"
  }
};

export default function PalAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { lang } = useInquiry();
  const activeLang = lang || 'nl';
  
  const chatMessagesEndRef = useRef(null);
  const widgetRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize welcome message when language changes or first load
  useEffect(() => {
    if (!hasInteracted) {
      setMessages([
        {
          id: 'welcome',
          role: 'bot',
          text: translations.welcomeMessage[activeLang] || translations.welcomeMessage.nl,
          actions: [
            { label: activeLang === 'nl' ? 'Start Offerte Configurator' : (activeLang === 'de' ? 'Angebotskonfigurator' : (activeLang === 'ro' ? 'Configurator Oferte' : 'Start Configurator')), url: '/configurator' },
            { label: activeLang === 'nl' ? 'Bekijk Houtproducten' : (activeLang === 'de' ? 'Produkte ansehen' : (activeLang === 'ro' ? 'Catalog Produse' : 'View Wood Products')), url: '/#products' }
          ]
        }
      ]);
    }
  }, [activeLang, hasInteracted]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        // do not auto-close if clicked, keep friendly or close if preferred
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const message = (textToSend || inputValue).trim();
    if (!message || isLoading) return;

    setHasInteracted(true);
    setInputValue('');

    const userMsgId = 'user-' + Date.now();
    const newMessages = [...messages, { id: userMsgId, role: 'user', text: message }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: newMessages.slice(-6),
          lang: activeLang
        })
      });

      if (!response.ok) {
        throw new Error('API response failed');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'bot',
          text: data.reply || (activeLang === 'nl' ? 'Dank voor uw bericht! Neem gerust contact met ons op via office@palromproducts.ro' : 'Thank you for your message! Feel free to reach out via office@palromproducts.ro'),
          actions: data.actions || []
        }
      ]);
    } catch (err) {
      console.error('PAL Assistant Error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          role: 'bot',
          text: activeLang === 'nl'
            ? 'Excuses, er trad een kleine verbindingsfout op. U kunt direct mailen naar **office@palromproducts.ro** of onze configurator openen.'
            : 'Apologies, a temporary connection error occurred. Please contact us at **office@palromproducts.ro** or use our configurator.',
          actions: [{ label: 'Start Configurator', url: '/configurator' }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setHasInteracted(false);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'bot',
        text: translations.welcomeMessage[activeLang] || translations.welcomeMessage.nl,
        actions: [
          { label: activeLang === 'nl' ? 'Start Offerte Configurator' : 'Start Configurator', url: '/configurator' },
          { label: activeLang === 'nl' ? 'Bekijk Houtproducten' : 'View Products', url: '/#products' }
        ]
      }
    ]);
  };

  // Quick chips
  const chips = translations.quickChips[activeLang] || translations.quickChips.nl;

  return (
    <div className={`pal-assistant-container ${isOpen ? 'active' : ''}`} ref={widgetRef} id="palAssistantWidget">
      
      {/* Floating Launcher Button */}
      <button
        className="pal-launcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? translations.closeTooltip[activeLang] : translations.launcherTooltip[activeLang]}
        aria-expanded={isOpen}
      >
        <div className="pal-launcher-icon">
          {isOpen ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <>
              <i className="fa-solid fa-robot"></i>
              <span className="pal-launcher-glow"></span>
            </>
          )}
        </div>
        
        {!isOpen && (
          <span className="pal-launcher-pill">
            <span className="pal-pulse-dot"></span>
            <strong>PAL</strong> AI
          </span>
        )}
      </button>

      {/* Chat Window Card */}
      <div className="pal-chat-card" role="dialog" aria-label="PAL Virtual Assistant">
        
        {/* Header */}
        <div className="pal-chat-header">
          <div className="pal-header-profile">
            <div className="pal-avatar-wrap">
              <i className="fa-solid fa-robot"></i>
              <span className="pal-avatar-status"></span>
            </div>
            <div className="pal-header-titles">
              <h4>PAL <span>AI</span></h4>
              <p>{translations.statusOnline[activeLang]}</p>
            </div>
          </div>

          <div className="pal-header-actions">
            <button 
              className="pal-btn-icon" 
              onClick={handleClearChat}
              title={translations.resetTooltip[activeLang]}
              aria-label={translations.resetTooltip[activeLang]}
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
            <button 
              className="pal-btn-icon" 
              onClick={() => setIsOpen(false)}
              title={translations.closeTooltip[activeLang]}
              aria-label={translations.closeTooltip[activeLang]}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="pal-chat-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`pal-message-bubble ${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="pal-bubble-avatar">
                  <i className="fa-solid fa-robot"></i>
                </div>
              )}
              <div className="pal-bubble-content">
                <div className="pal-bubble-text" dangerouslySetInnerHTML={{ 
                  __html: (msg.text || '')
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/•/g, '&bull;')
                }} />

                {/* Render Suggested Action Buttons if present */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="pal-bubble-actions">
                    {msg.actions.map((act, idx) => {
                      if (act.isExternal) {
                        return (
                          <a 
                            key={idx} 
                            href={act.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="pal-action-chip"
                          >
                            <span>{act.label}</span>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          </a>
                        );
                      }
                      return (
                        <Link 
                          key={idx} 
                          href={act.url} 
                          className="pal-action-chip" 
                          onClick={() => {
                            if (act.url.startsWith('/#')) {
                              setIsOpen(false);
                            }
                          }}
                        >
                          <span>{act.label}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="pal-message-bubble bot pal-typing-row">
              <div className="pal-bubble-avatar">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="pal-typing-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={chatMessagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pal-quick-chips-wrapper">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              className="pal-quick-chip-btn"
              onClick={() => handleSendMessage(chip.query)}
              disabled={isLoading}
            >
              {chip.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          className="pal-chat-footer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="pal-chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={translations.inputPlaceholder[activeLang]}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="pal-send-btn"
            disabled={!inputValue.trim() || isLoading}
            aria-label={translations.sendAria[activeLang]}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>

        {/* Bottom Subtext */}
        <div className="pal-footer-note">
          <p>{translations.footerBrand[activeLang]}</p>
        </div>

      </div>

    </div>
  );
}
