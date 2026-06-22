'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';
import CustomSelect from '@/components/CustomSelect';

// Configurator Sizing Rules
const categoryData = {
  sawn: {
    id: 'sawn',
    name: {
      nl: 'Beukenhouten blanks',
      en: 'Beechwood blanks',
      de: 'Buchenholz-Blanks',
      ro: 'Piese brute din lemn de fag (blanks)'
    },
    length: { min: 200, max: 3000, default: 1000, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 50, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 25, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Fijnbezaagd', en: 'Fine-sawn / Rough-sawn', de: 'Feinschnitt / Sägerau', ro: 'Tăiat brut' },
  },
  planed: {
    id: 'planed',
    name: {
      nl: 'Beukenhouten latten',
      en: 'Beechwood slats',
      de: 'Buchenholzleisten',
      ro: 'Șipci din lemn de fag'
    },
    length: { min: 200, max: 3000, default: 1000, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 50, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 20, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Vierzijdig geschaafd (S4S)', en: 'Four-sides planed (S4S)', de: 'Vierseitig gehobelt (S4S)', ro: 'Rinduit pe patru fețe (S4S)' },
  },
  dowels: {
    id: 'dowels',
    name: {
      nl: 'Beukenhouten stokken',
      en: 'Beechwood sticks',
      de: 'Buchenholzstäbe',
      ro: 'Tije din lemn de fag'
    },
    length: { min: 200, max: 3000, default: 1000, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 3, max: 60, default: 10, label: { nl: 'Diameter (mm)', en: 'Diameter (mm)', de: 'Durchmesser (mm)', ro: 'Diametru (mm)' } },
    finish: { nl: 'Rond geschaafd', en: 'Round planed', de: 'Rund gehobelt', ro: 'Rinduit rotund' },
  },
  profiles: {
    id: 'profiles',
    name: {
      nl: 'Beukenhouten profielen',
      en: 'Beechwood profiles',
      de: 'Buchenholzprofile',
      ro: 'Profile din lemn de fag'
    },
    length: { min: 200, max: 3000, default: 1000, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 40, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 20, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Geprofileerd', en: 'Moulded/Profiled', de: 'Profiliert', ro: 'Profilat' },
  },
  specials: {
    id: 'specials',
    name: {
      nl: 'Beukenhouten bestekken',
      en: 'Beechwood specials',
      de: 'Buchenholz-Zuschnitte',
      ro: 'Piese brute din lemn de fag'
    },
    length: { min: 50, max: 3000, default: 500, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 40, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 20, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Op specificatie', en: 'On custom specification', de: 'Nach Spezifikation', ro: 'Conform specificației' },
  },
  brichete: {
    id: 'brichete',
    name: { nl: 'Beukenhoutbriketten', en: 'Beechwood Heating Briquettes', de: 'Buchenholzbriketts', ro: 'Brichete din lemn de fag' },
    finish: { nl: 'Natuurlijk geperst, zonder chemische toevoegingen', en: '100% Natural, chemical-free', de: '100% Natürlich, ohne chemische Bindemittel', ro: '100% Natural, fără lianți chimici' },
  },
};

const standardSawnThickness = [20, 25, 32, 36, 42, 47, 52, 57, 67];
const standardSawnWidth = [45, 50, 60, 65, 70, 75, 95];
const standardRodDiameters = [3, 4, 5, 6, 8, 10, 12, 14, 15, 16, 18, 19, 20, 22, 25, 28, 30, 35, 40, 45, 50, 55, 60];
const standardLengthRanges = [200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000];

const categoriesList = [
  { id: 'sawn', icon: 'fa-solid fa-layer-group', label: { nl: 'Beukenhouten blanks', en: 'Beechwood blanks', de: 'Buchenholz-Blanks', ro: 'Piese brute din lemn de fag (blanks)' } },
  { id: 'planed', icon: 'fa-solid fa-align-justify', label: { nl: 'Beukenhouten latten', en: 'Beechwood slats', de: 'Buchenholzleisten', ro: 'Șipci din lemn de fag' } },
  { id: 'dowels', icon: 'fa-solid fa-circle', label: { nl: 'Beukenhouten stokken', en: 'Beechwood sticks', de: 'Buchenholzstäbe', ro: 'Tije din lemn de fag' } },
  { id: 'profiles', icon: 'fa-solid fa-wave-square', label: { nl: 'Beukenhouten profielen', en: 'Beechwood profiles', de: 'Profile din lemn de fag' } },
  { id: 'specials', icon: 'fa-solid fa-puzzle-piece', label: { nl: 'Beukenhouten bestekken', en: 'Beechwood specials', de: 'Buchenholz-Zuschnitte', ro: 'Piese brute din lemn de fag' } },
  { id: 'brichete', icon: 'fa-solid fa-box', label: { nl: 'Beukenhoutbriketten', en: 'Beechwood Heating Briquettes', de: 'Buchenholzbriketts', ro: 'Brichete din lemn de fag' } },
];

const tV3 = {
  standardRange: {
    nl: 'Standaard lengte',
    en: 'Standard length',
    de: 'Standardlänge',
    ro: 'Lungime standard'
  },
  customRange: {
    nl: 'Maatwerk (exact)',
    en: 'Custom dimension (exact)',
    de: 'Maßanfertigung (exakt)',
    ro: 'Dimensiune personalizată (exactă)'
  },
  standardWidth: {
    nl: 'Standaard breedte',
    en: 'Standard width',
    de: 'Standardbreite',
    ro: 'Lățime standard'
  },
  customWidth: {
    nl: 'Maatwerk breedte (exact)',
    en: 'Custom width (exact)',
    de: 'Maßanfertigung Breite (exakt)',
    ro: 'Lățime personalizată (exactă)'
  },
  standardThickness: {
    nl: 'Standaard dikte',
    en: 'Standard thickness',
    de: 'Standardstärke',
    ro: 'Grosime standard'
  },
  customThickness: {
    nl: 'Maatwerk dikte (exact)',
    en: 'Custom thickness (exact)',
    de: 'Maßanfertigung Stärke (exakt)',
    ro: 'Grosime personalizată (exactă)'
  },
  standardLength: {
    nl: 'Standaard lengte',
    en: 'Standard length',
    de: 'Standardlänge',
    ro: 'Lungime standard'
  },
  customLength: {
    nl: 'Maatwerk lengte (exact)',
    en: 'Custom length (exact)',
    de: 'Maßanfertigung Länge (exakt)',
    ro: 'Lungime personalizată (exactă)'
  }
};

const specialsPrices = {
  'Keeplat Spruce': 1.25,
  'Keeplat Beech': 1.65,
  'Distancers Color Mix': 0.15,
  'Food Industry Components': 2.10,
  'Industrial Distancer': 0.38,
  'Rough-sawn Specials': 1.45,
};

const dowelSubcategories = [
  { id: 'dowel-smooth', name: { nl: 'Glad', en: 'Smooth', de: 'Glatt', ro: 'Neted' }, img: '/images/dowelsmedium.jpg' },
  { id: 'dowel-rilled', name: { nl: 'Gerild', en: 'Rilled', de: 'Geriffelt', ro: 'Canelat' }, img: '/images/dowelsrilled-300x300-1.jpg' },
];

const profileSubcategories = [
  { id: 'profile-semiround', name: { nl: 'Halfronde latten', en: 'Semiround Profile', de: 'Halbrundprofile', ro: 'Șipci semirotunde' }, img: '/images/profile1.jpg' },
  { id: 'profile-strip', name: { nl: 'Deklatten / platte lijsten', en: 'Profile Strip', de: 'Profilleisten / Flachleisten', ro: 'Șipci plate' }, img: '/images/profile2.jpg' },
  { id: 'profile-finish-v1', name: { nl: 'Afwerklijsten (Variant 1)', en: 'Profile Finishing (Variant 1)', de: 'Finishing-Profile (V1)', ro: 'Șipci de finisaj (V1)' }, img: '/images/profile3.jpg' },
  { id: 'profile-quarter-v1', name: { nl: 'Kwartronde lijsten (Variant 1)', en: 'Profile Quarter Round (Variant 1)', de: 'Viertelrundprofile (V1)', ro: 'Profile sfert de cerc (V1)' }, img: '/images/profile4.jpg' },
  { id: 'profile-finish-v2', name: { nl: 'Afwerklijsten (Variant 2)', en: 'Profile Finishing (Variant 2)', de: 'Finishing-Profile (V2)', ro: 'Șipci de finisaj (V2)' }, img: '/images/profile5.jpg' },
  { id: 'profile-plinth-v1', name: { nl: 'Plinten (Variant 1)', en: 'Profile Plinth (Variant 1)', de: 'Sockelleisten (V1)', ro: 'Plinte (V1)' }, img: '/images/profile6.jpg' },
  { id: 'profile-corner-v1', name: { nl: 'Hoekprofielen (Variant 1)', en: 'Profile Corner (Variant 1)', de: 'Eckprofile (V1)', ro: 'Profile de colț (V1)' }, img: '/images/profile7.jpg' },
  { id: 'profile-corner-v2', name: { nl: 'Hoekprofielen (Variant 2)', en: 'Profile Corner (Variant 2)', de: 'Eckprofile (V2)', ro: 'Profile de colț (V2)' }, img: '/images/profile8.jpg' },
  { id: 'profile-triangular', name: { nl: 'Driehoekige glaslatten', en: 'Profile Triangular', de: 'Dreikantleisten', ro: 'Șipci triunghiulare' }, img: '/images/profile9.jpg' },
  { id: 'profile-quarter-v2', name: { nl: 'Kwartronde lijsten (Variant 2)', en: 'Profile Quarter Round (Variant 2)', de: 'Viertelrundprofile (V2)', ro: 'Profile sfert de cerc (V2)' }, img: '/images/profile10.jpg' },
  { id: 'profile-thread', name: { nl: 'Geprotocolleerde schroefdraadlatten', en: 'Profile Thread', de: 'Gewindestäbe', ro: 'Profile filetate' }, img: '/images/profile11.jpg' },
  { id: 'profile-calbat', name: { nl: 'Calbat profielen', en: 'Profile Calbat', de: 'Calbat-Profile', ro: 'Profile Calbat' }, img: '/images/profile12.jpg' },
];

const specialsSubcategories = [
  { id: 'special-keeplat-spruce', name: { nl: 'Vuren keeplat (spie)', en: 'Keeplat Spruce', de: 'Keilleiste Fichte', ro: 'Pană din Lemn de Molid' }, img: '/images/special1.jpg' },
  { id: 'special-keeplat-beech', name: { nl: 'Beuken keeplat (spie)', en: 'Keeplat Beech', de: 'Keilleiste Buche', ro: 'Pană din Lemn de Fag' }, img: '/images/special2.jpg' },
  { id: 'special-distancer-mix', name: { nl: 'Afstandhouders kleurenmix', en: 'Distancers Color Mix', de: 'Abstandhalter Farbmix', ro: 'Distanțiere Mix de Culori' }, img: '/images/special3.jpg' },
  { id: 'special-threshold', name: { nl: 'Componenten voedingsindustrie', en: 'Food industry components', de: 'Komponenten für Lebensmittelindustrie', ro: 'Componente pentru industria alimentară' }, img: '/images/special4.jpg' },
  { id: 'special-distancer-ind', name: { nl: 'Industriële afstandhouder', en: 'Industrial Distancer', de: 'Industrieller Abstandhalter', ro: 'Distanțier Industrial' }, img: '/images/special5.jpg' },
  { id: 'special-wood-iron', name: { nl: 'Gezaagde bestekken (fijnbezaagd)', en: 'Rough-sawn specials (fine-sawn)', de: 'Sägerauhe Zuschnitte', ro: 'Piese brute netăiate' }, img: '/images/special6.jpg' },
];

const planedSubcategories = [
  { id: 'planed-rect', name: { nl: 'Geschaafd rechthoekig', en: 'Planed rectangular', de: 'Gehobelt rechteckig', ro: 'Rinduit rectangular' }, img: '/images/4sides1.jpg' },
  { id: 'planed-radius', name: { nl: 'Geschaafd radius', en: 'Planed radius', de: 'Gehobelt Radius', ro: 'Rinduit rază' }, img: '/images/4sides7.jpg' },
];

const t = {
  loading: { nl: 'Inladen portal...', en: 'Loading portal...', de: 'Portal wird geladen...', ro: 'Se încarcă portalul...' },
  passwordLabel: { nl: 'Wachtwoord *', en: 'Password *', de: 'Passwort *', ro: 'Parolă *' },
  passwordError: { nl: 'Ongeldig wachtwoord. Probeer het opnieuw.', en: 'Invalid password. Please try again.', de: 'Ungültiges Passwort. Bitte versuchen Sie es erneut.', ro: 'Parolă invalidă. Vă rugăm să încercați din nou.' },
  unlockButton: { nl: 'Toegang Ontgrendelen', en: 'Unlock Access', de: 'Zugang entsperren', ro: 'Deblochează Accesul' },
  portalTitle: { nl: 'B2B Partner Portal', en: 'B2B Partner Portal', de: 'B2B-Partnerportal', ro: 'Portal Partener B2B' },
  portalLead: { nl: 'Voer het wachtwoord in om toegang te krijgen tot de Palrom Offerte Configurator.', en: 'Enter the password to access the Palrom Quote Configurator.', de: 'Geben Sie das Passwort ein, um auf den Palrom Angebotskonfigurator zuzugreifen.', ro: 'Introduceți parola pentru a accesa Configuratorul de Oferte Palrom.' },
  showPasswordAria: { nl: 'Wachtwoord tonen/verbergen', en: 'Show/hide password', de: 'Passwort anzeigen/ausblenden', ro: 'Afișează/ascunde parola' },
  heroBreadcrumb: { nl: 'Palrom Offerte Configurator', en: 'Palrom Quote Configurator', de: 'Palrom Angebotskonfigurator', ro: 'Configurator de Oferte Palrom' },
  heroTitle: { nl: 'Palrom Chatbot Assistent', en: 'Palrom Chatbot Assistant', de: 'Palrom Chatbot-Assistent', ro: 'Asistent Chatbot Palrom' },
  heroSubtitle: { nl: 'Configureer stapsgewijs uw aanvraag in een persoonlijk gesprek met Willem.', en: 'Configure your request step-by-step in a personal conversation with Willem.', de: 'Konfigurieren Sie Ihre Anfrage Schritt für Schritt in einem persönlichen Gespräch mit Willem.', ro: 'Configurați cererea dvs. pas cu pas într-o conversație personală cu Willem.' },
  categoryLabel: { nl: 'Productcategorie', en: 'Product Category', de: 'Produktkategorie', ro: 'Categorie Produs' },
  quantityLabel: { nl: 'Oplage (stuks)', en: 'Quantity (pieces)', de: 'Auflage (Stück)', ro: 'Cantitate (bucăți)' },
  pieces: { nl: 'stuks', en: 'pieces', de: 'Stück', ro: 'bucăți' },
  woodSpeciesRow: { nl: 'Houtsoort', en: 'Wood Species', de: 'Holzart', ro: 'Specie de Lemn' },
  beechwoodValue: { nl: 'Beuken', en: 'Beechwood', de: 'Buchenholz', ro: 'Fag' },
  steamedRow: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
  steamedValueNo: { nl: 'Ongestoomd (Standaard)', en: 'Unsteamed (Standard)', de: 'Ungedämpft (Standard)', ro: 'Neaburit (Standard)' },
  steamedValueYes: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
  dryingRow: { nl: 'Droging', en: 'Drying', de: 'Trocknung', ro: 'Uscare' },
  dryingValueKiln: { nl: 'Kamerdroog (KD 10-12%)', en: 'Kiln-Dried (KD 10-12%)', de: 'Kammergetrocknet (KD 10-12%)', ro: 'Uscat în Cameră (KD 10-12%)' },
  dryingValueAir: { nl: 'Luchtdroog (AD)', en: 'Air-Dried (AD)', de: 'Luftgetrocknet (AD)', ro: 'Uscat Natural (AD)' },
  certificationLabel: { nl: 'FSC® Certificering', en: 'FSC® Certification', de: 'FSC®-Zertifizierung', ro: 'Certificare FSC®' },
  fscLabelFscCertifiedSelect: { nl: 'FSC® 100%', en: 'FSC® 100%', de: 'FSC® 100%', ro: 'FSC® 100%' },
  fscLabelNonFsc: { nl: 'Geen FSC', en: 'No FSC', de: 'Kein FSC', ro: 'Fără FSC' },
  gradeLabel: { nl: 'Kwaliteitsklasse', en: 'Quality Grade', de: 'Qualitätsklasse', ro: 'Clasă de Calitate' },
  gradeASelect: { nl: 'Klasse A (Foutvrij)', en: 'Class A (Clear)', de: 'Klasse A (Astfrei)', ro: 'Clasa A (Fără noduri)' },
  gradeBSelect: { nl: 'Klasse B (Meubelhout)', en: 'Class B (Cabinet)', de: 'Klasse B (Möbelholz)', ro: 'Clasa B (Lemn mobilă)' },
  gradeCSelect: { nl: 'Klasse C (Constructief)', en: 'Class C (Structural)', de: 'Klasse C (Konstruktive Qualität)', ro: 'Clasa C (Calitate constructivă)' },
  moqNotice: { nl: 'Minimale afname: {minQty} stuks.', en: 'Minimum order: {minQty} pieces.', de: 'Mindestbestellmenge: {minQty} Stück.', ro: 'Comandă minimă: {minQty} bucăți.' },
  additionalInfoLabel: { nl: 'Opmerkingen of aanvullende wensen', en: 'Remarks or additional specifications', de: 'Bemerkungen oder zusätzliche Wünsche', ro: 'Observații sau specificații suplimentare' },
  targetPricePerPiece: { nl: 'Richtprijs (p.st.)', en: 'Target Price (per pc.)', de: 'Richtpreis (pro Stk.)', ro: 'Preț Țintă (pe buc.)' },
  volumeDiscountRow: { nl: 'Staffelkorting', en: 'Volume Discount', de: 'Staffelrabatt', ro: 'Discount de Volum' },
  totalCumulativePrice: { nl: 'Totaal gecumuleerde richtprijs:', en: 'Total cumulative target price:', de: 'Gesamte kumulierte Richtpreis:', ro: 'Preț țintă total cumulat:' },
  configDetailCol: { nl: 'Configuratie Detail', en: 'Configuration Detail', de: 'Konfigurationsdetail', ro: 'Detaliu Configurare' },
  yourSelectionCol: { nl: 'Uw Selectie', en: 'Your Selection', de: 'Ihre Auswahl', ro: 'Selecția Dvs.' },
  productRow: { nl: 'Product', en: 'Product', de: 'Produkt', ro: 'Produs' },
  dimensionsRow: { nl: 'Afmetingen', en: 'Dimensions', de: 'Maße', ro: 'Dimensiuni' },
  quantityRow: { nl: 'Oplage', en: 'Quantity', de: 'Auflage', ro: 'Cantitate' },
  finishRow: { nl: 'Afwerking', en: 'Finish', de: 'Oberfläche', ro: 'Finisaj' },
  addToInquiry: { nl: 'Toevoegen aan Offerteaanvraag', en: 'Add to Quote Request', de: 'Zur Angebotsanfrage hinzufügen', ro: 'Adaugă la solicitarea de ofertă' },
  resetConfig: { nl: 'Opnieuw beginnen', en: 'Start over', de: 'Neustart', ro: 'Reîncepe' },
  backToHub: { nl: 'Terug naar selectie', en: 'Back to selection', de: 'Zurück zur Auswahl', ro: 'Înapoi la selecție' },
  livePreview: { nl: 'Live preview', en: 'Live preview', de: 'Live-Vorschau', ro: 'Previzualizare live' },
  gradeRow: { nl: 'Kwaliteitsklasse', en: 'Quality Grade', de: 'Qualitätsklasse', ro: 'Clasă de kwaliteit' },
  fscRow: { nl: 'FSC® Certificering', en: 'FSC® Certification', de: 'FSC®-Zertifizierung', ro: 'Certificare FSC®' },
  gradeAValue: { nl: 'A (foutvrij, egaal van kleur)', en: 'A (defect-free, uniform color)', de: 'A (astfrei, gleichmäßige Farbe)', ro: 'A (fără defecte, culoare uniformă)' },
  gradeBValue: { nl: 'B (foutvrij, gezond kleurverschil toegestaan)', en: 'B (defect-free, healthy color difference allowed)', de: 'B (astfrei, gesunde Farbabweichungen zulässig)', ro: 'B (fără defecte, diferențe de culoare admise)' },
  gradeCValue: { nl: 'C (constructieve kwaliteit)', en: 'C (structural quality)', de: 'C (konstruktive Qualität)', ro: 'C (calitate constructivă)' },
  addSuccess: {
    nl: 'Product succesvol toegevoegd aan uw offerteaanvraag!',
    en: 'Product successfully added to your quote request!',
    de: 'Produkt erfolgreich zu Ihrer Angebotsanfrage hinzugefügt!',
    ro: 'Produs adăugat cu succes la solicitarea dvs. de ofertă!'
  }
};

const localeMap = { nl: 'nl-NL', en: 'en-US', de: 'de-DE', ro: 'ro-RO' };
const SHOW_PRICING = false;

const getPlanedMaxWidth = (thick) => {
  if (thick <= 15) return 100;
  if (thick <= 25) return 150;
  if (thick <= 45) return 200;
  return 500;
};

const getMinQuantityForCustom = (cat, len, diam) => {
  if (cat === 'dowels') {
    if (diam <= 10) return 20000;
    if (diam <= 20) return 10000;
    if (diam <= 35) return 5000;
    return 1000;
  } else {
    const volumeDm3 = (len * diam * 20) / 1000000.0;
    if (volumeDm3 <= 0.2) return 5000;
    if (volumeDm3 <= 1.0) return 2000;
    return 500;
  }
};

const getCategoryLabelLines = (catId, langVal) => {
  if (langVal === 'en') {
    switch (catId) {
      case 'sawn': return ['Beechwood', 'blanks'];
      case 'planed': return ['Beechwood', 'slats'];
      case 'dowels': return ['Beechwood', 'sticks'];
      case 'profiles': return ['Beechwood', 'profiles'];
      case 'specials': return ['Beechwood', 'specials'];
      case 'brichete': return ['Beechwood', 'briquettes'];
      default: return ['', ''];
    }
  } else if (langVal === 'de') {
    switch (catId) {
      case 'sawn': return ['Buchenholz-', 'Blanks'];
      case 'planed': return ['Buchenholz-', 'leisten'];
      case 'dowels': return ['Buchenholz-', 'stäbe'];
      case 'profiles': return ['Buchenholz-', 'profile'];
      case 'specials': return ['Buchenholz-', 'Zuschnitte'];
      case 'brichete': return ['Buchenholz-', 'briketts'];
      default: return ['', ''];
    }
  } else if (langVal === 'ro') {
    switch (catId) {
      case 'sawn': return ['Piese brute din', 'lemn de fag (blanks)'];
      case 'planed': return ['Șipci din', 'lemn de fag'];
      case 'dowels': return ['Tije din', 'lemn de fag'];
      case 'profiles': return ['Profile din', 'lemn de fag'];
      case 'specials': return ['Piese brute din', 'lemn de fag'];
      case 'brichete': return ['Brichete din', 'lemn de fag'];
      default: return ['', ''];
    }
  } else { // default to 'nl'
    switch (catId) {
      case 'sawn': return ['Beukenhouten', 'blanks'];
      case 'planed': return ['Beukenhouten', 'latten'];
      case 'dowels': return ['Beukenhouten', 'stokken'];
      case 'profiles': return ['Beukenhouten', 'profielen'];
      case 'specials': return ['Beukenhouten', 'bestekken'];
      case 'brichete': return ['Beukenhout', 'briketten'];
      default: return ['', ''];
    }
  }
};

export default function ChatbotConfigurator() {
  const { lang, addToCart, setIsCartOpen, shouldResetConfigurator, setShouldResetConfigurator, isRomania } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Configurator States (synchronised with chat selection)
  const [category, setCategory] = useState('sawn');
  const [subCategoryDowels, setSubCategoryDowels] = useState('dowel-smooth');
  const [subCategoryProfiles, setSubCategoryProfiles] = useState('profile-semiround');
  const [subCategorySpecials, setSubCategorySpecials] = useState('special-keeplat-spruce');
  const [subCategoryPlaned, setSubCategoryPlaned] = useState('planed-rect');
  const [radius, setRadius] = useState(null);
  
  const [woodType, setWoodType] = useState('beech');
  const [steamed, setSteamed] = useState('no');
  const [drying, setDrying] = useState('kd');
  const [fsc, setFsc] = useState(true);
  const [grade, setGrade] = useState('A');
  const [thicknessType, setThicknessType] = useState('custom');
  const [thickness, setThickness] = useState(25);
  const [widthType, setWidthType] = useState('custom');
  const [diameter, setDiameter] = useState(50);
  const [lengthType, setLengthType] = useState('custom');
  const [length, setLength] = useState(1000);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [quantity, setQuantity] = useState(500);

  const [notification, setNotification] = useState(null);

  // Chat History & Typing Indicators
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([
    { step: 'category', botMsgKey: 'chooseCategory', optionsType: 'category', userChoice: null }
  ]);

  const chatHistoryRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isTyping]);

  // Load session storage check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_configurator_auth') === 'true';
      if (!auth) {
        window.location.href = '/configurator';
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }
  }, []);

  // Opnieuw beginnen (Start Over)
  const handleStartOver = () => {
    setCategory('sawn');
    setSubCategoryDowels('dowel-smooth');
    setSubCategoryProfiles('profile-semiround');
    setSubCategorySpecials('special-keeplat-spruce');
    setSubCategoryPlaned('planed-rect');
    setRadius(null);
    setWoodType('beech');
    setSteamed('no');
    setDrying('kd');
    setFsc(true);
    setGrade('A');
    setThicknessType('custom');
    setThickness(25);
    setWidthType('custom');
    setDiameter(50);
    setLengthType('custom');
    setLength(1000);
    setAdditionalInfo('');
    setQuantity(500);
    setIsTyping(false);
    setHistory([
      { step: 'category', botMsgKey: 'chooseCategory', optionsType: 'category', userChoice: null }
    ]);
  };

  useEffect(() => {
    if (shouldResetConfigurator) {
      handleStartOver();
      setShouldResetConfigurator(false);
    }
  }, [shouldResetConfigurator, setShouldResetConfigurator]);

  // Sizing rules clamp
  const parsedLengthForMinQty = typeof length === 'string' && length.includes('-')
    ? parseInt(length.split('-')[1])
    : (parseInt(length) || 1000);
  const minQty = category === 'brichete' ? 1 : (lengthType === 'custom' ? getMinQuantityForCustom(category, parsedLengthForMinQty, diameter) : 500);
  const currentMaxWidth = category === 'planed' ? getPlanedMaxWidth(thickness) : categoryData[category]?.diameter?.max || 500;

  const getMinDiameter = () => {
    if (category === 'dowels') {
      return subCategoryDowels === 'dowel-rilled' ? 6 : 3;
    }
    return categoryData[category]?.diameter?.min || 5;
  };

  const getMaxDiameter = () => {
    if (category === 'dowels') {
      return subCategoryDowels === 'dowel-rilled' ? 20 : 60;
    }
    return currentMaxWidth;
  };

  // Clamp diameter to range
  useEffect(() => {
    const minD = getMinDiameter();
    const maxD = getMaxDiameter();
    if (diameter < minD) {
      setDiameter(minD);
    } else if (diameter > maxD) {
      setDiameter(maxD);
    }
  }, [category, subCategoryDowels, diameter, currentMaxWidth]);

  useEffect(() => {
    if (quantity < minQty) {
      setQuantity(minQty);
    }
  }, [minQty]);

  // Pricing calculations
  const calculatePriceDetails = (cat, len, diam, thick, qtyVal, specificSubcat, itemGrade = 'A', lenType = 'standard', itemDrying = 'kd') => {
    let unitPrice = 0.0;
    let subcatName = '';

    const numericLen = typeof len === 'string' && len.includes('-')
      ? parseInt(len.split('-')[1])
      : (parseInt(len) || 0);
    const numericDiam = parseInt(diam) || 0;
    const numericThick = parseInt(thick) || 0;

    if (cat === 'specials') {
      const names = {
        'special-keeplat-spruce': 'Keeplat Spruce',
        'special-keeplat-beech': 'Keeplat Beech',
        'special-distancer-mix': 'Distancers Color Mix',
        'special-threshold': 'Food Industry Components',
        'special-distancer-ind': 'Industrial Distancer',
        'special-wood-iron': 'Rough-sawn Specials',
      };
      subcatName = names[specificSubcat || subCategorySpecials] || 'Keeplat Spruce';
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
      subcatName = names[specificSubcat || subCategoryProfiles] || 'Semiround Profile';
    } else if (cat === 'dowels') {
      const names = {
        'dowel-smooth': 'Smooth Dowel Rods',
        'dowel-rilled': 'Spiral Rilled Pins (6 to 20 mm)',
      };
      subcatName = names[specificSubcat || subCategoryDowels] || 'Smooth Dowel Rods';
    } else if (cat === 'planed') {
      const names = {
        'planed-rect': 'Planed Rectangular',
        'planed-radius': 'Planed Radius',
      };
      subcatName = names[specificSubcat || subCategoryPlaned] || 'Planed Rectangular';
    }

    if (cat === 'sawn') {
      const volumeDm3 = (numericLen * numericDiam * numericThick) / 1000000.0;
      unitPrice = 1.25 * volumeDm3;
      if (unitPrice < 0.20) unitPrice = 0.20;
    } else if (cat === 'planed') {
      const volumeDm3 = (numericLen * numericDiam * numericThick) / 1000000.0;
      unitPrice = 1.65 * volumeDm3;
      if (unitPrice < 0.25) unitPrice = 0.25;
    } else if (cat === 'dowels') {
      const baseLength = 40.0;
      const baseDiameter = 8.0;
      const basePrice = 0.03;
      const lengthFactor = numericLen / baseLength;
      const diameterFactor = Math.pow(numericDiam / baseDiameter, 2);
      unitPrice = basePrice * lengthFactor * diameterFactor;
      if (unitPrice < 0.01) unitPrice = 0.01;
    } else if (cat === 'profiles') {
      const lengthM = numericLen / 1000.0;
      const widthFactor = numericDiam / 50.0;
      const thicknessFactor = numericThick / 20.0;
      unitPrice = 0.95 * lengthM * widthFactor * thicknessFactor;
      if (unitPrice < 0.20) unitPrice = 0.20;
    } else if (cat === 'specials') {
      const basePrice = specialsPrices[subcatName] || 1.25;
      const lengthFactor = numericLen / 500.0;
      unitPrice = basePrice * lengthFactor;
      if (unitPrice < 0.35) unitPrice = 0.35;
    } else if (cat === 'brichete') {
      unitPrice = 320.00;
    }

    // Apply factors
    let gradeFactor = 1.0;
    if (cat !== 'brichete') {
      if (itemGrade === 'B') gradeFactor = 0.9;
      else if (itemGrade === 'C') gradeFactor = 0.7;
    }
    const dryingFactor = (cat !== 'brichete' && itemDrying === 'luchtdroog') ? 0.95 : 1.0;
    const lenTypeFactor = (cat !== 'brichete' && lenType === 'custom') ? 1.15 : 1.0;

    unitPrice = unitPrice * gradeFactor * dryingFactor * lenTypeFactor;

    let discountPercent = 0;
    if (cat === 'brichete') {
      if (qtyVal >= 24) discountPercent = 10;
      else if (qtyVal >= 12) discountPercent = 5;
    } else {
      if (qtyVal >= 100000) discountPercent = 15;
      else if (qtyVal >= 50000) discountPercent = 10;
      else if (qtyVal >= 10000) discountPercent = 5;
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

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  const getActiveSelectionDetails = () => {
    const data = categoryData[category];
    if (!data) return {};

    const currentSubcat = category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : category === 'planed' ? subCategoryPlaned : '';
    const details = calculatePriceDetails(category, length, diameter, thickness, quantity, currentSubcat, grade, lengthType, drying);

    let subName = data.name[lang] || data.name.nl;
    if (category === 'specials') {
      const item = specialsSubcategories.find(s => s.id === currentSubcat);
      if (item) subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
    } else if (category === 'profiles') {
      const item = profileSubcategories.find(p => p.id === currentSubcat);
      if (item) subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
    } else if (category === 'dowels') {
      const item = dowelSubcategories.find(d => d.id === currentSubcat);
      if (item) subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
    } else if (category === 'planed') {
      const item = planedSubcategories.find(p => p.id === currentSubcat);
      if (item) subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
    }

    let dims = '';
    const lengthStr = typeof length === 'string' ? `${length} mm` : `${length} mm`;
    const widthStr = category === 'dowels' ? 'n.v.t.' : `${diameter} mm`;
    const thickStr = `${thickness} mm`;

    if (category === 'sawn' || category === 'planed' || category === 'profiles' || category === 'specials') {
      dims = `${thickStr} x ${widthStr} x ${lengthStr}`;
    } else if (category === 'dowels') {
      dims = `Ø ${diameter} mm x ${lengthStr}`;
    } else if (category === 'brichete') {
      dims = lang === 'ro' ? 'Palet (960 kg greutate netă)' : (lang === 'nl' ? 'Pallet (960 kg netto gewicht)' : (lang === 'de' ? 'Palette (960 kg Nettogewicht)' : 'Pallet (960 kg net weight)'));
    }

    return {
      category,
      subCategory: currentSubcat,
      length,
      diameter,
      thickness,
      quantity,
      productName: subName,
      dimensions: dims,
      qtyText: category === 'brichete'
        ? `${quantity.toLocaleString(localeMap[lang] || 'en-US')} ${lang === 'ro' ? 'paleți' : (lang === 'nl' ? 'pallets' : (lang === 'de' ? 'Paletten' : 'pallets'))}`
        : `${quantity.toLocaleString(localeMap[lang] || 'en-US')} ${getTranslation('pieces')}`,
      qtyVal: quantity,
      finish: data.finish[lang] || data.finish.nl,
      price: details.totalPrice,
      unitPrice: details.unitPrice,
      discountPercent: details.discountPercent,
      grade,
      lengthType,
      fsc,
      drying,
      additionalInfo,
      woodType,
      steamed,
      radius: (category === 'planed' && currentSubcat === 'planed-radius') ? radius : undefined
    };
  };

  const activeSelection = getActiveSelectionDetails();

  const handleFormSubmit = () => {
    const currentItem = {
      category,
      subCategory: category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : category === 'planed' ? subCategoryPlaned : '',
      radius: (category === 'planed' && subCategoryPlaned === 'planed-radius') ? radius : undefined,
      length,
      diameter,
      thickness: categoryData[category].thickness ? thickness : 0,
      quantity,
      grade,
      lengthType,
      fsc,
      drying,
      additionalInfo,
      woodType,
      steamed
    };

    const calculatedBase = calculatePriceDetails(
      currentItem.category,
      currentItem.length,
      currentItem.diameter,
      currentItem.thickness,
      1,
      currentItem.subCategory,
      currentItem.grade || 'A',
      currentItem.lengthType || 'standard',
      currentItem.drying || 'kd'
    );

    addToCart({
      id: 'config-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      isConfigured: true,
      categoryKey: currentItem.category,
      category: activeSelection.productName.split(' - ')[0],
      name: activeSelection.productName,
      qty: currentItem.quantity,
      grade: currentItem.grade,
      dims: activeSelection.dimensions,
      fsc: currentItem.fsc,
      drying: currentItem.drying,
      additionalInfo: currentItem.additionalInfo,
      price: activeSelection.price,
      baseUnitPrice: calculatedBase.unitPrice,
      discountPercent: activeSelection.discountPercent,
      woodType: currentItem.woodType || 'beech',
      steamed: currentItem.steamed || 'no',
      finish: activeSelection.finish,
      subCategory: currentItem.subCategory,
      radius: currentItem.radius,
      length: currentItem.length,
      diameter: currentItem.diameter,
      thickness: currentItem.thickness,
    });

    setNotification(getTranslation('addSuccess'));
    setTimeout(() => setNotification(null), 4000);
    setIsCartOpen(true);
  };

  const handleConfigureAnother = () => {
    const currentItem = {
      category,
      subCategory: category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : category === 'planed' ? subCategoryPlaned : '',
      radius: (category === 'planed' && subCategoryPlaned === 'planed-radius') ? radius : undefined,
      length,
      diameter,
      thickness: categoryData[category].thickness ? thickness : 0,
      quantity,
      grade,
      lengthType,
      fsc,
      drying,
      additionalInfo,
      woodType,
      steamed
    };

    const calculatedBase = calculatePriceDetails(
      currentItem.category,
      currentItem.length,
      currentItem.diameter,
      currentItem.thickness,
      1,
      currentItem.subCategory,
      currentItem.grade || 'A',
      currentItem.lengthType || 'standard',
      currentItem.drying || 'kd'
    );

    addToCart({
      id: 'config-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      isConfigured: true,
      categoryKey: currentItem.category,
      category: activeSelection.productName.split(' - ')[0],
      name: activeSelection.productName,
      qty: currentItem.quantity,
      grade: currentItem.grade,
      dims: activeSelection.dimensions,
      fsc: currentItem.fsc,
      drying: currentItem.drying,
      additionalInfo: currentItem.additionalInfo,
      price: activeSelection.price,
      baseUnitPrice: calculatedBase.unitPrice,
      discountPercent: activeSelection.discountPercent,
      woodType: currentItem.woodType || 'beech',
      steamed: currentItem.steamed || 'no',
      finish: activeSelection.finish,
      subCategory: currentItem.subCategory,
      radius: currentItem.radius,
      length: currentItem.length,
      diameter: currentItem.diameter,
      thickness: currentItem.thickness,
    });

    setNotification(getTranslation('addSuccess'));
    setTimeout(() => setNotification(null), 4000);
    setIsCartOpen(true);
    handleStartOver();
  };

  // State Machine logic for Chatbot conversation steps
  const getNextStepInfo = (currentStepId, cat, lenType, widthTypeVal, thickTypeVal) => {
    switch (currentStepId) {
      case 'category':
        if (cat === 'brichete') {
          return { step: 'quantity', botMsgKey: 'chooseQuantity', optionsType: 'quantity' };
        } else if (cat === 'sawn') {
          return { step: 'widthType', botMsgKey: 'chooseWidthType', optionsType: 'widthType' };
        } else {
          return { step: 'subcategory', botMsgKey: 'chooseSubcategory', optionsType: 'subcategory' };
        }
      case 'subcategory':
        if (cat === 'dowels') {
          return { step: 'diameter', botMsgKey: 'chooseDiameter', optionsType: 'diameter' };
        } else {
          return { step: 'widthType', botMsgKey: 'chooseWidthType', optionsType: 'widthType' };
        }
      case 'diameter':
        return { step: 'lengthType', botMsgKey: 'chooseLengthType', optionsType: 'lengthType' };
      case 'widthType':
        return { step: 'width', botMsgKey: widthTypeVal === 'standard' ? 'chooseWidthStandard' : 'chooseWidthCustom', optionsType: 'width' };
      case 'width':
        return { step: 'thicknessType', botMsgKey: 'chooseThicknessType', optionsType: 'thicknessType' };
      case 'thicknessType':
        return { step: 'thickness', botMsgKey: thickTypeVal === 'standard' ? 'chooseThicknessStandard' : 'chooseThicknessCustom', optionsType: 'thickness' };
      case 'thickness':
        return { step: 'lengthType', botMsgKey: 'chooseLengthType', optionsType: 'lengthType' };
      case 'lengthType':
        return { step: 'length', botMsgKey: lenType === 'standard' ? 'chooseLengthStandard' : 'chooseLengthCustom', optionsType: 'length' };
      case 'length':
        if (cat === 'planed' && subCategoryPlaned === 'planed-radius') {
          return { step: 'radius', botMsgKey: 'chooseRadius', optionsType: 'radius' };
        }
        return { step: 'grade', botMsgKey: 'chooseGrade', optionsType: 'grade' };
      case 'radius':
        return { step: 'grade', botMsgKey: 'chooseGrade', optionsType: 'grade' };
      case 'grade':
        return { step: 'fsc', botMsgKey: 'chooseFsc', optionsType: 'fsc' };
      case 'fsc':
        if (cat === 'sawn') {
          return { step: 'drying', botMsgKey: 'chooseDrying', optionsType: 'drying' };
        } else {
          return { step: 'quantity', botMsgKey: 'chooseQuantity', optionsType: 'quantity' };
        }
      case 'drying':
        return { step: 'quantity', botMsgKey: 'chooseQuantity', optionsType: 'quantity' };
      case 'quantity':
        return { step: 'summary', botMsgKey: 'showSummary', optionsType: 'summary' };
      default:
        return null;
    }
  };

  const proceedToNextStep = (choiceValue) => {
    // Update active history item with userChoice
    const updatedHistory = [...history];
    const currentItem = updatedHistory[updatedHistory.length - 1];
    currentItem.userChoice = choiceValue;

    // Apply values to standard states
    let nextCat = category;
    let nextLenType = lengthType;
    let nextWidthType = widthType;
    let nextThickType = thicknessType;

    if (currentItem.step === 'category') {
      nextCat = choiceValue;
      setCategory(choiceValue);
    } else if (currentItem.step === 'lengthType') {
      nextLenType = choiceValue;
      setLengthType(choiceValue);
    } else if (currentItem.step === 'widthType') {
      nextWidthType = choiceValue;
      setWidthType(choiceValue);
    } else if (currentItem.step === 'thicknessType') {
      nextThickType = choiceValue;
      setThicknessType(choiceValue);
    } else if (currentItem.step === 'subcategory') {
      if (category === 'dowels') setSubCategoryDowels(choiceValue);
      else if (category === 'profiles') setSubCategoryProfiles(choiceValue);
      else if (category === 'specials') setSubCategorySpecials(choiceValue);
      else if (category === 'planed') setSubCategoryPlaned(choiceValue);
    } else if (currentItem.step === 'diameter' || currentItem.step === 'width') {
      setDiameter(choiceValue);
    } else if (currentItem.step === 'thickness') {
      setThickness(choiceValue);
    } else if (currentItem.step === 'length') {
      setLength(choiceValue);
    } else if (currentItem.step === 'radius') {
      setRadius(choiceValue);
    } else if (currentItem.step === 'grade') {
      setGrade(choiceValue);
    } else if (currentItem.step === 'fsc') {
      setFsc(choiceValue);
    } else if (currentItem.step === 'drying') {
      setDrying(choiceValue);
    } else if (currentItem.step === 'quantity') {
      setQuantity(choiceValue);
    }

    const nextStepObj = getNextStepInfo(currentItem.step, nextCat, nextLenType, nextWidthType, nextThickType);

    if (nextStepObj) {
      setIsTyping(true);
      setHistory(updatedHistory);

      setTimeout(() => {
        setIsTyping(false);
        setHistory(prev => [...prev, { ...nextStepObj, userChoice: null }]);
      }, 600);
    } else {
      setHistory(updatedHistory);
    }
  };

  const handleGoBack = () => {
    if (history.length <= 1) return;

    const updatedHistory = [...history];
    updatedHistory.pop();
    const prevItem = updatedHistory[updatedHistory.length - 1];
    prevItem.userChoice = null;

    setIsTyping(false);
    setHistory(updatedHistory);
  };

  // Localized bot messages
  const getBotMessageText = (stepObj) => {
    const data = categoryData[category];
    const catName = data ? (data.name[lang] || data.name.nl) : '';

    switch (stepObj.step) {
      case 'category':
        return lang === 'nl' 
          ? `Hallo B2B partner! Ik ben **Willem**, uw virtuele PALROM adviseur. Samen gaan we stapsgewijs uw houtproduct configureren. Welke productcategorie wilt u samenstellen?`
          : (lang === 'ro' ? `Bună ziua! Sunt **Willem**, consilierul virtual PALROM. Împreună vom configura pas cu pas produsul dvs. Ce categorie de produse doriți să asamblați?`
          : (lang === 'de' ? `Hallo B2B-Partner! Ich bin **Willem**, Ihr virtueller PALROM-Berater. Gemeinsam konfigurieren wir Schritt für Schritt Ihr Holzprodukt. Welche Produktkategorie möchten Sie zusammenstellen?`
          : `Hello B2B partner! I am **Willem**, your virtual PALROM advisor. Together we will configure your wood product step-by-step. Which product category would you like to assemble?`));
      
      case 'subcategory':
        return lang === 'nl'
          ? `Mooi! Voor **${catName}** hebben we verschillende varianten. Welke subcategorie heeft uw voorkeur?`
          : (lang === 'ro' ? `Minunat! Pentru **${catName}** avem mai multe variante. Ce subcategorie preferați?`
          : (lang === 'de' ? `Schön! Für **${catName}** haben wir verschiedene Varianten. Welche Unterkategorie bevorzugen Sie?`
          : `Great! For **${catName}** we have several variants. Which subcategory do you prefer?`));
      
      case 'diameter':
        return lang === 'nl'
          ? `Laten we de dikte bepalen. Kies een standaarddiameter (Ø mm) voor uw stokken:`
          : (lang === 'ro' ? `Să determinăm grosimea. Alegeți un diametru standard (Ø mm) pentru tije:`
          : (lang === 'de' ? `Lassen Sie uns die Dicke bestimmen. Wählen Sie einen Standarddurchmesser (Ø mm) für Ihre Stäbe:`
          : `Let's determine the thickness. Choose a standard diameter (Ø mm) for your sticks:`));
          
      case 'widthType':
        return lang === 'nl'
          ? `Wilt u een standaardbreedte kiezen of heeft u een specifieke maatvoering (maatwerk) nodig?`
          : (lang === 'ro' ? `Doriți să alegeți o lățime standard sau aveți nevoie de dimensiuni specifice (personalizate)?`
          : (lang === 'de' ? `Möchten Sie eine Standardbreite wählen oder benötigen Sie spezielle Maße (Maßanfertigung)?`
          : `Would you like to choose a standard width or do you need specific dimensions (custom)?`));
          
      case 'width':
        return stepObj.botMsgKey === 'chooseWidthStandard'
          ? (lang === 'nl' ? `Selecteer een van onze standaardbreedtes:` : (lang === 'ro' ? `Selectați una dintre lățimile noastre standard:` : (lang === 'de' ? `Wählen Sie eine unserer Standardbreiten:` : `Select one of our standard widths:`)))
          : (lang === 'nl' ? `Sleep de slider naar de gewenste breedte (in mm):` : (lang === 'ro' ? `Glisați glisorul la lățimea dorită (în mm):` : (lang === 'de' ? `Schieben Sie den Regler auf die gewünschte Breite (in mm):` : `Slide the slider to the desired width (in mm):`)));
          
      case 'thicknessType':
        return lang === 'nl'
          ? `Voor de dikte: wilt u een standaardmaat of maatwerk invoeren?`
          : (lang === 'ro' ? `Pentru grosime: doriți o dimensiune standard sau personalizată?`
          : (lang === 'de' ? `Für die Dicke: Möchten Sie ein Standardmaß oder eine Maßanfertigung eingeben?`
          : `For the thickness: would you like to enter a standard dimension or custom?`));
          
      case 'thickness':
        return stepObj.botMsgKey === 'chooseThicknessStandard'
          ? (lang === 'nl' ? `Selecteer een van onze standaarddiktes:` : (lang === 'ro' ? `Selectați una dintre grosimile noastre standard:` : (lang === 'de' ? `Wählen Sie eine unserer Standardstärken:` : `Select one of our standard thicknesses:`)))
          : (lang === 'nl' ? `Stel de gewenste dikte in (in mm):` : (lang === 'ro' ? `Setați grosimea dorită (în mm):` : (lang === 'de' ? `Stellen Sie die gewünschte Dicke ein (in mm):` : `Set the desired thickness (in mm):`)));
          
      case 'lengthType':
        return lang === 'nl'
          ? `Voor de lengte: wilt u een standaardmaat (bijv. 1000 mm) of een exacte maat invoeren?`
          : (lang === 'ro' ? `Pentru lungime: doriți o dimensiune standard (de ex. 1000 mm) sau să introduceți o dimensiune exactă?`
          : (lang === 'de' ? `Für die Länge: Möchten Sie ein Standardmaß (z. B. 1000 mm) oder ein genaues Maß eingeben?`
          : `For the length: would you like to enter a standard dimension (e.g. 1000 mm) or an exact dimension?`));
          
      case 'length':
        return stepObj.botMsgKey === 'chooseLengthStandard'
          ? (lang === 'nl' ? `Selecteer een van onze standaardlengtes:` : (lang === 'ro' ? `Selectați una dintre lungimile noastre standard:` : (lang === 'de' ? `Wählen Sie eine unserer Standardlängen:` : `Select one of our standard lengths:`)))
          : (lang === 'nl' ? `Voer de exacte lengte in (in mm):` : (lang === 'ro' ? `Introduceți lungimea exactă (în mm):` : (lang === 'de' ? `Geben Sie die genaue Länge ein (in mm):` : `Enter the exact length (in mm):`)));
          
      case 'radius':
        return lang === 'nl'
          ? `Welke radius instelling heeft uw voorkeur voor de geschaafde radius latten?`
          : (lang === 'ro' ? `Ce setare de rază preferați pentru șipcile cu rază rinduită?`
          : (lang === 'de' ? `Welche Radiuseinstellung bevorzugen Sie für die gehobelten Radiusleisten?`
          : `Which radius setting do you prefer for the planed radius slats?`));

      case 'grade':
        return lang === 'nl'
          ? `Welke kwaliteitsklasse wenst u? Klasse A is volledig noestvrij. Klasse B bevat gezonde noesten en is ideaal voor meubelbouw.`
          : (lang === 'ro' ? `Ce clasă de calitate doriți? Clasa A este fără noduri. Clasa B conține noduri sănătoase și este ideală pentru mobilier.`
          : (lang === 'de' ? `Welche Qualitätsklasse wünschen Sie? Klasse A ist absolut fehlerfrei. Klasse B enthält gesunde Äste und ist ideal für Möbel.`
          : `Which quality grade do you require? Class A is completely clear. Class B contains healthy knots and is ideal for furniture.`));
      case 'fsc':
        return lang === 'nl'
          ? `Wilt u dat dit hout FSC®-gecertificeerd (FSC 100%) geleverd wordt?`
          : (lang === 'ro' ? `Doriți ca acest lemn să fie livrat cu certificare FSC® (FSC 100%)?`
          : (lang === 'de' ? `Möchten Sie dieses Holz mit FSC®-Zertifizierung (FSC 100%) geliefert bekommen?`
          : `Do you require this wood to be FSC®-certified (FSC 100%)?`));
      case 'drying':
        return lang === 'nl'
          ? `Welke droging wenst u voor uw blanks? Kamerdroog (KD 10-12%) of luchtdroog (AD)?`
          : (lang === 'ro' ? `Ce metodă de uscare doriți pentru blanks? Uscat în cameră (KD 10-12%) sau uscat natural (AD)?`
          : (lang === 'de' ? `Welche Trocknung wünschen Sie für Ihre Blanks? Kammergetrocknet (KD 10-12%) oder luftgetrocknet (AD)?`
          : `Which drying do you require for your blanks? Kiln-dried (KD 10-12%) or air-dried (AD)?`));
          
      case 'quantity':
        return lang === 'nl'
          ? `Als laatste stap: hoeveel eenheden heeft u nodig? Vul hieronder het gewenste aantal in:`
          : (lang === 'ro' ? `Ca ultimul pas: de câte unități aveți nevoie? Introduceți cantitatea dorită mai jos:`
          : (lang === 'de' ? `Als letzter Schritt: Wie viele Einheiten benötigen Sie? Geben Sie unten die gewünschte Menge ein:`
          : `As the final step: how many units do you need? Enter the desired quantity below:`));
          
      case 'summary':
        return lang === 'nl'
          ? `Perfect! Ik heb de specificaties berekend en het visuele model klaargezet. Controleer uw selectie en voeg deze toe aan uw aanvraag:`
          : (lang === 'ro' ? `Perfect! Am calculat specificațiile și am pregătit modelul vizual. Verificați selecția și adăugați-o la solicitarea dvs.:`
          : (lang === 'de' ? `Perfekt! Ich habe die Spezifikationen berechnet und das visuelle Modell vorbereitet. Überprüfen Sie Ihre Auswahl und fügen Sie sie Ihrer Anfrage hinzu:`
          : `Perfect! I have calculated the specifications and prepared the visual model. Check your selection and add it to your request:`));
          
      default:
        return '';
    }
  };

  // Localized user choices labels
  const getUserChoiceLabel = (stepObj) => {
    const val = stepObj.userChoice;
    if (val === null || val === undefined) return '';

    switch (stepObj.step) {
      case 'category':
        return categoryData[val]?.name[lang] || categoryData[val]?.name.nl || val;
      case 'subcategory':
        let subcat = '';
        if (category === 'dowels') subcat = dowelSubcategories.find(s => s.id === val);
        else if (category === 'profiles') subcat = profileSubcategories.find(s => s.id === val);
        else if (category === 'specials') subcat = specialsSubcategories.find(s => s.id === val);
        else if (category === 'planed') subcat = planedSubcategories.find(s => s.id === val);
        return subcat ? (subcat.name[lang] || subcat.name.nl) : val;
      case 'diameter':
        return `Ø ${val} mm`;
      case 'widthType':
        return val === 'standard' ? getV3Translation('standardWidth') : getV3Translation('customWidth');
      case 'thicknessType':
        return val === 'standard' ? getV3Translation('standardThickness') : getV3Translation('customThickness');
      case 'lengthType':
        return val === 'standard' ? getV3Translation('standardLength') : getV3Translation('customLength');
      case 'width':
      case 'thickness':
      case 'length':
        return `${val} mm`;
      case 'radius':
        return val;
      case 'grade':
        return `Klasse ${val}`;
      case 'fsc':
        return val ? getTranslation('fscLabelFscCertifiedSelect') : getTranslation('fscLabelNonFsc');
      case 'drying':
        return val === 'kd' ? getTranslation('dryingValueKiln') : getTranslation('dryingValueAir');
      case 'quantity':
        return category === 'brichete'
          ? `${val.toLocaleString(localeMap[lang] || 'en-US')} pallets`
          : `${val.toLocaleString(localeMap[lang] || 'en-US')} stuks`;
      default:
        return String(val);
    }
  };

  const getV3Translation = (key) => {
    return tV3[key]?.[lang] || tV3[key]?.nl || '';
  };

  // Temporary local states for active question controls
  const activeStep = history[history.length - 1];
  const [localInputLength, setLocalInputLength] = useState(1000);
  const [localInputWidth, setLocalInputWidth] = useState(50);
  const [localInputThickness, setLocalInputThickness] = useState(25);
  const [localFsc, setLocalFsc] = useState(true);
  const [localDrying, setLocalDrying] = useState('kd');
  const [localQuantity, setLocalQuantity] = useState(500);

  // Sync locals when step changes
  useEffect(() => {
    if (activeStep) {
      if (activeStep.step === 'length') setLocalInputLength(lengthType === 'custom' ? 1000 : standardLengthRanges[4]);
      if (activeStep.step === 'width') setLocalInputWidth(widthType === 'custom' ? 50 : standardSawnWidth[1]);
      if (activeStep.step === 'thickness') setLocalInputThickness(thicknessType === 'custom' ? 25 : standardSawnThickness[1]);
      if (activeStep.step === 'fsc') setLocalFsc(fsc);
      if (activeStep.step === 'drying') setLocalDrying(drying);
      if (activeStep.step === 'quantity') setLocalQuantity(minQty);
    }
  }, [activeStep, category]);

  return (
    <>
      <style>{`
        .chat-container {
          max-width: 720px;
          margin: 1.5rem auto 3rem;
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          height: 680px;
          overflow: hidden;
          position: relative;
        }
        .chat-header {
          background: #111111;
          color: #ffffff;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--color-primary);
        }
        .chat-avatar-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .chat-avatar {
          width: 2.75rem;
          height: 2.75rem;
          background: #222222;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: var(--color-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .chat-history {
          flex: 1;
          padding: 2rem 1.5rem;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .chat-bubble {
          max-width: 82%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
          position: relative;
          animation: slideUp 0.25s ease-out;
        }
        .bubble-bot {
          align-self: flex-start;
          background: #ffffff;
          color: var(--color-text-dark);
          border: 1px solid var(--color-border);
          border-top-left-radius: 0;
          box-shadow: var(--shadow-sm);
        }
        .bubble-user {
          align-self: flex-end;
          background: var(--color-primary);
          color: #ffffff;
          border-top-right-radius: 0;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }
        .bubble-bot-bold {
          font-weight: 700;
          color: var(--color-primary-dark);
        }
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.25rem 0.5rem;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .chat-footer {
          border-top: 1px solid var(--color-border);
          background: #ffffff;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .input-panel {
          width: 100%;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .chip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.5rem;
        }
        .chip-button {
          background: #ffffff;
          border: 1.5px solid var(--color-border);
          padding: 0.65rem 0.75rem;
          border-radius: var(--border-radius-md);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-dark);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .chip-button:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(29, 58, 36, 0.02);
        }
        .chip-button-category {
          background: #ffffff;
          border: 1.5px solid var(--color-border);
          padding: 1rem 0.5rem;
          border-radius: var(--border-radius-md);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-dark);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 105px;
        }
        .chip-button-category:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(29, 58, 36, 0.02);
        }
        .chip-button-subcat {
          background: #ffffff;
          border: 1.5px solid var(--color-border);
          padding: 0.5rem;
          border-radius: var(--border-radius-md);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-dark);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-height: 110px;
          position: relative;
          overflow: visible;
        }
        .chip-button-subcat:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(29, 58, 36, 0.02);
        }
        .chip-subcat-img {
          max-height: 52px;
          max-width: 100%;
          object-fit: contain;
          margin-bottom: 0.5rem;
          border-radius: 4px;
          transition: transform 0.2s;
        }
        .chip-button-subcat:hover .chip-subcat-img {
          transform: scale(1.05);
        }
        .chip-subcat-label {
          font-size: 0.72rem;
          line-height: 1.25;
          width: 100%;
          text-align: center;
          margin-top: auto;
          word-break: break-word;
        }
        .chip-subcat-popover {
          position: absolute;
          bottom: 118%;
          left: 50%;
          transform: translate(-50%, 8px);
          width: 140px;
          background: #ffffff;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          z-index: 99;
          padding: 6px;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s ease-out;
        }
        .chip-button-subcat:hover .chip-subcat-popover {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 0);
        }
        .chip-subcat-popover::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px;
          border-style: solid;
          border-color: #ffffff transparent transparent transparent;
        }
        .chip-subcat-popover::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px;
          border-style: solid;
          border-color: var(--color-border) transparent transparent transparent;
          margin-top: 1px;
        }
        .slider-control-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .chat-svg-card {
          margin-top: 1rem;
          background: #fdfbf7;
          border: 1px dashed rgba(29, 58, 36, 0.2);
          border-radius: 8px;
          padding: 0.5rem;
          max-width: 320px;
        }
        .chat-summary-table {
          width: 100%;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          border-collapse: collapse;
        }
        .chat-summary-table td {
          padding: 0.3rem 0;
          border-bottom: 1px solid #edf2f7;
        }
        .chat-footer .btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: var(--border-radius-md);
          transition: all 0.2s;
          cursor: pointer;
        }
        .chat-footer .btn-primary {
          background-color: var(--color-primary) !important;
          color: var(--color-text-dark) !important;
          border: 2px solid var(--color-primary) !important;
        }
        .chat-footer .btn-primary:hover {
          background-color: var(--color-primary-light) !important;
          border-color: var(--color-primary-light) !important;
          transform: translateY(-1px);
        }
        .chat-footer .btn-secondary {
          background-color: #ffffff !important;
          color: var(--color-text-dark) !important;
          border: 2px solid var(--color-text-dark) !important;
        }
        .chat-footer .btn-secondary:hover {
          background-color: var(--color-text-dark) !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .btn-lock {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 0.6rem 1.2rem;
          border-radius: var(--border-radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-lock:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(29, 58, 36, 0.02);
        }
        .chat-header .btn-lock {
          background: transparent !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
        }
        .chat-header .btn-lock:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #ffffff !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Breadcrumb section */}
      <section className="configurator-hero" style={{ padding: '8.5rem 0 2rem', background: '#ffffff', borderBottom: '1px solid #edf2f7' }}>
        <div className="container">
          <Link href="/configurator" className="btn-lock" style={{ textDecoration: 'none', marginBottom: '0.75rem' }}>
            <i className="fa-solid fa-chevron-left"></i> {getTranslation('backToHub')}
          </Link>
          <h1 style={{ marginTop: '0.5rem', color: 'var(--color-text-dark)', fontSize: '2.2rem', fontWeight: 800 }}>
            {getTranslation('heroTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
            {getTranslation('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Chat Section */}
      <section style={{ padding: '1rem 0 5rem', background: '#f8fafc' }}>
        <div className="container">
          
          <div className="chat-container">
            
            {/* Header */}
            <div className="chat-header">
              <div className="chat-avatar-wrapper">
                <div className="chat-avatar">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Willem</h3>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span>
                    Online B2B Adviseur
                  </span>
                </div>
              </div>
              <button onClick={handleStartOver} className="btn-lock" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
                <i className="fa-solid fa-rotate-left"></i> {getTranslation('resetConfig')}
              </button>
            </div>

            {/* Message History */}
            <div className="chat-history" ref={chatHistoryRef}>
              {history.map((stepObj, idx) => {
                const isLatest = idx === history.length - 1;
                const showBotMsg = !isLatest || !isTyping;

                const getNumericValue = (val, defaultVal = 0) => {
                  if (typeof val === 'string' && val.includes('-')) {
                    return parseInt(val.split('-')[1]) || defaultVal;
                  }
                  return parseInt(val) || defaultVal;
                };

                const numLen = getNumericValue(length, 1000);
                const numDiam = getNumericValue(diameter, 50);
                const numThick = getNumericValue(thickness, 25);

                const getSubcategoryName = (cat, subCat) => {
                  if (!subCat) return '';
                  let found = null;
                  if (cat === 'planed') {
                    found = planedSubcategories.find(s => s.id === subCat);
                  } else if (cat === 'dowels') {
                    found = dowelSubcategories.find(s => s.id === subCat);
                  } else if (cat === 'profiles') {
                    found = profileSubcategories.find(s => s.id === subCat);
                  } else if (cat === 'specials') {
                    found = specialsSubcategories.find(s => s.id === subCat);
                  }
                  return found ? found.name[lang] || found.name.nl : subCat;
                };

                const svgW = 320;
                const svgH = 180;

                const lScale = Math.min(220, Math.max(50, (numLen / 3000) * 220));
                const wScale = Math.min(60, Math.max(15, (numDiam / 150) * 60));
                const tScale = Math.min(50, Math.max(10, (numThick / 100) * 50));

                const woodColorMain = grade === 'A' ? '#ebd4b9' : (grade === 'B' ? '#dfbf9f' : '#cfac8c');
                const woodColorFront = grade === 'A' ? '#dfbf9f' : (grade === 'B' ? '#cfa67f' : '#be956f');
                const woodColorEnd = grade === 'A' ? '#cba57e' : (grade === 'B' ? '#b88f66' : '#a77d54');

                const startX = (svgW - lScale) / 2 - 10;
                const startY = svgH / 2;
                const dRadiusX = Math.min(wScale / 2, 20);
                const dRadiusY = wScale / 2;

                const x0 = (svgW - lScale) / 2 + (wScale * 0.3);
                const y0 = svgH / 2 + (tScale * 0.4) + 10;

                const lx = lScale;
                const ly = 0;

                const wx = -wScale * 0.6;
                const wy = -wScale * 0.4;

                const zx = 0;
                const zy = -tScale;

                const p0 = `${x0},${y0}`;
                const p1 = `${x0 + lx},${y0 + ly}`;
                const p2 = `${x0 + lx + zx},${y0 + ly + zy}`;
                const p3 = `${x0 + zx},${y0 + zy}`;
                const p4 = `${x0 + lx + wx + zx},${y0 + ly + wy + zy}`;
                const p5 = `${x0 + wx + zx},${y0 + wy + zy}`;
                const p6 = `${x0 + wx},${y0 + wy}`;

                return (
                  <React.Fragment key={idx}>
                    {/* Bot Message Bubble */}
                    {showBotMsg && (
                      <div className="chat-bubble bubble-bot">
                        <span dangerouslySetInnerHTML={{ __html: getBotMessageText(stepObj).replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--color-primary-dark)">$1</strong>') }} />

                        {/* Inline Previews inside summary step */}
                        {stepObj.step === 'summary' && (
                          <div style={{ marginTop: '1rem' }}>
                            <div className="chat-svg-card">
                              <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="150" style={{ overflow: 'visible' }}>
                                <defs>
                                  <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#f3e8de" />
                                    <stop offset="30%" stopColor={woodColorMain} />
                                    <stop offset="70%" stopColor={woodColorFront} />
                                    <stop offset="100%" stopColor={woodColorEnd} />
                                  </linearGradient>
                                  <linearGradient id="endGrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={woodColorEnd} />
                                    <stop offset="100%" stopColor="#8d643d" />
                                  </linearGradient>
                                </defs>
                                {category === 'dowels' ? (
                                  <g>
                                    <path d={`M ${startX} ${startY - dRadiusY} A ${dRadiusX} ${dRadiusY} 0 0 0 ${startX} ${startY + dRadiusY}`} fill={woodColorEnd} opacity="0.6" />
                                    <rect x={startX} y={startY - dRadiusY} width={lScale} height={dRadiusY * 2} fill="url(#cylinderGrad)" />
                                    <ellipse cx={startX + lScale} cy={startY} rx={dRadiusX} ry={dRadiusY} fill="url(#endGrainGrad)" stroke="#cfa67f" strokeWidth="0.8" />
                                  </g>
                                ) : category === 'brichete' ? (
                                  <g>
                                    <rect x={svgW/2 - 50} y={svgH/2 - 20} width={90} height={40} rx="4" fill="#a77d54" stroke="#8d643d" strokeWidth="1.5" />
                                    <rect x={svgW/2 - 40} y={svgH/2 - 5} width={90} height={40} rx="4" fill="#be956f" stroke="#8d643d" strokeWidth="1.5" />
                                  </g>
                                ) : (
                                  <g>
                                    <polygon points={`${p0} ${p3} ${p5} ${p6}`} fill={woodColorEnd} stroke="rgba(141, 100, 61, 0.4)" strokeWidth="0.8" />
                                    <polygon points={`${p0} ${p1} ${p2} ${p3}`} fill="url(#cylinderGrad)" stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                                    <polygon points={`${p3} ${p2} ${p4} ${p5}`} fill={woodColorMain} stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                                  </g>
                                )}
                              </svg>
                            </div>
                            
                            <table className="chat-summary-table">
                              <tbody>
                                {/* 1. Product */}
                                <tr>
                                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('productRow')}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.productName}</td>
                                </tr>
                                {/* 2. Subcategory */}
                                {category !== 'brichete' && activeSelection.subCategory && (
                                  <tr>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                      {lang === 'nl' ? 'Subcategorie' : (lang === 'de' ? 'Unterkategorie' : (lang === 'ro' ? 'Subcategorie' : 'Subcategory'))}
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                      {getSubcategoryName(category, activeSelection.subCategory)}
                                    </td>
                                  </tr>
                                )}
                                {/* 3. Wood Species */}
                                <tr>
                                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('woodSpeciesRow')}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                    {category === 'brichete'
                                      ? (lang === 'nl' ? 'Beuken (Surplus zaagsel)' : (lang === 'ro' ? 'Fag (Surplus de rumeguș)' : (lang === 'de' ? 'Buche (Sägemehl)' : 'Beechwood (Sawdust surplus)')))
                                      : getTranslation('beechwoodValue')}
                                  </td>
                                </tr>
                                {/* 4. Quality Grade */}
                                {category !== 'brichete' && (
                                  <tr>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('gradeRow')}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                      {activeSelection.grade === 'A'
                                        ? getTranslation('gradeAValue')
                                        : activeSelection.grade === 'B'
                                        ? getTranslation('gradeBValue')
                                        : activeSelection.grade === 'C'
                                        ? getTranslation('gradeCValue')
                                        : activeSelection.grade}
                                    </td>
                                  </tr>
                                )}
                                {/* 5. Dimensions */}
                                <tr>
                                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('dimensionsRow')}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.dimensions}</td>
                                </tr>
                                {/* Radius (only for planed-radius) */}
                                {category === 'planed' && subCategoryPlaned === 'planed-radius' && activeSelection.radius && (
                                  <tr>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Radius</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.radius}</td>
                                  </tr>
                                )}
                                {/* 6. Quantity */}
                                <tr>
                                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('quantityRow')}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.qtyText}</td>
                                </tr>
                                {/* 7. Finish */}
                                <tr>
                                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('finishRow')}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.finish}</td>
                                </tr>
                                {/* 8. Drying */}
                                {category !== 'brichete' && (
                                  <tr>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('dryingRow')}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                      {activeSelection.drying === 'luchtdroog'
                                        ? getTranslation('dryingValueAir')
                                        : getTranslation('dryingValueKiln')}
                                    </td>
                                  </tr>
                                )}
                                {/* 9. Steamed */}
                                {category !== 'brichete' && (
                                  <tr>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('steamedRow')}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                      {activeSelection.steamed === 'yes'
                                        ? getTranslation('steamedValueYes')
                                        : getTranslation('steamedValueNo')}
                                    </td>
                                  </tr>
                                )}
                                {/* 10. FSC */}
                                {category !== 'brichete' && (
                                  <tr>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('fscRow')}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                      {activeSelection.fsc
                                        ? 'FSC® 100%'
                                        : getTranslation('fscLabelNonFsc')}
                                    </td>
                                  </tr>
                                )}
                                {SHOW_PRICING && (
                                  <tr>
                                    <td style={{ color: 'var(--color-forest-dark)', fontWeight: 700 }}>{getTranslation('totalCumulativePrice').split(':')[0]}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>
                                      € {activeSelection.price.toLocaleString(localeMap[lang] || 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bot Typing Indicator */}
                    {isLatest && isTyping && (
                      <div className="chat-bubble bubble-bot" style={{ padding: '0.75rem 1rem' }}>
                        <div className="typing-indicator">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    )}

                    {/* User Message Bubble */}
                    {stepObj.userChoice !== null && (
                      <div className="chat-bubble bubble-user">
                        {getUserChoiceLabel(stepObj)}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Input Controls Footer Area */}
            <div className="chat-footer">
              
              {!isTyping && activeStep && activeStep.userChoice === null && (
                <div className="input-panel">
                  
                  {/* CATEGORY INPUT WIDGET */}
                  {activeStep.optionsType === 'category' && (
                    <div className="chip-grid">
                      {categoriesList.filter(cat => cat.id !== 'brichete' || isRomania).map((cat) => {
                        const lines = getCategoryLabelLines(cat.id, lang);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => proceedToNextStep(cat.id)}
                            className="chip-button-category"
                          >
                            <i className={cat.icon} style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}></i>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.25 }}>
                              {lines[0]}
                              <br />
                              {lines[1]}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SUBCATEGORY WIDGET */}
                  {activeStep.optionsType === 'subcategory' && (
                    <div className="chip-grid">
                      {category === 'dowels' && dowelSubcategories.map(s => (
                        <button key={s.id} onClick={() => proceedToNextStep(s.id)} className="chip-button-subcat">
                          {s.img && (
                            <div className="chip-subcat-img-wrapper" style={{ position: 'relative', width: '100%', height: '52px', overflow: 'hidden', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                              <img src={s.img} alt="" className="chip-subcat-img" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              <ProfileDrawingOverlay subCategoryId={s.id} />
                            </div>
                          )}
                          <div className="chip-subcat-label">{s.name[lang] || s.name.nl}</div>
                          {s.img && (
                            <div className="chip-subcat-popover">
                              <div style={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden', borderRadius: '6px' }}>
                                <img src={s.img} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                      {category === 'planed' && planedSubcategories.map(s => (
                        <button key={s.id} onClick={() => proceedToNextStep(s.id)} className="chip-button-subcat">
                          {s.img && (
                            <div className="chip-subcat-img-wrapper" style={{ position: 'relative', width: '100%', height: '52px', overflow: 'hidden', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                              <img src={s.img} alt="" className="chip-subcat-img" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              <ProfileDrawingOverlay subCategoryId={s.id} />
                            </div>
                          )}
                          <div className="chip-subcat-label">{s.name[lang] || s.name.nl}</div>
                          {s.img && (
                            <div className="chip-subcat-popover">
                              <div style={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden', borderRadius: '6px' }}>
                                <img src={s.img} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                      {category === 'profiles' && profileSubcategories.map(s => (
                        <button key={s.id} onClick={() => proceedToNextStep(s.id)} className="chip-button-subcat">
                          {s.img && (
                            <div className="chip-subcat-img-wrapper" style={{ position: 'relative', width: '100%', height: '52px', overflow: 'hidden', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                              <img src={s.img} alt="" className="chip-subcat-img" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              <ProfileDrawingOverlay subCategoryId={s.id} />
                            </div>
                          )}
                          <div className="chip-subcat-label">{s.name[lang] || s.name.nl}</div>
                          {s.img && (
                            <div className="chip-subcat-popover">
                              <div style={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden', borderRadius: '6px' }}>
                                <img src={s.img} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                      {category === 'specials' && specialsSubcategories.map(s => (
                        <button key={s.id} onClick={() => proceedToNextStep(s.id)} className="chip-button-subcat">
                          {s.img && (
                            <div className="chip-subcat-img-wrapper" style={{ position: 'relative', width: '100%', height: '52px', overflow: 'hidden', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                              <img src={s.img} alt="" className="chip-subcat-img" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              <ProfileDrawingOverlay subCategoryId={s.id} />
                            </div>
                          )}
                          <div className="chip-subcat-label">{s.name[lang] || s.name.nl}</div>
                          {s.img && (
                            <div className="chip-subcat-popover">
                              <div style={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden', borderRadius: '6px' }}>
                                <img src={s.img} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0 }} />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* DIAMETER WIDGET (Rods) */}
                  {activeStep.optionsType === 'diameter' && (
                    <div>
                      <div className="chip-grid" style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.5rem' }}>
                        {standardRodDiameters
                          .filter(d => {
                            if (category === 'dowels' && subCategoryDowels === 'dowel-rilled') {
                              return d >= 6 && d <= 20;
                            }
                            return true;
                          })
                          .map(d => (
                            <button key={d} onClick={() => proceedToNextStep(d)} className="chip-button" style={{ padding: '0.4rem' }}>Ø {d} mm</button>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {/* PRESET CHIPS (Width/Thickness/Length Types) */}
                  {(activeStep.optionsType === 'widthType' || activeStep.optionsType === 'thicknessType' || activeStep.optionsType === 'lengthType') && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => proceedToNextStep('standard')} className="btn btn-secondary" style={{ flex: 1, minWidth: '130px' }}>
                        {activeStep.optionsType === 'widthType' && getV3Translation('standardWidth')}
                        {activeStep.optionsType === 'thicknessType' && getV3Translation('standardThickness')}
                        {activeStep.optionsType === 'lengthType' && getV3Translation('standardLength')}
                      </button>
                      <button onClick={() => proceedToNextStep('custom')} className="btn btn-primary" style={{ flex: 1, minWidth: '130px' }}>
                        {activeStep.optionsType === 'widthType' && getV3Translation('customWidth')}
                        {activeStep.optionsType === 'thicknessType' && getV3Translation('customThickness')}
                        {activeStep.optionsType === 'lengthType' && getV3Translation('customLength')}
                      </button>
                    </div>
                  )}

                  {/* WIDTH SLIDER OR SELECT */}
                  {activeStep.optionsType === 'width' && (
                    <div>
                      {widthType === 'standard' ? (
                        <div className="chip-grid">
                          {standardSawnWidth.map(w => (
                            <button key={w} onClick={() => proceedToNextStep(w)} className="chip-button">{w} mm</button>
                          ))}
                        </div>
                      ) : (
                        <div className="slider-wrapper" style={{ width: '100%', gap: '1rem', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="range"
                            min={categoryData[category].diameter.min}
                            max={currentMaxWidth}
                            value={localInputWidth}
                            onChange={(e) => setLocalInputWidth(parseInt(e.target.value))}
                            className="dashboard-slider"
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <input
                              type="number"
                              value={localInputWidth}
                              onChange={(e) => setLocalInputWidth(Math.max(categoryData[category].diameter.min, Math.min(currentMaxWidth, parseInt(e.target.value) || 0)))}
                              className="slider-value-display"
                              style={{ width: '75px', height: '40px', fontSize: '0.9rem', paddingLeft: '0.65rem' }}
                            />
                            <span style={{ color: 'var(--color-text-dark)', fontSize: '0.9rem', fontWeight: 600 }}>mm</span>
                          </div>
                          <button onClick={() => proceedToNextStep(localInputWidth)} className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem', height: '40px', borderRadius: 'var(--border-radius-md)' }}>Ok</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* THICKNESS SLIDER OR SELECT */}
                  {activeStep.optionsType === 'thickness' && (
                    <div>
                      {thicknessType === 'standard' ? (
                        <div className="chip-grid">
                          {standardSawnThickness.map(tVal => (
                            <button key={tVal} onClick={() => proceedToNextStep(tVal)} className="chip-button">{tVal} mm</button>
                          ))}
                        </div>
                      ) : (
                        <div className="slider-wrapper" style={{ width: '100%', gap: '1rem', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="range"
                            min={categoryData[category].thickness.min}
                            max={categoryData[category].thickness.max}
                            value={localInputThickness}
                            onChange={(e) => setLocalInputThickness(parseInt(e.target.value))}
                            className="dashboard-slider"
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <input
                              type="number"
                              value={localInputThickness}
                              onChange={(e) => setLocalInputThickness(Math.max(categoryData[category].thickness.min, Math.min(categoryData[category].thickness.max, parseInt(e.target.value) || 0)))}
                              className="slider-value-display"
                              style={{ width: '75px', height: '40px', fontSize: '0.9rem', paddingLeft: '0.65rem' }}
                            />
                            <span style={{ color: 'var(--color-text-dark)', fontSize: '0.9rem', fontWeight: 600 }}>mm</span>
                          </div>
                          <button onClick={() => proceedToNextStep(localInputThickness)} className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem', height: '40px', borderRadius: 'var(--border-radius-md)' }}>Ok</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LENGTH SLIDER OR SELECT */}
                  {activeStep.optionsType === 'length' && (
                    <div>
                      {lengthType === 'standard' ? (
                        <div className="chip-grid">
                          {standardLengthRanges.map(lenRange => (
                            <button key={lenRange} onClick={() => proceedToNextStep(lenRange)} className="chip-button">{lenRange} mm</button>
                          ))}
                        </div>
                      ) : (
                        <div className="slider-wrapper" style={{ width: '100%', gap: '1rem', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="range"
                            min={categoryData[category].length.min}
                            max={categoryData[category].length.max}
                            step="10"
                            value={localInputLength}
                            onChange={(e) => setLocalInputLength(parseInt(e.target.value))}
                            className="dashboard-slider"
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <input
                              type="number"
                              value={localInputLength}
                              onChange={(e) => setLocalInputLength(Math.max(categoryData[category].length.min, Math.min(categoryData[category].length.max, parseInt(e.target.value) || 0)))}
                              className="slider-value-display"
                              style={{ width: '75px', height: '40px', fontSize: '0.9rem', paddingLeft: '0.65rem' }}
                            />
                            <span style={{ color: 'var(--color-text-dark)', fontSize: '0.9rem', fontWeight: 600 }}>mm</span>
                          </div>
                          <button onClick={() => proceedToNextStep(localInputLength)} className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem', height: '40px', borderRadius: 'var(--border-radius-md)' }}>Ok</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RADIUS WIDGET */}
                  {activeStep.optionsType === 'radius' && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => proceedToNextStep('R3')} className="btn btn-secondary" style={{ flex: 1 }}>
                        R3 (3mm)
                      </button>
                      <button onClick={() => proceedToNextStep('R6')} className="btn btn-secondary" style={{ flex: 1 }}>
                        R6 (6mm)
                      </button>
                    </div>
                  )}

                  {/* QUALITY GRADE WIDGET */}
                  {activeStep.optionsType === 'grade' && (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => proceedToNextStep('A')} className="btn btn-secondary" style={{ flex: 1 }}>{getTranslation('gradeASelect')}</button>
                      <button onClick={() => proceedToNextStep('B')} className="btn btn-secondary" style={{ flex: 1 }}>{getTranslation('gradeBSelect')}</button>
                      {category !== 'dowels' && category !== 'profiles' && (
                        <button onClick={() => proceedToNextStep('C')} className="btn btn-secondary" style={{ flex: 1 }}>{getTranslation('gradeCSelect')}</button>
                      )}
                    </div>
                  )}

                  {/* FSC CERTIFICATION WIDGET */}
                  {activeStep.optionsType === 'fsc' && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => proceedToNextStep(true)} className="btn btn-secondary" style={{ flex: 1 }}>
                        {getTranslation('fscLabelFscCertifiedSelect')}
                      </button>
                      <button onClick={() => proceedToNextStep(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                        {getTranslation('fscLabelNonFsc')}
                      </button>
                    </div>
                  )}

                  {/* DRYING WIDGET */}
                  {activeStep.optionsType === 'drying' && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => proceedToNextStep('kd')} className="btn btn-secondary" style={{ flex: 1 }}>
                        {getTranslation('dryingValueKiln')}
                      </button>
                      <button onClick={() => proceedToNextStep('luchtdroog')} className="btn btn-secondary" style={{ flex: 1 }}>
                        {getTranslation('dryingValueAir')}
                      </button>
                    </div>
                  )}

                  {/* QUANTITY COUNTER WIDGET */}
                  {activeStep.optionsType === 'quantity' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-lock"
                          style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', fontWeight: 700 }}
                          onClick={() => setLocalQuantity(prev => Math.max(minQty, prev - (category === 'brichete' ? 1 : 500)))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={localQuantity}
                          onChange={(e) => setLocalQuantity(parseInt(e.target.value) || 0)}
                          onBlur={() => { if (localQuantity < minQty) setLocalQuantity(minQty); }}
                          style={{ width: '100px', textAlign: 'center', fontWeight: 700, padding: '0.4rem', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                        />
                        <button
                          type="button"
                          className="btn-lock"
                          style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', fontWeight: 700 }}
                          onClick={() => setLocalQuantity(prev => prev + (category === 'brichete' ? 1 : 500))}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {category === 'brichete'
                          ? (lang === 'nl' ? 'Minimale afname: 1 pallet.' : (lang === 'ro' ? 'Comandă minimă: 1 palet.' : (lang === 'de' ? 'Mindestbestellmenge: 1 Palette.' : 'Minimum order: 1 pallet.')))
                          : getTranslation('moqNotice').replace('{minQty}', minQty.toLocaleString(localeMap[lang] || 'en-US'))}
                      </span>
                      <button onClick={() => proceedToNextStep(localQuantity)} className="btn btn-primary btn-block" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Aantal bevestigen <i className="fa-solid fa-circle-check icon-right"></i>
                      </button>
                    </div>
                  )}

                  {/* FINAL SUMMARY / SUBMIT WIDGET */}
                  {activeStep.optionsType === 'summary' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button onClick={handleFormSubmit} className="btn btn-primary btn-block" style={{ width: '100%', padding: '0.85rem' }}>
                        {getTranslation('addToInquiry')} <i className="fa-solid fa-cart-plus icon-right"></i>
                      </button>
                      <button onClick={handleConfigureAnother} className="btn btn-secondary btn-block" style={{ width: '100%' }}>
                        Nog een product configureren <i className="fa-solid fa-plus icon-right"></i>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* Back navigation control */}
              {history.length > 1 && !isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                  <button onClick={handleGoBack} className="btn-lock" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: 'transparent' }}>
                    <i className="fa-solid fa-arrow-left"></i> Vorige stap
                  </button>
                </div>
              )}

            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem', color: '#9ca3af', fontSize: '0.8rem' }}>
            <span>Configurator v3.0.0 (Chatbot)</span>
          </div>

        </div>
      </section>

      {/* Toast Notification */}
      {notification && (
        <div className="toast-notify">
          <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{notification}</span>
        </div>
      )}
    </>
  );
}

function ProfileDrawingOverlay({ subCategoryId }) {
  const getShape = () => {
    switch (subCategoryId) {
      case 'dowel-smooth':
        return <circle cx="50" cy="50" r="28" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'dowel-rilled':
        return (
          <>
            <circle cx="50" cy="50" r="28" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="#ffd875" strokeWidth="1" opacity="0.6" />
          </>
        );
      case 'planed-rect':
        return <rect x="20" y="32" width="60" height="36" rx="1" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'planed-radius':
        return <rect x="20" y="32" width="60" height="36" rx="8" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-semiround':
        return <path d="M 20 65 A 30 30 0 0 1 80 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-strip':
        return <rect x="15" y="40" width="70" height="20" rx="1" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-finish-v1':
        return <path d="M 20 65 L 20 50 C 30 50 35 40 45 40 H 80 V 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-quarter-v1':
        return <path d="M 30 65 A 40 40 0 0 1 70 25 L 70 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-finish-v2':
        return <path d="M 20 65 V 55 C 30 55 35 40 45 40 H 80 V 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-plinth-v1':
        return <path d="M 35 75 V 25 C 45 25 55 35 55 45 V 75 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-corner-v1':
      case 'profile-corner-v2':
        return <path d="M 25 25 H 42 V 60 H 75 V 75 H 25 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-triangular':
        return <path d="M 25 70 H 75 V 20 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-quarter-v2':
        return <path d="M 30 65 A 40 40 0 0 1 70 25 V 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'profile-thread':
        return (
          <>
            <circle cx="50" cy="50" r="26" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />
            <circle cx="50" cy="50" r="31" fill="none" stroke="#ffd875" strokeWidth="1" strokeDasharray="3 3" />
          </>
        );
      case 'profile-calbat':
        return <path d="M 20 65 V 35 H 35 L 40 45 H 60 L 65 35 H 80 V 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'special-keeplat-spruce':
      case 'special-keeplat-beech':
        return <path d="M 20 65 L 80 45 V 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'special-distancer-mix':
        return <rect x="30" y="40" width="40" height="20" rx="1" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'special-threshold':
        return <path d="M 20 65 V 40 L 80 48 V 65 Z" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'special-distancer-ind':
        return <rect x="25" y="35" width="50" height="30" rx="2" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      case 'special-wood-iron':
        return <rect x="15" y="32" width="70" height="36" rx="0" fill="rgba(255, 216, 117, 0.15)" stroke="#ffd875" strokeWidth="4" />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(29, 58, 36, 0.45)',
      transition: 'background 0.2s ease',
    }}>
      <svg style={{ width: '80%', height: '80%', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} viewBox="0 0 100 100">
        {getShape()}
      </svg>
    </div>
  );
}
