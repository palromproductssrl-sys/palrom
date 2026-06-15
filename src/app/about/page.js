'use client';

import React from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

export default function About() {
  const { lang } = useInquiry();

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
        ro: 'Investitorul olandez Ernst Willemstein înființează Palrom Products SRL în Brad, România, alegând locația datorită abundenței ridicate și calității superioare a pădurilor de fag din jur. Achizițiile inițiale de terenuri și configurarea primară a utilităților de energie electrică și apă sunt finalizate.'
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
        ro: 'Gaterul este finalizat și operațiunile de procesare primară încep. Compania implementează primele sale utilaje automatizate de rindeluire și tăiere, angajând experți locali în prelucrarea lemnului pentru a supraveghea liniile de producție.'
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
        ro: 'Pentru a sprijini lanțurile globale de aprovizionare și a demonstra responsabilitatea față de mediu, Palrom adoptă practici durabile, primind certificarea completă FSC® Chain of Custody. Vânzările se extind pe piețele de tâmplărie din Japonia și țările arabe.'
      },
      align: 'left',
    },
    {
      year: '2021',
      title: {
        nl: 'Uitbreiding van Faciliteiten',
        en: 'Facility Expansion',
        de: 'Erweiterung der Anlagen',
        ro: 'Extinderea Unității'
      },
      description: {
        nl: 'Palrom moderniseert zijn terrein en voegt 7.000 vierkante meter aan betonnen sorteerplaatsen toe en upgradet de besturingssoftware van de droogkamers. Een gloednieuw opslagdepot wordt gebouwd in Brad om de groeiende exportvolumes te ondersteunen.',
        en: 'Palrom modernizes its yard, adding 7,000 square meters of concrete sorting areas and upgrading drying kiln software. A brand-new storage depot is developed in Brad to support growing export volumes.',
        de: 'Palrom modernisiert seinen Betriebshof, fügt 7.000 Quadratmeter betonierte Sortierflächen hinzu und aktualisiert die Software der Trockenkammern. Ein brandneues Lagerdepot wird in Brad gebaut, um das wachsende Exportvolumen zu unterstützen.',
        ro: 'Palrom își modernizează curtea, adăugând 7.000 de metri pătrați de zone betonate de sortare și actualizând software-ul cuptoarelor de uscare. Un nou depozit de stocare este dezvoltat în Brad pentru a sprijini volumele în creștere de export.'
      },
      align: 'right',
    },
    {
      year: 'Nu',
      title: {
        nl: 'Een Multinationale Partner',
        en: 'A Multinational Partner',
        de: 'Ein multinationaler Partner',
        ro: 'Un Partener Multinațional'
      },
      description: {
        nl: 'Palrom opereert als een belangrijke leverancier voor grote Europese retailers van meubelcomponenten, met centraal logistiek beheer in samenwerking met Van Soest International in Nederland.',
        en: 'Operating as a key vendor to major European furniture components retailers, with central logistics managed in collaboration with Van Soest International in the Netherlands.',
        de: 'Tätig als Hauptlieferant für große europäische Händler von Möbelkomponenten, mit zentraler Logistiksteuerung in Zusammenarbeit mit Van Soest International in den Niederlanden.',
        ro: 'Operând ca furnizor cheie pentru marii comercianți europeni de componente de mobilier, cu logistica centrală gestionată în colaborare cu Van Soest International din Olanda.'
      },
      align: 'left',
    },
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Bedrijfsprofiel',
      en: 'Home / Company Profile',
      de: 'Home / Unternehmensprofil',
      ro: 'Home / Profilul Companiei'
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
      nl: 'Wie We Zijn',
      en: 'Who We Are',
      de: 'Wer Wir Sind',
      ro: 'Cine Suntem'
    },
    quoteLead: {
      nl: '"Wij zijn een multinational die onze producten op maat maakt om te voldoen aan de eisen van onze klanten."',
      en: '"We are a multinational firm, tailor-making our products to fit our clients\' requirements."',
      de: '"Wir sind ein multinationales Unternehmen, das seine Produkte maßschneidert, um den Anforderungen unserer Kunden zu entsprechen."',
      ro: '"Suntem o firmă multinațională, care realizează produse la comandă pentru a se potrivi cerințelor clienților noștri."'
    },
    desc1: {
      nl: 'Palrom Products SRL, opgericht in 1999, heeft haar bereik over het Europese continent uitgebreid. Ons hout wordt geoogst in duurzame bossen rondom onze zagerij in het district Hunedoara, waardoor we een lage CO2-voetafdruk voor transport kunnen behouden.',
      en: 'Founded in 1999, Palrom Products SRL has expanded its reach across the European continent. Our timber is harvested in sustainable forests surrounding our sawmill in Hunedoara county, allowing us to maintain a low carbon footprint for transport.',
      de: 'Palrom Products SRL wurde 1999 gegründet und hat seine Reichweite auf den europäischen Kontinent ausgedehnt. Unser Holz wird in nachhaltigen Wäldern rund um unser Sägewerk im Kreis Hunedoara geerntet, was es uns ermöglicht, einen geringen CO2-Fußabdruck für den Transport beizubehalten.',
      ro: 'Fondată în 1999, Palrom Products SRL și-a extins prezența pe continentul european. Lemnul nostru este recoltat din păduri durabile din jurul gaterului nostru din județul Hunedoara, permițându-ne să menținem o amprentă redusă de carbon pentru transport.'
    },
    desc2: {
      nl: 'Of we nu op maat gemaakte meubellijsten leveren aan meubelmakers in Duitsland, of individueel gelabelde beukenhouten deuvels aan doe-het-zelf-bouwmarkten in Frankrijk en Polen, onze kernwaarde blijft hetzelfde: compromisloze precisie en ecologisch beheer.',
      en: 'Whether we are supplying custom furniture rails to cabinet makers in Germany, or retail-labeled beech dowels to DIY hypermarkets in France and Poland, our core value remains the same: uncompromising precision and ecological stewardship.',
      de: 'Ob wir maßgeschneiderte Möbelschienen an Schreiner in Deutschland liefern oder einzeln etikettierte Buchenholzdübel an Baumärkte in Frankreich und Polen – unser Kernwert bleibt derselbe: kompromisslose Präzision und ökologische Verantwortung.',
      ro: 'Fie că furnizăm plinte de mobilier personalizate producătorilor de dulapuri din Germania, fie dibluri de fag etichetate pentru hypermarketuri DIY din Franța și Polonia, valoarea noastră de bază rămâne aceeași: precizie fără compromisuri și administrare ecologică.'
    },
    floatingCard: {
      nl: 'Wij verwerken 100% FSC®-gecertificeerd hout uit respect voor ons milieu en toekomstige generaties.',
      en: 'We process 100% FSC® certified timber out of respect for our environment and future generations.',
      de: 'Wir verarbeiten 100% FSC®-zertifiziertes Holz aus Respekt vor unserer Umwelt und zukünftigen Generationen.',
      ro: 'Procesăm lemn certificat 100% FSC® din respect pentru mediul nostru și generațiile viitoare.'
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
      nl: 'Grote Droogcapaciteit',
      en: 'Massive Drying Capacity',
      de: 'Enorme Trocknungskapazität',
      ro: 'Capacitate Masivă de Uscare'
    },
    dryingDesc: {
      nl: 'Onze moderne droogkamers garanderen stabiele vochtgehaltes, wat kromtrekken of splijten bij de meubelproductie voorkomt.',
      en: 'Our modern kiln drying facilities guarantee stable moisture levels, preventing warping or splitting in furniture manufacturing.',
      de: 'Unsere modernen Trocknungsanlagen garantieren stabile Feuchtigkeitswerte und verhindern Verzug oder Rissbildung bei der Möbelherstellung.',
      ro: 'Instalațiile noastre moderne de uscare în cuptoare garantează niveluri stabile de umiditate, prevenind deformarea sau despicarea în producția de mobilier.'
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
      nl: 'Wij leveren aan klanten in Duitsland, Frankrijk, Oostenrijk, Polen en Japan, met speciale opslag via Van Soest International in Nederland.',
      en: 'Serving clients in Germany, France, Austria, Poland, and Japan, with dedicated warehousing via Van Soest International in the Netherlands.',
      de: 'Wir bedienen Kunden in Deutschland, Frankreich, Österreich, Polen und Japan mit eigener Lagerhaltung über Van Soest International in den Niederlanden.',
      ro: 'Servim clienți din Germania, Franța, Austria, Polonia și Japonia, cu depozitare dedicată prin Van Soest International în Olanda.'
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

      {/* Company Profile & Environmental Commitment Section */}
      <section id="about-details" className="about-section section-padding bg-dark text-light">
        <div className="container">
          <div className="grid grid-2 align-items-center">
            <div className="about-image-column animate-on-scroll">
              <div className="image-stack">
                <img
                  src="/images/hero_bg.jpg"
                  alt="Aerial view of Palrom Products Brad sawmill facilities"
                  className="img-responsive rounded-lg shadow-lg"
                />
                <div className="about-floating-card">
                  <i className="fa-solid fa-leaf text-accent"></i>
                  <p>{getTranslation('floatingCard')}</p>
                </div>
              </div>
            </div>
            <div className="about-text-column animate-on-scroll">
              <span className="section-badge badge-accent">{getTranslation('identityBadge')}</span>
              <h2 className="section-title text-white">{getTranslation('whoWeAre')}</h2>
              <p className="lead">{getTranslation('quoteLead')}</p>
              <p>{getTranslation('desc1')}</p>
              <p>{getTranslation('desc2')}</p>

              <div className="about-quote">
                <p className="quote-text">
                  {lang === 'nl'
                    ? '"We nodigen u uit om ons uit te dagen om de oplossingen te vinden die uw bedrijf succesvol maken."'
                    : (lang === 'de'
                      ? '"Wir laden Sie ein, uns herauszufordern, die Lösungen zu finden, die Ihrem Unternehmen zum Erfolg verhelfen."'
                      : (lang === 'ro'
                        ? '"Vă invităm să ne provocați să găsim soluțiile care vor ajuta afacerea dvs. să aibă succes."'
                        : '"We invite you to challenge us to find the solutions that will help your business succeed."'))}
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
              href="#"
              className="btn btn-dark"
              onClick={(e) => {
                e.preventDefault();
                let alertMsg = 'Palrom Products Corporate Brochure download started (Sample Simulation).';
                if (lang === 'nl') {
                  alertMsg = 'Download van de Palrom Products productbrochure is gestart (voorbeeld).';
                } else if (lang === 'de') {
                  alertMsg = 'Download der Produktbroschüre von Palrom Products gestartet (Beispiel).';
                } else if (lang === 'ro') {
                  alertMsg = 'Descărcarea broșurii corporative Palrom Products a început (Eșantion).';
                }
                alert(alertMsg);
              }}
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
                  <span className="timeline-year">{evt.year}</span>
                  <h3>{evt.title[lang] || evt.title.nl}</h3>
                  <p>{evt.description[lang] || evt.description.nl}</p>
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
