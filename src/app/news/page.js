'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';



export default function News() {
  const { lang, isRomania } = useInquiry();
  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  React.useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const filtered = (data.news || []).filter(item => {
            if (item.isRomaniaOnly && !isRomania) {
              return false;
            }
            return true;
          });
          setNews(filtered);
        }
      })
      .catch(err => console.error('Failed to load news:', err))
      .finally(() => setLoading(false));
  }, [isRomania]);

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
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'inline-block' }}></i>
                <p>{lang === 'nl' ? 'Nieuwsberichten laden...' : 'Loading news items...'}</p>
              </div>
            ) : news.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--color-border)', borderRadius: '12px', color: 'var(--color-text-muted)' }}>
                <i className="fa-regular fa-newspaper fa-3x" style={{ opacity: 0.2, marginBottom: '1rem', display: 'inline-block' }}></i>
                <p>{lang === 'nl' ? 'Er zijn momenteel geen nieuwsberichten.' : 'There are currently no news updates.'}</p>
              </div>
            ) : (
              news.map((item) => (
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
                      alt={item.title[lang] || item.title.nl || item.title.en} 
                      width={600}
                      height={400}
                    />
                    <span className="news-tag">{item.tag[lang] || item.tag.nl || item.tag.en}</span>
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-date">
                        <i className="fa-regular fa-calendar"></i> {item.date[lang] || item.date.nl || item.date.en}
                      </span>
                      {item.author && (
                        <span className="news-author" style={{ marginLeft: '1rem' }}>
                          <i className="fa-regular fa-user"></i> {item.author}
                        </span>
                      )}
                    </div>
                    <h3>{item.title[lang] || item.title.nl || item.title.en}</h3>
                    <p>{item.content[lang] || item.content.nl || item.content.en}</p>
                    {item.linkUrl && (
                      <Link href={item.linkUrl} className="news-link">
                        {item.linkText?.[lang] || item.linkText?.nl || item.linkText?.en || 'Read more'}{' '}
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
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
                alt={selectedArticle.title[lang] || selectedArticle.title.nl || selectedArticle.title.en} 
                width={600}
                height={400}
              />
            </div>
            <div className="news-modal-body">
              <div className="news-modal-meta">
                <span className="news-tag">{selectedArticle.tag[lang] || selectedArticle.tag.nl || selectedArticle.tag.en}</span>
                <span className="news-meta-item"><i className="fa-regular fa-calendar"></i> {selectedArticle.date[lang] || selectedArticle.date.nl || selectedArticle.date.en}</span>
                {selectedArticle.author && (
                  <span className="news-meta-item"><i className="fa-regular fa-user"></i> {selectedArticle.author}</span>
                )}
              </div>
              <h2>{selectedArticle.title[lang] || selectedArticle.title.nl || selectedArticle.title.en}</h2>
              <div className="news-modal-text">
                <p>{selectedArticle.content[lang] || selectedArticle.content.nl || selectedArticle.content.en}</p>
              </div>
              {selectedArticle.linkUrl && (
                <div className="news-modal-actions" style={{ marginTop: '1.5rem' }}>
                  <Link href={selectedArticle.linkUrl} onClick={() => setSelectedArticle(null)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    {selectedArticle.linkText?.[lang] || selectedArticle.linkText?.nl || selectedArticle.linkText?.en || 'Read more'} <i className="fa-solid fa-arrow-right icon-right"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
