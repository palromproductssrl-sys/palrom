'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';


// Configurator Sizing Rules
const categoryData = {
  pluggen: {
    id: 'pluggen',
    name: { nl: 'Beuken Pluggen', en: 'Beech Plugs', de: 'Buchenholzdübel-Pins', ro: 'Dibluri Mici din Fag' },
    length: { min: 30, max: 3000, default: 500, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 3, max: 60, default: 20, label: { nl: 'Diameter (mm)', en: 'Diameter (mm)', de: 'Durchmesser (mm)', ro: 'Diametru (mm)' } },
    finish: { nl: 'Industrieel geschuurd', en: 'Industrially sanded', de: 'Industriell geschliffen', ro: 'Șlefuit industrial' },
  },
  dowels: {
    id: 'dowels',
    name: { nl: 'Beukenhouten Dowels & Staven', en: 'Beechwood Dowels & Rods', de: 'Buchenholzdübel & -stäbe', ro: 'Dibluri și Tije din Lemn de Fag' },
    length: { min: 30, max: 3000, default: 1000, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 3, max: 60, default: 10, label: { nl: 'Diameter (mm)', en: 'Diameter (mm)', de: 'Durchmesser (mm)', ro: 'Diametru (mm)' } },
    finish: { nl: 'Gladgeschaafd', en: 'Smooth planed', de: 'Glatt gehobelt', ro: 'Rinduit neted' },
  },
  planed: {
    id: 'planed',
    name: { nl: '4-Zijdig Geschaafd Beukenhout', en: '4-Sides Planed Beech Lumber', de: '4-seitig gehobeltes Buchenholz', ro: 'Lemn de Fag Rinduit pe 4 Fețe' },
    length: { min: 100, max: 4000, default: 2400, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 15, max: 300, default: 50, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    thickness: { min: 10, max: 100, default: 20, label: { nl: 'Dikte/Hoogte (mm)', en: 'Thickness/Height (mm)', de: 'Dicke/Höhe (mm)', ro: 'Grosime/Înălțime (mm)' } },
    finish: { nl: 'Vierzijdig geschaafd', en: 'Four-sides planed', de: 'Vierseitig gehobelt', ro: 'Rinduit pe patru fețe' },
  },
  profiles: {
    id: 'profiles',
    name: { nl: 'Houten Profielen & Lijsten', en: 'Profiles & Mouldings', de: 'Profile & Leisten', ro: 'Profile & Șipci Decorative' },
    length: { min: 500, max: 3000, default: 2000, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 10, max: 120, default: 18, label: { nl: 'Afmeting (mm)', en: 'Dimension (mm)', de: 'Abmessung (mm)', ro: 'Dimensiune (mm)' } },
    finish: { nl: 'Geprofileerd', en: 'Moulded/Profiled', de: 'Profiliert', ro: 'Profilat' },
  },
  specials: {
    id: 'specials',
    name: { nl: 'Speciale Houtcomponenten', en: 'Special Wood Components', de: 'Spezielle Holzkomponenten', ro: 'Componente Speciale din Lemn' },
    length: { min: 50, max: 2000, default: 500, label: { nl: 'Lengte (mm)', en: 'Length (mm)', de: 'Länge (mm)', ro: 'Lungime (mm)' } },
    diameter: { min: 5, max: 500, default: 40, label: { nl: 'Breedte (mm)', en: 'Width (mm)', de: 'Breite (mm)', ro: 'Lățime (mm)' } },
    finish: { nl: 'Op specificatie', en: 'On custom specification', de: 'Nach Spezifikation', ro: 'Conform specificației' },
  },
};

// Specials prices
const specialsPrices = {
  'Keeplat Spruce': 1.25,
  'Keeplat Beech': 1.55,
  'Distancers Color Mix': 0.85,
  'Wooden Threshold': 3.55,
  'Industrial Distancer': 2.15,
  'Wood with Iron Component': 4.85,
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
  { id: 'special-threshold', name: { nl: 'Houten drempel', en: 'Wooden Threshold', de: 'Holzschwelle', ro: 'Prag din Lemn' }, img: '/images/special4.jpg' },
  { id: 'special-distancer-ind', name: { nl: 'Industriële afstandhouder', en: 'Industrial Distancer', de: 'Industrieller Abstandhalter', ro: 'Distanțier Industrial' }, img: '/images/special5.jpg' },
  { id: 'special-wood-iron', name: { nl: 'Hout met ijzeren component', en: 'Wood with Iron Component', de: 'Holz mit Eisenkomponente', ro: 'Lemn cu Componentă din Fier' }, img: '/images/special6.jpg' },
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
  dowelSubcatLabel: { nl: 'Subcategorie Dowels *', en: 'Dowels Subcategory *', de: 'Dübel Unterkategorie *', ro: 'Subcategorie Dibluri *' },
  profileSubcatLabel: { nl: 'Subcategorie Profiel *', en: 'Profile Subcategory *', de: 'Profil Unterkategorie *', ro: 'Subcategorie Profil *' },
  planedSubcatLabel: { nl: 'Subcategorie Geschaafd *', en: 'Planed Subcategory *', de: 'Gehobelt Unterkategorie *', ro: 'Subcategorie Rinduit *' },
  specialSubcatLabel: { nl: 'Subcategorie Specials *', en: 'Specials Subcategory *', de: 'Spezialkomponenten Unterkategorie *', ro: 'Subcategorie Speciale *' },
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
  submitInquiryButton: { nl: 'Vraag Direct Offerte Aan', en: 'Request Quote Direct', de: 'Direkt Angebot anfordern', ro: 'Solicită Ofertă Direct' },
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
  submitError: { nl: 'Er is een fout opgetreden bij het verwerken van uw aanvraag. Probeer het opnieuw.', en: 'An error occurred while processing your request. Please try again.', de: 'Bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', ro: 'A apărut o eroare la procesarea solicitării dvs. Vă rugăm să încercați din nou.' },
  removeItemAria: { nl: 'Verwijder product', en: 'Remove product', de: 'Produkt entfernen', ro: 'Elimină produsul' },
  materialValue: { nl: '100% FSC®-Gecertificeerd Beukenhout', en: '100% FSC®-Certified Beechwood', de: '100% FSC®-zertifiziertes Buchenholz', ro: 'Lemn de Fag 100% Certificat FSC®' },
  statusReady: { nl: 'Gereed', en: 'Ready', de: 'Bereit', ro: 'Pregătit' },
  showPasswordAria: { nl: 'Wachtwoord tonen', en: 'Show password', de: 'Passwort anzeigen', ro: 'Afișează parola' }
};

function formatEuro(val, decimals = 2) {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}


export default function Configurator() {
  const { lang } = useInquiry();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Configurator states
  const [category, setCategory] = useState('pluggen');
  const [subCategoryDowels, setSubCategoryDowels] = useState('dowel-small');
  const [subCategoryProfiles, setSubCategoryProfiles] = useState('profile-semiround');
  const [subCategorySpecials, setSubCategorySpecials] = useState('special-keeplat-spruce');
  const [subCategoryPlaned, setSubCategoryPlaned] = useState('planed-rect-v1');
  
  const [length, setLength] = useState(500);
  const [diameter, setDiameter] = useState(20);
  const [thickness, setThickness] = useState(20);
  const [quantity, setQuantity] = useState(10000);

  // Combined configurations state (holds raw properties for on-the-fly language rendering)
  const [configuredItems, setConfiguredItems] = useState([]);

  // Modals state
  const [showCombineModal, setShowCombineModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Contact form details
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket success details
  const [ticketNum, setTicketNum] = useState('');
  const [successItems, setSuccessItems] = useState([]);

  // Load session storage check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_configurator_auth') === 'true';
      setIsAuthenticated(auth);
    }
    setIsLoading(false);
  }, []);

  // Sync sliders default when category changes
  useEffect(() => {
    const data = categoryData[category];
    if (data) {
      setLength(data.length.default);
      setDiameter(data.diameter.default);
      if (data.thickness) {
        setThickness(data.thickness.default);
      }
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
  const calculatePriceDetails = (cat, len, diam, thick, qtyVal, specificSubcat) => {
    let unitPrice = 0.0;
    let subcatName = '';

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

    if (cat === 'pluggen' || cat === 'dowels') {
      const baseLength = 40.0;
      const baseDiameter = 8.0;
      const basePrice = 0.03;

      const lengthFactor = len / baseLength;
      const diameterFactor = Math.pow(diam / baseDiameter, 2);

      unitPrice = basePrice * lengthFactor * diameterFactor;
      if (unitPrice < 0.01) unitPrice = 0.01;
    } else if (cat === 'planed') {
      const volumeDm3 = (len * diam * thick) / 1000000.0;
      unitPrice = 1.65 * volumeDm3;
      if (unitPrice < 0.25) unitPrice = 0.25;
    } else if (cat === 'profiles') {
      const lengthM = len / 1000.0;
      const widthFactor = diam / 50.0;
      unitPrice = 0.95 * lengthM * widthFactor;
      if (unitPrice < 0.20) unitPrice = 0.20;
    } else if (cat === 'specials') {
      const basePrice = specialsPrices[subcatName] || 1.25;
      const lengthFactor = len / 500.0;
      unitPrice = basePrice * lengthFactor;
      if (unitPrice < 0.35) unitPrice = 0.35;
    }

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
    
    // Clamp values within category limits
    const finalLength = Math.max(data.length.min, Math.min(data.length.max, parseInt(length) || data.length.default));
    const finalDiameter = Math.max(data.diameter.min, Math.min(data.diameter.max, parseInt(diameter) || data.diameter.default));
    const finalThickness = data.thickness
      ? Math.max(data.thickness.min, Math.min(data.thickness.max, parseInt(thickness) || data.thickness.default))
      : thickness;

    const currentSubcat = category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : category === 'planed' ? subCategoryPlaned : '';
    const details = calculatePriceDetails(category, finalLength, finalDiameter, finalThickness, quantity, currentSubcat);
    
    let subName = data.name[lang] || data.name.nl;
    if (details.subcatName) {
      let locSubName = details.subcatName;
      if (category === 'dowels') {
        const item = dowelSubcategories.find(d => d.id === currentSubcat);
        if (item) locSubName = item.name[lang] || item.name.nl;
      } else if (category === 'profiles') {
        const item = profileSubcategories.find(p => p.id === currentSubcat);
        if (item) locSubName = item.name[lang] || item.name.nl;
      } else if (category === 'specials') {
        const item = specialsSubcategories.find(s => s.id === currentSubcat);
        if (item) locSubName = item.name[lang] || item.name.nl;
      } else if (category === 'planed') {
        const item = planedSubcategories.find(p => p.id === currentSubcat);
        if (item) locSubName = item.name[lang] || item.name.nl;
      }
      subName = `${data.name[lang] || data.name.nl} - ${locSubName}`;
    }

    let dims = `${finalLength}mm x ${finalDiameter}mm`;
    if (category === 'planed') {
      dims = `${finalThickness}mm x ${finalDiameter}mm x ${finalLength}mm`;
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
    };
  };

  // Helper to translate/format configured raw item dynamically
  const localizeItem = (item, l) => {
    if (!item.category) return item;
    const data = categoryData[item.category];
    if (!data) return item;

    const details = calculatePriceDetails(item.category, item.length, item.diameter, item.thickness, item.quantity, item.subCategory);

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

    let dims = `${item.length}mm x ${item.diameter}mm`;
    if (item.category === 'planed') {
      dims = `${item.thickness}mm x ${item.diameter}mm x ${item.length}mm`;
    }

    return {
      ...item,
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
      length: Math.max(categoryData[category].length.min, Math.min(categoryData[category].length.max, parseInt(length) || categoryData[category].length.default)),
      diameter: Math.max(categoryData[category].diameter.min, Math.min(categoryData[category].diameter.max, parseInt(diameter) || categoryData[category].diameter.default)),
      thickness: categoryData[category].thickness
        ? Math.max(categoryData[category].thickness.min, Math.min(categoryData[category].thickness.max, parseInt(thickness) || categoryData[category].thickness.default))
        : thickness,
      quantity,
    };
    setConfiguredItems((prev) => [...prev, rawItem]);

    // Reset configurator fields
    const data = categoryData[category];
    setLength(data.length.default);
    setDiameter(data.diameter.default);
    if (data.thickness) {
      setThickness(data.thickness.default);
    }
  };

  const handleRemoveItem = (index) => {
    setConfiguredItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowCombineModal(true);
  };

  const handleConfigureAnother = () => {
    handleAddConfiguration();
    setShowCombineModal(false);
  };

  const handleFinishAndSubmit = () => {
    const currentItem = {
      category,
      subCategory: category === 'dowels' ? subCategoryDowels : category === 'profiles' ? subCategoryProfiles : category === 'specials' ? subCategorySpecials : '',
      length: Math.max(categoryData[category].length.min, Math.min(categoryData[category].length.max, parseInt(length) || categoryData[category].length.default)),
      diameter: Math.max(categoryData[category].diameter.min, Math.min(categoryData[category].diameter.max, parseInt(diameter) || categoryData[category].diameter.default)),
      thickness: categoryData[category].thickness
        ? Math.max(categoryData[category].thickness.min, Math.min(categoryData[category].thickness.max, parseInt(thickness) || categoryData[category].thickness.default))
        : thickness,
      quantity,
    };
    setConfiguredItems((prev) => {
      const updated = [...prev, currentItem];
      setSuccessItems(updated);
      return updated;
    });

    setShowCombineModal(false);
    setShowContactModal(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientCompany.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      alert(getTranslation('contactAlert'));
      return;
    }

    setIsSubmitting(true);

    try {
      // API request to Next.js API route
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${clientName} (${clientCompany})`,
          clientEmail,
          clientPhone,
          clientNotes: clientNotes,
          items: successItems.map((item) => {
            const locItem = localizeItem(item, lang);
            return {
              name: locItem.productName,
              category: locItem.productName.split(' - ')[0],
              qty: locItem.qtyVal,
              grade: 'grade_a', // default
              dims: locItem.dimensions,
              notes: `Finish: ${locItem.finish}, Richtprijs: € ${formatEuro(locItem.price)}`,
            };
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Database inquiry recording failed.');
      }

      const resData = await response.json();
      
      const randomTicket = 'PLR-2026-' + Math.floor(10000 + Math.random() * 90000);
      setTicketNum(randomTicket);
      
      setShowContactModal(false);
      setShowSuccessOverlay(true);
    } catch (err) {
      console.error(err);
      alert(getTranslation('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setConfiguredItems([]);
    setSuccessItems([]);
    setCategory('pluggen');
    setClientName('');
    setClientCompany('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
    setShowSuccessOverlay(false);
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

  // Cumulative total price for rendering
  let cumulativeTotal = 0;
  configuredItems.forEach((x) => {
    const loc = localizeItem(x, lang);
    cumulativeTotal += loc.price;
  });

  // Success total price for rendering
  let successTotal = 0;
  successItems.forEach((x) => {
    const loc = localizeItem(x, lang);
    successTotal += loc.price;
  });

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
                <div className="control-group">
                  <label htmlFor="dbCategory">{getTranslation('categoryLabel')}</label>
                  <select
                    id="dbCategory"
                    className="dashboard-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="pluggen">{categoryData.pluggen.name[lang] || categoryData.pluggen.name.nl}</option>
                    <option value="dowels">{categoryData.dowels.name[lang] || categoryData.dowels.name.nl}</option>
                    <option value="planed">{categoryData.planed.name[lang] || categoryData.planed.name.nl}</option>
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
                            <div className="card-icon">
                              <img src={d.img} alt={d.name[lang] || d.name.nl} />
                            </div>
                            <span className="card-label">{d.name[lang] || d.name.nl}</span>
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
                      {planedSubcategories.map((p) => {
                        const svgMap = {
                          'planed-rect-v1': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,46 L 30,50 L 54,38 L 34,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 30,56 L 30,50 L 54,38 L 54,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,52 L 30,56 L 30,50 L 10,46 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-rect-v2': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,46 L 30,50 L 54,38 L 34,34 Z" fill="#ffedd5" stroke="#b45309" strokeWidth="2.0" strokeLinejoin="round" />
                              <path d="M 30,56 L 30,50 L 54,38 L 54,44 Z" fill="#d97706" stroke="#b45309" strokeWidth="2.0" strokeLinejoin="round" />
                              <path d="M 10,52 L 30,56 L 30,50 L 10,46 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2.0" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-rect-v3': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,49 L 34,52 L 54,40 L 30,37 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 34,56 L 34,52 L 54,40 L 54,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,53 L 34,56 L 34,52 L 10,49 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-rect-v4': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,42 L 30,46 L 54,34 L 34,30 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 30,48 L 30,42 L 54,34 L 54,40 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 10,48 L 30,52 L 54,40 L 34,36 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 30,54 L 30,48 L 54,40 L 54,46 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-sq-v1': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 15,38 L 30,41 L 49,32 L 34,29 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 30,56 L 30,41 L 49,32 L 49,47 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 15,53 L 30,56 L 30,41 L 15,38 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-sq-v2': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 15,38 L 30,41 L 49,32 L 34,29 Z" fill="#ffedd5" stroke="#b45309" strokeWidth="2.0" strokeLinejoin="round" />
                              <path d="M 30,56 L 30,41 L 49,32 L 49,47 Z" fill="#d97706" stroke="#b45309" strokeWidth="2.0" strokeLinejoin="round" />
                              <path d="M 15,53 L 30,56 L 30,41 L 15,38 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2.0" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-rad3': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,48 C 10,44 14,46 30,50 L 54,38 L 34,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 30,56 L 30,50 L 54,38 L 54,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,52 L 30,56 L 30,50 C 14,46 10,44 10,52 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'planed-rad6': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,48 C 10,40 16,44 30,50 L 54,38 L 34,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 30,56 L 30,50 L 54,38 L 54,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,52 L 30,56 L 30,50 C 16,44 10,40 10,52 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        };
                        return (
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
                                <div className="card-icon">{svgMap[p.id]}</div>
                                <span className="card-label">{p.name[lang] || p.name.nl}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subcategory: Profiles */}
                {category === 'profiles' && (
                  <div className="control-group" id="controlGroupSubCategoryProfiles">
                    <label>{getTranslation('profileSubcatLabel')}</label>
                    <div className="profiles-subcat-grid">
                      {profileSubcategories.map((p) => {
                        const svgMap = {
                          'profile-semiround': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,48 C 10,38 26,46 26,56 L 50,32 C 50,22 34,14 34,24 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 C 26,46 10,38 10,48 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-strip': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,49 L 26,52 L 50,40 L 34,37 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,56 L 26,52 L 50,40 L 50,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,53 L 26,56 L 26,52 L 10,49 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-finish-v1': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 22,54 L 26,56 L 50,44 L 46,42 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 C 16,44 18,50 22,54 L 46,42 C 42,38 40,32 38,26 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 C 16,44 18,50 22,54 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-quarter-v1': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 C 22,38 26,46 26,56 L 50,44 C 50,34 46,26 34,24 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 C 22,38 26,46 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-finish-v2': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,41 L 18,43 L 42,31 L 38,29 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 18,46 L 22,48 L 46,36 L 42,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 22,51 L 26,53 L 50,41 L 46,39 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 14,41 L 38,29 L 38,26 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 18,43 L 18,46 L 42,34 L 42,31 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 22,48 L 22,51 L 46,39 L 46,36 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,53 L 26,56 L 50,44 L 50,41 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 L 14,41 L 18,43 L 18,46 L 22,48 L 22,51 L 26,53 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-plinth-v1': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 16,57 L 16,39 L 46,24 L 46,42 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 16,39 C 16,36 13,36 13,38 L 10,39.5 L 40,24.5 L 43,23 C 43,21 46,21 46,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,54 L 16,57 L 16,39 C 16,36 13,36 13,38 L 10,39.5 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-corner-v1': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 34,24 L 34,36 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 14,46 L 38,34 L 38,26 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,46 L 26,52 L 50,40 L 38,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,52 L 26,56 L 50,44 L 50,40 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 L 14,46 L 26,52 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-corner-v2': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 12,36 C 10,38 10,44 12,48 L 36,36 C 34,32 34,26 36,24 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 14,46 L 38,34 L 38,26 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,46 L 26,52 L 50,40 L 38,34 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,52 L 26,56 L 50,44 L 50,40 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 12,48 C 10,44 10,38 12,36 L 15,38 L 14,44 L 26,50 L 26,54 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-triangular': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,48 L 10,36 L 34,24 L 34,36 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,56 L 50,44 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-quarter-v2': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 13,37.5 C 21,41.5 24,49.5 24,53 L 48,41 C 48,37.5 45,29.5 37,25.5 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 13,37.5 L 37,25.5 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 24,53 L 26,56 L 50,44 L 48,41 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 13,37.5 C 21,41.5 24,49.5 24,53 L 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-thread': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 L 38,26" stroke="#c2410c" strokeWidth="1.2" />
                              <path d="M 18,40 L 42,28" stroke="#c2410c" strokeWidth="1.2" />
                              <path d="M 22,42 L 46,30" stroke="#c2410c" strokeWidth="1.2" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'profile-calbat': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 10,36 L 14,38 L 38,26 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,38 C 18,46 22,52 26,56 L 50,44 C 46,40 42,34 38,26 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 10,36 L 14,38 C 18,46 22,52 26,56 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        };
                        return (
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
                                <div className="card-icon">{svgMap[p.id]}</div>
                                <span className="card-label">{p.name[lang] || p.name.nl}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subcategory: Specials */}
                {category === 'specials' && (
                  <div className="control-group" id="controlGroupSubCategorySpecials">
                    <label>{getTranslation('specialSubcatLabel')}</label>
                    <div className="specials-subcat-grid">
                      {specialsSubcategories.map((s) => {
                        const svgMap = {
                          'special-keeplat-spruce': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 15,38.5 L 15,43.5 L 39,31.5 L 39,26.5 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 15,43.5 L 21,46.5 L 45,34.5 L 39,31.5 Z" fill="#ca8a04" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 15,38.5 L 39,26.5 L 34,24 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 21,41.5 L 26,44 L 50,32 L 45,29.5 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 26,44 L 21,41.5 L 21,46.5 L 15,43.5 L 15,38.5 L 10,36 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'special-keeplat-beech': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'special-distancer-mix': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 44,41 L 54,36 L 54,26 L 44,31 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 34,26 L 44,31 L 54,26 L 44,21 Z" fill="#f87171" stroke="#991b1b" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 34,36 L 44,41 L 44,31 L 34,26 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 32,46 L 42,41 L 42,31 L 32,36 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 22,31 L 32,36 L 42,31 L 32,26 Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 22,41 L 32,46 L 32,36 L 22,31 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 20,51 L 30,46 L 30,36 L 20,41 Z" fill="#059669" stroke="#065f46" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 10,36 L 20,41 L 30,36 L 20,31 Z" fill="#34d399" stroke="#065f46" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 10,46 L 20,51 L 20,41 L 10,36 Z" fill="#10b981" stroke="#065f46" strokeWidth="1.2" strokeLinejoin="round" />
                            </svg>
                          ),
                          'special-threshold': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 30,60 L 30,55 L 50,45 L 50,50 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 26,51 L 30,55 L 50,45 L 46,41 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 14,45 L 26,51 L 46,41 L 34,35 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,47 L 14,45 L 34,35 L 30,37 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,50 L 30,60 L 30,55 L 26,51 L 14,45 L 10,47 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                          'special-distancer-ind': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <ellipse cx="18" cy="46" rx="3.5" ry="4.5" fill="#451a03" stroke="#c2410c" strokeWidth="1" />
                            </svg>
                          ),
                          'special-wood-iron': (
                            <svg viewBox="0 0 64 64" fill="none">
                              <path d="M 26,56 L 26,44 L 50,32 L 50,44 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 10,36 L 26,44 L 50,32 L 34,24 Z" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M 20,35 L 28,39 L 40,33 L 32,29 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M 28,34 L 28,26 L 32,24 L 32,32 Z" fill="#64748b" stroke="#475569" strokeWidth="1" strokeLinejoin="round" />
                              <ellipse cx="30" cy="24" rx="2" ry="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                              <path d="M 10,48 L 26,56 L 26,44 L 10,36 Z" fill="#f8a170" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          ),
                        };
                        return (
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
                                <div className="card-icon">{svgMap[s.id]}</div>
                                <span className="card-label">{s.name[lang] || s.name.nl}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sizing: Length */}
                <div className="control-group">
                  <div className="slider-header">
                    <label htmlFor="dbLength">{categoryData[category].length.label[lang] || categoryData[category].length.label.nl}</label>
                  </div>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      id="dbLength"
                      min={categoryData[category].length.min}
                      max={categoryData[category].length.max}
                      value={length || categoryData[category].length.min}
                      className="dashboard-slider"
                      onChange={(e) => setLength(parseInt(e.target.value) || '')}
                    />
                    <input
                      type="number"
                      className="slider-value-display"
                      value={length}
                      min={categoryData[category].length.min}
                      max={categoryData[category].length.max}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setLength(isNaN(val) ? '' : val);
                      }}
                      onBlur={() => {
                        const min = categoryData[category].length.min;
                        const max = categoryData[category].length.max;
                        if (length === '' || length < min) setLength(min);
                        else if (length > max) setLength(max);
                      }}
                      style={{ textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Sizing: Width / Diameter */}
                <div className="control-group">
                  <div className="slider-header">
                    <label htmlFor="dbDiameter">{categoryData[category].diameter.label[lang] || categoryData[category].diameter.label.nl}</label>
                  </div>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      id="dbDiameter"
                      min={categoryData[category].diameter.min}
                      max={categoryData[category].diameter.max}
                      value={diameter || categoryData[category].diameter.min}
                      className="dashboard-slider"
                      onChange={(e) => setDiameter(parseInt(e.target.value) || '')}
                    />
                    <input
                      type="number"
                      className="slider-value-display"
                      value={diameter}
                      min={categoryData[category].diameter.min}
                      max={categoryData[category].diameter.max}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setDiameter(isNaN(val) ? '' : val);
                      }}
                      onBlur={() => {
                        const min = categoryData[category].diameter.min;
                        const max = categoryData[category].diameter.max;
                        if (diameter === '' || diameter < min) setDiameter(min);
                        else if (diameter > max) setDiameter(max);
                      }}
                      style={{ textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Sizing: Thickness (conditional) */}
                {categoryData[category].thickness && (
                  <div className="control-group" id="controlGroupThickness">
                    <div className="slider-header">
                      <label htmlFor="dbThickness">{categoryData[category].thickness.label[lang] || categoryData[category].thickness.label.nl}</label>
                    </div>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        id="dbThickness"
                        min={categoryData[category].thickness.min}
                        max={categoryData[category].thickness.max}
                        value={thickness || categoryData[category].thickness.min}
                        className="dashboard-slider"
                        onChange={(e) => setThickness(parseInt(e.target.value) || '')}
                      />
                      <input
                        type="number"
                        className="slider-value-display"
                        value={thickness}
                        min={categoryData[category].thickness.min}
                        max={categoryData[category].thickness.max}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setThickness(isNaN(val) ? '' : val);
                        }}
                        onBlur={() => {
                          const min = categoryData[category].thickness.min;
                          const max = categoryData[category].thickness.max;
                          if (thickness === '' || thickness < min) setThickness(min);
                          else if (thickness > max) setThickness(max);
                        }}
                        style={{ textAlign: 'center', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="control-group">
                  <label htmlFor="dbOplage">{getTranslation('quantityLabel')}</label>
                  <select
                    id="dbOplage"
                    className="dashboard-select"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  >
                    <option value="500">500 {getTranslation('pieces')}</option>
                    <option value="1000">{(1000).toLocaleString(lang === 'en' ? 'en-US' : 'nl-NL')} {getTranslation('pieces')}</option>
                    <option value="5000">{(5000).toLocaleString(lang === 'en' ? 'en-US' : 'nl-NL')} {getTranslation('pieces')}</option>
                    <option value="10000">{(10000).toLocaleString(lang === 'en' ? 'en-US' : 'nl-NL')} {getTranslation('pieces')}</option>
                    <option value="25000">{(25000).toLocaleString(lang === 'en' ? 'en-US' : 'nl-NL')} {getTranslation('pieces')}</option>
                    <option value="50000">{(50000).toLocaleString(lang === 'en' ? 'en-US' : 'nl-NL')} {getTranslation('pieces')}</option>
                    <option value="100000">{(100000).toLocaleString(lang === 'en' ? 'en-US' : 'nl-NL')} {getTranslation('pieces')}</option>
                  </select>
                </div>
              </div>

              {/* Added Configurations List Block */}
              {configuredItems.length > 0 && (
                <div className="control-group" style={{ gridColumn: 'span 2', marginBottom: '2rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    {getTranslation('addedConfigsTitle')}
                  </label>
                  <div className="configured-items-list">
                    {configuredItems.map((rawItem, idx) => {
                      const item = localizeItem(rawItem, lang);
                      return (
                        <div className="configured-item-row" key={idx}>
                          <div>
                            <span className="item-info">{item.productName}</span>
                            <span className="item-specs">
                              ({item.dimensions} | {item.finish} | {item.qtyText} | € {formatEuro(item.price)})
                            </span>
                          </div>
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() => handleRemoveItem(idx)}
                            aria-label={getTranslation('removeItemAria')}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    <span>{getTranslation('totalCumulativePrice')}</span>
                    <span style={{ color: 'var(--color-primary-dark)' }}>
                      € {formatEuro(cumulativeTotal)}
                    </span>
                  </div>
                </div>
              )}

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
                      <td>{getTranslation('materialRow')}</td>
                      <td>
                        <span className="material-leaf">🌿</span> {getTranslation('materialValue')}
                      </td>
                    </tr>
                    <tr>
                      <td>{getTranslation('finishRow')}</td>
                      <td>{activeSelection.finish}</td>
                    </tr>
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
                  </tbody>
                </table>
              </div>

              {/* Status Bar */}
              <div className="dashboard-status-bar">
                <div className="status-col">
                  <span className="status-label">{getTranslation('certificationLabel')}</span>
                  <span className="status-value">{getTranslation('materialValue')}</span>
                </div>
                <div className="status-col">
                  <span className="status-label">{getTranslation('statusLabel')}</span>
                  <span className="status-value status-ready">{getTranslation('statusReady')}</span>
                </div>
              </div>

              <button type="submit" className="dashboard-submit-btn">
                {getTranslation('submitInquiryButton')}
              </button>
            </form>

            {/* Success Overlay view */}
            {showSuccessOverlay && (
              <div className="configurator-success-overlay" id="configuratorSuccessOverlay">
                <div className="success-card dark-success-card">
                  <div className="success-icon-circle">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h2>{getTranslation('successTitle')}</h2>
                  <p className="success-lead">
                    {getTranslation('successLead')}
                  </p>

                  <div className="ticket-summary-box dark-ticket-box">
                    <div className="ticket-header">
                      <span>{getTranslation('ticketHeader')}</span>
                      <strong>{ticketNum}</strong>
                    </div>
                    <div className="ticket-body">
                      <p
                        className="ticket-status-label"
                        style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', fontSize: '1.05rem' }}
                      >
                        {getTranslation('ticketBodyLead')}
                      </p>
                      <ul
                        style={{
                          listStyle: 'none',
                          paddingLeft: 0,
                          marginBottom: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.50rem',
                          color: '#f8fafc',
                        }}
                      >
                        {successItems.map((rawItem, idx) => {
                          const item = localizeItem(rawItem, lang);
                          return (
                            <li
                              key={idx}
                              style={{
                                padding: '0.5rem 0',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div>
                                <strong>{item.productName}</strong>
                                <br />
                                <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                                  {getTranslation('dimensionsRow')}: {item.dimensions} | {getTranslation('finishRow')}: {item.finish} | {getTranslation('quantityRow')}:{' '}
                                  {item.qtyText}
                                </span>
                              </div>
                              <strong style={{ whiteSpace: 'nowrap', color: 'var(--color-primary)' }}>
                                € {formatEuro(item.price)}
                              </strong>
                            </li>
                          );
                        })}
                      </ul>
                      <div
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.15)',
                          paddingTop: '1rem',
                          marginBottom: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '1.1rem',
                          color: '#ffffff',
                        }}
                      >
                        <strong>{getTranslation('successTotalLabel')}</strong>
                        <strong style={{ color: 'var(--color-primary)' }}>
                          € {formatEuro(successTotal)}
                        </strong>
                      </div>
                      <ul style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', listStyle: 'none', paddingLeft: 0, color: '#f8fafc' }}>
                        <li>
                          <strong>{getTranslation('successCompanyLabel')}</strong> <span>{clientCompany}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="success-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        alert(
                          getTranslation('downloadSheetAlert')
                        )
                      }
                    >
                      <i className="fa-solid fa-file-pdf icon-left"></i> {getTranslation('downloadSheetButton')}
                    </button>
                    <button className="btn btn-secondary" onClick={handleRestart}>
                      {getTranslation('configureAnotherButton')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Combine Request Prompt Modal */}
            {showCombineModal && (
              <div className="dashboard-modal-overlay" onClick={() => setShowCombineModal(false)}>
                <div
                  className="dashboard-modal-card text-center"
                  style={{ maxWidth: '500px', padding: '3rem 2.5rem' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowCombineModal(false)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <i
                    className="fa-solid fa-folder-plus"
                    style={{
                      fontSize: '3.5rem',
                      color: 'var(--color-primary)',
                      marginBottom: '1.5rem',
                      display: 'block',
                    }}
                  ></i>
                  <h3>{getTranslation('combineTitle')}</h3>
                  <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                    {getTranslation('combineLead')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      type="button"
                      className="dashboard-modal-submit-btn"
                      style={{
                        marginTop: 0,
                        backgroundColor: '#ffffff',
                        color: 'var(--color-text-dark)',
                        border: '2px solid var(--color-primary)',
                      }}
                      onClick={handleConfigureAnother}
                    >
                      <i className="fa-solid fa-plus icon-left"></i> {getTranslation('combineYesBtn')}
                    </button>
                    <button
                      type="button"
                      className="dashboard-modal-submit-btn"
                      style={{ marginTop: 0 }}
                      onClick={handleFinishAndSubmit}
                    >
                      {getTranslation('combineNoBtn')} <i className="fa-solid fa-chevron-right icon-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* B2B Contact Details Form Modal */}
            {showContactModal && (
              <div className="dashboard-modal-overlay" onClick={() => setShowContactModal(false)}>
                <div className="dashboard-modal-card" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowContactModal(false)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <h3>{getTranslation('contactTitle')}</h3>
                  <p>
                    {getTranslation('contactLead')}
                  </p>

                  <form onSubmit={handleInquirySubmit} className="dashboard-modal-form">
                    <div className="form-group-db">
                      <label htmlFor="dbName">{getTranslation('contactNameLabel')}</label>
                      <input
                        type="text"
                        id="dbName"
                        required
                        placeholder={getTranslation('contactNamePlaceholder')}
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbCompany">{getTranslation('contactCompanyLabel')}</label>
                      <input
                        type="text"
                        id="dbCompany"
                        required
                        placeholder={getTranslation('contactCompanyPlaceholder')}
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbEmail">{getTranslation('contactEmailLabel')}</label>
                      <input
                        type="email"
                        id="dbEmail"
                        required
                        placeholder={getTranslation('contactEmailPlaceholder')}
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbPhone">{getTranslation('contactPhoneLabel')}</label>
                      <input
                        type="tel"
                        id="dbPhone"
                        required
                        placeholder={getTranslation('contactPhonePlaceholder')}
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group-db">
                      <label htmlFor="dbNotes">{getTranslation('contactNotesLabel')}</label>
                      <textarea
                        id="dbNotes"
                        rows="3"
                        placeholder={getTranslation('contactNotesPlaceholder')}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="dashboard-modal-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin icon-left"></i> {getTranslation('submittingText')}
                        </>
                      ) : (
                        <>
                          {getTranslation('submitButtonText')} <i className="fa-solid fa-paper-plane icon-right"></i>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
