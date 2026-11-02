import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
Je bent PAL, de virtuele B2B sales- en productadviseur van PALROM Products SRL.
Je helpt zakelijke klanten (meubelmakers, timmerfabrieken, groothandels, doe-het-zelf ketens en industriële afnemers) met deskundig advies over onze beukenhouten producten, technische specificaties en offertes.

BELANGRIJKE FEITEN OVER PALROM PRODUCTS SRL:
1. Wie we zijn:
   - PALROM Products SRL is een toonaangevende Roemeense B2B-fabrikant van hoogwaardige beukenhouten componenten en halffabrikaten.
   - Onze fabriek en zagerij zijn gevestigd in Brad (regio Hunedoara, Transsylvanië, Roemenië).
   - Meer dan 25 jaar ervaring (opgericht in 1999).
   - Directrice: Gabriela Cioara. Team: Bogdan Oprea (Orders & Verkoop), Adi Cîra (Productie), Ciprian Jude (Inkoop), Anca Mihuț (HR).
   - Contact: office@palromproducts.ro | +40 754 202 800.

2. Duurzaamheid & Certificering:
   - 100% Europees Beukenhout (Fagus sylvatica) uit duurzaam beheerde Karpatenbossen.
   - FSC®-gecertificeerd (FSC 100% Chain of Custody, FSC-C149826).

3. Onze Houtproducten:
   a. Beukenhouten Blanks (Frize):
      - Fijnbezaagd, dikte 20-67mm (of maatwerk 5-200mm), breedte 45-95mm (tot 500mm), lengte 200-3000mm.
      - Droging: Kamerdroog (KD 8-12%) of Luchtgedroogd (AD) / vers. Kwaliteit A (foutvrij), B (meubelhout), C (constructief). Gestoomd of ongestoomd.
   b. Beukenhouten Stokken & Deuvels (Tije cilindrice):
      - Gladde ronde stokken (diameters 3-60mm) en gerilde / gegroefde deuvelstokken (diameters 6-20mm). Lengte 200-3000mm.
   c. Vierzijdig Geschaafde Latten (Șipci rinduite):
      - Op de millimeter nauwkeurig geschaafd. Rechthoekig (scherpe kanten) of met afgeronde kanten (radius R3, R6).
   d. Profielen & Lijsten:
      - Halfronde deklatten (18x5mm), platte afwerkstrips (30x4mm), afwerklijsten, kwartronde lijsten (14x14mm, 19x19mm), plinten (45x15mm), hoekprofielen (20x20mm, 30x30mm), driehoekige glaslatten, schroefdraadlatten.
   e. Speciale Bestekken & Afstandhouders:
      - Vuren en beuken keeplatten (spieën 20x50x1200mm), afstandhouders kleurenmix, drempelcomponenten voor voedingsindustrie.
   f. Beukenhout Briketten (Brichete RUF):
      - 100% zuiver beukenzaagsel zonder bindmiddelen. Zeer hoge calorische waarde.
      - LET OP: Briketten worden UITSLUITEND binnen Roemenië verkocht en geleverd (per pallet van 960 kg).

4. B2B Bestellingen & Logistiek:
   - Levering door heel Europa (Nederland, België, Duitsland, Oostenrijk, Frankrijk, etc.).
   - Minimale afname (MOQ): 500 stuks voor maatwerk/stokken/latten, 250 stuks voor standaard blanks, 1 pallet voor briketten (binnen Roemenië).
   - Offerteaanvragen en bestellingen verlopen direct via ons contactformulier op de website (#contact) of via ons salesteam (e-mail: office@palromproducts.ro, tel: +40 754 202 800 of WhatsApp).

BELANGRIJKE INSTRUCTIE / STRIKTE REGEL:
- Verwijs NOOIT naar een online configurator, configuratietool of de URL /configurator. Gebruik het woord 'configurator' NIET.
- Help de bezoeker direct in dit chatgesprek: beantwoord vragen over afmetingen, houtsoorten, vochtpercentages, FSC en mogelijkheden.
- Voor het ontvangen van een prijsopgave of offerte verwijs je naar ons contactformulier (#contact), e-mail (office@palromproducts.ro) of direct contact met Gabriela Cioara / Bogdan Oprea.

RICHTLIJNEN VOOR JE ANTWOORDEN:
- Spreek de bezoeker professioneel, deskundig, vriendelijk en to-the-point aan.
- Antwoord ALTIJD in de taal van de gebruiker (Nederlands bij 'nl', Engels bij 'en', Duits bij 'de', Roemeens bij 'ro').
- Houd antwoorden bondig (2 tot 4 alinea's max), met duidelijke bullet points waar handig.
- Geef 1 of 2 relevante actieknoppen mee in het JSON veld "actions" (bijv. link naar #contact, mailto, whatsapp of productpagina's zoals /blanks, /dowels, /four-sides-planed, /profiles).

Output Format:
Antwoord als een geldig JSON object:
{
  "reply": "Je vriendelijke en behulpzame antwoord...",
  "actions": [
    { "label": "Offerte aanvragen", "url": "#contact" },
    { "label": "Bekijk Stokken & Deuvels", "url": "/dowels" }
  ]
}
`;

// Smart client/server fallback answers when Gemini API is not reachable or unconfigured
function generateSmartFallback(message, lang = 'nl') {
  const q = (message || '').toLowerCase();

  const isNL = lang === 'nl';
  const isDE = lang === 'de';
  const isRO = lang === 'ro';

  // 1. Offerte / Prijs / Bestellen
  if (q.includes('offerte') || q.includes('prijs') || q.includes('bestel') || q.includes('quote') || q.includes('price') || q.includes('kosten') || q.includes('angebot') || q.includes('preț') || q.includes('ofert')) {
    if (isDE) {
      return {
        reply: "Gerne unterstützen wir Sie bei einem individuellen B2B-Angebot! Bei **PALROM Products** fertigen wir B2B-Buchenholzprodukte nach Ihren Wunschmaßen (Blanks, Rundstäbe, Leisten und Profile) direkt aus unserem Sägewerk in Brad. Sie können uns Ihre Spezifikationen direkt hier im Chat oder über unser Kontaktformular mitteilen, oder sich direkt an unser Vertriebsteam wenden.",
        actions: [
          { label: "Angebot anfordern", url: "#contact" },
          { label: "E-Mail senden", url: "mailto:office@palromproducts.ro", isExternal: true }
        ]
      };
    }
    if (isRO) {
      return {
        reply: "Cu mare plăcere vă ajutăm cu o ofertă personalizată de preț! La **PALROM Products** producem componente din lemn de fag pe comandă (frize, tije rotunde, șipci și profile) direct din gaterul nostru din Brad. Ne puteți transmite specificațiile dvs. direct aici sau prin formularul de contact.",
        actions: [
          { label: "Solicită ofertă", url: "#contact" },
          { label: "Trimite e-mail", url: "mailto:office@palromproducts.ro", isExternal: true }
        ]
      };
    }
    if (isNL) {
      return {
        reply: "Graag help ik u met een scherpe B2B-offerte! Bij **PALROM Products** produceren we maatwerk beukenhouten blanks, deuvelstokken, latten en profielen rechtstreeks uit onze eigen fabriek in Brad. U kunt uw gewenste specificaties (afmetingen, volumes, droging) direct hier aan mij doorgeven, of een aanvraag indienen via het contactformulier.",
        actions: [
          { label: "Offerte aanvragen", url: "#contact" },
          { label: "Direct mailen", url: "mailto:office@palromproducts.ro", isExternal: true }
        ]
      };
    }
    return {
      reply: "We would be glad to provide you with a customized B2B quote! At **PALROM Products**, we manufacture premium beechwood blanks, dowels, slats, and custom profiles directly from our sawmill in Brad. You can share your specifications with me right here, or submit a request through our contact form.",
      actions: [
        { label: "Request a Quote", url: "#contact" },
        { label: "Email Sales Team", url: "mailto:office@palromproducts.ro", isExternal: true }
      ]
    };
  }

  // 2. Stokken / Deuvels / Rods / Dowels
  if (q.includes('stok') || q.includes('deuvel') || q.includes('dowel') || q.includes('rod') || q.includes('stab') || q.includes('tije') || q.includes('gerild') || q.includes('rilled')) {
    if (isDE) {
      return {
        reply: "Unsere **Buchenholzstäbe & Riffeldübel** werden aus erstklassigem FSC®-Buchenholz mit Durchmessern von **3 mm bis 60 mm** gefertigt. Wir liefern sowohl glatte Stäbe als auch gerillte Dübelstäbe (6–20 mm) in Längen bis zu 3000 mm. Gerne erstellen wir Ihnen ein maßgeschneidertes Angebot.",
        actions: [
          { label: "Rundstäbe entdecken", url: "/dowels" },
          { label: "Angebot anfordern", url: "#contact" }
        ]
      };
    }
    if (isRO) {
      return {
        reply: "Producem **tije cilindrice și dibluri din lemn de fag** cu diametre între **3 mm și 60 mm**, netede sau canelate (striate), cu lungimi de până la 3000 mm. Uscate optim (KD 8-12%) și calibrate precis pentru industria mobilei.",
        actions: [
          { label: "Vezi tije cilindrice", url: "/dowels" },
          { label: "Solicită ofertă", url: "#contact" }
        ]
      };
    }
    if (isNL) {
      return {
        reply: "Onze **beukenhouten stokken en deuvels** worden geproduceerd in diameters van **3 mm tot 60 mm** en lengtes van 200 mm tot 3000 mm. U kunt kiezen uit:\n\n• **Gladde ronde stokken** (o.a. voor speelgoed, vlaggenstokken, trapleuningen)\n• **Gerilde / gegroefde deuvelstokken** (speciaal voor sterke lijmverbindingen in de meubelindustrie)\n• Kamerdroog (KD 8-12%) en 100% FSC®-gecertificeerd.",
        actions: [
          { label: "Bekijk Stokken & Deuvels", url: "/dowels" },
          { label: "Offerte aanvragen", url: "#contact" }
        ]
      };
    }
    return {
      reply: "Our **round and grooved beechwood rods & dowels** are produced in diameters ranging from **3 mm to 60 mm** and lengths up to 3000 mm. Available smooth or grooved, kiln-dried (8-12%), and FSC®-certified.",
      actions: [
        { label: "Explore Beechwood Rods", url: "/dowels" },
        { label: "Request a Quote", url: "#contact" }
      ]
    };
  }

  // 3. Blanks / Frize / Halffabrikaten
  if (q.includes('blank') || q.includes('friz') || q.includes('zaag') || q.includes('fijnbezaagd') || q.includes('sawn')) {
    if (isNL) {
      return {
        reply: "Onze **fijnbezaagde beukenhouten blanks** (halffabrikaten) worden rechtstreeks in onze zagerij geproduceerd. Dikte van 20 tot 67 mm (maatwerk tot 200 mm), breedte 45 tot 95 mm en lengtes tot 3000 mm. Leverbaar in kwaliteitsklasse A (foutvrij), B (meubelhout) of C, zowel kamerdroog (KD 8-12%) als luchtgedroogd (AD).",
        actions: [
          { label: "Bekijk Beukenhouten Blanks", url: "/blanks" },
          { label: "Offerte aanvragen", url: "#contact" }
        ]
      };
    }
    return {
      reply: "Our **fine-sawn beechwood blanks** come directly from our modern sawmill in Brad. Available in thicknesses 20-67mm, widths 45-95mm, lengths up to 3000mm, kiln-dried (KD 8-12%) in Grade A, B, or C.",
      actions: [
        { label: "Explore Blanks", url: "/blanks" },
        { label: "Request a Quote", url: "#contact" }
      ]
    };
  }

  // 4. Latten / Geschaafd / Planed
  if (q.includes('lat') || q.includes('geschaafd') || q.includes('planed') || q.includes('leiste') || q.includes('șipci')) {
    if (isNL) {
      return {
        reply: "Onze **vierzijdig geschaafde beukenhouten latten** worden gekalibreerd met uiterste precisie voor meubels, kozijnen en interieurbouw. Leverbaar met scherpe haakse kanten of met afgeronde hoeken (radius R3 of R6).",
        actions: [
          { label: "Bekijk Geschaafde Latten", url: "/four-sides-planed" },
          { label: "Offerte aanvragen", url: "#contact" }
        ]
      };
    }
    return {
      reply: "Our **four-sides planed beechwood slats** are calibrated with millimeter accuracy for joinery and furniture making. Available with sharp square edges or rounded corners (radius R3/R6).",
      actions: [
        { label: "View Planed Slats", url: "/four-sides-planed" },
        { label: "Request a Quote", url: "#contact" }
      ]
    };
  }

  // 5. Profielen / Lijsten / Profiles
  if (q.includes('profiel') || q.includes('lijst') || q.includes('profile') || q.includes('plint') || q.includes('hoekprofiel')) {
    if (isNL) {
      return {
        reply: "We frezen een uitgebreid assortiment **beukenhouten profielen en sierlijsten**: halfronde deklatten, kwartronde lijsten, platte strips, plinten, afwerklijsten en hoekprofielen. Allemaal zijdezacht afgewerkt.",
        actions: [
          { label: "Bekijk Profielen & Lijsten", url: "/profiles" },
          { label: "Offerte aanvragen", url: "#contact" }
        ]
      };
    }
    return {
      reply: "We manufacture a comprehensive catalogue of **beechwood profiles and mouldings**: half-round covers, quarter rounds, flat strips, plinths, finishing trims, and corner profiles.",
      actions: [
        { label: "Explore Profiles", url: "/profiles" },
        { label: "Request a Quote", url: "#contact" }
      ]
    };
  }

  // 6. Briketten / Brichete / Briquettes
  if (q.includes('briket') || q.includes('brichete') || q.includes('briquet') || q.includes('brandhout') || q.includes('stook')) {
    if (isRO) {
      return {
        reply: "Brichetele noastre din lemn de fag (tip RUF) sunt 100% naturale, presate din rumeguș curat de fag, cu o putere calorică ridicată. Livrăm pe paleți de 960 kg exclusiv pe teritoriul României.",
        actions: [
          { label: "Vezi detalii Brichete Fag", url: "/brichete-fag" },
          { label: "Comandă brichete", url: "#contact" }
        ]
      };
    }
    if (isNL) {
      return {
        reply: "Onze **beukenhoutbriketten (RUF)** zijn 100% natuurlijk en geperst uit zuiver beukenzaagsel met een extreem hoge verbrandingswaarde.\n\n*Belangrijke opmerking:* In verband met transport en logistiek worden onze briketten **uitsluitend binnen Roemenië** verkocht en geleverd. Voor internationale B2B-klanten leveren wij al onze overige beukenhouten componenten!",
        actions: [
          { label: "Bekijk Briketten info", url: "/brichete-fag" },
          { label: "Bekijk Houtproducten", url: "/#products" }
        ]
      };
    }
    return {
      reply: "Our **beechwood briquettes (RUF)** are pressed from 100% clean beech sawdust with high calorific value.\n\n*Please note:* Briquettes are exclusively sold and distributed within Romania. For international clients, we supply our premium timber components (blanks, dowels, slats, and profiles).",
      actions: [
        { label: "Briquette Details", url: "/brichete-fag" },
        { label: "View Wood Products", url: "/#products" }
      ]
    };
  }

  // 7. Fabriek / Locatie / Brad / Bedrijf
  if (q.includes('fabriek') || q.includes('waar') || q.includes('locatie') || q.includes('brad') || q.includes('roemenië') || q.includes('romania') || q.includes('standort') || q.includes('where')) {
    if (isNL) {
      return {
        reply: "**PALROM Products SRL** is opgericht in 1999 en heeft haar eigen moderne zagerij, stoomkamers en computergestuurde droogkamers in **Brad (provincie Hunedoara, Roemenië)**, midden in het hart van de beukenbossen in de Karpaten. We exporteren vanuit Brad rechtstreeks naar B2B-partners door heel Europa!",
        actions: [
          { label: "Bekijk Bedrijfsvideo", url: "/#company-video" },
          { label: "Contactgegevens", url: "#contact" }
        ]
      };
    }
    return {
      reply: "**PALROM Products SRL** has operated its own modern sawmill, steaming chambers, and computer-controlled kiln dryers in **Brad (Hunedoara, Romania)** since 1999, situated right in the Carpathian beech timber region. We export directly to partners across Europe.",
      actions: [
        { label: "Watch Corporate Video", url: "/#company-video" },
        { label: "Contact Details", url: "#contact" }
      ]
    };
  }

  // 8. Contact / Team / Gabriela / Telefoon
  if (q.includes('contact') || q.includes('telefoon') || q.includes('bellen') || q.includes('mail') || q.includes('gabriela') || q.includes('whatsapp') || q.includes('spreken')) {
    if (isNL) {
      return {
        reply: "U kunt direct contact opnemen met ons management en salesteam:\n\n• **Gabriela Cioara** (Algemeen Directeur): +40 754 202 800 | office@palromproducts.ro\n• **Bogdan Oprea** (Orders & Verkoop): +40 754 202 807\n• **Adi Cîra** (Productiemanager): +40 754 202 808\n\nU kunt ook direct een bericht sturen via het contactformulier op deze pagina.",
        actions: [
          { label: "Contactformulier", url: "#contact" },
          { label: "Stuur een E-mail", url: "mailto:office@palromproducts.ro", isExternal: true },
          { label: "Chat via WhatsApp", url: "https://wa.me/40754202800?text=Hallo%20Gabriela,%20ik%20heb%20een%20vraag%20over%20PALROM%20houtproducten.", isExternal: true }
        ]
      };
    }
    return {
      reply: "You can reach our leadership team directly:\n\n• **Gabriela Cioara** (General Manager): +40 754 202 800 | office@palromproducts.ro\n• **Bogdan Oprea** (Order Intake): +40 754 202 807\n• **Adi Cîra** (Production Manager): +40 754 202 808\n\nYou can also reach out via our contact form below.",
      actions: [
        { label: "Contact Form", url: "#contact" },
        { label: "Email Office", url: "mailto:office@palromproducts.ro", isExternal: true },
        { label: "WhatsApp Gabriela", url: "https://wa.me/40754202800", isExternal: true }
      ]
    };
  }

  // Default Greeting / Introduction
  if (isNL) {
    return {
      reply: "Hallo! Ik ben **PAL**, de virtuele assistent van PALROM Products SRL. 🪵\n\nIk help u graag bij het vinden van de juiste beukenhouten halffabrikaten voor uw productie. U kunt mij vragen stellen over:\n• Onze beukenhouten blanks, latten, ronde & gerilde stokken en profielen\n• FSC®-certificering, kamerdroging (8-12%) en afmetingen\n• Het aanvragen van een B2B offerte op maat\n• Onze zagerij in Brad en levertijden in Europa\n\nWaarmee kan ik u van dienst zijn?",
      actions: [
        { label: "Offerte aanvragen", url: "#contact" },
        { label: "Bekijk al onze producten", url: "/#products" }
      ]
    };
  } else if (isDE) {
    return {
      reply: "Hallo! Ich bin **PAL**, der virtuelle Assistent von PALROM Products SRL. 🪵\n\nGerne helfe ich Ihnen bei der Auswahl erstklassiger Buchenholzprodukte:\n• Blanks, Leisten, Rundstäbe & Riffeldübel, Profile\n• FSC®-Zertifizierung und Kammertrocknung (8-12%)\n• Angebote und Maßanfertigungen für Industrie & Handwerk\n\nWie kann ich Ihnen helfen?",
      actions: [
        { label: "Angebot anfordern", url: "#contact" },
        { label: "Produktsortiment", url: "/#products" }
      ]
    };
  } else if (isRO) {
    return {
      reply: "Bună ziua! Sunt **PAL**, asistentul virtual PALROM Products SRL. 🪵\n\nVă stau la dispoziție cu informații despre produsele noastre din lemn de fag:\n• Frize, șipci rinduite, tije cilindrice și profile decorative\n• Certificare FSC®, uscare în camere de uscare (8-12%)\n• Oferte B2B și comenzi speciale\n\nCu ce vă pot ajuta astăzi?",
      actions: [
        { label: "Solicită ofertă", url: "#contact" },
        { label: "Vezi catalogul de produse", url: "/#products" }
      ]
    };
  }

  return {
    reply: "Hello! I am **PAL**, the virtual advisor for PALROM Products SRL. 🪵\n\nI can assist you with your B2B beechwood requirements:\n• Fine-sawn blanks, planed slats, round & grooved rods, profiles\n• FSC® 100% certification and kiln-drying (8-12% moisture)\n• Custom dimensions and direct quote requests\n• Direct shipping across Europe\n\nHow can I help you today?",
    actions: [
      { label: "Request a Quote", url: "#contact" },
      { label: "Explore Wood Products", url: "/#products" }
    ]
  };
}

export async function POST(request) {
  try {
    const { message, history = [], lang = 'nl' } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // If no key is set, immediately respond with the rich smart fallback
    if (!apiKey) {
      const fallbackResult = generateSmartFallback(message, lang);
      return NextResponse.json(fallbackResult);
    }

    // Format chat history for Gemini
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `User query: "${message}"\nUser language: "${lang}"\nPlease answer following the system guidelines. STRICT RULE: Do NOT mention or refer to any configurator tool or /configurator.`
        }
      ]
    });

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    };

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!apiResponse.ok) {
      console.warn("Gemini API call failed for PAL Assistant, falling back to smart engine.");
      return NextResponse.json(generateSmartFallback(message, lang));
    }

    const data = await apiResponse.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return NextResponse.json(generateSmartFallback(message, lang));
    }

    const result = JSON.parse(textContent);
    return NextResponse.json(result);

  } catch (error) {
    console.error("PAL Assistant route error:", error);
    return NextResponse.json(generateSmartFallback(message, 'nl'));
  }
}
