'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function Profiles() {
  const { lang } = useInquiry();

  const profileProducts = [
    {
      id: 'profile-semiround',
      name: {
        nl: 'Halfrond profiel',
        en: 'Semiround Profile',
        de: 'Halbrondprofil',
        ro: 'Profil Semirotund',
      },
      description: {
        nl: 'Perfect afgeronde bolle sierlijsten gebruikt als decoratieve afdekstrips, kastranden en op maat gemaakte meubelversieringen. Levert een zachte, strakke rand.',
        en: 'Perfectly rounded convex mouldings used as decorative cover strips, cabinet edging, and custom furniture embellishments. Delivers a soft, clean border.',
        de: 'Perfekt abgerundete konvexe Zierleisten, die als dekorative Abdeckstreifen, Kantenleisten und maßgeschneiderte Möbelverzierungen verwendet werden. Bietet einen weichen, sauberen Abschluss.',
        ro: 'Șipci decorative convexe perfect rotunjite, utilizate ca benzi decorative de acoperire, canturi de dulap și ornamente personalizate de mobilier. Oferă o margine moale și curată.',
      },
      image: '/images/profile1.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-strip',
      name: {
        nl: 'Plat profiel (Strip)',
        en: 'Profile Strip',
        de: 'Flachprofil (Leiste)',
        ro: 'Profil Șipcă Plată',
      },
      description: {
        nl: 'Rechte, dunne platte houten stripprofielen. Veel gebruikt als deklijsten, paneellijsten of eenvoudige kierafdekkingen in de binnenafwerking.',
        en: 'Straight, thin flat wood strip profiles. Commonly utilized as cover mouldings, panel framing, or simple gap covers in interior finish carpentry.',
        de: 'Gerade, dünne, flache Holzleistenprofile. Häufig verwendet als Abdeckleisten, Rahmenprofile oder einfache Spaltabdeckungen im Innenausbau.',
        ro: 'Profile drepte și subțiri de șipcă plată din lemn. Utilizate în mod obișnuit ca șipci de acoperire, cadre de panouri sau acoperiri simple de spații în tâmplăria de finisaj interior.',
      },
      image: '/images/profile2.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-finish-v1',
      name: {
        nl: 'Afwerkingsprofiel (Variant 1)',
        en: 'Profile Finishing (Variant 1)',
        de: 'Profil-Abschlussleiste (Variante 1)',
        ro: 'Profil Finisaj (Varianta 1)',
      },
      description: {
        nl: 'Speciaal decoratief afwerkingsprofiel met elegante rondingen. Ontworpen voor overgangsverbindingen tussen wanden, plafonds of meubelkasten.',
        en: 'Specialty decorative finishing moulding with elegant curvature. Designed for transition joints between walls, ceilings, or furniture cabinets.',
        de: 'Spezielles dekoratives Abschlussprofil mit eleganter Krümmung. Konzipiert für Übergangsverbindungen zwischen Wänden, Decken oder Möbelkorpussen.',
        ro: 'Șipcă decorativă specială de finisaj cu o curbură elegantă. Proiectată pentru îmbinările de tranziție între pereți, tavane sau corpuri de mobilier.',
      },
      image: '/images/profile3.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-quarter-v1',
      name: {
        nl: 'Kwartrond profiel (Variant 1)',
        en: 'Profile Quarter Round (Variant 1)',
        de: 'Viertelrundprofil (Variante 1)',
        ro: 'Profil Sfert de Cerc (Varianta 1)',
      },
      description: {
        nl: 'Klassiek 90 graden gebogen kwartrond profiel, perfect voor plintvloer-kieren, binnenhoekverbindingen en decoratieve aftimmering.',
        en: 'Classic 90-degree curved quarter-round profile, perfect for baseboard floor gaps, inside corner joints, and decorative carpentry casing.',
        de: 'Klassisches, um 90 Grad gekrümmtes Viertelrundprofil, ideal für Sockelleistenspalte, Innenecken und dekorative Verkleidungen.',
        ro: 'Profil clasic de sfert de cerc curbat la 90 de grade, perfect pentru acoperirea spațiilor de la plinte, îmbinările colțurilor interioare și finisajele decorative de tâmplărie.',
      },
      image: '/images/profile4.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-finish-v2',
      name: {
        nl: 'Afwerkingsprofiel (Variant 2)',
        en: 'Profile Finishing (Variant 2)',
        de: 'Profil-Abschlussleiste (Variante 2)',
        ro: 'Profil Finisaj (Varianta 2)',
      },
      description: {
        nl: 'Alternatief decoratief randprofiel met dubbele profilering. Voegt diepte en een premium uitstraling toe aan houten kozijnen en deuromlijstingen.',
        en: 'Alternate decorative border profile showing double-stepped details. Adds depth and a premium look to wood frames and door casings.',
        de: 'Alternatives dekoratives Randprofil mit zweistufigen Details. Verleiht Holzrahmen und Türzargen Tiefe und ein hochwertiges Aussehen.',
        ro: 'Profil decorativ alternativ de margine care prezintă detalii în două trepte. Adaugă profunzime și un aspect premium ramelor de lemn și tocurilor de uși.',
      },
      image: '/images/profile5.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-plinth-v1',
      name: {
        nl: 'Plintprofiel (Variant 1)',
        en: 'Profile Plinth (Variant 1)',
        de: 'Sockelleistenprofil (Variante 1)',
        ro: 'Profil Plintă (Varianta 1)',
      },
      description: {
        nl: 'Standaard plintprofiel gebruikt als robuuste wand-tot-vloer afwerking. Beschermt muren en creëert tegelijkertijd een elegant houten accent.',
        en: 'Standard plinth profile used as a robust wall-to-floor baseboard trim. Protects walls while creating an elegant wood border accent.',
        de: 'Standard-Sockelleistenprofil zur Verwendung als robustes Wand-Boden-Abschlussbrett. Schützt die Wände und setzt gleichzeitig einen eleganten Holzakzent.',
        ro: 'Profil standard de plintă utilizat ca finisaj robust de la perete la podea. Protejează pereții în timp ce creează un accent elegant de margine din lemn.',
      },
      image: '/images/profile6.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-corner-v1',
      name: {
        nl: 'Hoekprofiel (Variant 1)',
        en: 'Profile Corner (Variant 1)',
        de: 'Eckprofil (Variante 1)',
        ro: 'Profil de Colț (Varianta 1)',
      },
      description: {
        nl: 'L-vormig buitenhoekprofiel. Biedt beschermende afdekking en hoge duurzaamheid voor kwetsbare muurranden of hoeken van kasten.',
        en: 'L-shaped outside corner moulding. Provides protective cover and high durability to vulnerable wall edges or cabinetry corners.',
        de: 'L-förmiges Außeneckprofil. Bietet Schutz und hohe Haltbarkeit für empfindliche Wandkanten oder Schrankecken.',
        ro: 'Șipcă în formă de L pentru colțuri exterioare. Oferă protecție și durabilitate ridicată marginilor vulnerabile de pereți sau colțurilor de dulapuri.',
      },
      image: '/images/profile7.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-corner-v2',
      name: {
        nl: 'Hoekprofiel (Variant 2)',
        en: 'Profile Corner (Variant 2)',
        de: 'Eckprofil (Variante 2)',
        ro: 'Profil de Colț (Varianta 2)',
      },
      description: {
        nl: 'L-vormig hoekprofiel met subtiel afgeronde randen. Biedt een gladde, veilige buitenhoek voor houtbekledingen.',
        en: 'L-shaped corner cover showcasing subtle edge rounding. Provides a smooth, safe external edge corner for wood claddings.',
        de: 'L-förmiges Eckprofil mit subtiler Kantenabrundung. Bietet eine glatte, sichere Außenkante für Holzverkleidungen.',
        ro: 'Profil de colț în formă de L care prezintă o rotunjire subtilă a marginii. Oferă un colț exterior neted și sigur pentru placările din lemn.',
      },
      image: '/images/profile8.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-triangular',
      name: {
        nl: 'Driehoekig profiel',
        en: 'Profile Triangular',
        de: 'Dreiecksprofil',
        ro: 'Profil Triunghiular',
      },
      description: {
        nl: 'Strakke, driehoekige hoekprofielen. Meestal gebruikt voor interne constructieve ondersteuning, betonvelling of scherpe binnenhoekdecoratie.',
        en: 'Clean, triangular corner-block profiles. Typically used for internal support framing, concrete chamfering, or sharp inside corner decorations.',
        de: 'Saubere, dreieckige Eckprofile. Typischerweise verwendet für interne Stützrahmen, Betonkantenfasung oder scharfe Inneneckdekorationen.',
        ro: 'Profile triunghiulare curate pentru colțuri. Utilizate de obicei pentru cadre de suport intern, teșirea betonului sau decorarea colțurilor interioare ascuțite.',
      },
      image: '/images/profile9.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-quarter-v2',
      name: {
        nl: 'Kwartrond profiel (Variant 2)',
        en: 'Profile Quarter Round (Variant 2)',
        de: 'Viertelrundprofil (Variante 2)',
        ro: 'Profil Sfert de Cerc (Varianta 2)',
      },
      description: {
        nl: 'Kwartronde houten plint in groter formaat, ontworpen om vloerovergangen en uitzetvoegen af te dekken met een gladde, ronde vorm.',
        en: 'Larger format quarter-round wood trim designed to cover flooring transitions and floor expansion gaps with a smooth radius look.',
        de: 'Größeres Viertelrundprofil aus Holz zur Abdeckung von Bodenübergängen und Dehnungsfugen mit einem glatten, runden Radius.',
        ro: 'Profil sfert de cerc din lemn de dimensiuni mai mari, proiectat pentru a acoperi tranzițiile de podea și rosturile de dilatație cu o rază netedă.',
      },
      image: '/images/profile10.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-thread',
      name: {
        nl: 'Gegroefd profiel (Draad)',
        en: 'Profile Thread',
        de: 'Gewindeprofil',
        ro: 'Profil Filetat / Striat',
      },
      description: {
        nl: 'Speciaal gegroefd of getrapt profielstrip. Gemaakt voor B2B decoratieve kastlijsten en schuifdeuraccenten.',
        en: 'Specialty grooved or threaded moulding strip profile. Tailored for decorative cabinetry rails and sliding track accents.',
        de: 'Spezielles gerilltes oder gewindetes Zierleistenprofil. Maßgeschneidert für dekorative Schrankleisten und Schiebetürschienen-Akzente.',
        ro: 'Profil special canelat sau filetat. Creat pentru șine decorative de dulapuri și accente de ghidaj culisante.',
      },
      image: '/images/profile11.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
    {
      id: 'profile-calbat',
      name: {
        nl: 'Calbat profiel',
        en: 'Profile Calbat',
        de: 'Calbat-Profil',
        ro: 'Profil Calbat',
      },
      description: {
        nl: 'Uniek hol uitgesneden hollijstprofiel. Bootst historische profileringen na om een klassieke stijl te geven aan luxe meubels en plafondovergangen.',
        en: 'Unique concave-carved cove moulding profile. Replicates historic moldings to add classic styling to high-end furniture and ceiling transitions.',
        de: 'Einzigartiges konkav geschnitztes Hohlkehlprofil. Repliziert historische Zierleisten, um hochwertigen Möbeln und Deckenübergängen ein klassisches Aussehen zu verleihen.',
        ro: 'Profil unic scobit concav (scotie). Replică mulurile istorice pentru a adăuga un stil clasic mobilierului de lux și tranzițiilor de tavan.',
      },
      image: '/images/profile12.jpg',
      category: {
        nl: 'Beukenhouten profielen',
        en: 'Beechwood profiles',
        de: 'Buchenholzprofile',
        ro: 'Profile decorative din fag'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten profielen',
      en: 'Home / Products / Beechwood profiles',
      de: 'Home / Produkte / Buchenholzprofile',
      ro: 'Home / Produse / Profile decorative din fag'
    },
    title: {
      nl: 'Beukenhouten profielen',
      en: 'Beechwood profiles',
      de: 'Buchenholzprofile',
      ro: 'Profile decorative din fag'
    },
    subtitle: {
      nl: 'PALROM Products ontwerpt en produceert een uitgebreide catalogus van beukenhouten profielen. Nauwkeurig gefreesd voor een perfect glad oppervlak, zijn onze profielen ideaal voor kastafwerking, vloerafwerking en wanddecoratie.',
      en: 'PALROM Products designs and manufactures an extensive catalogue of beechwood profiles. Precision-milled to achieve a perfect, smooth surface, our profiles are ideal for cabinetry trim, flooring finishes, and wall decoration.',
      de: 'PALROM Products entwirft und fertigt ein umfangreiches Sortiment an Buchenholzprofilen. Präzise gefräst für eine vollkommen glatte Oberfläche – unsere Leisten sind ideal für Schrankverkleidungen, Bodenabschlüsse und Wanddekorationen.',
      ro: 'PALROM Products proiectează și produce un catalog extins de profile din lemn de fag. Frezate cu precizie pentru a obține o suprafață perfectă și netedă, șipcile noastre sunt ideale pentru finisarea dulapurilor, finisarea podelelor și decorarea pereților.'
    },
    fscNotice: {
      nl: 'FSC® Gecertificeerd op aanvraag beschikbaar',
      en: 'FSC® Certified Available On Request',
      de: 'FSC®-zertifiziert auf Anfrage erhältlich',
      ro: 'Certificat FSC® disponibil la cerere'
    },
    requestQuoteBtn: {
      nl: 'Offerte aanvragen',
      en: 'Request Quote',
      de: 'Angebot anfordern',
      ro: 'Solicită Ofertă'
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
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <Link href="/products">{lang === 'nl' ? 'Producten' : (lang === 'de' ? 'Produkte' : (lang === 'ro' ? 'Produsele' : 'Products'))}</Link> / <span>{getTranslation('breadcrumb').split(' / ').pop()}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>{getTranslation('title')}</h1>
          <p>{getTranslation('subtitle')}</p>
          <span className="fsc-notice">
            <i className="fa-solid fa-tree icon-left"></i> {getTranslation('fscNotice')}
          </span>
        </div>
      </section>

      {/* Profiles Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-3 detail-grid">
            {[...profileProducts]
              .sort((a, b) => {
                const nameA = a.name[lang] || a.name.nl || '';
                const nameB = b.name[lang] || b.name.nl || '';
                return nameA.localeCompare(nameB, lang);
              })
              .map((p) => (
                <div className="detail-card animate-on-scroll" key={p.id}>
                  <div className="detail-img-wrapper">
                    <Image 
                      src={p.image} 
                      alt={p.name[lang] || p.name.nl} 
                      width={400}
                      height={300}
                    />
                  </div>
                  <div className="detail-info">
                    <h3>{p.name[lang] || p.name.nl}</h3>
                    <p>{p.description[lang] || p.description.nl}</p>
                    <Link
                      href="#contact"
                      className="detail-cta add-to-inquiry-btn"
                    >
                      {getTranslation('requestQuoteBtn')} <i className="fa-solid fa-chevron-right icon-right"></i>
                    </Link>
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
