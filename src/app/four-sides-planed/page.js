'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInquiry } from '@/components/InquiryContext';
import ContactSection from '@/components/ContactSection';

export default function FourSidesPlaned() {
  const { lang } = useInquiry();

  const planedProducts = [
    {
      id: 'planed-rect',
      name: {
        nl: 'Recht geschaafde latten',
        en: 'Straight planed slats',
        de: 'Gerade gehobelte Leisten',
        ro: 'Șipci rinduite drept',
      },
      description: {
        nl: 'Vierzijdig geschaafde rechthoekige en vierkante beukenhouten latten met scherpe hoeken van 90 graden. Ideaal voor bedbodems, meubelframes, trapbalusters, kastrails en strakke interieurafwerkingen. Gekalibreerd met extreem nauwe toleranties en gedroogd tot 8-12% vochtgehalte.',
        en: 'Four-sides planed rectangular and square beechwood slats with sharp 90-degree corners. Ideal for bed frames, furniture framing, stair balusters, cabinet rails, and modern interior trim. Milled to extreme tolerances and chamber-dried to 8-12% moisture.',
        de: 'Vierseitig gehobelte rechteckige und quadratische Buchenleisten mit scharfen 90-Grad-Kanten. Ideal für Bettgestelle, Möbelrahmen, Treppengeländerstäbe, Schrankschienen und moderne Innenverkleidungen. Gefräst auf extrem enge Toleranzen und getrocknet auf 8-12% Feuchtigkeit.',
        ro: 'Șipci pătrate și rectangulare din lemn de fag rinduite pe patru fețe cu colțuri ascuțite la 90 de grade. Ideale pentru cadre de pat, cadre de mobilier, baluștri de scară, șine de dulap și finisaje interioare moderne. Frezate la toleranțe extrem de precise și uscate la 8-12% umiditate.',
      },
      image: '/images/4sides1.jpg',
      category: {
        nl: 'Beukenhouten latten',
        en: 'Beechwood slats',
        de: 'Buchenholzleisten',
        ro: 'Șipci din lemn de fag'
      },
    },
    {
      id: 'planed-radius',
      name: {
        nl: 'Geschaafde latten met afronding (Radius)',
        en: 'Planed slats with rounded edges (Radius)',
        de: 'Gehobelte Leisten mit abgerundeten Kanten (Radius)',
        ro: 'Șipci rinduite cu margini rotunjite (Rază)',
      },
      description: {
        nl: 'Vierzijdig geschaafde beukenhouten latten met afgeronde hoeken. Leverbaar met een radius van R3 of R6. De zachte afronding vermindert het risico op houtsplijten en verbetert de hanteerbaarheid. Ideaal voor constructief speelgoed, kindvriendelijke meubelcomponenten en voorgefabriceerde timmerwerkonderdelen.',
        en: 'Four-sides planed beechwood slats featuring rounded corner profiles. Available with a radius of R3 or R6. The smooth rounding reduces wood splitting risk and improves handling safety. Ideal for architectural toys, child-friendly furniture components, and pre-finished carpentry parts.',
        de: 'Vierseitig gehobelte Buchenleisten mit abgerundeten Kanten. Erhältlich mit einem Radius von R3 oder R6. Die weiche Kantenabrundung verringert das Splitterrisiko und erhöht die Sicherheit beim Greifen. Ideal für Konstruktionsspielzeug, kinderfreundliche Möbel und Fertigbauteile.',
        ro: 'Șipci din lemn de fag rinduite pe patru fețe având colțuri rotunjite. Disponibile cu o rază de R3 sau R6. Marginile rotunjite reduc riscul de aschiere a lemnului și îmbunătățesc siguranța la manipulare. Ideale pentru jucării constructive, componente de mobilier sigure pentru copii și piese de tâmplărie pre-finisate.',
      },
      image: '/images/4sides7.jpg',
      category: {
        nl: 'Beukenhouten latten',
        en: 'Beechwood slats',
        de: 'Buchenholzleisten',
        ro: 'Șipci din lemn de fag'
      },
    }
  ];

  const t = {
    breadcrumb: {
      nl: 'Home / Producten / Beukenhouten latten',
      en: 'Home / Products / Beechwood slats',
      de: 'Home / Produkte / Buchenholzleisten',
      ro: 'Home / Produsele / Șipci din lemn de fag'
    },
    title: {
      nl: 'Beukenhouten latten',
      en: 'Beechwood slats',
      de: 'Buchenholzleisten',
      ro: 'Șipci din lemn de fag'
    },
    subtitle: {
      nl: 'Onze beukenhouten latten worden met extreem nauwe toleranties geproduceerd. Afkomstig uit duurzaam bosbeheer in de Karpaten, worden ze gezaagd, kammergedroogd tot 8-12%, op lengte gezaagd en gekalibreerd voor meubelfabrikanten en doe-het-zelf-distributeurs.',
      en: 'Our beechwood slats are processed to extreme tolerances. Sourced from sustainable forest management in the Carpathian region, they are sawn, chamber-dried to 8-12%, cut to length, and calibrated for furniture manufacturers and DIY distributors.',
      de: 'Unsere Buchenholzleisten werden mit extrem engen Toleranzen verarbeitet. Sie stammen aus nachhaltiger Forstwirtschaft in der Karpatenregion, werden gesägt, auf 8-12% kammergetrocknet, auf Länge geschnitten und für Möbelhersteller und DIY-Händler kalibriert.',
      ro: 'Șipcile noastre din lemn de fag sunt procesate la toleranțe extreme. Provenite din managementul forestier durabil din regiunea Carpaților, acestea sunt debitate, uscate în camere de uscare la 8-12%, tăiate la lungime și calibrate pentru producătorii de mobilă și distribuitorii DIY.'
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

      {/* Planed Catalog Section */}
      <section className="section-padding bg-light" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="grid grid-2 detail-grid">
            {planedProducts.map((p) => (
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
