'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

export default function Careers() {
  const { lang } = useInquiry();

  const jobs = [
    {
      id: 'planing',
      title: {
        nl: 'Operator Schaafmachine',
        en: 'Planing Machine Operator',
        de: 'Hobelmaschinenführer',
        ro: 'Operator Rindele'
      },
      department: {
        nl: 'Productie',
        en: 'Production',
        de: 'Produktion',
        ro: 'Producție'
      },
      location: 'Brad, RO',
      type: {
        nl: 'Fulltime',
        en: 'Full-Time',
        de: 'Vollzeit',
        ro: 'Normă Întreagă'
      },
      description: {
        nl: 'Verantwoordelijk voor het instellen, kalibreren en aanvoeren van onze hogesnelheids-profileer- en houtschaafmachines om ruwe beukenplanken om te zetten in hoogwaardige deuvels en houten profielen.',
        en: 'Responsible for setting up, calibrating, and feeding our high-speed profiling and wood planing machines to shape raw beechwood boards into premium dowels and architectural mouldings.',
        de: 'Verantwortlich für das Einrichten, Kalibrieren und Bestücken unserer Hochgeschwindigkeits-Profilierungs- und Holzhobelmaschinen, um rohe Buchenholzbretter in erstklassige Dübel und Profile zu verwandeln.',
        ro: 'Responsabil pentru configurarea, calibrarea și alimentarea mașinilor noastre de profilat și rinduit de mare viteză, pentru a modela scândurile de fag brut în dibluri premium și profile decorative.'
      },
      requirements: {
        nl: [
          'Voorafgaande ervaring in houtbewerking of de bediening van zagerijmachines wordt zeer gewaardeerd.',
          'Grote aandacht voor detail en maatzuiverheid (met behulp van schuifmaten).',
          'Begrip van industriële veiligheidsrichtlijnen en onderhoud van apparatuur.',
        ],
        en: [
          'Prior experience in wood processing or sawmill machine operation is highly valued.',
          'High attention to detail and dimensional accuracy (using calipers).',
          'Understanding of industrial safety guidelines and equipment maintenance.',
        ],
        de: [
          'Vorherige Erfahrung in der Holzverarbeitung oder der Bedienung von Sägewerksmaschinen ist sehr erwünscht.',
          'Hohe Liebe zum Detail und Maßgenauigkeit (unter Verwendung von Messschiebern).',
          'Verständnis von industriellen Sicherheitsrichtlinien und Gerätewartung.',
        ],
        ro: [
          'Experiența anterioară în prelucrarea lemnului sau operarea mașinilor de gater este foarte apreciată.',
          'Atenție deosebită la detalii și precizie dimensională (folosind șublerul).',
          'Înțelegerea normelor de siguranță industrială și a întreținerii echipamentelor.',
        ]
      },
      salary: {
        nl: 'Concurrerend salaris',
        en: 'Competitive Pay',
        de: 'Wettbewerbsfähiges Gehalt',
        ro: 'Salariu Competitiv'
      },
    },
    {
      id: 'quality',
      title: {
        nl: 'Inspecteur Kwaliteitscontrole & Sortering',
        en: 'Quality & Defect Inspector',
        de: 'Qualitäts- und Mängelprüfer',
        ro: 'Inspector Calitate & Defecte'
      },
      department: {
        nl: 'Kwaliteitscontrole',
        en: 'Quality Control',
        de: 'Qualitätskontrolle',
        ro: 'Controlul Calității'
      },
      location: 'Brad, RO',
      type: {
        nl: 'Fulltime',
        en: 'Full-Time',
        de: 'Vollzeit',
        ro: 'Normă Întreagă'
      },
      description: {
        nl: 'Visuele en fysieke inspectie van afgewerkte houten deuvels, planken en op maat gemaakte meubelcomponenten. Sorteren van natuurlijke noesten, scheuren en sorteerafwijkingen om te garanderen dat aan de specificaties van de klant wordt voldaan.',
        en: 'Visual and physical inspection of finished wood dowels, boards, and custom furniture elements. Sort out natural knots, splits, and grading anomalies to ensure client specifications are met.',
        de: 'Visuelle und physische Inspektion fertiger Holzdübel, Bretter und maßgeschneiderter Möbelelemente. Aussortieren natürlicher Äste, Risse und Sortieranomalien, um sicherzustellen, dass die Kundenspezifikationen erfüllt werden.',
        ro: 'Inspecția vizuală și fizică a diblurilor finisate din lemn, scândurilor și elementelor de mobilier personalizate. Sortarea nodurilor naturale, a crăpăturilor și a anomaliilor de clasificare pentru a se asigura că specificațiile clientului sunt îndeplinite.'
      },
      requirements: {
        nl: [
          'Sterke observatievaardigheden en bekendheid met standaard houtklassen (A, B, C).',
          'Betrouwbaarheid, geduld en het vermogen om defectenlogboeken bij te houden.',
          'Ervaring met FSC® Chain of Custody-documentatie is een pluspunt (interne training aanwezig).',
        ],
        en: [
          'Strong observation skills and familiarity with standard timber grades (A, B, C).',
          'Reliability, patience, and ability to document defect logs.',
          'FSC® chain-of-custody documentation training is a plus (provided in-house).',
        ],
        de: [
          'Ausgeprägte Beobachtungsgabe und Vertrautheit mit den Standard-Holzqualitäten (A, B, C).',
          'Zuverlässigkeit, Geduld und die Fähigkeit, Mängelprotokolle zu führen.',
          'FSC® Chain-of-Custody-Dokumentationsschulung ist ein Plus (wird intern angeboten).',
        ],
        ro: [
          'Abilități puternice de observare și familiaritate cu clasele standard de cherestea (A, B, C).',
          'Fiabilitate, răbdare și capacitatea de a documenta jurnalele de defecte.',
          'Instruirea în documentarea FSC® chain-of-custody reprezintă un avantaj (oferită intern).',
        ]
      },
      salary: {
        nl: 'Vast salaris',
        en: 'Stable Salary',
        de: 'Festgehalt',
        ro: 'Salariu Stabil'
      },
    },
    {
      id: 'maintenance',
      title: {
        nl: 'Onderhoudsmonteur / Werktuigbouwkundige',
        en: 'Maintenance Mechanic / Millwright',
        de: 'Wartungsmechaniker / Maschinenschlosser',
        ro: 'Mecanic Întreținere'
      },
      department: {
        nl: 'Onderhoud',
        en: 'Maintenance',
        de: 'Instandhaltung',
        ro: 'Întreținere'
      },
      location: 'Brad, RO',
      type: {
        nl: 'Fulltime',
        en: 'Full-Time',
        de: 'Vollzeit',
        ro: 'Normă Întreagă'
      },
      description: {
        nl: 'Uitvoeren van mechanisch preventief onderhoud en noodreparaties aan onze geautomatiseerde droogkamers, zagen, stofafzuigers en profileermachines.',
        en: 'Perform mechanical preventive maintenance and emergency troubleshooting on our automated drying chamber systems, sawmill blades, dust extraction blowers, and profiling machinery.',
        de: 'Durchführung von mechanischen vorbeugenden Wartungsarbeiten und Notfall-Fehlersuche an unseren automatisierten Trockenkammersystemen, Sägewerksblättern, Staubabsauggebläsen und Hobelmaschinen.',
        ro: 'Efectuarea întreținerii preventive mecanice și depanarea de urgență a sistemelor noastre automatizate de uscare, lamelor de gater, suflantelor de extracție a prafului și utilajelor de profilat.'
      },
      requirements: {
        nl: [
          'Professionele kwalificatie als werktuigbouwkundige of onderhoudsmonteur.',
          'Ervaring met het repareren van lagers, tandwielkasten, riemen en hydraulische cilinders.',
          'Vermogen om technische lay-outs te lezen en machinestoringen snel op te lossen.',
        ],
        en: [
          'Professional qualification as a mechanical technician, fitter, or millwright.',
          'Experience repairing bearings, gearboxes, belts, and hydraulic cylinders.',
          'Ability to read technical layouts and troubleshoot machine breakdowns.',
        ],
        de: [
          'Berufsqualifikation als Maschinenschlosser, Industriemechaniker oder Instandhaltungsmechaniker.',
          'Erfahrung bei der Reparatur von Lagern, Getrieben, Riemen und Hydraulikzylindern.',
          'Fähigkeit, technische Layouts zu lesen und Maschinenstörungen zu beheben.',
        ],
        ro: [
          'Calificare profesională de tehnician mecanic, montator sau lăcătuș mecanic.',
          'Experiență în repararea rulmenților, cutiilor de viteze, curelelor și cilindrilor hidraulici.',
          'Capacitatea de a citi scheme tehnice și de a depana defecțiunile utilajelor.',
        ]
      },
      salary: {
        nl: 'Top-salaris + Overuren',
        en: 'Top-Tier Salary + Overtime',
        de: 'Spitzengehalt + Überstunden',
        ro: 'Salariu de Top + Ore Suplimentare'
      },
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Vacatures',
      en: 'Careers',
      de: 'Karriere',
      ro: 'Cariere'
    },
    title: {
      nl: 'Werken bij PALROM',
      en: 'Careers at PALROM',
      de: 'Karriere bei PALROM',
      ro: 'Cariere la PALROM'
    },
    subtitle: {
      nl: 'Bouw aan uw toekomst bij een stabiele, duurzame marktleider in loofhout en beukenhoutproductie in Brad, Roemenië.',
      en: 'Shape your future with a stable, sustainable leader in hardwood lumber and beechwood manufacturing in Brad, Romania.',
      de: 'Gestalten Sie Ihre Zukunft bei einem stabilen, nachhaltigen Marktführer in der Laubholz- und Buchenholzverarbeitung in Brad, Rumänien.',
      ro: 'Modelati-vă viitorul alături de un lider stabil și durabil în producția de cherestea și produse din lemn de fag în Brad, România.'
    },
    badgeWork: {
      nl: 'Werk Met Ons',
      en: 'Work With Us',
      de: 'Arbeiten Sie mit uns',
      ro: 'Lucrează cu Noi'
    },
    whyJoinTitle: {
      nl: 'Waarom Kiezen voor het PALROM Team?',
      en: 'Why Join the PALROM Team?',
      de: 'Warum Teil des PALROM-Teams werden?',
      ro: 'De ce să te Alături Echipei PALROM?'
    },
    whyJoinLead: {
      nl: 'Al meer dan 25 jaar is Palrom Products SRL een hoeksteen van stabiliteit in de productie-industrie in het district Hunedoara. We bieden meer dan alleen een baan – we bouwen aan levenslange carrières in de houtbewerking en industrie.',
      en: 'For over 25 years, Palrom Products SRL has been a cornerstone of manufacturing stability in Hunedoara County. We offer more than just a job – we build lifelong carpentry and industrial professions.',
      de: 'Seit über 25 Jahren ist Palrom Products SRL ein Eckpfeiler der Fertigungsstabilität im Kreis Hunedoara. Wir bieten mehr als nur einen Job – wir bauen lebenslange Tischler- und Industrieberufe auf.',
      ro: 'De peste 25 de ani, Palrom Products SRL este o piatră de temelie a stabilității manufacturiere în județul Hunedoara. Oferim mai mult decât un simplu loc de muncă - construim cariere pe viață în tâmplărie și industrie.'
    },
    whyJoinDesc: {
      nl: 'In onze zagerij en schaverij in Brad combineren we traditioneel houtvakmanschap met moderne automatisering. We werken onder strikte ecologische FSC®-principes, met respect voor de bossen om ons heen en de veiligheid van onze werknemers.',
      en: 'At our sawmill and planing shop in Brad, we combine traditional wood craftsmanship with modern automation. We operate under strict FSC® ecological principles, respecting the forests around us and the safety of our operators.',
      de: 'In unserem Sägewerk und Hobelwerk in Brad verbinden wir traditionelles Holzhandwerk mit moderner Automatisierung. Wir arbeiten nach strengen ökologischen FSC®-Richtlinien und achten auf die Wälder um uns herum sowie die Sicherheit unserer Mitarbeiter.',
      ro: 'În gaterul și atelierul nostru de rindeluire din Brad, combinăm meșteșugul tradițional al lemnului cu automatizarea modernă. Operăm conform principiilor ecologice stricte FSC®, respectând pădurile din jur și siguranța operatorilor noștri.'
    },
    benefitSalaryTitle: {
      nl: 'Concurrerend Salaris',
      en: 'Competitive Salary',
      de: 'Wettbewerbsfähiges Gehalt',
      ro: 'Salariu Competitiv'
    },
    benefitSalaryDesc: {
      nl: 'Eerlijke beloning die uw ervaring weerspiegelt.',
      en: 'Fair compensation reflecting your experience.',
      de: 'Faire Vergütung entsprechend Ihrer Erfahrung.',
      ro: 'Compensație echitabilă care reflectă experiența dvs.'
    },
    benefitSafetyTitle: {
      nl: 'Veilige Werkomgeving',
      en: 'Safe Work Environment',
      de: 'Sichere Arbeitsumgebung',
      ro: 'Mediu de Lucru Sigur'
    },
    benefitSafetyDesc: {
      nl: 'Hoogwaardige machinebeveiliging, schone werkplaatsen en gecertificeerde beschermingsmiddelen.',
      en: 'Top-tier machinery safeguards, clean workshops, and certified protective equipment.',
      de: 'Erstklassige Maschinenschutzvorrichtungen, saubere Werkstätten und zertifizierte Schutzausrüstung.',
      ro: 'Măsuri de siguranță de top pentru utilaje, ateliere curate și echipament de protecție certificat.'
    },
    benefitBusTitle: {
      nl: 'Reiskostenondersteuning',
      en: 'Transport Support',
      de: 'Transport-Unterstützung',
      ro: 'Suport Transport'
    },
    benefitBusDesc: {
      nl: 'Dagelijkse reiskostenvergoedingen of georganiseerde shuttles voor werknemers uit omliggende gebieden.',
      en: 'Daily transportation allowances or organized shuttle options for employees from surrounding areas.',
      de: 'Tägliche Fahrtkostenzuschüsse oder organisierter Shuttle-Service für Mitarbeiter aus umliegenden Orten.',
      ro: 'Alocații zilnice de transport sau opțiuni organizate de transport tip navetă pentru angajații din zonele limitrofe.'
    },
    benefitTrainTitle: {
      nl: 'Professionele Opleiding',
      en: 'Professional Training',
      de: 'Berufliche Ausbildung',
      ro: 'Instruire Profesională'
    },
    benefitTrainDesc: {
      nl: 'Leer machinekalibratie, zagerijbediening en houtsortering van experts uit de houtindustrie.',
      en: 'Learn machine calibration, sawmill operation, and timber grading from industry experts.',
      de: 'Lernen Sie Maschinenkalibrierung, Sägewerksbetrieb und Holzsortierung von Branchenexperten.',
      ro: 'Învățați calibrarea utilajelor, operarea gaterului și sortarea lemnului de la experți din industrie.'
    },
    activeOpeningsBadge: {
      nl: 'Actieve Vacatures',
      en: 'Active Openings',
      de: 'Offene Stellen',
      ro: 'Posturi Vacante'
    },
    activeOpeningsTitle: {
      nl: 'Open Vacatures in onze Fabriek in Brad',
      en: 'Open Positions at Brad Factory',
      de: 'Offene Stellen im Werk Brad',
      ro: 'Posturi Vacante la Fabrica din Brad'
    },
    activeOpeningsSub: {
      nl: 'We zoeken gemotiveerde professionals voor onze productie-, kwaliteits- en verzendafdelingen. Solliciteer direct hieronder.',
      en: 'We are looking for dedicated professionals to join our production, quality, and shipping departments. Apply directly below.',
      de: 'Wir suchen engagierte Fachkräfte für unsere Produktions-, Qualitäts- und Versandabteilungen. Bewerben Sie sich direkt unten.',
      ro: 'Căutăm profesioniști dedicați care să se alăture departamentelor noastre de producție, calitate și expediere. Aplicați direct mai jos.'
    },
    reqHeader: {
      nl: 'Belangrijkste Eisen',
      en: 'Key Requirements',
      de: 'Wichtigste Anforderungen',
      ro: 'Cerințe Cheie'
    },
    applyBtn: {
      nl: 'Solliciteer Nu',
      en: 'Apply Now',
      de: 'Jetzt bewerben',
      ro: 'Aplică Acum'
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

        {/* Hiring Stamp on Hero */}
        <a href="#positions" className="hiring-stamp-hero" title={lang === 'nl' ? 'Bekijk onze openstaande posities!' : (lang === 'de' ? 'Sehen Sie sich unsere offenen Stellen an!' : (lang === 'ro' ? 'Vezi pozițiile noastre deschise!' : 'View our open positions!'))}>
          <Image 
            src={`/images/hiring_stamp_${lang}.png`} 
            alt="We are Hiring Stamp" 
            width={170}
            height={170}
            priority
          />
        </a>
      </section>

      {/* Careers Info & Benefits Section */}
      <section className="careers-info-section section-padding bg-dark text-light">
        <div className="container">
          <div className="careers-info-grid">
            <div className="animate-on-scroll">
              <span className="section-badge badge-accent">{getTranslation('badgeWork')}</span>
              <h2 className="section-title text-white">{getTranslation('whyJoinTitle')}</h2>
              <p className="lead">{getTranslation('whyJoinLead')}</p>
              <p>{getTranslation('whyJoinDesc')}</p>
            </div>
            <div className="animate-on-scroll">
              <div className="careers-benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>{getTranslation('benefitSalaryTitle')}</h4>
                    <p>{getTranslation('benefitSalaryDesc')}</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>{getTranslation('benefitSafetyTitle')}</h4>
                    <p>{getTranslation('benefitSafetyDesc')}</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-bus"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>{getTranslation('benefitBusTitle')}</h4>
                    <p>{getTranslation('benefitBusDesc')}</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>{getTranslation('benefitTrainTitle')}</h4>
                    <p>{getTranslation('benefitTrainDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="jobs-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">{getTranslation('activeOpeningsBadge')}</span>
            <h2 className="section-title">{getTranslation('activeOpeningsTitle')}</h2>
            <p className="section-subtitle">{getTranslation('activeOpeningsSub')}</p>
          </div>

          <div className="jobs-grid">
            {jobs.map((job) => (
              <div className="job-card animate-on-scroll" key={job.id}>
                <div className="job-header">
                  <div className="job-title-area">
                    <h3>{job.title[lang] || job.title.nl}</h3>
                    <div className="job-tags">
                      <span className="job-tag tag-dept">{job.department[lang] || job.department.nl}</span>
                      <span className="job-tag tag-loc">{job.location}</span>
                      <span className="job-tag tag-type">{job.type[lang] || job.type.nl}</span>
                    </div>
                  </div>
                </div>
                <p className="job-description">{job.description[lang] || job.description.nl}</p>
                <div className="job-requirements">
                  <h4>{getTranslation('reqHeader')}</h4>
                  <ul>
                    {(job.requirements[lang] || job.requirements.nl).map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="job-footer">
                  <span className="job-salary">{job.salary[lang] || job.salary.nl}</span>
                  <Link href={`/apply?job=${job.id}`} className="btn btn-dark btn-sm">
                    {getTranslation('applyBtn')}
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
