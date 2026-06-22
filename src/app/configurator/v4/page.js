'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';

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
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
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
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
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
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
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
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
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

const specialsPrices = {
  'Keeplat Spruce': 1.25,
  'Keeplat Beech': 1.65,
  'Distancers Color Mix': 0.15,
  'Food Industry Components': 2.10,
  'Industrial Distancer': 0.38,
  'Rough-sawn Specials': 1.45,
};

const dowelSubcategories = [
  { id: 'dowel-smooth', name: { nl: 'Glad', en: 'Smooth', de: 'Glatt', ro: 'Neted' } },
  { id: 'dowel-rilled', name: { nl: 'Gerild', en: 'Rilled', de: 'Geriffelt', ro: 'Canelat' } },
];

const profileSubcategories = [
  { id: 'profile-semiround', name: { nl: 'Halfronde latten', en: 'Semiround Profile', de: 'Halbrundprofile', ro: 'Șipci semirotunde' } },
  { id: 'profile-strip', name: { nl: 'Deklatten / platte lijsten', en: 'Profile Strip', de: 'Profilleisten / Flachleisten', ro: 'Șipci plate' } },
  { id: 'profile-finish-v1', name: { nl: 'Afwerklijsten (Variant 1)', en: 'Profile Finishing (Variant 1)', de: 'Finishing-Profile (V1)', ro: 'Șipci de finisaj (V1)' } },
  { id: 'profile-quarter-v1', name: { nl: 'Kwartronde lijsten (Variant 1)', en: 'Profile Quarter Round (Variant 1)', de: 'Viertelrundprofile (V1)', ro: 'Profile sfert de cerc (V1)' } },
  { id: 'profile-finish-v2', name: { nl: 'Afwerklijsten (Variant 2)', en: 'Profile Finishing (Variant 2)', de: 'Finishing-Profile (V2)', ro: 'Șipci de finisaj (V2)' } },
  { id: 'profile-plinth-v1', name: { nl: 'Plinten (Variant 1)', en: 'Profile Plinth (Variant 1)', de: 'Sockelleisten (V1)', ro: 'Plinte (V1)' } },
  { id: 'profile-corner-v1', name: { nl: 'Hoekprofielen (Variant 1)', en: 'Profile Corner (Variant 1)', de: 'Eckprofile (V1)', ro: 'Profile de colț (V1)' } },
  { id: 'profile-corner-v2', name: { nl: 'Hoekprofielen (Variant 2)', en: 'Profile Corner (Variant 2)', de: 'Eckprofile (V2)', ro: 'Profile de colț (V2)' } },
  { id: 'profile-triangular', name: { nl: 'Driehoekige glaslatten', en: 'Profile Triangular', de: 'Dreikantleisten', ro: 'Șipci triunghiulare' } },
  { id: 'profile-quarter-v2', name: { nl: 'Kwartronde lijsten (Variant 2)', en: 'Profile Quarter Round (Variant 2)', de: 'Viertelrundprofile (V2)', ro: 'Profile sfert de cerc (V2)' } },
  { id: 'profile-thread', name: { nl: 'Geprotocolleerde schroefdraadlatten', en: 'Profile Thread', de: 'Gewindestäbe', ro: 'Profile filetate' } },
  { id: 'profile-calbat', name: { nl: 'Calbat profielen', en: 'Profile Calbat', de: 'Calbat-Profile', ro: 'Profile Calbat' } },
];

const specialsSubcategories = [
  { id: 'special-keeplat-spruce', name: { nl: 'Vuren keeplat (spie)', en: 'Keeplat Spruce', de: 'Keilleiste Fichte', ro: 'Pană din Lemn de Molid' } },
  { id: 'special-keeplat-beech', name: { nl: 'Beuken keeplat (spie)', en: 'Keeplat Beech', de: 'Keilleiste Buche', ro: 'Pană din Lemn de Fag' } },
  { id: 'special-distancer-mix', name: { nl: 'Afstandhouders kleurenmix', en: 'Distancers Color Mix', de: 'Abstandhalter Farbmix', ro: 'Distanțiere Mix de Culori' } },
  { id: 'special-threshold', name: { nl: 'Componenten voedingsindustrie', en: 'Food industry components', de: 'Komponenten für Lebensmittelindustrie', ro: 'Componente pentru industria alimentară' } },
  { id: 'special-distancer-ind', name: { nl: 'Industriële afstandhouder', en: 'Industrial Distancer', de: 'Industrieller Abstandhalter', ro: 'Distanțier Industrial' } },
  { id: 'special-wood-iron', name: { nl: 'Gezaagde bestekken (fijnbezaagd)', en: 'Rough-sawn specials (fine-sawn)', de: 'Sägerauhe Zuschnitte', ro: 'Piese brute netăiate' } },
];

const planedSubcategories = [
  { id: 'planed-rect-v1', name: { nl: 'Geschaafde latten (Variant 1)', en: 'Planed Rectangular (Variant 1)', de: 'Gehobelte Leisten (V1)', ro: 'Șipci rinduite (V1)' } },
  { id: 'planed-rect-v2', name: { nl: 'Geschaafde latten (Variant 2)', en: 'Planed Rectangular (Variant 2)', de: 'Gehobelte Leisten (V2)', ro: 'Șipci rinduite (V2)' } },
  { id: 'planed-rect-v3', name: { nl: 'Geschaafde latten (Variant 3)', en: 'Planed Rectangular (Variant 3)', de: 'Gehobelte Leisten (V3)', ro: 'Șipci rinduite (V3)' } },
  { id: 'planed-rect-v4', name: { nl: 'Geschaafde latten (Variant 4)', en: 'Planed Rectangular (Variant 4)', de: 'Gehobelte Leisten (V4)', ro: 'Șipci rinduite (V4)' } },
  { id: 'planed-sq-v1', name: { nl: 'Vierkante latten (Variant 1)', en: 'Planed Square (Variant 1)', de: 'Quadratische Leisten (V1)', ro: 'Șipci pătrate (V1)' } },
  { id: 'planed-sq-v2', name: { nl: 'Vierkante latten (Variant 2)', en: 'Planed Square (Variant 2)', de: 'Quadratische Leisten (V2)', ro: 'Șipci pătrate (V2)' } },
  { id: 'planed-rad3', name: { nl: 'Geschaafd met radius R3', en: 'Planed Elements with Radius 3', de: 'Gehobelte Elemente mit R3', ro: 'Elemente rinduite cu rază R3' } },
  { id: 'planed-rad6', name: { nl: 'Geschaafd met radius R6', en: 'Planed Elements with Radius 6', de: 'Gehobelte Elemente mit R6', ro: 'Elemente rinduite cu rază R6' } },
];

const translations = {
  loading: { nl: 'Inladen portal...', en: 'Loading portal...', de: 'Portal wird geladen...', ro: 'Se încarcă portalul...' },
  bricheteRomaniaOnly: {
    nl: 'Beukenhoutbriketten zijn uitsluitend te koop in Roemenië. Buiten Roemenië leveren wij alleen onze B2B houtproducten (blanks, latten, stokken, profielen en bestekken).',
    en: 'Beechwood briquettes are exclusively sold in Romania. Outside Romania, we only supply our B2B wood products (blanks, slats, sticks, profiles, and specials).',
    de: 'Buchenholzbriketts werden ausschließlich in Rumänien verkauft. Außerhalb Rumäniens liefern wir nur unsere B2B-Holzprodukte (Zuschnitte, Leisten, Stäbe, Profile und Sonderanfertigungen).',
    ro: 'Brichetele din lemn de fag sunt vândute exclusiv în România. În afara României, furnizăm doar produsele noastre din lemn B2B (piese brute, șipci, tije, profile și piese speciale).'
  },
  v4PortalTitle: { nl: 'Willem AI - Beveiligde Toegang', en: 'Willem AI - Secured Access', de: 'Willem AI - Gesicherter Zugriff', ro: 'Willem AI - Acces Securizat' },
  v4PortalLead: { nl: 'Voer het aanvullende wachtwoord in om toegang te krijgen tot de Willem AI configurator.', en: 'Enter the additional password to access the Willem AI configurator.', de: 'Geben Sie das zusätzliche Passwort ein, um auf den Willem AI-Konfigurator zuzugreifen.', ro: 'Introduceți parola suplimentară pentru a accesa configuratorul Willem AI.' },
  v4PasswordLabel: { nl: 'Wachtwoord Willem AI *', en: 'Willem AI Password *', de: 'Willem AI Passwort *', ro: 'Parolă Willem AI *' },
  v4PasswordError: { nl: 'Ongeldig wachtwoord voor Willem AI. Probeer het opnieuw.', en: 'Invalid password for Willem AI. Please try again.', de: 'Ungültiges Passwort für Willem AI. Bitte versuchen Sie es erneut.', ro: 'Parolă invalidă pentru Willem AI. Vă rugăm să încercați din nou.' },
  v4UnlockButton: { nl: 'Toegang Ontgrendelen', en: 'Unlock Access', de: 'Zugang entsperren', ro: 'Deblochează Accesul' },
  v4ShowPasswordAria: { nl: 'Wachtwoord tonen/verbergen', en: 'Show/hide password', de: 'Passwort anzeigen/ausblenden', ro: 'Afișează/ascunde parola' },
  heroBreadcrumb: { nl: 'Palrom Offerte Configurator', en: 'Palrom Quote Configurator', de: 'Palrom Angebotskonfigurator', ro: 'Configurator de Oferte Palrom' },
  heroTitle: { nl: 'Willem AI - Open Chatbot', en: 'Willem AI - Open Chatbot', de: 'Willem AI - Offener Chatbot', ro: 'Willem AI - Chatbot Deschis' },
  heroSubtitle: { nl: 'Configureer uw B2B houtproducten door eenvoudig te chatten in vrije tekst met onze virtuele salesadviseur Willem.', en: 'Configure your B2B wood products by simply chatting in free text with our virtual sales advisor Willem.', de: 'Konfigurieren Sie Ihre B2B-Holzprodukte, indem Sie einfach im Freitext mit unserem virtuellen Verkaufsberater Willem chatten.', ro: 'Configurați-vă produsele din lemn B2B pur și simplu discutând în text liber cu consilierul nostru de vânzări virtual Willem.' },
  
  // Specs table rows
  productRow: { nl: 'Product', en: 'Product', de: 'Produkt', ro: 'Produs' },
  woodSpeciesRow: { nl: 'Houtsoort', en: 'Wood Species', de: 'Holzart', ro: 'Specie de Lemn' },
  beechwoodValue: { nl: 'Beuken', en: 'Beechwood', de: 'Buchenholz', ro: 'Fag' },
  gradeRow: { nl: 'Kwaliteitsklasse', en: 'Quality Grade', de: 'Qualitätsklasse', ro: 'Clasă de Calitate' },
  dimensionsRow: { nl: 'Afmetingen', en: 'Dimensions', de: 'Maße', ro: 'Dimensiuni' },
  quantityRow: { nl: 'Oplage', en: 'Quantity', de: 'Auflage', ro: 'Cantitate' },
  finishRow: { nl: 'Afwerking', en: 'Finish', de: 'Oberfläche', ro: 'Finisaj' },
  dryingRow: { nl: 'Droging', en: 'Drying', de: 'Trocknung', ro: 'Uscare' },
  steamedRow: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
  certificationLabel: { nl: 'FSC® Certificering', en: 'FSC® Certification', de: 'FSC®-Zertifizierung', ro: 'Certificare FSC®' },
  
  // Spec values
  gradeAValue: { nl: 'Klasse A (Foutvrij)', en: 'Class A (Clear)', de: 'Klasse A (Astfrei)', ro: 'Clasa A (Fără noduri)' },
  gradeBValue: { nl: 'Klasse B (Meubelhout)', en: 'Class B (Cabinet)', de: 'Klasse B (Möbelholz)', ro: 'Clasa B (Lemn mobilă)' },
  gradeCValue: { nl: 'Klasse C (Constructief)', en: 'Class C (Structural)', de: 'Klasse C (Konstruktive Qualität)', ro: 'Clasa C (Calitate de construcție)' },
  steamedValueNo: { nl: 'Ongestoomd', en: 'Unsteamed', de: 'Ungedämpft', ro: 'Neaburit' },
  steamedValueYes: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
  dryingValueKiln: { nl: 'Kamerdroog (KD 10-12%)', en: 'Kiln-Dried (KD 10-12%)', de: 'Kammergetrocknet (KD 10-12%)', ro: 'Uscat în Cameră (KD 10-12%)' },
  dryingValueAir: { nl: 'Luchtdroog (AD)', en: 'Air-Dried (AD)', de: 'Luftgetrocknet (AD)', ro: 'Uscat Natural (AD)' },
  fscLabelFscCertifiedSelect: { nl: 'FSC® 100%', en: 'FSC® 100%', de: 'FSC® 100%', ro: 'FSC® 100%' },
  fscLabelNonFsc: { nl: 'Geen FSC', en: 'No FSC', de: 'Kein FSC', ro: 'Fără FSC' },
  
  // Chat placeholders & UI
  placeholderInput: {
    nl: 'Typ hier uw vraag.',
    en: 'Type your question here.',
    de: 'Geben Sie hier Ihre Frage ein.',
    ro: 'Scrieți întrebarea dvs. aici.'
  },
  btnSend: { nl: 'Verzend', en: 'Send', de: 'Senden', ro: 'Trimite' },
  resetText: { nl: 'Opnieuw beginnen', en: 'Start Over', de: 'Neustart', ro: 'Reîncepe' },
  backText: { nl: 'Vorige', en: 'Back', de: 'Zurück', ro: 'Înapoi' },
  addToInquiry: { nl: 'Toevoegen aan Offerteaanvraag', en: 'Add to Quote Request', de: 'Zur Angebotsanfrage hinzufügen', ro: 'Adaugă la solicitarea de ofertă' },
  addedToCart: { nl: 'Toegevoegd aan Uw Offerteaanvraag!', en: 'Added to your quote request!', de: 'Zu Ihrer Angebotsanfrage hinzugefügt!', ro: 'Adăugat la cererea dvs. de ofertă!' },
  addedToQuote: { nl: 'Toegevoegd aan offerte', en: 'Added to quote', de: 'Zum Angebot hinzugefügt', ro: 'Adăugat la ofertă' },
  configureAnother: { nl: 'Nog een product configureren', en: 'Configure another product', de: 'Anderes Produkt konfigurieren', ro: 'Configurați alt produs' },
  pieces: { nl: 'stuks', en: 'pieces', de: 'Stück', ro: 'bucăți' },
  viewCart: { nl: 'Bekijk offerteaanvraag', en: 'View quote request', de: 'Angebotsanfrage ansehen', ro: 'Vizualizați cererea de ofertă' },
  micTooltip: {
    nl: 'Spreek uw specificaties in',
    en: 'Speak your specifications',
    de: 'Sprechen Sie Ihre Spezifikationen ein',
    ro: 'Rostiți specificațiile dvs.'
  },
  micListening: {
    nl: 'Aan het luisteren... Spreek nu uw wensen in.',
    en: 'Listening... Speak your wishes now.',
    de: 'Zuhören... Sprechen Sie jetzt Ihre Wünsche.',
    ro: 'Se ascultă... Rostiți specificațiile dvs. acum.'
  },
  activeSelectionTitle: { nl: 'Gedetecteerde Specificaties', en: 'Detected Specifications', de: 'Erkannte Spezifikationen', ro: 'Specificații Detectate' },
  visualizerTitle: { nl: 'Live voorbeeld', en: 'Live preview', de: 'Live-Vorschau', ro: 'Previzualizare live' },

  // Willem replies
  welcomeMessage: {
    nl: 'Hallo! Ik ben **Willem**, uw virtuele B2B salesadviseur. Typ hieronder in uw eigen woorden wat u zoekt of spreek in!<br/>Bijvoorbeeld: *"Ik ben op zoek naar 1500 beukenhouten blanks met afmetingen van 25x75x1200 mm in klasse A, kamerdroog."* of geef uw wensen stap voor stap door.',
    en: 'Hello! I am **Willem**, your virtual B2B sales advisor. Tell me in your own words what you are looking for or speak it!<br/>For example: *"I am looking for 1500 beechwood blanks with dimensions of 25x75x1200 mm in class A, kiln dried."* or describe your requirements step by step.',
    de: 'Hallo! Ich bin **Willem**, Ihr virtueller B2B-Verkaufsberater. Schreiben Sie mir in eigenen Worten, was Sie suchen, oder sprechen Sie es ein!<br/>Zum Beispiel: *"Ich suche 1500 Buchenholz-Blanks mit den Maßen 25x75x1200 mm in Klasse A, kammergetrocknet."* oder teilen Sie mir Ihre Wünsche Schritt für Schritt mit.',
    ro: 'Bună! Sunt **Willem**, consilierul dvs. virtual de vânzări B2B. Scrieți-mi în propriile cuvinte ceea ce căutați sau rostiți cerințele!<br/>De exemplu: *"Caut 1500 piese brute din fag cu dimensiunile de 25x75x1200 mm, clasa A, uscate în cameră."* sau descrieți specificațiile dorite pas cu pas.'
  },
  understandConfirmation: {
    nl: 'Ik heb de volgende specificaties gedetecteerd en bijgewerkt:',
    en: 'I have detected and updated the following specifications:',
    de: 'Ich habe die folgenden Spezifikationen erkannt und aktualisiert:',
    ro: 'Am detectat și actualizat următoarele specificații:'
  },
  askCategory: {
    nl: 'Welk type product wilt u configureren? Kies uit **blanks (piese brute)**, **latten (slats)**, **stokken (dowels)**, **profielen (profiles)**, of **bestekken (specials)**.',
    en: 'Which type of product would you like to configure? Choose from **blanks**, **slats**, **sticks/dowels**, **profiles**, or **specials**.',
    de: 'Welchen Produkttyp möchten Sie konfigurieren? Wählen Sie aus **Blanks (Zuschnitte)**, **Leisten (Slats)**, **Stäben (Rundstäbe)**, **Profilen** oder **Sonderanfertigungen (Specials)**.',
    ro: 'Ce tip de produs doriți să configurați? Alegeți între **piese brute (blanks)**, **șipci (slats)**, **tije (dowels)**, **profile** sau **piese speciale (specials)**.'
  },
  askDimensions: {
    nl: 'Wat zijn de gewenste afmetingen in millimeters? Voor blanks/latten/profielen/bestekken hoor ik graag de **dikte x breedte x lengte** (bijv. *"25x75x1200mm"*). Voor stokken de **diameter x lengte**.',
    en: 'What are the desired dimensions in millimeters? For blanks/slats/profiles/specials, please specify the **thickness x width x length** (e.g., *"25x75x1200mm"*). For sticks, specify the **diameter x length**.',
    de: 'Was sind die gewünschten Maße in Millimetern? Für Blanks/Leisten/Profile/Specials benötige ich **Dicke x Breite x Länge** (z.B. *"25x75x1200mm"*). Für Rundstäbe den **Durchmesser x Länge**.',
    ro: 'Care sunt dimensiunile dorite în milimetri? Pentru piese brute/șipci/profile/speciale, vă rog să specificați **grosimea x lățimea x lungimea** (de ex. *"25x75x1200mm"*). Pentru tije, **diametrul x lungimea**.'
  },
  askGrade: {
    nl: 'Welke kwaliteitsklasse wenst u? <br/>- **Klasse A**: Vrijwel foutvrij, geen noesten.<br/>- **Klasse B**: Gezonde noesten toegestaan.<br/>- **Klasse C**: Constructieve kwaliteit.',
    en: 'Which quality grade do you require? <br/>- **Class A**: Virtually clear, no knots.<br/>- **Class B**: Sound knots allowed.<br/>- **Class C**: Structural quality.',
    de: 'Welche Qualitätsklasse wünschen Sie? <br/>- **Klasse A**: Praktisch astfrei, fehlerfrei.<br/>- **Klasse B**: Gesunde Äste erlaubt.<br/>- **Klasse C**: Konstruktive Qualität.',
    ro: 'Ce clasă de calitate doriți? <br/>- **Clasa A**: Fără noduri, calitate premium.<br/>- **Clasa B**: Sunt permise noduri sănătoase.<br/>- **Clasa C**: Calitate structurală / constructivă.'
  },
  askDrying: {
    nl: 'Moet het hout **kamerdroog** (KD 10-12%) of **luchtdroog** (AD) geleverd worden?',
    en: 'Should the timber be delivered **kiln-dried** (KD 10-12%) or **air-dried** (AD)?',
    de: 'Soll das Holz **kammergetrocknet** (KD 10-12%) oder **luftgetrocknet** (AD) geliefert werden?',
    ro: 'Lemnul trebuie livrat **uscat în cameră** (KD 10-12%) sau **uscat natural** (AD)?'
  },
  askQuantity: {
    nl: 'Hoeveel stuks heeft u nodig van deze specificatie? (Minimale afname is **500 stuks** voor maatwerk. Voor briketten per **pallet**).',
    en: 'How many pieces do you need of this specification? (Minimum order is **500 pieces** for custom dimensions. For briquettes per **pallet**).',
    de: 'Wie viele Stück benötigen Sie von dieser Spezifikation? (Die Mindestbestellmenge beträgt **500 Stück** für Maßanfertigungen. Für Briketts pro **Palette**).',
    ro: 'De câte bucăți aveți nevoie pentru această specificație? (Comanda minimă este de **500 bucăți** pentru dimensiuni personalizate. Pentru brichete la **palet**).'
  },
  askFsc: {
    nl: 'Heeft u **FSC® 100%** certificering nodig voor deze bestelling?',
    en: 'Do you require **FSC® 100%** certification for this order?',
    de: 'Benötigen Sie eine **FSC® 100%**-Zertifizierung für diese Bestellung?',
    ro: 'Aveți nevoie de certificare **FSC® 100%** pentru această comandă?'
  },
  everythingComplete: {
    nl: 'Uitstekend, ik heb alle benodigde specificaties compleet! Klopt het onderstaande live voorbeeld en de specificatietabel? Klik op de knop om de configuratie toe te voegen aan uw offerteaanvraag.',
    en: 'Excellent, I have gathered all required specifications! Does the live preview and specifications table below look correct? Click the button to add the configuration to your quote request.',
    de: 'Ausgezeichnet, ich habe alle notwendigen Spezifikationen zusammen! Stimmt die Live-Vorschau und die Spezifikationstabelle unten? Klicken Sie auf die Schaltfläche, um die Konfiguration Ihrer Angebotsanfrage hinzuzufügen.',
    ro: 'Excelent, am strâns toate specificațiile necesare! Previzualizarea live și tabelul de specificații de mai jos sunt corecte? Faceți clic pe buton pentru a adăuga configurarea la solicitarea de ofertă.'
  },
  aiGemini: {
    nl: 'Gemini AI Actief',
    en: 'Gemini AI Active',
    de: 'Gemini KI Aktiv',
    ro: 'Gemini AI Activ'
  },
  aiFallback: {
    nl: 'Lokale Fallback',
    en: 'Local Fallback',
    de: 'Lokale Fallback',
    ro: 'Rezervă Locală'
  },
  aiChecking: {
    nl: 'Controleren...',
    en: 'Checking...',
    de: 'Prüfen...',
    ro: 'Verificare...'
  },
  notYetDetected: {
    nl: 'Nog niet gedetecteerd',
    en: 'Not yet detected',
    de: 'Noch nicht erkannt',
    ro: 'Nedetectat încă'
  },
  visualizerPlaceholder: {
    nl: 'Spreek of typ uw wensen in de chat om het live voorbeeld te starten.',
    en: 'Speak or type your requirements in the chat to start the live preview.',
    de: 'Sprechen oder tippen Sie Ihre Anforderungen im Chat, um die Live-Vorschau zu starten.',
    ro: 'Rostiți sau introduceți specificațiile în chat pentru a porni previzualizarea.'
  },
  noSpecsDetected: {
    nl: 'Er zijn nog geen specificaties gedetecteerd. Begin met chatten of inspreken om specificaties toe te voegen.',
    en: 'No specifications have been detected yet. Start chatting or speaking to add specifications.',
    de: 'Es wurden noch keine Spezifikationen erkannt. Beginnen Sie zu chatten oder zu sprechen, um Spezifikationen hinzuzufügen.',
    ro: 'Nu au fost detectate specificații încă. Începeți conversația sau rostiți cerințele pentru a adăuga specificații.'
  }
};

export default function OpenChatConfigurator() {
  const { lang, addToCart, setIsCartOpen, shouldResetConfigurator, setShouldResetConfigurator, isRomania } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isV4Authenticated, setIsV4Authenticated] = useState(false);
  const [v4Password, setV4Password] = useState('');
  const [showV4Password, setShowV4Password] = useState(false);
  const [v4AuthError, setV4AuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Configurator States (parsed from open chat)
  const [category, setCategory] = useState('sawn');
  const [subCategoryDowels, setSubCategoryDowels] = useState('dowel-smooth');
  const [subCategoryProfiles, setSubCategoryProfiles] = useState('profile-semiround');
  const [subCategorySpecials, setSubCategorySpecials] = useState('special-keeplat-spruce');
  const [subCategoryPlaned, setSubCategoryPlaned] = useState('planed-rect-v1');
  
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
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Chat History & Typing Indicators
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Track parameters configured by user so we can detect what is missing
  const [filledFields, setFilledFields] = useState({
    category: false,
    dimensions: false,
    grade: false,
    drying: false,
    fsc: false,
    quantity: false,
    steamed: false
  });

  const [dimensionFlags, setDimensionFlags] = useState({
    thickness: false,
    width: false,
    length: false
  });

  const chatHistoryRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef(null);
  const isBotSpeakingRef = useRef(false);
  const activeUtteranceRef = useRef(null);
  const initialUserInputRef = useRef('');
  const userInputRef = useRef('');
  const ignoreSpeechResultsRef = useRef(false);
  const [aiEngine, setAiEngine] = useState('checking'); // 'checking' | 'gemini' | 'fallback'

  // Ping backend to check if Gemini is active or falling back
  useEffect(() => {
    if (isV4Authenticated) {
      const checkEngine = async () => {
        try {
          const res = await fetch('/api/configurator/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'ping', category: 'sawn', filledFields: {}, lang: 'nl', isRomania })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.fallback) {
              setAiEngine('fallback');
            } else {
              setAiEngine('gemini');
            }
          } else {
            setAiEngine('fallback');
          }
        } catch (err) {
          setAiEngine('fallback');
        }
      };
      checkEngine();
    }
  }, [isV4Authenticated]);

  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  // Reset isAddedToCart whenever user modifies configuration parameters
  useEffect(() => {
    setIsAddedToCart(false);
  }, [
    category,
    subCategoryDowels,
    subCategoryProfiles,
    subCategorySpecials,
    subCategoryPlaned,
    woodType,
    steamed,
    drying,
    fsc,
    grade,
    thickness,
    diameter,
    length,
    quantity,
    additionalInfo
  ]);

  // Initialize Speech Recognition on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;

        const langMap = {
          nl: 'nl-NL',
          en: 'en-US',
          de: 'de-DE',
          ro: 'ro-RO'
        };
        rec.lang = langMap[lang] || 'nl-NL';

        rec.onstart = () => {
          setIsListening(true);
          ignoreSpeechResultsRef.current = false;
          initialUserInputRef.current = userInputRef.current;
        };

        rec.onend = () => {
          setIsListening(false);
          ignoreSpeechResultsRef.current = false;
          initialUserInputRef.current = '';
        };

        rec.onerror = (event) => {
          if (event.error === 'no-speech' || event.error === 'aborted') {
            console.warn('Speech recognition status:', event.error);
          } else {
            console.error('Speech recognition error:', event.error);
          }
          setIsListening(false);
        };

        rec.onresult = (event) => {
          // If the bot is currently speaking or we are ignoring speech, ignore audio input
          if (isBotSpeakingRef.current || ignoreSpeechResultsRef.current) {
            return;
          }

          let finalTranscript = '';
          let interimTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptSegment;
            } else {
              interimTranscript += transcriptSegment;
            }
          }
          const sessionTranscript = (finalTranscript + interimTranscript).trim();
          const initial = initialUserInputRef.current || '';
          const finalVal = initial ? `${initial} ${sessionTranscript}` : sessionTranscript;
          setUserInput(finalVal);
        };

        recognitionRef.current = rec;
      }
    }
  }, [lang]);

  // Clean up speech recognition & synthesis on unmount
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, []);

  const selectVoice = (langCode) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    if (langVoices.length === 0) return null;

    // Preferred high-quality male voices across OS platforms
    let preferredNames = [];
    if (langCode === 'nl') {
      preferredNames = ['xander', 'lennart', 'arthur', 'bart', 'coen', 'nl-nl-x-nls-local'];
    } else if (langCode === 'en') {
      preferredNames = ['daniel', 'david', 'luther', 'james', 'google us english', 'en-us-x-sfg-local'];
    } else if (langCode === 'de') {
      preferredNames = ['yannick', 'stefan', 'deutschland', 'de-de-x-dfs-local'];
    } else if (langCode === 'ro') {
      preferredNames = ['alexandru', 'emil', 'ro-ro-x-ros-local'];
    }

    for (const name of preferredNames) {
      const matched = langVoices.find(v => v.name.toLowerCase().includes(name));
      if (matched) return matched;
    }

    // Secondary fallback: search for 'male' or 'man' keywords
    const maleVoice = langVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'));
    if (maleVoice) return maleVoice;

    // Default to the first available voice for this language
    return langVoices[0];
  };

  const speakText = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    isBotSpeakingRef.current = false;
    activeUtteranceRef.current = null;
    
    // Strip HTML tags and markdown symbols for clean reading
    let cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/✓/g, '')
      .replace(/Ø/g, 'diameter')
      .trim();
      
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    activeUtteranceRef.current = utterance; // Prevent garbage collection of events
    
    let langCode = 'nl';
    if (lang === 'ro') langCode = 'ro';
    else if (lang === 'de') langCode = 'de';
    else if (lang === 'en') langCode = 'en';

    const voice = selectVoice(langCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      if (langCode === 'ro') utterance.lang = 'ro-RO';
      else if (langCode === 'de') utterance.lang = 'de-DE';
      else if (langCode === 'en') utterance.lang = 'en-US';
      else utterance.lang = 'nl-NL';
    }
    
    utterance.onstart = () => {
      isBotSpeakingRef.current = true;
    };
    utterance.onend = () => {
      isBotSpeakingRef.current = false;
      activeUtteranceRef.current = null;
    };
    utterance.onerror = () => {
      isBotSpeakingRef.current = false;
      activeUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const newVal = !prev;
      if (newVal && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        isBotSpeakingRef.current = false;
      }
      return newVal;
    });
  };

  const isConfigCompleteFor = (cat, fields) => {
    if (cat === 'brichete') {
      return ['category', 'quantity'].every(k => fields[k]);
    }
    return ['category', 'dimensions', 'grade', 'drying', 'fsc', 'quantity'].every(k => fields[k]);
  };

  const handleInputSuggestion = (text) => {
    setUserInput(text);
    setTimeout(() => {
      handleSendMessage();
    }, 50);
  };

  const toggleListening = () => {
    if (!hasSpeechSupport) {
      alert(lang === 'nl' 
        ? 'Spraakherkenning wordt niet ondersteund door uw browser. Gebruik een browser zoals Chrome, Safari of Edge.' 
        : (lang === 'de'
          ? 'Spracherkennung wird von Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome, Safari oder Edge.'
          : (lang === 'ro'
            ? 'Recunoașterea vocală nu este acceptată de browser-ul dvs. Vă rugăm să folosiți Chrome, Safari sau Edge.'
            : 'Speech recognition is not supported by your browser. Please use Chrome, Safari or Edge.')));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Cancel any active bot speaking when the user starts speaking
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        isBotSpeakingRef.current = false;
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // Load session storage check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_configurator_auth') === 'true';
      if (!auth) {
        window.location.href = '/configurator';
      } else {
        setIsAuthenticated(true);
        const v4Auth = sessionStorage.getItem('palrom_configurator_v4_auth') === 'true';
        setIsV4Authenticated(v4Auth);
        setIsLoading(false);
      }
    }
  }, []);

  const handleV4PasswordSubmit = (e) => {
    e.preventDefault();
    const cleanPw = v4Password.trim().toLowerCase();
    if (cleanPw === 'willem2026' || cleanPw === 'willemai2026' || cleanPw === 'palromv4') {
      sessionStorage.setItem('palrom_configurator_v4_auth', 'true');
      setIsV4Authenticated(true);
      setV4AuthError(false);
    } else {
      setV4AuthError(true);
      setV4Password('');
    }
  };

  // Initialize chat history with welcome message
  useEffect(() => {
    if (isV4Authenticated) {
      setHistory([
        { sender: 'bot', text: getTranslation('welcomeMessage') }
      ]);
    }
  }, [isV4Authenticated, lang]);

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

  const getTranslation = (key) => {
    return translations[key]?.[lang] || translations[key]?.nl || '';
  };

  // Helper for steamed label translations
  const getSteamedLabel = (steamedVal) => {
    if (steamedVal === 'yes') {
      return getTranslation('steamedValueYes');
    }
    return getTranslation('steamedValueNo');
  };

  // Helper for drying label translations
  const getDryingLabel = (dryingVal) => {
    if (dryingVal === 'luchtdroog') {
      return getTranslation('dryingValueAir');
    }
    return getTranslation('dryingValueKiln');
  };

  // Helper for FSC label translations
  const getFscLabel = (fscVal) => {
    if (fscVal) {
      return getTranslation('fscLabelFscCertifiedSelect');
    }
    return getTranslation('fscLabelNonFsc');
  };

  // Opnieuw beginnen (Start Over)
  const handleStartOver = () => {
    setCategory('sawn');
    setSubCategoryDowels('dowel-smooth');
    setSubCategoryProfiles('profile-semiround');
    setSubCategorySpecials('special-keeplat-spruce');
    setSubCategoryPlaned('planed-rect-v1');
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
    setUserInput('');
    setFilledFields({
      category: false,
      dimensions: false,
      grade: false,
      drying: false,
      fsc: false,
      quantity: false,
      steamed: false
    });
    setDimensionFlags({
      thickness: false,
      width: false,
      length: false
    });
    setIsAddedToCart(false);
    setHistory([
      { sender: 'bot', text: getTranslation('welcomeMessage') }
    ]);
  };

  useEffect(() => {
    if (shouldResetConfigurator) {
      handleStartOver();
      setShouldResetConfigurator(false);
    }
  }, [shouldResetConfigurator, setShouldResetConfigurator]);

  const formatMarkdownToHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  // NLP Free text parser
  const parseFreeText = (text, activeCat) => {
    const cleanText = text.toLowerCase().trim();
    const updates = {};
    
    // 1. Detect Category
    let detectedCat = activeCat;
    if (/(?:blank|sawn|zaag|gezaagd|grope|roh|piese brute)/i.test(cleanText)) {
      detectedCat = 'sawn';
      updates.category = 'sawn';
    } else if (/(?:lat|slat|s4s|planed|geschaafd|rindeluit|sipci|leiste)/i.test(cleanText)) {
      detectedCat = 'planed';
      updates.category = 'planed';
    } else if (/(?:stok|dowel|rod|rundstab|tije|rotund)/i.test(cleanText)) {
      detectedCat = 'dowels';
      updates.category = 'dowels';
    } else if (/(?:profiel|profile|skirting|plint|semiround|halfhond|trapleuning|railing)/i.test(cleanText)) {
      detectedCat = 'profiles';
      updates.category = 'profiles';
    } else if (/(?:bestek|special|keeplat|keellat|zuschnitt)/i.test(cleanText)) {
      detectedCat = 'specials';
      updates.category = 'specials';
    } else if (isRomania && /(?:briket|briquette|ruf|briketts|brichete)/i.test(cleanText)) {
      detectedCat = 'brichete';
      updates.category = 'brichete';
    }

    // 2. Detect Subcategory (if category is active or detected)
    const targetCat = updates.category || activeCat;
    if (targetCat === 'dowels') {
      if (/(?:gerild|rilled|geriffelt|canelat)/i.test(cleanText)) {
        updates.subCategoryDowels = 'dowel-rilled';
      } else if (/(?:glad|smooth|glatt|neted)/i.test(cleanText)) {
        updates.subCategoryDowels = 'dowel-smooth';
      }
    } else if (targetCat === 'profiles') {
      if (/(?:halfronde|half round|halbrund|semirotund)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-semiround';
      } else if (/(?:deklat|strip|flachleiste|plata)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-strip';
      } else if (/(?:afwerklijst 1|finish 1|finisaj 1)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-finish-v1';
      } else if (/(?:afwerklijst 2|finish 2|finisaj 2)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-finish-v2';
      } else if (/(?:kwartronde 1|quarter 1|sfert 1)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-quarter-v1';
      } else if (/(?:kwartronde 2|quarter 2|sfert 2)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-quarter-v2';
      } else if (/(?:plint|skirting|sockelleiste)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-plinth-v1';
      } else if (/(?:hoek 1|corner 1|colt 1)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-corner-v1';
      } else if (/(?:hoek 2|corner 2|colt 2)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-corner-v2';
      } else if (/(?:driehoek|triangular|dreikant|triunghi)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-triangular';
      } else if (/(?:schroefdraad|thread|gewinde|filet)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-thread';
      } else if (/(?:calbat)/i.test(cleanText)) {
        updates.subCategoryProfiles = 'profile-calbat';
      }
    } else if (targetCat === 'specials') {
      if (/(?:vuren keeplat|spruce keeplat)/i.test(cleanText)) {
        updates.subCategorySpecials = 'special-keeplat-spruce';
      } else if (/(?:beuken keeplat|beech keeplat)/i.test(cleanText)) {
        updates.subCategorySpecials = 'special-keeplat-beech';
      } else if (/(?:afstandhouder kleurenmix|color mix distancer)/i.test(cleanText)) {
        updates.subCategorySpecials = 'special-distancer-mix';
      } else if (/(?:voedingsindustrie|food industry)/i.test(cleanText)) {
        updates.subCategorySpecials = 'special-threshold';
      } else if (/(?:industriele afstandhouder|industrial distancer)/i.test(cleanText)) {
        updates.subCategorySpecials = 'special-distancer-ind';
      } else if (/(?:gezaagde bestekken|rough-sawn specials)/i.test(cleanText)) {
        updates.subCategorySpecials = 'special-wood-iron';
      }
    } else if (targetCat === 'planed') {
      if (/(?:geschaafde latten 1|planed rect 1)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-rect-v1';
      } else if (/(?:geschaafde latten 2|planed rect 2)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-rect-v2';
      } else if (/(?:geschaafde latten 3|planed rect 3)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-rect-v3';
      } else if (/(?:geschaafde latten 4|planed rect 4)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-rect-v4';
      } else if (/(?:vierkante latten 1|square 1)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-sq-v1';
      } else if (/(?:vierkante latten 2|square 2)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-sq-v2';
      } else if (/(?:radius 3|r3)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-rad3';
      } else if (/(?:radius 6|r6)/i.test(cleanText)) {
        updates.subCategoryPlaned = 'planed-rad6';
      }
    }

    // 3. Dimensions parsing
    // Standard format: TxWxL (e.g. 20x50x1200 or 20 bij 50 keer 1200)
    const sepPattern = "(?:\\s*(?:[xX*]|\\bbij\\b|\\bkeer\\b|\\bby\\b|\\btimes\\b|\\bmal\\b|\\bauf\\b|\\bpe\\b|\\bcu\\b|-)\\s*|\\s+)";
    const threeDimensionsRegex = new RegExp(`\\b(\\d+)\\s*(?:mm)?${sepPattern}(\\d+)\\s*(?:mm)?${sepPattern}(\\d+)\\b`, 'i');
    const threeDimensionsMatch = cleanText.match(threeDimensionsRegex);

    if (threeDimensionsMatch && targetCat !== 'dowels' && targetCat !== 'brichete') {
      updates.thickness = parseInt(threeDimensionsMatch[1]);
      updates.diameter = parseInt(threeDimensionsMatch[2]); // width is stored in diameter
      updates.length = parseInt(threeDimensionsMatch[3]);
      updates.thicknessType = 'custom';
      updates.widthType = 'custom';
      updates.lengthType = 'custom';
    } else {
      // Two dimensions format for dowels: DxL (e.g. 15x1200 or 15 * 1200)
      const twoDimensionsRegex = new RegExp(`\\b(\\d+)\\s*(?:mm)?${sepPattern}(\\d+)\\b`, 'i');
      const twoDimensionsMatch = cleanText.match(twoDimensionsRegex);
      if (twoDimensionsMatch) {
        if (targetCat === 'dowels') {
          updates.diameter = parseInt(twoDimensionsMatch[1]);
          updates.length = parseInt(twoDimensionsMatch[2]);
          updates.widthType = 'custom';
          updates.lengthType = 'custom';
        } else if (targetCat !== 'brichete') {
          updates.diameter = parseInt(twoDimensionsMatch[1]); // width
          updates.length = parseInt(twoDimensionsMatch[2]);
          updates.widthType = 'custom';
          updates.lengthType = 'custom';
        }
      }
    }

    // Individual dimension keyword matches:
    // Thickness
    const thickMatch = cleanText.match(/(?:dikte|thickness|dicke|grosime|th|t)\s*(?:is|van|=)?\s*(\d+)\s*(?:mm)?/i);
    if (thickMatch) {
      updates.thickness = parseInt(thickMatch[1]);
      updates.thicknessType = 'custom';
    }
    // Width
    const widthMatch = cleanText.match(/(?:breedte|width|breite|latime|w|br)\s*(?:is|van|=)?\s*(\d+)\s*(?:mm)?/i);
    if (widthMatch) {
      updates.diameter = parseInt(widthMatch[1]);
      updates.widthType = 'custom';
    }
    // Length
    const lengthMatch = cleanText.match(/(?:lengte|length|lange|lungime|l)\s*(?:is|van|=)?\s*(\d+)\s*(?:mm|cm|meter|m)?/i);
    if (lengthMatch) {
      let val = parseInt(lengthMatch[1]);
      const unit = lengthMatch[2] ? lengthMatch[2].toLowerCase() : 'mm';
      if (unit === 'cm') val = val * 10;
      else if (unit === 'meter' || unit === 'm') val = val * 1000;
      updates.length = val;
      updates.lengthType = 'custom';
    }
    // Diameter (for dowels specifically)
    const diaMatch = cleanText.match(/(?:diameter|durchmesser|diametru|dia|Ø)\s*(?:is|van|=)?\s*(\d+)\s*(?:mm)?/i);
    if (diaMatch) {
      updates.diameter = parseInt(diaMatch[1]);
      updates.widthType = 'custom';
    }

    // 4. Quality Grade
    if (/(?:klasse\s*a|grade\s*a|clasa\s*a|astfrei|foutvrij|prime|superior|defectless)/i.test(cleanText)) {
      updates.grade = 'A';
    } else if (/(?:klasse\s*b|grade\s*b|clasa\s*b|rustiek|rustic|natural|mobelholz)/i.test(cleanText)) {
      updates.grade = 'B';
    } else if (/(?:klasse\s*c|grade\s*c|clasa\s*c|constructief|structural)/i.test(cleanText)) {
      updates.grade = 'C';
    }

    // 5. Steamed / Unsteamed
    if (/(?:ongestoomd|unsteamed|neaburit|ungedampft)/i.test(cleanText)) {
      updates.steamed = 'no';
    } else if (/(?:gestoomd|steamed|aburit|gedampft)/i.test(cleanText)) {
      updates.steamed = 'yes';
    }

    // 6. Drying KD/AD
    if (/(?:kd|kamerdroog|kiln dried|kammergetrocknet|cuptor)/i.test(cleanText)) {
      updates.drying = 'kd';
    } else if (/(?:ad|luchtdroog|air dried|luftgetrocknet|natural)/i.test(cleanText)) {
      updates.drying = 'luchtdroog';
    }

    // 7. FSC
    if (/(?:zonder fsc|geen fsc|no fsc|fara fsc|ohne fsc)/i.test(cleanText)) {
      updates.fsc = false;
    } else if (/(?:fsc|gecertificeerd|certified|certificare)/i.test(cleanText)) {
      updates.fsc = true;
    } else if (activeCat !== 'brichete' && !filledFields.fsc && isConfigCompleteFor(activeCat, { ...filledFields, fsc: true })) {
      // FSC is the only missing field!
      if (/^(?:ja|yes|da|ja,?\s*graag|yes,?\s*please|si|oui|ok)/i.test(cleanText)) {
        updates.fsc = true;
      } else if (/^(?:nee|no|nu|nein|non|fara)/i.test(cleanText)) {
        updates.fsc = false;
      }
    }

    // 8. Quantity
    const qtyMatch = cleanText.match(/(\d+)\s*(?:stuks|pcs|pieces|stk|bucati|stoppen|pallet|pallets|palete|palet)/i);
    if (qtyMatch) {
      updates.quantity = parseInt(qtyMatch[1]);
    } else {
      const numberMatches = cleanText.match(/\b\d{3,6}\b/g);
      if (numberMatches) {
        const filteredNumbers = numberMatches.filter(num => {
          const val = parseInt(num);
          const pattern = new RegExp(`\\d+\\s*[xX*]\\s*${num}|${num}\\s*[xX*]\\s*\\d+`);
          if (pattern.test(cleanText)) return false;
          return val >= 50;
        });
        if (filteredNumbers.length > 0) {
          updates.quantity = parseInt(filteredNumbers[0]);
        }
      }
    }

    return updates;
  };

  // Helper to get active subcategory code
  const getActiveSubCategoryCode = (catVal) => {
    if (catVal === 'dowels') return subCategoryDowels;
    if (catVal === 'profiles') return subCategoryProfiles;
    if (catVal === 'specials') return subCategorySpecials;
    if (catVal === 'planed') return subCategoryPlaned;
    return '';
  };

  const getSubcategoryName = (catVal, subcatId) => {
    let subList = [];
    if (catVal === 'dowels') subList = dowelSubcategories;
    else if (catVal === 'profiles') subList = profileSubcategories;
    else if (catVal === 'specials') subList = specialsSubcategories;
    else if (catVal === 'planed') subList = planedSubcategories;
    
    const subObj = subList.find(x => x.id === subcatId);
    return subObj ? (subObj.name[lang] || subObj.name.nl) : '';
  };

  // Validate and clamp parsed dimension/qty updates based on categories rules
  const clampParsedValues = (catVal, parsed) => {
    const clamped = { ...parsed };
    const rules = categoryData[catVal];
    if (!rules) return clamped;

    if (clamped.thickness !== undefined) {
      if (rules.thickness) {
        clamped.thickness = Math.max(rules.thickness.min, Math.min(rules.thickness.max, clamped.thickness));
      } else {
        delete clamped.thickness;
      }
    }

    if (clamped.diameter !== undefined) {
      if (rules.diameter) {
        let minDia = rules.diameter.min;
        let maxDia = rules.diameter.max;
        
        // Dowels texture restrictions
        if (catVal === 'dowels') {
          const activeSub = clamped.subCategoryDowels || subCategoryDowels;
          if (activeSub === 'dowel-rilled') {
            minDia = 6;
            maxDia = 20;
          }
        }
        clamped.diameter = Math.max(minDia, Math.min(maxDia, clamped.diameter));
      }
    }

    if (clamped.length !== undefined) {
      if (rules.length) {
        clamped.length = Math.max(rules.length.min, Math.min(rules.length.max, clamped.length));
      }
    }

    if (clamped.quantity !== undefined) {
      // MOQ checks
      let minQty = 500;
      if (catVal === 'brichete') {
        minQty = 1; // 1 pallet MOQ
      } else {
        // Blanks Sawn standard sizes has 250 MOQ
        if (catVal === 'sawn' && thicknessType === 'standard' && widthType === 'standard' && lengthType === 'standard') {
          minQty = 250;
        }
      }
      clamped.quantity = Math.max(minQty, clamped.quantity);
    }

    return clamped;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    setHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setUserInput('');

    // Stop speech recognition and ignore any late transcription events
    ignoreSpeechResultsRef.current = true;
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop speech recognition on send:', err);
      }
    }

    // Start bot typing animation
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const cleanText = userText.toLowerCase().trim();

        // Check if briquettes are discussed but geofencing restricts it (only sold in Romania)
        const isBriquettesQuery = /(?:briket|briquette|brichete|brichet|heizbriketts)/i.test(cleanText);
        if (isBriquettesQuery && !isRomania) {
          const warningText = getTranslation('bricheteRomaniaOnly');
          setHistory(prev => [...prev, { sender: 'bot', text: warningText }]);
          if (!isMuted) speakText(warningText);
          setIsTyping(false);
          return;
        }

        let parsed = null;
        let replyText = '';
        let useFallback = false;

        // Try LLM API route
        try {
          const res = await fetch('/api/configurator/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userText,
              category,
              filledFields,
              dimensionFlags,
              lang,
              isRomania
            })
          });

          if (!res.ok) {
            useFallback = true;
            setAiEngine('fallback');
          } else {
            const data = await res.json();
            if (data.fallback) {
              useFallback = true;
              setAiEngine('fallback');
            } else {
              setAiEngine('gemini');
              // Extract detected parameters
              const dp = data.detected_parameters || {};
              parsed = {};
              if (dp.category) {
                if (dp.category === 'brichete' && !isRomania) {
                  const warningText = getTranslation('bricheteRomaniaOnly');
                  setHistory(prev => [...prev, { sender: 'bot', text: warningText }]);
                  if (!isMuted) speakText(warningText);
                  setIsTyping(false);
                  return;
                }
                parsed.category = dp.category;
              }
              if (dp.subCategory) {
                const sub = dp.subCategory;
                if (sub.startsWith('dowel-')) {
                  parsed.subCategoryDowels = sub;
                  if (!parsed.category && category !== 'dowels') parsed.category = 'dowels';
                } else if (sub.startsWith('planed-')) {
                  parsed.subCategoryPlaned = sub;
                  if (!parsed.category && category !== 'planed') parsed.category = 'planed';
                } else if (sub.startsWith('profile-')) {
                  parsed.subCategoryProfiles = sub;
                  if (!parsed.category && category !== 'profiles') parsed.category = 'profiles';
                } else if (sub.startsWith('special-')) {
                  parsed.subCategorySpecials = sub;
                  if (!parsed.category && category !== 'specials') parsed.category = 'specials';
                }
              }
              if (dp.thickness !== null && dp.thickness !== undefined) parsed.thickness = dp.thickness;
              if (dp.diameter !== null && dp.diameter !== undefined) parsed.diameter = dp.diameter;
              if (dp.length !== null && dp.length !== undefined) parsed.length = dp.length;
              if (dp.grade) parsed.grade = dp.grade;
              if (dp.drying) parsed.drying = dp.drying;
              if (dp.steamed) parsed.steamed = dp.steamed;
              if (dp.fsc !== null && dp.fsc !== undefined) parsed.fsc = dp.fsc;
              if (dp.quantity !== null && dp.quantity !== undefined) parsed.quantity = dp.quantity;

              replyText = formatMarkdownToHtml(data.reply_text);
            }
          }
        } catch (apiErr) {
          console.error("Gemini API request failed, falling back to local NLP parser:", apiErr);
          useFallback = true;
          setAiEngine('fallback');
        }

        if (useFallback) {
          // 1. Run local NLP Parser
          parsed = parseFreeText(userText, category);
        }

        // Keep track of what we detected
        const detectedFields = [];
        const updatedFields = { ...filledFields };
        const updatedDimFlags = { ...dimensionFlags };

        // Apply updates to states
        if (parsed.category) {
          setCategory(parsed.category);
          updatedFields.category = true;
          detectedFields.push(`✓ ${getTranslation('productRow')}: **${categoryData[parsed.category].name[lang] || categoryData[parsed.category].name.nl}**`);
          
          if (parsed.category !== category) {
            updatedFields.dimensions = false;
            updatedFields.grade = false;
            updatedFields.drying = false;
            updatedFields.quantity = false;
            updatedDimFlags.thickness = false;
            updatedDimFlags.width = false;
            updatedDimFlags.length = false;
            setQuantity(parsed.category === 'brichete' ? 1 : 500);
          }
        }

        const activeCat = parsed.category || category;
        
        // Clamp values and apply
        const clamped = clampParsedValues(activeCat, parsed);

        if (clamped.subCategoryDowels) {
          setSubCategoryDowels(clamped.subCategoryDowels);
          detectedFields.push(`✓ Subcategorie: **${getSubcategoryName('dowels', clamped.subCategoryDowels)}**`);
        }
        if (clamped.subCategoryPlaned) {
          setSubCategoryPlaned(clamped.subCategoryPlaned);
          detectedFields.push(`✓ Subcategorie: **${getSubcategoryName('planed', clamped.subCategoryPlaned)}**`);
        }
        if (clamped.subCategoryProfiles) {
          setSubCategoryProfiles(clamped.subCategoryProfiles);
          detectedFields.push(`✓ Subcategorie: **${getSubcategoryName('profiles', clamped.subCategoryProfiles)}**`);
        }
        if (clamped.subCategorySpecials) {
          setSubCategorySpecials(clamped.subCategorySpecials);
          detectedFields.push(`✓ Subcategorie: **${getSubcategoryName('specials', clamped.subCategorySpecials)}**`);
        }

        if (clamped.thickness !== undefined) {
          setThickness(clamped.thickness);
          updatedDimFlags.thickness = true;
        }
        if (clamped.diameter !== undefined) {
          setDiameter(clamped.diameter);
          updatedDimFlags.width = true;
        }
        if (clamped.length !== undefined) {
          setLength(clamped.length);
          updatedDimFlags.length = true;
        }

        // Determine if dimensions are complete
        if (activeCat === 'brichete') {
          updatedFields.dimensions = true;
        } else if (activeCat === 'dowels') {
          updatedFields.dimensions = updatedDimFlags.width && updatedDimFlags.length;
        } else {
          updatedFields.dimensions = updatedDimFlags.thickness && updatedDimFlags.width && updatedDimFlags.length;
        }
        
        if (updatedFields.dimensions && (clamped.thickness !== undefined || clamped.diameter !== undefined || clamped.length !== undefined)) {
          const dimStr = activeCat === 'dowels' 
            ? `Ø ${clamped.diameter || diameter} x ${clamped.length || length} mm`
            : activeCat === 'brichete'
            ? `RUF Block format`
            : `${clamped.thickness || thickness} x ${clamped.diameter || diameter} x ${clamped.length || length} mm`;
          detectedFields.push(`✓ ${getTranslation('dimensionsRow')}: **${dimStr}**`);
        }

        if (clamped.grade) {
          setGrade(clamped.grade);
          updatedFields.grade = true;
          const gradeLabelStr = clamped.grade === 'A' ? getTranslation('gradeAValue') : (clamped.grade === 'B' ? getTranslation('gradeBValue') : getTranslation('gradeCValue'));
          detectedFields.push(`✓ ${getTranslation('gradeRow')}: **${gradeLabelStr}**`);
        }

        if (clamped.steamed) {
          setSteamed(clamped.steamed);
          updatedFields.steamed = true;
          detectedFields.push(`✓ ${getTranslation('steamedRow')}: **${getSteamedLabel(clamped.steamed)}**`);
        }

        if (clamped.drying) {
          setDrying(clamped.drying);
          updatedFields.drying = true;
          detectedFields.push(`✓ ${getTranslation('dryingRow')}: **${getDryingLabel(clamped.drying)}**`);
        }

        if (clamped.fsc !== undefined) {
          setFsc(clamped.fsc);
          updatedFields.fsc = true;
          detectedFields.push(`✓ ${getTranslation('certificationLabel')}: **${getFscLabel(clamped.fsc)}**`);
        }

        if (clamped.quantity !== undefined) {
          setQuantity(clamped.quantity);
          updatedFields.quantity = true;
          detectedFields.push(`✓ ${getTranslation('quantityRow')}: **${clamped.quantity} ${activeCat === 'brichete' ? (lang === 'nl' ? 'pallets' : 'pallets') : getTranslation('pieces')}**`);
        }

        // Save state changes
        setDimensionFlags(updatedDimFlags);
        setFilledFields(updatedFields);

        // If user typed "ja" or "yes" or similar, and everything was complete, add to cart
        // If user typed "ja", "yes", "ik ben klaar", "voeg toe" or similar, and essential fields are complete
        const isEssentialComplete = activeCat === 'brichete'
          ? (updatedFields.category && updatedFields.quantity)
          : (updatedFields.category && updatedFields.dimensions && updatedFields.quantity);
        const isAffirmative = /^(?:ja|yes|oui|da|ok|toevoegen|bestellen|offerte|in winkelwagen|add|submit|klaar|ready|finish)/i.test(cleanText) || cleanText.includes('voeg toe') || cleanText.includes('ben klaar') || cleanText.includes('ik ben klaar') || cleanText.includes('toevoegen');
        
        if (isEssentialComplete && isAffirmative) {
          // Auto-fill any remaining fields so they render in the specifications table
          const finalFields = { ...updatedFields };
          if (activeCat !== 'brichete') {
            finalFields.grade = true;
            finalFields.drying = true;
            finalFields.fsc = true;
            finalFields.steamed = true;
          }
          setFilledFields(finalFields);

          setTimeout(() => {
            handleAddToCart();
          }, 100);
          return;
        }

        // Only generate bot reply locally if fallback was used
        if (useFallback) {
          const isBriquettes = activeCat === 'brichete';
          replyText = '';
          if (detectedFields.length > 0) {
            replyText += `${getTranslation('understandConfirmation')}<br/>` + detectedFields.join('<br/>') + '<br/><br/>';
          }

          // Next missing field check
          if (!updatedFields.category) {
            replyText += getTranslation('askCategory');
          } else if (!updatedFields.dimensions) {
            replyText += getTranslation('askDimensions');
          } else if (!updatedFields.grade && !isBriquettes) {
            replyText += getTranslation('askGrade');
          } else if (!updatedFields.drying && !isBriquettes) {
            replyText += getTranslation('askDrying');
          } else if (!updatedFields.fsc && !isBriquettes) {
            replyText += getTranslation('askFsc');
          } else if (!updatedFields.quantity) {
            replyText += getTranslation('askQuantity');
          } else {
            replyText += getTranslation('everythingComplete');
          }
        }

        setHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
        if (!isMuted) speakText(replyText);
      } catch (err) {
        console.error("Willem AI error: ", err);
        setHistory(prev => [...prev, { 
          sender: 'bot', 
          text: lang === 'nl' ? 'Er is een fout opgetreden bij het verwerken. Probeer het opnieuw.' : 'An error occurred while processing. Please try again.' 
        }]);
      } finally {
        setIsTyping(false);
      }
    }, 800);
  };

  // Click handler for suggestion chips
  const handleChipClick = (suggestionText, parseText) => {
    setUserInput(suggestionText);
    setTimeout(() => {
      // Simulate input submission
      setUserInput('');
      setHistory(prev => [...prev, { sender: 'user', text: suggestionText }]);
      setIsTyping(true);
      
      setTimeout(async () => {
        try {
          const messageText = parseText || suggestionText;
          const cleanText = messageText.toLowerCase().trim();
          let parsed = null;
          let replyText = '';
          let useFallback = false;

          // Try LLM API route
          try {
            const res = await fetch('/api/configurator/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: messageText,
                category,
                filledFields,
                dimensionFlags,
                lang,
                isRomania
              })
            });

            if (!res.ok) {
              useFallback = true;
              setAiEngine('fallback');
            } else {
              const data = await res.json();
              if (data.fallback) {
                useFallback = true;
                setAiEngine('fallback');
              } else {
                setAiEngine('gemini');
                // Extract detected parameters
                const dp = data.detected_parameters || {};
                parsed = {};
                if (dp.category) parsed.category = dp.category;
                if (dp.subCategory) {
                  const sub = dp.subCategory;
                  if (sub.startsWith('dowel-')) {
                    parsed.subCategoryDowels = sub;
                    if (!parsed.category && category !== 'dowels') parsed.category = 'dowels';
                  } else if (sub.startsWith('planed-')) {
                    parsed.subCategoryPlaned = sub;
                    if (!parsed.category && category !== 'planed') parsed.category = 'planed';
                  } else if (sub.startsWith('profile-')) {
                    parsed.subCategoryProfiles = sub;
                    if (!parsed.category && category !== 'profiles') parsed.category = 'profiles';
                  } else if (sub.startsWith('special-')) {
                    parsed.subCategorySpecials = sub;
                    if (!parsed.category && category !== 'specials') parsed.category = 'specials';
                  }
                }
                if (dp.thickness !== null && dp.thickness !== undefined) parsed.thickness = dp.thickness;
                if (dp.diameter !== null && dp.diameter !== undefined) parsed.diameter = dp.diameter;
                if (dp.length !== null && dp.length !== undefined) parsed.length = dp.length;
                if (dp.grade) parsed.grade = dp.grade;
                if (dp.drying) parsed.drying = dp.drying;
                if (dp.steamed) parsed.steamed = dp.steamed;
                if (dp.fsc !== null && dp.fsc !== undefined) parsed.fsc = dp.fsc;
                if (dp.quantity !== null && dp.quantity !== undefined) parsed.quantity = dp.quantity;

                replyText = formatMarkdownToHtml(data.reply_text);
              }
            }
          } catch (apiErr) {
            console.error("Gemini API request failed, falling back to local NLP parser:", apiErr);
            useFallback = true;
            setAiEngine('fallback');
          }

          if (useFallback) {
            parsed = parseFreeText(messageText, category);
          }

          const activeCat = parsed.category || category;
          const clamped = clampParsedValues(activeCat, parsed);

          const detectedFields = [];
          const updatedFields = { ...filledFields };
          const updatedDimFlags = { ...dimensionFlags };

          if (parsed.category) {
            setCategory(parsed.category);
            updatedFields.category = true;
            detectedFields.push(`✓ ${getTranslation('productRow')}: **${categoryData[parsed.category].name[lang] || categoryData[parsed.category].name.nl}**`);
            
            if (parsed.category !== category) {
              updatedFields.dimensions = false;
              updatedFields.grade = false;
              updatedFields.drying = false;
              updatedFields.quantity = false;
              updatedDimFlags.thickness = false;
              updatedDimFlags.width = false;
              updatedDimFlags.length = false;
              setQuantity(parsed.category === 'brichete' ? 1 : 500);
            }
          }
          
          if (clamped.subCategoryDowels) setSubCategoryDowels(clamped.subCategoryDowels);
          if (clamped.subCategoryPlaned) setSubCategoryPlaned(clamped.subCategoryPlaned);
          if (clamped.subCategoryProfiles) setSubCategoryProfiles(clamped.subCategoryProfiles);
          if (clamped.subCategorySpecials) setSubCategorySpecials(clamped.subCategorySpecials);

          if (clamped.thickness !== undefined) {
            setThickness(clamped.thickness);
            updatedDimFlags.thickness = true;
          }
          if (clamped.diameter !== undefined) {
            setDiameter(clamped.diameter);
            updatedDimFlags.width = true;
          }
          if (clamped.length !== undefined) {
            setLength(clamped.length);
            updatedDimFlags.length = true;
          }

          // Determine if dimensions are complete
          if (activeCat === 'brichete') {
            updatedFields.dimensions = true;
          } else if (activeCat === 'dowels') {
            updatedFields.dimensions = updatedDimFlags.width && updatedDimFlags.length;
          } else {
            updatedFields.dimensions = updatedDimFlags.thickness && updatedDimFlags.width && updatedDimFlags.length;
          }

          if (updatedFields.dimensions && (clamped.thickness !== undefined || clamped.diameter !== undefined || clamped.length !== undefined)) {
            const dimStr = activeCat === 'dowels' 
              ? `Ø ${clamped.diameter || diameter} x ${clamped.length || length} mm`
              : activeCat === 'brichete'
              ? `RUF Block format`
              : `${clamped.thickness || thickness} x ${clamped.diameter || diameter} x ${clamped.length || length} mm`;
            detectedFields.push(`✓ ${getTranslation('dimensionsRow')}: **${dimStr}**`);
          }

          if (clamped.grade) {
            setGrade(clamped.grade);
            updatedFields.grade = true;
            const gradeLabelStr = clamped.grade === 'A' ? getTranslation('gradeAValue') : (clamped.grade === 'B' ? getTranslation('gradeBValue') : getTranslation('gradeCValue'));
            detectedFields.push(`✓ ${getTranslation('gradeRow')}: **${gradeLabelStr}**`);
          }

          if (clamped.drying) {
            setDrying(clamped.drying);
            updatedFields.drying = true;
            detectedFields.push(`✓ ${getTranslation('dryingRow')}: **${getDryingLabel(clamped.drying)}**`);
          }

          if (clamped.steamed) {
            setSteamed(clamped.steamed);
            updatedFields.steamed = true;
            detectedFields.push(`✓ ${getTranslation('steamedRow')}: **${getSteamedLabel(clamped.steamed)}**`);
          }

          if (clamped.fsc !== undefined) {
            setFsc(clamped.fsc);
            updatedFields.fsc = true;
            detectedFields.push(`✓ ${getTranslation('certificationLabel')}: **${getFscLabel(clamped.fsc)}**`);
          }

          if (clamped.quantity !== undefined) {
            setQuantity(clamped.quantity);
            updatedFields.quantity = true;
            detectedFields.push(`✓ ${getTranslation('quantityRow')}: **${clamped.quantity} ${activeCat === 'brichete' ? (lang === 'nl' ? 'pallets' : 'pallets') : getTranslation('pieces')}**`);
          }

          setDimensionFlags(updatedDimFlags);
          setFilledFields(updatedFields);

          if (useFallback) {
            const isBriquettes = activeCat === 'brichete';
            replyText = '';
            if (detectedFields.length > 0) {
              replyText += `${getTranslation('understandConfirmation')}<br/>` + detectedFields.join('<br/>') + '<br/><br/>';
            }

            if (!updatedFields.category) replyText += getTranslation('askCategory');
            else if (!updatedFields.dimensions) replyText += getTranslation('askDimensions');
            else if (!updatedFields.grade && !isBriquettes) replyText += getTranslation('askGrade');
            else if (!updatedFields.drying && !isBriquettes) replyText += getTranslation('askDrying');
            else if (!updatedFields.fsc && !isBriquettes) replyText += getTranslation('askFsc');
            else if (!updatedFields.quantity) replyText += getTranslation('askQuantity');
            else replyText += getTranslation('everythingComplete');
          }

          setHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
          if (!isMuted) speakText(replyText);
        } catch (err) {
          console.error("Willem AI error (chip click): ", err);
          setHistory(prev => [...prev, { 
            sender: 'bot', 
            text: lang === 'nl' ? 'Er is een fout opgetreden bij het verwerken. Probeer het opnieuw.' : 'An error occurred while processing. Please try again.' 
          }]);
        } finally {
          setIsTyping(false);
        }
      }, 500);
    }, 10);
  };

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
        'planed-rect-v1': 'Planed Rectangular (Variant 1)',
        'planed-rect-v2': 'Planed Rectangular (Variant 2)',
        'planed-rect-v3': 'Planed Rectangular (Variant 3)',
        'planed-rect-v4': 'Planed Rectangular (Variant 4)',
        'planed-sq-v1': 'Planed Square (Variant 1)',
        'planed-sq-v2': 'Planed Square (Variant 2)',
        'planed-rad3': 'Planed Elements with Radius 3',
        'planed-rad6': 'Planed Elements with Radius 6',
      };
      subcatName = names[specificSubcat || subCategoryPlaned] || 'Planed Rectangular (Variant 1)';
    }

    if (cat === 'sawn') {
      const volumeDm3 = (numericLen * numericDiam * numericThick) / 1000000.0;
      unitPrice = 1.25 * volumeDm3; // Gezaagd is €1250/m3 base price
      if (unitPrice < 0.20) unitPrice = 0.20;
    } else if (cat === 'planed') {
      const volumeDm3 = (numericLen * numericDiam * numericThick) / 1000000.0;
      unitPrice = 1.65 * volumeDm3; // S4S is €1650/m3 base price
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
      unitPrice = 320.00; // Wholesale target price per pallet
    }

    // Apply grade factor
    let gradeFactor = 1.0;
    if (cat !== 'brichete') {
      if (itemGrade === 'B') gradeFactor = 0.9;
      else if (itemGrade === 'C') gradeFactor = 0.7;
    }

    // Apply drying factor
    const dryingFactor = (cat !== 'brichete' && itemDrying === 'luchtdroog') ? 0.95 : 1.0;

    // Apply custom length overhead factor
    const lenTypeFactor = (cat !== 'brichete' && lenType === 'custom') ? 1.15 : 1.0;

    unitPrice = unitPrice * gradeFactor * dryingFactor * lenTypeFactor;

    let discountPercent = 0;
    if (cat === 'brichete') {
      if (qtyVal >= 24) {
        discountPercent = 10;
      } else if (qtyVal >= 12) {
        discountPercent = 5;
      }
    } else {
      if (qtyVal >= 100000) {
        discountPercent = 15;
      } else if (qtyVal >= 50000) {
        discountPercent = 10;
      } else if (qtyVal >= 10000) {
        discountPercent = 5;
      }
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

  // Add configured product to shopping cart
  const handleAddToCart = () => {
    // Auto-fill any remaining fields so they render in the specifications table
    const finalFields = { ...filledFields };
    finalFields.category = true;
    finalFields.dimensions = true;
    finalFields.quantity = true;
    if (category !== 'brichete') {
      finalFields.grade = true;
      finalFields.drying = true;
      finalFields.fsc = true;
      finalFields.steamed = true;
    }
    setFilledFields(finalFields);

    const currentSubcat = getActiveSubCategoryCode(category);
    const details = calculatePriceDetails(category, length, diameter, thickness, quantity, currentSubcat, grade, lengthType, drying);
    const calculatedBase = calculatePriceDetails(category, length, diameter, thickness, 1, currentSubcat, grade, lengthType, drying);

    // Let's get the display name in the format "Category - Subcategory" (or just Category if no subcategory)
    const displayName = categoryData[category].name[lang] || categoryData[category].name.nl;
    let displayProductName = displayName;
    const subName = getSubcategoryName(category, currentSubcat);
    if (subName) {
      displayProductName = `${displayName} - ${subName}`;
    }

    // Generate readable description
    let formatDims = '';
    const lengthStr = typeof length === 'string' ? `${length} mm` : `${length} mm`;
    const widthStr = category === 'dowels' ? 'n.v.t.' : `${diameter} mm`;
    const thickStr = `${thickness} mm`;

    if (category === 'sawn' || category === 'planed' || category === 'profiles' || category === 'specials') {
      formatDims = `${thickStr} x ${widthStr} x ${lengthStr}`;
    } else if (category === 'dowels') {
      formatDims = `Ø ${diameter} mm x ${lengthStr}`;
    } else if (category === 'brichete') {
      formatDims = lang === 'ro' ? 'Palet (960 kg greutate netă)' : (lang === 'nl' ? 'Pallet (960 kg netto gewicht)' : (lang === 'de' ? 'Palette (960 kg Nettogewicht)' : 'Pallet (960 kg net weight)'));
    }

    const uniqueId = `${category}-${currentSubcat}-${thickness}-${diameter}-${length}-${grade}-${drying}-${steamed}-${fsc}-${Date.now()}`;
    
    const cartItem = {
      id: uniqueId,
      isConfigured: true,
      categoryKey: category,
      category: displayName,
      name: displayProductName,
      thickness: thickness,
      thicknessType: thicknessType,
      diameter: diameter, // width
      widthType: widthType,
      length: length,
      lengthType: lengthType,
      woodType: woodType,
      grade: grade,
      drying: drying,
      steamed: steamed,
      fsc: fsc,
      additionalInfo: additionalInfo,
      qty: quantity,
      dims: formatDims,
      price: details.totalPrice,
      baseUnitPrice: calculatedBase.unitPrice,
      discountPercent: details.discountPercent,
      finish: categoryData[category].finish[lang] || categoryData[category].finish.nl,
      subCategory: currentSubcat,
    };

    addToCart(cartItem);

    if (!isMuted) {
      speakText(`${getTranslation('addedToCart')}. ${displayName}.`);
    }

    setNotification(getTranslation('addedToCart'));
    setTimeout(() => {
      setNotification(null);
    }, 4000);

    // Set added state, keeping the configuration states intact
    setIsAddedToCart(true);

    // Append history with a welcoming success message
    setHistory(prev => [
      ...prev,
      {
        sender: 'bot',
        text: `🎉 **${getTranslation('addedToCart')}**<br/><br/>
               **${getTranslation('productRow')}**: ${displayName} ${currentSubcat ? `(${getSubcategoryName(category, currentSubcat)})` : ''}<br/>
               **${getTranslation('dimensionsRow')}**: ${formatDims}<br/>
               **${getTranslation('quantityRow')}**: ${quantity} ${category === 'brichete' ? 'pallets' : getTranslation('pieces')}<br/><br/>
               ${lang === 'nl' 
                 ? 'U kunt nu direct nog een product configureren. Typ of spreek hieronder uw vraag of wensen in.' 
                 : (lang === 'ro'
                   ? 'Acum puteți configura un alt produs. Rostiți sau introduceți specificațiile mai jos pentru a începe.'
                   : (lang === 'de'
                     ? 'Sie können nun direkt ein weiteres Produkt konfigurieren. Geben Sie hier Ihre Wünsche ein oder sprechen Sie sie ein.'
                     : 'You can now configure another product. Type or speak your wishes below to start.'))}`,
        isAddedSuccess: true
      }
    ]);
  };

  // Visualizer Math variables
  const isBriquettes = category === 'brichete';
  const startX = 40;
  const startY = 80;
  const svgW = 320;
  const svgH = 160;

  // Compute 3D axonometric projection polygon coordinates based on dimensions
  const lScale = Math.max(50, Math.min(180, (length / 3000) * 180 + 40));
  const wScale = Math.max(15, Math.min(65, (diameter / 500) * 65 + 15));
  const tScale = Math.max(8, Math.min(50, (thickness / 200) * 50 + 8));

  // Cylinder/Dowel Math
  const dRadiusX = Math.max(8, Math.min(30, (diameter / 60) * 30 + 8));
  const dRadiusY = dRadiusX * 0.4;

  const xOffset = wScale * 0.7;
  const yOffset = wScale * 0.4;

  const p0 = `${startX},${startY}`; // front bottom left
  const p1 = `${startX + lScale},${startY}`; // front bottom right
  const p2 = `${startX + lScale},${startY - tScale}`; // front top right
  const p3 = `${startX},${startY - tScale}`; // front top left

  const p4 = `${startX + lScale + xOffset},${startY - tScale - yOffset}`; // back top right
  const p5 = `${startX + xOffset},${startY - tScale - yOffset}`; // back top left
  const p6 = `${startX + xOffset},${startY - yOffset}`; // back bottom left

  // Theme variables
  const woodColorMain = '#d6a374';
  const woodColorFront = '#e5b88f';
  const woodColorEnd = '#b48154';

  const isConfigComplete = isConfigCompleteFor(category, filledFields);
  const isEssentialComplete = category === 'brichete'
    ? (filledFields.category && filledFields.quantity)
    : (filledFields.category && filledFields.dimensions && filledFields.quantity);
  const hasAnyDetected = filledFields.category || filledFields.dimensions || filledFields.grade || filledFields.drying || filledFields.fsc || filledFields.quantity || filledFields.steamed;

  if (isLoading) {
    return (
      <div style={{ padding: '15rem 0', textAlign: 'center', background: '#f8fafc', color: '#1e293b' }}>
        <h3>{getTranslation('loading')}</h3>
      </div>
    );
  }

  if (!isV4Authenticated) {
    return (
      <>
        {/* Style injection to hide Header, Footer and Widget when auth is locked */}
        <style>{`
          .main-header, .main-footer, .floating-contact-widget { display: none !important; }
        `}</style>

        <div className="auth-gate-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
          <div className="auth-gate-card">
            <div className="auth-lock-icon">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2>{getTranslation('v4PortalTitle')}</h2>
            <p>
              {getTranslation('v4PortalLead')}
            </p>
            <form onSubmit={handleV4PasswordSubmit}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <label
                  htmlFor="authPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: 'var(--color-text-dark)',
                  }}
                >
                  {getTranslation('v4PasswordLabel')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showV4Password ? 'text' : 'password'}
                    id="authPassword"
                    required
                    placeholder="••••••••"
                    value={v4Password}
                    onChange={(e) => setV4Password(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowV4Password(!showV4Password)}
                    aria-label={getTranslation('v4ShowPasswordAria')}
                  >
                    <i className={showV4Password ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>
                {v4AuthError && (
                  <div className="error-message">
                    <i className="fa-solid fa-triangle-exclamation"></i> {getTranslation('v4PasswordError')}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%' }}>
                {getTranslation('v4UnlockButton')} <i className="fa-solid fa-key icon-right"></i>
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .chat-layout-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
          margin-top: 1.5rem;
          align-items: start;
        }
        .chatbot-card {
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
        .chat-header-info h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          display: flex;
          align-items: center;
        }
        .badge-ai-status {
          font-size: 0.65rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          margin-left: 0.5rem;
          line-height: 1;
        }
        .badge-ai-status.gemini {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .badge-ai-status.fallback {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .badge-ai-status.checking {
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .chat-header-info span {
          font-size: 0.75rem;
          color: #a0aec0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .btn-lock {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 0.4rem 0.8rem;
          border-radius: var(--border-radius-md);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-lock:hover {
          background: #ffffff;
          color: #111111;
          border-color: #ffffff;
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
          max-width: 85%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .bubble-bot {
          align-self: flex-start;
          background: #ffffff;
          color: var(--color-text-dark);
          border: 1px solid var(--color-border);
          border-top-left-radius: 0;
        }
        .bubble-user {
          align-self: flex-end;
          background: var(--color-primary);
          color: #ffffff;
          border-top-right-radius: 0;
          font-weight: 600;
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
        
        .chat-footer {
          padding: 1.25rem 1.5rem;
          background: #ffffff;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .chat-input-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .chat-input-form textarea {
          width: 100%;
          height: auto;
          min-height: 72px; /* ~3 lines */
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          font-size: 0.95rem;
          transition: border-color 0.2s;
          resize: none;
          font-family: inherit;
          line-height: 1.4;
        }
        .chat-input-form textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .chat-buttons-row {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          align-items: center;
        }
        .btn-mic {
          background: #ffffff;
          border: 2px solid var(--color-border);
          color: var(--color-text-dark);
          padding: 0 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 600;
          height: 48px;
          gap: 0.5rem;
          box-sizing: border-box;
        }
        .btn-mic:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: var(--color-text-dark);
          color: var(--color-text-dark);
        }
        .btn-mic.listening {
          background: #fee2e2;
          border-color: #ef4444;
          color: #ef4444;
          animation: pulse-red 1.5s infinite;
        }
        .btn-mic:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #cbd5e1;
        }
        .speech-listening-hint {
          font-size: 0.8rem;
          color: #ef4444;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: -0.25rem;
          margin-left: 0.25rem;
          animation: pulse-opacity 1.5s infinite alternate;
        }
        @keyframes pulse-red {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        @keyframes pulse-opacity {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        .chat-chips-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .chat-chip {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 50px;
          padding: 0.35rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .chat-chip:hover {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        /* Sidebar Preview */
        .preview-sidebar-card {
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 1.25rem 1.25rem 0.75rem;
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 171px;
          height: 680px;
          display: flex;
          flex-direction: column;
        }
        .visualizer-preview-box {
          background: #f8fafc;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          position: relative;
          min-height: 100px;
        }
        .visualizer-badge-v4 {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background: rgba(30, 58, 43, 0.08);
          color: var(--color-primary-dark);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 50px;
        }
        .sidebar-specs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.25rem;
        }
        .sidebar-specs-table th, .sidebar-specs-table td {
          padding: 0.25rem 0.5rem;
          font-size: 0.85rem;
          border-bottom: 1px solid #edf2f7;
        }
        .specs-scroll-container {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 0.5rem;
        }
        .specs-scroll-container::-webkit-scrollbar {
          width: 4px;
        }
        .specs-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .specs-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 991px) {
          .chat-layout-grid {
            grid-template-columns: 1fr;
          }
          .preview-sidebar-card {
            position: relative;
            top: 0;
            margin-top: 1.5rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="product-detail-hero" style={{ padding: '8.5rem 0 3.5rem' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <Link href="/configurator">{getTranslation('heroBreadcrumb')}</Link> / <span>Willem AI</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('heroTitle')}</h1>
          <p>{getTranslation('heroSubtitle')}</p>
        </div>
      </section>

      {/* Main Layout Grid */}
      <section className="chatbot-section section-padding" style={{ background: '#f8fafc', paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {notification && (
            <div className="notification-toast success">
              <i className="fa-solid fa-circle-check icon-left"></i> {notification}
            </div>
          )}

          <div className="chat-layout-grid">
            
            {/* Left: Chat Window */}
            <div className="chatbot-card">
              <div className="chat-header">
                <div className="chat-avatar-wrapper">
                  <div className="chat-avatar">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <div className="chat-header-info">
                    <h3 style={{ display: 'flex', alignItems: 'center' }}>
                      Willem (AI)
                      {aiEngine === 'gemini' && (
                        <span className="badge-ai-status gemini" title="Connected to Google Gemini AI Engine">
                          {getTranslation('aiGemini')}
                        </span>
                      )}
                      {aiEngine === 'fallback' && (
                        <span className="badge-ai-status fallback" title="Connected to local Rule-Based NLP Parser">
                          {getTranslation('aiFallback')}
                        </span>
                      )}
                      {aiEngine === 'checking' && (
                        <span className="badge-ai-status checking" title="Checking model status...">
                          {getTranslation('aiChecking')}
                        </span>
                      )}
                    </h3>
                    <span><i className="fa-solid fa-circle" style={{ color: '#22c55e', fontSize: '0.55rem' }}></i> Online / Virtual Advisor</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={toggleMute} className="btn-lock" title={isMuted ? 'Geluid aanzetten' : 'Geluid dempen'}>
                    <i className={isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high"}></i>
                  </button>
                  <button onClick={handleStartOver} className="btn-lock">
                    <i className="fa-solid fa-rotate-left"></i> {getTranslation('resetText')}
                  </button>
                </div>
              </div>

              {/* Chat History */}
              <div className="chat-history" ref={chatHistoryRef}>
                {history.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-bubble ${msg.sender === 'bot' ? 'bubble-bot' : 'bubble-user'}`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />

                    {msg.isAddedSuccess && (
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setIsCartOpen(true)}
                          className="btn btn-primary"
                          style={{
                            fontSize: '0.85rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--color-primary)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 'var(--border-radius-sm)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fa-solid fa-cart-shopping icon-left"></i> {getTranslation('viewCart')}
                        </button>
                        <button
                          onClick={handleStartOver}
                          className="btn btn-secondary"
                          style={{
                            fontSize: '0.85rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ffffff',
                            color: 'var(--color-text-dark)',
                            border: '2px solid var(--color-text-dark)',
                            borderRadius: 'var(--border-radius-sm)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fa-solid fa-rotate-left icon-left"></i> {getTranslation('configureAnother')}
                        </button>
                      </div>
                    )}

                    {msg.sender === 'bot' && index === history.length - 1 && isEssentialComplete && !msg.isAddedSuccess && (
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={handleAddToCart}
                          className="btn btn-primary"
                          style={{
                            fontSize: '0.85rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--color-primary)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 'var(--border-radius-sm)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <i className="fa-solid fa-cart-plus"></i> {getTranslation('addToInquiry') || 'Toevoegen aan Offerteaanvraag'}
                        </button>
                        <button
                          onClick={() => handleInputSuggestion('Ik wil nog wat veranderen')}
                          className="btn btn-secondary"
                          style={{
                            fontSize: '0.85rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ffffff',
                            color: 'var(--color-text-dark)',
                            border: '2px solid var(--color-text-dark)',
                            borderRadius: 'var(--border-radius-sm)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i> {lang === 'nl' ? 'Ik wil nog wat veranderen' : (lang === 'ro' ? 'Vreau să modific ceva' : (lang === 'de' ? 'Ich möchte etwas ändern' : 'I want to change something'))}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-bubble bubble-bot">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Footer with open chat input */}
              <div className="chat-footer">

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                    <textarea
                      placeholder={isListening ? '' : getTranslation('placeholderInput')}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                      rows={3}
                      style={{
                        width: '100%',
                        paddingRight: isListening ? '100px' : '12px'
                      }}
                    />
                    {isListening && (
                      <div className="audio-wave-overlay" style={{
                        position: 'absolute',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        pointerEvents: 'none'
                      }}>
                        <style>{`
                          @keyframes bounceWave {
                            0% { transform: scaleY(0.4); }
                            100% { transform: scaleY(1.4); }
                          }
                        `}</style>
                        <div className="audio-wave-bar" style={{ width: '3px', height: '10px', backgroundColor: 'var(--color-primary-dark)', borderRadius: '1.5px', animation: 'bounceWave 0.6s ease-in-out infinite alternate', transformOrigin: 'center' }}></div>
                        <div className="audio-wave-bar" style={{ width: '3px', height: '18px', backgroundColor: 'var(--color-primary-dark)', borderRadius: '1.5px', animation: 'bounceWave 0.6s ease-in-out infinite alternate 0.15s', transformOrigin: 'center' }}></div>
                        <div className="audio-wave-bar" style={{ width: '3px', height: '8px', backgroundColor: 'var(--color-primary-dark)', borderRadius: '1.5px', animation: 'bounceWave 0.6s ease-in-out infinite alternate 0.3s', transformOrigin: 'center' }}></div>
                        <div className="audio-wave-bar" style={{ width: '3px', height: '14px', backgroundColor: 'var(--color-primary-dark)', borderRadius: '1.5px', animation: 'bounceWave 0.6s ease-in-out infinite alternate 0.45s', transformOrigin: 'center' }}></div>
                        <div className="audio-wave-bar" style={{ width: '3px', height: '6px', backgroundColor: 'var(--color-primary-dark)', borderRadius: '1.5px', animation: 'bounceWave 0.6s ease-in-out infinite alternate 0.1s', transformOrigin: 'center' }}></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="chat-buttons-row">
                    <button
                      type="button"
                      className={`btn-mic ${isListening ? 'listening' : ''}`}
                      onClick={toggleListening}
                      disabled={isTyping}
                      title={getTranslation('micTooltip')}
                    >
                      {isListening ? (
                        <>
                          <i className="fa-solid fa-microphone-lines icon-left"></i>
                          <span>{lang === 'nl' ? 'Luisteren...' : (lang === 'ro' ? 'Se ascultă...' : (lang === 'de' ? 'Zuhören...' : 'Listening...'))}</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-microphone icon-left"></i>
                          <span>{lang === 'nl' ? 'Inspreken' : (lang === 'ro' ? 'Rostiți' : (lang === 'de' ? 'Sprechen' : 'Speak'))}</span>
                        </>
                      )}
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isTyping || !userInput.trim()} style={{ height: '48px', padding: '0 1.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getTranslation('btnSend')} <i className="fa-solid fa-paper-plane icon-right"></i>
                    </button>
                  </div>
                </form>
                {isListening && (
                  <div className="speech-listening-hint">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', marginRight: '4px' }}></span>
                    {getTranslation('micListening')}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Preview Panel */}
            <div className="preview-sidebar-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.35rem' }}>
                {getTranslation('activeSelectionTitle')}
              </h3>



              {/* Summary Table */}
              <div className="specs-scroll-container">
                {!hasAnyDetected ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem 1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--border-radius-md)', background: '#f8fafc', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <i className="fa-solid fa-list-check" style={{ fontSize: '2.4rem', color: '#ffd875' }}></i>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{getTranslation('noSpecsDetected')}</p>
                  </div>
                ) : (
                  <table className="sidebar-specs-table" style={{ animation: 'slideUp 0.3s ease-out' }}>
                    <tbody>
                      {/* 1. Product */}
                      <tr>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('productRow')}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{categoryData[category].name[lang] || categoryData[category].name.nl}</td>
                      </tr>
                      
                      {/* 2. Subcategory */}
                      {category !== 'brichete' && getActiveSubCategoryCode(category) && (
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Subcategorie</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{getSubcategoryName(category, getActiveSubCategoryCode(category))}</td>
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

                      {/* 4. Grade */}
                      {category !== 'brichete' && (
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('gradeRow')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{grade === 'A' ? getTranslation('gradeAValue') : (grade === 'B' ? getTranslation('gradeBValue') : getTranslation('gradeCValue'))}</td>
                        </tr>
                      )}

                      {/* 5. Dimensions */}
                      <tr>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('dimensionsRow')}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                          {category === 'dowels' 
                            ? `Ø ${diameter} x ${length} mm`
                            : category === 'brichete'
                            ? 'RUF Block'
                            : `${thickness} x ${diameter} x ${length} mm`}
                        </td>
                      </tr>

                      {/* 6. Quantity */}
                      <tr>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('quantityRow')}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                          {`${quantity} ${category === 'brichete' ? 'pallets' : getTranslation('pieces')}`}
                        </td>
                      </tr>

                      {/* 7. Finish */}
                      <tr>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('finishRow')}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{categoryData[category].finish[lang] || categoryData[category].finish.nl}</td>
                      </tr>

                      {/* 8. Drying */}
                      {category !== 'brichete' && (
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('dryingRow')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{getDryingLabel(drying)}</td>
                        </tr>
                      )}

                      {/* 9. Steamed */}
                      {category !== 'brichete' && (
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('steamedRow')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{getSteamedLabel(steamed)}</td>
                        </tr>
                      )}

                      {/* 10. FSC */}
                      {category !== 'brichete' && (
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('certificationLabel')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{getFscLabel(fsc)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Add to Cart button in sidebar once essentials are filled */}
              {isEssentialComplete && (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddedToCart}
                  className="btn btn-primary btn-block"
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    opacity: isAddedToCart ? 0.6 : 1,
                    cursor: isAddedToCart ? 'not-allowed' : 'pointer',
                    pointerEvents: isAddedToCart ? 'none' : 'auto'
                  }}
                >
                  <i className="fa-solid fa-cart-plus icon-left"></i> {isAddedToCart ? (getTranslation('addedToQuote') || 'Toegevoegd aan offerte') : getTranslation('addToInquiry')}
                </button>
              )}
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem', color: '#9ca3af', fontSize: '0.8rem', opacity: 0.8 }}>
            Configurator v4.0.0 (Willem AI)
          </div>

        </div>
      </section>
    </>
  );
}
