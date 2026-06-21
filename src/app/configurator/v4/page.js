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
    nl: 'Typ hier uw wensen (bijv. "1000 blanks van 25x75x1200mm, Klasse A, KD")...',
    en: 'Type your requirements (e.g., "1000 blanks of 25x75x1200mm, Class A, KD")...',
    de: 'Schreiben Sie Ihre Wünsche (z.B. "1000 Blanks, 25x75x1200mm, Klasse A, KD")...',
    ro: 'Scrieți cerințele dvs. (de ex. "1000 piese brute, 25x75x1200mm, clasa A, KD")...'
  },
  btnSend: { nl: 'Verzend', en: 'Send', de: 'Senden', ro: 'Trimite' },
  resetText: { nl: 'Opnieuw beginnen', en: 'Start Over', de: 'Neustart', ro: 'Reîncepe' },
  backText: { nl: 'Vorige', en: 'Back', de: 'Zurück', ro: 'Înapoi' },
  addToInquiry: { nl: 'Toevoegen aan Offerteaanvraag', en: 'Add to Quote Request', de: 'Zur Angebotsanfrage hinzufügen', ro: 'Adaugă la solicitarea de ofertă' },
  addedToCart: { nl: 'Toegevoegd aan winkelwagen!', en: 'Added to cart!', de: 'In den Warenkorb gelegt!', ro: 'Adăugat în coș!' },
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
    nl: 'Hallo! Ik ben **Willem**, uw virtuele B2B salesadviseur. Typ hieronder in uw eigen woorden wat u zoekt. <br/>Bijvoorbeeld: *"Ik ben op zoek naar 1500 beukenhouten blanks met afmetingen van 25x75x1200 mm in klasse A, kamerdroog."* of geef uw wensen stap voor stap door.',
    en: 'Hello! I am **Willem**, your virtual B2B sales advisor. Tell me in your own words what you are looking for. <br/>For example: *"I am looking for 1500 beechwood blanks with dimensions of 25x75x1200 mm in class A, kiln dried."* or describe your requirements step by step.',
    de: 'Hallo! Ich bin **Willem**, Ihr virtueller B2B-Verkaufsberater. Schreiben Sie mir in eigenen Worten, was Sie suchen. <br/>Zum Beispiel: *"Ich suche 1500 Buchenholz-Blanks mit den Maßen 25x75x1200 mm in Klasse A, kammergetrocknet."* oder teilen Sie mir Ihre Wünsche Schritt für Schritt mit.',
    ro: 'Bună! Sunt **Willem**, consilierul dvs. virtual de vânzări B2B. Scrieți-mi în propriile cuvinte ceea ce căutați. <br/>De exemplu: *"Caut 1500 piese brute din fag cu dimensiunile de 25x75x1200 mm, clasa A, uscate în cameră."* sau descrieți specificațiile dorite pas cu pas.'
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
  }
};

export default function OpenChatConfigurator() {
  const { lang, addToCart, setIsCartOpen, shouldResetConfigurator, setShouldResetConfigurator, isRomania } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    quantity: false
  });

  const [dimensionFlags, setDimensionFlags] = useState({
    thickness: false,
    width: false,
    length: false
  });

  const chatHistoryRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;

        const langMap = {
          nl: 'nl-NL',
          en: 'en-US',
          de: 'de-DE',
          ro: 'ro-RO'
        };
        rec.lang = langMap[lang] || 'nl-NL';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        rec.onresult = (event) => {
          const result = event.results[event.results.length - 1];
          if (result.isFinal) {
            const transcriptText = result[0].transcript;
            setUserInput(prev => {
              const base = prev.trim();
              return base ? `${base} ${transcriptText.trim()}` : transcriptText.trim();
            });
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, [lang]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
        setIsLoading(false);
      }
    }
  }, []);

  // Initialize chat history with welcome message
  useEffect(() => {
    if (isAuthenticated) {
      setHistory([
        { sender: 'bot', text: getTranslation('welcomeMessage') }
      ]);
    }
  }, [isAuthenticated, lang]);

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
      quantity: false
    });
    setDimensionFlags({
      thickness: false,
      width: false,
      length: false
    });
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
    // Standard format: TxWxL (e.g. 20x50x1200 or 20 * 50 * 1200)
    const threeDimensionsMatch = cleanText.match(/\b(\d+)\s*(?:mm)?\s*[xX*]\s*(\d+)\s*(?:mm)?\s*[xX*]\s*(\d+)\b/);
    if (threeDimensionsMatch && targetCat !== 'dowels' && targetCat !== 'brichete') {
      updates.thickness = parseInt(threeDimensionsMatch[1]);
      updates.diameter = parseInt(threeDimensionsMatch[2]); // width is stored in diameter
      updates.length = parseInt(threeDimensionsMatch[3]);
      updates.thicknessType = 'custom';
      updates.widthType = 'custom';
      updates.lengthType = 'custom';
    } else {
      // Two dimensions format for dowels: DxL (e.g. 15x1200 or 15 * 1200)
      const twoDimensionsMatch = cleanText.match(/\b(\d+)\s*(?:mm)?\s*[xX*]\s*(\d+)\b/);
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

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    setHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setUserInput('');

    // Start bot typing animation
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const cleanText = userText.toLowerCase().trim();
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
              lang
            })
          });

          if (!res.ok) {
            useFallback = true;
          } else {
            const data = await res.json();
            if (data.fallback) {
              useFallback = true;
            } else {
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
        const wasCompleteBeforeMsg = Object.values(filledFields).every(val => val === true || (category === 'brichete' && ['category', 'quantity'].every(k => filledFields[k])));
        const isAffirmative = /^(?:ja|yes|oui|da|ok|toevoegen|bestellen|offerte|in winkelwagen|add|submit)/i.test(cleanText);
        
        if (wasCompleteBeforeMsg && isAffirmative) {
          handleAddToCart();
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
          } else if (!updatedFields.quantity) {
            replyText += getTranslation('askQuantity');
          } else {
            replyText += getTranslation('everythingComplete');
          }
        }

        setHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
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
                lang
              })
            });

            if (!res.ok) {
              useFallback = true;
            } else {
              const data = await res.json();
              if (data.fallback) {
                useFallback = true;
              } else {
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
            else if (!updatedFields.quantity) replyText += getTranslation('askQuantity');
            else replyText += getTranslation('everythingComplete');
          }

          setHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
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

  // Add configured product to shopping cart
  const handleAddToCart = () => {
    const currentSubcat = getActiveSubCategoryCode(category);
    
    // Generate readable description
    let formatDims = '';
    if (category === 'dowels') {
      formatDims = `Ø ${diameter} x ${length} mm`;
    } else if (category === 'brichete') {
      formatDims = lang === 'nl' ? 'Pallet (960 kg netto gewicht)' : (lang === 'ro' ? 'Palet (960 kg greutate netă)' : (lang === 'de' ? 'Palette (960 kg Nettogewicht)' : 'Pallet (960 kg net weight)'));
    } else {
      formatDims = `${thickness} x ${diameter} x ${length} mm`;
    }

    const uniqueId = `${category}-${currentSubcat}-${thickness}-${diameter}-${length}-${grade}-${drying}-${steamed}-${fsc}-${Date.now()}`;
    const displayName = categoryData[category].name[lang] || categoryData[category].name.nl;
    
    const cartItem = {
      id: uniqueId,
      category: category,
      subCategory: currentSubcat,
      name: displayName,
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
      price: category === 'brichete' ? 320.00 : 1.25, // pricing mockup
    };

    addToCart(cartItem);

    setHistory(prev => [...prev, {
      sender: 'bot',
      text: `🎉 **${getTranslation('addedToCart')}**<br/><br/>
             **${getTranslation('productRow')}**: ${displayName} ${currentSubcat ? `(${getSubcategoryName(category, currentSubcat)})` : ''}<br/>
             **${getTranslation('dimensionsRow')}**: ${formatDims}<br/>
             **${getTranslation('quantityRow')}**: ${quantity} ${category === 'brichete' ? 'pallets' : getTranslation('pieces')}<br/><br/>
             *${getTranslation('configureAnother')} of klik op de knop om uw offerte aan te vragen.*`,
      isAddedSuccess: true
    }]);

    setNotification(getTranslation('addedToCart'));
    setTimeout(() => {
      setNotification(null);
    }, 4000);
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

  const isConfigComplete = Object.values(filledFields).every(val => val === true || (category === 'brichete' && ['category', 'quantity'].every(k => filledFields[k])));

  if (isLoading) {
    return (
      <div style={{ padding: '15rem 0', textAlign: 'center', background: '#f8fafc', color: '#1e293b' }}>
        <h3>{getTranslation('loading')}</h3>
      </div>
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
        .chat-input-row {
          display: flex;
          gap: 0.75rem;
        }
        .chat-input-row input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .chat-input-row input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .btn-mic {
          background: #f1f5f9;
          border: 1px solid var(--color-border);
          color: #475569;
          padding: 0.75rem;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          width: 46px;
          height: 46px;
        }
        .btn-mic:hover:not(:disabled) {
          background: #e2e8f0;
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
          padding: 2rem;
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 171px;
        }
        .visualizer-preview-box {
          background: #f8fafc;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          position: relative;
          min-height: 180px;
        }
        .visualizer-badge-v4 {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(30, 58, 43, 0.08);
          color: var(--color-primary-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 50px;
        }
        .sidebar-specs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .sidebar-specs-table th, .sidebar-specs-table td {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          border-bottom: 1px solid #edf2f7;
        }
        .sidebar-specs-table td:first-child {
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .sidebar-specs-table td:last-child {
          text-align: right;
          font-weight: 700;
          color: var(--color-text-dark);
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
                    <h3>Willem (AI)</h3>
                    <span><i className="fa-solid fa-circle" style={{ color: '#22c55e', fontSize: '0.55rem' }}></i> Online / Virtual Advisor</span>
                  </div>
                </div>
                <button onClick={handleStartOver} className="btn-lock">
                  <i className="fa-solid fa-rotate-left"></i> {getTranslation('resetText')}
                </button>
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
                
                {/* Suggestions / Chips */}
                <div className="chat-chips-row">
                  {!filledFields.category && (
                    <>
                      {['sawn', 'planed', 'dowels', 'profiles', 'specials', ...(isRomania ? ['brichete'] : [])].map(catKey => {
                        const cat = categoryData[catKey];
                        const displayName = cat.name[lang] || cat.name.nl;
                        let chipText = displayName;
                        if (catKey === 'sawn') chipText = lang === 'nl' ? 'Blanks' : (lang === 'ro' ? 'Piese brute' : (lang === 'de' ? 'Blanks' : 'Blanks'));
                        else if (catKey === 'planed') chipText = lang === 'nl' ? 'Latten' : (lang === 'ro' ? 'Șipci' : (lang === 'de' ? 'Leisten' : 'Slats'));
                        else if (catKey === 'dowels') chipText = lang === 'nl' ? 'Stokken' : (lang === 'ro' ? 'Tije' : (lang === 'de' ? 'Rundstäbe' : 'Dowels'));
                        else if (catKey === 'profiles') chipText = lang === 'nl' ? 'Profielen' : (lang === 'ro' ? 'Profile' : (lang === 'de' ? 'Profile' : 'Profiles'));
                        else if (catKey === 'specials') chipText = lang === 'nl' ? 'Bestekken' : (lang === 'ro' ? 'Speciale' : (lang === 'de' ? 'Zuschnitte' : 'Specials'));
                        else if (catKey === 'brichete') chipText = lang === 'nl' ? 'Briketten' : (lang === 'ro' ? 'Brichete' : (lang === 'de' ? 'Briketts' : 'Briquettes'));

                        const phrase = lang === 'nl' 
                          ? `Ik zoek ${chipText.toLowerCase()}` 
                          : (lang === 'ro' 
                            ? `Caut ${chipText.toLowerCase()}` 
                            : (lang === 'de' 
                              ? `Ich suche ${chipText}` 
                              : `I am looking for ${chipText.toLowerCase()}`));

                        return (
                          <div 
                            key={catKey} 
                            className="chat-chip" 
                            onClick={() => handleChipClick(phrase, catKey)}
                          >
                            {chipText}
                          </div>
                        );
                      })}
                    </>
                  )}
                  {filledFields.category && !filledFields.dimensions && (
                    <>
                      <div className="chat-chip" onClick={() => handleChipClick('25x75x1200 mm')}>25x75x1200mm</div>
                      <div className="chat-chip" onClick={() => handleChipClick('20x50x1000 mm')}>20x50x1000mm</div>
                      {category === 'dowels' && (
                        <>
                          <div className="chat-chip" onClick={() => handleChipClick('Ø 10x1000 mm')}>Ø 10x1000mm</div>
                          <div className="chat-chip" onClick={() => handleChipClick('Ø 15x1200 mm')}>Ø 15x1200mm</div>
                        </>
                      )}
                    </>
                  )}
                  {filledFields.category && filledFields.dimensions && !filledFields.grade && !isBriquettes && (
                    <>
                      <div className="chat-chip" onClick={() => handleChipClick(getTranslation('gradeASelect'), 'Grade A')}>Klasse A</div>
                      <div className="chat-chip" onClick={() => handleChipClick(getTranslation('gradeBSelect'), 'Grade B')}>Klasse B</div>
                    </>
                  )}
                  {filledFields.category && filledFields.dimensions && filledFields.grade && !filledFields.drying && !isBriquettes && (
                    <>
                      <div className="chat-chip" onClick={() => handleChipClick(getTranslation('dryingValueKiln'), 'KD kamerdroog')}>Kamerdroog (KD)</div>
                      <div className="chat-chip" onClick={() => handleChipClick(getTranslation('dryingValueAir'), 'AD luchtdroog')}>Luchtdroog (AD)</div>
                    </>
                  )}
                 </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="chat-input-row">
                  <input
                    type="text"
                    placeholder={getTranslation('placeholderInput')}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={isTyping}
                  />
                  <button
                    type="button"
                    className={`btn-mic ${isListening ? 'listening' : ''}`}
                    onClick={toggleListening}
                    disabled={isTyping}
                    title={getTranslation('micTooltip')}
                  >
                    {isListening ? (
                      <i className="fa-solid fa-microphone-lines"></i>
                    ) : (
                      <i className="fa-solid fa-microphone"></i>
                    )}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isTyping || !userInput.trim()}>
                    {getTranslation('btnSend')} <i className="fa-solid fa-paper-plane icon-right"></i>
                  </button>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem' }}>
                {getTranslation('activeSelectionTitle')}
              </h3>

              {/* 3D Visualizer */}
              <div className="visualizer-preview-box">
                <span className="visualizer-badge-v4">{getTranslation('visualizerTitle')}</span>
                
                <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="150" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="cylinderGradV4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f3e8de" />
                      <stop offset="30%" stopColor={woodColorMain} />
                      <stop offset="70%" stopColor={woodColorFront} />
                      <stop offset="100%" stopColor={woodColorEnd} />
                    </linearGradient>
                    <linearGradient id="endGrainGradV4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={woodColorEnd} />
                      <stop offset="100%" stopColor="#8d643d" />
                    </linearGradient>
                  </defs>
                  {category === 'dowels' ? (
                    <g>
                      <path d={`M ${startX} ${startY - dRadiusY} A ${dRadiusX} ${dRadiusY} 0 0 0 ${startX} ${startY + dRadiusY}`} fill={woodColorEnd} opacity="0.6" />
                      <rect x={startX} y={startY - dRadiusY} width={lScale} height={dRadiusY * 2} fill="url(#cylinderGradV4)" />
                      <ellipse cx={startX + lScale} cy={startY} rx={dRadiusX} ry={dRadiusY} fill="url(#endGrainGradV4)" stroke="#cfa67f" strokeWidth="0.8" />
                    </g>
                  ) : category === 'brichete' ? (
                    <g>
                      <rect x={svgW/2 - 50} y={svgH/2 - 20} width={90} height={40} rx="4" fill="#a77d54" stroke="#8d643d" strokeWidth="1.5" />
                      <rect x={svgW/2 - 40} y={svgH/2 - 5} width={90} height={40} rx="4" fill="#be956f" stroke="#8d643d" strokeWidth="1.5" />
                    </g>
                  ) : (
                    <g>
                      <polygon points={`${p0} ${p3} ${p5} ${p6}`} fill={woodColorEnd} stroke="rgba(141, 100, 61, 0.4)" strokeWidth="0.8" />
                      <polygon points={`${p0} ${p1} ${p2} ${p3}`} fill="url(#cylinderGradV4)" stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                      <polygon points={`${p3} ${p2} ${p4} ${p5}`} fill={woodColorMain} stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Summary Table */}
              <table className="sidebar-specs-table">
                <tbody>
                  {/* 1. Product */}
                  <tr>
                    <td>{getTranslation('productRow')}</td>
                    <td>{categoryData[category].name[lang] || categoryData[category].name.nl}</td>
                  </tr>
                  
                  {/* 2. Subcategory */}
                  {category !== 'brichete' && getActiveSubCategoryCode(category) && (
                    <tr>
                      <td>Subcategorie</td>
                      <td>{getSubcategoryName(category, getActiveSubCategoryCode(category))}</td>
                    </tr>
                  )}

                  {/* 3. Wood Species */}
                  <tr>
                    <td>{getTranslation('woodSpeciesRow')}</td>
                    <td>
                      {category === 'brichete'
                        ? (lang === 'nl' ? 'Beuken (Surplus zaagsel)' : (lang === 'ro' ? 'Fag (Surplus de rumeguș)' : (lang === 'de' ? 'Buche (Sägemehl)' : 'Beechwood (Sawdust surplus)')))
                        : getTranslation('beechwoodValue')}
                    </td>
                  </tr>

                  {/* 4. Grade */}
                  {category !== 'brichete' && (
                    <tr>
                      <td>{getTranslation('gradeRow')}</td>
                      <td>{grade === 'A' ? getTranslation('gradeAValue') : (grade === 'B' ? getTranslation('gradeBValue') : getTranslation('gradeCValue'))}</td>
                    </tr>
                  )}

                  {/* 5. Dimensions */}
                  <tr>
                    <td>{getTranslation('dimensionsRow')}</td>
                    <td>
                      {category === 'dowels' 
                        ? `Ø ${diameter} x ${length} mm`
                        : category === 'brichete'
                        ? 'RUF Block'
                        : `${thickness} x ${diameter} x ${length} mm`}
                    </td>
                  </tr>

                  {/* 6. Quantity */}
                  <tr>
                    <td>{getTranslation('quantityRow')}</td>
                    <td>
                      {quantity} {category === 'brichete' ? 'pallets' : getTranslation('pieces')}
                    </td>
                  </tr>

                  {/* 7. Finish */}
                  <tr>
                    <td>{getTranslation('finishRow')}</td>
                    <td>{categoryData[category].finish[lang] || categoryData[category].finish.nl}</td>
                  </tr>

                  {/* 8. Drying */}
                  {category !== 'brichete' && (
                    <tr>
                      <td>{getTranslation('dryingRow')}</td>
                      <td>{getDryingLabel(drying)}</td>
                    </tr>
                  )}

                  {/* 9. Steamed */}
                  {category !== 'brichete' && (
                    <tr>
                      <td>{getTranslation('steamedRow')}</td>
                      <td>{getSteamedLabel(steamed)}</td>
                    </tr>
                  )}

                  {/* 10. FSC */}
                  {category !== 'brichete' && (
                    <tr>
                      <td>{getTranslation('certificationLabel')}</td>
                      <td>{getFscLabel(fsc)}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Add to Cart button in sidebar once everything is filled */}
              {isConfigComplete && (
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '1.5rem', width: '100%' }}
                >
                  <i className="fa-solid fa-cart-plus icon-left"></i> {getTranslation('addToInquiry')}
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
