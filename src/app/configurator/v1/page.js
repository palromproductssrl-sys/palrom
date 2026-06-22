/* eslint-disable react-hooks/set-state-in-effect */
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

const mainCategories = [
  { id: 'sawn', name: categoryData.sawn.name, img: '/images/beechwood_blanks.png' },
  { id: 'planed', name: categoryData.planed.name, img: '/images/planed_wood.png' },
  { id: 'dowels', name: categoryData.dowels.name, img: '/images/dowels.png' },
  { id: 'profiles', name: categoryData.profiles.name, img: '/images/profiles.png' },
  { id: 'specials', name: categoryData.specials.name, img: '/images/specials.png' },
  { id: 'brichete', name: categoryData.brichete.name, img: '/images/brichete_fag.png' },
];

const standardSawnThickness = [20, 25, 32, 36, 42, 47, 52, 57, 67];
const standardSawnWidth = [45, 50, 60, 65, 70, 75, 95];
const standardRodDiameters = [3, 4, 5, 6, 8, 10, 12, 14, 15, 16, 18, 19, 20, 22, 25, 28, 30, 35, 40, 45, 50, 55, 60];
const standardLengthRanges = ['200-250', '300-550', '600-900', '1000-1400', '1500-2000', '2100-3000'];

// Specials prices
const specialsPrices = {
  'Keeplat Spruce': 1.25,
  'Keeplat Beech': 1.55,
  'Distancers Color Mix': 0.85,
  'Food Industry Components': 3.55,
  'Industrial Distancer': 2.15,
  'Rough-sawn Specials': 4.85,
};

// Subcategory data
const dowelSubcategories = [
  { id: 'dowel-smooth', name: { nl: 'Glad', en: 'Smooth', de: 'Glatt', ro: 'Neted' }, img: '/images/dowelsmedium.jpg' },
  { id: 'dowel-rilled', name: { nl: 'Gerild', en: 'Rilled', de: 'Geriffelt', ro: 'Canelat' }, img: '/images/dowelsrilled-300x300-1.jpg' },
];

const profileSubcategories = [
  { id: 'profile-semiround', name: { nl: 'Halfrond profiel', en: 'Semiround Profile', de: 'Halbrondprofil', ro: 'Profil Semirotund' }, img: '/images/profile1.jpg' },
  { id: 'profile-strip', name: { nl: 'Plat profiel (Strip)', en: 'Profile Strip', de: 'Flachprofil (Leiste)', ro: 'Profil Șipcă Plată' }, img: '/images/profile2.jpg' },
  { id: 'profile-finish-v1', name: { nl: 'Afwerkingsprofiel (Variant 1)', en: 'Profile Finishing (Variant 1)', de: 'Profil-Abschlussleiste (Variante 1)', ro: 'Profil Finisaj (Varianta 1)' }, img: '/images/profile3.jpg' },
  { id: 'profile-quarter-v1', name: { nl: 'Kwartrond profiel (Variant 1)', en: 'Profile Quarter Round (Variant 1)', de: 'Viertelrundprofil (Variante 1)', ro: 'Profil Sfert de Cerc (Varianta 1)' }, img: '/images/profile4.jpg' },
  { id: 'profile-finish-v2', name: { nl: 'Afwerkingsprofiel (Variant 2)', en: 'Profile Finishing (Variant 2)', de: 'Profil-Abschlussleiste (Variante 2)', ro: 'Profil Finisaj (Varianta 2)' }, img: '/images/profile5.jpg' },
  { id: 'profile-plinth-v1', name: { nl: 'Plintprofiel (Variant 1)', en: 'Profile Plinth (Variant 1)', de: 'Sockelleistenprofil (Variante 1)', ro: 'Profil Plintă (Varianta 1)' }, img: '/images/profile6.jpg' },
  { id: 'profile-corner-v1', name: { nl: 'Hoekprofiel (Variant 1)', en: 'Profile Corner (Variant 1)', de: 'Eckprofil (Variante 1)', ro: 'Profil de Colț (Varianta 1)' }, img: '/images/profile7.jpg' },
  { id: 'profile-corner-v2', name: { nl: 'Hoekprofiel (Variant 2)', en: 'Profile Corner (Variant 2)', de: 'Eckprofil (Variante 2)', ro: 'Profil de Colț (Varianta 2)' }, img: '/images/profile8.jpg' },
  { id: 'profile-triangular', name: { nl: 'Driehoekig profiel', en: 'Profile Triangular', de: 'Dreiecksprofil', ro: 'Profil Triunghiular' }, img: '/images/profile9.jpg' },
  { id: 'profile-quarter-v2', name: { nl: 'Kwartrond profiel (Variant 2)', en: 'Profile Quarter Round (Variant 2)', de: 'Viertelrundprofil (Variante 2)', ro: 'Profil Sfert de Cerc (Varianta 2)' }, img: '/images/profile10.jpg' },
  { id: 'profile-thread', name: { nl: 'Gegroefd profiel (Draad)', en: 'Profile Thread', de: 'Gewindeprofil', ro: 'Profil Filetat / Striat' }, img: '/images/profile11.jpg' },
  { id: 'profile-calbat', name: { nl: 'Calbat profiel', en: 'Profile Calbat', de: 'Calbat-Profil', ro: 'Profil Calbat' }, img: '/images/profile12.jpg' },
];

const planedSubcategories = [
  { id: 'planed-rect', name: { nl: 'Geschaafd rechthoekig', en: 'Planed rectangular', de: 'Gehobelt rechteckig', ro: 'Rinduit rectangular' }, img: '/images/4sides1.jpg' },
  { id: 'planed-radius', name: { nl: 'Geschaafd radius', en: 'Planed radius', de: 'Gehobelt Radius', ro: 'Rinduit rază' }, img: '/images/4sides7.jpg' },
];

const specialsSubcategories = [
  { id: 'special-keeplat-spruce', name: { nl: 'Vuren keeplat (spie)', en: 'Keeplat Spruce', de: 'Keilleiste Fichte', ro: 'Pană din Lemn de Molid' }, img: '/images/special1.jpg' },
  { id: 'special-keeplat-beech', name: { nl: 'Beuken keeplat (spie)', en: 'Keeplat Beech', de: 'Keilleiste Buche', ro: 'Pană din Lemn de Fag' }, img: '/images/special2.jpg' },
  { id: 'special-distancer-mix', name: { nl: 'Afstandhouders kleurenmix', en: 'Distancers Color Mix', de: 'Abstandhalter Farbmix', ro: 'Distanțiere Mix de Culori' }, img: '/images/special3.jpg' },
  { id: 'special-threshold', name: { nl: 'Componenten voedingsindustrie', en: 'Food industry components', de: 'Komponenten für Lebensmittelindustrie', ro: 'Componente pentru industria alimentară' }, img: '/images/special4.jpg' },
  { id: 'special-distancer-ind', name: { nl: 'Industriële afstandhouder', en: 'Industrial Distancer', de: 'Industrieller Abstandhalter', ro: 'Distanțier Industrial' }, img: '/images/special5.jpg' },
  { id: 'special-wood-iron', name: { nl: 'Gezaagde bestekken (fijnbezaagd)', en: 'Rough-sawn specials (fine-sawn)', de: 'Sägerauhe Zuschnitte', ro: 'Piese brute netăiate' }, img: '/images/special6.jpg' },
];

const t = {
  loading: { nl: 'Inladen portal...', en: 'Loading portal...', de: 'Portal wird geladen...', ro: 'Se încarcă portalul...' },
  passwordLabel: { nl: 'Wachtwoord *', en: 'Password *', de: 'Passwort *', ro: 'Parolă *' },
  passwordError: { nl: 'Ongeldig wachtwoord. Probeer het opnieuw.', en: 'Invalid password. Please try again.', de: 'Ungültiges Passwort. Bitte versuchen Sie es erneut.', ro: 'Parolă invalidă. Vă rugăm să încercați din nou.' },
  unlockButton: { nl: 'Toegang Ontgrendelen', en: 'Unlock Access', de: 'Zugang entsperren', ro: 'Deblochează Accesul' },
  portalTitle: { nl: 'B2B Partner Portal', en: 'B2B Partner Portal', de: 'B2B-Partnerportal', ro: 'Portal Partener B2B' },
  portalLead: { nl: 'Voer het wachtwoord in om toegang te krijgen tot de Palrom Offerte Configurator.', en: 'Enter the password to access the Palrom Quote Configurator.', de: 'Geben Sie das Passwort ein, um auf den Palrom Angebotskonfigurator zuzugreifen.', ro: 'Introduceți parola pentru a accesa Configuratorul de Oferte Palrom.' },
  heroBreadcrumb: { nl: 'Palrom Offerte Configurator', en: 'Palrom Quote Configurator', de: 'Palrom Angebotskonfigurator', ro: 'Configurator de Oferte Palrom' },
  heroTitle: { nl: 'Palrom Offerte Configurator', en: 'Palrom Quote Configurator', de: 'Palrom Angebotskonfigurator', ro: 'Configurator de Oferte Palrom' },
  heroSubtitle: { nl: 'Stel direct de gewenste specificaties, millimeter-afmetingen en bewerkingen in voor uw zakelijke volume-aanvraag.', en: 'Instantly configure desired specifications, millimeter dimensions, and treatments for your B2B volume inquiry.', de: 'Konfigurieren Sie sofort die gewünschten Spezifikationen, Millimetermaße und Bearbeitungen für Ihre B2B-Volumenanfrage.', ro: 'Configurați instantaneu specificațiile dorite, dimensiunile în milimetri și tratamentele pentru solicitarea dvs. de volum B2B.' },
  categoryLabel: { nl: 'Productcategorie', en: 'Product Category', de: 'Produktkategorie', ro: 'Categorie Produs' },
  dowelSubcatLabel: { nl: 'Subcategorie Stokken *', en: 'Sticks Subcategory *', de: 'Stäbe Unterkategorie *', ro: 'Subcategorie Tije *' },
  profileSubcatLabel: { nl: 'Subcategorie Profielen *', en: 'Profiles Subcategory *', de: 'Profile Unterkategorie *', ro: 'Subcategorie Profile *' },
  planedSubcatLabel: { nl: 'Subcategorie Latten *', en: 'Slats Subcategory *', de: 'Leisten Unterkategorie *', ro: 'Subcategorie Șipci *' },
  specialSubcatLabel: { nl: 'Subcategorie Bestekken *', en: 'Specials Subcategory *', de: 'Zuschnitte Unterkategorie *', ro: 'Subcategorie Piese brute *' },
  quantityLabel: { nl: 'Oplage (stuks)', en: 'Quantity (pieces)', de: 'Auflage (Stück)', ro: 'Cantitate (bucăți)' },
  pieces: { nl: 'stuks', en: 'pieces', de: 'Stück', ro: 'bucăți' },
  addedConfigsTitle: { nl: 'Toegevoegde configuraties in deze offerteaanvraag', en: 'Added configurations in this quote request', de: 'Hinzugefügte Konfigurationen in dieser Angebotsanfrage', ro: 'Configurații adăugate în această solicitare de ofertă' },
  totalCumulativePrice: { nl: 'Totaal gecumuleerde richtprijs:', en: 'Total cumulative target price:', de: 'Gesamte kumulierte Richtpreis:', ro: 'Preț țintă total cumulat:' },
  configDetailCol: { nl: 'Configuratie Detail', en: 'Configuration Detail', de: 'Konfigurationsdetail', ro: 'Detaliu Configurare' },
  yourSelectionCol: { nl: 'Uw Selectie', en: 'Your Selection', de: 'Ihre Auswahl', ro: 'Selecția Dvs.' },
  productRow: { nl: 'Product', en: 'Product', de: 'Produkt', ro: 'Produs' },
  dimensionsRow: { nl: 'Afmetingen', en: 'Dimensions', de: 'Maße', ro: 'Dimensiuni' },
  quantityRow: { nl: 'Oplage', en: 'Quantity', de: 'Auflage', ro: 'Cantitate' },
  materialRow: { nl: 'Materiaal', en: 'Material', de: 'Material', ro: 'Material' },
  finishRow: { nl: 'Afwerking', en: 'Finish', de: 'Oberfläche', ro: 'Finisaj' },
  targetPricePerPiece: { nl: 'Richtprijs (p.st.)', en: 'Target Price (per pc.)', de: 'Richtpreis (pro Stk.)', ro: 'Preț Țintă (pe buc.)' },
  volumeDiscountRow: { nl: 'Staffelkorting', en: 'Volume Discount', de: 'Staffelrabatt', ro: 'Discount de Volum' },
  noDiscount: { nl: 'Geen (min. 10.000 voor 5%)', en: 'None (min. 10,000 for 5%)', de: 'Keine (mind. 10.000 für 5%)', ro: 'Niciunul (min. 10.000 pentru 5%)' },
  volumeDiscountText: { nl: 'B2B Staffelkorting', en: 'B2B Volume Discount', de: 'B2B-Staffelrabatt', ro: 'Discount de Volum B2B' },
  totalTargetPriceRow: { nl: 'Totale Richtprijs', en: 'Total Target Price', de: 'Gesamte Richtpreis', ro: 'Preț Țintă Total' },
  certificationLabel: { nl: 'Certificering', en: 'Certification', de: 'Zertifizierung', ro: 'Certificare' },
  statusLabel: { nl: 'Status', en: 'Status', de: 'Status', ro: 'Status' },
  submitInquiryButton: { nl: 'Toevoegen aan offerteaanvraag', en: 'Add to quote request', de: 'Zur Angebotsanfrage hinzufügen', ro: 'Adaugă la solicitare' },
  successTitle: { nl: 'Aanvraag Succesvol Ontvangen', en: 'Inquiry Successfully Received', de: 'Anfrage erfolgreich empfangen', ro: 'Solicitare Primită cu Succes' },
  successLead: { nl: 'Bedankt! Uw specificaties zijn geregistreerd in ons B2B-offertesysteem. We nemen binnen 24 uur contact met u op.', en: 'Thank you! Your specifications have been registered in our B2B quote system. We will contact you within 24 hours.', de: 'Vielen Dank! Ihre Spezifikationen wurden in unserem B2B-Angebotssystem registriert. Wir werden uns innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.', ro: 'Vă mulțumim! Specificațiile dvs. au fost înregistrate în sistemul nostru de oferte B2B. Vă vom contacta în termen de 24 de ore.' },
  ticketHeader: { nl: 'OFFERTE TICKETAANVRAAG', en: 'QUOTE INQUIRY TICKET', de: 'ANGEBOTSANFRAGE-TICKET', ro: 'TICKET SOLICITARE OFERTĂ' },
  ticketBodyLead: { nl: 'Je aanvraag is geworden:', en: 'Your inquiry contains:', de: 'Ihre Anfrage enthält:', ro: 'Solicitarea dvs. conține:' },
  successTotalLabel: { nl: 'Totale geschatte richtprijs:', en: 'Total estimated target price:', de: 'Gesamte geschätzte Richtpreis:', ro: 'Preț țintă estimat total:' },
  successCompanyLabel: { nl: 'Organisatie:', en: 'Organization:', de: 'Organisation:', ro: 'Organizație:' },
  downloadSheetButton: { nl: 'Download Specificatiesheet', en: 'Download Spec Sheet', de: 'Spezifikationsblatt herunterladen', ro: 'Descarcă Fișa Tehnică' },
  downloadSheetAlert: { nl: 'Uw specificatiesheet (PDF) is klaargemaakt voor download en naar uw e-mailadres verzonden!', en: 'Your specification sheet (PDF) has been prepared for download and sent to your email address!', de: 'Ihr Spezifikationsblatt (PDF) wurde zum Download bereitgestellt und an Ihre E-Mail-Adresse gesendet!', ro: 'Fișa dvs. tehnică (PDF) a fost pregătită pentru descărcare și trimisă la adresa dvs. de e-mail!' },
  configureAnotherButton: { nl: 'Configureer Nieuw Product', en: 'Configure New Product', de: 'Neues Produkt konfigurieren', ro: 'Configurează un Produs Nou' },
  combineTitle: { nl: 'Wilt u nog een product toevoegen?', en: 'Would you like to add another product?', de: 'Möchten Sie ein weiteres Produkt hinzufügen?', ro: 'Doriți să adăugați un alt produs?' },
  combineLead: { nl: 'U kunt nog een product configureren en toevoegen aan deze offerteaanvraag, of direct uw offerte afronden met de huidige selectie.', en: 'You can configure another product and add it to this quote request, or finalize your quote directly with the current selection.', de: 'Sie können ein weiteres Produkt konfigurieren und dieser Angebotsanfrage hinzufügen, oder Ihr Angebot direkt mit der aktuellen Auswahl abschließen.', ro: 'Puteți configura un alt produs și să-l adăugați la această solicitare de ofertă, sau să vă finalizați oferta direct cu selecția curentă.' },
  combineYesBtn: { nl: 'Ja, voeg nog een product toe', en: 'Yes, add another product', de: 'Ja, weiteres Produkt hinzufügen', ro: 'Da, adaugă un alt produs' },
  combineNoBtn: { nl: 'Nee, offerte afronden', en: 'No, finalize quote', de: 'Nein, Angebot abschließen', ro: 'Nu, finalizează oferta' },
  contactTitle: { nl: 'Contactgegevens B2B Aanvraag', en: 'Contact Details B2B Request', de: 'Kontaktdaten B2B-Anfrage', ro: 'Date de Contact Solicitare B2B' },
  contactLead: { nl: 'Voer uw bedrijfsgegevens in om uw offerteaanvraag te voltooien. U ontvangt direct een specificatiedocument.', en: 'Enter your business details to complete your quote request. You will immediately receive a specifications document.', de: 'Geben Sie Ihre Geschäftsdaten ein, um Ihre Angebotsanfrage abzuschließen. Sie erhalten umgehend ein Spezifikationsdokument.', ro: 'Introduceți datele companiei dvs. pentru a finaliza solicitarea de ofertă. Veți primi imediat un document de specificații.' },
  contactNameLabel: { nl: 'Uw Naam *', en: 'Your Name *', de: 'Ihr Name *', ro: 'Numele Dvs. *' },
  contactCompanyLabel: { nl: 'Bedrijfsnaam *', en: 'Company Name *', de: 'Firmenname *', ro: 'Numele Companiei *' },
  contactEmailLabel: { nl: 'Zakelijk E-mailadres *', en: 'Business Email *', de: 'Geschäftliche E-Mail *', ro: 'E-mail de Afaceri *' },
  contactPhoneLabel: { nl: 'Telefoonnummer *', en: 'Phone Number *', de: 'Telefonnummer *', ro: 'Număr de Telefon *' },
  contactNotesLabel: { nl: 'Aanvullende opmerkingen of logistieke eisen', en: 'Additional notes or logistical requirements', de: 'Zusätzliche Anmerkungen oder logistische Anforderungen', ro: 'Observații suplimentare sau cerințe logistice' },
  contactNamePlaceholder: { nl: 'bijv. Jan de Vries', en: 'e.g. John Doe', de: 'z.B. Max Mustermann', ro: 'de ex. Ion Popescu' },
  contactCompanyPlaceholder: { nl: 'bijv. Houtbewerking De Vries BV', en: 'e.g. Acme Timber Corp', de: 'z.B. Mustermann Holz GmbH', ro: 'de ex. Mobila SRL' },
  contactEmailPlaceholder: { nl: 'bijv. j.devries@houtbedrijf.nl', en: 'e.g. j.doe@company.com', de: 'z.B. m.mustermann@firma.de', ro: 'de ex. i.popescu@companie.ro' },
  contactPhonePlaceholder: { nl: 'bijv. +31 6 12345678', en: 'e.g. +1 555-123-4567', de: 'z.B. +49 170 1234567', ro: 'de ex. +40 722 123 456' },
  contactNotesPlaceholder: { nl: 'bijv. Gewenste leverdatum, specifieke transportbundeling...', en: 'e.g. Desired delivery date, specific shipping bundling...', de: 'z.B. Gewünschtes Lieferdatum, spezielle Versandbündelung...', ro: 'de ex. Data de livrare dorită, ambalare specială pentru transport...' },
  submitButtonText: { nl: 'Verstuur Aanvraag', en: 'Send Request', de: 'Anfrage absenden', ro: 'Trimite Solicitarea' },
  submittingText: { nl: 'Verzenden...', en: 'Sending...', de: 'Wird gesendet...', ro: 'Se trimite...' },
  contactAlert: { nl: 'Vul a.u.b. alle verplichte contactvelden in.', en: 'Please fill in all required contact fields.', de: 'Bitte füllen Sie alle erforderlichen Kontaktfelder aus.', ro: 'Vă rugăm să completați toate câmpurile de contact obligatorii.' },
  submitError: { nl: 'Er is een fout opgetreden bij het verwerken van uw aanvraag. Probeer het opnieuw.', en: 'An error occurred while processing your request. Please try again.', de: 'Bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten. Probeer het opnieuw.', ro: 'A apărut o eroare la procesarea solicitării dvs. Vă rugăm să încercați din nou.' },
  removeItemAria: { nl: 'Verwijder product', en: 'Remove product', de: 'Produkt entfernen', ro: 'Elimină produsul' },
  materialValue: { nl: 'FSC®-Gecertificeerd Ongestoomd Beukenhout (natuurlijke kleur)', en: 'FSC®-Certified Unsteamed Beechwood (natural color)', de: 'FSC®-zertifiziertes ungedämpftes Buchenholz (natürliche Farbe)', ro: 'Lemn de Fag neaburit Certificat FSC® (culoare naturală)' },
  materialValueFsc: { nl: 'FSC®-Gecertificeerd Ongestoomd Beukenhout (natuurlijke kleur)', en: 'FSC®-Certified Unsteamed Beechwood (natural color)', de: 'FSC®-zertifiziertes ungedämpftes Buchenholz (natürliche Farbe)', ro: 'Lemn de Fag neaburit Certificat FSC® (culoare naturală)' },
  materialValueNonFsc: { nl: 'Ongestoomd Beukenhout (natuurlijke kleur)', en: 'Unsteamed Beechwood (natural color)', de: 'Ungedämpftes Buchenholz (natürliche Farbe)', ro: 'Lemn de Fag neaburit (culoare naturală)' },
  materialValueBrichete: {
    nl: '100% Zuiver beukenhout (zaagsel surplus), chemicaliënvrij',
    en: '100% Clean beech sawdust surplus, chemical-free',
    de: '100% Reines Buchenholz-Sägemehl, frei von chemischen Zusätzen',
    ro: '100% Surplus de rumeguș curat de fag, fără aditivi chimici'
  },
  statusReady: { nl: 'Gereed', en: 'Ready', de: 'Bereit', ro: 'Pregătit' },
  showPasswordAria: { nl: 'Wachtwoord tonen', en: 'Show password', de: 'Passwort anzeigen', ro: 'Afișează parola' },
  gradeLabel: { nl: 'Houtkwaliteit', en: 'Wood Quality', de: 'Holzqualität', ro: 'Calitatea lemnului' },
  gradeAAA: { nl: 'AAA (4-zijdig foutvrij)', en: 'AAA (4-sides defect-free)', de: 'AAA (4-seitig fehlerfrei)', ro: 'AAA (fără defecte pe 4 fețe)' },
  gradeCCC: { nl: 'CCC (4-zijdig foutvrij, natuurlijke kleurkernen/nuances)', en: 'CCC (4-sides defect-free, natural color cores/nuances)', de: 'CCC (4-seitig fehlerfrei, natürliche Farbkerne/Nuancen)', ro: 'CCC (fără defecte pe 4 fețe, nuclee/nuanțe de culoare naturală)' },
  lengthTypeLabel: { nl: 'Lengte categorie', en: 'Length Category', de: 'Längenkategorie', ro: 'Categorie lungime' },
  lengthTypeStandard: { nl: 'Standaard lengtes (snelle levering)', en: 'Standard lengths (fast shipping)', de: 'Standardlängen (schnelle Lieferung)', ro: 'Lungimi standard (livrare rapidă)' },
  lengthTypeCustom: { nl: 'Maatwerk lengte', en: 'Custom length', de: 'Sondermaß-Länge', ro: 'Lungime personalizată' },
  moqNotice: { nl: 'MOQ voor maatwerk is 18 m² (min. {minQty} stuks voor deze afmeting)', en: 'MOQ for custom size is 18 m² (min. {minQty} pcs for this dimension)', de: 'MOQ für Sondermaß is 18 m² (mind. {minQty} Stk. für dieses Maß)', ro: 'MOQ pentru dimensiuni personalizate este 18 m² (min. {minQty} buc pentru această dimensiune)' },
  gradeRow: { nl: 'Kwaliteitsklasse', en: 'Quality Grade', de: 'Qualitätsklasse', ro: 'Clasă de calitate' },
  optionsLabel: { nl: 'Specificaties & Opties', en: 'Specifications & Options', de: 'Spezifikationen & Optionen', ro: 'Specificații și Opțiuni' },
  fscCertified: { nl: 'FSC®-Gecertificeerd hout leveren', en: 'Deliver FSC®-Certified wood', de: 'FSC®-zertifiziertes Holz liefern', ro: 'Livrare lemn certificat FSC®' },
  unsteamedOption: { nl: 'Ongestoomd hout (natuurlijke kleur)', en: 'Unsteamed wood (natural color)', de: 'Ungedämpftes Holz (natürliche Farbe)', ro: 'Lemn neaburit (culoare naturală)' },
  fscRow: { nl: 'FSC® Certificering', en: 'FSC® Certification', de: 'FSC®-Zertifizierung', ro: 'Certificare FSC®' },
  yes: { nl: 'Ja', en: 'Yes', de: 'Ja', ro: 'Da' },
  no: { nl: 'Nee', en: 'No', de: 'Nein', ro: 'Nu' },
  fscLabelFsc: { nl: 'FSC®', en: 'FSC®', de: 'FSC®', ro: 'FSC®' },
  fscLabelNonFsc: { nl: 'Geen FSC®', en: 'No FSC®', de: 'Kein FSC®', ro: 'Fără FSC®' },
  woodSpeciesRow: { nl: 'Houtsoort', en: 'Wood species', de: 'Holzart', ro: 'Specie de lemn' },
  beechwoodValue: { nl: 'Beuken', en: 'Beechwood', de: 'Buchenholz', ro: 'Fag' },
  steamedRow: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
  steamedValueYes: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
  steamedValueNo: { nl: 'Ongestoomd', en: 'Unsteamed', de: 'Ungedämpft', ro: 'Neaburit' },
  dryingRow: { nl: 'Droging', en: 'Drying', de: 'Trocknung', ro: 'Uscare' },
  dryingValueAir: { nl: 'Luchtdroog', en: 'Air-dried', de: 'Luftgetrocknet', ro: 'Uscat natural' },
  dryingValueKiln: { nl: 'Kamerdroog (KD 10-12%)', en: 'Chamber-dried (KD 10-12%)', de: 'Kammergetrocknet (KD 10-12%)', ro: 'Uscat în cameră (KD 10-12%)' },
  fscLabelFscCertifiedSelect: { nl: 'FSC®-Gecertificeerd', en: 'FSC®-Certified', de: 'FSC®-zertifiziert', ro: 'Certificat FSC®' },
  gradeASelect: { nl: 'A = foutvrij, egaal van kleur', en: 'A = defect-free, uniform color', de: 'A = astfrei, gleichmäßige Farbe', ro: 'A = fără defecte, culoare uniformă' },
  gradeBSelect: { nl: 'B = foutvrij, gezond kleurverschil toegestaan', en: 'B = defect-free, healthy color difference allowed', de: 'B = astfrei, gesunde Farbabweichungen zulässig', ro: 'B = fără defecte, diferențe de culoare admise' },
  gradeCSelect: { nl: 'C = constructieve kwaliteit', en: 'C = structural quality', de: 'C = konstruktive Qualität', ro: 'C = calitate constructivă' },
  gradeAValue: { nl: 'A (foutvrij, egaal van kleur)', en: 'A (defect-free, uniform color)', de: 'A (astfrei, gleichmäßige Farbe)', ro: 'A (fără defecte, culoare uniformă)' },
  gradeBValue: { nl: 'B (foutvrij, gezond kleurverschil toegestaan)', en: 'B (defect-free, healthy color difference allowed)', de: 'B (astfrei, gesunde Farbabweichungen zulässig)', ro: 'B (fără defecte, diferențe de culoare admise)' },
  gradeCValue: { nl: 'C (constructieve kwaliteit)', en: 'C (structural quality)', de: 'C (konstruktive Qualität)', ro: 'C (calitate constructivă)' },
  livePreview: { nl: 'Live voorbeeld', en: 'Live preview', de: 'Live-Vorschau', ro: 'Previzualizare live' },
  additionalInfoLabel: { nl: 'Aanvullende informatie', en: 'Additional information', de: 'Zusätzliche Information', ro: 'Informații suplimentare' },
  additionalInfoPlaceholder: {
    nl: 'Bijvoorbeeld schaaftoleranties of specifieke verpakkingseisen...',
    en: 'For example planing tolerances or specific packaging requirements...',
    de: 'Zum Beispiel Hobeltoleranzen oder spezifische Verpackungsanforderungen...',
    ro: 'De exemplu, toleranțe de rindeluire sau cerințe specifice de ambalare...'
  }
};

const localeMap = { nl: 'nl-NL', de: 'de-DE', ro: 'ro-RO', en: 'en-US' };

const standardLengths = {
  planed: [2000, 2400, 3000, 4000],
  dowels: [1000, 2000, 3000],
  profiles: [2000, 2400, 3000],
  specials: [500, 1000, 1500, 2000],
};

function getPlanedMaxWidth(tVal) {
  if (tVal === 26 || tVal === 52) {
    return 125;
  }
  return 300;
}

function getMinQuantityForCustom(cat, len, diam) {
  const areaPerPiece = (diam * len) / 1000000.0;
  if (areaPerPiece <= 0) return 500;
  const rawMinQty = Math.ceil(18.0 / areaPerPiece);
  // Round up to the nearest multiple of 500 to keep quantity options clean (e.g. 500, 1000, 1500)
  const roundedMinQty = Math.ceil(rawMinQty / 500) * 500;
  return Math.max(500, roundedMinQty);
}

function formatEuro(val, decimals = 2) {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

const SHOW_PRICING = false;

function WoodVisualizer({ selection, lang }) {
  if (!selection || !selection.category) return null;

  const { category, length, diameter, thickness, grade } = selection;

  // Helper to parse numbers
  const getNumericValue = (val, defaultVal = 0) => {
    if (typeof val === 'string' && val.includes('-')) {
      return parseInt(val.split('-')[1]) || defaultVal;
    }
    return parseInt(val) || defaultVal;
  };

  const numLen = getNumericValue(length, 1000);
  const numDiam = getNumericValue(diameter, 50);
  const numThick = getNumericValue(thickness, 25);

  // SVG dimensions
  const svgW = 320;
  const svgH = 180;

  // Scaling logic
  // Length maps from 50 to 3000 to SVG width 40 to 220
  const lScale = Math.min(220, Math.max(50, (numLen / 3000) * 220));
  // Diameter (width) maps from 3 to 150 to SVG depth/height
  const wScale = Math.min(60, Math.max(15, (numDiam / 150) * 60));
  // Thickness maps from 5 to 100 to SVG vertical thickness
  const tScale = Math.min(50, Math.max(10, (numThick / 100) * 50));

  // Wood color palette based on quality (grade)
  const woodColorMain = grade === 'A' ? '#ebd4b9' : (grade === 'B' ? '#dfbf9f' : '#cfac8c');
  const woodColorFront = grade === 'A' ? '#dfbf9f' : (grade === 'B' ? '#cfa67f' : '#be956f');
  const woodColorEnd = grade === 'A' ? '#cba57e' : (grade === 'B' ? '#b88f66' : '#a77d54');

  return (
    <div className="wood-visualizer-card" style={{ height: '175px', display: 'flex', flexDirection: 'column' }}>
      <div className="visualizer-header">
        <span className="visualizer-badge">
          <i className="fa-solid fa-eye"></i> {t.livePreview?.[lang] || t.livePreview?.nl || 'Live preview'}
        </span>
      </div>
      <div className="visualizer-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '130px', background: '#fdfbf7', border: '1px solid #edf2f7', borderRadius: '8px', padding: '10px', position: 'relative' }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
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
            <pattern id="grainPattern" width="40" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(5)">
              <path d="M 0,10 Q 10,8 20,10 T 40,10" fill="none" stroke="rgba(141, 100, 61, 0.15)" strokeWidth="1" />
              <path d="M 0,3 Q 15,5 20,3 T 40,3" fill="none" stroke="rgba(141, 100, 61, 0.1)" strokeWidth="1.2" />
            </pattern>
          </defs>

          {category === 'dowels' ? (
            (() => {
              const startX = (svgW - lScale) / 2 - 10;
              const startY = svgH / 2;
              const dRadiusX = Math.min(wScale / 2, 20);
              const dRadiusY = wScale / 2;

              return (
                <g>
                  <path d={`M ${startX} ${startY - dRadiusY} A ${dRadiusX} ${dRadiusY} 0 0 0 ${startX} ${startY + dRadiusY}`} fill={woodColorEnd} opacity="0.6" />
                  <rect x={startX} y={startY - dRadiusY} width={lScale} height={dRadiusY * 2} fill="url(#cylinderGrad)" />
                  <rect x={startX} y={startY - dRadiusY} width={lScale} height={dRadiusY * 2} fill="url(#grainPattern)" />
                  <path d={`M ${startX + 10} ${startY - dRadiusY * 0.3} Q ${startX + lScale * 0.4} ${startY - dRadiusY * 0.1} ${startX + lScale - 10} ${startY - dRadiusY * 0.3}`} fill="none" stroke="rgba(141, 100, 61, 0.2)" strokeWidth="1" />
                  <path d={`M ${startX + 20} ${startY + dRadiusY * 0.4} Q ${startX + lScale * 0.6} ${startY + dRadiusY * 0.2} ${startX + lScale - 20} ${startY + dRadiusY * 0.4}`} fill="none" stroke="rgba(141, 100, 61, 0.15)" strokeWidth="1.2" />
                  <ellipse cx={startX + lScale} cy={startY} rx={dRadiusX} ry={dRadiusY} fill="url(#endGrainGrad)" stroke="#cfa67f" strokeWidth="0.8" />
                  <ellipse cx={startX + lScale} cy={startY} rx={dRadiusX * 0.6} ry={dRadiusY * 0.6} fill="none" stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                  <ellipse cx={startX + lScale} cy={startY} rx={dRadiusX * 0.2} ry={dRadiusY * 0.2} fill="none" stroke="rgba(141, 100, 61, 0.4)" strokeWidth="1" />
                  
                  {(grade === 'B' || grade === 'C') && (
                    <g>
                      <circle cx={startX + lScale * 0.3} cy={startY - dRadiusY * 0.2} r={Math.min(5, dRadiusY * 0.25)} fill="#784a25" opacity="0.8" />
                      <circle cx={startX + lScale * 0.7} cy={startY + dRadiusY * 0.3} r={Math.min(4, dRadiusY * 0.2)} fill="#6c401d" opacity="0.8" />
                    </g>
                  )}
                </g>
              );
            })()
          ) : category === 'brichete' ? (
            (() => {
              const cx = svgW / 2;
              const cy = svgH / 2;
              return (
                <g>
                  <rect x={cx - 50} y={cy - 20} width={90} height={40} rx="4" fill="#a77d54" stroke="#8d643d" strokeWidth="1.5" />
                  <path d={`M ${cx - 50} ${cy} L ${cx + 40} ${cy}`} stroke="#8d643d" strokeWidth="0.8" strokeDasharray="3,3" />
                  <rect x={cx - 40} y={cy - 5} width={90} height={40} rx="4" fill="#be956f" stroke="#8d643d" strokeWidth="1.5" />
                  <text x={cx + 5} y={cy + 20} fill="rgba(141, 100, 61, 0.5)" fontSize="10" fontWeight="900" textAnchor="middle" style={{ letterSpacing: '2px' }}>PALROM</text>
                </g>
              );
            })()
          ) : (
            (() => {
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
                <g>
                  <polygon points={`${p0} ${p3} ${p5} ${p6}`} fill={woodColorEnd} stroke="rgba(141, 100, 61, 0.4)" strokeWidth="0.8" />
                  <path d={`M ${x0 + wx * 0.5} ${y0 + wy * 0.5} Q ${x0 + wx * 0.5 + zx * 0.5} ${y0 + wy * 0.5 + zy * 0.5} ${x0 + zx * 0.5} ${y0 + zy * 0.5}`} fill="none" stroke="rgba(141, 100, 61, 0.25)" strokeWidth="1" />
                  <polygon points={`${p0} ${p1} ${p2} ${p3}`} fill="url(#cylinderGrad)" stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                  <polygon points={`${p3} ${p2} ${p4} ${p5}`} fill={woodColorMain} stroke="rgba(141, 100, 61, 0.3)" strokeWidth="0.8" />
                  <polygon points={`${p3} ${p2} ${p4} ${p5}`} fill="url(#grainPattern)" opacity="0.7" />

                  {(grade === 'B' || grade === 'C') && (
                    <g>
                      <ellipse cx={x0 + lx * 0.4 + wx * 0.5} cy={y0 + zy + wy * 0.5} rx={Math.min(6, wScale * 0.15)} ry={Math.min(3, wScale * 0.08)} fill="#784a25" opacity="0.85" />
                      <ellipse cx={x0 + lx * 0.75 + wx * 0.3} cy={y0 + zy + wy * 0.3} rx={Math.min(4, wScale * 0.1)} ry={Math.min(2, wScale * 0.05)} fill="#6c401d" opacity="0.85" />
                      <circle cx={x0 + lx * 0.2} cy={y0 + zy * 0.4} r={Math.min(5, tScale * 0.25)} fill="#5b3314" opacity="0.8" />
                    </g>
                  )}
                </g>
              );
            })()
          )}
        </svg>

        {selection.dimensions && (
          <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', textAlign: 'center', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-forest-dark)', backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', margin: '0 auto', width: 'fit-content', border: '1px solid var(--color-border)' }}>
            {selection.dimensions}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectionSummary({ selection, lang }) {
  const t = {
    title: { nl: 'Uw configuratie', en: 'Your configuration', de: 'Ihre Konfiguration', ro: 'Configurația dvs.' },
    product: { nl: 'Product', en: 'Product', de: 'Produkt', ro: 'Produs' },
    subCategory: { nl: 'Subcategorie', en: 'Subcategory', de: 'Unterkategorie', ro: 'Subcategorie' },
    woodSpecies: { nl: 'Houtsoort', en: 'Wood species', de: 'Holzart', ro: 'Specie de lemn' },
    beechwood: { nl: 'Beuken', en: 'Beechwood', de: 'Buchenholz', ro: 'Fag' },
    grade: { nl: 'Kwaliteitsklasse', en: 'Quality Grade', de: 'Qualitätsklasse', ro: 'Clasă de calitate' },
    dimensions: { nl: 'Afmetingen', en: 'Dimensions', de: 'Maße', ro: 'Dimensiuni' },
    qty: { nl: 'Oplage', en: 'Quantity', de: 'Auflage', ro: 'Cantitate' },
    finish: { nl: 'Afwerking', en: 'Finish', de: 'Oberfläche', ro: 'Finisaj' },
    drying: { nl: 'Droging', en: 'Drying', de: 'Trocknung', ro: 'Uscare' },
    steamed: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
    steamedValueYes: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
    steamedValueNo: { nl: 'Ongestoomd', en: 'Unsteamed', de: 'Ungedämpft', ro: 'Neaburit' },
    fsc: { nl: 'FSC® Certificering', en: 'FSC® Certification', de: 'FSC®-Zertifizierung', ro: 'Certificare FSC®' },
    price: { nl: 'Richtprijs (excl. btw)', en: 'Target Price (excl. VAT)', de: 'Richtpreis (exkl. MwSt.)', ro: 'Preț Țintă (excl. TVA)' },
  };

  const gradeNames = {
    nl: { A: 'Klasse A (Foutvrij)', B: 'Klasse B (Meubelhout)', C: 'Klasse C (Constructief)' },
    en: { A: 'Class A (Clear)', B: 'Class B (Cabinet)', C: 'Class C (Structural)' },
    de: { A: 'Klasse A (Astfrei)', B: 'Klasse B (Möbelholz)', C: 'Klasse C (Konstruktive Qualität)' },
    ro: { A: 'Clasa A (Fără noduri)', B: 'Clasa B (Lemn pentru mobilă)', C: 'Clasa C (Calitate constructivă)' }
  };

  const dryingValues = {
    luchtdroog: { nl: 'Luchtdroog', en: 'Air-dried', de: 'Luftgetrocknet', ro: 'Uscat natural' },
    kd: { nl: 'Kamerdroog (KD 10-12%)', en: 'Chamber-dried (KD 10-12%)', de: 'Kammergetrocknet (KD 10-12%)', ro: 'Uscat în cameră (KD 10-12%)' }
  };

  const getVal = (dict, key) => dict[key]?.[lang] || dict[key]?.en || key;

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

  return (
    <div className="selection-summary-card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.65rem 1rem', boxShadow: 'var(--shadow-sm)', minHeight: '250px', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.3rem', color: 'var(--color-text-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <i className="fa-solid fa-list-check" style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}></i>
        {getVal(t, 'title')}
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <tbody>
          {/* 1. Product */}
          {selection.productName && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'product')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{selection.productName}</td>
            </tr>
          )}
          {/* 2. Subcategory */}
          {selection.category !== 'brichete' && selection.subCategory && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'subCategory')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{getSubcategoryName(selection.category, selection.subCategory)}</td>
            </tr>
          )}
          {/* 3. Houtsoort */}
          <tr>
            <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'woodSpecies')}</td>
            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
              {selection.category === 'brichete'
                ? (lang === 'nl' ? 'Beuken (Surplus zaagsel)' : (lang === 'ro' ? 'Fag (Surplus de rumeguș)' : (lang === 'de' ? 'Buche (Sägemehl)' : 'Beechwood (Sawdust surplus)')))
                : getVal(t, 'beechwood')}
            </td>
          </tr>
          {/* 4. Kwaliteitsklasse */}
          {selection.grade && selection.category !== 'brichete' && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'grade')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{gradeNames[lang]?.[selection.grade] || selection.grade}</td>
            </tr>
          )}
          {/* 5. Afmetingen */}
          {selection.dimensions && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'dimensions')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{selection.dimensions}</td>
            </tr>
          )}
          {/* Radius */}
          {selection.radius && selection.category === 'planed' && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>Radius</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{selection.radius}</td>
            </tr>
          )}
          {/* 6. Oplage */}
          {selection.qtyText && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'qty')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-forest-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{selection.qtyText}</td>
            </tr>
          )}
          {/* 7. Afwerking */}
          {selection.finish && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'finish')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>{selection.finish}</td>
            </tr>
          )}
          {/* 8. Droging */}
          {selection.drying && selection.category !== 'brichete' && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'drying')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                {dryingValues[selection.drying]?.[lang] || dryingValues.kd[lang]}
              </td>
            </tr>
          )}
          {/* 9. Gestoomd */}
          {selection.steamed && selection.category !== 'brichete' && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'steamed')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                {selection.steamed === 'yes' ? getVal(t, 'steamedValueYes') : getVal(t, 'steamedValueNo')}
              </td>
            </tr>
          )}
          {/* 10. FSC */}
          {selection.fsc !== undefined && selection.category !== 'brichete' && (
            <tr>
              <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, padding: '0.35rem 0.5rem 0.35rem 0', borderBottom: '1px solid #edf2f7' }}>{getVal(t, 'fsc')}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)', padding: '0.35rem 0 0.35rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                {selection.fsc ? 'FSC® 100%' : (lang === 'nl' ? 'Geen FSC' : (lang === 'ro' ? 'Fără FSC' : (lang === 'de' ? 'Kein FSC' : 'No FSC')))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {SHOW_PRICING && selection.price !== undefined && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #edf2f7', paddingTop: '4px', marginTop: '4px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, marginRight: '0.5rem' }}>{getVal(t, 'price')}: </span>
          <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            € {formatEuro(selection.price)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Configurator() {
  const { lang, addToCart, setIsCartOpen, shouldResetConfigurator, setShouldResetConfigurator, isRomania } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Configurator states
  const [currentStep, setCurrentStep] = useState(1);
  const configuratorRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (currentStep && configuratorRef.current) {
      const elementRect = configuratorRef.current.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const offset = 115; // Offset for fixed header + margin spacing
      
      window.scrollTo({
        top: absoluteElementTop - offset,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  const [highestStepReached, setHighestStepReached] = useState(1);
  const [category, setCategory] = useState('');
  const [subCategoryDowels, setSubCategoryDowels] = useState('dowel-smooth');
  const [subCategoryProfiles, setSubCategoryProfiles] = useState('profile-semiround');
  const [subCategorySpecials, setSubCategorySpecials] = useState('special-keeplat-spruce');
  const [subCategoryPlaned, setSubCategoryPlaned] = useState('planed-rect');
  const [radius, setRadius] = useState('');
  
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
  const [activeTooltipModal, setActiveTooltipModal] = useState(null);

  const resetConfigurator = () => {
    setCategory('');
    setSubCategoryDowels('dowel-smooth');
    setSubCategoryProfiles('profile-semiround');
    setSubCategorySpecials('special-keeplat-spruce');
    setSubCategoryPlaned('planed-rect');
    setRadius('');
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
    setCurrentStep(1);
    setHighestStepReached(1);
  };

  useEffect(() => {
    if (shouldResetConfigurator) {
      resetConfigurator();
      setShouldResetConfigurator(false);
    }
  }, [shouldResetConfigurator, setShouldResetConfigurator]);

  const getValidationError = () => {
    if (category === 'planed' && subCategoryPlaned === 'planed-radius' && !radius) {
      return {
        nl: 'Kies a.u.b. een radius (R3 of R6).',
        en: 'Please choose a radius (R3 or R6).',
        de: 'Bitte wählen Sie einen Radius (R3 oder R6).',
        ro: 'Vă rugăm să alegeți o rază (R3 sau R6).'
      };
    }
    if (category === 'planed' && grade === 'A') {
      const parsedLength = typeof length === 'string' && length.includes('-')
        ? parseInt(length.split('-')[1])
        : (parseInt(length) || 0);
      if (parsedLength >= 3000 && diameter >= 125) {
        return {
          nl: 'Productie-restrictie: Een lengte van 3000 mm of meer in A-kwaliteit is niet leverbaar in een breedte van 125 mm of meer.',
          en: 'Production constraint: A length of 3000 mm or more in A quality is not available in a width of 125 mm or more.',
          de: 'Produktionseinschränkung: Eine Länge von 3000 mm oder mehr in A-Qualität ist bei einer Breite von 125 mm oder mehr nicht verfügbar.',
          ro: 'Restricție de producție: O lungime de 3000 mm sau mai mare în calitate A nu este disponibilă la o lățime de 125 mm sau mai mare.'
        };
      }
    }
    return null;
  };

  const validationError = getValidationError();

  const getStep2Summary = () => {
    if (category === 'brichete') {
      return lang === 'nl' ? '100% Natuurlijk beukenhout' : (lang === 'ro' ? '100% Fag natural' : (lang === 'de' ? '100% Naturbuche' : '100% Natural beechwood'));
    }
    const fscText = activeSelection.fsc ? 'FSC®' : (lang === 'nl' ? 'Geen FSC' : (lang === 'de' ? 'Kein FSC' : (lang === 'ro' ? 'Fără FSC' : 'No FSC')));
    const dryingText = activeSelection.drying === 'luchtdroog' ? (lang === 'nl' ? 'Luchtdroog' : (lang === 'ro' ? 'Uscat la aer' : (lang === 'de' ? 'Luftgetrocknet' : 'Air-dried'))) : 'KD';
    const gradeText = activeSelection.grade ? `Grade ${activeSelection.grade}` : '';
    return `${activeSelection.dimensions || ''}${gradeText ? `, ${gradeText}` : ''}, ${fscText}, ${dryingText}`;
  };
  const parsedLengthForMinQty = typeof length === 'string' && length.includes('-')
    ? parseInt(length.split('-')[1])
    : (parseInt(length) || 0);
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

  // Set quantity to minQty when the minimum quantity requirement changes
  useEffect(() => {
    setQuantity(minQty);
  }, [minQty]);



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
  // Sync state defaults when category changes
  useEffect(() => {
    if (categoryData[category]) {
      setThicknessType('custom');
      setWidthType('custom');
      setLengthType('custom');
      if (category === 'sawn') {
        setDrying('kd');
        setGrade('A');
        setThickness(25);
        setDiameter(50);
        setLength(1000);
      } else if (category === 'planed') {
        setDrying('kd');
        setGrade('A');
        setThickness(20);
        setDiameter(50);
        setLength(1000);
      } else if (category === 'dowels') {
        setDrying('kd');
        setGrade('A');
        setThickness(10);
        setDiameter(10);
        setLength(1000);
      } else if (category === 'profiles') {
        setDrying('kd');
        setGrade('A');
        setThickness(20);
        setDiameter(40);
        setLength(1000);
      } else if (category === 'specials') {
        setDrying('kd');
        setGrade('A');
        setThickness(20);
        setDiameter(40);
        setLength(500);
      } else if (category === 'brichete') {
        setDrying('kd');
        setGrade('A');
        setThickness(90);
        setDiameter(90);
        setLength(250);
        setQuantity(1);
        setFsc(false);
      }
      setAdditionalInfo('');
    }
  }, [category]);
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'palrom2026') {
      sessionStorage.setItem('palrom_configurator_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPassword('');
    }
  };

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

  const getTranslation = (key) => {
    return t[key]?.[lang] || t[key]?.nl || '';
  };

  const getActiveSelectionDetails = () => {
    const data = categoryData[category];
    if (!data) return {};

    // Get final values
    let finalLength = length;
    let finalDiameter = diameter;
    let finalThickness = thickness;

    // Retrieve subcategory name if applicable
    const currentSubcat = category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : category === 'planed' ? subCategoryPlaned : '';
    
    // Invoke price details with additional drying state
    const details = calculatePriceDetails(category, finalLength, finalDiameter, finalThickness, quantity, currentSubcat, grade, lengthType, drying);

    // Dynamic productName
    let subName = data.name[lang] || data.name.nl;
    if (category === 'specials') {
      const item = specialsSubcategories.find(s => s.id === currentSubcat);
      if (item) {
        subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
      }
    } else if (category === 'profiles') {
      const item = profileSubcategories.find(p => p.id === currentSubcat);
      if (item) {
        subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
      }
    } else if (category === 'dowels') {
      const item = dowelSubcategories.find(d => d.id === currentSubcat);
      if (item) {
        subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
      }
    } else if (category === 'planed') {
      const item = planedSubcategories.find(p => p.id === currentSubcat);
      if (item) {
        subName = `${data.name[lang] || data.name.nl} - ${item.name[lang] || item.name.nl}`;
      }
    }

    // Format dimensions string
    let dims = '';
    const lengthStr = typeof finalLength === 'string' ? `${finalLength} mm` : `${finalLength} mm`;
    const widthStr = category === 'dowels' ? 'n.v.t.' : `${finalDiameter} mm`;
    const thickStr = `${finalThickness} mm`;

    if (category === 'sawn' || category === 'planed' || category === 'profiles' || category === 'specials') {
      dims = `${thickStr} x ${widthStr} x ${lengthStr}`;
    } else if (category === 'dowels') {
      dims = `Ø ${finalDiameter} mm x ${lengthStr}`;
    } else if (category === 'brichete') {
      dims = lang === 'ro' ? 'Palet (960 kg greutate netă)' : (lang === 'nl' ? 'Pallet (960 kg netto gewicht)' : (lang === 'de' ? 'Palette (960 kg Nettogewicht)' : 'Pallet (960 kg net weight)'));
    }

    return {
      category,
      subCategory: currentSubcat,
      length: finalLength,
      diameter: finalDiameter,
      thickness: finalThickness,
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

  // Helper to translate/format configured raw item dynamically
  const localizeItem = (item, l) => {
    if (!item.category) return item;
    const data = categoryData[item.category];
    if (!data) return item;

    const details = calculatePriceDetails(item.category, item.length, item.diameter, item.thickness, item.quantity, item.subCategory, item.grade || 'A', item.lengthType || 'standard', item.drying || 'kd');

    let subName = data.name[l] || data.name.nl;
    if (item.subCategory) {
      let locSubName = '';
      if (item.category === 'dowels') {
        const subObj = dowelSubcategories.find(d => d.id === item.subCategory);
        if (subObj) locSubName = subObj.name[l] || subObj.name.nl;
      } else if (item.category === 'profiles') {
        const subObj = profileSubcategories.find(p => p.id === item.subCategory);
        if (subObj) locSubName = subObj.name[l] || subObj.name.nl;
      } else if (item.category === 'specials') {
        const subObj = specialsSubcategories.find(s => s.id === item.subCategory);
        if (subObj) locSubName = subObj.name[l] || subObj.name.nl;
      } else if (item.category === 'planed') {
        const subObj = planedSubcategories.find(p => p.id === item.subCategory);
        if (subObj) locSubName = subObj.name[l] || subObj.name.nl;
      }
      if (locSubName) {
        subName = `${data.name[l] || data.name.nl} - ${locSubName}`;
      }
    }

    let dims = '';
    const lengthStr = typeof item.length === 'string' ? `${item.length} mm` : `${item.length} mm`;
    const widthStr = item.category === 'dowels' ? 'n.v.t.' : `${item.diameter} mm`;
    const thickStr = `${item.thickness} mm`;

    if (item.category === 'sawn' || item.category === 'planed' || item.category === 'profiles' || item.category === 'specials') {
      dims = `${thickStr} x ${widthStr} x ${lengthStr}`;
    } else if (item.category === 'dowels') {
      dims = `Ø ${item.diameter} mm x ${item.length} mm`;
    } else if (item.category === 'brichete') {
      dims = l === 'ro' ? 'Palet (960 kg greutate netă)' : (l === 'nl' ? 'Pallet (960 kg netto gewicht)' : (l === 'de' ? 'Palette (960 kg Nettogewicht)' : 'Pallet (960 kg net weight)'));
    }

    return {
      ...item,
      grade: item.grade || 'A',
      lengthType: item.lengthType || 'standard',
      fsc: item.fsc !== undefined ? item.fsc : true,
      productName: subName,
      dimensions: dims,
      qtyText: item.category === 'brichete'
        ? `${item.quantity.toLocaleString(localeMap[l] || 'en-US')} ${l === 'ro' ? 'paleți' : (l === 'nl' ? 'pallets' : (l === 'de' ? 'Paletten' : 'pallets'))}`
        : `${item.quantity.toLocaleString(localeMap[l] || 'en-US')} ${t['pieces']?.[l] || t['pieces']?.nl}`,
      qtyVal: item.quantity,
      finish: data.finish[l] || data.finish.nl,
      price: details.totalPrice,
      unitPrice: details.unitPrice,
      discountPercent: details.discountPercent,
    };
  };

  const activeSelection = getActiveSelectionDetails();

  const [confirmedSelection, setConfirmedSelection] = useState(null);

  useEffect(() => {
    if (currentStep === 1) {
      setConfirmedSelection(null);
    } else if (currentStep === 2) {
      const liveDetails = getActiveSelectionDetails();
      setConfirmedSelection({
        category: liveDetails.category,
        productName: liveDetails.productName,
        woodType: liveDetails.woodType,
        finish: liveDetails.finish,
        grade: liveDetails.grade,
        dimensions: liveDetails.dimensions,
        drying: liveDetails.drying,
        steamed: liveDetails.steamed,
        fsc: liveDetails.fsc,
        length: liveDetails.length,
        diameter: liveDetails.diameter,
        thickness: liveDetails.thickness,
        radius: liveDetails.radius,
        subCategory: liveDetails.subCategory
      });
    } else if (currentStep === 3) {
      const liveDetails = getActiveSelectionDetails();
      setConfirmedSelection({
        category: liveDetails.category,
        productName: liveDetails.productName,
        woodType: liveDetails.woodType,
        finish: liveDetails.finish,
        grade: liveDetails.grade,
        dimensions: liveDetails.dimensions,
        drying: liveDetails.drying,
        steamed: liveDetails.steamed,
        fsc: liveDetails.fsc,
        length: liveDetails.length,
        diameter: liveDetails.diameter,
        thickness: liveDetails.thickness,
        qtyText: liveDetails.qtyText,
        qtyVal: liveDetails.qtyVal,
        price: liveDetails.price,
        unitPrice: liveDetails.unitPrice,
        discountPercent: liveDetails.discountPercent,
        additionalInfo: liveDetails.additionalInfo,
        radius: liveDetails.radius,
        subCategory: liveDetails.subCategory
      });
    }
  }, [currentStep, category, subCategoryDowels, subCategoryProfiles, subCategorySpecials, subCategoryPlaned, radius, woodType, grade, thickness, diameter, length, quantity, additionalInfo, fsc, drying, steamed, lang]);

  const handleAddConfiguration = () => {
    const rawItem = {
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
    setConfiguredItems((prev) => [...prev, rawItem]);

    // Reset configurator fields
    const data = categoryData[category];
    if (data) {
      if (category === 'sawn') {
        setDrying('kd');
        setGrade('A');
        setThicknessType('standard');
        setThickness(25);
        setWidthType('standard');
        setDiameter(50);
        setLengthType('standard');
        setLength('1000-1400');
      } else if (category === 'planed') {
        setDrying('kd');
        setGrade('A');
        setThicknessType('custom');
        setThickness(20);
        setWidthType('custom');
        setDiameter(50);
        setLengthType('standard');
        setLength('1000-1400');
      } else if (category === 'dowels') {
        setDrying('kd');
        setGrade('A');
        setThicknessType('standard');
        setThickness(10);
        setWidthType('standard');
        setDiameter(10);
        setLengthType('standard');
        setLength('1000-1400');
      } else if (category === 'profiles') {
        setDrying('kd');
        setGrade('A');
        setThicknessType('custom');
        setThickness(20);
        setWidthType('custom');
        setDiameter(40);
        setLengthType('standard');
        setLength('1000-1400');
      } else if (category === 'specials') {
        setDrying('kd');
        setGrade('A');
        setThicknessType('custom');
        setThickness(20);
        setWidthType('custom');
        setDiameter(40);
        setLengthType('custom');
        setLength(500);
      }
      setAdditionalInfo('');
      setFsc(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

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

    const resolvedDetails = localizeItem(currentItem, lang);
    
    // Calculate base unit price before quantity discount
    const calculatedBase = calculatePriceDetails(
      currentItem.category,
      currentItem.length,
      currentItem.diameter,
      currentItem.thickness,
      1, // qty=1 to get the unit price without quantity volume discount
      currentItem.subCategory,
      currentItem.grade || 'A',
      currentItem.lengthType || 'standard',
      currentItem.drying || 'kd'
    );

    // Add to global cartItems
    addToCart({
      id: 'config-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      isConfigured: true,
      categoryKey: currentItem.category,
      category: resolvedDetails.productName.split(' - ')[0],
      name: resolvedDetails.productName,
      qty: currentItem.quantity,
      grade: currentItem.grade,
      dims: resolvedDetails.dimensions,
      fsc: currentItem.fsc,
      drying: currentItem.drying,
      additionalInfo: currentItem.additionalInfo,
      price: resolvedDetails.price, // Calculated target price
      baseUnitPrice: calculatedBase.unitPrice, // Store the base unit price (before qty discounts) for cart calculations
      discountPercent: resolvedDetails.discountPercent, // Save the calculated volume discount
      woodType: currentItem.woodType || 'beech',
      steamed: currentItem.steamed || 'no',
      finish: resolvedDetails.finish,
      subCategory: currentItem.subCategory,
      radius: currentItem.radius,
      length: currentItem.length,
      diameter: currentItem.diameter,
      thickness: currentItem.thickness,
    });
    // Reset configurator fields
    const data = categoryData[category];
    if (data) {
      setThicknessType('custom');
      setWidthType('custom');
      setLengthType('custom');
      if (category === 'sawn') {
        setDrying('kd');
        setGrade('A');
        setThickness(25);
        setDiameter(50);
        setLength(1000);
      } else if (category === 'planed') {
        setDrying('kd');
        setGrade('A');
        setThickness(20);
        setDiameter(50);
        setLength(1000);
      } else if (category === 'dowels') {
        setDrying('kd');
        setGrade('A');
        setThickness(10);
        setDiameter(10);
        setLength(1000);
      } else if (category === 'profiles') {
        setDrying('kd');
        setGrade('A');
        setThickness(20);
        setDiameter(40);
        setLength(1000);
      } else if (category === 'specials') {
        setDrying('kd');
        setGrade('A');
        setThickness(20);
        setDiameter(40);
        setLength(500);
      }
      setAdditionalInfo('');
      setFsc(true);
    }
    setCurrentStep(1);
    setHighestStepReached(1);
    // Open the sidebar cart
    setIsCartOpen(true);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ padding: '15rem 0', textAlign: 'center', background: '#f8fafc', color: '#1e293b' }}>
        <h3>{getTranslation('loading')}</h3>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="configurator-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>{getTranslation('heroBreadcrumb')}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('heroTitle')}</h1>
          <p>
            {getTranslation('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Main dashboard config section */}
      <section className="configurator-dark-section">
        <div className="container">
          <div ref={configuratorRef} className="configurator-dashboard-container">
            <form onSubmit={handleFormSubmit} className="configurator-dashboard-form">
              <div className="configurator-layout-grid">
                <div className="configurator-form-column">
                  {category && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                      <button
                        type="button"
                        onClick={resetConfigurator}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fbbf24',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 0.8}
                        onMouseLeave={(e) => e.target.style.opacity = 1}
                      >
                        <i className="fa-solid fa-rotate-left"></i>{' '}
                        {lang === 'nl' ? 'Opnieuw beginnen' : (lang === 'ro' ? 'Reîncepe' : (lang === 'de' ? 'Neustart' : 'Start over'))}
                      </button>
                    </div>
                  )}

              {/* Panel 1: Product Selection */}
              <div className={`accordion-step-panel ${currentStep === 1 ? 'active' : ''} ${highestStepReached > 1 ? 'completed' : ''}`}>
                <div 
                  className="accordion-step-header"
                  onClick={() => { if (highestStepReached >= 1) setCurrentStep(prev => prev === 1 ? null : 1); }}
                  style={highestStepReached < 1 ? { cursor: 'not-allowed' } : {}}
                >
                  <div className="accordion-step-header-left">
                    <div className="accordion-step-circle">
                      {highestStepReached > 1 ? <i className="fa-solid fa-check"></i> : '1'}
                    </div>
                    <span className="accordion-step-title">
                      {lang === 'nl' ? 'Stap 1: Kies product' : (lang === 'ro' ? 'Pasul 1: Alegeți produsul' : (lang === 'de' ? 'Schritt 1: Produkt auswählen' : 'Step 1: Choose product'))}
                    </span>
                  </div>
                  {highestStepReached > 1 && (
                    <span className="accordion-step-summary">
                      {activeSelection.productName}
                    </span>
                  )}
                  <i className="fa-solid fa-chevron-down accordion-step-arrow"></i>
                </div>

                <div className="accordion-step-body">
                  <div className="dashboard-controls-grid">
                    <div className="control-group" id="controlGroupCategory">
                      <label>{getTranslation('categoryLabel')}</label>
                  <div className="main-category-grid">
                    {mainCategories
                      .filter((cat) => cat.id !== 'brichete' || isRomania)
                      .map((cat) => (
                      <label key={cat.id} className={`main-category-card ${category !== cat.id ? 'dimmed' : ''}`}>
                        <input
                          type="radio"
                          name="mainCategory"
                          value={cat.id}
                          checked={category === cat.id}
                          onChange={() => setCategory(cat.id)}
                        />
                        <div className="card-content">
                           <Image src={cat.img} alt="" className="card-bg-image" width={300} height={98} />
                          <div className="card-overlay"></div>
                          <div className="card-info-overlay">
                            <span className="card-label">
                              {cat.id === 'brichete' ? (
                                lang === 'nl' ? (
                                  <>Beukenhout<br />briketten</>
                                ) : lang === 'de' ? (
                                  <>Buchenholz<br />briketts</>
                                ) : (
                                  cat.name[lang] || cat.name.nl
                                )
                              ) : (
                                cat.name[lang] || cat.name.nl
                              )}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcategory: Dowels */}
                {category === 'dowels' && (
                  <div className="control-group" id="controlGroupSubCategoryDowels">
                    <label>{getTranslation('dowelSubcatLabel')}</label>
                    <div className="dowels-subcat-grid">
                      {dowelSubcategories.map((d) => (
                        <label key={d.id} className={`dowels-subcat-card ${subCategoryDowels !== d.id ? 'dimmed' : ''}`}>
                          <input
                            type="radio"
                            name="subCategoryDowels"
                            value={d.id}
                            checked={subCategoryDowels === d.id}
                            onChange={() => setSubCategoryDowels(d.id)}
                          />
                          <div className="card-content">
                             <Image src={d.img} alt="" className="card-bg-image" width={300} height={98} />
                            <div className="card-overlay"></div>
                            <div className="card-info-overlay">
                              <span className="card-label">{d.name[lang] || d.name.nl}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory: Planed */}
                {category === 'planed' && (
                  <div className="control-group" id="controlGroupSubCategoryPlaned">
                    <label>{getTranslation('planedSubcatLabel')}</label>
                    <div className="planed-subcat-grid">
                      {planedSubcategories.map((p) => (
                        <label key={p.id} className={`planed-subcat-card ${subCategoryPlaned !== p.id ? 'dimmed' : ''}`}>
                          <input
                            type="radio"
                            name="subCategoryPlaned"
                            value={p.id}
                            checked={subCategoryPlaned === p.id}
                            onChange={() => setSubCategoryPlaned(p.id)}
                          />
                          <div className="card-content">
                             <Image src={p.img} alt="" className="card-bg-image" width={300} height={98} />
                            <div className="card-overlay"></div>
                            <div className="card-info-overlay">
                              <span className="card-label">{p.name[lang] || p.name.nl}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory: Profiles */}
                {category === 'profiles' && (
                  <div className="control-group" id="controlGroupSubCategoryProfiles">
                    <label>{getTranslation('profileSubcatLabel')}</label>
                    <div className="profiles-subcat-grid">
                      {profileSubcategories.map((p) => (
                        <label key={p.id} className={`profiles-subcat-card ${subCategoryProfiles !== p.id ? 'dimmed' : ''}`}>
                          <input
                            type="radio"
                            name="subCategoryProfiles"
                            value={p.id}
                            checked={subCategoryProfiles === p.id}
                            onChange={() => setSubCategoryProfiles(p.id)}
                          />
                          <div className="card-content">
                             <Image src={p.img} alt="" className="card-bg-image" width={300} height={98} />
                            <div className="card-overlay"></div>
                            <div className="card-info-overlay">
                              <span className="card-label">{p.name[lang] || p.name.nl}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory: Specials */}
                {category === 'specials' && (
                  <div className="control-group" id="controlGroupSubCategorySpecials">
                    <label>{getTranslation('specialSubcatLabel')}</label>
                    <div className="specials-subcat-grid">
                      {specialsSubcategories.map((s) => (
                        <label key={s.id} className={`specials-subcat-card ${subCategorySpecials !== s.id ? 'dimmed' : ''}`}>
                          <input
                            type="radio"
                            name="subCategorySpecials"
                            value={s.id}
                            checked={subCategorySpecials === s.id}
                            onChange={() => setSubCategorySpecials(s.id)}
                          />
                          <div className="card-content">
                             <Image src={s.img} alt="" className="card-bg-image" width={300} height={98} />
                            <div className="card-overlay"></div>
                            <div className="card-info-overlay">
                              <span className="card-label">{s.name[lang] || s.name.nl}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                  </div>

                  <div className="wizard-nav-buttons">
                    <div></div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!category}
                      onClick={() => {
                        setCurrentStep(2);
                        setHighestStepReached((prev) => Math.max(prev, 2));
                      }}
                      style={!category ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {lang === 'ro' ? 'Înainte' : (lang === 'nl' ? 'Volgende' : (lang === 'de' ? 'Weiter' : 'Next'))}{' '}
                      <i className="fa-solid fa-arrow-right icon-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel 2: Specifications & Dimensions */}
              <div className={`accordion-step-panel ${currentStep === 2 ? 'active' : ''} ${highestStepReached > 2 ? 'completed' : ''}`}>
                <div 
                  className="accordion-step-header"
                  onClick={() => { if (highestStepReached >= 2) setCurrentStep(prev => prev === 2 ? null : 2); }}
                  style={highestStepReached < 2 ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                >
                  <div className="accordion-step-header-left">
                    <div className="accordion-step-circle">
                      {highestStepReached > 2 ? <i className="fa-solid fa-check"></i> : '2'}
                    </div>
                    <span className="accordion-step-title">
                      {lang === 'nl' ? 'Stap 2: Specificaties & Afmetingen' : (lang === 'ro' ? 'Pasul 2: Specificații & Dimensiuni' : (lang === 'de' ? 'Schritt 2: Spezifikationen & Maße' : 'Step 2: Specifications & Dimensions'))}
                    </span>
                  </div>
                  {highestStepReached > 2 && (
                    <span className="accordion-step-summary">
                      {getStep2Summary()}
                    </span>
                  )}
                  <i className="fa-solid fa-chevron-down accordion-step-arrow"></i>
                </div>

                <div className="accordion-step-body">
                  <div className="dashboard-controls-grid">
                {/* Houtsoort */}
                {/* Houtsoort */}
                <div className="control-group">
                  <label htmlFor="dbWoodType">{getTranslation('woodSpeciesRow')}</label>
                  <CustomSelect
                    id="dbWoodType"
                    className="dashboard-select"
                    value={woodType}
                    disabled={true}
                    options={[{ value: 'beech', label: getTranslation('beechwoodValue') }]}
                  />
                </div>

                {/* Gestoomd */}
                {category !== 'brichete' && (
                  <div className="control-group">
                    <label htmlFor="dbSteamed">{getTranslation('steamedRow')}</label>
                    <CustomSelect
                      id="dbSteamed"
                      className="dashboard-select"
                      value={steamed}
                      disabled={true}
                      options={[{ value: 'no', label: getTranslation('steamedValueNo') }]}
                    />
                  </div>
                )}

                {/* Droging */}
                <div className="control-group">
                  <label htmlFor="dbDrying" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {getTranslation('dryingRow')}
                    <button 
                      type="button" 
                      className="info-tooltip-btn" 
                      onClick={() => setActiveTooltipModal('drying')}
                      aria-label="Info droging"
                    >
                      <i className="fa-regular fa-circle-question"></i>
                    </button>
                  </label>
                  <CustomSelect
                    id="dbDrying"
                    className="dashboard-select"
                    value={drying}
                    disabled={category !== 'sawn' && category !== 'specials'}
                    onChange={(e) => setDrying(e.target.value)}
                    options={[
                      { value: 'kd', label: getTranslation('dryingValueKiln') },
                      ...((category === 'sawn' || category === 'specials')
                        ? [{ value: 'luchtdroog', label: getTranslation('dryingValueAir') }]
                        : [])
                    ]}
                  />
                </div>

                {/* Certificering */}
                {category !== 'brichete' && (
                  <div className="control-group">
                    <label htmlFor="dbFsc">{getTranslation('certificationLabel')}</label>
                    <CustomSelect
                      id="dbFsc"
                      className="dashboard-select"
                      value={fsc ? 'yes' : 'no'}
                      onChange={(e) => setFsc(e.target.value === 'yes')}
                      options={[
                        { value: 'yes', label: getTranslation('fscLabelFscCertifiedSelect') },
                        { value: 'no', label: getTranslation('fscLabelNonFsc') }
                      ]}
                    />
                  </div>
                )}

                {/* Kwaliteit */}
                {category !== 'brichete' && (
                  <div className="control-group" id="controlGroupGrade">
                    <label htmlFor="dbGrade" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {getTranslation('gradeLabel')}
                      <button 
                        type="button" 
                        className="info-tooltip-btn" 
                        onClick={() => setActiveTooltipModal('grade')}
                        aria-label="Info houtkwaliteit"
                      >
                        <i className="fa-regular fa-circle-question"></i>
                      </button>
                    </label>
                    <CustomSelect
                      id="dbGrade"
                      className="dashboard-select"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      options={[
                        { value: 'A', label: getTranslation('gradeASelect') },
                        { value: 'B', label: getTranslation('gradeBSelect') },
                        ...((category === 'sawn' || category === 'specials')
                          ? [{ value: 'C', label: getTranslation('gradeCSelect') }]
                          : [])
                      ]}
                    />
                  </div>
                )}

                {/* Dikte / Diameter */}
                {categoryData[category]?.thickness && (
                  <div className="control-group">
                    <label htmlFor="dbThickness">
                      {categoryData[category]?.thickness?.label?.[lang] || categoryData[category]?.thickness?.label?.en || 'Thickness (mm)'}
                    </label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        className="dashboard-slider"
                        min={categoryData[category]?.thickness?.min || 5}
                        max={categoryData[category]?.thickness?.max || 200}
                        value={thickness || (categoryData[category]?.thickness?.min || 5)}
                        onChange={(e) => setThickness(parseInt(e.target.value) || (categoryData[category]?.thickness?.min || 5))}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          id="dbThickness"
                          className="slider-value-display"
                          min={categoryData[category]?.thickness?.min || 5}
                          max={categoryData[category]?.thickness?.max || 200}
                          value={thickness}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setThickness(isNaN(val) ? '' : val);
                          }}
                          onBlur={() => {
                            const minVal = categoryData[category]?.thickness?.min || 5;
                            const maxVal = categoryData[category]?.thickness?.max || 200;
                            if (thickness === '' || thickness < minVal) {
                              setThickness(minVal);
                            } else if (thickness > maxVal) {
                              setThickness(maxVal);
                            }
                          }}
                        />
                        <span style={{ color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>mm</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Breedte / Diameter */}
                {categoryData[category]?.diameter && (
                  <div className="control-group">
                    <label htmlFor="dbDiameter">
                      {category === 'dowels'
                        ? (categoryData[category]?.diameter?.label?.[lang] || categoryData[category]?.diameter?.label?.en || 'Diameter (mm)')
                        : (categoryData[category]?.diameter?.label?.[lang] || categoryData[category]?.diameter?.label?.en || 'Width (mm)')}
                    </label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        className="dashboard-slider"
                        min={getMinDiameter()}
                        max={getMaxDiameter()}
                        value={diameter || getMinDiameter()}
                        onChange={(e) => setDiameter(parseInt(e.target.value) || getMinDiameter())}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          id="dbDiameter"
                          className="slider-value-display"
                          min={getMinDiameter()}
                          max={getMaxDiameter()}
                          value={diameter}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setDiameter(isNaN(val) ? '' : val);
                          }}
                          onBlur={() => {
                            const minVal = getMinDiameter();
                            const maxVal = getMaxDiameter();
                            if (diameter === '' || diameter < minVal) {
                              setDiameter(minVal);
                            } else if (diameter > maxVal) {
                              setDiameter(maxVal);
                            }
                          }}
                        />
                        <span style={{ color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>mm</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lengte */}
                {categoryData[category]?.length && (
                  <div className="control-group">
                    <label htmlFor="dbLength">
                      {categoryData[category]?.length?.label?.[lang] || categoryData[category]?.length?.label?.en || 'Length (mm)'}
                    </label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        className="dashboard-slider"
                        min={categoryData[category]?.length?.min || 200}
                        max={categoryData[category]?.length?.max || 3000}
                        value={length || (categoryData[category]?.length?.min || 200)}
                        onChange={(e) => setLength(parseInt(e.target.value) || (categoryData[category]?.length?.min || 200))}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          id="dbLength"
                          className="slider-value-display"
                          min={categoryData[category]?.length?.min || 200}
                          max={categoryData[category]?.length?.max || 3000}
                          value={length}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setLength(isNaN(val) ? '' : val);
                          }}
                          onBlur={() => {
                            const minVal = categoryData[category]?.length?.min || 200;
                            const maxVal = categoryData[category]?.length?.max || 3000;
                            if (length === '' || length < minVal) {
                              setLength(minVal);
                            } else if (length > maxVal) {
                              setLength(maxVal);
                            }
                          }}
                        />
                        <span style={{ color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>mm</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Radius Selection (only for planed-radius) */}
                {category === 'planed' && subCategoryPlaned === 'planed-radius' && (
                  <div className="control-group">
                    <label htmlFor="dbRadius">Radius</label>
                    <CustomSelect
                      id="dbRadius"
                      className="dashboard-select"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      options={[
                        { value: '', label: lang === 'nl' ? 'Kies radius...' : (lang === 'de' ? 'Radius wählen...' : (lang === 'ro' ? 'Alege rază...' : 'Choose radius...')) },
                        { value: 'R3', label: 'R3 (3mm)' },
                        { value: 'R6', label: 'R6 (6mm)' }
                      ]}
                    />
                  </div>
                )}

                {/* Specs Block for Brichete */}
                {category === 'brichete' && (
                  <div className="control-group" style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                      {lang === 'ro' ? 'Specificații Brichete RUF' : (lang === 'nl' ? 'Specificaties RUF Briketten' : (lang === 'de' ? 'Spezifikationen RUF Briketts' : 'RUF Briquettes Specifications'))}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem', color: '#ccc' }}>
                      <li><strong>{lang === 'ro' ? 'Formă & Dimensiuni' : 'Shape & Dimensions'}:</strong> Block</li>
                      <li><strong>{lang === 'ro' ? 'Tip Lemn' : 'Wood Type'}:</strong> 100% Fag Curat</li>
                      <li><strong>{lang === 'ro' ? 'Putere Calorică' : 'Calorific Value'}:</strong> ~18.5 MJ/kg</li>
                      <li><strong>{lang === 'ro' ? 'Umiditate' : 'Moisture'}:</strong> &lt; 10%</li>
                      <li><strong>{lang === 'ro' ? 'Ambalare' : 'Packaging'}:</strong> {lang === 'ro' ? 'Pachete 10 kg (96 pachete/palet, 960 kg net)' : '10 kg packages (96 packs/pallet, 960 kg net)'}</li>
                      <li><strong>{lang === 'ro' ? 'Comandă Minimă' : 'Minimum Order'}:</strong> 1 Palet (960 kg)</li>
                    </ul>
                  </div>
                )}

                  </div>

                  {validationError && (
                    <div
                      className="validation-error-box"
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #ef4444',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '1rem',
                        marginTop: '1.5rem',
                        marginBottom: '1rem',
                        color: '#991b1b',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                      }}
                    >
                      <i className="fa-solid fa-triangle-exclamation" style={{ color: '#dc2626', fontSize: '1.2rem' }}></i>
                      <span>{validationError[lang] || validationError.nl}</span>
                    </div>
                  )}


                  <div className="wizard-nav-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      <i className="fa-solid fa-arrow-left icon-left"></i>{' '}
                      {lang === 'ro' ? 'Înapoi' : (lang === 'nl' ? 'Vorige' : (lang === 'de' ? 'Zurück' : 'Previous'))}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!!validationError}
                      style={validationError ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      onClick={() => {
                        setCurrentStep(3);
                        setHighestStepReached((prev) => Math.max(prev, 3));
                      }}
                    >
                      {lang === 'ro' ? 'Înainte' : (lang === 'nl' ? 'Volgende' : (lang === 'de' ? 'Weiter' : 'Next'))}{' '}
                      <i className="fa-solid fa-arrow-right icon-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel 3: Quantity & Summary */}
              <div className={`accordion-step-panel ${currentStep === 3 ? 'active' : ''}`}>
                <div 
                  className="accordion-step-header"
                  onClick={() => { if (highestStepReached >= 3) setCurrentStep(prev => prev === 3 ? null : 3); }}
                  style={highestStepReached < 3 ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                >
                  <div className="accordion-step-header-left">
                    <div className="accordion-step-circle">3</div>
                    <span className="accordion-step-title">
                      {lang === 'nl' ? 'Stap 3: Oplage & Samenvatting' : (lang === 'ro' ? 'Pasul 3: Cantitate & Sumar' : (lang === 'de' ? 'Schritt 3: Menge & Zusammenfassung' : 'Step 3: Quantity & Summary'))}
                    </span>
                  </div>
                  <i className="fa-solid fa-chevron-down accordion-step-arrow"></i>
                </div>

                <div className="accordion-step-body">
                  <div className="dashboard-controls-grid">
                {/* Quantity */}
                <div className="control-group">
                  <label htmlFor="dbOplage">
                    {category === 'brichete'
                      ? ({ nl: 'Aantal (Pallets van 960 kg)', en: 'Quantity (Pallets of 960 kg)', de: 'Anzahl (Paletten à 960 kg)', ro: 'Cantitate (Paleți de 960 kg)' }[lang] || 'Quantity (Pallets)')
                      : getTranslation('quantityLabel')}
                  </label>
                  <input
                    type="number"
                    id="dbOplage"
                    className="dashboard-input"
                    value={quantity}
                    min={minQty}
                    step={category === 'brichete' ? 1 : 500}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setQuantity(isNaN(val) ? '' : val);
                    }}
                    onBlur={() => {
                      if (quantity === '' || isNaN(quantity) || quantity < minQty) {
                        setQuantity(minQty);
                      }
                    }}
                    style={{ outline: 'none' }}
                  />
                  {category === 'brichete' ? (
                    <div style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '0.5rem' }}>
                      <i className="fa-solid fa-circle-info"></i>{' '}
                      {lang === 'ro' ? 'Comandă minimă: 1 Palet. Reduceri de volum pentru 12 (5%) și 24 (10%) de paleți.' : (lang === 'nl' ? 'Minimale afname: 1 Pallet. Volumekorting beschikbaar vanaf 12 (5%) en 24 (10%) pallets.' : (lang === 'de' ? 'Mindestbestellmenge: 1 Palette. Mengenrabatt ab 12 (5%) und 24 (10%) Paletten.' : 'Minimum order: 1 Pallet. Volume discounts starting at 12 (5%) and 24 (10%) pallets.'))}
                    </div>
                  ) : lengthType === 'custom' && (
                    <div style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '0.5rem' }}>
                      <i className="fa-solid fa-circle-info"></i>{' '}
                      {getTranslation('moqNotice').replace('{minQty}', minQty.toLocaleString(localeMap[lang] || 'en-US'))}
                    </div>
                  )}
                </div>

                {/* Aanvullende informatie */}
                <div className="control-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="dbAdditionalInfo">{getTranslation('additionalInfoLabel')}</label>
                  <textarea
                    id="dbAdditionalInfo"
                    className="dashboard-input"
                    rows="2"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder={getTranslation('additionalInfoPlaceholder')}
                    style={{ resize: 'vertical', width: '100%', minHeight: '60px' }}
                  />
                </div>
              </div>

              {/* Summary Table */}
              <div className="dashboard-table-wrapper" style={{ marginTop: '1rem' }}>
                <table className="dashboard-table">
                  <tbody>
                    {/* 1. Product */}
                    <tr>
                      <td style={{ color: 'var(--color-text-muted)', fontWeight: 500, width: '40%' }}>{getTranslation('productRow')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.productName}</td>
                    </tr>
                    {/* 2. Subcategory */}
                    {category !== 'brichete' && activeSelection.subCategory && (
                      <tr>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{lang === 'nl' ? 'Subcategorie' : (lang === 'de' ? 'Unterkategorie' : (lang === 'ro' ? 'Subcategorie' : 'Subcategory'))}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{getSubcategoryName(category, activeSelection.subCategory)}</td>
                      </tr>
                    )}
                    {/* 3. Houtsoort */}
                    <tr>
                      <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('woodSpeciesRow')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                        {category === 'brichete'
                          ? (lang === 'nl' ? 'Beuken (Surplus zaagsel)' : (lang === 'ro' ? 'Fag (Surplus de rumeguș)' : (lang === 'de' ? 'Buche (Sägemehl)' : 'Beechwood (Sawdust surplus)')))
                          : getTranslation('beechwoodValue')}
                      </td>
                    </tr>
                    {/* 4. Kwaliteitsklasse */}
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
                    {/* 5. Afmetingen */}
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
                    {/* 6. Oplage */}
                    <tr>
                      <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('quantityRow')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.qtyText}</td>
                    </tr>
                    {/* 7. Afwerking */}
                    <tr>
                      <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('finishRow')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>{activeSelection.finish}</td>
                    </tr>
                    {/* 8. Droging */}
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
                    {/* 9. Gestoomd */}
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
                          {activeSelection.fsc ? 'FSC® 100%' : (lang === 'nl' ? 'Geen FSC' : (lang === 'ro' ? 'Fără FSC' : (lang === 'de' ? 'Kein FSC' : 'No FSC')))}
                        </td>
                      </tr>
                    )}
                    {activeSelection.additionalInfo && (
                      <tr>
                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('additionalInfoLabel')}</td>
                        <td style={{ textAlign: 'right', fontStyle: 'italic', color: 'var(--color-text-dark)', fontWeight: 700 }}>{activeSelection.additionalInfo}</td>
                      </tr>
                    )}
                    {SHOW_PRICING && (
                      <>
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('targetPricePerPiece')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>€ {formatEuro(activeSelection.unitPrice, 4)}</td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{getTranslation('volumeDiscountRow')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                            {activeSelection.discountPercent > 0 ? (
                              <span
                                className="discount-badge"
                                style={{
                                  background: 'rgba(231,177,36,0.15)',
                                  color: 'var(--color-primary-dark)',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: 'var(--border-radius-sm)',
                                  fontWeight: 600,
                                  display: 'inline-block'
                                }}
                              >
                                -{activeSelection.discountPercent}%
                              </span>
                            ) : (
                              '0%'
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--color-forest-dark)', fontWeight: 700 }}>{getTranslation('totalTargetPrice')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>
                            € {formatEuro(activeSelection.price)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Panel 3 Navigation Buttons */}
              <div className="wizard-nav-buttons" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  <i className="fa-solid fa-arrow-left icon-left"></i>{' '}
                  {lang === 'ro' ? 'Înapoi' : (lang === 'nl' ? 'Vorige' : (lang === 'de' ? 'Zurück' : 'Previous'))}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary-dark)' }}
                  onClick={resetConfigurator}
                >
                  <i className="fa-solid fa-rotate-left icon-left"></i>{' '}
                  {lang === 'nl' ? 'Opnieuw beginnen' : (lang === 'ro' ? 'Reîncepe' : (lang === 'de' ? 'Neustart' : 'Start over'))}
                </button>
              </div>

              {/* Centered Primary Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!!validationError}
                  style={{ minWidth: '220px', ...(validationError ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                >
                  {getTranslation('submitInquiryButton')}
                </button>
              </div>

            </div>
          </div>
        </div> {/* End configurator-form-column */}

        <div className="configurator-preview-column">
          {!confirmedSelection || !confirmedSelection.category ? (
            <div className="configurator-empty-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', background: '#ffffff', borderRadius: '8px', border: '1px dashed var(--color-border)', width: '100%', boxShadow: 'var(--shadow-sm)', height: '445px' }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}></i>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-forest-dark)', margin: '0 0 0.5rem 0' }}>
                {lang === 'nl' ? 'Start uw configuratie' : (lang === 'de' ? 'Starten Sie Ihre Konfiguration' : (lang === 'ro' ? 'Începeți configurarea' : 'Start your configuration'))}
              </h3>
              <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                {lang === 'nl' ? 'Kies hiernaast een product om het live voorbeeld en de samenvatting te activeren.' : (lang === 'de' ? 'Wählen Sie nebenan ein Produkt aus, um die Live-Vorschau und die Zusammenfassung zu aktivieren.' : (lang === 'ro' ? 'Alegeți un produs alături pentru a activa previzualizarea live și rezumatul.' : 'Choose a product beside this to activate the live preview and summary.'))}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <WoodVisualizer selection={confirmedSelection} lang={lang} />
              <SelectionSummary selection={confirmedSelection} lang={lang} />
            </div>
          )}
        </div>
      </div> {/* End configurator-layout-grid */}
          </form>
          </div>
          
          {/* Configurator Version */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#9ca3af', opacity: 0.8 }}>
            Configurator v2.1.2
          </div>
        </div>
      </section>

      {/* Tooltip Modal Overlay */}
      {activeTooltipModal && (
        <div 
          className="tooltip-modal-overlay active"
          onClick={() => setActiveTooltipModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            className="tooltip-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '500px',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg-light)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-forest-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-circle-info" style={{ color: 'var(--color-primary-dark)' }}></i>
                {activeTooltipModal === 'grade' 
                  ? (lang === 'nl' ? 'Uitleg Houtkwaliteiten' : (lang === 'en' ? 'Wood Quality Grades' : (lang === 'de' ? 'Holzqualität Klassen' : 'Calități Lemn')))
                  : (lang === 'nl' ? 'Uitleg Droogprocessen' : (lang === 'en' ? 'Wood Drying Processes' : (lang === 'de' ? 'Trocknungsprozesse' : 'Procese de Uscare')))}
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveTooltipModal(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div style={{ padding: '1.75rem', fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: 1.6, maxHeight: '70vh', overflowY: 'auto' }}>
              {activeTooltipModal === 'grade' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: '1px solid #edf2f7', paddingBottom: '1.25rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(231, 177, 36, 0.1)', border: '1.5px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)', fontWeight: 800, flexShrink: 0 }}>
                      <span style={{ margin: 'auto' }}>A</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                        {lang === 'nl' ? 'Klasse A (Foutvrij)' : (lang === 'en' ? 'Class A (Clear)' : (lang === 'de' ? 'Klasse A (Astfrei)' : 'Clasa A (Fără noduri)'))}
                      </h4>
                      <Image src="/images/grade_a_beech.png" alt="Grade A Beechwood" width={400} height={110} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', margin: '0.5rem 0', border: '1px solid #e5e7eb' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                        {lang === 'nl' ? 'Hoogste kwaliteit, volledig noestvrij en vrij van fouten. Geschikt voor zichtwerk, speelgoed, fijn timmerwerk en deuvels.' : 
                         lang === 'en' ? 'Highest quality, completely knot-free and clear. Ideal for visible applications, toys, furniture-making, and precision dowels.' :
                         lang === 'de' ? 'Höchste Qualität, absolut astfrei und fehlerfrei. Ideal für sichtbare Anwendungen, Spielzeug, feine Tischlerarbeiten und Dübel.' :
                         'Calitate maximă, complet fără noduri. Ideal pentru aplicații vizibile, jucării, tâmplărie fină și dibluri.'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: '1px solid #edf2f7', paddingBottom: '1.25rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(74, 85, 104, 0.1)', border: '1.5px solid #4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568', fontWeight: 800, flexShrink: 0 }}>
                      <span style={{ margin: 'auto' }}>B</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                        {lang === 'nl' ? 'Klasse B (Meubelhout)' : (lang === 'en' ? 'Class B (Cabinet)' : (lang === 'de' ? 'Klasse B (Möbelholz)' : 'Clasa B (Lemn mobilă)'))}
                      </h4>
                      <Image src="/images/grade_b_beech.png" alt="Grade B Beechwood" width={400} height={110} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', margin: '0.5rem 0', border: '1px solid #e5e7eb' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                        {lang === 'nl' ? 'Meubelkwaliteit. Bevat gezonde, vaste noesten en natuurlijke kleurvariaties (rode kern). Uitstekend voor structurele delen van meubels.' : 
                         lang === 'en' ? 'Cabinet quality. Contains healthy, tight knots and natural color variations (red heartwood). Excellent for furniture components.' :
                         lang === 'de' ? 'Möbelqualität. Enthält gesunde, feste Äste und natürliche Farbvariationen (roter Kern). Ausgezeichnet für Möbelteile.' :
                         'Calitate pentru mobilier. Conține noduri sănătoase, strânse și variații naturale de culoare (inimă roșie). Excelent pentru componente de mobilier.'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1.5px solid #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: 800, flexShrink: 0 }}>
                      <span style={{ margin: 'auto' }}>C</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                        {lang === 'nl' ? 'Klasse C (Constructief)' : (lang === 'en' ? 'Class C (Structural)' : (lang === 'de' ? 'Klasse C (Konstruktive Qualität)' : 'Clasa C (Calitate constructivă)'))}
                      </h4>
                      <Image src="/images/grade_c_beech.png" alt="Grade C Beechwood" width={400} height={110} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', margin: '0.5rem 0', border: '1px solid #e5e7eb' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                        {lang === 'nl' ? 'Constructiekwaliteit. Bevat grotere noesten en kleurverschillen. Wordt gebruikt voor onzichtbare binnenframes en verpakkingen.' : 
                         lang === 'en' ? 'Structural quality. Permits larger knots and variations. Perfect for internal framing, packaging, and non-visible components.' :
                         lang === 'de' ? 'Konstruktive Qualität. Erlaubt größere Äste und Farbvariationen. Ideal für unsichtbare Innenrahmen und Verpackungen.' :
                         'Calitate constructivă. Permite noduri și variații mai mari. Perfect pentru cadre interioare, ambalaje și componente ascunse.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: '1px solid #edf2f7', paddingBottom: '1.25rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(231, 177, 36, 0.1)', border: '1.5px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)', fontSize: '1.2rem', flexShrink: 0 }}>
                      <i className="fa-solid fa-temperature-high"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                        {lang === 'nl' ? 'Kamerdroog (KD 10-12%)' : (lang === 'en' ? 'Kiln-Dried (KD 10-12%)' : (lang === 'de' ? 'Kammergetrocknet (KD 10-12%)' : 'Uscat în Cameră (KD 10-12%)'))}
                      </h4>
                      <Image src="/images/kilns.jpg" alt="Kiln Drying Chambers" width={400} height={110} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', margin: '0.5rem 0', border: '1px solid #e5e7eb' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                        {lang === 'nl' ? 'Gecontroleerd gedroogd in moderne droogkamers. Vermindert de werking van het hout drastisch. Vereist voor binnentoepassingen en meubels.' : 
                         lang === 'en' ? 'Dried under computer control in modern drying chambers. Drastically reduces wood movement. Essential for interior joinery and furniture.' :
                         lang === 'de' ? 'Computergesteuert in modernen Trockenkammern getrocknet. Reduziert das Verziehen des Holzes drastisch. Erforderlich für Innenausbau und Möbel.' :
                         'Uscat sub control computerizat în camere moderne de uscare. Reduce drastic mișcarea lemnului. Esențial pentru tâmplărie interioară și mobilier.'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(74, 85, 104, 0.1)', border: '1.5px solid #4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568', fontSize: '1.2rem', flexShrink: 0 }}>
                      <i className="fa-solid fa-wind"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                        {lang === 'nl' ? 'Luchtdroog (AD)' : (lang === 'en' ? 'Air-Dried (AD)' : (lang === 'de' ? 'Luftgetrocknet (AD)' : 'Uscat Natural (AD)'))}
                      </h4>
                      <Image src="/images/air_drying_beech.png" alt="Air Drying Yard" width={400} height={110} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', margin: '0.5rem 0', border: '1px solid #e5e7eb' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>
                        {lang === 'nl' ? 'Gedroogd in de buitenlucht tot ca. 18-20% vochtgehalte. Ideaal voor buitenwerk of voor hout dat in een latere fase nog droging ondergaat.' : 
                         lang === 'en' ? 'Naturally air-dried in covered outdoor yards to 18-20% moisture. Suitable for outdoor construction or parts that will be dried later.' :
                         lang === 'de' ? 'Naturbelassen an der Luft auf 18-20% Feuchte getrocknet. Ideal für Außenanwendungen oder Holz, das später nachgetrocknet wird.' :
                         'Uscat natural în aer liber sub acoperiș la 18-20% umiditate. Potrivit pentru construcții exterioare sau piese care vor fi uscate mai târziu.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'right', backgroundColor: '#f8fafc' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setActiveTooltipModal(null)}
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', borderRadius: '4px' }}
              >
                {lang === 'nl' ? 'Begrepen' : (lang === 'en' ? 'Understood' : (lang === 'de' ? 'Verstanden' : 'Am înțeles'))}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
