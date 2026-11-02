'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useInquiry } from './InquiryContext';

// Custom Wooden Robot Icon - Handcrafted in Light European Beechwood for PAL
export function WoodenRobotIcon({ size = 32, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        {/* Light Natural Beechwood Gradient */}
        <linearGradient id="palLightBeechHead" x1="12" y1="12" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#faecd6" />
          <stop offset="35%" stopColor="#f3ddbe" />
          <stop offset="75%" stopColor="#e5c599" />
          <stop offset="100%" stopColor="#cca36e" />
        </linearGradient>

        {/* Light Beech Dowel Gradient for Ears & Antenna */}
        <linearGradient id="palLightDowelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbedd8" />
          <stop offset="50%" stopColor="#e2be8e" />
          <stop offset="100%" stopColor="#b88950" />
        </linearGradient>

        {/* Subtle 3D Chamfer Highlight */}
        <linearGradient id="palBevelHighlight" x1="12" y1="13" x2="52" y2="13" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>

        {/* Dark Inset Visor Screen */}
        <linearGradient id="palVisorScreen" x1="18" y1="23" x2="46" y2="47" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
      </defs>

      {/* Shadow underneath */}
      <ellipse cx="32" cy="58" rx="20" ry="2.5" fill="#000000" opacity="0.3" />

      {/* Light Wooden Dowel Antenna with Golden Tip */}
      <rect x="30" y="4" width="4" height="11" rx="2" fill="url(#palLightDowelGrad)" stroke="#9c703b" strokeWidth="0.8" />
      <line x1="30.5" y1="9" x2="33.5" y2="9" stroke="#9c703b" strokeWidth="0.8" />
      <circle cx="32" cy="5" r="4.5" fill="#e7b124" stroke="#a07238" strokeWidth="1" />
      <circle cx="30.8" cy="3.8" r="1.5" fill="#ffffff" opacity="0.9" />

      {/* Left Wooden Dowel Ear (Grooved Beech Dowel Stick) */}
      <rect x="3.5" y="27" width="8.5" height="12" rx="3.5" fill="url(#palLightDowelGrad)" stroke="#9c703b" strokeWidth="0.8" />
      <line x1="6.5" y1="29.5" x2="6.5" y2="36.5" stroke="#9c703b" strokeWidth="0.9" opacity="0.8" />
      <line x1="9" y1="29.5" x2="9" y2="36.5" stroke="#9c703b" strokeWidth="0.9" opacity="0.8" />

      {/* Right Wooden Dowel Ear */}
      <rect x="52" y="27" width="8.5" height="12" rx="3.5" fill="url(#palLightDowelGrad)" stroke="#9c703b" strokeWidth="0.8" />
      <line x1="55" y1="29.5" x2="55" y2="36.5" stroke="#9c703b" strokeWidth="0.9" opacity="0.8" />
      <line x1="57.5" y1="29.5" x2="57.5" y2="36.5" stroke="#9c703b" strokeWidth="0.9" opacity="0.8" />

      {/* Main Wooden Head Block in Light Natural Beech */}
      <rect x="10" y="14" width="44" height="42" rx="10" fill="url(#palLightBeechHead)" stroke="#9c703b" strokeWidth="1.2" />

      {/* Top Edge 3D Wood Chamfer Highlight */}
      <path d="M 18 15 L 46 15" stroke="url(#palBevelHighlight)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Fine Light Beech Wood Grain Waves */}
      <path d="M 12 21 Q 32 18 52 22" stroke="#cca472" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M 11 35 Q 32 38 53 34" stroke="#bf925b" strokeWidth="0.9" fill="none" opacity="0.35" />
      <path d="M 13 49 Q 32 46 51 50" stroke="#b08047" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Wooden Joinery Corner Pins */}
      <circle cx="15.5" cy="19" r="1.8" fill="#a07238" />
      <circle cx="15.5" cy="19" r="0.8" fill="#5c3912" />
      <circle cx="48.5" cy="19" r="1.8" fill="#a07238" />
      <circle cx="48.5" cy="19" r="0.8" fill="#5c3912" />
      <circle cx="15.5" cy="51" r="1.8" fill="#a07238" />
      <circle cx="15.5" cy="51" r="0.8" fill="#5c3912" />
      <circle cx="48.5" cy="51" r="1.8" fill="#a07238" />
      <circle cx="48.5" cy="51" r="0.8" fill="#5c3912" />

      {/* Inset Visor Display Panel */}
      <rect x="17" y="23" width="30" height="23" rx="6" fill="url(#palVisorScreen)" stroke="#805624" strokeWidth="1" />

      {/* Friendly Glowing Robot Eyes */}
      <circle cx="25" cy="32" r="3.8" fill="#e7b124" />
      <circle cx="23.8" cy="30.8" r="1.3" fill="#ffffff" />

      <circle cx="39" cy="32" r="3.8" fill="#e7b124" />
      <circle cx="37.8" cy="30.8" r="1.3" fill="#ffffff" />

      {/* Friendly Smile */}
      <path d="M 27 39.5 Q 32 43.5 37 39.5" stroke="#e7b124" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      
      {/* Subtle Rosy Wooden Cheeks */}
      <circle cx="21" cy="40" r="1.5" fill="#e7b124" opacity="0.35" />
      <circle cx="43" cy="40" r="1.5" fill="#e7b124" opacity="0.35" />
    </svg>
  );
}

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
    nl: 'Stel PAL een vraag over ons hout...',
    en: 'Ask PAL a question about our timber...',
    de: 'Frage an PAL zu Buchenholz...',
    ro: 'Întrebați-l pe PAL despre lemn...'
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
      { text: '🪵 Houtproducten', query: 'Welke houtproducten maken jullie?' },
      { text: '📝 Offerte aanvragen', query: 'Hoe kan ik een offerte aanvragen voor maatwerk beukenhout?' },
      { text: '⏱️ Minimale afname (MOQ)', query: 'Wat is jullie minimale bestelhoeveelheid (MOQ)?' },
      { text: '📍 Fabriek in Brad', query: 'Waar is jullie fabriek en zagerij gevestigd?' }
    ],
    en: [
      { text: '🪵 Timber Products', query: 'What timber products do you manufacture?' },
      { text: '📝 Request a Quote', query: 'How can I request a quote for custom beechwood?' },
      { text: '⏱️ Minimum Order (MOQ)', query: 'What is your minimum order quantity (MOQ)?' },
      { text: '📍 Factory in Brad', query: 'Where is your sawmill and factory located?' }
    ],
    de: [
      { text: '🪵 Holzprodukte', query: 'Welche Holzprodukte stellen Sie her?' },
      { text: '📝 Angebot anfordern', query: 'Wie kann ich ein Angebot für Buchenholz anfordern?' },
      { text: '⏱️ Mindestbestellmenge', query: 'Wie hoch ist die Mindestbestellmenge?' },
      { text: '📍 Werk in Brad', query: 'Wo befindet sich Ihr Sägewerk und Werk?' }
    ],
    ro: [
      { text: '🪵 Produse din lemn', query: 'Ce produse din lemn produceți?' },
      { text: '📝 Solicită ofertă', query: 'Cum pot solicita o ofertă de preț pentru lemn de fag?' },
      { text: '⏱️ Comandă minimă (MOQ)', query: 'Care este cantitatea minimă pe care o puteți livra?' },
      { text: '📍 Fabrica din Brad', query: 'Unde se află fabrica și gaterul vostru?' }
    ]
  },
  welcomeMessage: {
    nl: "Hallo! Ik ben **PAL**, uw virtuele B2B-assistent voor PALROM Products. 🪵\n\nIk help u graag met specificaties, afmetingen van onze beukenhouten blanks, stokken, latten en profielen, of een offerteaanvraag op maat.\n\nWaarmee kan ik u van dienst zijn?",
    en: "Hello! I am **PAL**, your virtual B2B advisor for PALROM Products. 🪵\n\nI can help you with timber specifications, dimensions of our beechwood blanks, dowels, slats, and profiles, or a custom quote inquiry.\n\nHow can I help you today?",
    de: "Hallo! Ich bin **PAL**, Ihr virtueller B2B-Berater für PALROM Products. 🪵\n\nIch helfe Ihnen gerne bei Spezifikationen, Maßen unserer Buchenholz-Blanks, Rundstäbe, Leisten und Profile oder einem maßgeschneiderten Angebot.\n\nWie kann ich Ihnen helfen?",
    ro: "Bună ziua! Sunt **PAL**, consilierul dvs. virtual B2B pentru PALROM Products. 🪵\n\nVă pot ajuta cu specificații, dimensiuni ale frizelor, tijelor, șipcilor și profilelor din lemn de fag, sau o solicitare de ofertă.\n\nCu ce vă pot ajuta?"
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
  const chatBodyRef = useRef(null);
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
            { label: activeLang === 'nl' ? 'Offerte aanvragen' : (activeLang === 'de' ? 'Angebot anfordern' : (activeLang === 'ro' ? 'Solicită o ofertă' : 'Request a Quote')), url: '#contact' },
            { label: activeLang === 'nl' ? 'Bekijk Houtproducten' : (activeLang === 'de' ? 'Produkte ansehen' : (activeLang === 'ro' ? 'Catalog Produse' : 'View Wood Products')), url: '/#products' }
          ]
        }
      ]);
    }
  }, [activeLang, hasInteracted]);

  // Auto-scroll ONLY when user has interacted and a new message arrives.
  // On initial open, ensure we stay scrolled to the top so greeting is completely visible!
  useEffect(() => {
    if (isOpen && hasInteracted) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (isOpen && !hasInteracted && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = 0;
    }
  }, [messages, isLoading, isOpen, hasInteracted]);

  // Focus input and ensure scroll is at top on open
  useEffect(() => {
    if (isOpen) {
      if (!hasInteracted && chatBodyRef.current) {
        chatBodyRef.current.scrollTop = 0;
      }
      setTimeout(() => {
        if (!hasInteracted && chatBodyRef.current) {
          chatBodyRef.current.scrollTop = 0;
        }
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, hasInteracted]);

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
            ? 'Excuses, er trad een kleine verbindingsfout op. U kunt direct mailen naar **office@palromproducts.ro** of contact opnemen via het formulier.'
            : 'Apologies, a temporary connection error occurred. Please contact us at **office@palromproducts.ro** or via the contact form.',
          actions: [{ label: activeLang === 'nl' ? 'Neem contact op' : 'Contact Us', url: '#contact' }]
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
          { label: activeLang === 'nl' ? 'Offerte aanvragen' : 'Request a Quote', url: '#contact' },
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
            <WoodenRobotIcon size={38} className="pal-wooden-robot-launcher" />
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
              <WoodenRobotIcon size={30} />
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
        <div className="pal-chat-body" ref={chatBodyRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`pal-message-bubble ${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="pal-bubble-avatar">
                  <WoodenRobotIcon size={22} />
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
                <WoodenRobotIcon size={22} />
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
