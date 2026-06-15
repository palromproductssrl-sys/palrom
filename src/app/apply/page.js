'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useInquiry } from '@/components/InquiryContext';

function ApplyFormContent() {
  const { lang } = useInquiry();
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

  const t = {
    quickChatTitle: {
      nl: 'Liever eerst een kort gesprek?',
      en: 'Prefer a quick chat first?',
      de: 'Lieber erst ein kurzes Gespräch?',
      ro: 'Preferați o discuție rapidă mai întâi?'
    },
    quickChatDesc: {
      nl: 'Neem rechtstreeks contact op met Anca via WhatsApp om vragen te stellen over de functies, arbeidsvoorwaarden of secundaire arbeidsvoorwaarden in Brad.',
      en: 'Connect directly with Anca on WhatsApp to ask questions about the roles, working conditions, or benefits in Brad.',
      de: 'Nehmen Sie direkt Kontakt mit Anca über WhatsApp auf, um Fragen zu den Stellen, Arbeitsbedingungen oder Leistungen in Brad zu stellen.',
      ro: 'Luați legătura direct cu Anca pe WhatsApp pentru a pune întrebări despre roluri, condiții de lucru sau beneficii în Brad.'
    },
    chatWithAnca: {
      nl: 'Chat met Anca',
      en: 'Chat with Anca',
      de: 'Chat mit Anca',
      ro: 'Discută cu Anca'
    },
    formTitle: {
      nl: 'Sollicitatieformulier',
      en: 'Job Application Form',
      de: 'Bewerbungsformular',
      ro: 'Formular de Aplicare Job'
    },
    labelName: {
      nl: 'Uw Naam *',
      en: 'Your Name *',
      de: 'Ihr Name *',
      ro: 'Numele Dvs. *'
    },
    labelEmail: {
      nl: 'E-mailadres *',
      en: 'Email Address *',
      de: 'E-Mail-Adresse *',
      ro: 'Adresă de E-mail *'
    },
    labelPhone: {
      nl: 'Telefoonnummer *',
      en: 'Phone Number *',
      de: 'Telefonnummer *',
      ro: 'Număr de Telefon *'
    },
    labelPosition: {
      nl: 'Solliciteert naar functie *',
      en: 'Position Applied For *',
      de: 'Bewerbung für Position *',
      ro: 'Postul pentru care Aplicați *'
    },
    selectPositionDefault: {
      nl: 'Selecteer een functie',
      en: 'Select a position',
      de: 'Wählen Sie eine Position aus',
      ro: 'Selectați o poziție'
    },
    optionPlaning: {
      nl: 'Operator Schaafmachine',
      en: 'Planing Machine Operator',
      de: 'Hobelmaschinenführer',
      ro: 'Operator Rindele'
    },
    optionQuality: {
      nl: 'Inspecteur Kwaliteitscontrole & Sortering',
      en: 'Quality & Defect Inspector',
      de: 'Qualitäts- und Mängelprüfer',
      ro: 'Inspector Calitate & Defecte'
    },
    optionLogistics: {
      nl: 'Coördinator Logistiek & Inventaris',
      en: 'Logistics & Inventory Coordinator',
      de: 'Logistik- & Bestands-Koordinator',
      ro: 'Coordonator Logistică & Inventar'
    },
    optionMaintenance: {
      nl: 'Onderhoudsmonteur / Werktuigbouwkundige',
      en: 'Maintenance Mechanic / Millwright',
      de: 'Wartungsmechaniker / Maschinenschlosser',
      ro: 'Mecanic Întreținere'
    },
    optionGeneral: {
      nl: 'Open Sollicitatie',
      en: 'General Job Application',
      de: 'Initiativbewerbung',
      ro: 'Candidatură Spontană'
    },
    labelResume: {
      nl: 'Upload uw cv / resume *',
      en: 'Upload Your CV / Resume *',
      de: 'Lebenslauf hochladen *',
      ro: 'Încărcați CV-ul *'
    },
    dropzoneText: {
      nl: 'Sleep uw cv hiernaartoe, of klik om te bladeren',
      en: 'Drag & Drop your CV here, or click to browse',
      de: 'Ziehen Sie Ihren Lebenslauf hierher oder klicken Sie zum Durchsuchen',
      ro: 'Trageți și plasați CV-ul aici sau faceți clic pentru a răsfoi'
    },
    dropzoneSubtext: {
      nl: 'Geaccepteerde formaten: PDF, DOC, DOCX (Max grootte: 5MB)',
      en: 'Accepted formats: PDF, DOC, DOCX (Max size: 5MB)',
      de: 'Akzeptierte Formate: PDF, DOC, DOCX (Max. Größe: 5MB)',
      ro: 'Formate acceptate: PDF, DOC, DOCX (Dimensiune maximă: 5MB)'
    },
    labelMessage: {
      nl: 'Sollicitatiebrief / Details *',
      en: 'Cover Letter / Message Details *',
      de: 'Anschreiben / Nachrichtendetails *',
      ro: 'Scrisoare de Intenție / Detalii Mesaj *'
    },
    placeholderMessage: {
      nl: 'Vertel ons over uw achtergrond, ervaring in de houtbewerking of industrie, en waarom u bij PALROM wilt werken...',
      en: 'Tell us about your background, years of woodworking or industrial experience, and why you want to work at PALROM...',
      de: 'Erzählen Sie uns von Ihrem Hintergrund, Ihrer Erfahrung in der Holzbearbeitung oder Industrie und warum Sie bei PALROM arbeiten möchten...',
      ro: 'Spuneți-ne despre experiența dvs. în prelucrarea lemnului sau în industrie și de ce doriți să lucrați la PALROM...'
    },
    submittingBtn: {
      nl: 'Sollicitatie wordt verzonden...',
      en: 'Submitting application...',
      de: 'Bewerbung wird gesendet...',
      ro: 'Se trimite candidatura...'
    },
    submitBtn: {
      nl: 'Sollicitatie Verzenden',
      en: 'Submit Application',
      de: 'Bewerbung absenden',
      ro: 'Trimite Candidatura'
    },
    validationRequired: {
      nl: 'Vul alstublieft alle verplichte velden in.',
      en: 'Please fill out all required fields.',
      de: 'Bitte füllen Sie alle Pflichtfelder aus.',
      ro: 'Vă rugăm să completați toate câmpurile obligatorii.'
    },
    validationCV: {
      nl: 'Upload uw cv / resume om door te gaan.',
      en: 'Please upload your CV / Resume to proceed.',
      de: 'Bitte laden Sie Ihren Lebenslauf hoch, um fortzufahren.',
      ro: 'Vă rugăm să încărcați CV-ul pentru a continua.'
    },
    invalidFile: {
      nl: 'Ongeldig bestandstype. Upload a.u.b. een PDF-, DOC- of DOCX-document.',
      en: 'Invalid file type. Please upload a PDF, DOC, or DOCX document.',
      de: 'Ungültiger Dateityp. Bitte laden Sie ein PDF-, DOC- oder DOCX-Dokument hoch.',
      ro: 'Tip de fișier invalid. Vă rugăm să încărcați un document PDF, DOC sau DOCX.'
    },
    fileLimit: {
      nl: 'Bestandsgrootte overschrijdt de limiet van 5MB.',
      en: 'File size exceeds the 5MB limit.',
      de: 'Dateigröße überschreitet das Limit von 5MB.',
      ro: 'Dimensiunea fișierului depășește limita de 5MB.'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
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
        text: getTranslation('invalidFile'),
        type: 'error',
      });
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setFeedback({
        text: getTranslation('fileLimit'),
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
      setFeedback({ text: getTranslation('validationRequired'), type: 'error' });
      return;
    }

    if (!selectedFile) {
      setFeedback({ text: getTranslation('validationCV'), type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate upload / submit (1.8s)
    setTimeout(() => {
      setIsSubmitting(false);

      const jobNames = {
        planing_operator: {
          nl: 'Operator Schaafmachine',
          en: 'Planing Machine Operator',
          de: 'Hobelmaschinenführer',
          ro: 'Operator Rindele'
        },
        quality_inspector: {
          nl: 'Inspecteur Kwaliteitscontrole & Sortering',
          en: 'Quality & Defect Inspector',
          de: 'Qualitäts- und Mängelprüfer',
          ro: 'Inspector Calitate & Defecte'
        },
        logistics_coordinator: {
          nl: 'Coördinator Logistiek & Inventaris',
          en: 'Logistics & Inventory Coordinator',
          de: 'Logistik- & Bestands-Koordinator',
          ro: 'Coordonator Logistică & Inventar'
        },
        maintenance_mechanic: {
          nl: 'Onderhoudsmonteur / Werktuigbouwkundige',
          en: 'Maintenance Mechanic / Millwright',
          de: 'Wartungsmechaniker / Maschinenschlosser',
          ro: 'Mecanic Întreținere'
        },
        general_application: {
          nl: 'Open Sollicitatie',
          en: 'General Job Application',
          de: 'Initiativbewerbung',
          ro: 'Candidatură Spontană'
        },
      };
      
      const formattedJobName = jobNames[position]?.[lang] || jobNames[position]?.nl || position;

      let successMsg = '';
      if (lang === 'nl') {
        successMsg = `Bedankt, ${name}! Uw sollicitatie voor de functie "${formattedJobName}" en uw cv (${selectedFile.name}) zijn succesvol ontvangen door Anca Mihuț. We zullen deze beoordelen en binnen 2 werkdagen contact met u opnemen via ${email} of ${phone}.`;
      } else if (lang === 'de') {
        successMsg = `Vielen Dank, ${name}! Ihre Bewerbung für die Position "${formattedJobName}" und Ihr Lebenslauf (${selectedFile.name}) sind erfolgreich bei Anca Mihuț eingegangen. Wir werden sie prüfen und uns innerhalb von 2 Werktagen unter ${email} oder ${phone} bei Ihnen melden.`;
      } else if (lang === 'ro') {
        successMsg = `Vă mulțumim, ${name}! Candidatura dvs. pentru funcția "${formattedJobName}" și CV-ul dvs. (${selectedFile.name}) au fost primite cu succes de Anca Mihuț. O vom examina și vă vom contacta la ${email} sau ${phone} în termen de 2 zile lucrătoare.`;
      } else {
        successMsg = `Thank you, ${name}! Your application for the "${formattedJobName}" position and your resume (${selectedFile.name}) have been successfully received by Anca Mihuț. We will review it and contact you at ${email} or ${phone} within 2 days.`;
      }

      setFeedback({
        text: successMsg,
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

  const getChatPrefilledText = () => {
    if (lang === 'nl') return 'Hallo Anca, ik ben geïnteresseerd in een carrière bij Palrom';
    if (lang === 'de') return 'Hallo Anca, ich interessiere mich für eine Karriere bei Palrom';
    if (lang === 'ro') return 'Buna Anca, sunt interesat de o cariera la Palrom';
    return "Hi Anca, I'm interested in a career at Palrom";
  };

  return (
    <div className="apply-form-container">
      {/* Quick Chat Card */}
      <div className="quick-chat-card animate-on-scroll">
        <div className="quick-chat-content">
          <i className="fa-brands fa-whatsapp quick-chat-icon"></i>
          <div>
            <h3>{getTranslation('quickChatTitle')}</h3>
            <p>{getTranslation('quickChatDesc')}</p>
          </div>
        </div>
        <a
          href={`https://wa.me/40254606053?text=${encodeURIComponent(getChatPrefilledText())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-now-btn"
        >
          <i className="fa-brands fa-whatsapp"></i> {getTranslation('chatWithAnca')}
        </a>
      </div>

      <div className="apply-form-card animate-on-scroll">
        <h3>{getTranslation('formTitle')}</h3>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="apply_name">{getTranslation('labelName')}</label>
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
              <label htmlFor="apply_email">{getTranslation('labelEmail')}</label>
              <input
                type="email"
                id="apply_email"
                required
                placeholder={lang === 'nl' ? 'john@bedrijf.nl' : 'john@company.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="apply_phone">{getTranslation('labelPhone')}</label>
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
              <label htmlFor="apply_job_type">{getTranslation('labelPosition')}</label>
              <select
                id="apply_job_type"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="" disabled>
                  {getTranslation('selectPositionDefault')}
                </option>
                <option value="planing_operator">{getTranslation('optionPlaning')}</option>
                <option value="quality_inspector">{getTranslation('optionQuality')}</option>
                <option value="logistics_coordinator">{getTranslation('optionLogistics')}</option>
                <option value="maintenance_mechanic">{getTranslation('optionMaintenance')}</option>
                <option value="general_application">{getTranslation('optionGeneral')}</option>
              </select>
            </div>
          </div>

          {/* Resume Upload Dropzone */}
          <div className="form-group">
            <label>{getTranslation('labelResume')}</label>
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
              <span className="dropzone-text">{getTranslation('dropzoneText')}</span>
              <span className="dropzone-subtext">
                {getTranslation('dropzoneSubtext')}
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
            <label htmlFor="apply_message">{getTranslation('labelMessage')}</label>
            <textarea
              id="apply_message"
              rows="6"
              required
              placeholder={getTranslation('placeholderMessage')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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

        {feedback && <div className={`form-feedback ${feedback.type}`}>{feedback.text}</div>}
      </div>
    </div>
  );
}

export default function Apply() {
  const { lang } = useInquiry();

  const t = {
    breadcrumb: {
      nl: 'Home / Vacatures / Solliciteren',
      en: 'Home / Careers / Apply Now',
      de: 'Home / Karriere / Jetzt bewerben',
      ro: 'Home / Cariere / Aplică Acum'
    },
    title: {
      nl: 'Solliciteer Nu',
      en: 'Apply Now',
      de: 'Jetzt bewerben',
      ro: 'Aplică Acum'
    },
    subtitle: {
      nl: 'Klaar om ons team te versterken? Vul hieronder uw gegevens in en upload uw cv.',
      en: 'Ready to join our team? Submit your application details and resume below.',
      de: 'Bereit, unserem Team beizutreten? Reichen Sie unten Ihre Bewerbungsdaten und Ihren Lebenslauf ein.',
      ro: 'Sunteți gata să vă alăturați echipei noastre? Trimiteți detaliile aplicației și CV-ul de mai jos.'
    },
    hrTitle: {
      nl: 'Ontmoet uw HR-vertegenwoordiger',
      en: 'Meet Your HR Representative',
      de: 'Lernen Sie Ihre HR-Ansprechpartnerin kennen',
      ro: 'Faceți cunoștință cu reprezentantul HR'
    },
    hrQuote: {
      nl: '"Welkom bij PALROM Products! We geloven dat de sleutel tot onze duurzame, hoogwaardige houtbewerking ons toegewijde team in Brad is."',
      en: '"Welcome to PALROM Products! We believe that the key to our sustainable, premium woodworking is our dedicated team in Brad."',
      de: '"Willkommen bei PALROM Products! Wir glauben, dass der Schlüssel zu unserer nachhaltigen, erstklassigen Holzbearbeitung unser engagiertes Team in Brad ist."',
      ro: '"Bun venit la PALROM Products! Credem că cheia prelucrării durabile și premium a lemnului este echipa noastră dedicată din Brad."'
    },
    hrDesc1: {
      nl: 'Ik ben Anca Mihuț, HR-coördinator bij PALROM. We streven naar een stabiele, veilige en ondersteunende werkomgeving voor onze machine-operators, kwaliteitscontroleurs, monteurs en logistiek medewerkers.',
      en: 'I\'m Anca Mihuț, HR Coordinator at PALROM. We are committed to providing a stable, high-safety, and supportive working environment for our machine operators, quality inspectors, mechanics, and logistics handlers.',
      de: 'Ich bin Anca Mihuț, HR-Koordinatorin bei PALROM. Wir setzen uns dafür ein, unseren Maschinenbedienern, Qualitätsprüfern, Mechanikern und Logistikmitarbeitern ein stabiles, sicheres und unterstützendes Arbeitsumfeld zu bieten.',
      ro: 'Sunt Anca Mihuț, coordonator HR la PALROM. Ne angajăm să oferim un mediu de lucru stabil, cu un nivel ridicat de siguranță și sprijin pentru operatorii noștri de utilaje, inspectorii de calitate, mecanici și manipulatorii logistici.'
    },
    hrDesc2: {
      nl: 'Vul het sollicitatieformulier hieronder in en upload uw cv (in PDF- of Word-formaat). Zodra uw sollicitatie is verzonden, zal ik uw profiel persoonlijk beoordelen en binnen 2 werkdagen contact met u opnemen voor een kennismaking.',
      en: 'Please complete the application form below and upload your CV (PDF or Word format). Once submitted, I will personally review your profile and get back to you within 2 working days to schedule a chat.',
      de: 'Bitte füllen Sie das Bewerbungsformular unten aus und laden Sie Ihren Lebenslauf (PDF- oder Word-Format) hoch. Nach dem Absenden werde ich Ihr Profil persönlich prüfen und mich innerhalb von 2 Werktagen mit Ihnen in Verbindung setzen.',
      ro: 'Vă rugăm să completați formularul de aplicare de mai jos și să încărcați CV-ul (format PDF sau Word). Odată trimis, vă voi analiza personal profilul și vă voi contacta în termen de 2 zile lucrătoare pentru a stabili o discuție.'
    },
    hrSignoff: {
      nl: 'Personeelszaken (HR) Coördinator, PALROM Products SRL',
      en: 'Human Resources Coordinator, PALROM Products SRL',
      de: 'Koordinatorin für Personalwesen, PALROM Products SRL',
      ro: 'Coordonator Resurse Umane, PALROM Products SRL'
    },
    loadingText: {
      nl: 'Sollicitatiegegevens inladen...',
      en: 'Loading application details...',
      de: 'Bewerbungsdaten werden geladen...',
      ro: 'Se încarcă detaliile aplicației...'
    }
  };

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  return (
    <>
      {/* Product Detail Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <Link href="/careers">{lang === 'nl' ? 'Vacatures' : (lang === 'de' ? 'Karriere' : (lang === 'ro' ? 'Cariere' : 'Careers'))}</Link> / <span>{getTranslation('breadcrumb').split(' / ').pop()}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('title')}</h1>
          <p>{getTranslation('subtitle')}</p>
        </div>

        {/* Hiring Stamp on Hero */}
        <a href="#apply-form" className="hiring-stamp-hero" title={lang === 'nl' ? 'Solliciteer direct!' : (lang === 'de' ? 'Jetzt direkt bewerben!' : (lang === 'ro' ? 'Aplică direct!' : 'Apply directly!'))}>
          <img src={`/images/hiring_stamp_${lang}.png`} alt="We are Hiring Stamp" />
        </a>
      </section>

      {/* HR Welcome Section */}
      <section className="hr-welcome-section section-padding">
        <div className="container">
          <div className="hr-welcome-grid">
            <div className="hr-image-wrapper animate-on-scroll">
              <img src="/images/anca.png" alt="Anca Mihuț - PALROM Products HR Coordinator" />
            </div>
            <div className="hr-welcome-text animate-on-scroll">
              <h2>{getTranslation('hrTitle')}</h2>
              <p className="quote-lead">
                {getTranslation('hrQuote')}
              </p>
              <p>{getTranslation('hrDesc1')}</p>
              <p>{getTranslation('hrDesc2')}</p>

              <div className="hr-signoff">
                <strong>Anca Mihuț</strong>
                <span>{getTranslation('hrSignoff')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-form" className="apply-form-section section-padding">
        <div className="container">
          <Suspense fallback={<div>{getTranslation('loadingText')}</div>}>
            <ApplyFormContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
