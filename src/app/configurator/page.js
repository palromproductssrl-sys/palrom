/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';


// Configurator Sizing Rules
const categoryData = {
  sawn: {
    id: 'sawn',
    name: { nl: 'Gezaagd hout', en: 'Rough-sawn timber', de: 'Schnittholz', ro: 'Lemn tăiat' },
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 50, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 25, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Fijnbezaagd', en: 'Fine-sawn / Rough-sawn', de: 'Feinschnitt / Sägerau', ro: 'Tăiat brut' },
  },
  planed: {
    id: 'planed',
    name: { nl: 'Vierkant geschaafd (S4S)', en: 'Square planed (S4S)', de: 'Vierkant gehobelt (S4S)', ro: 'Rinduit pe patru fețe (S4S)' },
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 50, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 20, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Vierzijdig geschaafd (S4S)', en: 'Four-sides planed (S4S)', de: 'Vierseitig gehobelt (S4S)', ro: 'Rinduit pe patru fețe (S4S)' },
  },
  dowels: {
    id: 'dowels',
    name: { nl: 'Rond geschaafde stokken', en: 'Round planed sticks', de: 'Rund gehobelte Stäbe', ro: 'Tije rotunde rindeluite' },
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 3, max: 60, default: 10, label: { nl: 'Diameter (mm)', en: 'Diameter (mm)', de: 'Durchmesser (mm)', ro: 'Diametru (mm)' } },
    finish: { nl: 'Rond geschaafd', en: 'Round planed', de: 'Rund gehobelt', ro: 'Rinduit rotund' },
  },
  profiles: {
    id: 'profiles',
    name: { nl: 'Geschaafde plinten en profielen', en: 'Planed skirting & profiles', de: 'Gehobelte Leisten & Profile', ro: 'Plinte și profile rindeluite' },
    length: { min: 200, max: 3000, default: '1000-1400', label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 40, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 20, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Geprofileerd', en: 'Moulded/Profiled', de: 'Profiliert', ro: 'Profilat' },
  },
  specials: {
    id: 'specials',
    name: { nl: 'Specials', en: 'Specials', de: 'Spezialteile', ro: 'Speciale' },
    length: { min: 50, max: 3000, default: 500, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 40, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 5, max: 200, default: 20, label: { nl: 'Dikte (mm)', en: 'Thickness (mm)', de: 'Dicke (mm)', ro: 'Grosime (mm)' } },
    finish: { nl: 'Op specificatie', en: 'On custom specification', de: 'Nach Spezifikation', ro: 'Conform specificației' },
  },
};

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
  'Rough-sawn Blanks': 4.85,
};

// Subcategory data
const dowelSubcategories = [
  { id: 'dowel-small', name: { nl: 'Kleine deuvels (vanaf 3 mm)', en: 'Small Size (3 mm and up)', de: 'Kleine Dübel (ab 3 mm)', ro: 'Dibluri mici (de la 3 mm)' }, img: '/images/dowelssmall-1.jpg' },
  { id: 'dowel-medium-sticks', name: { nl: 'Kleine tot middelgrote deuvelstokken', en: 'Sticks Small to Medium', de: 'Dübelstäbe klein bis mittel', ro: 'Tije de dibluri mici spre medii' }, img: '/images/dowelsmedium.jpg' },
  { id: 'dowel-medium', name: { nl: 'Middelgrote deuvelstaven', en: 'Medium Size Dowel Rods', de: 'Mittlere Dübelstangen', ro: 'Tije de dibluri de dimensiuni medii' }, img: '/images/dowels-medium-2.jpg' },
  { id: 'dowel-big', name: { nl: 'Grote deuvelstaven (tot 60 mm)', en: 'Big Size (up to 60 mm)', de: 'Große Dübelstangen (bis 60 mm)', ro: 'Tije mari (până la 60 mm)' }, img: '/images/dowelsbig-300x300-1.jpg' },
  { id: 'dowel-rilled', name: { nl: 'Gegroefde deuvelpennen (6 tot 20 mm)', en: 'Spiral Rilled Pins (6 to 20 mm)', de: 'Spiralgeriffelte Dübelstifte (6 bis 20 mm)', ro: 'Dibluri canelate în spirală (6 la 20 mm)' }, img: '/images/dowelsrilled-300x300-1.jpg' },
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
  { id: 'planed-rect-v1', name: { nl: 'Geschaafd rechthoekig (V1)', en: 'Planed Rectangular (V1)', de: 'Gehobelt Rechteckig (V1)', ro: 'Rinduit Rectangular (V1)' }, img: '/images/4sides1.jpg' },
  { id: 'planed-rect-v2', name: { nl: 'Geschaafd rechthoekig (V2)', en: 'Planed Rectangular (V2)', de: 'Gehobelt Rechteckig (V2)', ro: 'Rinduit Rectangular (V2)' }, img: '/images/4sides2.jpg' },
  { id: 'planed-rect-v3', name: { nl: 'Geschaafd rechthoekig (V3)', en: 'Planed Rectangular (V3)', de: 'Gehobelt Rechteckig (V3)', ro: 'Rinduit Rectangular (V3)' }, img: '/images/4sides3.jpg' },
  { id: 'planed-rect-v4', name: { nl: 'Geschaafd rechthoekig (V4)', en: 'Planed Rectangular (V4)', de: 'Gehobelt Rechteckig (V4)', ro: 'Rinduit Rectangular (V4)' }, img: '/images/4sides4.jpg' },
  { id: 'planed-sq-v1', name: { nl: 'Geschaafd vierkant (V1)', en: 'Planed Square (V1)', de: 'Gehobelt Quadratisch (V1)', ro: 'Rinduit Pătrat (V1)' }, img: '/images/4sides5.jpg' },
  { id: 'planed-sq-v2', name: { nl: 'Geschaafd vierkant (V2)', en: 'Planed Square (V2)', de: 'Gehobelt Quadratisch (V2)', ro: 'Rinduit Pătrat (V2)' }, img: '/images/4sides6.jpg' },
  { id: 'planed-rad3', name: { nl: 'Geschaafd Radius 3', en: 'Planed Radius 3', de: 'Gehobelt Radius 3', ro: 'Rinduit Rază 3' }, img: '/images/4sides7.jpg' },
  { id: 'planed-rad6', name: { nl: 'Geschaafd Radius 6', en: 'Planed Radius 6', de: 'Gehobelt Radius 6', ro: 'Rinduit Rază 6' }, img: '/images/4sides8.jpg' },
];

const specialsSubcategories = [
  { id: 'special-keeplat-spruce', name: { nl: 'Vuren keeplat (spie)', en: 'Keeplat Spruce', de: 'Keilleiste Fichte', ro: 'Pană din Lemn de Molid' }, img: '/images/special1.jpg' },
  { id: 'special-keeplat-beech', name: { nl: 'Beuken keeplat (spie)', en: 'Keeplat Beech', de: 'Keilleiste Buche', ro: 'Pană din Lemn de Fag' }, img: '/images/special2.jpg' },
  { id: 'special-distancer-mix', name: { nl: 'Afstandhouders kleurenmix', en: 'Distancers Color Mix', de: 'Abstandhalter Farbmix', ro: 'Distanțiere Mix de Culori' }, img: '/images/special3.jpg' },
  { id: 'special-threshold', name: { nl: 'Componenten voedingsindustrie', en: 'Food industry components', de: 'Komponenten für Lebensmittelindustrie', ro: 'Componente pentru industria alimentară' }, img: '/images/special4.jpg' },
  { id: 'special-distancer-ind', name: { nl: 'Industriële afstandhouder', en: 'Industrial Distancer', de: 'Industrieller Abstandhalter', ro: 'Distanțier Industrial' }, img: '/images/special5.jpg' },
  { id: 'special-wood-iron', name: { nl: 'Gezaagde bestekken (fijnbezaagd)', en: 'Rough-sawn blanks (fine-sawn)', de: 'Sägerauhe Zuschnitte', ro: 'Piese brute netăiate' }, img: '/images/special6.jpg' },
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
  specialSubcatLabel: { nl: 'Subcategorie Bestekken *', en: 'Blanks Subcategory *', de: 'Zuschnitte Unterkategorie *', ro: 'Subcategorie Piese brute *' },
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
  fscLabelNonFsc: { nl: 'Geen FSC®', en: 'No FSC®', de: 'Kein FSC®', ro: 'Fără FSC®' }
};

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
  const minQty = Math.ceil(18.0 / areaPerPiece);
  return Math.max(500, minQty);
}

function formatEuro(val, decimals = 2) {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

const SHOW_PRICING = false;

export default function Configurator() {
  const { lang, addToCart, setIsCartOpen } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Configurator states
  const [category, setCategory] = useState('sawn');
  const [subCategoryDowels, setSubCategoryDowels] = useState('dowel-small');
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
  const [quantity, setQuantity] = useState(10000);

  const getValidationError = () => {
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
  const parsedLengthForMinQty = typeof length === 'string' && length.includes('-')
    ? parseInt(length.split('-')[1])
    : (parseInt(length) || 0);
  const minQty = lengthType === 'custom' ? getMinQuantityForCustom(category, parsedLengthForMinQty, diameter) : 500;
  const currentMaxWidth = category === 'planed' ? getPlanedMaxWidth(thickness) : categoryData[category]?.diameter?.max || 500;

  // Clamp diameter to currentMaxWidth if it exceeds it
  useEffect(() => {
    if (diameter > currentMaxWidth) {
      setDiameter(currentMaxWidth);
    }
  }, [currentMaxWidth, diameter]);

  // Enforce minQty when lengthType or dimensions change
  useEffect(() => {
    if (quantity < minQty) {
      setQuantity(minQty);
    }
  }, [minQty, quantity]);



  // Load session storage check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_configurator_auth') === 'true';
      setIsAuthenticated(auth);
    }
    setIsLoading(false);
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
        'special-threshold': 'Wooden Threshold',
        'special-distancer-ind': 'Industrial Distancer',
        'special-wood-iron': 'Wood with Iron Component',
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
        'dowel-small': 'Small Size (3 mm and up)',
        'dowel-medium-sticks': 'Sticks Small to Medium',
        'dowel-medium': 'Medium Size Dowel Rods',
        'dowel-big': 'Big Size (up to 60 mm)',
        'dowel-rilled': 'Spiral Rilled Pins (6 to 20 mm)',
      };
      subcatName = names[specificSubcat || subCategoryDowels] || 'Small Size (3 mm and up)';
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
    }

    // Apply grade factor
    let gradeFactor = 1.0;
    if (itemGrade === 'B') gradeFactor = 0.9;
    else if (itemGrade === 'C') gradeFactor = 0.7;

    // Apply drying factor
    const dryingFactor = itemDrying === 'luchtdroog' ? 0.95 : 1.0;

    // Apply custom length overhead factor
    const lenTypeFactor = lenType === 'custom' ? 1.15 : 1.0;

    unitPrice = unitPrice * gradeFactor * dryingFactor * lenTypeFactor;

    let discountPercent = 0;
    if (qtyVal >= 100000) {
      discountPercent = 15;
    } else if (qtyVal >= 50000) {
      discountPercent = 10;
    } else if (qtyVal >= 10000) {
      discountPercent = 5;
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
      qtyText: `${quantity.toLocaleString(lang === 'nl' ? 'nl-NL' : 'en-US')} ${getTranslation('pieces')}`,
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
      steamed
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
      dims = `Ø ${item.diameter} mm x ${lengthStr}`;
    }

    return {
      ...item,
      grade: item.grade || 'A',
      lengthType: item.lengthType || 'standard',
      fsc: item.fsc !== undefined ? item.fsc : true,
      productName: subName,
      dimensions: dims,
      qtyText: `${item.quantity.toLocaleString(l === 'nl' ? 'nl-NL' : 'en-US')} ${t['pieces']?.[l] || t['pieces']?.nl}`,
      qtyVal: item.quantity,
      finish: data.finish[l] || data.finish.nl,
      price: details.totalPrice,
      unitPrice: details.unitPrice,
      discountPercent: details.discountPercent,
    };
  };

  const activeSelection = getActiveSelectionDetails();

  const handleAddConfiguration = () => {
    const rawItem = {
      category,
      subCategory: category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : category === 'planed' ? subCategoryPlaned : '',
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
    // Open the sidebar cart
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '15rem 0', textAlign: 'center', background: '#f8fafc', color: '#1e293b' }}>
        <h3>{getTranslation('loading')}</h3>
      </div>
    );
  }


  // Not authenticated? Show passcode gate
  if (!isAuthenticated) {
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
            <h2>{getTranslation('portalTitle')}</h2>
            <p>
              {getTranslation('portalLead')}
            </p>
            <form onSubmit={handlePasswordSubmit}>
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
                  {getTranslation('passwordLabel')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="authPassword"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={getTranslation('showPasswordAria')}
                  >
                    <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>
                {authError && (
                  <div className="error-message">
                    <i className="fa-solid fa-triangle-exclamation"></i> {getTranslation('passwordError')}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%' }}>
                {getTranslation('unlockButton')} <i className="fa-solid fa-key icon-right"></i>
              </button>
            </form>
          </div>
        </div>
      </>
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
          <div className="configurator-dashboard-container">
            <form onSubmit={handleFormSubmit} className="configurator-dashboard-form">
              <h2 className="dashboard-title">{getTranslation('heroTitle')}</h2>

              {/* Wizard fields */}
              <div className="dashboard-controls-grid">
                <div className="control-group" id="controlGroupCategory">
                  <label htmlFor="dbCategory">{getTranslation('categoryLabel')}</label>
                  <select
                    id="dbCategory"
                    className="dashboard-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="sawn">{categoryData.sawn.name[lang] || categoryData.sawn.name.nl}</option>
                    <option value="planed">{categoryData.planed.name[lang] || categoryData.planed.name.nl}</option>
                    <option value="dowels">{categoryData.dowels.name[lang] || categoryData.dowels.name.nl}</option>
                    <option value="profiles">{categoryData.profiles.name[lang] || categoryData.profiles.name.nl}</option>
                    <option value="specials">{categoryData.specials.name[lang] || categoryData.specials.name.nl}</option>
                  </select>
                </div>

                {/* Subcategory: Dowels */}
                {category === 'dowels' && (
                  <div className="control-group" id="controlGroupSubCategoryDowels">
                    <label>{getTranslation('dowelSubcatLabel')}</label>
                    <div className="dowels-subcat-grid">
                      {dowelSubcategories.map((d) => (
                        <label key={d.id} className="dowels-subcat-card">
                          <input
                            type="radio"
                            name="subCategoryDowels"
                            value={d.id}
                            checked={subCategoryDowels === d.id}
                            onChange={() => setSubCategoryDowels(d.id)}
                          />
                          <div className="card-content">
                            <img src={d.img} alt="" className="card-bg-image" />
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
                        <label key={p.id} className="planed-subcat-card">
                          <input
                            type="radio"
                            name="subCategoryPlaned"
                            value={p.id}
                            checked={subCategoryPlaned === p.id}
                            onChange={() => setSubCategoryPlaned(p.id)}
                          />
                          <div className="card-content">
                            <img src={p.img} alt="" className="card-bg-image" />
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
                        <label key={p.id} className="profiles-subcat-card">
                          <input
                            type="radio"
                            name="subCategoryProfiles"
                            value={p.id}
                            checked={subCategoryProfiles === p.id}
                            onChange={() => setSubCategoryProfiles(p.id)}
                          />
                          <div className="card-content">
                            <img src={p.img} alt="" className="card-bg-image" />
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
                        <label key={s.id} className="specials-subcat-card">
                          <input
                            type="radio"
                            name="subCategorySpecials"
                            value={s.id}
                            checked={subCategorySpecials === s.id}
                            onChange={() => setSubCategorySpecials(s.id)}
                          />
                          <div className="card-content">
                            <img src={s.img} alt="" className="card-bg-image" />
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

                {/* Houtsoort */}
                <div className="control-group">
                  <label htmlFor="dbWoodType">{lang === 'nl' ? 'Houtsoort' : 'Wood species'}</label>
                  <select id="dbWoodType" className="dashboard-select" value={woodType} disabled={true}>
                    <option value="beech">{lang === 'nl' ? 'Beuken' : 'Beechwood'}</option>
                  </select>
                </div>

                {/* Gestoomd */}
                <div className="control-group">
                  <label htmlFor="dbSteamed">{lang === 'nl' ? 'Gestoomd' : 'Steamed'}</label>
                  <select id="dbSteamed" className="dashboard-select" value={steamed} disabled={true}>
                    <option value="no">{lang === 'nl' ? 'Nee' : 'No'}</option>
                  </select>
                </div>

                {/* Droging */}
                <div className="control-group">
                  <label htmlFor="dbDrying">{lang === 'nl' ? 'Droging' : 'Drying'}</label>
                  <select
                    id="dbDrying"
                    className="dashboard-select"
                    value={drying}
                    disabled={category !== 'sawn' && category !== 'specials'}
                    onChange={(e) => setDrying(e.target.value)}
                  >
                    <option value="kd">{lang === 'nl' ? 'Kamerdroog (KD 10-12%)' : 'Chamber-dried (KD 10-12%)'}</option>
                    {(category === 'sawn' || category === 'specials') && (
                      <option value="luchtdroog">{lang === 'nl' ? 'Luchtdroog' : 'Air-dried'}</option>
                    )}
                  </select>
                </div>

                {/* Certificering */}
                <div className="control-group">
                  <label htmlFor="dbFsc">{lang === 'nl' ? 'Certificering' : 'Certification'}</label>
                  <select
                    id="dbFsc"
                    className="dashboard-select"
                    value={fsc ? 'yes' : 'no'}
                    onChange={(e) => setFsc(e.target.value === 'yes')}
                  >
                    <option value="yes">{lang === 'nl' ? 'FSC®-Gecertificeerd' : 'FSC®-Certified'}</option>
                    <option value="no">{lang === 'nl' ? 'Geen FSC®' : 'No FSC®'}</option>
                  </select>
                </div>

                {/* Kwaliteit */}
                <div className="control-group" id="controlGroupGrade">
                  <label htmlFor="dbGrade">{getTranslation('gradeLabel')}</label>
                  <select
                    id="dbGrade"
                    className="dashboard-select"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <option value="A">
                      {lang === 'nl' ? 'A = foutvrij, egaal van kleur' : 'A = defect-free, uniform color'}
                    </option>
                    <option value="B">
                      {lang === 'nl' ? 'B = foutvrij, gezond kleurverschil toegestaan' : 'B = defect-free, healthy color difference allowed'}
                    </option>
                    {(category === 'sawn' || category === 'specials') && (
                      <option value="C">
                        {lang === 'nl' ? 'C = constructieve kwaliteit' : 'C = structural quality'}
                      </option>
                    )}
                  </select>
                </div>

                {/* Dikte / Diameter */}
                {categoryData[category]?.thickness && (
                  <div className="control-group">
                    <label htmlFor="dbThickness">
                      {lang === 'nl' ? 'Dikte (mm)' : 'Thickness (mm)'}
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
                <div className="control-group">
                  <label htmlFor="dbDiameter">
                    {category === 'dowels'
                      ? (lang === 'nl' ? 'Diameter (mm)' : 'Diameter (mm)')
                      : (lang === 'nl' ? 'Breedte (mm)' : 'Width (mm)')}
                  </label>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      className="dashboard-slider"
                      min={categoryData[category]?.diameter?.min || 5}
                      max={category === 'dowels' ? 60 : currentMaxWidth}
                      value={diameter || (categoryData[category]?.diameter?.min || 5)}
                      onChange={(e) => setDiameter(parseInt(e.target.value) || (categoryData[category]?.diameter?.min || 5))}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        id="dbDiameter"
                        className="slider-value-display"
                        min={categoryData[category]?.diameter?.min || 5}
                        max={category === 'dowels' ? 60 : currentMaxWidth}
                        value={diameter}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setDiameter(isNaN(val) ? '' : val);
                        }}
                        onBlur={() => {
                          const minVal = categoryData[category]?.diameter?.min || 5;
                          const maxVal = category === 'dowels' ? 60 : currentMaxWidth;
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

                {/* Lengte */}
                <div className="control-group">
                  <label htmlFor="dbLength">
                    {lang === 'nl' ? 'Lengte (mm)' : 'Length (mm)'}
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

                {/* Aanvullende informatie */}
                <div className="control-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="dbAdditionalInfo">{lang === 'nl' ? 'Aanvullende informatie' : 'Additional information'}</label>
                  <textarea
                    id="dbAdditionalInfo"
                    className="dashboard-input"
                    rows="2"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder={lang === 'nl' ? 'Bijvoorbeeld schaaftoleranties of specifieke verpakkingseisen...' : 'For example planing tolerances or specific packaging requirements...'}
                    style={{ resize: 'vertical', width: '100%', minHeight: '60px' }}
                  />
                </div>

                {/* Quantity */}
                <div className="control-group">
                  <label htmlFor="dbOplage">{getTranslation('quantityLabel')}</label>
                  <input
                    type="number"
                    id="dbOplage"
                    className="dashboard-input"
                    value={quantity}
                    min={minQty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setQuantity(isNaN(val) ? '' : val);
                    }}
                    onBlur={() => {
                      if (quantity === '' || quantity < minQty) {
                        setQuantity(minQty);
                      }
                    }}
                    style={{ outline: 'none' }}
                  />
                  {lengthType === 'custom' && (
                    <div style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '0.5rem' }}>
                      <i className="fa-solid fa-circle-info"></i>{' '}
                      {getTranslation('moqNotice').replace('{minQty}', minQty.toLocaleString())}
                    </div>
                  )}
                </div>
              </div>


              {/* Summary Table */}
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>{getTranslation('configDetailCol')}</th>
                      <th>{getTranslation('yourSelectionCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{getTranslation('productRow')}</td>
                      <td>{activeSelection.productName}</td>
                    </tr>
                    <tr>
                      <td>{getTranslation('dimensionsRow')}</td>
                      <td>{activeSelection.dimensions}</td>
                    </tr>
                    <tr>
                      <td>{getTranslation('quantityRow')}</td>
                      <td>{activeSelection.qtyText}</td>
                    </tr>
                    <tr>
                      <td>{lang === 'nl' ? 'Houtsoort' : 'Wood species'}</td>
                      <td>{lang === 'nl' ? 'Beuken' : 'Beechwood'}</td>
                    </tr>
                    <tr>
                      <td>{lang === 'nl' ? 'Gestoomd' : 'Steamed'}</td>
                      <td>{lang === 'nl' ? 'Nee (Ongestoomd)' : 'No (Unsteamed)'}</td>
                    </tr>
                    <tr>
                      <td>{lang === 'nl' ? 'Droging' : 'Drying'}</td>
                      <td>
                        {activeSelection.drying === 'luchtdroog'
                          ? (lang === 'nl' ? 'Luchtdroog' : 'Air-dried')
                          : (lang === 'nl' ? 'Kamerdroog (KD 10-12%)' : 'Chamber-dried (KD 10-12%)')}
                      </td>
                    </tr>
                    <tr>
                      <td>{getTranslation('fscRow')}</td>
                      <td>
                        {activeSelection.fsc ? getTranslation('yes') : getTranslation('no')}
                      </td>
                    </tr>
                    <tr>
                      <td>{getTranslation('gradeRow')}</td>
                      <td>
                        {activeSelection.grade === 'A'
                          ? (lang === 'nl' ? 'A (foutvrij, egaal van kleur)' : 'A (defect-free, uniform color)')
                          : activeSelection.grade === 'B'
                          ? (lang === 'nl' ? 'B (foutvrij, gezond kleurverschil toegestaan)' : 'B (defect-free, healthy color difference allowed)')
                          : activeSelection.grade === 'C'
                          ? (lang === 'nl' ? 'C (constructieve kwaliteit)' : 'C (structural quality)')
                          : activeSelection.grade}
                      </td>
                    </tr>
                    <tr>
                      <td>{getTranslation('finishRow')}</td>
                      <td>{activeSelection.finish}</td>
                    </tr>
                    {activeSelection.additionalInfo && (
                      <tr>
                        <td>{lang === 'nl' ? 'Aanvullende informatie' : 'Additional information'}</td>
                        <td style={{ fontStyle: 'italic', color: '#ffd700' }}>{activeSelection.additionalInfo}</td>
                      </tr>
                    )}
                    {SHOW_PRICING && (
                      <>
                        <tr>
                          <td>{getTranslation('targetPricePerPiece')}</td>
                          <td>€ {formatEuro(activeSelection.unitPrice, 4)}</td>
                        </tr>
                        <tr>
                          <td>{getTranslation('volumeDiscountRow')}</td>
                          <td>
                            {activeSelection.discountPercent > 0 ? (
                              <span
                                className="discount-badge"
                                style={{
                                  background: 'rgba(231,177,36,0.15)',
                                  color: 'var(--color-primary-dark)',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: 'var(--border-radius-sm)',
                                  fontWeight: 600,
                                }}
                              >
                                {activeSelection.discountPercent}% {getTranslation('volumeDiscountText')}
                              </span>
                            ) : (
                              getTranslation('noDiscount')
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>{getTranslation('totalTargetPriceRow')}</td>
                          <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                            € {formatEuro(activeSelection.price)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {validationError && (
                <div
                  className="validation-error-box"
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #ef4444',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem',
                    marginBottom: '1.5rem',
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

              {/* Status Bar */}
              <div className="dashboard-status-bar">
                <div className="status-col">
                  <span className="status-label">{getTranslation('certificationLabel')}</span>
                  <span className="status-value">{activeSelection.fsc ? getTranslation('materialValueFsc') : getTranslation('materialValueNonFsc')}</span>
                </div>
                <div className="status-col">
                  <span className="status-label">{getTranslation('statusLabel')}</span>
                  <span className="status-value status-ready">{getTranslation('statusReady')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="dashboard-submit-btn"
                disabled={!!validationError}
                style={validationError ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {getTranslation('submitInquiryButton')}
              </button>
            </form>


          </div>
        </div>
      </section>
    </>
  );
}
