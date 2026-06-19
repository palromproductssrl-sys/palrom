import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Supabase environment variables if present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

const localizeSpecKey = (key, lang = 'nl') => {
  const dict = {
    dims: { nl: 'Afmetingen', en: 'Dimensions', de: 'Maße', ro: 'Dimensiuni' },
    grade: { nl: 'Kwaliteit', en: 'Grade', de: 'Qualität', ro: 'Calitate' },
    fsc: { nl: 'Certificering', en: 'Certification', de: 'Zertifizierung', ro: 'Certificare' },
    drying: { nl: 'Droging', en: 'Drying', de: 'Trocknung', ro: 'Uscare' },
    additionalInfo: { nl: 'Notities', en: 'Notes', de: 'Notizen', ro: 'Note' }
  };
  return dict[key]?.[lang] || dict[key]?.nl || key;
};

const localizeSpecValue = (key, val, lang = 'nl') => {
  if (key === 'grade') {
    const grades = {
      A: { nl: 'Klasse A (Foutvrij)', en: 'Class A (Clear)', de: 'Klasse A (Astfrei)', ro: 'Clasa A (Fără noduri)' },
      B: { nl: 'Klasse B (Meubelhout)', en: 'Class B (Cabinet)', de: 'Klasse B (Möbelholz)', ro: 'Clasa B (Lemn pentru mobilă)' },
      C: { nl: 'Klasse C (Constructief)', en: 'Class C (Structural)', de: 'Klasse C (Konstruktive Qualität)', ro: 'Clasa C (Calitate constructivă)' }
    };
    return grades[val]?.[lang] || grades[val]?.nl || val;
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
  return val;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientPhone, clientNotes, items, lang = 'nl' } = body;

    // Validation
    if (!clientName?.trim() || !clientEmail?.trim() || !clientPhone?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: clientName, clientEmail, and clientPhone are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Inquiry must contain at least one product item.' },
        { status: 400 }
      );
    }

    const inquiryRecord = {
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      client_phone: clientPhone.trim(),
      client_notes: clientNotes?.trim() || '',
      items: items,
      total_price: 0, // In B2B quotes, pricing is calculated post-inquiry by sales teams
      status: 'New',
    };

    let savedToDatabase = false;

    if (supabase) {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .insert([inquiryRecord])
        .select();

      if (error) {
        console.error('Supabase insertion error:', error);
      } else {
        console.log('Saved inquiry to Supabase database:', data);
        savedToDatabase = true;
      }
    }

    // Always log locally, and write to a JSON file if not saved to Supabase (or for local auditing)
    const localDbPath = path.join(process.cwd(), 'inquiries.json');
    let localRecords = [];
    try {
      if (fs.existsSync(localDbPath)) {
        const fileContent = fs.readFileSync(localDbPath, 'utf8');
        localRecords = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Failed to read local inquiries file:', err);
    }

    const newRecordWithMeta = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...inquiryRecord,
      saved_to_db: savedToDatabase,
    };

    localRecords.push(newRecordWithMeta);

    try {
      fs.writeFileSync(localDbPath, JSON.stringify(localRecords, null, 2), 'utf8');
      console.log('Saved inquiry locally to inquiries.json');
    } catch (err) {
      console.error('Failed to write to local inquiries file:', err);
    }

    // Send email via FormSubmit.co or Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const useFormSubmit = process.env.USE_FORMSUBMIT !== 'false'; // Default to true
    const emailTo = process.env.EMAIL_TO || 'office@palromproducts.ro';
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    let emailSent = false;
    if (useFormSubmit) {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${emailTo}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Referer': 'https://palromproducts.ro/',
            'Origin': 'https://palromproducts.ro'
          },
          body: JSON.stringify({
            _subject: `This is a test email - New B2B quote inquiry from ${clientName}`,
            _template: 'table',
            _captcha: 'false',
            _cc: 'matthias.radder@gmail.com',
            _replyto: clientEmail,
            "Client Name": clientName,
            "Client Email": clientEmail,
            "Client Phone": clientPhone,
            "Notes": clientNotes || 'No notes',
            ...items.reduce((acc, item, index) => {
              const matKey = `Material ${index + 1}`;
              acc[matKey] = `${item.name} (Quantity: ${item.qty})`;
              
              Object.entries(item).forEach(([k, v]) => {
                if (['id', 'isConfigured', 'name', 'category', 'categoryKey', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return;
                if (v === undefined || v === null || v === '') return;
                
                const label = localizeSpecKey(k, 'en');
                const val = localizeSpecValue(k, v, 'en');
                
                acc[`${matKey} - ${label}`] = val;
              });
              return acc;
            }, {})
          })
        });

        const data = await formSubmitRes.json();
        if (formSubmitRes.ok && data.success !== 'false') {
          console.log(`Internal quote inquiry sent successfully via FormSubmit.co to ${emailTo}`);
          emailSent = true;
        } else {
          console.error('FormSubmit.co API error response for inquiry:', data);
        }
      } catch (err) {
        console.error('Failed to send inquiry via FormSubmit.co:', err);
      }
    } else if (resendApiKey) {
      // 1. Send internal notification email to sales office (always in English for tests)
      try {
        const itemsHtml = items.map(item => {
          const specsList = Object.entries(item).map(([k, v]) => {
            if (['id', 'isConfigured', 'name', 'category', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return null;
            if (v === undefined || v === null || v === '') return null;
            
            // Render specifications in English for sales office
            const label = localizeSpecKey(k, 'en');
            const val = localizeSpecValue(k, v, 'en');
            
            return `<strong>${label}</strong>: ${val}`;
          }).filter(Boolean).join('<br />');

          return `
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 16px 0; vertical-align: top; font-family: sans-serif;">
                <span style="font-weight: 600; color: #1a202c; display: block; margin-bottom: 4px;">${item.name}</span>
                <span style="font-size: 0.85rem; color: #718096; display: block; line-height: 1.5;">
                  <strong>Category</strong>: ${item.category}${specsList ? `<br />${specsList}` : ''}
                </span>
              </td>
              <td style="padding: 16px 0; text-align: right; vertical-align: top; font-family: sans-serif; font-weight: 600; color: #1a202c;">
                ${item.qty}
              </td>
            </tr>
          `;
        }).join('');

        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <!-- Top brand bar -->
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b;">PALROM PRODUCTS</span>
              <h2 style="margin: 6px 0 0; font-size: 1.5rem; font-weight: 600; color: #1a202c;">B2B Quote Inquiry</h2>
            </div>

            <div style="margin-bottom: 32px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 16px; margin-top: 0;">Client Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 140px;">Name</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Email</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc;"><a href="mailto:${clientEmail}" style="color: #1e3a2b; text-decoration: none; border-bottom: 1px dotted #1e3a2b;">${clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Phone</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${clientPhone}</td>
                </tr>
                ${clientNotes ? `
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; color: #4a5568; font-weight: 500;">Notes</td>
                  <td style="padding: 8px 0; color: #2d3748; white-space: pre-line;">${clientNotes}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 16px; margin-top: 0;">Requested Materials</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <thead>
                  <tr style="border-bottom: 2px solid #edf2f7;">
                    <th style="padding: 12px 0; text-align: left; font-weight: 600; color: #4a5568;">Product Description</th>
                    <th style="padding: 12px 0; text-align: right; font-weight: 600; color: #4a5568; width: 80px;">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div style="border-top: 1px solid #edf2f7; padding-top: 24px; text-align: center; font-size: 0.8rem; color: #a0aec0;">
              <p style="margin: 0 0 4px;">This is an automated message from the B2B Quote Configurator.</p>
              <p style="margin: 0;">PALROM Products SRL • 8 Poienita St, Brad City, Hunedoara, Romania</p>
            </div>
          </div>
        `;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: emailFrom,
            to: emailTo,
            cc: 'matthias.radder@gmail.com',
            subject: `This is a test email - New B2B quote inquiry from ${clientName}`,
            html: htmlContent
          })
        });

        if (!resendRes.ok) {
          const errText = await resendRes.text();
          console.error('Resend API error response (internal email):', errText);
        } else {
          console.log('Internal sales notification email sent successfully via Resend');
          emailSent = true;
        }
      } catch (err) {
        console.error('Failed to send email via Resend:', err);
      }

      // 2. Send client confirmation email to clientEmail
      try {
        const emailLang = lang; // Revert to dynamic language chosen by customer
        const clientSubject = {
          nl: 'Ontvangstbevestiging offerteaanvraag - Palrom Products',
          en: 'Inquiry confirmation - Palrom Products',
          de: 'Bestätigung Ihrer Angebotsanfrage - Palrom Products',
          ro: 'Confirmare primire cerere de ofertă - Palrom Products'
        }[emailLang] || 'Ontvangstbevestiging offerteaanvraag - Palrom Products';

        const clientGreeting = {
          nl: `Beste ${clientName},`,
          en: `Dear ${clientName},`,
          de: `Sehr geehrte(r) ${clientName},`,
          ro: `Stimate ${clientName},`
        }[emailLang] || `Beste ${clientName},`;

        const clientThankYou = {
          nl: 'Bedankt voor uw offerteaanvraag. We hebben uw specificaties in goede orde ontvangen.',
          en: 'Thank you for your quote request. We have successfully received your specifications.',
          de: 'Vielen Dank für Ihre Angebotsanfrage. Wir haben Ihre Spezifikationen erhalten.',
          ro: 'Vă mulțumim pentru cererea de ofertă. Am primit specificațiile dumneavoastră în condiții bune.'
        }[emailLang] || 'Bedankt voor uw offerteaanvraag. We hebben uw specificaties in goede orde ontvangen.';

        const clientReassurance = {
          nl: 'Een medewerker van ons hoofdkantoor in Brad (Roemenië) zal uw aanvraag beoordelen. U ontvangt binnen 24 uur een gedetailleerde B2B-prijsopgave.',
          en: 'A team member from our headquarters in Brad (Romania) will review your request. You will receive a detailed B2B price quote within 24 hours.',
          de: 'Ein Mitarbeiter unserer Zentrale in Brad (Rumänien) will Ihre Anfrage prüfen. Sie erhalten innerhalb von 24 Stunden ein detailliertes B2B-Preisangebot.',
          ro: 'Un membru al echipei de la sediul nostru central din Brad (România) va analiza solicitarea. Veți primi o ofertă de preț detaliată B2B în termen de 24 de ore.'
        }[emailLang] || 'Een medewerker van ons hoofdkantoor in Brad (Roemenië) zal uw aanvraag beoordelen. U ontvangt binnen 24 uur een gedetailleerde B2B-prijsopgave.';

        const clientTitleItems = {
          nl: 'Aangevraagde Materialen',
          en: 'Requested Materials',
          de: 'Angeforderte Materialien',
          ro: 'Materiale Solicitate'
        }[emailLang] || 'Aangevraagde Materialen';

        const clientHeaderDesc = {
          nl: 'Productomschrijving',
          en: 'Product Description',
          de: 'Produktbeschreibung',
          ro: 'Descrierea Produsului'
        }[emailLang] || 'Productomschrijving';

        const clientHeaderQty = {
          nl: 'Aantal',
          en: 'Quantity',
          de: 'Menge',
          ro: 'Cantitate'
        }[emailLang] || 'Aantal';

        const clientFooterNote = {
          nl: 'Dit is een geautomatiseerde bevestiging van uw aanvraag. We nemen zo snel mogelijk contact met u op.',
          en: 'This is an automated confirmation of your request. We will contact you as soon as possible.',
          de: 'Dies ist eine automatische Bestätigung Ihrer Anfrage. Wir werden uns so schnell wie möglich mit Ihnen in Verbindung setzen.',
          ro: 'Aceasta este o confirmare automată a solicitării dumneavoastră. Vă vom contacta în cel mai scurt timp posibil.'
        }[emailLang] || 'Dit is een geautomatiseerde bevestiging van uw aanvraag. We nemen zo snel mogelijk contact met u op.';

        const clientItemsHtml = items.map(item => {
          const specsList = Object.entries(item).map(([k, v]) => {
            if (['id', 'isConfigured', 'name', 'category', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return null;
            if (v === undefined || v === null || v === '') return null;
            
            const label = localizeSpecKey(k, emailLang);
            const val = localizeSpecValue(k, v, emailLang);
            
            return `<strong>${label}</strong>: ${val}`;
          }).filter(Boolean).join(', ');

          return `
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 16px 0; vertical-align: top; font-family: sans-serif;">
                <span style="font-weight: 600; color: #1a202c; display: block; margin-bottom: 4px;">${item.name}</span>
                <span style="font-size: 0.85rem; color: #718096; display: block; line-height: 1.4;">
                  Categorie: ${item.category} ${specsList ? ` | ${specsList}` : ''}
                </span>
              </td>
              <td style="padding: 16px 0; text-align: right; vertical-align: top; font-family: sans-serif; font-weight: 600; color: #1a202c;">
                ${item.qty}
              </td>
            </tr>
          `;
        }).join('');

        const clientHtmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-top: 4px solid #e7b124; border-radius: 8px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <!-- Header -->
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b; display: block; margin-bottom: 4px;">PALROM PRODUCTS</span>
              <h2 style="margin: 0; font-size: 1.4rem; font-weight: 600; color: #1a202c;">${clientSubject}</h2>
            </div>
            
            <!-- Greeting & Text -->
            <p style="font-size: 1rem; color: #1a202c; margin-top: 0; margin-bottom: 12px; font-weight: 600;">${clientGreeting}</p>
            <p style="font-size: 0.95rem; color: #2d3748; margin-top: 0; margin-bottom: 16px;">${clientThankYou}</p>
            <div style="font-size: 0.95rem; color: #2d3748; margin-top: 0; margin-bottom: 32px; padding: 12px 16px; background-color: #f7fafc; border-left: 3px solid #1e3a2b; border-radius: 4px; font-style: italic;">
              ${clientReassurance}
            </div>

            <!-- Items list -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 16px; margin-top: 0;">${clientTitleItems}</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <thead>
                  <tr style="border-bottom: 2px solid #edf2f7;">
                    <th style="padding: 12px 0; text-align: left; font-weight: 600; color: #4a5568;">${clientHeaderDesc}</th>
                    <th style="padding: 12px 0; text-align: right; font-weight: 600; color: #4a5568; width: 80px;">${clientHeaderQty}</th>
                  </tr>
                </thead>
                <tbody>
                  ${clientItemsHtml}
                </tbody>
              </table>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #edf2f7; padding-top: 24px; text-align: center; font-size: 0.8rem; color: #a0aec0;">
              <p style="margin: 0 0 8px;">${clientFooterNote}</p>
              <p style="margin: 0; font-weight: 500;">PALROM Products SRL • 8 Poienita St, Brad City, Hunedoara, Romania</p>
            </div>
          </div>
        `;

        const clientRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: emailFrom,
            to: clientEmail,
            subject: clientSubject,
            html: clientHtmlContent
          })
        });

        if (!clientRes.ok) {
          const errText = await clientRes.text();
          console.warn('Resend client confirmation warning (normal in sandbox mode):', errText);
        } else {
          console.log('Client confirmation email sent successfully via Resend');
        }
      } catch (clientErr) {
        console.warn('Failed to send client confirmation email:', clientErr);
      }
    } else {
      console.log('Neither FormSubmit nor Resend configured, skipping email delivery');
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry processed successfully',
      savedToDatabase,
      recordId: newRecordWithMeta.id,
      emailSent
    });
  } catch (error) {
    console.error('Error handling inquiry submission:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing inquiry.' },
      { status: 500 }
    );
  }
}
