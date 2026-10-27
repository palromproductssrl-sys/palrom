'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

const YOUTUBE_VIDEO_ID = 'HtQ-duYvz0Y';

export default function About() {
  const { lang, setLang } = useInquiry();
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isVideoMuted, setIsVideoMuted] = React.useState(true);
  const [videoLang, setVideoLang] = React.useState(lang || 'nl');
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0);
  const [videoDuration, setVideoDuration] = React.useState(55);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const videoRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const progressRef = React.useRef(null);
  const hideControlsTimerRef = React.useRef(null);

  // Sync video language when page language changes
  React.useEffect(() => {
    if (lang && ['nl', 'en', 'de', 'ro'].includes(lang)) {
      setVideoLang(lang);
    }
  }, [lang]);

  // Fullscreen change listener
  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const resetControlsTimer = () => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 2500);
  };

  const togglePlayPause = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
      resetControlsTimer();
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
      setControlsVisible(true);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!progressRef.current || !videoRef.current || !videoDuration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = pct * videoDuration;
    videoRef.current.currentTime = targetTime;
    setVideoCurrentTime(targetTime);
    resetControlsTimer();
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) wrapper.requestFullscreen();
      else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const switchVideoLang = (newLang) => {
    if (videoLang === newLang) return;
    const currentVideo = videoRef.current;
    const currentTime = currentVideo ? currentVideo.currentTime : 0;
    const wasPlaying = currentVideo ? !currentVideo.paused : true;
    
    setVideoLang(newLang);
    if (setLang) {
      setLang(newLang);
    }

    setTimeout(() => {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying) {
            videoRef.current.play().catch(() => {});
            setIsVideoPlaying(true);
          }
        } catch (e) {}
      }
    }, 60);
    resetControlsTimer();
  };

  const toggleVideoSound = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsVideoMuted(nextMuted);
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 9);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const timelineEvents = [
    {
      year: '1999',
      title: {
        nl: 'Oprichting & Visie',
        en: 'Founding & Vision',
        de: 'Gründung & Vision',
        ro: 'Fondare & Viziune'
      },
      description: {
        nl: 'De Nederlandse investeerder dhr. Ernst Willemstein richt Palrom Products SRL op in Brad, Roemenië. Hij kiest deze locatie vanwege de grote overvloed en superieure kwaliteit van de omringende beukenbossen. De eerste grondverwervingen en de aanleg van elektriciteit en water worden voltooid.',
        en: 'Dutch investor Mr. Ernst Willemstein establishes Palrom Products SRL in Brad, Romania, choosing the site due to the high abundance and superior quality of surrounding beech forests. Initial land acquisitions and primary electrical and water utilities setup are completed.',
        de: 'Der niederländische Investor Herr Ernst Willemstein gründet Palrom Products SRL in Brad, Rumänien, und wählt den Standort aufgrund der großen Fülle und hervorragenden Qualität der umliegenden Buchenwälder. Erste Grundstückskäufe und die Einrichtung der primären Strom- und Wasserversorgung sind abgeschlossen.',
        ro: 'Investitorul olandez, dl. Ernst Willemstein, înființează Palrom Products SRL în Brad, România. Acesta alege această locație datorită abundenței și calității superioare a pădurilor de fag din zonă. Sunt finalizate primele achiziții de terenuri și racordarea la rețelele de energie electrică și apă.'
      },
      align: 'left',
    },
    {
      year: '2001',
      title: {
        nl: 'Start van de Productie',
        en: 'Production Launch',
        de: 'Produktionsstart',
        ro: 'Lansarea Producției'
      },
      description: {
        nl: 'De zagerij is klaar en de eerste verwerking begint. Het bedrijf neemt zijn eerste geautomatiseerde schaaf- en zaagmachines in gebruik en neemt lokale houtbewerkingsspecialisten aan om de productielijnen te leiden.',
        en: 'The sawmill is completed and primary processing operations kick off. The company implements its first automated planing and cutting machinery, hiring local woodcraft experts to supervise production lines.',
        de: 'Das Sägewerk wird fertiggestellt und die primäre Verarbeitung beginnt. Das Unternehmen führt seine ersten automatisierten Hobel- und Schneidemaschinen ein und stellt lokale Holzhandwerksexperten ein, um die Produktionslinien zu überwachen.',
        ro: 'Hala de producție este finalizată și începe prima etapă de prelucrare. Compania pune în funcțiune primele utilaje automatizate de rindeluire și debitare, angajând specialiști locali în prelucrarea lemnului pentru a coordona liniile de producție.'
      },
      align: 'right',
    },
    {
      year: '2010',
      title: {
        nl: 'FSC®-Certificering',
        en: 'FSC® Certification',
        de: 'FSC®-Zertifizierung',
        ro: 'Certificare FSC®'
      },
      description: {
        nl: 'Om wereldwijde toeleveringsketens te ondersteunen en ecologische verantwoordelijkheid te tonen, introduceert Palrom duurzame bosbouwpraktijken en ontvangt het de volledige FSC® Chain of Custody-certificering. De verkoop breidt uit naar de Japanse en Arabische timmerindustrie.',
        en: 'To support global supply chains and demonstrate environmental responsibility, Palrom adopts sustainable practices, receiving full FSC® Chain of Custody Certification. Sales expand into Japanese and Arabic carpentry markets.',
        de: 'Um globale Lieferketten zu unterstützen und ökologische Verantwortung zu demonstrieren, führt Palrom nachhaltige Praktiken ein und erhält die vollständige FSC® Chain of Custody-Zertifizierung. Der Vertrieb wird auf japanische und arabische Zimmereimärkte ausgeweitet.',
        ro: 'Pentru a sprijini lanțurile globale de aprovizionare și pentru a demonstra responsabilitatea ecologică, Palrom implementează practici de silvicultură durabilă și obține certificarea completă FSC® Chain of Custody (Lanț de Custodie). Vânzările se extind către industria de tâmplărie din Japonia și din țările arabe.'
      },
      align: 'left',
    },
    {
      year: '2021',
      title: {
        nl: 'Uitbreiding van Faciliteiten',
        en: 'Facility Expansion',
        de: 'Erweiterung der Anlagen',
        ro: 'Extinderea Capacităților'
      },
      description: {
        nl: 'Palrom moderniseert zijn terrein en voegt 7.000 vierkante meter aan betonnen sorteerplaatsen en geconditioneerde opslagruimtes toe.',
        en: 'Palrom modernizes its yard, adding 7,000 square meters of concrete sorting areas and conditioned storage facilities.',
        de: 'Palrom modernisiert seinen Betriebshof und fügt 7.000 Quadratmeter betonierte Sortierflächen und konditionierte Lagerräume hinzu.',
        ro: 'Palrom își modernizează platforma industrială, adăugând 7.000 de metri pătrați de platforme betonate pentru sortare și depozite condiționate.'
      },
      align: 'right',
    },
    {
      year: '2025',
      title: {
        nl: 'Nieuw Opslagdepot',
        en: 'New Storage Depot',
        de: 'Neues Lagerdepot',
        ro: 'Depozit Nou de Stocare'
      },
      description: {
        nl: 'Een gloednieuw opslagdepot wordt opgeleverd in Brad om de groeiende exportvolumes te ondersteunen.',
        en: 'A brand-new storage depot is completed in Brad to support growing export volumes.',
        de: 'Ein brandneues Lagerdepot wird in Brad fertiggestellt, um die wachsenden Exportmengen zu unterstützen.',
        ro: 'Un depozit de stocare complet nou este finalizat la Brad pentru a susține volumele de export în continuă creștere.'
      },
      align: 'left',
    },
    {
      year: {
        nl: 'Nu',
        en: 'Now',
        de: 'Jetzt',
        ro: 'Prezent'
      },
      title: {
        nl: 'Een Internationale Partner',
        en: 'An International Partner',
        de: 'Ein internationaler Partner',
        ro: 'Un Partener Internațional'
      },
      description: {
        nl: 'Palrom opereert als een belangrijke leverancier voor grote Europese retailers van meubelcomponenten, met centraal logistiek beheer en distributiepunten in Nederland.',
        en: 'Operating as a key vendor to major European furniture components retailers, with central logistics managed and distributed through points in the Netherlands.',
        de: 'Tätig als Hauptlieferant für große europäische Händler von Möbelkomponenten, mit zentraler Logistiksteuerung und Vertrieb über Standorte in den Niederlanden.',
        ro: 'Palrom activează ca un furnizor cheie pentru marii retaileri europeni de componente de mobilier, beneficiind de un management logistic centralizat și de puncte de distribuție în Țările de Jos.'
      },
      align: 'right',
    }
  ];

  const galleryItems = [
    {
      id: 1,
      image: '/images/7.png',
      title: lang === 'nl' ? 'Sortering Grondstoffen' : (lang === 'de' ? 'Rohstoffsortierung' : (lang === 'ro' ? 'Sortare Materii Prime' : 'Raw Materials Sorting')),
      desc: lang === 'nl' ? 'Lokaal ingekochte duurzame beukenhouten stammen.' : (lang === 'de' ? 'Nachhaltige Buchenholzstämme aus lokaler Beschaffung.' : (lang === 'ro' ? 'Bușteni din lemn de fag sustenabili din surse locale.' : 'Locally sourced sustainable beech wood logs.')),
    },
    {
      id: 2,
      image: '/images/6.png',
      title: lang === 'nl' ? 'Eerste Zaagbewerkingen' : (lang === 'de' ? 'Primäre Sägearbeiten' : (lang === 'ro' ? 'Debitarea primară a buștenilor' : 'Primary Sawing Operations')),
      desc: lang === 'nl' ? 'Geavanceerde zaaglijnen en het zagen van planken.' : (lang === 'de' ? 'High-Tech-Stammzerlegung und Zuschnitt von Schnittholz.' : (lang === 'ro' ? 'Debitarea buștenilor și tăierea cherestelei cu tehnologie avansată.' : 'High-tech log breakdown and sawn timber cutting.')),
    },
    {
      id: 3,
      image: '/images/1.png',
      title: lang === 'nl' ? 'Natuurlijke Luchtdroging' : (lang === 'de' ? 'Freilufttrocknung' : (lang === 'ro' ? 'Uscare Naturală la Aer' : 'Natural Air Drying')),
      desc: lang === 'nl' ? 'Gelijkmatige natuurlijke luchtdroging (AD) voor maximale houtstabiliteit.' : (lang === 'de' ? 'Gleichmäßige Freilufttrocknung (AD) für maximale Holzstabilität.' : (lang === 'ro' ? 'Uscare naturală uniformă la aer (AD) pentru stabilitate maximă.' : 'Uniform natural air drying (AD) for maximum timber stability.')),
    },
    {
      id: 4,
      image: '/images/kilns.jpg',
      title: lang === 'nl' ? 'Geconditioneerde Opslag' : (lang === 'de' ? 'Konditionierte Lagerung' : (lang === 'ro' ? 'Depozitare Condiționată' : 'Conditioned Storage')),
      desc: lang === 'nl' ? 'Geconditioneerde opslagruimtes voor een constant behoud van kwaliteit.' : (lang === 'de' ? 'Konditionierte Lagerräume für beständige Holzqualität.' : (lang === 'ro' ? 'Spații de depozitare condiționate pentru menținerea constantă a calității.' : 'Conditioned storage facilities to ensure consistent wood quality.')),
    },
    {
      id: 5,
      image: '/images/5.png',
      title: lang === 'nl' ? 'Slijperij Werkplaats' : (lang === 'de' ? 'Schärfwerkstatt' : (lang === 'ro' ? 'Atelier de ascuțire scule' : 'Sharpening Workshop')),
      desc: lang === 'nl' ? 'Onze slijperij' : (lang === 'de' ? 'Unsere Schärfwerkstatt' : (lang === 'ro' ? 'Atelierul nostru de ascuțire' : 'Our sharpening workshop')),
    },
    {
      id: 6,
      image: '/images/2.png',
      title: lang === 'nl' ? 'Beukenhouten Stokkenproductie' : (lang === 'de' ? 'Buchenholzstäbe-Produktion' : (lang === 'ro' ? 'Producție Tije din Lemn de Fag' : 'Beech Stick Production')),
      desc: lang === 'nl' ? 'Hoge capaciteit gerilde en gladde stokken.' : (lang === 'de' ? 'Hochleistungslinien für geriffelte und glatte Stäbe.' : (lang === 'ro' ? 'Linii de mare capacitate pentru tije canelate și netede.' : 'High capacity rilled and smooth stick production lines.')),
    },
    {
      id: 7,
      image: '/images/3.png',
      title: lang === 'nl' ? 'Customising en labeling' : (lang === 'de' ? 'Anpassung & Etikettierung' : (lang === 'ro' ? 'Controlul calității și Sortare premium' : 'Customization & Labeling')),
      desc: lang === 'nl' ? 'Strenge visuele controle om premium houtklassen te garanderen.' : (lang === 'de' ? 'Strenge visuelle Prüfung zur Gewährleistung erstklassiger Holzqualitäten.' : (lang === 'ro' ? 'Control vizual riguros pentru a garanta clase de lemn premium.' : 'Rigorous visual check to guarantee premium wood grades.')),
    },
    {
      id: 8,
      image: '/images/8.png',
      title: lang === 'nl' ? 'Logistieke Ondersteuning' : (lang === 'de' ? 'Globale Logistik-Unterstützung' : (lang === 'ro' ? 'Suport Logistic Global' : 'Global Logistics Support')),
      desc: lang === 'nl' ? 'Exportklare verpakking en bundeling voor doe-het-zelf-bouwmarkten.' : (lang === 'de' ? 'Exportfertige Verpackung und Bündelung für Baumärkte.' : (lang === 'ro' ? 'Ambalare pregătită pentru export și ambalare în pachete pentru hypermarketuri DIY.' : 'Export-ready packaging and DIY hypermarket bundling.')),
    },
    {
      id: 9,
      image: '/images/specials_gallery.jpg',
      title: lang === 'nl' ? 'Slats sticks and profiles' : (lang === 'de' ? 'Leisten, Stäbe und Profile' : (lang === 'ro' ? 'Șipci, tije și profile' : 'Slats, sticks and profiles')),
      desc: lang === 'nl' ? 'Diverse op maat gemaakte draai- en freesonderdelen uit onze productie.' : (lang === 'de' ? 'Verschiedene kundenspezifische Dreh- und Frästeile aus unserer Produktion.' : (lang === 'ro' ? 'Diverse componente strunjite și frezate la comandă din producția noastră.' : 'Various custom-turned and milled beechwood components from our production.')),
    },
  ];

  const t = {
    galleryBadge: { nl: 'Media Galerij', en: 'Media Gallery', de: 'Mediengalerie', ro: 'Galerie Media' },
    galleryTitle: { nl: 'Fabrieks- & Productiemedia', en: 'Factory & Production Media', de: 'Fabrik- & Produktionsmedien', ro: 'Media Fabrică & Producție' },
    gallerySub: {
      nl: "Bekijk de foto's en video's van onze zagerij en op maat gemaakte productieprocessen in Brad, Roemenië.",
      en: "Explore the photos and videos of our sawmill operations and custom manufacturing processes in Brad, Romania.",
      de: "Entdecken Sie die Fotos und Videos unserer Sägewerksbetriebe und kundenspezifischen Fertigungsprozesse in Brad, Rumänien.",
      ro: "Explorați fotografiile și videoclipurile cu operațiunile gaterului și procesele de producție personalizate din Brad, România."
    },
    videoTitle: { nl: 'Ons Verwerkingsproces', en: 'Our Milling Process', de: 'Unser Fräsprozess', ro: 'Procesul Nostru de Frezare' },
    videoDesc: {
      nl: "Ervaar de precisie van houtbewerking. Onze ultramoderne zagerij combineert generaties Roemeens vakmanschap met geavanceerde Europese zaagtechnologieën, waarbij elke snede tot op de micrometer nauwkeurig wordt gekalibreerd voor eersteklas, duurzame beukenhouten componenten.",
      en: "Experience the precision of wood transformation. Our state-of-the-art milling facility combines generations of Romanian craftsmanship with advanced European sawing technologies, calibrating every cut to micron-level perfection for premium, sustainable beechwood components.",
      de: "Erleben Sie die Präzision der Holzverwandlung. Unsere hochmoderne Fräsanlage verbindet Generationen rumänischer Handwerkskunst mit fortschrittlichen europäischen Sägetechnologien und kalibriert jeden Schnitt bis zur Perfektion auf Mikrometer-Ebene für erstklassige, nachhaltige Buchenholzkomponenten.",
      ro: "Experimentați precizia transformării lemnului. Unitatea noastră de frezare de ultimă generație îmbină generații de meșteșug românesc cu tehnologii europene avansate de tăiere, calibrând fiecare tăietură la perfecțiune la nivel de microni pentru componente premium și durabile din lemn de fag."
    },
    breadcrumb: {
      nl: 'Bedrijfsprofiel',
      en: 'Company Profile',
      de: 'Unternehmensprofil',
      ro: 'Profilul Companiei'
    },
    title: {
      nl: 'Bedrijfsidentiteit & Waarden',
      en: 'Corporate Identity & Values',
      de: 'Unternehmensidentität & Werte',
      ro: 'Identitate Corporativă & Valori'
    },
    subtitle: {
      nl: 'Rechtstreeks van de bron: Kwaliteit, betrouwbaarheid en precisie in beukenhoutproductie uit het district Hunedoara, Roemenië.',
      en: 'Direct from the source: Quality, reliability, and precision beechwood manufacturing from Hunedoara County, Romania.',
      de: 'Direkt von der Quelle: Qualität, Zuverlässigkeit und präzise Buchenholzverarbeitung aus dem Kreis Hunedoara, Rumänien.',
      ro: 'Direct de la sursă: Calitate, fiabilitate și producție de precizie din lemn de fag din județul Hunedoara, România.'
    },
    identityBadge: {
      nl: 'Onze Identiteit',
      en: 'Our Identity',
      de: 'Unsere Identität',
      ro: 'Identitatea Noastră'
    },
    whoWeAre: {
      nl: 'Wie Wij Zijn',
      en: 'Who We Are',
      de: 'Wer Wir Sind',
      ro: 'Cine Suntem'
    },
    quoteLead: {
      nl: '"Wij produceren beukenhouten componenten op maat, afgestemd op de specifieke wensen van onze klanten."',
      en: '"We produce custom beechwood components, tailored to the specific wishes of our customers."',
      de: '"Wir produzieren maßgeschneiderte Buchenholzkomponenten, die auf die spezifischen Wünsche unserer Kunden abgestimmt sind."',
      ro: '"Producem componente din lemn de fag la comandă, adaptate dorințelor specifice ale clienților noștri."'
    },
    desc1: {
      nl: 'Palrom Products SRL werd opgericht in 1999 en is uitgegroeid tot een betrouwbare leverancier van hoogwaardige beukenhouten producten voor klanten in heel Europa. Vanuit ons bedrijf in het district Hunedoara, Roemenië, verwerken wij lokaal ingekocht hout uit duurzaam beheerde bossen. Dankzij deze korte aanvoerketen beperken wij transportafstanden en de bijbehorende CO₂-uitstoot.',
      en: 'Palrom Products SRL was founded in 1999 and has grown into a reliable supplier of high-quality beechwood products for customers throughout Europe. From our facility in Hunedoara County, Romania, we process locally sourced timber from sustainably managed forests. Thanks to this short supply chain, we limit transport distances and the associated CO₂ emissions.',
      de: 'Palrom Products SRL wurde 1999 gegründet und hat sich zu einem zuverlässigen Lieferanten von hochwertigen Buchenholzprodukten für Kunden in ganz Europa entwickelt. Von unserem Standort im Kreis Hunedoara, Rumänien, aus verarbeiten wir lokal bezogenes Holz aus nachhaltig bewirtschafteten Wäldern. Dank dieser kurzen Lieferkette minimieren wir Transportwege und die damit verbundenen CO₂-Emissionen.',
      ro: 'Palrom Products SRL a fost fondată în 1999 și a devenit un furnizor de încredere de produse din lemn de fag de înaltă calitate pentru clienți din întreaga Europă. De la sediul nostru din județul Hunedoara, România, procesăm lemn achiziționat local din păduri gestionate în mod durabil. Datorită acestui lanț scurt de aprovizionare, limităm distanțele de transport și emisiile de CO₂ asociate.'
    },
    desc2: {
      nl: 'Met onze geïntegreerde productie, van rondhout tot eindproduct, leveren wij gezaagde bestekken, geschaafde stokken, latten en profielen aan klanten in de meubel-, bouw- en houtverwerkende industrie. Of het nu gaat om standaardproducten of klantspecifieke maatwerkoplossingen, kwaliteit, betrouwbaarheid en precisie staan altijd centraal.',
      en: 'With our integrated production – from round logs to final products – we deliver specials, planed sticks, slats, and profiles to customers in the furniture, construction, and wood-processing industries. Whether standard products or customer-specific custom solutions, quality, reliability, and precision are always central.',
      de: 'Mit unserer integrierten Produktion – vom Rundholz bis zum Endprodukt – liefern wir Zuschnitte, gehobelte Stäbe, Leisten und Profile an Kunden in der Möbel-, Bau- und Holzindustrie. Ob Standardprodukte oder kundenspezifische Sonderlösungen – Qualität, Zuverlässigkeit und Präzision stehen immer im Mittelpunkt.',
      ro: 'Prin producția noastră integrată – de la buștean la produsul finit – livrăm piese brute, tije rinduite, șipci și profile clienților din industria mobilei, a construcțiilor și a prelucrării lemnului. Fie că este vorba despre produse standard sau soluții personalizate la comandă, calitatea, fiabilitatea și precizia sunt întotdeauna pe primul loc.'
    },
    desc3: {
      nl: 'Onze langdurige relaties met klanten zijn gebaseerd op flexibiliteit, vakmanschap en een voortdurende focus op duurzaamheid en verantwoord bosbeheer.',
      en: 'Our long-term relationships with customers are based on flexibility, craftsmanship, and a continuous focus on sustainability and responsible forest management.',
      de: 'Unsere langfristigen Beziehungen zu Kunden basieren auf Flexibilität, handwerklichem Geschick und einer kontinuierlichen Fokussierung auf Nachhaltigkeit und verantwortungsvolle Forstwirtschaft.',
      ro: 'Relațiile noastre de lungă durată cu clienții se bazează pe flexibilitate, meșteșug și o concentrare continuă pe durabilitate și managementul forestier responsabil.'
    },
    floatingCard: {
      nl: 'Wij verwerken FSC®-gecertificeerd hout uit respect voor ons milieu en toekomstige generaties.',
      en: 'We process FSC® certified timber out of respect for our environment and future generations.',
      de: 'Wir verarbeiten FSC®-zertifiziertes Holz aus Respekt vor unserer Umwelt und zukünftigen Generationen.',
      ro: 'Procesăm lemn certificat FSC® din respect pentru mediul nostru și generațiile viitoare.'
    },
    whyChooseTitle: {
      nl: 'Waarom Kiezen voor PALROM?',
      en: 'Why Choose PALROM?',
      de: 'Warum PALROM wählen?',
      ro: 'De ce să Alegeți PALROM?'
    },
    whyChooseTitleSub: {
      nl: 'Hoge Capaciteit, Maatwerk Uitvoering',
      en: 'High Capacity, Customized Execution',
      de: 'Hohe Kapazität, maßgeschneiderte Ausführung',
      ro: 'Capacitate Ridicată, Execuție Personalizată'
    },
    whyChooseDesc: {
      nl: 'Wij leveren niet alleen hout; wij ontwerpen oplossingen op maat die het rendement verhogen en de productiekosten verlagen voor uw timmerwerk en meubelproductie.',
      en: "We don't just supply wood; we tailor solutions that increase yield and lower fabrication costs for your carpentry and manufacturing projects.",
      de: 'Wir liefern nicht nur Holz; wir passen Lösungen an, die den Ertrag steigern und die Herstellungskosten für Ihre Zimmerei- und Herstellungsprojekte senken.',
      ro: 'Nu furnizăm doar lemn; adaptăm soluții care cresc randamentul și reduc costurile de fabricare pentru proiectele dvs. de tâmplărie și producție.'
    },
    dryingTitle: {
      nl: 'Natuurlijke Droging & Geconditioneerde Opslag',
      en: 'Natural Air Drying & Conditioned Storage',
      de: 'Freilufttrocknung & Konditionierte Lagerung',
      ro: 'Uscare Naturală & Depozitare Condiționată'
    },
    dryingDesc: {
      nl: 'Onze geconditioneerde opslag en natuurlijke luchtdrogingsfaciliteiten garanderen een optimale stabilisatie van het hout, wat werking bij de meubelproductie voorkomt.',
      en: 'Our conditioned storage and natural air drying facilities guarantee optimal wood stabilization, preventing movement during furniture production.',
      de: 'Unsere konditionierte Lagerung und Freilufttrocknung garantieren eine optimale Holzstabilisierung und verhindern Verzug bei der Möbelherstellung.',
      ro: 'Depozitarea noastră condiționată și facilitățile de uscare naturală garantează stabilizarea optimă a lemnului, prevenind deformarea în producția de mobilier.'
    },
    retailTitle: {
      nl: 'Winkelklare Opties',
      en: 'Retail-Ready Options',
      de: 'Einzelhandelsfertige Optionen',
      ro: 'Opțiuni Gata pentru Retail'
    },
    retailDesc: {
      nl: 'Voor de doe-het-zelfmarkt leveren we individuele EAN-barcode-etikettering en winkelklare bundels en verpakkingen op maat.',
      en: 'For Do-It-Yourself markets, we provide individual EAN barcode labeling and retail-ready bundles and custom packaging.',
      de: 'Für Baumärkte bieten wir individuelle EAN-Barcode-Etikettierung und einzelhandelsfertige Bündel sowie maßgeschneiderte Verpackungen.',
      ro: 'Pentru piețele de bricolaj, oferim etichetare individuală cu coduri de bare EAN, pachete gata pentru vânzare și ambalaje personalizate.'
    },
    reachTitle: {
      nl: 'Multinationaal Bereik',
      en: 'Multinational Reach',
      de: 'Multinationale Reichweite',
      ro: 'Prezență Multinațională'
    },
    reachDesc: {
      nl: 'Wij leveren aan klanten in Duitsland, Frankrijk, Oostenrijk, Spanje, Portugal, Italië, Polen en Japan, met speciale en strategische opslagfaciliteiten in Nederland.',
      en: 'Serving clients in Germany, France, Austria, Spain, Portugal, Italy, Poland, and Japan, with dedicated and strategic warehousing facilities in the Netherlands.',
      de: 'Wir bedienen Kunden in Deutschland, Frankreich, Österreich, Spanien, Portugal, Italien, Polen und Japan mit eigener Lagerhaltung und strategischen Logistikstandorten in den Niederlanden.',
      ro: 'Servim clienți din Germania, Franța, Austria, Spania, Portugalia, Italia, Polonia și Japonia, cu facilități de depozitare dedicate și strategice în Olanda.'
    },
    brochureTitle: {
      nl: 'Geïnteresseerd in onze technische afmetingen en specificaties?',
      en: 'Interested in our technical dimensions and specifications?',
      de: 'Interessiert an unseren technischen Maßen und Spezifikationen?',
      ro: 'Sunteți interesat de dimensiunile și specificațiile noastre tehnice?'
    },
    brochureDesc: {
      nl: 'Download onze officiële bedrijfsbrochure inclusief alle maattabellen, verpakkingsconfiguraties en kwaliteitsklassen.',
      en: 'Download our official corporate brochure including all sizing tables, packaging configurations, and grades.',
      de: 'Laden Sie unsere offizielle Unternehmensbroschüre herunter, einschließlich aller Größentabellen, Verpackungskonfigurationen und Qualitäten.',
      ro: 'Descărcați broșura noastră oficială corporativă, inclusiv toate tabelele de dimensiuni, configurațiile de ambalare și clasele de calitate.'
    },
    brochureBtn: {
      nl: 'Brochure Downloaden',
      en: 'Download Brochure',
      de: 'Broschüre herunterladen',
      ro: 'Descărcați Broșura'
    },
    journeyBadge: {
      nl: 'Bedrijfsreis',
      en: 'Company Journey',
      de: 'Unternehmensentwicklung',
      ro: 'Parcursul Companiei'
    },
    journeyTitle: {
      nl: 'Mijlpalen van Groei',
      en: 'Milestones of Growth',
      de: 'Meilensteine des Wachstums',
      ro: 'Repere de Dezvoltare'
    },
    journeyDesc: {
      nl: 'Volg onze tijdlijn om te zien hoe Palrom Products groeide van een nieuwbouwlocatie tot een internationale fabrikant van beukenhout.',
      en: 'Follow our timeline to see how Palrom Products grew from a greenfield facility to an international beechwood manufacturer.',
      de: 'Verfolgen Sie unsere Zeitleiste, um zu sehen, wie Palrom Products von einer Greenfield-Anlage zu einem internationalen Buchenholzhersteller heranwuchs.',
      ro: 'Urmăriți istoricul nostru pentru a vedea cum Palrom Products a crescut de la o unitate greenfield la un producător internațional de lemn de fag.'
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
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <span>{getTranslation('breadcrumb')}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('title')}</h1>
          <p>{getTranslation('subtitle')}</p>
        </div>
      </section>

      {/* Video & Photo Gallery Section (Bovenaan Bedrijfsprofiel) */}
      <section id="gallery-details" className="gallery-section section-padding bg-white">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">
              {getTranslation('galleryBadge')}
            </span>
            <h2 className="section-title">
              {getTranslation('galleryTitle')}
            </h2>
            <p className="section-subtitle">
              {getTranslation('gallerySub')}
            </p>
          </div>

          <div className="gallery-split-layout">
            {/* Video Column */}
            <div className="gallery-video-column animate-on-scroll">
              <div 
                ref={wrapperRef}
                className="gallery-video-wrapper"
                onClick={togglePlayPause}
                onMouseMove={resetControlsTimer}
                onMouseEnter={resetControlsTimer}
                onMouseLeave={() => {
                  if (videoRef.current && !videoRef.current.paused) {
                    setControlsVisible(false);
                  }
                }}
              >
                <video
                  ref={videoRef}
                  key={`${videoLang}-v5.10.67`}
                  className="gallery-video"
                  src={`/images/palrom-corporate-video-${videoLang}.mp4?v=5.10.71`}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setVideoCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current && videoRef.current.duration) {
                      setVideoDuration(videoRef.current.duration);
                    }
                  }}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />

                {/* Center Play Overlay when Paused */}
                <div className={`video-center-play-overlay ${!isVideoPlaying ? 'paused' : ''}`}>
                  <i className="fa-solid fa-play"></i>
                </div>

                {/* Bottom Full Controls Bar */}
                <div 
                  className={`video-controls-bottom ${controlsVisible || !isVideoPlaying ? 'visible' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Progress Bar / Scrubber */}
                  <div 
                    ref={progressRef}
                    className="video-progress-container" 
                    onClick={handleSeek}
                    title="Klik om te spoelen"
                  >
                    <div className="video-progress-bg">
                      <div 
                        className="video-progress-fill" 
                        style={{ width: `${(videoCurrentTime / (videoDuration || 1)) * 100}%` }}
                      />
                      <div 
                        className="video-progress-thumb" 
                        style={{ left: `${(videoCurrentTime / (videoDuration || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="video-controls-row">
                    <div className="video-controls-left">
                      {/* Play/Pause */}
                      <button 
                        type="button" 
                        className="video-ctrl-btn" 
                        onClick={togglePlayPause} 
                        aria-label={isVideoPlaying ? 'Pauzeren' : 'Afspelen'}
                        title={isVideoPlaying ? 'Pauzeren' : 'Afspelen'}
                      >
                        <i className={`fa-solid ${isVideoPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                      </button>

                      {/* Sound */}
                      <button 
                        type="button" 
                        className="video-ctrl-btn" 
                        onClick={(e) => {
                          toggleVideoSound(e);
                          resetControlsTimer();
                        }} 
                        aria-label={isVideoMuted ? 'Geluid aanzetten' : 'Geluid dempen'}
                        title={isVideoMuted ? 'Geluid aanzetten' : 'Geluid dempen'}
                      >
                        <i className={`fa-solid ${isVideoMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                      </button>

                      {/* Time */}
                      <span className="video-time-display">
                        {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                      </span>
                    </div>

                    <div className="video-controls-right">
                      {/* Fullscreen */}
                      <button 
                        type="button" 
                        className="video-ctrl-btn" 
                        onClick={toggleFullscreen} 
                        aria-label="Volledig scherm"
                        title="Volledig scherm"
                      >
                        <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slideshow Column */}
            <div 
              className="gallery-slideshow-column animate-on-scroll"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
            >
              <div className="slideshow-container">
                <span className="slideshow-counter">
                  {activeSlide + 1} / {galleryItems.length}
                </span>

                <button 
                  className="slideshow-arrow slideshow-arrow-left" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
                  }}
                  aria-label="Previous slide"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                <button 
                  className="slideshow-arrow slideshow-arrow-right" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev + 1) % galleryItems.length);
                  }}
                  aria-label="Next slide"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>

                <div className="slideshow-slides">
                  {galleryItems.map((item, idx) => (
                    <div 
                      className={`slideshow-slide ${idx === activeSlide ? 'active' : ''}`} 
                      key={item.id}
                      onClick={() => setActiveSlide((prev) => (prev + 1) % galleryItems.length)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" 
                        style={{ objectFit: 'cover' }} 
                        priority={idx === 0}
                      />
                      <div className="gallery-overlay">
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consolidated Navigation & Dots Row */}
              <div className="slideshow-controls-dots-row">
                <button 
                  className="slideshow-dots-arrow" 
                  onClick={() => setActiveSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)}
                  aria-label="Previous slide"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                <div className="slideshow-dots">
                  {galleryItems.map((_, idx) => (
                    <button
                      key={idx}
                      className={`slideshow-dot ${idx === activeSlide ? 'active' : ''}`}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button 
                  className="slideshow-dots-arrow" 
                  onClick={() => setActiveSlide((prev) => (prev + 1) % galleryItems.length)}
                  aria-label="Next slide"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profile & Environmental Commitment Section */}
      <section id="about-details" className="about-section section-padding bg-dark text-light">
        <div className="container">
          <div className="grid grid-2 align-items-center">
            <div className="about-image-column animate-on-scroll">
              <div className="image-stack">
                <Image
                  src="/images/hero_bg.jpg"
                  alt="Aerial view of Palrom Products Brad sawmill facilities"
                  className="img-responsive rounded-lg shadow-lg"
                  width={1024}
                  height={502}
                  priority
                />
                <div className="about-floating-card">
                  <i className="fa-solid fa-leaf text-accent"></i>
                  <p>{getTranslation('floatingCard')}</p>
                  <a
                    href="/palrom_fsc_certificate.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      marginTop: '1.25rem',
                      textDecoration: 'underline'
                    }}
                  >
                    <i className="fa-solid fa-file-pdf"></i>{' '}
                    {lang === 'nl'
                      ? 'Bekijk FSC® Certificaat'
                      : (lang === 'de'
                        ? 'FSC®-Zertifikat ansehen'
                        : (lang === 'ro'
                          ? 'Vezi Certificatul FSC®'
                          : 'View FSC® Certificate'))}
                  </a>
                </div>
              </div>
            </div>
            <div className="about-text-column animate-on-scroll">
              <span className="section-badge badge-accent">{getTranslation('identityBadge')}</span>
              <h2 className="section-title text-white">{getTranslation('whoWeAre')}</h2>
              <p className="lead">{getTranslation('quoteLead')}</p>
              <p>{getTranslation('desc1')}</p>
              <p>{getTranslation('desc2')}</p>
              <p>{getTranslation('desc3')}</p>

              <div className="about-quote">
                <p className="quote-text">
                  {lang === 'nl'
                    ? '"Wij denken graag met u mee om de meest efficiënte en duurzame oplossing voor uw bedrijf te realiseren."'
                    : (lang === 'de'
                      ? '"Wir denken gerne mit Ihnen mit, um die effizienteste und nachhaltigste Lösung für Ihr Unternehmen zu realisieren."'
                      : (lang === 'ro'
                        ? '"Ne face plăcere să gândim alături de dumneavoastră pentru a realiza cea mai eficientă și durabilă soluție pentru afacerea dumneavoastră."'
                        : '"We are happy to think along with you to realize the most efficient and sustainable solution for your business."'))}
                </p>
                <div className="quote-author">
                  <strong>Gabriela Cioara</strong>
                  <span>{lang === 'nl' ? 'Algemeen Directeur' : (lang === 'de' ? 'Geschäftsführerin' : (lang === 'ro' ? 'Director General' : 'General Manager'))}, Palrom Products SRL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PALROM Section */}
      <section className="why-us-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="section-badge">{getTranslation('whyChooseTitle')}</span>
            <h2 className="section-title">{getTranslation('whyChooseTitleSub')}</h2>
            <p className="section-subtitle">{getTranslation('whyChooseDesc')}</p>
          </div>

          <div className="grid grid-3">
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <h3>{getTranslation('dryingTitle')}</h3>
              <p>{getTranslation('dryingDesc')}</p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-tag"></i>
              </div>
              <h3>{getTranslation('retailTitle')}</h3>
              <p>{getTranslation('retailDesc')}</p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>{getTranslation('reachTitle')}</h3>
              <p>{getTranslation('reachDesc')}</p>
            </div>
          </div>

          <div className="brochure-download-container animate-on-scroll">
            <div className="brochure-content">
              <i className="fa-solid fa-file-pdf pdf-large-icon"></i>
              <div>
                <h3>{getTranslation('brochureTitle')}</h3>
                <p>{getTranslation('brochureDesc')}</p>
              </div>
            </div>
            <a
              href="/palrom_brochure.pdf"
              download="palrom_brochure.pdf"
              className="btn btn-primary"
            >
              <i className="fa-solid fa-download icon-left"></i> {getTranslation('brochureBtn')}
            </a>
          </div>
        </div>
      </section>

      {/* Interactive History Timeline Section */}
      <section id="timeline-details" className="timeline-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">{getTranslation('journeyBadge')}</span>
            <h2 className="section-title">{getTranslation('journeyTitle')}</h2>
            <p className="section-subtitle">{getTranslation('journeyDesc')}</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>

            {timelineEvents.map((evt, i) => (
              <div key={i} className={`timeline-item animate-on-scroll ${evt.align}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content-card">
                  {evt.year === '2010' && (
                    <div className="fsc-timeline-logo-wrapper" style={{ marginBottom: '1.25rem' }}>
                      <Image
                        src="/images/fsc_logo.png"
                        alt="FSC Logo"
                        width={60}
                        height={75}
                        style={{
                          height: '75px',
                          width: 'auto',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>
                  )}
                  <span className="timeline-year">
                    {typeof evt.year === 'object' ? evt.year[lang] || evt.year.nl : evt.year}
                  </span>
                  <h3>{evt.title[lang] || evt.title.nl}</h3>
                  <p>{evt.description[lang] || evt.description.nl}</p>
                  {evt.year === '2010' && (
                    <a
                      href="/palrom_fsc_certificate.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-dark btn-sm"
                      style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      <i className="fa-solid fa-file-pdf icon-left"></i>{' '}
                      {lang === 'nl'
                        ? 'Download FSC® Certificaat (PDF)'
                        : (lang === 'de'
                          ? 'FSC®-Zertifikat herunterladen (PDF)'
                          : (lang === 'ro'
                            ? 'Descarcă Certificatul FSC® (PDF)'
                            : 'Download FSC® Certificate (PDF)'))}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
