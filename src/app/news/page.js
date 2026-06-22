'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';



export default function News() {
  const { lang, isRomania } = useInquiry();
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    if (selectedArticle) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  const newsItems = [
    {
      id: 'fsc-commitment',
      tag: lang === 'nl' ? 'Kwaliteit' : (lang === 'de' ? 'Qualität' : (lang === 'ro' ? 'Calitate' : 'Quality')),
      date: lang === 'nl' ? '22 juni 2026' : (lang === 'de' ? '22. Juni 2026' : (lang === 'ro' ? '22 iunie 2026' : 'June 22, 2026')),
      author: 'Quality Assurance',
      title: lang === 'nl'
        ? 'Kwaliteitsgarantie: Waarom wij FSC®-certificering serieus nemen'
        : (lang === 'de' ? 'Qualitätsgarantie: Warum wir die FSC®-Zertifizierung ernst nehmen' : (lang === 'ro' ? 'Garanția Calității: De ce luăm în serios certificarea FSC®' : 'Quality Guarantee: Why we take FSC® certification seriously')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              Bij PALROM Products is kwaliteit onlosmakelijk verbonden met duurzaamheid. Wij nemen onze FSC®-certificering (FSC® 100%) uiterst serieus. Dit garandeert dat al ons beukenhout afkomstig is uit verantwoord beheerde bossen die voldoen aan strenge ecologische, sociale en economische normen. Het is een herinnering aan de hoge kwaliteit en betrouwbaarheid van onze producten.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Bei PALROM Products ist Qualität untrennbar mit Nachhaltigkeit verbunden. Wir nehmen unsere FSC®-Zertifizierung (FSC® 100%) sehr ernst. Dies garantiert, dass unser gesamtes Buchenholz aus verantwortungsvoll bewirtschafteten Wäldern stammt, die strengen ökologischen, sozialen und wirtschaftlichen Standards entsprechen. Es ist eine Erinnerung an die hohe Qualität und Zuverlässigkeit unserer Produkte.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              La PALROM Products, calitatea este inseparabilă de sustenabilitate. Luăm foarte în serios certificarea noastră FSC® (FSC® 100%). Aceasta garantează că tot lemnul nostru de fag provine din păduri gestionate responsabil, care respectă standarde ecologice, sociale și economice stricte. Este o reamintire a calității înalte și a fiabilității produselor noastre.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              At PALROM Products, quality is inseparable from sustainability. We take our FSC® certification (FSC® 100%) extremely seriously. This guarantees that all of our beechwood originates from responsibly managed forests meeting strict ecological, social, and economic standards. It is a reminder of the high quality and reliability of our products.
            </p>
          )}
          <Link href="/configurator" className="news-link">
            {lang === 'nl' ? 'Configureren met FSC' : (lang === 'de' ? 'Mit FSC konfigurieren' : (lang === 'ro' ? 'Configurați cu FSC' : 'Configure with FSC'))}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/hero_bg.jpg',
    },
    ...(isRomania ? [
      {
        id: 'briquettes-summer',
        tag: lang === 'nl' ? 'Aanbieding' : (lang === 'de' ? 'Angebot' : (lang === 'ro' ? 'Promoție' : 'Offer')),
        date: lang === 'nl' ? '22 juni 2026' : (lang === 'de' ? '22. Juni 2026' : (lang === 'ro' ? '22 iunie 2026' : 'June 22, 2026')),
        author: 'Sales Team',
        title: lang === 'nl'
          ? 'Zomeraanbieding: Beukenhoutbriketten voor een lage prijs!'
          : (lang === 'de' ? 'Sommerangebot: Buchenholzbriketts zum günstigen Preis!' : (lang === 'ro' ? 'Ofertă de Vară: Brichete din Lemn de Fag la Preț Redus!' : 'Summer Offer: Beechwood Heating Briquettes at a Low Price!')),
        content: (
          <>
            {lang === 'nl' && (
              <p>
                Profiteer nu van onze zomeraanbieding! Omdat het zomer is, verkopen we onze hoogwaardige beukenhoutbriketten tegen een extra lage prijs. Dit is het ideale moment om uw voorraad in te slaan voor de winter. Deze aanbieding is exclusief geldig voor bestellingen en leveringen binnen Roemenië.
              </p>
            )}
            {lang === 'de' && (
              <p>
                Profitieren Sie jetzt von unserem Sommerangebot! Da es Sommer ist, verkaufen wir unsere hochwertigen Buchenholzbriketts zu einem besonders günstigen Preis. Dies ist der ideale Zeitpunkt, um sich für den Winter einzudecken. Dieses Angebot gilt ausschließlich für Bestellungen und Lieferungen innerhalb Rumäniens.
              </p>
            )}
            {lang === 'ro' && (
              <p>
                Profitați acum de oferta noastră de vară! Deoarece este vară, comercializăm brichetele noastre din lemn de fag de înaltă calitate la un preț special redus. Este momentul ideal pentru a vă face stocul pentru iarnă. Această ofertă este valabilă exclusiv pentru comenzi și livrări pe teritoriul României.
              </p>
            )}
            {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
              <p>
                Take advantage of our summer offer now! Because it is summer, we are selling our premium beechwood heating briquettes at an extra low price. This is the perfect time to stock up for winter. This offer is valid exclusively for orders and deliveries within Romania.
              </p>
            )}
            <Link href="/configurator/v4?category=brichete" className="news-link">
              {lang === 'nl' ? 'Briketten configureren' : (lang === 'de' ? 'Briketts konfigurieren' : (lang === 'ro' ? 'Configurați brichete' : 'Configure briquettes'))}{' '}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </>
        ),
        image: '/images/brichete_fag.png',
      }
    ] : []),
    {
      id: 'configurator',
      tag: lang === 'nl' ? 'Innovatie' : (lang === 'de' ? 'Innovation' : (lang === 'ro' ? 'Inovație' : 'Innovation')),
      date: lang === 'nl' ? '17 juni 2026' : (lang === 'de' ? '17. Juni 2026' : (lang === 'ro' ? '17 iunie 2026' : 'June 17, 2026')),
      author: 'Digital Team',
      title: lang === 'nl'
        ? 'Nieuwe Interactieve B2B Configurator Gelanceerd!'
        : (lang === 'de' ? 'Neuer interaktiver B2B-Konfigurator gestartet!' : (lang === 'ro' ? 'Noul Configurator B2B Interactiv a Fost Lansat!' : 'New Interactive B2B Configurator Launched!')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              We hebben met trots onze nieuwe interactieve B2B product configurator gelanceerd. Hiermee kunt u direct uw beukenhouten stokken, latten, profielen en specials op maat samenstellen, specificaties selecteren en een offerte aanvragen.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Wir haben stolz unseren neuen interaktiven B2B-Produktkonfigurator gestartet. Mit diesem Tool können Sie Ihre Buchenholzstäbe, Leisten, Profile und Sonderzuschnitte direkt anpassen, Spezifikationen auswählen und ein Angebot anfordern.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              Am lansat cu mândrie noul nostru configurator de produse B2B interactiv. Acest instrument vă permite să personalizați tijele, șipcile, profilele și piesele speciale din lemn de fag direct la dimensiunile dorite, să selectați specificațiile și să solicitați o ofertă.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              We have proudly launched our new interactive B2B product configurator. This tool allows you to customize your beechwood sticks, slats, profiles, and specials directly to your exact dimensions, select specifications, and request a quote.
            </p>
          )}
          <Link href="/configurator" className="news-link">
            {lang === 'nl' ? 'Probeer de configurator' : (lang === 'de' ? 'Konfigurator ausprobieren' : (lang === 'ro' ? 'Încercați configuratorul' : 'Try the configurator'))}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/team_group_photo.png',
    },
    {
      id: 'drying',
      tag: lang === 'nl' ? 'Productie' : (lang === 'de' ? 'Produktion' : (lang === 'ro' ? 'Producție' : 'Production')),
      date: lang === 'nl' ? '24 mei 2026' : (lang === 'de' ? '24. Mai 2026' : (lang === 'ro' ? '24 mai 2026' : 'May 24, 2026')),
      author: 'Sawmill Ops',
      title: lang === 'nl' 
        ? 'Uitbreiding van de droogkamercapaciteit in Brad' 
        : (lang === 'de' ? 'Erweiterung der Trockenkammerkapazität in Brad' : (lang === 'ro' ? 'Extinderea capacității camerelor de uscare în Brad' : 'Expansion of Drying Chamber Capacity in Brad')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              Om te voldoen aan de stijgende internationale vraag naar hoogwaardig FSC®-gecertificeerd beukenhout, hebben we twee nieuwe volautomatische droogkamers in gebruik genomen. Deze uitbreiding verhoogt onze totale droogcapaciteit met 15%.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Um die steigende internationale Nachfrage nach hochwertigem FSC®-zertifiziertem Buchenholz zu befriedigen, haben wir zwei neue vollautomatische Trockenkammern in Betrieb genommen. Diese Erweiterung erhöht unsere gesamte Trocknungskapazität um 15 %.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              Pentru a satisface cererea internațională în creștere de lemn de fag de înaltă calitate certificat FSC®, am pus în funcțiune două noi camere de uscare complet automatizate. Această extindere mărește capacitatea noastră totală de uscare cu 15%.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              To meet rising international demand for high-quality FSC®-certified beechwood, we have commissioned two new fully-automated drying chambers. This expansion increases our total drying chamber capacity by 15%.
            </p>
          )}
          <Link href="/about#timeline-details" className="news-link">
            {lang === 'nl' ? 'Lees onze geschiedenis' : (lang === 'de' ? 'Unsere Geschichte lesen' : (lang === 'ro' ? 'Citiți istoricul nostru' : 'Read our history'))}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/kilns_news.jpg',
    },
    {
      id: 'fsc',
      tag: lang === 'nl' ? 'Duurzaamheid' : (lang === 'de' ? 'Nachhaltigkeit' : (lang === 'ro' ? 'Sustenabilitate' : 'Sustainability')),
      date: lang === 'nl' ? '12 april 2026' : (lang === 'de' ? '12. April 2026' : (lang === 'ro' ? '12 april 2026' : 'April 12, 2026')),
      author: 'Ecology Lead',
      title: lang === 'nl' 
        ? 'FSC® Chain of Custody Hergecertificeerd' 
        : (lang === 'de' ? 'FSC® Chain of Custody rezertifiziert' : (lang === 'ro' ? 'Certificare FSC® Chain of Custody Reînnoită' : 'FSC® Chain of Custody Recertified')),
      content: (
        <>
          {lang === 'nl' && (
            <p>
              Na een uitgebreide audit is ons FSC®-certificaat voor duurzaam bosbeheer en verwerking met succes verlengd. Wij garanderen een verantwoorde inkoop van al onze beukenhouten producten.
            </p>
          )}
          {lang === 'de' && (
            <p>
              Nach einem umfassenden Audit wurde unser FSC®-Zertifikat für nachhaltige Waldbewirtschaftung und -verarbeitung erfolgreich verlängert. Wir garantieren die verantwortungsvolle Beschaffung aller unserer Buchenholzprodukte.
            </p>
          )}
          {lang === 'ro' && (
            <p>
              În urma unui audit cuprinzător, certificarea noastră FSC® pentru managementul durabil al pădurilor și procesare a fost reînnoită cu succes. Garantăm aprovizionarea responsabilă cu toate produsele noastre din lemn de fag.
            </p>
          )}
          {lang !== 'nl' && lang !== 'de' && lang !== 'ro' && (
            <p>
              Following a comprehensive audit, our FSC® certification for sustainable forest management and processing has been successfully renewed. We guarantee the responsible sourcing of all our beechwood products.
            </p>
          )}
          <Link href="/products" className="news-link">
            {lang === 'nl' ? 'Ontdek onze producten' : (lang === 'de' ? 'Unsere Produkte entdecken' : (lang === 'ro' ? 'Explorați produsele noastre' : 'Explore our products'))}{' '}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </>
      ),
      image: '/images/hero_bg.jpg',
    },
  ];



  const t = {
    newsBreadcrumb: { nl: 'Nieuws', en: 'News', de: 'Neuigkeiten', ro: 'Știri' },
    newsTitle: { nl: 'Nieuws & Updates', en: 'News & Updates', de: 'Neuigkeiten & Updates', ro: 'Știri & Noutăți' },
    newsSubtitle: {
      nl: 'Blijf op de hoogte van onze nieuwste investeringen, duurzaamheidsprestaties en fabrieksupgrades.',
      en: 'Stay informed about our latest investments, sustainability achievements, and factory upgrades.',
      de: 'Bleiben Sie auf dem Laufenden über unsere neuesten Investitionen, Nachhaltigkeitserfolge und Werksmodernisierungen.',
      ro: 'Fii la curent cu ultimele noastre investiții, realizări în materie de sustenabilitate și modernizări ale fabricii.'
    },
    latestUpdatesBadge: { nl: 'Nieuws & Updates', en: 'News & Updates', de: 'Neuigkeiten & Updates', ro: 'Știri & Noutăți' },
    latestUpdatesTitle: { nl: 'Laatste Updates', en: 'Latest Updates', de: 'Neueste Updates', ro: 'Ultimele Noutăți' },
    latestUpdatesSub: {
      nl: 'Blijf op de hoogte van onze nieuwste innovaties, fabrieksupgrades en duurzaamheidsmijlpalen.',
      en: 'Stay up to date with our latest innovations, factory upgrades, and sustainability milestones.',
      de: 'Bleiben Sie auf dem Laufenden mit unseren neuesten Innovationen, Fabrik-Upgrades und Nachhaltigkeitsmeilensteinen.',
      ro: 'Fii la curent cu cele mai recente inovații, modernizări ale fabricii și etape de sustenabilitate.'
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
            <Link href="/">{lang === 'nl' ? 'Home' : 'Home'}</Link> / <span>{getTranslation('newsBreadcrumb')}</span>
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>
            {getTranslation('newsTitle')}
          </h1>
          <p>{getTranslation('newsSubtitle')}</p>
        </div>
      </section>

      {/* News / Updates Section */}
      <section id="news" className="news-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5 animate-on-scroll">
            <span className="section-badge">
              {getTranslation('latestUpdatesBadge')}
            </span>
            <h2 className="section-title">
              {getTranslation('latestUpdatesTitle')}
            </h2>
            <p className="section-subtitle text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1.1rem', fontWeight: 300 }}>
              {getTranslation('latestUpdatesSub')}
            </p>
          </div>

          <div className="news-grid">
            {newsItems.map((item) => (
              <div
                className="news-card animate-on-scroll"
                key={item.id}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                  }
                  setSelectedArticle(item);
                }}
              >
                <div className="news-image">
                  <Image 
                    src={item.image || '/images/config_dowels.png'} 
                    alt={item.title} 
                    width={600}
                    height={400}
                  />
                  <span className={`news-tag ${item.tagClass || ''}`}>{item.tag}</span>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">
                      <i className="fa-regular fa-calendar"></i> {item.date}
                    </span>
                    {item.author && (
                      <span className="news-author" style={{ marginLeft: '1rem' }}>
                        <i className="fa-regular fa-user"></i> {item.author}
                      </span>
                    )}
                  </div>
                  <h3>{item.title}</h3>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <ContactSection />

      {selectedArticle && (
        <div className="news-modal active" id="newsModal">
          <div className="news-modal-overlay" onClick={() => setSelectedArticle(null)}></div>
          <div className="news-modal-container">
            <button className="news-modal-close" onClick={() => setSelectedArticle(null)} aria-label="Close popup">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="news-modal-image">
              <Image 
                src={selectedArticle.image || '/images/config_dowels.png'} 
                alt={selectedArticle.title} 
                width={600}
                height={400}
              />
            </div>
            <div className="news-modal-body">
              <div className="news-modal-meta">
                <span className={`news-tag ${selectedArticle.tagClass || ''}`}>{selectedArticle.tag}</span>
                <span className="news-meta-item"><i className="fa-regular fa-calendar"></i> {selectedArticle.date}</span>
                {selectedArticle.author && (
                  <span className="news-meta-item"><i className="fa-regular fa-user"></i> {selectedArticle.author}</span>
                )}
              </div>
              <h2>{selectedArticle.title}</h2>
              <div className="news-modal-text">
                {selectedArticle.content}
              </div>
              <div className="news-modal-actions" style={{ marginTop: '1.5rem' }}>
                {selectedArticle.id === 'briquettes-summer' ? (
                  <Link href="/configurator/v4?category=brichete" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Briketten configureren' : (lang === 'de' ? 'Briketts konfigurieren' : (lang === 'ro' ? 'Configurați brichete' : 'Configure briquettes'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                ) : selectedArticle.id === 'fsc-commitment' ? (
                  <Link href="/configurator" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Configureren met FSC' : (lang === 'de' ? 'Mit FSC konfigurieren' : (lang === 'ro' ? 'Configurați cu FSC' : 'Configure with FSC'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                ) : selectedArticle.id === 'configurator' ? (
                  <Link href="/configurator" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Probeer de configurator' : (lang === 'de' ? 'Konfigurator ausprobieren' : (lang === 'ro' ? 'Încercați configuratorul' : 'Try the configurator'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                ) : selectedArticle.id === 'drying' ? (
                  <Link href="/about#timeline-details" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Lees onze geschiedenis' : (lang === 'de' ? 'Unsere Geschichte lesen' : (lang === 'ro' ? 'Citiți istoricul nostru' : 'Read our history'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                ) : (
                  <Link href="/products" onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {lang === 'nl' ? 'Ontdek onze producten' : (lang === 'de' ? 'Unsere Produkte entdecken' : (lang === 'ro' ? 'Explorați produsele noastre' : 'Explore our products'))} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
