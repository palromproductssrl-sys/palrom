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
  
  // Tabs
  vacanciesTab: { nl: 'Vacatures', en: 'Vacancies', ro: 'Locuri de muncă' },
  newsTab: { nl: 'Nieuws & Artikelen', en: 'News & Articles', ro: 'Știri și Articole' },
  
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

  // Dashboard Tabs: 'vacancies' or 'news'
  const [activeTab, setActiveTab] = useState('vacancies');

  // Database lists
  const [vacancies, setVacancies] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

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
          loadDatabase(storedPasscode);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
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

  const loadDatabase = async (authPasscode) => {
    try {
      // Fetch vacancies
      const vRes = await fetch('/api/vacancies');
      const vData = await vRes.json();

      // Fetch news
      const nRes = await fetch('/api/news');
      const nData = await nRes.json();

      if (vRes.ok && nRes.ok) {
        setVacancies(vData.vacancies || []);
        setNewsItems(nData.news || []);
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
          'x-admin-passcode': passcode
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
          'x-admin-passcode': passcode
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', editingId ? 'Vacancy updated successfully!' : 'New vacancy created successfully!');
        setIsModalOpen(false);
        loadDatabase(passcode);
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
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ action: 'delete', id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', 'Vacancy deleted successfully!');
        loadDatabase(passcode);
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
          'x-admin-passcode': passcode
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', editingId ? 'News article updated!' : 'New news article created!');
        setIsModalOpen(false);
        loadDatabase(passcode);
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
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ action: 'delete', id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', 'News article deleted!');
        loadDatabase(passcode);
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
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ action: 'sync_local' })
      });
      const vData = await vRes.json();

      const nRes = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ action: 'sync_local' })
      });
      const nData = await nRes.json();

      if (vRes.ok && nRes.ok && vData.success && nData.success) {
        showMessage('success', lang === 'ro' ? 'Sincronizarea s-a realizat cu succes!' : lang === 'nl' ? 'Database succesvol gesynchroniseerd!' : 'Database successfully synced!');
        loadDatabase(passcode);
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
            border: '1px solid #edf2f7',
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
                    border: '1.5px solid #edf2f7',
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
            borderBottom: '1px solid #edf2f7',
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
              {/* Console Language Switcher */}
              <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: '#edf2f7', padding: '0.2rem', borderRadius: '6px', border: '1px solid #edf2f7' }}>
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

              <button
                onClick={handleSyncDatabase}
                disabled={loadingData}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-primary-dark)',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-primary-dark)',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  cursor: loadingData ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-arrows-rotate"></i> {lang === 'ro' ? 'Sincronizează DB' : lang === 'nl' ? 'Sync Database' : 'Sync Database'}
              </button>

              <Link href="/" target="_blank" style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                padding: '0.5rem 1rem',
                border: '1px solid #edf2f7',
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
            borderBottom: '2px solid #edf2f7',
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
              border: '1px solid #edf2f7',
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
                      <tr style={{ borderBottom: '2px solid #edf2f7', color: 'var(--color-forest-dark)', fontWeight: 700 }}>
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
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: '#edf2f7', borderRadius: '4px' }}>
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
                                  border: '1.5px solid #edf2f7',
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
          ) : (
            
            // NEWS ARTICLES LIST
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #edf2f7',
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
                      <tr style={{ borderBottom: '2px solid #edf2f7', color: 'var(--color-forest-dark)', fontWeight: 700 }}>
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
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #edf2f7' }}
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
                                  border: '1.5px solid #edf2f7',
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
          )}
          {/* Console Footer with Version */}
          <div style={{
            marginTop: '3rem',
            borderTop: '1px solid #edf2f7',
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
            border: '1px solid #edf2f7',
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
                borderBottom: '1px solid #edf2f7',
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
                  <div style={{ backgroundColor: '#fcfdfd', border: '1px solid #edf2f7', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
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
                            border: '1px solid #edf2f7',
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
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #edf2f7',
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
                  <div style={{ backgroundColor: '#fcfdfd', border: '1px solid #edf2f7', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
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
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid #edf2f7', borderRadius: '8px', padding: '1rem', backgroundColor: '#fafbfd' }}>
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
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #edf2f7',
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
    </>
  );
}
