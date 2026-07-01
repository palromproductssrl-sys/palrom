'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';
import { version as packageVersion } from '../../../../package.json';

const t = {
  portalTitle: { nl: 'PALROM Website Console', en: 'PALROM Website Console', ro: 'Consolă Website PALROM' },
  authRequired: { 
    nl: 'Verificatie vereist voor het beheer van vacatures en nieuwsberichten.', 
    en: 'Authentication required to manage vacancies and news articles.', 
    ro: 'Autentificare necesară pentru gestionarea locurilor de muncă și a știrilor.' 
  },
  invalidPasscode: { nl: 'Ongeldige toegangscode. Probeer het opnieuw.', en: 'Invalid passcode. Please try again.', ro: 'Cod de acces nevalid. Vă rugăm să încercați din nou.' },
  adminPasscode: { nl: 'Beheerder Toegangscode', en: 'Admin Passcode', ro: 'Cod de Acces Administrator' },
  placeholderPasscode: { nl: 'Voer de toegangscode in', en: 'Enter administrator passcode', ro: 'Introduceți codul de acces' },
  authenticate: { nl: 'Aanmelden', en: 'Authenticate', ro: 'Autentificare' },
  verifying: { nl: 'Controleren...', en: 'Verifying...', ro: 'Se verifică...' },
  
  // Dashboard Header
  consoleTitle: { nl: 'Beheersconsole Website', en: 'Website Management Console', ro: 'Consolă Administrare Website' },
  viewLive: { nl: 'Bekijk Live Site', en: 'View Live Site', ro: 'Vezi Site-ul Live' },
  logout: { nl: 'Uitloggen', en: 'Logout', ro: 'Deconectare' },
  syncDbBtn: { nl: 'Sync Database', en: 'Sync Database', ro: 'Sincronizare DB' },
  exportDbBtn: { nl: 'Export naar Lokaal', en: 'Export to Local', ro: 'Export în Local' },
  exportConfirm: { nl: 'Weet u zeker dat u de lokale bestanden wilt overschrijven met de gegevens uit de live database?', en: 'Are you sure you want to overwrite local JSON files with data from the live database?', ro: 'Sigur doriți să suprascrieți fișierele JSON locale cu datele din baza de date live?' },
  exportSuccess: { nl: 'Lokale bestanden succesvol bijgewerkt!', en: 'Local files successfully updated!', ro: 'Fișierele locale au fost actualizate cu succes!' },
  exportError: { nl: 'Fout bij het exporteren van de database.', en: 'Failed to export database.', ro: 'Eroare la exportul bazei de date.' },
  
  // Tabs
  vacanciesTab: { nl: 'Vacatures', en: 'Vacancies', ro: 'Locuri de muncă' },
  newsTab: { nl: 'Nieuws & Updates', en: 'News & Articles', ro: 'Știri și Noutăți' },
  statsTab: { nl: 'Statistieken', en: 'Statistics', ro: 'Statistici' },
  quotesTab: { nl: 'Offertes', en: 'B2B Quotes', ro: 'Cereri de Ofertă' },
  
  // Vacancies Table
  activeOpenings: { nl: 'Actieve Vacatures', en: 'Active Career Openings', ro: 'Locuri de Muncă Active' },
  addVacancy: { nl: 'Vacature Toevoegen', en: 'Add Vacancy', ro: 'Adaugă Job' },
  noVacancies: { nl: 'Geen actieve vacatures gevonden. Klik op "Vacature Toevoegen" om er een te maken.', en: 'No active openings found. Click "Add Vacancy" to create one.', ro: 'Nu au fost găsite locuri de muncă active. Faceți clic pe "Adaugă Job" pentru a crea unul.' },
  idCode: { nl: 'ID / Code', en: 'ID / Code', ro: 'ID / Cod' },
  titleCol: { nl: 'Titel', en: 'Title', ro: 'Titlu' },
  departmentCol: { nl: 'Afdeling', en: 'Department', ro: 'Departament' },
  typeCol: { nl: 'Type', en: 'Type', ro: 'Tip' },
  actionsCol: { nl: 'Acties', en: 'Actions', ro: 'Acțiuni' },
  editBtn: { nl: 'Bewerken', en: 'Edit', ro: 'Editează' },
  deleteBtn: { nl: 'Verwijderen', en: 'Delete', ro: 'Șterge' },
  
  // News Table
  publishedNews: { nl: 'Gepubliceerd Nieuws & Updates', en: 'Published News & Updates', ro: 'Știri și Noutăți Publicate' },
  addArticle: { nl: 'Artikel Toevoegen', en: 'Add Article', ro: 'Adaugă Articol' },
  noNews: { nl: 'Geen nieuwsartikelen gevonden. Klik op "Artikel Toevoegen" om er een te publiceren.', en: 'No news articles found. Click "Add Article" to publish one.', ro: 'Nu au fost găsite articole de știri. Faceți clic pe "Adaugă Articol" pentru a publica unul.' },
  thumbnail: { nl: 'Miniatuur', en: 'Thumbnail', ro: 'Miniatură' },
  tagDate: { nl: 'Tag / Datum', en: 'Tag / Date', ro: 'Etichetă / Dată' },
  authorCol: { nl: 'Auteur', en: 'Author', ro: 'Autor' },
  targetLink: { nl: 'Doel Link', en: 'Target Link', ro: 'Link Destinație' },
  targeting: { nl: 'Doelgroep', en: 'Targeting', ro: 'Targetare' },
  romaniaOnly: { nl: 'Alleen Roemenië', en: 'Romania Only', ro: 'Doar România' },
  globalTarget: { nl: 'Wereldwijd', en: 'Global', ro: 'Global' },
  
  // Modals
  editVacancyTitle: { nl: 'Vacature Bewerken', en: 'Edit Vacancy', ro: 'Editează Locul de Muncă' },
  addNewVacancyTitle: { nl: 'Nieuwe Vacature Toevoegen', en: 'Add New Vacancy', ro: 'Adaugă un Nou Loc de Muncă' },
  editNewsTitle: { nl: 'Nieuwsartikel Bewerken', en: 'Edit News Article', ro: 'Editează Articolul de Știri' },
  addNewNewsTitle: { nl: 'Nieuw Artikel Toevoegen', en: 'Add New News Article', ro: 'Adaugă un Nou Articol' },
  translatingLabel: { nl: 'Vertalen:', en: 'Translating:', ro: 'Se traduce:' },
  autoTranslateBtn: { nl: 'Automatisch vertalen naar alle tabbladen', en: 'Auto-translate to all tabs', ro: 'Traducere automată în toate taburile' },
  translatingStatus: { nl: 'Vertalen...', en: 'Translating...', ro: 'Se traduce...' },
  cancelBtn: { nl: 'Annuleren', en: 'Cancel', ro: 'Anulează' },
  saveVacancyBtn: { nl: 'Vacature Opslaan', en: 'Save Vacancy', ro: 'Salvează Jobul' },
  savingStatus: { nl: 'Opslaan...', en: 'Saving...', ro: 'Se salvează...' },
  publishArticleBtn: { nl: 'Artikel Publiceren', en: 'Publish Article', ro: 'Publică Articolul' },
  publishingStatus: { nl: 'Publiceren...', en: 'Publishing...', ro: 'Se publică...' },
  
  // Vacancy Fields
  localizedInfo: { nl: 'Gelokaliseerde Info', en: 'Localized Info', ro: 'Informații Localizate' },
  jobTitleLabel: { nl: 'Functietitel', en: 'Job Title', ro: 'Titlul Jobului' },
  departmentLabel: { nl: 'Afdeling', en: 'Department', ro: 'Departament' },
  jobTypeLabel: { nl: 'Dienstverband', en: 'Job Type', ro: 'Tip Job' },
  salaryLabel: { nl: 'Salarisindicatie', en: 'Salary Rate', ro: 'Salariul' },
  descriptionLabel: { nl: 'Omschrijving', en: 'Description', ro: 'Descriere' },
  requirementsLabel: { nl: 'Functie-eisen Lijst', en: 'Job Requirements List', ro: 'Lista de Cerințe a Jobului' },
  newReqPlaceholder: { nl: 'Voeg nieuwe eis toe...', en: 'Add new requirement line...', ro: 'Adaugă o nouă cerință...' },
  addReqBtn: { nl: 'Toevoegen', en: 'Add', ro: 'Adaugă' },
  locationLabel: { nl: 'Fabriek Locatie (Globaal)', en: 'Factory Location (Global)', ro: 'Locație Fabrică (Global)' },
  identifierLabel: { nl: 'Unieke Identifier / Slug (Globaal)', en: 'Custom Identifier / Slug (Global)', ro: 'Identificator Unic / Slug (Global)' },
  slugNote: { nl: 'Automatisch gegenereerd indien leeg', en: 'Auto-generated if empty', ro: 'Generat automat dacă este gol' },
  
  // News Fields
  articleTitleLabel: { nl: 'Titel van het Artikel', en: 'Article Title', ro: 'Titlul Articolului' },
  categoryTagLabel: { nl: 'Categorie Etikette (Tag)', en: 'Category Tag', ro: 'Etichetă Categorie' },
  displayDateLabel: { nl: 'Weergavedatum', en: 'Display Date', ro: 'Data Afișată' },
  articleContentLabel: { nl: 'Inhoud van het Artikel', en: 'Article Content', ro: 'Conținutul Articolului' },
  redirectLinkLabel: { nl: 'Knop Link Tekst', en: 'Redirect Link Text', ro: 'Text Link Buton' },
  authorLabel: { nl: 'Auteur (Globaal)', en: 'Author (Global)', ro: 'Autor (Global)' },
  redirectUrlLabel: { nl: 'Link Doorverwijzings-URL (Globaal)', en: 'Link Redirect URL (Global)', ro: 'URL Redirecționare Buton (Global)' },
  imageLabel: { nl: 'Artikel Afbeelding (Globaal)', en: 'Article Image (Global)', ro: 'Imagine Articol (Global)' },
  uploadImageBtn: { nl: 'Upload Nieuw Afbeelding Bestand', en: 'Upload New Image File', ro: 'Încarcă un Fișier de Imagine Nou' },
  uploadingStatus: { nl: 'Uploaden...', en: 'Uploading...', ro: 'Se încarcă...' },
  romaniaOnlyCheckbox: { nl: 'Beperk artikel alleen tot Roemeense gebruikers', en: 'Limit article to Romanian users only', ro: 'Limitează articolul doar la utilizatorii din România' }
};

export default function AdminPortal() {
  const { lang } = useInquiry();
  const [consoleLang, setConsoleLang] = useState('en');

  useEffect(() => {
    if (lang && ['nl', 'en', 'ro'].includes(lang)) {
      setConsoleLang(lang);
    }
  }, [lang]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard Tabs: 'vacancies', 'news', or 'stats'
  const [activeTab, setActiveTab] = useState('vacancies');

  // Database lists
  const [vacancies, setVacancies] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Statistics
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  // Alerts
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', text: '' }

  // Modals for editing/creating
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('vacancy'); // 'vacancy' or 'newsItem'
  const [editingId, setEditingId] = useState(null); // null means adding a new item

  // Multilingual input tab inside editor: 'nl' | 'en' | 'de' | 'ro'
  const [activeFormLang, setActiveFormLang] = useState('nl');
  const [isTranslating, setIsTranslating] = useState(false);

  // --- Form States for Vacancy ---
  const [vacId, setVacId] = useState('');
  const [vacTitle, setVacTitle] = useState({ nl: '', en: '', de: '', ro: '' });
  const [vacDept, setVacDept] = useState({ nl: '', en: '', de: '', ro: '' });
  const [vacLoc, setVacLoc] = useState('Brad, RO');
  const [vacType, setVacType] = useState({ nl: 'Fulltime', en: 'Full-Time', de: 'Vollzeit', ro: 'Normă Întreagă' });
  const [vacDesc, setVacDesc] = useState({ nl: '', en: '', de: '', ro: '' });
  const [vacSalary, setVacSalary] = useState({ nl: '', en: '', de: '', ro: '' });
  
  // Requirements are arrays of strings per language
  const [vacReqs, setVacReqs] = useState({ nl: [], en: [], de: [], ro: [] });
  const [newReqText, setNewReqText] = useState({ nl: '', en: '', de: '', ro: '' });

  // --- Form States for News Item ---
  const [newsId, setNewsId] = useState('');
  const [newsTag, setNewsTag] = useState({ nl: '', en: '', de: '', ro: '' });
  const [newsDate, setNewsDate] = useState({ nl: '', en: '', de: '', ro: '' });
  const [newsAuthor, setNewsAuthor] = useState('PALROM Team');
  const [newsTitle, setNewsTitle] = useState({ nl: '', en: '', de: '', ro: '' });
  const [newsContent, setNewsContent] = useState({ nl: '', en: '', de: '', ro: '' });
  const [newsLinkUrl, setNewsLinkUrl] = useState('');
  const [newsLinkText, setNewsLinkText] = useState({ nl: '', en: '', de: '', ro: '' });
  const [newsImage, setNewsImage] = useState('/images/hero_bg.jpg');
  const [newsIsRomOnly, setNewsIsRomOnly] = useState(false);

  // File Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Load session from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('palrom_admin_auth') === 'true';
      setIsAuthenticated(auth);
      if (auth) {
        const storedPasscode = sessionStorage.getItem('palrom_admin_passcode');
        if (storedPasscode) {
          setPasscode(storedPasscode);
          loadDatabase(storedPasscode).then((success) => {
            if (!success) {
              sessionStorage.removeItem('palrom_admin_auth');
              sessionStorage.removeItem('palrom_admin_passcode');
              setIsAuthenticated(false);
              setPasscode('');
            }
          });
        }
      }
    }
    setIsLoading(false);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    setPasscode(cleanPass);
    // Verify passcode by attempting a test fetch to load data
    setLoadingData(true);
    setAuthError(false);
    loadDatabase(cleanPass)
      .then((success) => {
        if (success) {
          sessionStorage.setItem('palrom_admin_auth', 'true');
          sessionStorage.setItem('palrom_admin_passcode', cleanPass);
          setIsAuthenticated(true);
        } else {
          setAuthError(true);
          sessionStorage.removeItem('palrom_admin_auth');
          sessionStorage.removeItem('palrom_admin_passcode');
        }
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('palrom_admin_auth');
    sessionStorage.removeItem('palrom_admin_passcode');
    setIsAuthenticated(false);
    setPasscode('');
    setVacancies([]);
    setNewsItems([]);
  };

  const loadStats = async (authPasscode) => {
    setStatsLoading(true);
    setStatsError(null);
    const cleanPass = (authPasscode || passcode || (typeof window !== 'undefined' ? sessionStorage.getItem('palrom_admin_passcode') : '') || '').trim();
    if (!cleanPass) {
      setStatsError('No passcode available');
      setStatsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/telemetry', {
        headers: {
          'x-admin-passcode': cleanPass
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setDbStatus(data.dbStatus || { connected: false, type: 'checking' });
      } else {
        setStatsError(data.error || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setStatsError('Network error when fetching stats');
    } finally {
      setStatsLoading(false);
    }
  };

  const loadDatabase = async (authPasscode) => {
    const cleanPass = (authPasscode || passcode || (typeof window !== 'undefined' ? sessionStorage.getItem('palrom_admin_passcode') : '') || '').trim();
    if (!cleanPass) {
      return false;
    }
    try {
      // Fetch vacancies
      const vRes = await fetch('/api/vacancies');
      const vData = await vRes.json();

      // Fetch news
      const nRes = await fetch('/api/news');
      const nData = await nRes.json();

      // Fetch quotes
      let quotesData = [];
      try {
        const qRes = await fetch('/api/portal/admin/inquiries', {
          headers: { 'x-admin-passcode': cleanPass }
        });
        if (qRes.status === 401) {
          return false;
        }
        const qData = await qRes.json();
        if (qRes.ok && qData.success) {
          quotesData = qData.inquiries || [];
        }
      } catch (qErr) {
        console.error('Failed to load quotes:', qErr);
      }

      // Load stats as well if activeTab is 'stats'
      if (activeTab === 'stats') {
        loadStats(cleanPass);
      } else {
        // Just pre-fetch stats in background so switching is instant
        fetch('/api/telemetry', { headers: { 'x-admin-passcode': cleanPass } })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setStats(data.stats);
              setDbStatus(data.dbStatus || { connected: false, type: 'checking' });
            }
          })
          .catch(() => {});
      }

      if (vRes.ok && nRes.ok) {
        setVacancies(vData.vacancies || []);
        setNewsItems(nData.news || []);
        setQuotes(quotesData);
        return true;
      }
    } catch (err) {
      console.error('Failed to load database:', err);
    }
    return false;
  };

  const showMessage = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const handleDownloadCSV = (quote) => {
    const escapeCSV = (val) => {
      if (val === undefined || val === null) return '';
      let str = String(val);
      str = str.replace(/"/g, '""');
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str}"`;
      }
      return str;
    };

    const csvRows = [
      ["B2B Quote Inquiry Details", ""].map(escapeCSV).join(','),
      ["Inquiry ID", quote.id].map(escapeCSV).join(','),
      ["Client Name", quote.client_name].map(escapeCSV).join(','),
      ["Client Email", quote.client_email].map(escapeCSV).join(','),
      ["Client Phone", quote.client_phone].map(escapeCSV).join(','),
      ["Client Notes", quote.client_notes || ''].map(escapeCSV).join(','),
      ["Date Submitted", new Date(quote.created_at).toLocaleString()].map(escapeCSV).join(','),
      ["Status", quote.status || 'New'].map(escapeCSV).join(','),
      ["", ""].map(escapeCSV).join(','),
      ["Product Index", "Product Name", "Category", "Quantity", "Dimensions", "Radius", "Grade", "Certification (FSC)", "Drying", "Product Notes"].map(escapeCSV).join(',')
    ];

    (quote.items || []).forEach((item, index) => {
      let dimsText = item.dims || '';
      if (!dimsText) {
        if (item.categoryKey === 'brichete' || item.category === 'brichete') {
          dimsText = '90mm x 90mm x 250mm';
        } else {
          const lVal = item.length || '';
          const dVal = item.diameter || item.width || '';
          const tVal = item.thickness || '';
          dimsText = tVal ? `${tVal}x${dVal}x${lVal} mm` : `${dVal}x${lVal} mm`;
        }
      }

      const row = [
        `Product ${index + 1}`,
        item.name || '',
        item.category || '',
        item.qty || '',
        dimsText,
        item.radius || '',
        localizeSpecValue('grade', item.grade, 'en', item.categoryKey) || '',
        localizeSpecValue('fsc', item.fsc, 'en', item.categoryKey) || '',
        localizeSpecValue('drying', item.drying, 'en', item.categoryKey) || '',
        item.additionalInfo || ''
      ];
      csvRows.push(row.map(escapeCSV).join(','));
    });

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const safeClientName = (quote.client_name || 'Client').replace(/\s+/g, '_');
    link.setAttribute("download", `Inquiry_${safeClientName}_${quote.id.substring(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  // --- Image Upload Handler ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB) and type
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image file is too large (max 5MB)');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-passcode': passcode.trim()
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewsImage(data.url);
        showMessage('success', 'Image uploaded successfully!');
      } else {
        showMessage('error', data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error during upload');
    } finally {
      setUploadingImage(false);
    }
  };
  // --- CRUD Functions for Vacancy ---
  const openVacancyEdit = (vac = null) => {
    setModalType('vacancy');
    setActiveFormLang('nl');
    if (vac) {
      setEditingId(vac.id);
      setVacId(vac.id);
      setVacTitle({
        nl: vac.title?.nl || '',
        en: vac.title?.en || '',
        de: vac.title?.de || '',
        ro: vac.title?.ro || ''
      });
      setVacDept({
        nl: vac.department?.nl || '',
        en: vac.department?.en || '',
        de: vac.department?.de || '',
        ro: vac.department?.ro || ''
      });
      setVacLoc(vac.location || 'Brad, RO');
      setVacType({
        nl: vac.type?.nl || '',
        en: vac.type?.en || '',
        de: vac.type?.de || '',
        ro: vac.type?.ro || ''
      });
      setVacDesc({
        nl: vac.description?.nl || '',
        en: vac.description?.en || '',
        de: vac.description?.de || '',
        ro: vac.description?.ro || ''
      });
      setVacSalary({
        nl: vac.salary?.nl || '',
        en: vac.salary?.en || '',
        de: vac.salary?.de || '',
        ro: vac.salary?.ro || ''
      });
      setVacReqs({
        nl: Array.isArray(vac.requirements?.nl) ? [...vac.requirements.nl] : [],
        en: Array.isArray(vac.requirements?.en) ? [...vac.requirements.en] : [],
        de: Array.isArray(vac.requirements?.de) ? [...vac.requirements.de] : [],
        ro: Array.isArray(vac.requirements?.ro) ? [...vac.requirements.ro] : []
      });
    } else {
      setEditingId(null);
      setVacId('');
      setVacTitle({ nl: '', en: '', de: '', ro: '' });
      setVacDept({ nl: 'Productie', en: 'Production', de: 'Produktion', ro: 'Producție' });
      setVacLoc('Brad, RO');
      setVacType({ nl: 'Fulltime', en: 'Full-Time', de: 'Vollzeit', ro: 'Normă Întreagă' });
      setVacDesc({ nl: '', en: '', de: '', ro: '' });
      setVacSalary({ nl: 'Concurrerend salaris', en: 'Competitive Pay', de: 'Wettbewerbsfähiges Gehalt', ro: 'Salariu Competitiv' });
      setVacReqs({ nl: [], en: [], de: [], ro: [] });
    }
    setNewReqText({ nl: '', en: '', de: '', ro: '' });
    setIsModalOpen(true);
  };

  const handleAddRequirement = (langKey) => {
    const text = (newReqText[langKey] || '').trim();
    if (!text) return;
    setVacReqs(prev => ({
      ...prev,
      [langKey]: [...prev[langKey], text]
    }));
    setNewReqText(prev => ({ ...prev, [langKey]: '' }));
  };

  const handleRemoveRequirement = (langKey, index) => {
    setVacReqs(prev => ({
      ...prev,
      [langKey]: prev[langKey].filter((_, idx) => idx !== index)
    }));
  };

  const handleVacancySave = async (e) => {
    e.preventDefault();

    // Validation check
    const titleNl = (vacTitle.nl || '').trim();
    const titleEn = (vacTitle.en || '').trim();
    if (!titleNl || !titleEn) {
      showMessage('error', 'Dutch and English Job Titles are required.');
      return;
    }

    const payload = {
      action: 'save',
      vacancy: {
        id: editingId || vacId.trim() || undefined,
        title: vacTitle,
        department: vacDept,
        location: vacLoc,
        type: vacType,
        description: vacDesc,
        requirements: vacReqs,
        salary: vacSalary
      }
    };

    setLoadingData(true);
    try {
      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', editingId ? 'Vacancy updated successfully!' : 'New vacancy created successfully!');
        setIsModalOpen(false);
        loadDatabase(passcode.trim());
      } else {
        showMessage('error', data.error || 'Failed to save vacancy');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error while saving vacancy');
    } finally {
      setLoadingData(false);
    }
  };

  const handleVacancyDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vacancy?')) return;

    setLoadingData(true);
    try {
      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ action: 'delete', id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', 'Vacancy deleted successfully!');
        loadDatabase(passcode.trim());
      } else {
        showMessage('error', data.error || 'Failed to delete vacancy');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error while deleting');
    } finally {
      setLoadingData(false);
    }
  };

  // --- CRUD Functions for News Article ---
  const openNewsEdit = (item = null) => {
    setModalType('newsItem');
    setActiveFormLang('nl');
    if (item) {
      setEditingId(item.id);
      setNewsId(item.id);
      setNewsTag({
        nl: item.tag?.nl || '',
        en: item.tag?.en || '',
        de: item.tag?.de || '',
        ro: item.tag?.ro || ''
      });
      setNewsDate({
        nl: item.date?.nl || '',
        en: item.date?.en || '',
        de: item.date?.de || '',
        ro: item.date?.ro || ''
      });
      setNewsAuthor(item.author || 'PALROM Team');
      setNewsTitle({
        nl: item.title?.nl || '',
        en: item.title?.en || '',
        de: item.title?.de || '',
        ro: item.title?.ro || ''
      });
      setNewsContent({
        nl: item.content?.nl || '',
        en: item.content?.en || '',
        de: item.content?.de || '',
        ro: item.content?.ro || ''
      });
      setNewsLinkUrl(item.linkUrl || '');
      setNewsLinkText({
        nl: item.linkText?.nl || '',
        en: item.linkText?.en || '',
        de: item.linkText?.de || '',
        ro: item.linkText?.ro || ''
      });
      setNewsImage(item.image || '/images/hero_bg.jpg');
      setNewsIsRomOnly(!!item.isRomaniaOnly);
    } else {
      setEditingId(null);
      setNewsId('');
      setNewsTag({ nl: 'Kwaliteit', en: 'Quality', de: 'Qualität', ro: 'Calitate' });
      
      // Auto-set current date string in dynamic fields
      const today = new Date();
      const months = {
        nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        ro: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
      };
      const day = today.getDate();
      const year = today.getFullYear();
      
      setNewsDate({
        nl: `${day} ${months.nl[today.getMonth()]} ${year}`,
        en: `${months.en[today.getMonth()]} ${day}, ${year}`,
        de: `${day}. ${months.de[today.getMonth()]} ${year}`,
        ro: `${day} ${months.ro[today.getMonth()]} ${year}`
      });

      setNewsAuthor('Digital Team');
      setNewsTitle({ nl: '', en: '', de: '', ro: '' });
      setNewsContent({ nl: '', en: '', de: '', ro: '' });
      setNewsLinkUrl('/configurator');
      setNewsLinkText({
        nl: 'Ontdek meer',
        en: 'Discover more',
        de: 'Mehr erfahren',
        ro: 'Află mai multe'
      });
      setNewsImage('/images/hero_bg.jpg');
      setNewsIsRomOnly(false);
    }
    setIsModalOpen(true);
  };

  const handleNewsSave = async (e) => {
    e.preventDefault();

    const titleNl = (newsTitle.nl || '').trim();
    const titleEn = (newsTitle.en || '').trim();
    if (!titleNl || !titleEn) {
      showMessage('error', 'Dutch and English Article Titles are required.');
      return;
    }

    const payload = {
      action: 'save',
      newsItem: {
        id: editingId || newsId.trim() || undefined,
        tag: newsTag,
        date: newsDate,
        author: newsAuthor,
        title: newsTitle,
        content: newsContent,
        linkUrl: newsLinkUrl,
        linkText: newsLinkText,
        image: newsImage,
        isRomaniaOnly: newsIsRomOnly
      }
    };

    setLoadingData(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', editingId ? 'News article updated!' : 'New news article created!');
        setIsModalOpen(false);
        loadDatabase(passcode.trim());
      } else {
        showMessage('error', data.error || 'Failed to save news article');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error while saving news');
    } finally {
      setLoadingData(false);
    }
  };

  const handleNewsDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    setLoadingData(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ action: 'delete', id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', 'News article deleted!');
        loadDatabase(passcode.trim());
      } else {
        showMessage('error', data.error || 'Failed to delete news article');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error while deleting news article');
    } finally {
      setLoadingData(false);
    }
  };

  // --- Auto-Translation Logic ---
  const translateBatch = async (items, from, to) => {
    const nonEmpty = items.filter(item => item.val && item.val.trim());
    if (nonEmpty.length === 0) return {};

    const text = nonEmpty.map(item => item.val).join(' ||| ');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from, to })
      });
      const data = await res.json();
      if (res.ok && data.success && data.translatedText) {
        const parts = data.translatedText.split(/\s*\|\|\|\s*/);
        if (parts.length === nonEmpty.length) {
          const result = {};
          nonEmpty.forEach((item, idx) => {
            result[item.key] = parts[idx];
          });
          return result;
        }
      }
    } catch (err) {
      console.error(`Batch translation failed for ${to}:`, err);
    }

    // Fallback: translate individually
    console.log(`Batch mismatch or error for ${to}, falling back to individual translation...`);
    const result = {};
    for (const item of nonEmpty) {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.val, from, to })
        });
        const data = await res.json();
        if (res.ok && data.success && data.translatedText) {
          result[item.key] = data.translatedText;
        } else {
          result[item.key] = item.val;
        }
      } catch (err) {
        console.error(`Individual translation error for ${item.key} to ${to}:`, err);
        result[item.key] = item.val;
      }
    }
    return result;
  };

  const handleTranslateVacancy = async () => {
    setIsTranslating(true);
    const targetLangs = ['nl', 'en', 'de', 'ro'].filter(lang => lang !== activeFormLang);

    const items = [
      { key: 'title', val: vacTitle[activeFormLang] || '' },
      { key: 'dept', val: vacDept[activeFormLang] || '' },
      { key: 'type', val: vacType[activeFormLang] || '' },
      { key: 'salary', val: vacSalary[activeFormLang] || '' },
      { key: 'desc', val: vacDesc[activeFormLang] || '' }
    ];

    const reqs = vacReqs[activeFormLang] || [];
    reqs.forEach((req, idx) => {
      items.push({ key: `req_${idx}`, val: req });
    });

    try {
      await Promise.all(targetLangs.map(async (toLang) => {
        const translations = await translateBatch(items, activeFormLang, toLang);
        
        if (translations.title !== undefined) {
          setVacTitle(prev => ({ ...prev, [toLang]: translations.title }));
        }
        if (translations.dept !== undefined) {
          setVacDept(prev => ({ ...prev, [toLang]: translations.dept }));
        }
        if (translations.type !== undefined) {
          setVacType(prev => ({ ...prev, [toLang]: translations.type }));
        }
        if (translations.salary !== undefined) {
          setVacSalary(prev => ({ ...prev, [toLang]: translations.salary }));
        }
        if (translations.desc !== undefined) {
          setVacDesc(prev => ({ ...prev, [toLang]: translations.desc }));
        }

        const translatedReqs = [];
        reqs.forEach((_, idx) => {
          if (translations[`req_${idx}`] !== undefined) {
            translatedReqs.push(translations[`req_${idx}`]);
          }
        });
        if (translatedReqs.length > 0) {
          setVacReqs(prev => ({ ...prev, [toLang]: translatedReqs }));
        }
      }));

      showMessage('success', `Vacancy successfully auto-translated to all other tabs!`);
    } catch (error) {
      console.error(error);
      showMessage('error', 'Failed to auto-translate vacancy fields.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateNews = async () => {
    setIsTranslating(true);
    const targetLangs = ['nl', 'en', 'de', 'ro'].filter(lang => lang !== activeFormLang);

    const items = [
      { key: 'title', val: newsTitle[activeFormLang] || '' },
      { key: 'tag', val: newsTag[activeFormLang] || '' },
      { key: 'date', val: newsDate[activeFormLang] || '' },
      { key: 'content', val: newsContent[activeFormLang] || '' },
      { key: 'linkText', val: newsLinkText[activeFormLang] || '' }
    ];

    try {
      await Promise.all(targetLangs.map(async (toLang) => {
        const translations = await translateBatch(items, activeFormLang, toLang);
        
        if (translations.title !== undefined) {
          setNewsTitle(prev => ({ ...prev, [toLang]: translations.title }));
        }
        if (translations.tag !== undefined) {
          setNewsTag(prev => ({ ...prev, [toLang]: translations.tag }));
        }
        if (translations.date !== undefined) {
          setNewsDate(prev => ({ ...prev, [toLang]: translations.date }));
        }
        if (translations.content !== undefined) {
          setNewsContent(prev => ({ ...prev, [toLang]: translations.content }));
        }
        if (translations.linkText !== undefined) {
          setNewsLinkText(prev => ({ ...prev, [toLang]: translations.linkText }));
        }
      }));

      showMessage('success', `News article successfully auto-translated to all other tabs!`);
    } catch (error) {
      console.error(error);
      showMessage('error', 'Failed to auto-translate news article fields.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTitleBlur = async (isVacancy) => {
    const titleVal = isVacancy ? vacTitle[activeFormLang] : newsTitle[activeFormLang];
    const cleanTitle = (titleVal || '').trim();
    if (!cleanTitle) return;

    const targetLangs = ['nl', 'en', 'de', 'ro'].filter(lang => lang !== activeFormLang);

    await Promise.all(targetLangs.map(async (toLang) => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanTitle, from: activeFormLang, to: toLang })
        });
        const data = await res.json();
        if (res.ok && data.success && data.translatedText) {
          if (isVacancy) {
            setVacTitle(prev => ({ ...prev, [toLang]: data.translatedText }));
          } else {
            setNewsTitle(prev => ({ ...prev, [toLang]: data.translatedText }));
          }
        }
      } catch (err) {
        console.error(`Failed to auto-translate title to ${toLang}:`, err);
      }
    }));
  };

  const handleSyncDatabase = async () => {
    if (!confirm(lang === 'ro' ? 'Sigur doriți să actualizați baza de date cu traducerile locale?' : lang === 'nl' ? 'Weet u zeker dat u de database wilt synchroniseren met de lokale bestanden?' : 'Are you sure you want to sync the database with local JSON files?')) return;
    
    setLoadingData(true);
    try {
      const vRes = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ action: 'sync_local' })
      });
      const vData = await vRes.json();

      const nRes = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ action: 'sync_local' })
      });
      const nData = await nRes.json();

      if (vRes.ok && nRes.ok && vData.success && nData.success) {
        showMessage('success', lang === 'ro' ? 'Sincronizarea s-a realizat cu succes!' : lang === 'nl' ? 'Database succesvol gesynchroniseerd!' : 'Database successfully synced!');
        loadDatabase(passcode.trim());
      } else {
        showMessage('error', vData.error || nData.error || 'Failed to sync database');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error during database sync');
    } finally {
      setLoadingData(false);
    }
  };

  const handleExportDatabase = async () => {
    if (!confirm(t.exportConfirm[consoleLang])) return;
    
    setLoadingData(true);
    try {
      const vRes = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ action: 'export_local' })
      });
      const vData = await vRes.json();

      const nRes = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ action: 'export_local' })
      });
      const nData = await nRes.json();

      if (vRes.ok && nRes.ok && vData.success && nData.success) {
        showMessage('success', t.exportSuccess[consoleLang]);
        loadDatabase(passcode.trim());
      } else {
        showMessage('error', vData.error || nData.error || t.exportError[consoleLang]);
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Network error during database export');
    } finally {
      setLoadingData(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdfbf7' }}>
        <div style={{ textAlign: 'center', color: '#1a202c' }}>
          <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}></i>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Loading admin interface...</p>
        </div>
      </div>
    );
  }

  // --- Passcode Gate ---
  if (!isAuthenticated) {
    return (
      <>
        <style>{`
          .main-header, .main-footer, .floating-contact-widget { display: none !important; }
        `}</style>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fdfbf7',
          fontFamily: 'Inter, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(42, 42, 42, 0.08)',
            border: '1px solid #cbd5e1',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50px',
              backgroundColor: 'rgba(231, 177, 36, 0.12)',
              color: 'var(--color-primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              margin: '0 auto 1.5rem'
            }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest-dark)', marginBottom: '0.5rem' }}>
              PALROM Website Portal
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              {t.authRequired[consoleLang]}
            </p>

            {authError && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#b91c1c',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                fontWeight: 500,
                textAlign: 'left'
              }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i>
                {t.invalidPasscode[consoleLang]}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-dark)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                  {t.adminPasscode[consoleLang]}
                </label>
                <input
                  type="password"
                  placeholder={t.placeholderPasscode[consoleLang]}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                  disabled={loadingData}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fdfbf7'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loadingData}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  backgroundColor: 'var(--color-forest-dark)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
              >
                {loadingData ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> {t.verifying[consoleLang]}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-key"></i> {t.authenticate[consoleLang]}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // --- Authenticated Dashboard ---
  return (
    <>
      <style>{`
        .main-header, .main-footer, .floating-contact-widget { display: none !important; }
      `}</style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fdfbf7',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--color-text-dark)',
        padding: '40px 20px 80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Top Banner Alert */}
          {alert && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 20000,
              padding: '1rem 1.5rem',
              backgroundColor: alert.type === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1.5px solid ${alert.type === 'success' ? '#d1fae5' : '#fee2e2'}`,
              color: alert.type === 'success' ? '#065f46' : '#b91c1c',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              animation: 'fadeInRight 0.3s ease'
            }}>
              <i className={alert.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'}></i>
              {alert.text}
            </div>
          )}

          {/* Header Block */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            borderBottom: '1px solid #cbd5e1',
            paddingBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary-dark)' }}>
                PALROM Products SRL
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-forest-dark)', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
                {t.consoleTitle[consoleLang]}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Database Status Indicator */}
              {dbStatus && (
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: dbStatus.connected ? '#ecfdf5' : '#fff7ed',
                    border: `1px solid ${dbStatus.connected ? '#d1fae5' : '#ffedd5'}`,
                    color: dbStatus.connected ? '#065f46' : '#c2410c',
                    cursor: 'help'
                  }}
                  title={
                    dbStatus.connected 
                      ? (consoleLang === 'ro' ? 'Conexiune la baza de date activă (Vercel Postgres)' : consoleLang === 'nl' ? 'Databaseverbinding is actief (Vercel Postgres)' : 'Database connection is active (Vercel Postgres)')
                      : (dbStatus.error 
                          ? `${consoleLang === 'ro' ? 'Eroare bază de date' : consoleLang === 'nl' ? 'Database fout' : 'Database error'}: ${dbStatus.error}`
                          : (consoleLang === 'ro' ? 'Mod local: se utilizează fișiere JSON locale' : consoleLang === 'nl' ? 'Lokale modus: lokale JSON-bestanden worden gebruikt' : 'Local mode: using local JSON files'))
                  }
                >
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: dbStatus.connected ? '#10b981' : '#f97316',
                    display: 'inline-block'
                  }}></span>
                  <span>
                    {dbStatus.connected 
                      ? (consoleLang === 'ro' ? 'Baza de date Live' : consoleLang === 'nl' ? 'Database Live' : 'Database Live') 
                      : (consoleLang === 'ro' ? 'Mod Local (JSON)' : consoleLang === 'nl' ? 'Lokale Modus (JSON)' : 'Local Mode (JSON)')
                    }
                  </span>
                </div>
              )}

              {/* Console Language Switcher */}
              <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: '#cbd5e1', padding: '0.2rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                {['nl', 'en', 'ro'].map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setConsoleLang(l)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      backgroundColor: consoleLang === l ? '#ffffff' : 'transparent',
                      color: consoleLang === l ? 'var(--color-forest-dark)' : 'var(--color-text-muted)',
                      boxShadow: consoleLang === l ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>



              <Link href="/" target="_blank" style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                padding: '0.5rem 1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: '#ffffff'
              }}>
                <i className="fa-solid fa-up-right-from-square" style={{ marginRight: '0.4rem' }}></i> {t.viewLive[consoleLang]}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-power-off"></i> {t.logout[consoleLang]}
              </button>
            </div>
          </div>

          {/* Tab Selection */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '1px'
          }}>
            <button
              onClick={() => setActiveTab('vacancies')}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === 'vacancies' ? 'var(--color-forest-dark)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'vacancies' ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-briefcase"></i> {t.vacanciesTab[consoleLang]} ({vacancies.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === 'news' ? 'var(--color-forest-dark)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'news' ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-regular fa-newspaper"></i> {t.newsTab[consoleLang]} ({newsItems.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === 'quotes' ? 'var(--color-forest-dark)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'quotes' ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i> {t.quotesTab[consoleLang]} ({quotes.length})
            </button>
            <button
              onClick={() => { setActiveTab('stats'); if (passcode) loadStats(passcode); }}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === 'stats' ? 'var(--color-forest-dark)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'stats' ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-chart-line"></i> {t.statsTab[consoleLang]}
            </button>
          </div>

          {/* DATA VIEW AREA */}
          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--color-text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}></i>
              <p>Updating database entries...</p>
            </div>
          ) : activeTab === 'vacancies' ? (
            
            // VACANCIES TABLE
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 15px rgba(42, 42, 42, 0.02)',
              overflow: 'hidden',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                  {t.activeOpenings[consoleLang]}
                </h3>
                <button
                  onClick={() => openVacancyEdit(null)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: 'var(--color-forest-dark)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fa-solid fa-plus"></i> {t.addVacancy[consoleLang]}
                </button>
              </div>

              {vacancies.length === 0 ? (
                <div style={{ padding: '4rem 0', textCenter: 'center', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  <i className="fa-solid fa-folder-open fa-3x" style={{ opacity: 0.2, marginBottom: '1rem' }}></i>
                  <p>{t.noVacancies[consoleLang]}</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #cbd5e1', color: 'var(--color-forest-dark)', fontWeight: 700 }}>
                        <th style={{ padding: '12px 10px' }}>{t.idCode[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.titleCol[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.departmentCol[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.typeCol[consoleLang]}</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right' }}>{t.actionsCol[consoleLang]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacancies.map((vac) => (
                        <tr key={vac.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                          <td style={{ padding: '14px 10px', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{vac.id}</td>
                          <td style={{ padding: '14px 10px', fontWeight: 600 }}>{vac.title[consoleLang] || vac.title.nl || vac.title.en}</td>
                          <td style={{ padding: '14px 10px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: '#cbd5e1', borderRadius: '4px' }}>
                              {vac.department[consoleLang] || vac.department.nl || vac.department.en || ''}
                            </span>
                          </td>
                          <td style={{ padding: '14px 10px', color: 'var(--color-text-muted)' }}>{vac.type[consoleLang] || vac.type.nl || vac.type.en || ''}</td>
                          <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openVacancyEdit(vac)}
                                style={{
                                  padding: '0.35rem 0.7rem',
                                  border: '1.5px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: 'var(--color-forest-dark)',
                                  borderRadius: '4px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <i className="fa-solid fa-pen"></i> {t.editBtn[consoleLang]}
                              </button>
                              <button
                                onClick={() => handleVacancyDelete(vac.id)}
                                style={{
                                  padding: '0.35rem 0.7rem',
                                  border: 'none',
                                  backgroundColor: '#fef2f2',
                                  color: '#b91c1c',
                                  borderRadius: '4px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <i className="fa-solid fa-trash"></i> {t.deleteBtn[consoleLang]}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'news' ? (
            
            // NEWS ARTICLES LIST
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 15px rgba(42, 42, 42, 0.02)',
              overflow: 'hidden',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                  {t.publishedNews[consoleLang]}
                </h3>
                <button
                  onClick={() => openNewsEdit(null)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: 'var(--color-forest-dark)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fa-solid fa-plus"></i> {t.addArticle[consoleLang]}
                </button>
              </div>

              {newsItems.length === 0 ? (
                <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-folder-open fa-3x" style={{ opacity: 0.2, marginBottom: '1rem' }}></i>
                  <p>{t.noNews[consoleLang]}</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #cbd5e1', color: 'var(--color-forest-dark)', fontWeight: 700 }}>
                        <th style={{ padding: '12px 10px' }}>{t.thumbnail[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.tagDate[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.titleCol[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.authorCol[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.targetLink[consoleLang]}</th>
                        <th style={{ padding: '12px 10px' }}>{t.targeting[consoleLang]}</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right' }}>{t.actionsCol[consoleLang]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                          <td style={{ padding: '10px 10px' }}>
                            <img
                              src={item.image || '/images/hero_bg.jpg'}
                              alt=""
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '14px 10px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.4rem', backgroundColor: 'rgba(231,177,36,0.15)', color: 'var(--color-primary-dark)', borderRadius: '4px', marginRight: '0.5rem' }}>
                              {item.tag[consoleLang] || item.tag.nl || item.tag.en || ''}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.date[consoleLang] || item.date.nl || item.date.en || ''}</span>
                          </td>
                          <td style={{ padding: '14px 10px', fontWeight: 600 }}>{item.title[consoleLang] || item.title.nl || item.title.en || 'Untitled'}</td>
                          <td style={{ padding: '14px 10px', color: 'var(--color-text-muted)' }}>{item.author}</td>
                          <td style={{ padding: '14px 10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.linkUrl}</td>
                          <td style={{ padding: '14px 10px' }}>
                            {item.isRomaniaOnly ? (
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px' }}>
                                {t.romaniaOnly[consoleLang]}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '4px' }}>
                                {t.globalTarget[consoleLang]}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openNewsEdit(item)}
                                style={{
                                  padding: '0.35rem 0.7rem',
                                  border: '1.5px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: 'var(--color-forest-dark)',
                                  borderRadius: '4px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <i className="fa-solid fa-pen"></i> {t.editBtn[consoleLang]}
                              </button>
                              <button
                                onClick={() => handleNewsDelete(item.id)}
                                style={{
                                  padding: '0.35rem 0.7rem',
                                  border: 'none',
                                  backgroundColor: '#fef2f2',
                                  color: '#b91c1c',
                                  borderRadius: '4px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <i className="fa-solid fa-trash"></i> {t.deleteBtn[consoleLang]}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'quotes' ? (
            
            // B2B QUOTES LIST VIEW
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 15px rgba(42, 42, 42, 0.02)',
              overflow: 'hidden',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                  {consoleLang === 'ro' ? 'Cereri de Ofertă B2B' : consoleLang === 'nl' ? 'B2B Offerteaanvragen' : 'B2B Quote Inquiries'}
                </h3>
              </div>

              {quotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-file-invoice-dollar fa-3x" style={{ opacity: 0.3, marginBottom: '1rem' }}></i>
                  <p>{consoleLang === 'ro' ? 'Nu s-au găsit cereri de ofertă.' : consoleLang === 'nl' ? 'Geen offerteaanvragen gevonden.' : 'No quote inquiries found.'}</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #cbd5e1', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '0.8rem' }}>{consoleLang === 'ro' ? 'Client' : consoleLang === 'nl' ? 'Klant' : 'Client'}</th>
                        <th style={{ padding: '0.8rem' }}>{consoleLang === 'ro' ? 'Contact' : consoleLang === 'nl' ? 'Contact' : 'Contact'}</th>
                        <th style={{ padding: '0.8rem' }}>{consoleLang === 'ro' ? 'Data' : consoleLang === 'nl' ? 'Datum' : 'Date'}</th>
                        <th style={{ padding: '0.8rem' }}>{consoleLang === 'ro' ? 'Produse' : consoleLang === 'nl' ? 'Producten' : 'Products'}</th>
                        <th style={{ padding: '0.8rem' }}>Status</th>
                        <th style={{ padding: '0.8rem', textAlign: 'center' }}>{consoleLang === 'ro' ? 'Acțiuni' : consoleLang === 'nl' ? 'Acties' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => {
                        const statusColors = {
                          'New': { bg: '#e0f2fe', text: '#0369a1', label: consoleLang === 'nl' ? 'Nieuw' : (consoleLang === 'ro' ? 'Nou' : 'New') },
                          'In Review': { bg: '#fef3c7', text: '#b45309', label: consoleLang === 'nl' ? 'In Beoordeling' : (consoleLang === 'ro' ? 'În Analiză' : 'In Review') },
                          'Replied': { bg: '#dcfce7', text: '#15803d', label: consoleLang === 'nl' ? 'Beantwoord' : (consoleLang === 'ro' ? 'Răspuns' : 'Replied') },
                          'Archived': { bg: '#f1f5f9', text: '#475569', label: consoleLang === 'nl' ? 'Gearchiveerd' : (consoleLang === 'ro' ? 'Arhivat' : 'Archived') }
                        }[quote.status || 'New'] || { bg: '#e0f2fe', text: '#0369a1', label: quote.status };

                        const dateStr = quote.created_at 
                          ? new Date(quote.created_at).toLocaleString(consoleLang === 'nl' ? 'nl-NL' : (consoleLang === 'ro' ? 'ro-RO' : 'en-US'), {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                          : '-';

                        return (
                          <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem 0.8rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                              {quote.client_name}
                            </td>
                            <td style={{ padding: '1rem 0.8rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{quote.client_email}</span>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{quote.client_phone}</span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem 0.8rem', color: '#475569' }}>
                              {dateStr}
                            </td>
                            <td style={{ padding: '1rem 0.8rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--color-forest-dark)' }}>
                                {(quote.items || []).length} {consoleLang === 'nl' ? 'items' : 'items'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 0.8rem' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '50px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                backgroundColor: statusColors.bg,
                                color: statusColors.text
                              }}>
                                {statusColors.label}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 0.8rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button
                                  onClick={() => { setSelectedQuote(quote); setIsQuoteModalOpen(true); }}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    border: '1.5px solid var(--color-primary)',
                                    backgroundColor: '#ffffff',
                                    color: 'var(--color-forest-dark)',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <i className="fa-solid fa-magnifying-glass"></i> {consoleLang === 'ro' ? 'Detalii' : consoleLang === 'nl' ? 'Details' : 'Details'}
                                </button>
                                <button
                                  onClick={() => handleDownloadCSV(quote)}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    color: '#475569',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <i className="fa-solid fa-file-csv"></i> CSV
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            
            // STATISTICS DASHBOARD VIEW
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                  {consoleLang === 'ro' ? 'Analize & Statistici Website' : consoleLang === 'nl' ? 'Website Statistieken & Analyses' : 'Website Analytics & Statistics'}
                </h3>
                <button
                  onClick={() => passcode && loadStats(passcode)}
                  disabled={statsLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-dark)',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className={`fa-solid fa-arrows-rotate ${statsLoading ? 'fa-spin' : ''}`}></i>{' '}
                  {consoleLang === 'ro' ? 'Actualizează' : consoleLang === 'nl' ? 'Vernieuwen' : 'Refresh'}
                </button>
              </div>

              {statsLoading && !stats ? (
                <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}></i>
                  <p>{consoleLang === 'ro' ? 'Se încarcă statisticile...' : consoleLang === 'nl' ? 'Statistieken laden...' : 'Loading statistics...'}</p>
                </div>
              ) : statsError ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  border: '1px solid #fee2e2',
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c',
                  borderRadius: '8px'
                }}>
                  <i className="fa-solid fa-circle-exclamation fa-2x" style={{ marginBottom: '0.75rem' }}></i>
                  <p style={{ fontWeight: 600 }}>{statsError}</p>
                </div>
              ) : !stats ? (
                <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-chart-bar fa-3x" style={{ opacity: 0.3, marginBottom: '1rem' }}></i>
                  <p>{consoleLang === 'ro' ? 'Nu există date statistice disponibile.' : consoleLang === 'nl' ? 'Geen statistische gegevens beschikbaar.' : 'No statistical data available.'}</p>
                </div>
              ) : (
                <>
                  {/* Key Performance Indicators (KPIs) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {/* Metric 1: Page Views */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {consoleLang === 'ro' ? 'Vizualizări Pagină' : consoleLang === 'nl' ? 'Paginaweergaven' : 'Page Views'}
                        </span>
                        <i className="fa-solid fa-eye" style={{ color: 'var(--color-primary)' }}></i>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                        {stats.traffic.totalViews}
                      </h4>
                    </div>

                    {/* Metric 2: Quotes Count */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {consoleLang === 'ro' ? 'Oferte Inregistrate' : consoleLang === 'nl' ? 'Offerteaanvragen' : 'Quotes Submitted'}
                        </span>
                        <i className="fa-solid fa-file-invoice-dollar" style={{ color: 'var(--color-primary)' }}></i>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                        {stats.quotes.totalQuotes}
                      </h4>
                    </div>

                    {/* Metric 3: Conversion Rate */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {consoleLang === 'ro' ? 'Rată Conversie Funnel' : consoleLang === 'nl' ? 'Conversiepercentage' : 'Funnel Conversion Rate'}
                        </span>
                        <i className="fa-solid fa-filter" style={{ color: 'var(--color-primary)' }}></i>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                        {stats.configurator.funnel.started > 0
                          ? Math.round((stats.configurator.funnel.submitted / stats.configurator.funnel.started) * 100)
                          : 0}%
                      </h4>
                    </div>

                    {/* Metric 4: Chatbot Sessions */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {consoleLang === 'ro' ? 'Conversații Chatbot' : consoleLang === 'nl' ? 'Chatbot Sessies' : 'Chatbot Conversations'}
                        </span>
                        <i className="fa-solid fa-comments" style={{ color: 'var(--color-primary)' }}></i>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                        {stats.chatbot.totalChats} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>({stats.chatbot.avgMessages} msg/chat)</span>
                      </h4>
                    </div>
                  </div>

                  {/* Funnel chart and top pages split */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                    
                    {/* Funnel Widget */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Pâlnia de Conversie B2B' : consoleLang === 'nl' ? 'B2B Conversietrechter (Funnel)' : 'B2B Conversion Funnel'}
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Step 1: Configurator start */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                            <span>1. {consoleLang === 'ro' ? 'Configurator Inițiat' : consoleLang === 'nl' ? 'Configurator Gestart' : 'Configurator Started'}</span>
                            <span style={{ color: 'var(--color-forest-dark)' }}>{stats.configurator.funnel.started} {consoleLang === 'ro' ? 'sesiuni' : consoleLang === 'nl' ? 'sessies' : 'sessions'}</span>
                          </div>
                          <div style={{ height: '12px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '50px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '100%', backgroundColor: '#94a3b8', borderRadius: '50px' }} />
                          </div>
                        </div>

                        {/* Step 2: Added to cart */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                            <span>2. {consoleLang === 'ro' ? 'Adăugat în Coș (Cart)' : consoleLang === 'nl' ? 'Toegevoegd aan Cart' : 'Added to Cart'}</span>
                            <span style={{ color: 'var(--color-forest-dark)' }}>
                              {stats.configurator.funnel.addedToCart} {consoleLang === 'ro' ? 'sesiuni' : consoleLang === 'nl' ? 'sessies' : 'sessions'}
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                                ({stats.configurator.funnel.started > 0 ? Math.round((stats.configurator.funnel.addedToCart / stats.configurator.funnel.started) * 100) : 0}%)
                              </span>
                            </span>
                          </div>
                          <div style={{ height: '12px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '50px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${stats.configurator.funnel.started > 0 ? (stats.configurator.funnel.addedToCart / stats.configurator.funnel.started) * 100 : 0}%`, 
                              backgroundColor: 'var(--color-primary)', 
                              borderRadius: '50px' 
                            }} />
                          </div>
                        </div>

                        {/* Step 3: Submitted */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                            <span>3. {consoleLang === 'ro' ? 'Cerere Ofertă Trimisă' : consoleLang === 'nl' ? 'Offerteaanvraag Ingediend' : 'Quote Inquiry Submitted'}</span>
                            <span style={{ color: 'var(--color-forest-dark)' }}>
                              {stats.configurator.funnel.submitted} {consoleLang === 'ro' ? 'sesiuni' : consoleLang === 'nl' ? 'sessies' : 'sessions'}
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                                ({stats.configurator.funnel.started > 0 ? Math.round((stats.configurator.funnel.submitted / stats.configurator.funnel.started) * 100) : 0}%)
                              </span>
                            </span>
                          </div>
                          <div style={{ height: '12px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '50px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${stats.configurator.funnel.started > 0 ? (stats.configurator.funnel.submitted / stats.configurator.funnel.started) * 100 : 0}%`, 
                              backgroundColor: 'var(--color-forest-dark)', 
                              borderRadius: '50px' 
                            }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Pages Widget */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Weergaven per Pagină' : consoleLang === 'nl' ? 'Weergaven per Pagina' : 'Page Views by Path'}
                      </h4>
                      
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #cbd5e1', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                              <th style={{ padding: '6px 4px', fontWeight: 600 }}>{consoleLang === 'ro' ? 'Pagină' : consoleLang === 'nl' ? 'Pagina' : 'Page'}</th>
                              <th style={{ padding: '6px 4px', fontWeight: 600, textAlign: 'right', width: '80px' }}>{consoleLang === 'ro' ? 'Weergaven' : consoleLang === 'nl' ? 'Weergaven' : 'Views'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(stats.traffic.viewsByPage)
                              .sort((a, b) => b[1] - a[1])
                              .map(([path, count], idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                  <td style={{ padding: '8px 4px', fontFamily: 'monospace', color: '#334155' }}>{path}</td>
                                  <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 700, color: 'var(--color-forest-dark)' }}>{count}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown grids */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {/* Popular Products Configured */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Categorii de Lemn Configurate' : consoleLang === 'nl' ? 'Populaire Productgroepen' : 'Popular Categories Configured'}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {Object.entries(stats.configurator.byCategory).length === 0 ? (
                          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '1rem 0' }}>
                            {consoleLang === 'nl' ? 'Geen configuratie-events gevonden' : 'No configurator events recorded'}
                          </div>
                        ) : (
                          Object.entries(stats.configurator.byCategory)
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, count], idx) => {
                              const total = Object.values(stats.configurator.byCategory).reduce((x, y) => x + y, 0) || 1;
                              const pct = Math.round((count / total) * 100);
                              const catFriendly = {
                                sawn: consoleLang === 'ro' ? 'Piese brute' : 'Blanks',
                                planed: consoleLang === 'ro' ? 'Șipci geschaafd' : 'Planed slats',
                                dowels: consoleLang === 'ro' ? 'Tije/Stokken' : 'Dowel sticks',
                                profiles: consoleLang === 'ro' ? 'Profile' : 'Profiles',
                                specials: consoleLang === 'ro' ? 'Piese speciale' : 'Specials',
                                brichete: consoleLang === 'ro' ? 'Brichete' : 'Briquettes'
                              }[cat] || cat;
                              return (
                                <div key={idx}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 500 }}>{catFriendly}</span>
                                    <span style={{ fontWeight: 700 }}>{count} ({pct}%)</span>
                                  </div>
                                  <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--color-primary)', borderRadius: '10px' }} />
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>

                    {/* Configurator interface usage */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Popularitate Versiune Configurator' : consoleLang === 'nl' ? 'Prestaties per Configuratortype' : 'Configurator Version Usage'}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {Object.entries(stats.configurator.byVersion).map(([version, count], idx) => {
                          const total = Object.values(stats.configurator.byVersion).reduce((x, y) => x + y, 0) || 1;
                          const pct = Math.round((count / total) * 100);
                          const verFriendly = {
                            v1: consoleLang === 'nl' ? 'V1: Klassieke Accordeon' : 'V1: Classic Accordion',
                            v2: consoleLang === 'nl' ? 'V2: Multi-step Wizard' : 'V2: Multi-step Wizard',
                            v3: consoleLang === 'nl' ? 'V3: Scripted Chatbot' : 'V3: Scripted Chatbot',
                            v4: consoleLang === 'nl' ? 'V4: Open AI Chatbot' : 'V4: Open AI Chatbot'
                          }[version] || version;

                          const vStat = stats.configurator.versionStats?.[version] || { started: 0, submitted: 0 };
                          const convPct = vStat.started > 0 ? Math.round((vStat.submitted / vStat.started) * 100) : 0;

                          return (
                            <div key={idx}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 500 }}>{verFriendly}</span>
                                <span style={{ fontWeight: 700 }}>
                                  {count} ({pct}%)
                                  <span style={{ color: 'var(--color-primary-dark)', marginLeft: '0.4rem', fontSize: '0.72rem', fontWeight: 600 }}>
                                    [Conv: {convPct}%]
                                  </span>
                                </span>
                              </div>
                              <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#3b82f6', borderRadius: '10px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chatbot specific statistics */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Statistici Asistent PAL AI' : consoleLang === 'nl' ? 'PAL AI Chatbot Telemetrie' : 'PAL AI Chatbot Diagnostics'}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>{consoleLang === 'ro' ? 'Total Conversații' : consoleLang === 'nl' ? 'Totaal Aantal Chats' : 'Total Chat Sessions'}</span>
                          <strong style={{ color: 'var(--color-forest-dark)' }}>{stats.chatbot.totalChats}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>{consoleLang === 'ro' ? 'Configurări Finalizate' : consoleLang === 'nl' ? 'Succesvol Geconfigureerd' : 'Configured via Chat'}</span>
                          <strong style={{ color: '#16a34a' }}>
                            {stats.chatbot.completedCount} 
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.3rem' }}>
                              ({stats.chatbot.totalChats > 0 ? Math.round((stats.chatbot.completedCount / stats.chatbot.totalChats) * 100) : 0}%)
                            </span>
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>{consoleLang === 'ro' ? 'Rată Fallback Regex' : consoleLang === 'nl' ? 'Lokale Regex Fallbacks' : 'Regex Fallback Rate'}</span>
                          <strong style={{ color: stats.chatbot.fallbackRate > 30 ? '#dc2626' : '#b45309' }}>
                            {stats.chatbot.fallbackRate}%
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.3rem' }}>
                              ({stats.chatbot.fallbackCount} chats)
                            </span>
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Wood & FSC Deep-Dive */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
                    
                    {/* Card: Popular Dimensions per Group */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Dimensiuni Populare per Categorie' : consoleLang === 'nl' ? 'Populaire Afmetingen per Productgroep' : 'Popular Dimensions by Category'}
                      </h4>
                      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {Object.entries(stats.configurator.popularDimensions || {}).length === 0 ? (
                          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
                            {consoleLang === 'nl' ? 'Geen afmetingsgegevens beschikbaar' : 'No dimensions configured yet'}
                          </div>
                        ) : (
                          Object.entries(stats.configurator.popularDimensions || {}).map(([cat, dimsObj], idx) => {
                            const sortedDims = Object.entries(dimsObj).sort((a, b) => b[1] - a[1]).slice(0, 3);
                            const catFriendly = {
                              sawn: consoleLang === 'ro' ? 'Piese brute' : 'Blanks',
                              planed: consoleLang === 'ro' ? 'Șipci geschaafd' : 'Planed slats',
                              dowels: consoleLang === 'ro' ? 'Tije/Stokken' : 'Dowel sticks',
                              profiles: consoleLang === 'ro' ? 'Profile' : 'Profiles',
                              specials: consoleLang === 'ro' ? 'Piese speciale' : 'Specials'
                            }[cat] || cat;
                            
                            return (
                              <div key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid #f8fafc', paddingBottom: '0.75rem' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>{catFriendly}</div>
                                {sortedDims.map(([dimStr, count], dIdx) => (
                                  <div key={dIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingLeft: '0.5rem', margin: '2px 0' }}>
                                    <span style={{ fontFamily: 'monospace' }}>{dimStr}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{count}x</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Card: Quantity & FSC Distribution */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Volum Cumpărături & FSC' : consoleLang === 'nl' ? 'Oplageverdeling & FSC® Ratio' : 'Volume & FSC® Distribution'}
                      </h4>
                      
                      {/* Volume ranges */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '0.75rem' }}>
                          {consoleLang === 'ro' ? 'Oplage Verdeling (B2B)' : consoleLang === 'nl' ? 'Oplageverdeling per Bestelling' : 'Order Quantity Split'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span>500 - 1.000 {consoleLang === 'nl' ? 'stuks' : 'pcs'}</span>
                              <strong>{stats.configurator.quantityDist?.range500to1000 || 0}</strong>
                            </div>
                            <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                              <div style={{ 
                                height: '100%', 
                                width: `${stats.configurator.totalEvents > 0 ? Math.round(((stats.configurator.quantityDist?.range500to1000 || 0) / stats.configurator.totalEvents) * 100) : 0}%`, 
                                backgroundColor: 'var(--color-primary)', 
                                borderRadius: '10px' 
                              }} />
                            </div>
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span>1.001 - 5.000 {consoleLang === 'nl' ? 'stuks' : 'pcs'}</span>
                              <strong>{stats.configurator.quantityDist?.range1000to5000 || 0}</strong>
                            </div>
                            <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                              <div style={{ 
                                height: '100%', 
                                width: `${stats.configurator.totalEvents > 0 ? Math.round(((stats.configurator.quantityDist?.range1000to5000 || 0) / stats.configurator.totalEvents) * 100) : 0}%`, 
                                backgroundColor: 'var(--color-primary)', 
                                borderRadius: '10px' 
                              }} />
                            </div>
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span>&gt; 5.000 {consoleLang === 'nl' ? 'stuks' : 'pcs'}</span>
                              <strong>{stats.configurator.quantityDist?.range5000plus || 0}</strong>
                            </div>
                            <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                              <div style={{ 
                                height: '100%', 
                                width: `${stats.configurator.totalEvents > 0 ? Math.round(((stats.configurator.quantityDist?.range5000plus || 0) / stats.configurator.totalEvents) * 100) : 0}%`, 
                                backgroundColor: 'var(--color-primary)', 
                                borderRadius: '10px' 
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FSC certified ratio */}
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>
                          {consoleLang === 'ro' ? 'Certificare FSC® 100%' : consoleLang === 'nl' ? 'FSC® Houtcertificering Ratio' : 'FSC® 100% Demand'}
                        </div>
                        {(() => {
                          const fsc = stats.configurator.fscRatio?.fscCertified || 0;
                          const nonFsc = stats.configurator.fscRatio?.nonFsc || 0;
                          const total = fsc + nonFsc || 1;
                          const fscPct = Math.round((fsc / total) * 100);
                          const nonFscPct = Math.round((nonFsc / total) * 100);

                          return (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 600 }}>FSC® 100%: {fscPct}%</span>
                                <span style={{ color: 'var(--color-text-muted)' }}>Geen FSC: {nonFscPct}%</span>
                              </div>
                              <div style={{ display: 'flex', height: '12px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '50px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${fscPct}%`, backgroundColor: '#16a34a' }} />
                                <div style={{ height: '100%', width: `${nonFscPct}%`, backgroundColor: '#94a3b8' }} />
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Traffic Sources, Devices & Chat Diagnostics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    {/* Traffic Sources & Devices */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Surse Trafic & Dispozitive' : consoleLang === 'nl' ? 'Verkeersbronnen & Apparaten' : 'Traffic Sources & Devices'}
                      </h4>
                      
                      <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <tbody>
                            {Object.entries(stats.traffic.referrers || {})
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 4)
                              .map(([ref, count], idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                  <td style={{ padding: '4px 0', color: 'var(--color-text-muted)' }}>{ref}</td>
                                  <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700 }}>{count}x</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                          <span>Desktop ({stats.traffic.devices?.desktop || 0})</span>
                          <span>Mobiel ({stats.traffic.devices?.mobile || 0})</span>
                        </div>
                        {(() => {
                          const mob = stats.traffic.devices?.mobile || 0;
                          const desk = stats.traffic.devices?.desktop || 0;
                          const total = mob + desk || 1;
                          const deskPct = Math.round((desk / total) * 100);
                          const mobPct = Math.round((mob / total) * 100);

                          return (
                            <div style={{ display: 'flex', height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '50px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${deskPct}%`, backgroundColor: '#3b82f6' }} />
                              <div style={{ height: '100%', width: `${mobPct}%`, backgroundColor: '#ec4899' }} />
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Chatbot Language Conversion */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Conversie Chatbot per Limbă' : consoleLang === 'nl' ? 'Chatbot Conversie per Taal' : 'Chatbot Conversion by Language'}
                      </h4>
                      <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #cbd5e1', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                              <th style={{ padding: '4px 0' }}>{consoleLang === 'nl' ? 'Taal' : 'Language'}</th>
                              <th style={{ padding: '4px 0', textAlign: 'center' }}>Chats</th>
                              <th style={{ padding: '4px 0', textAlign: 'right' }}>{consoleLang === 'nl' ? 'Voltooid' : 'Completed'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(stats.chatbot.byLanguage || {}).map(([cLang, item], idx) => {
                              const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                              return (
                                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                  <td style={{ padding: '6px 0', fontWeight: 700, textTransform: 'uppercase' }}>{cLang}</td>
                                  <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.total}</td>
                                  <td style={{ padding: '6px 0', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>{item.completed} ({pct}%)</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Unresolved Chat Queries (AI Fallbacks) */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                        {consoleLang === 'ro' ? 'Mesaje Neînțelese de PAL' : consoleLang === 'nl' ? 'Niet-begrepen Chat Vragen' : 'Unresolved Chat Queries'}
                      </h4>
                      <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.78rem', color: '#475569' }}>
                        {!stats.chatbot.fallbackMessages || stats.chatbot.fallbackMessages.length === 0 ? (
                          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
                            {consoleLang === 'nl' ? 'Geen niet-begrepen vragen gevonden.' : 'No fallback messages logged yet.'}
                          </div>
                        ) : (
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {stats.chatbot.fallbackMessages.map((msg, idx) => (
                              <li key={idx} style={{ marginBottom: '6px', fontStyle: 'italic' }}>
                                "{msg}"
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visitor Path Analysis Visualizer */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                    marginTop: '1.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest-dark)' }}>
                          {consoleLang === 'ro' ? 'Analiză Cale Vizitatori (Sankey)' : consoleLang === 'nl' ? 'Bezoekers Padanalyse (User Flow)' : 'Visitor Path Analysis (User Flow)'}
                        </h4>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          {consoleLang === 'ro' 
                            ? 'Urmăriți modul în care vizitatorii navighează între pagini în primele 4 interacțiuni.' 
                            : consoleLang === 'nl' 
                            ? 'Bekijk hoe bezoekers door de website navigeren gedurende de eerste 4 stappen van hun sessie.' 
                            : 'Visualize how visitors navigate page-to-page through the first 4 interactions of their session.'}
                        </p>
                      </div>
                    </div>

                    <UserFlowDiagram userFlow={stats.userFlow} consoleLang={consoleLang} />
                  </div>
                </>
              )}
            </div>
          )}
          {/* Advanced Database Settings Section */}
          <div style={{
            marginTop: '4rem',
            backgroundColor: '#fffdfa',
            border: '1px solid #f59e0b',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(222, 160, 0, 0.03)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              {consoleLang === 'ro' ? 'Setări Avansate Bază de Date' : consoleLang === 'nl' ? 'Geavanceerde Database Instellingen' : 'Advanced Database Settings'}
            </h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#b45309', lineHeight: '1.5' }}>
              {consoleLang === 'ro' 
                ? 'ATENȚIE: Aceste funcții sincronizează direct fișierele locale din codebase cu baza de date de producție. Asigurați-vă că datele sunt corecte înainte de a efectua aceste operațiuni, deoarece pot suprascrie modificările active.' 
                : consoleLang === 'nl' 
                ? 'LET OP: Deze functies synchroniseren de lokale bestanden uit de codebase rechtstreeks met de live database. Zorg ervoor dat u weet welke versie actueel is voordat u synchroniseert, omdat dit actieve wijzigingen kan overschrijven.' 
                : 'WARNING: These features directly synchronize local codebase files with the live production database. Make sure you know which version is up-to-date before running these operations, as they can overwrite active changes.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleSyncDatabase}
                disabled={loadingData}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#b45309',
                  padding: '0.6rem 1.2rem',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  backgroundColor: '#fff3cd',
                  cursor: loadingData ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <i className="fa-solid fa-arrows-rotate"></i> {t.syncDbBtn[consoleLang]}
              </button>

              <button
                onClick={handleExportDatabase}
                disabled={loadingData}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  padding: '0.6rem 1.2rem',
                  border: '1px solid var(--color-forest-dark)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-forest-dark)',
                  cursor: loadingData ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-download"></i> {t.exportDbBtn[consoleLang]}
              </button>
            </div>
          </div>

          {/* Console Footer with Version */}
          <div style={{
            marginTop: '3rem',
            borderTop: '1px solid #cbd5e1',
            paddingTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)'
          }}>
            <span>Console Version {packageVersion} • PALROM Products SRL © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* RENDER MODAL EDITOR (Vacancies / News) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(26, 32, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 2rem',
              backgroundColor: 'var(--color-forest-dark)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                {editingId 
                  ? (modalType === 'vacancy' ? `${t.editVacancyTitle[consoleLang]} (${editingId})` : `${t.editNewsTitle[consoleLang]} (${editingId})`)
                  : (modalType === 'vacancy' ? t.addNewVacancyTitle[consoleLang] : t.addNewNewsTitle[consoleLang])
                }
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  opacity: 0.8
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body & Forms */}
            <div style={{ overflowY: 'auto', padding: '2rem', flex: 1 }}>
              
              {/* Form Language Tab Switcher */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', marginRight: '0.75rem' }}>
                    <i className="fa-solid fa-globe" style={{ marginRight: '0.3rem' }}></i> {t.translatingLabel[consoleLang]}
                  </span>
                  {['nl', 'en', 'de', 'ro'].map(langKey => (
                    <button
                      key={langKey}
                      type="button"
                      onClick={() => setActiveFormLang(langKey)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        backgroundColor: activeFormLang === langKey ? 'var(--color-primary)' : '#f1f5f9',
                        color: activeFormLang === langKey ? 'var(--color-forest-dark)' : 'var(--color-text-muted)'
                      }}
                    >
                      {langKey}
                    </button>
                  ))}
                </div>
                <div>
                  <button
                    type="button"
                    disabled={isTranslating}
                    onClick={modalType === 'vacancy' ? handleTranslateVacancy : handleTranslateNews}
                    style={{
                      padding: '0.4rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1.5px solid var(--color-primary-dark)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-primary-dark)',
                      cursor: isTranslating ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isTranslating ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i> {t.translatingStatus[consoleLang]}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-language"></i> {t.autoTranslateBtn[consoleLang]}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* VACANCY FORM */}
              {modalType === 'vacancy' && (
                <form onSubmit={handleVacancySave}>
                  
                  {/* LOCALIZED FIELDS */}
                  <div style={{ backgroundColor: '#fcfdfd', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-dark)', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                      {t.localizedInfo[consoleLang]} ({activeFormLang.toUpperCase()})
                    </h4>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.jobTitleLabel[consoleLang]} ({activeFormLang}) *</label>
                      <input
                        type="text"
                        value={vacTitle[activeFormLang] || ''}
                        onChange={(e) => setVacTitle(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                        onBlur={() => handleTitleBlur(true)}
                        placeholder={`e.g. Planing Machine Operator (${activeFormLang})`}
                        required={activeFormLang === 'nl' || activeFormLang === 'en'}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.departmentLabel[consoleLang]} ({activeFormLang})</label>
                        <input
                          type="text"
                          value={vacDept[activeFormLang] || ''}
                          onChange={(e) => setVacDept(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                          placeholder={`e.g. Production (${activeFormLang})`}
                          style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.jobTypeLabel[consoleLang]} ({activeFormLang})</label>
                        <input
                          type="text"
                          value={vacType[activeFormLang] || ''}
                          onChange={(e) => setVacType(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                          placeholder={`e.g. Full-Time (${activeFormLang})`}
                          style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.salaryLabel[consoleLang]} ({activeFormLang})</label>
                      <input
                        type="text"
                        value={vacSalary[activeFormLang] || ''}
                        onChange={(e) => setVacSalary(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                        placeholder={`e.g. Competitive Salary / Stable Wages (${activeFormLang})`}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.descriptionLabel[consoleLang]} ({activeFormLang})</label>
                      <textarea
                        rows="4"
                        value={vacDesc[activeFormLang] || ''}
                        onChange={(e) => setVacDesc(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                        placeholder={`Explain core duties of the job in ${activeFormLang}...`}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit' }}
                      />
                    </div>

                    {/* REQUIREMENTS ARRAY LIST MANAGER */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.requirementsLabel[consoleLang]} ({activeFormLang})</label>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          value={newReqText[activeFormLang]}
                          onChange={(e) => setNewReqText(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                          placeholder={t.newReqPlaceholder[consoleLang]}
                          style={{ flex: 1, padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddRequirement(activeFormLang);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddRequirement(activeFormLang)}
                          style={{
                            padding: '0.55rem 1rem',
                            backgroundColor: 'var(--color-primary-dark)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          <i className="fa-solid fa-plus"></i> {t.addReqBtn[consoleLang]}
                        </button>
                      </div>

                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {(vacReqs[activeFormLang] || []).map((req, idx) => (
                          <li key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.45rem 0.75rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '4px',
                            marginBottom: '0.35rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem'
                          }}>
                            <span style={{ color: 'var(--color-text-dark)' }}>{req}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRequirement(activeFormLang, idx)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '2px 5px'
                              }}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* GLOBAL FIELDS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.locationLabel[consoleLang]}</label>
                      <input
                        type="text"
                        value={vacLoc}
                        onChange={(e) => setVacLoc(e.target.value)}
                        placeholder="Brad, RO"
                        required
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.identifierLabel[consoleLang]}</label>
                      <input
                        type="text"
                        value={vacId}
                        onChange={(e) => setVacId(e.target.value)}
                        disabled={!!editingId}
                        placeholder={t.slugNote[consoleLang]}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: editingId ? '#f1f5f9' : '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #cbd5e1',
                        color: 'var(--color-text-muted)',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.88rem'
                      }}
                    >
                      {t.cancelBtn[consoleLang]}
                    </button>
                    <button
                      type="submit"
                      disabled={loadingData}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: loadingData ? 'var(--color-text-muted)' : 'var(--color-forest-dark)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: loadingData ? 'not-allowed' : 'pointer',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {loadingData ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> {t.savingStatus[consoleLang]}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-floppy-disk"></i> {t.saveVacancyBtn[consoleLang]}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* NEWS ARTICLE FORM */}
              {modalType === 'newsItem' && (
                <form onSubmit={handleNewsSave}>
                  
                  {/* LOCALIZED FIELDS */}
                  <div style={{ backgroundColor: '#fcfdfd', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-dark)', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                      Localized Info ({activeFormLang.toUpperCase()})
                    </h4>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.articleTitleLabel[consoleLang]} ({activeFormLang}) *</label>
                      <input
                        type="text"
                        value={newsTitle[activeFormLang] || ''}
                        onChange={(e) => setNewsTitle(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                        onBlur={() => handleTitleBlur(false)}
                        placeholder={`Headline in ${activeFormLang}`}
                        required={activeFormLang === 'nl' || activeFormLang === 'en'}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.categoryTagLabel[consoleLang]} ({activeFormLang})</label>
                        <input
                          type="text"
                          value={newsTag[activeFormLang] || ''}
                          onChange={(e) => setNewsTag(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                          placeholder={`e.g. Kwaliteit / Quality (${activeFormLang})`}
                          style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.displayDateLabel[consoleLang]} ({activeFormLang})</label>
                        <input
                          type="text"
                          value={newsDate[activeFormLang] || ''}
                          onChange={(e) => setNewsDate(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                          placeholder={`e.g. 22 juni 2026 / June 22, 2026 (${activeFormLang})`}
                          style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.articleContentLabel[consoleLang]} ({activeFormLang})</label>
                      <textarea
                        rows="5"
                        value={newsContent[activeFormLang] || ''}
                        onChange={(e) => setNewsContent(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                        placeholder={`News content text/paragraphs in ${activeFormLang}...`}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.redirectLinkLabel[consoleLang]} ({activeFormLang})</label>
                      <input
                        type="text"
                        value={newsLinkText[activeFormLang] || ''}
                        onChange={(e) => setNewsLinkText(prev => ({ ...prev, [activeFormLang]: e.target.value }))}
                        placeholder={`e.g. Try the configurator / Probeer de configurator (${activeFormLang})`}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>

                  </div>

                  {/* GLOBAL FIELDS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.authorLabel[consoleLang]}</label>
                      <input
                        type="text"
                        value={newsAuthor}
                        onChange={(e) => setNewsAuthor(e.target.value)}
                        placeholder="e.g. Sawmill Ops / Digital Team"
                        required
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.redirectUrlLabel[consoleLang]}</label>
                      <input
                        type="text"
                        value={newsLinkUrl}
                        onChange={(e) => setNewsLinkUrl(e.target.value)}
                        placeholder="e.g. /configurator or /about#history"
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* IMAGE UPLOADER INTERFACE */}
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', backgroundColor: '#fafbfd' }}>
                    <div style={{ flexShrink: 0 }}>
                      <img
                        src={newsImage || '/images/hero_bg.jpg'}
                        alt="Preview"
                        style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#e2e8f0' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.imageLabel[consoleLang]}</label>
                      <input
                        type="text"
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        placeholder="Enter URL or upload below"
                        style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '0.45rem 1rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          border: '1.5px solid var(--color-primary-dark)',
                          color: 'var(--color-primary-dark)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {uploadingImage ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i> {t.uploadingStatus[consoleLang]}
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-cloud-arrow-up"></i> {t.uploadImageBtn[consoleLang]}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CHECKBOX AND SLUG */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id="newsIsRomOnly"
                        checked={newsIsRomOnly}
                        onChange={(e) => setNewsIsRomOnly(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="newsIsRomOnly" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
                        {t.romaniaOnlyCheckbox[consoleLang]}
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>Custom Identifier / Slug (Global)</label>
                      <input
                        type="text"
                        value={newsId}
                        onChange={(e) => setNewsId(e.target.value)}
                        disabled={!!editingId}
                        placeholder="e.g. brand-launch (Auto-generated if empty)"
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: editingId ? '#f1f5f9' : '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #cbd5e1',
                        color: 'var(--color-text-muted)',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.88rem'
                      }}
                    >
                      {t.cancelBtn[consoleLang]}
                    </button>
                    <button
                      type="submit"
                      disabled={loadingData}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: loadingData ? 'var(--color-text-muted)' : 'var(--color-forest-dark)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: loadingData ? 'not-allowed' : 'pointer',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {loadingData ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> {t.publishingStatus[consoleLang]}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-floppy-disk"></i> {t.publishArticleBtn[consoleLang]}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* RENDER B2B QUOTE DETAILS MODAL */}
      {isQuoteModalOpen && selectedQuote && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(26, 32, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 2rem',
              backgroundColor: 'var(--color-forest-dark)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                {consoleLang === 'ro' ? 'Detalii Cerere Ofertă' : consoleLang === 'nl' ? 'Details Offerteaanvraag' : 'Quote Inquiry Details'}
              </h3>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  opacity: 0.8
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: 'auto', padding: '2rem', flex: 1 }}>
              {/* Client information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {consoleLang === 'ro' ? 'Nume Client' : consoleLang === 'nl' ? 'Klantnaam' : 'Client Name'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest-dark)', marginTop: '0.2rem' }}>{selectedQuote.client_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {consoleLang === 'ro' ? 'E-mail' : consoleLang === 'nl' ? 'E-mailadres' : 'Email Address'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginTop: '0.2rem' }}>{selectedQuote.client_email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {consoleLang === 'ro' ? 'Telefon' : consoleLang === 'nl' ? 'Telefoonnummer' : 'Phone Number'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginTop: '0.2rem' }}>{selectedQuote.client_phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {consoleLang === 'ro' ? 'Data Trimitere' : consoleLang === 'nl' ? 'Verzonden op' : 'Submitted on'}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#1e293b', marginTop: '0.2rem' }}>
                    {new Date(selectedQuote.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status Update section */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', padding: '1rem', border: '1.5px solid var(--color-primary)', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
                  {consoleLang === 'ro' ? 'Actualizează Status:' : consoleLang === 'nl' ? 'Status bijwerken:' : 'Update Status:'}
                </span>
                <select
                  value={selectedQuote.status || 'New'}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      const res = await fetch('/api/portal/admin/inquiries', {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-admin-passcode': passcode.trim()
                        },
                        body: JSON.stringify({ id: selectedQuote.id, status: newStatus })
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        setQuotes(prev => prev.map(q => q.id === selectedQuote.id ? { ...q, status: newStatus } : q));
                        setSelectedQuote(prev => ({ ...prev, status: newStatus }));
                        showMessage('success', consoleLang === 'nl' ? 'Status succesvol bijgewerkt!' : 'Status updated successfully!');
                      } else {
                        showMessage('error', data.error || 'Failed to update status.');
                      }
                    } catch (err) {
                      console.error(err);
                      showMessage('error', 'Network error while updating status.');
                    }
                  }}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    color: 'var(--color-forest-dark)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="New">{consoleLang === 'nl' ? 'Nieuw' : (consoleLang === 'ro' ? 'Nou' : 'New')}</option>
                  <option value="In Review">{consoleLang === 'nl' ? 'In Beoordeling' : (consoleLang === 'ro' ? 'În Analiză' : 'In Review')}</option>
                  <option value="Replied">{consoleLang === 'nl' ? 'Beantwoord' : (consoleLang === 'ro' ? 'Răspuns' : 'Replied')}</option>
                  <option value="Archived">{consoleLang === 'nl' ? 'Gearchiveerd' : (consoleLang === 'ro' ? 'Arhivat' : 'Archived')}</option>
                </select>
              </div>

              {/* Notes */}
              {selectedQuote.client_notes && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-forest-dark)', textTransform: 'uppercase' }}>
                    {consoleLang === 'ro' ? 'Observații' : consoleLang === 'nl' ? 'Opmerkingen' : 'Client Notes'}
                  </h4>
                  <div style={{ padding: '1rem', backgroundColor: '#fdfaee', border: '1px solid #f3e8c4', borderRadius: '8px', fontSize: '0.88rem', color: '#1e293b', whiteSpace: 'pre-line', fontStyle: 'italic' }}>
                    "{selectedQuote.client_notes}"
                  </div>
                </div>
              )}

              {/* Configured Products */}
              <div>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-forest-dark)', textTransform: 'uppercase' }}>
                  {consoleLang === 'ro' ? 'Produse Solicitate' : consoleLang === 'nl' ? 'Geconfigureerde Producten' : 'Configured Products'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(selectedQuote.items || []).map((item, index) => {
                    const specKeys = ['woodType', 'grade', 'dims', 'radius', 'finish', 'drying', 'steamed', 'fsc', 'additionalInfo'];
                    
                    return (
                      <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-forest-dark)' }}>
                            {index + 1}. {item.name}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary-dark)', backgroundColor: '#f0fdf4', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #dcfce7' }}>
                            {consoleLang === 'ro' ? 'Cant:' : consoleLang === 'nl' ? 'Aantal:' : 'Qty:'} {item.qty}
                          </span>
                        </div>
                        <div style={{ padding: '1rem', fontSize: '0.82rem' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                              {specKeys.map(k => {
                                const rawVal = item[k];
                                if (rawVal === undefined || rawVal === null || rawVal === '') return null;
                                if (item.categoryKey === 'brichete' && ['grade', 'drying', 'steamed', 'fsc'].includes(k)) return null;

                                const label = localizeSpecKey(k, consoleLang);
                                const val = localizeSpecValue(k, rawVal, consoleLang, item.categoryKey);

                                return (
                                  <tr key={k} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '4px 0', color: 'var(--color-text-muted)', fontWeight: 600, width: '160px' }}>{label}</td>
                                    <td style={{ padding: '4px 0', color: '#1e293b', fontWeight: 700 }}>{val}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid #cbd5e1',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              backgroundColor: '#f8fafc'
            }}>
              <button
                onClick={() => handleDownloadCSV(selectedQuote)}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-forest-dark)',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: 'none'
                }}
              >
                <i className="fa-solid fa-file-csv"></i> Download CSV
              </button>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: 'var(--color-text-muted)',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {consoleLang === 'ro' ? 'Închide' : consoleLang === 'nl' ? 'Sluiten' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserFlowDiagram({ userFlow, consoleLang }) {
  const [hoveredNode, setHoveredNode] = useState(null); // 'colIndex_nodeName'
  const [hoveredLink, setHoveredLink] = useState(null); // 'colIndex_source_target'
  const [tooltip, setTooltip] = useState(null);

  if (!userFlow || !userFlow.stages) return null;

  const { stages, topJourneys } = userFlow;

  // Render variables
  const width = 1000;
  const height = 400;
  const colWidth = 140;
  const nodeHeight = 36;
  const startY = 30;
  const endY = 370;
  const availableHeight = endY - startY;

  // Column X coordinates (centers)
  const colXs = [110, 370, 630, 890];

  // Map nodes to their Y positions
  const nodePositions = {}; // 'colIndex_nodeName' -> { x, y, width, height }
  const nodeOutgoingTotal = {};
  const nodeIncomingTotal = {};

  // Compute incoming and outgoing totals for scaling and offset spacing
  stages.forEach((stage, colIndex) => {
    if (colIndex < 3) {
      (stage.links || []).forEach(link => {
        const sourceKey = `${colIndex}_${link.source}`;
        const targetKey = `${colIndex + 1}_${link.target}`;
        nodeOutgoingTotal[sourceKey] = (nodeOutgoingTotal[sourceKey] || 0) + link.value;
        nodeIncomingTotal[targetKey] = (nodeIncomingTotal[targetKey] || 0) + link.value;
      });
    }
  });

  // Calculate layout of nodes
  stages.forEach((stage, colIndex) => {
    const nodes = stage.nodes || [];
    const N = nodes.length;
    if (N === 0) return;

    const x = colXs[colIndex] - colWidth / 2;

    nodes.forEach((node, nodeIndex) => {
      let y;
      if (N === 1) {
        y = startY + availableHeight / 2 - nodeHeight / 2;
      } else {
        const spacing = (availableHeight - N * nodeHeight) / (N - 1);
        y = startY + nodeIndex * (nodeHeight + spacing);
      }

      nodePositions[`${colIndex}_${node.name}`] = {
        x,
        y,
        width: colWidth,
        height: nodeHeight,
        name: node.name,
        count: node.count
      };
    });
  });

  // Scale flow path thickness
  const allLinks = stages.flatMap(s => s.links || []);
  const maxLinkValue = allLinks.length > 0 ? Math.max(...allLinks.map(l => l.value), 1) : 1;
  const scale = Math.min(18 / maxLinkValue, 3); // Max path thickness 18px

  // Tracking offsets for stacked Sankey links
  const outgoingOffsets = {};
  const incomingOffsets = {};

  // Generate Bezier curves
  const linksToRender = [];
  stages.forEach((stage, colIndex) => {
    if (colIndex >= 3) return;

    (stage.links || []).forEach(link => {
      const sourceKey = `${colIndex}_${link.source}`;
      const targetKey = `${colIndex + 1}_${link.target}`;

      const sourcePos = nodePositions[sourceKey];
      const targetPos = nodePositions[targetKey];

      if (sourcePos && targetPos) {
        const strokeWidth = Math.max(1.5, link.value * scale);

        // Initialize stack offsets centered vertically on node edge
        if (outgoingOffsets[sourceKey] === undefined) {
          const totalStackHeight = (nodeOutgoingTotal[sourceKey] || 0) * scale;
          outgoingOffsets[sourceKey] = Math.max(2, (sourcePos.height - totalStackHeight) / 2);
        }
        if (incomingOffsets[targetKey] === undefined) {
          const totalStackHeight = (nodeIncomingTotal[targetKey] || 0) * scale;
          incomingOffsets[targetKey] = Math.max(2, (targetPos.height - totalStackHeight) / 2);
        }

        const x1 = sourcePos.x + sourcePos.width;
        const y1 = sourcePos.y + outgoingOffsets[sourceKey] + strokeWidth / 2;
        const x2 = targetPos.x;
        const y2 = targetPos.y + incomingOffsets[targetKey] + strokeWidth / 2;

        // Advance offsets
        outgoingOffsets[sourceKey] += strokeWidth;
        incomingOffsets[targetKey] += strokeWidth;

        // Check highlights
        let isHighlighted = false;
        let isDimmed = false;

        const isNodeHovered = hoveredNode !== null;
        const isLinkHovered = hoveredLink !== null;

        const currentLinkKey = `${colIndex}_${link.source}_${link.target}`;

        if (isLinkHovered) {
          isHighlighted = hoveredLink === currentLinkKey;
          isDimmed = !isHighlighted;
        } else if (isNodeHovered) {
          const [hoveredCol, hoveredName] = hoveredNode.split('_');
          const hColIdx = parseInt(hoveredCol, 10);
          
          const matchesSource = hColIdx === colIndex && hoveredName === link.source;
          const matchesTarget = hColIdx === colIndex + 1 && hoveredName === link.target;
          
          isHighlighted = matchesSource || matchesTarget;
          isDimmed = !isHighlighted;
        }

        linksToRender.push({
          key: currentLinkKey,
          x1,
          y1,
          x2,
          y2,
          strokeWidth,
          value: link.value,
          source: link.source,
          target: link.target,
          colIndex,
          isHighlighted,
          isDimmed
        });
      }
    });
  });

  const handleMouseMove = (e, content) => {
    const svgEl = e.currentTarget.ownerSVGElement || e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 15,
      content
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredNode(null);
    setHoveredLink(null);
  };

  const stepTitles = {
    nl: ['Stap 1: Entree', 'Stap 2: Vervolg', 'Stap 3: Vervolg', 'Stap 4: Vervolg'],
    en: ['Step 1: Entry', 'Step 2: Flow', 'Step 3: Flow', 'Step 4: Flow'],
    ro: ['Pasul 1: Intrare', 'Pasul 2: Continuare', 'Pasul 3: Continuare', 'Pasul 4: Continuare']
  }[consoleLang] || ['Step 1: Entry', 'Step 2: Flow', 'Step 3: Flow', 'Step 4: Flow'];

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Column Headers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', textAlign: 'center' }}>
        {stepTitles.map((title, idx) => (
          <div key={idx} style={{ 
            width: `${colWidth}px`, 
            fontWeight: 800, 
            fontSize: '0.8rem', 
            color: 'var(--color-primary-dark)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </div>
        ))}
      </div>

      {/* SVG Canvas */}
      <div style={{ backgroundColor: '#fafbfc', border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width="100%" 
          height="100%" 
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* DEFINITIONS FOR GRADIENTS AND FILTERS */}
          <defs>
            <linearGradient id="flow-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="var(--color-primary-dark)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--color-forest-dark)" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flow-gradient-normal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.35" />
            </linearGradient>
            <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--color-primary)" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. DRAW LINKS */}
          <g>
            {linksToRender.map(link => {
              // Cubic bezier control points for beautiful S-curves
              const cp1x = link.x1 + (link.x2 - link.x1) * 0.45;
              const cp2x = link.x1 + (link.x2 - link.x1) * 0.55;
              const d = `M ${link.x1} ${link.y1} C ${cp1x} ${link.y1}, ${cp2x} ${link.y2}, ${link.x2} ${link.y2}`;

              const isExit = link.target === 'EXIT';
              const defaultColor = isExit ? '#fca5a5' : '#cbd5e1';
              const strokeColor = link.isHighlighted 
                ? 'url(#flow-gradient-active)' 
                : defaultColor;

              const opacity = link.isHighlighted 
                ? 0.9 
                : link.isDimmed 
                ? 0.08 
                : isExit 
                ? 0.28
                : 0.38;

              const tooltipText = consoleLang === 'ro' 
                ? `${link.value} sesiuni: ${link.source} → ${link.target}` 
                : consoleLang === 'nl'
                ? `${link.value} sessies: ${link.source} → ${link.target}`
                : `${link.value} sessions: ${link.source} → ${link.target}`;

              return (
                <path
                  key={link.key}
                  d={d}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={link.strokeWidth}
                  strokeOpacity={opacity}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'stroke-opacity 0.2s, stroke 0.2s',
                    filter: link.isHighlighted ? 'url(#glow)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredLink(link.key)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(e) => handleMouseMove(e, tooltipText)}
                />
              );
            })}
          </g>

          {/* 2. DRAW FLOW ANIMATIONS (GLOWING BUBBLES ALONG HIGHLIGHTED PATHS) */}
          <g style={{ pointerEvents: 'none' }}>
            {linksToRender.map(link => {
              if (!link.isHighlighted) return null;
              
              const cp1x = link.x1 + (link.x2 - link.x1) * 0.45;
              const cp2x = link.x1 + (link.x2 - link.x1) * 0.55;
              const d = `M ${link.x1} ${link.y1} C ${cp1x} ${link.y1}, ${cp2x} ${link.y2}, ${link.x2} ${link.y2}`;

              return (
                <path
                  key={`anim_${link.key}`}
                  d={d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={Math.min(3, link.strokeWidth * 0.5)}
                  strokeOpacity="0.8"
                  strokeDasharray="10 30"
                  style={{
                    animation: 'dashflow 1.5s linear infinite'
                  }}
                />
              );
            })}
          </g>

          {/* 3. DRAW NODES */}
          <g>
            {Object.entries(nodePositions).map(([key, pos]) => {
              const colIndex = parseInt(key.split('_')[0], 10);
              const isExitNode = pos.name === 'EXIT';
              
              const isNodeHovered = hoveredNode !== null;
              const isSelfHovered = hoveredNode === key;

              let isTargetedByHover = false;
              if (isNodeHovered && !isSelfHovered) {
                // Check if any link connects hoveredNode to this node
                const [hoveredCol, hoveredName] = hoveredNode.split('_');
                const hColIdx = parseInt(hoveredCol, 10);
                
                const stageIndex = Math.min(colIndex, hColIdx);
                if (Math.abs(colIndex - hColIdx) === 1) {
                  const matchingLink = stages[stageIndex]?.links?.some(l => 
                    (hColIdx < colIndex && l.source === hoveredName && l.target === pos.name) ||
                    (hColIdx > colIndex && l.source === pos.name && l.target === hoveredName)
                  );
                  isTargetedByHover = !!matchingLink;
                }
              }

              const opacity = (isNodeHovered && !isSelfHovered && !isTargetedByHover) ? 0.35 : 1;

              // Node styling
              const bgColor = isExitNode 
                ? '#fff5f5' 
                : isSelfHovered 
                ? 'var(--color-primary-light)' 
                : '#f0fdf4';

              const strokeColor = isExitNode 
                ? '#f87171' 
                : isSelfHovered || isTargetedByHover
                ? 'var(--color-forest-dark)' 
                : 'var(--color-primary)';

              const strokeWidth = isSelfHovered ? 2.5 : isTargetedByHover ? 2 : 1;
              const textColor = isExitNode ? '#991b1b' : 'var(--color-forest-dark)';
              
              const totalColViews = stages[colIndex].nodes.reduce((acc, curr) => acc + curr.count, 0) || 1;
              const percentage = Math.round((pos.count / totalColViews) * 100);

              const tooltipText = isExitNode
                ? consoleLang === 'ro' 
                  ? `${pos.count} vizitatori au părăsit site-ul în acest pas (${percentage}%)`
                  : consoleLang === 'nl'
                  ? `${pos.count} bezoekers verlieten de site bij deze stap (${percentage}%)`
                  : `${pos.count} visitors exited the site at this step (${percentage}%)`
                : consoleLang === 'ro'
                ? `${pos.count} vizualizări pe ${pos.name} (${percentage}% din acest pas)`
                : consoleLang === 'nl'
                ? `${pos.count} weergaven op ${pos.name} (${percentage}% van deze stap)`
                : `${pos.count} views on ${pos.name} (${percentage}% of this step)`;

              // Format name to display (shorten long paths)
              let displayName = pos.name;
              if (displayName.length > 15) {
                displayName = displayName.substring(0, 14) + '...';
              }

              return (
                <g 
                  key={key}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: 'pointer', opacity, transition: 'opacity 0.2s' }}
                  onMouseEnter={() => setHoveredNode(key)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(e) => handleMouseMove(e, tooltipText)}
                >
                  {/* Background rect */}
                  <rect
                    width={pos.width}
                    height={pos.height}
                    rx={6}
                    ry={6}
                    fill={bgColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    style={{ transition: 'fill 0.2s, stroke 0.2s' }}
                  />

                  {/* Node label text */}
                  <text
                    x={8}
                    y={15}
                    fill={textColor}
                    style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}
                  >
                    {displayName}
                  </text>

                  {/* Node subtext (views / count) */}
                  <text
                    x={8}
                    y={28}
                    fill={isExitNode ? '#dc2626' : 'var(--color-text-muted)'}
                    style={{ fontSize: '0.66rem', fontWeight: 600 }}
                  >
                    {pos.count} {consoleLang === 'nl' ? 'sessies' : 'sessions'} ({percentage}%)
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Global Styles for Flow Animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dashflow {
            to {
              stroke-dashoffset: -40;
            }
          }
        `}} />
      </div>

      {/* Floating Interactive Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          color: '#ffffff',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)'
        }}>
          {tooltip.content}
        </div>
      )}

      {/* Top Journeys List */}
      <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem' }}>
        <h5 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-forest-dark)' }}>
          {consoleLang === 'ro' ? 'Top Căi de Navigare (Sesiuni)' : consoleLang === 'nl' ? 'Meest Voorkomende Bezoekerspaden' : 'Top Navigational Paths (Sessions)'}
        </h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(topJourneys || []).map((journey, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '0.65rem 1rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              fontSize: '0.8rem',
              border: '1px solid #cbd5e1'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'var(--color-forest-dark)', 
                  fontWeight: 800, 
                  borderRadius: '50px', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.72rem'
                }}>
                  {idx + 1}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {journey.path.map((pathStr, pIdx) => (
                    <React.Fragment key={pIdx}>
                      {pIdx > 0 && <i className="fa-solid fa-arrow-right" style={{ color: '#94a3b8', fontSize: '0.7rem' }}></i>}
                      <code style={{ 
                        backgroundColor: '#ffffff', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        fontWeight: 600
                      }}>
                        {pathStr}
                      </code>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <strong style={{ color: 'var(--color-forest-dark)', fontSize: '0.85rem' }}>
                {journey.count} {consoleLang === 'nl' ? 'sessies' : 'sessions'}
              </strong>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const localizeSpecKey = (key, lang = 'nl') => {
  const dict = {
    woodType: { nl: 'Houtsoort', en: 'Wood species', de: 'Holzart', ro: 'Specie de lemn' },
    grade: { nl: 'Kwaliteitsklasse', en: 'Quality Grade', de: 'Qualitätsklasse', ro: 'Clasă de calitate' },
    dims: { nl: 'Afmetingen', en: 'Dimensions', de: 'Maße', ro: 'Dimensiuni' },
    radius: { nl: 'Radius', en: 'Radius', de: 'Radius', ro: 'Rază' },
    finish: { nl: 'Afwerking', en: 'Finish', de: 'Oberfläche', ro: 'Finisaj' },
    drying: { nl: 'Droging', en: 'Drying', de: 'Trocknung', ro: 'Uscare' },
    steamed: { nl: 'Gestoomd', en: 'Steamed', de: 'Gedämpft', ro: 'Aburit' },
    fsc: { nl: 'FSC® Certificering', en: 'FSC® Certification', de: 'FSC®-Zertifizierung', ro: 'Certificare FSC®' },
    additionalInfo: { nl: 'Aanvullende info', en: 'Additional info', de: 'Zusatzinfo', ro: 'Info suplimentare' }
  };
  return dict[key]?.[lang] || dict[key]?.nl || key;
};

const localizeSpecValue = (key, val, lang = 'nl', categoryKey = '') => {
  if (key === 'woodType') {
    return categoryKey === 'brichete'
      ? (lang === 'nl' ? 'Beuken (Surplus zaagsel)' : (lang === 'ro' ? 'Fag (Surplus de rumeguș)' : (lang === 'de' ? 'Buche (Sägemehl)' : 'Beechwood (Sawdust surplus)')))
      : (lang === 'nl' ? 'Beuken' : (lang === 'en' ? 'Beechwood' : (lang === 'de' ? 'Buchenholz' : 'Fag')));
  }
  if (key === 'grade') {
    const grades = {
      A: { nl: 'Klasse A (Foutvrij)', en: 'Class A (Clear)', de: 'Klasse A (Astfrei)', ro: 'Clasa A (Fără noduri)' },
      B: { nl: 'Klasse B (Meubelhout)', en: 'Class B (Cabinet)', de: 'Klasse B (Möbelholz)', ro: 'Clasa B (Lemn pentru mobilă)' },
      C: { nl: 'Klasse C (Constructief)', en: 'Class C (Structural)', de: 'Klasse C (Konstruktive Qualität)', ro: 'Clasa C (Calitate constructivă)' }
    };
    return grades[val]?.[lang] || grades[val]?.nl || val;
  }
  if (key === 'finish') {
    const finishes = {
      sawn: { nl: 'Fijnbezaagd', en: 'Fine-sawn / Rough-sawn', de: 'Feinschnitt / Sägerau', ro: 'Tăiat brut' },
      planed: { nl: 'Vierzijdig geschaafd (S4S)', en: 'Four-sides planed (S4S)', de: 'Vierseitig gehobelt (S4S)', ro: 'Rinduit pe patru fețe (S4S)' },
      dowels: { nl: 'Rond geschaafd', en: 'Round planed', de: 'Rund gehobelt', ro: 'Rinduit rotund' },
      profiles: { nl: 'Geprofileerd', en: 'Moulded/Profiled', de: 'Profiliert', ro: 'Profilat' },
      specials: { nl: 'Op specificatie', en: 'On custom specification', de: 'Nach Spezifikation', ro: 'Conform specificației' },
      brichete: { nl: 'Natuurlijk geperst, zonder chemische toevoegingen', en: '100% Natural, chemical-free', de: '100% Natürlich, ohne chemische Bindemittel', ro: '100% Natural, fără lianți chimici' }
    };
    return finishes[categoryKey]?.[lang] || finishes[val]?.[lang] || val;
  }
  if (key === 'fsc') {
    const fscVals = {
      true: { nl: 'FSC® 100%', en: 'FSC® 100%', de: 'FSC® 100%', ro: 'FSC® 100%' },
      false: { nl: 'Geen FSC', en: 'No FSC', de: 'Kein FSC', ro: 'Fără FSC' }
    };
    const fscKey = val ? 'true' : 'false';
    return fscVals[fscKey]?.[lang] || fscVals[fscKey]?.nl || (val ? 'FSC® 100%' : 'No FSC');
  }
  if (key === 'drying') {
    const dryingVals = {
      luchtdroog: { nl: 'Luchtdroog', en: 'Air-dried', de: 'Luftgetrocknet', ro: 'Uscat la aer' },
      kd: { nl: 'Kamerdroog (KD 10-12%)', en: 'Kiln-dried (KD 10-12%)', de: 'Kammergetrocknet (KD 10-12%)', ro: 'Uscat în cuptor (KD 10-12%)' }
    };
    return dryingVals[val]?.[lang] || dryingVals[val]?.nl || val;
  }
  if (key === 'steamed') {
    if (val === 'yes') {
      return lang === 'nl' ? 'Gestoomd' : (lang === 'en' ? 'Steamed' : (lang === 'de' ? 'Gedämpft' : 'Aburit'));
    }
    return lang === 'nl' ? 'Ongestoomd' : (lang === 'en' ? 'Unsteamed' : (lang === 'de' ? 'Ungedämpft' : 'Neaburit'));
  }
  return val;
};

