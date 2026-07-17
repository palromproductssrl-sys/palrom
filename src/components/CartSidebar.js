'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useInquiry } from './InquiryContext';
import { sendGAEvent } from "@next/third-parties/google";
import { trackTelemetryEvent } from './TelemetryTracker';

function formatEuro(val, decimals = 2) {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

const SHOW_PRICING = false;

const categoryNames = {
  sawn: {
    nl: 'Beukenhouten blanks',
    en: 'Beechwood blanks',
    de: 'Buchenholz-Blanks',
    ro: 'Frize din lemn de fag'
  },
  planed: {
    nl: 'Beukenhouten latten',
    en: 'Beechwood slats',
    de: 'Buchenholzleisten',
    ro: 'Șipci din lemn de fag'
  },
  dowels: {
    nl: 'Beukenhouten stokken',
    en: 'Beechwood sticks',
    de: 'Buchenholzstäbe',
    ro: 'Tije și bare cilindrice din fag'
  },
  profiles: {
    nl: 'Beukenhouten profielen',
    en: 'Beechwood profiles',
    de: 'Buchenholzprofile',
    ro: 'Profile decorative din fag'
  },
  specials: {
    nl: 'Beukenhouten bestekken',
    en: 'Beechwood specials',
    de: 'Buchenholz-Zuschnitte',
    ro: 'Elemente dimensionate din fag'
  },
  brichete: {
    nl: 'Beukenhoutbriketten',
    en: 'Beechwood Heating Briquettes',
    de: 'Buchenholzbriketts',
    ro: 'Brichete din lemn de fag'
  }
};

const dowelSubcategories = [
  { id: 'dowel-smooth', name: { nl: 'Glad', en: 'Smooth', de: 'Glatt', ro: 'Neted' } },
  { id: 'dowel-rilled', name: { nl: 'Gerild', en: 'Rilled', de: 'Geriffelt', ro: 'Canelat' } },
];

const profileSubcategories = [
  { id: 'profile-semiround', name: { nl: 'Halfrond profiel', en: 'Semiround Profile', de: 'Halbrondprofil', ro: 'Profil Semirotund' } },
  { id: 'profile-strip', name: { nl: 'Plat profiel (Strip)', en: 'Profile Strip', de: 'Flachprofil (Leiste)', ro: 'Profil Șipcă Plată' } },
  { id: 'profile-finish-v1', name: { nl: 'Afwerkingsprofiel (Variant 1)', en: 'Profile Finishing (Variant 1)', de: 'Profil-Abschlussleiste (Variante 1)', ro: 'Profil Finisaj (Varianta 1)' } },
  { id: 'profile-quarter-v1', name: { nl: 'Kwartrond profiel (Variant 1)', en: 'Profile Quarter Round (Variant 1)', de: 'Viertelrundprofil (Variante 1)', ro: 'Profil Sfert de Cerc (Varianta 1)' } },
  { id: 'profile-finish-v2', name: { nl: 'Afwerkingsprofiel (Variant 2)', en: 'Profile Finishing (Variant 2)', de: 'Profil-Abschlussleiste (Variante 2)', ro: 'Profil Finisaj (Varianta 2)' } },
  { id: 'profile-plinth-v1', name: { nl: 'Plintprofiel (Variant 1)', en: 'Profile Plinth (Variant 1)', de: 'Sockelleistenprofil (Variante 1)', ro: 'Profil Plintă (Varianta 1)' } },
  { id: 'profile-corner-v1', name: { nl: 'Hoekprofiel (Variant 1)', en: 'Profile Corner (Variant 1)', de: 'Eckprofil (Variante 1)', ro: 'Profil de Colț (Varianta 1)' } },
  { id: 'profile-corner-v2', name: { nl: 'Hoekprofiel (Variant 2)', en: 'Profile Corner (Variant 2)', de: 'Eckprofil (Variante 2)', ro: 'Profil de Colț (Varianta 2)' } },
  { id: 'profile-triangular', name: { nl: 'Driehoekig profiel', en: 'Profile Triangular', de: 'Dreiecksprofil', ro: 'Profil Triunghiular' } },
  { id: 'profile-quarter-v2', name: { nl: 'Kwartrond profiel (Variant 2)', en: 'Profile Quarter Round (Variant 2)', de: 'Viertelrundprofil (Variante 2)', ro: 'Profil Sfert de Cerc (Varianta 2)' } },
  { id: 'profile-thread', name: { nl: 'Gegroefd profiel (Draad)', en: 'Profile Thread', de: 'Gewindeprofil', ro: 'Profil Filetat / Striat' } },
  { id: 'profile-calbat', name: { nl: 'Calbat profiel', en: 'Profile Calbat', de: 'Calbat-Profil', ro: 'Profil Calbat' } },
];

const planedSubcategories = [
  { id: 'planed-rect', name: { nl: 'Geschaafd rechthoekig', en: 'Planed rectangular', de: 'Gehobelt rechteckig', ro: 'Rinduit rectangular' } },
  { id: 'planed-radius', name: { nl: 'Geschaafd radius', en: 'Planed radius', de: 'Gehobelt Radius', ro: 'Rinduit rază' } },
];

const specialsSubcategories = [
  { id: 'special-keeplat-spruce', name: { nl: 'Vuren keeplat (spie)', en: 'Keeplat Spruce', de: 'Keilleiste Fichte', ro: 'Pană din Lemn de Molid' } },
  { id: 'special-keeplat-beech', name: { nl: 'Beuken keeplat (spie)', en: 'Keeplat Beech', de: 'Keilleiste Buche', ro: 'Pană din Lemn de Fag' } },
  { id: 'special-distancer-mix', name: { nl: 'Afstandhouders kleurenmix', en: 'Distancers Color Mix', de: 'Abstandhalter Farbmix', ro: 'Distanțiere Mix de Culori' } },
  { id: 'special-threshold', name: { nl: 'Componenten voedingsindustrie', en: 'Food industry components', de: 'Komponenten für Lebensmittelindustrie', ro: 'Componente pentru industria alimentară' } },
  { id: 'special-distancer-ind', name: { nl: 'Industriële afstandhouder', en: 'Industrial Distancer', de: 'Industrieller Abstandhalter', ro: 'Distanțier Industrial' } },
  { id: 'special-wood-iron', name: { nl: 'Gezaagde bestekken (fijnbezaagd)', en: 'Rough-sawn specials (fine-sawn)', de: 'Sägerauhe Zuschnitte', ro: 'Piese brute netăiate' } },
];

function getLocalizedFields(item, lang) {
  // If not configured, just return item category/name/dims
  if (!item.isConfigured) {
    return {
      category: item.category,
      name: item.name,
      dims: item.dims
    };
  }

  const catKey = item.categoryKey || '';

  // Get localized category name
  const catNames = categoryNames[catKey] || { nl: item.category };
  const localizedCategory = catNames[lang] || catNames.nl || item.category;

  // Let's find subcategory ID
  let subCatId = item.subCategory || '';
  if (!subCatId && item.name && item.name.includes(' - ')) {
    const parts = item.name.split(' - ');
    const subNameInItem = parts.slice(1).join(' - ').trim();
    
    // Search in the corresponding subcategories array
    let subList = [];
    if (catKey === 'dowels') subList = dowelSubcategories;
    else if (catKey === 'profiles') subList = profileSubcategories;
    else if (catKey === 'planed') subList = planedSubcategories;
    else if (catKey === 'specials') subList = specialsSubcategories;

    const found = subList.find(sub => 
      (sub.name.nl && sub.name.nl.trim() === subNameInItem) ||
      (sub.name.en && sub.name.en.trim() === subNameInItem) ||
      (sub.name.de && sub.name.de.trim() === subNameInItem) ||
      (sub.name.ro && sub.name.ro.trim() === subNameInItem)
    );
    if (found) {
      subCatId = found.id;
    }
  }

  // Get localized product name
  let localizedName = localizedCategory;
  if (subCatId) {
    let subList = [];
    if (catKey === 'dowels') subList = dowelSubcategories;
    else if (catKey === 'profiles') subList = profileSubcategories;
    else if (catKey === 'planed') subList = planedSubcategories;
    else if (catKey === 'specials') subList = specialsSubcategories;

    const subObj = subList.find(s => s.id === subCatId);
    if (subObj) {
      const subName = subObj.name[lang] || subObj.name.nl;
      localizedName = `${localizedCategory} - ${subName}`;
    }
  }

  // Get localized dimensions
  let localizedDims = item.dims;
  if (catKey === 'brichete') {
    localizedDims = lang === 'ro' ? 'Palet (960 kg greutate netă)' : (lang === 'nl' ? 'Pallet (960 kg netto gewicht)' : (lang === 'de' ? 'Palette (960 kg Nettogewicht)' : 'Pallet (960 kg net weight)'));
  }

  return {
    category: localizedCategory,
    name: localizedName,
    dims: localizedDims
  };
}

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
    setShouldResetConfigurator,
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
    
    const item = cartItems[index];
    if (item.isConfigured) {
      let discountPercent = 0;
      if (item.categoryKey === 'brichete') {
        if (val >= 24) {
          discountPercent = 10;
        } else if (val >= 12) {
          discountPercent = 5;
        }
      } else {
        if (val >= 100000) {
          discountPercent = 15;
        } else if (val >= 50000) {
          discountPercent = 10;
        } else if (val >= 10000) {
          discountPercent = 5;
        }
      }
      const discountFactor = (100 - discountPercent) / 100;
      const totalPrice = item.baseUnitPrice * discountFactor * val;
      updateCartItem(index, { qty: val, price: totalPrice, discountPercent });
    } else {
      updateCartItem(index, { qty: val });
    }
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
    unconfiguredItemsError: {
      nl: 'Sommige producten in uw offerteaanvraag zijn niet volledig geconfigureerd. Configureer ze volledig voordat u de aanvraag indient.',
      en: 'Some products in your quote request are not fully configured. Please configure them fully before submitting.',
      de: 'Einige Produkte in Ihrer Angebotsanfrage sind nicht vollständig konfiguriert. Bitte konfigurieren Sie sie vollständig, bevor Sie die Anfrage absenden.',
      ro: 'Unele produse din solicitarea dvs. de ofertă nu sunt complet configurate. Vă rugăm să le configurați complet înainte de a trimite.'
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
      nl: SHOW_PRICING 
        ? 'Uw offertelijst is leeg. Gebruik de configurator om klantspecifieke beukenhouten producten en richtprijzen aan uw aanvraag toe te voegen.'
        : 'Uw offertelijst is leeg. Gebruik de configurator om klantspecifieke beukenhouten producten aan uw aanvraag toe te voegen.',
      en: SHOW_PRICING 
        ? 'Your inquiry list is empty. Use the configurator to add custom-spec beechwood products and target prices to your request.'
        : 'Your inquiry list is empty. Use the configurator to add custom-spec beechwood products to your request.',
      de: SHOW_PRICING 
        ? 'Ihre Anfrageliste ist leer. Nutzen Sie den Konfigurator, um Buchenholzprodukte mit kundenspezifischen Spezifikationen und Richtpreise zu Ihrer Anfrage hinzuzufügen.'
        : 'Ihre Anfrageliste ist leer. Nutzen Sie den Konfigurator, um Buchenholzprodukte mit kundenspezifischen Spezifikationen zu Ihrer Anfrage hinzuzufügen.',
      ro: SHOW_PRICING 
        ? 'Lista dvs. de solicitare este goală. Utilizați configuratorul pentru a adăuga produse din fag cu specificații personalizate și prețuri țintă la solicitarea dvs.'
        : 'Lista dvs. de solicitare este goală. Utilizați configuratorul pentru a adăuga produse din fag cu specificații personalizate la solicitarea dvs.'
    },
    goToProducts: {
      nl: 'Naar Configurator',
      en: 'Go to Configurator',
      de: 'Zum Konfigurator',
      ro: 'Mergi la Configurator'
    },
    quantityLabel: {
      nl: 'Aantal',
      en: 'Quantity',
      de: 'Menge',
      ro: 'Cantitate'
    },
    pieces: {
      nl: 'stuks',
      en: 'pieces',
      de: 'Stück',
      ro: 'bucăți'
    },
    pallets: {
      nl: 'pallets',
      en: 'pallets',
      de: 'Paletten',
      ro: 'paleți'
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

    const hasUnconfiguredItems = cartItems.some(item => !item.isConfigured);
    if (hasUnconfiguredItems) {
      alert(getTranslation('unconfiguredItemsError'));
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
          items: cartItems.map(item => ({
            ...item,
            ...getLocalizedFields(item, lang)
          })),
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Inquiry submission failed');
      }

      sendGAEvent({
        event: 'quote_inquiry_submission',
        value: cartItems.length,
      });

      // Track quote submission telemetry
      try {
        trackTelemetryEvent('quote_submitted', {
          quantity: cartItems.length
        });
      } catch (e) {
        console.warn('Failed to log quote submission telemetry:', e);
      }

      // Format items for success alert
      const itemsList = cartItems
        .map((item) => {
          const localized = getLocalizedFields(item, lang);
          const localizedName = localized.name;
          const localizedDims = localized.dims;

          const gradeNames = {
            nl: {
              grade_a: 'Klasse A (Foutvrij)',
              grade_b: 'Klasse B (Meubelhout)',
              grade_ab: 'Klasse A/B Mix',
              A: 'Klasse A (Foutvrij)',
              B: 'Klasse B (Meubelhout)',
              C: 'Klasse C (Constructief)',
            },
            en: {
              grade_a: 'Class A (Clear)',
              grade_b: 'Class B (Cabinet)',
              grade_ab: 'Class A/B Mixed',
              A: 'Class A (Clear)',
              B: 'Class B (Cabinet)',
              C: 'Class C (Structural)',
            },
            de: {
              grade_a: 'Klasse A (Astfrei)',
              grade_b: 'Klasse B (Möbelholz)',
              grade_ab: 'Klasse A/B gemischt',
              A: 'Klasse A (Astfrei)',
              B: 'Klasse B (Möbelholz)',
              C: 'Klasse C (Konstruktive Qualität)',
            },
            ro: {
              grade_a: 'Clasa A (Fără noduri)',
              grade_b: 'Clasa B (Lemn pentru mobilă)',
              grade_ab: 'Clasa A/B amestecat',
              A: 'Clasa A (Fără noduri)',
              B: 'Clasa B (Lemn pentru mobilă)',
              C: 'Clasa C (Calitate constructivă)',
            }
          };
          const currentGrades = gradeNames[lang] || gradeNames.nl;
          const gradeName = currentGrades[item.grade] || item.grade;

          const labelMap = {
            nl: 'Maat',
            en: 'Size',
            de: 'Größe',
            ro: 'Dimensiune'
          };
          const sizeLabel = labelMap[lang] || labelMap.nl;
          const dimDesc = localizedDims ? ` [${sizeLabel}: ${localizedDims}]` : '';
          
          if (item.isConfigured) {
            const fscText = item.fsc
              ? 'FSC® 100%'
              : (lang === 'nl' ? 'Geen FSC' : (lang === 'de' ? 'Kein FSC' : (lang === 'ro' ? 'Fără FSC' : 'No FSC')));
            const dryingText = item.drying === 'luchtdroog'
              ? (lang === 'nl' ? 'Luchtdroog' : (lang === 'de' ? 'Luftgetrocknet' : (lang === 'ro' ? 'Uscat natural' : 'Air-dried')))
              : (lang === 'nl' ? 'KD 10-12%' : (lang === 'de' ? 'KD 10-12%' : (lang === 'ro' ? 'KD 10-12%' : 'KD 10-12%')));
            const priceText = SHOW_PRICING ? `, € ${formatEuro(item.price)}` : '';
            return `- ${localizedName} (${item.qty}x, ${gradeName}${dimDesc}, ${fscText}, ${dryingText}${priceText})`;
          }
          return `- ${localizedName} (${item.qty}x, ${gradeName}${dimDesc})`;
        })
        .join('\n');

      let alertMsg = '';
      if (lang === 'nl') {
        alertMsg = `Bedankt, ${name}! Uw offerteaanvraag voor de volgende product(en) is succesvol ontvangen door ons kantoor in Brad:\n\n${itemsList}\n\nWe zullen gedetailleerde specificaties en prijsopgaven voorbereiden en u binnen 24 uur e-mailen op ${email}.`;
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
      if (setShouldResetConfigurator) {
        setShouldResetConfigurator(true);
      }
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
                <p>{getTranslation('emptyMessage')}</p>
                <Link href="/configurator" className="cart-empty-action-btn" onClick={handleClose}>
                  {getTranslation('goToProducts')} <i className="fa-solid fa-arrow-right icon-right"></i>
                </Link>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const { category: displayCategory, name: displayName, dims: displayDims } = getLocalizedFields(item, lang);
                const gradeNames = {
                  nl: {
                    grade_a: 'Klasse A (Foutvrij)',
                    grade_b: 'Klasse B (Meubelhout)',
                    grade_ab: 'Klasse A/B Mix',
                    A: 'Klasse A (Foutvrij)',
                    B: 'Klasse B (Meubelhout)',
                    C: 'Klasse C (Constructief)',
                  },
                  en: {
                    grade_a: 'Class A (Clear)',
                    grade_b: 'Class B (Cabinet)',
                    grade_ab: 'Class A/B Mixed',
                    A: 'Class A (Clear)',
                    B: 'Class B (Cabinet)',
                    C: 'Class C (Structural)',
                  },
                  de: {
                    grade_a: 'Klasse A (Astfrei)',
                    grade_b: 'Klasse B (Möbelholz)',
                    grade_ab: 'Klasse A/B gemischt',
                    A: 'Klasse A (Astfrei)',
                    B: 'Klasse B (Möbelholz)',
                    C: 'Klasse C (Konstruktive Qualität)',
                  },
                  ro: {
                    grade_a: 'Clasa A (Fără noduri)',
                    grade_b: 'Clasa B (Lemn pentru mobilă)',
                    grade_ab: 'Clasa A/B amestecat',
                    A: 'Clasa A (Fără noduri)',
                    B: 'Clasa B (Lemn pentru mobilă)',
                    C: 'Clasa C (Calitate constructivă)',
                  }
                };
                const currentGrades = gradeNames[lang] || gradeNames.nl;
                const gradeName = currentGrades[item.grade] || item.grade;

                return (
                  <div className="cart-item" key={item.id + '-' + index}>
                    <div className="cart-item-header">
                      <div>
                        {displayCategory !== displayName && (
                          <span className="cart-item-category">{displayCategory}</span>
                        )}
                        <h4 className="cart-item-name">{displayName}</h4>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(index)}><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                    {item.isConfigured ? (
                      <div className="cart-item-specs configured-specs">
                        <div className="configured-meta-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                          {/* 2. Houtsoort */}
                          <div>
                            <strong>{lang === 'nl' ? 'Houtsoort' : (lang === 'de' ? 'Holzart' : (lang === 'ro' ? 'Specie de lemn' : 'Wood species'))}:</strong>{' '}
                            {item.categoryKey === 'brichete'
                              ? (lang === 'nl' ? 'Beuken (Surplus zaagsel)' : (lang === 'ro' ? 'Fag (Surplus de rumeguș)' : (lang === 'de' ? 'Buche (Sägemehl)' : 'Beechwood (Sawdust surplus)')))
                              : (lang === 'nl' ? 'Beuken' : (lang === 'en' ? 'Beechwood' : (lang === 'de' ? 'Buchenholz' : 'Fag')))}
                          </div>
                          {/* 3. Kwaliteitsklasse */}
                          {item.categoryKey !== 'brichete' && (
                            <div>
                              <strong>{lang === 'nl' ? 'Kwaliteitsklasse' : (lang === 'de' ? 'Holzqualität' : (lang === 'ro' ? 'Clasă Lemn' : 'Wood Grade'))}:</strong>{' '}
                              {item.grade === 'A' ? (lang === 'nl' ? 'Klasse A (Foutvrij)' : (lang === 'de' ? 'Klasse A (Astfrei)' : (lang === 'ro' ? 'Clasa A (Fără noduri)' : 'Class A (Clear)'))) :
                               item.grade === 'B' ? (lang === 'nl' ? 'Klasse B (Meubelhout)' : (lang === 'de' ? 'Klasse B (Möbelholz)' : (lang === 'ro' ? 'Clasa B (Lemn pentru mobilă)' : 'Class B (Cabinet)'))) :
                               item.grade === 'C' ? (lang === 'nl' ? 'Klasse C (Constructief)' : (lang === 'de' ? 'Klasse C (Konstruktive Qualität)' : (lang === 'ro' ? 'Clasa C (Calitate constructivă)' : 'Class C (Structural)'))) :
                               item.grade}
                            </div>
                          )}
                          {/* 4. Afmetingen */}
                          <div>
                            <strong>{lang === 'nl' ? 'Afmetingen' : (lang === 'de' ? 'Maße' : (lang === 'ro' ? 'Dimensiuni' : 'Dimensions'))}:</strong> {displayDims}
                          </div>
                          {/* Radius (only for planed-radius) */}
                          {item.categoryKey === 'planed' && item.subCategory === 'planed-radius' && item.radius && (
                            <div>
                              <strong>{lang === 'nl' ? 'Radius' : (lang === 'de' ? 'Radius' : (lang === 'ro' ? 'Rază' : 'Radius'))}:</strong>{' '}
                              {item.radius}
                            </div>
                          )}
                          {/* 5. Oplage */}
                          <div>
                            <strong>{getTranslation('quantityLabel')}:</strong>{' '}
                            {item.qty.toLocaleString(lang === 'ro' ? 'ro-RO' : (lang === 'de' ? 'de-DE' : (lang === 'nl' ? 'nl-NL' : 'en-US')))}{' '}
                            {item.categoryKey === 'brichete' ? getTranslation('pallets') : getTranslation('pieces')}
                          </div>
                          {/* 6. Afwerking */}
                          <div>
                            <strong>{lang === 'nl' ? 'Afwerking' : (lang === 'de' ? 'Oberfläche' : (lang === 'ro' ? 'Finisaj' : 'Finish'))}:</strong>{' '}
                            {item.categoryKey === 'sawn' ? (lang === 'nl' ? 'Fijnbezaagd' : (lang === 'en' ? 'Fine-sawn / Rough-sawn' : (lang === 'de' ? 'Feinschnitt / Sägerau' : 'Tăiat brut'))) :
                             item.categoryKey === 'planed' ? (lang === 'nl' ? 'Vierzijdig geschaafd (S4S)' : (lang === 'en' ? 'Four-sides planed (S4S)' : (lang === 'de' ? 'Vierseitig gehobelt (S4S)' : 'Rinduit pe patru fețe (S4S)'))) :
                             item.categoryKey === 'dowels' ? (lang === 'nl' ? 'Rond geschaafd' : (lang === 'en' ? 'Round planed' : (lang === 'de' ? 'Rund gehobelt' : 'Rinduit rotund'))) :
                             item.categoryKey === 'profiles' ? (lang === 'nl' ? 'Geprofileerd' : (lang === 'en' ? 'Moulded/Profiled' : (lang === 'de' ? 'Profiliert' : 'Profilat'))) :
                             item.categoryKey === 'specials' ? (lang === 'nl' ? 'Op specificatie' : (lang === 'en' ? 'On custom specification' : (lang === 'de' ? 'Nach Spezifikation' : 'Conform specificației'))) :
                             item.categoryKey === 'brichete' ? (lang === 'nl' ? 'Natuurlijk geperst, zonder chemische toevoegingen' : (lang === 'en' ? '100% Natural, chemical-free' : (lang === 'de' ? '100% Natürlich, ohne chemische Bindemittel' : '100% Natural, fără lianți chimici'))) :
                             item.finish}
                          </div>
                          {/* 7. Droging */}
                          {item.categoryKey !== 'brichete' && (
                            <div>
                              <strong>{lang === 'nl' ? 'Droging' : (lang === 'de' ? 'Trocknung' : (lang === 'ro' ? 'Uscare' : 'Drying'))}:</strong>{' '}
                              {item.drying === 'luchtdroog' ? (lang === 'nl' ? 'Luchtdroog' : (lang === 'de' ? 'Luftgetrocknet' : (lang === 'ro' ? 'Uscat natural' : 'Air-dried'))) : (lang === 'nl' ? 'Kamerdroog (KD 10-12%)' : (lang === 'de' ? 'Kammergetrocknet (KD 10-12%)' : (lang === 'ro' ? 'Uscat in camera (KD 10-12%)' : 'Chamber dried (KD 10-12%)')))}
                            </div>
                          )}
                          {/* 8. Gestoomd */}
                          {item.categoryKey !== 'brichete' && (
                            <div>
                              <strong>{lang === 'nl' ? 'Gestoomd' : (lang === 'de' ? 'Gedämpft' : (lang === 'ro' ? 'Aburit' : 'Steamed'))}:</strong>{' '}
                              {item.steamed === 'yes' ?
                                (lang === 'nl' ? 'Gestoomd' : (lang === 'en' ? 'Steamed' : (lang === 'de' ? 'Gedämpft' : 'Aburit'))) :
                                (lang === 'nl' ? 'Ongestoomd' : (lang === 'en' ? 'Unsteamed' : (lang === 'de' ? 'Ungedämpft' : 'Neaburit')))}
                            </div>
                          )}
                          {/* 9. FSC */}
                          {item.categoryKey !== 'brichete' && (
                            <div>
                              <strong>{lang === 'nl' ? 'FSC® Certificering' : (lang === 'de' ? 'FSC®-Zertifizierung' : (lang === 'ro' ? 'Certificare FSC®' : 'FSC® Certification'))}:</strong>{' '}
                              {item.fsc ? 'FSC® 100%' : (lang === 'nl' ? 'Geen FSC' : (lang === 'de' ? 'Kein FSC' : (lang === 'ro' ? 'Fără FSC' : 'No FSC')))}
                            </div>
                          )}
                          {/* 10. Additional Info */}
                          {item.additionalInfo && (
                            <div style={{ wordBreak: 'break-word' }}>
                              <strong>{lang === 'nl' ? 'Aanvullende info' : (lang === 'de' ? 'Zusatzinfo' : (lang === 'ro' ? 'Info suplimentare' : 'Additional info'))}:</strong> {item.additionalInfo}
                            </div>
                          )}
                        </div>
                        {SHOW_PRICING && (
                          <div className="configured-pricing-row" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--color-border)', paddingTop: '0.75rem' }}>
                            <div>
                              {item.discountPercent > 0 && (
                                <span className="discount-badge" style={{
                                  backgroundColor: '#fef3c7',
                                  color: '#b45309',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '0.25rem',
                                  display: 'inline-block',
                                }}>
                                  {item.discountPercent}% {lang === 'nl' ? 'volumekorting' : (lang === 'de' ? 'Mengenrabatt' : (lang === 'ro' ? 'reducere de volum' : 'volume discount'))}
                                </span>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                {lang === 'nl' ? 'Richtprijs (excl. btw)' : (lang === 'de' ? 'Richtpreis (exkl. MwSt.)' : (lang === 'ro' ? 'Preț țintă (excl. TVA)' : 'Target price (excl. VAT)'))}
                              </span>
                              <strong style={{ fontSize: '1.05rem', color: 'var(--color-forest-dark)' }}>
                                € {formatEuro(item.price)}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="cart-item-specs" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                        <div style={{
                          backgroundColor: '#fffbeb',
                          border: '1px solid #fef3c7',
                          color: '#b45309',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          marginTop: '0.25rem',
                          marginBottom: '0.5rem',
                          fontWeight: 500
                        }}>
                          <i className="fa-solid fa-triangle-exclamation" style={{ flexShrink: 0 }}></i>
                          <span>
                            {lang === 'nl' ? 'Niet volledig geconfigureerd' :
                             lang === 'de' ? 'Nicht vollständig konfiguriert' :
                             lang === 'ro' ? 'Neconfigurat complet' :
                             'Not fully configured'}
                          </span>
                        </div>
                        <div>
                          <strong>{getTranslation('quantityLabel')}:</strong> {item.qty}
                        </div>
                        <div>
                          <strong>{getTranslation('woodGradeLabel')}:</strong> {gradeName}
                        </div>
                        {displayDims && (
                          <div>
                            <strong>{getTranslation('dimsLabel')}:</strong> {displayDims}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {cartItems.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Link
                href="/configurator"
                className="btn btn-outlined btn-block"
                style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-forest-dark)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                }}
                onClick={handleClose}
              >
                <i className="fa-solid fa-plus"></i>
                {lang === 'nl' ? 'Nog een product configureren' :
                 lang === 'de' ? 'Anderes Produkt konfigurieren' :
                 lang === 'ro' ? 'Configurați un alt produs' :
                 'Configure another product'}
              </Link>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="cart-form-section">
              {SHOW_PRICING && cartItems.some(item => item.price !== undefined) && (
                <div className="cart-total-box" style={{
                  background: 'linear-gradient(135deg, var(--color-forest-dark) 0%, #1e3a2b 100%)',
                  color: '#ffffff',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {lang === 'nl' ? 'Totale Richtprijs' : (lang === 'de' ? 'Gesamte Richtpreis' : (lang === 'ro' ? 'Preț Țintă Total' : 'Total Target Price'))}
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                      {lang === 'nl' ? '(exclusief btw)' : (lang === 'de' ? '(exklusive MwSt.)' : (lang === 'ro' ? '(exclusiv TVA)' : '(excl. VAT)'))}
                    </span>
                  </div>
                  <strong style={{ fontSize: '1.4rem', color: '#fbbf24' }}>
                    € {formatEuro(
                      cartItems.reduce((acc, item) => acc + (item.price || 0), 0)
                    )}
                  </strong>
                </div>
              )}
              <h4>{getTranslation('contactDetailsTitle')}</h4>
              {cartItems.some(item => !item.isConfigured) && (
                <div className="unconfigured-warning-banner" style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  lineHeight: '1.4'
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ marginTop: '0.2rem', flexShrink: 0 }}></i>
                  <span>
                    {lang === 'nl' ? 'Let op: Sommige producten zijn niet volledig geconfigureerd. U kunt pas een offerte aanvragen als alle producten volledig zijn geconfigureerd.' :
                     lang === 'de' ? 'Achtung: Einige Produkte sind nicht vollständig konfiguriert. Sie können erst ein Angebot anfordern, wenn alle Produkte vollständig konfiguriert sind.' :
                     lang === 'ro' ? 'Atenție: Unele produse nu sunt configurate complet. Puteți solicita o ofertă doar după ce toate produsele sunt complet configurate.' :
                     'Attention: Some products are not fully configured. You can only request a quote once all products are fully configured.'}
                  </span>
                </div>
              )}
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
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || cartItems.some(item => !item.isConfigured)}>
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
