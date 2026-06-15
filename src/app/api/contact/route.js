import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, productType, message, lang = 'nl' } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !productType || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, productType, and message are required.' },
        { status: 400 }
      );
    }

    const contactRecord = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      company: company?.trim() || '',
      product_type: productType,
      message: message.trim(),
    };

    // Save locally to contacts.json for debugging/local parity
    const localDbPath = path.join(process.cwd(), 'contacts.json');
    let localRecords = [];
    try {
      if (fs.existsSync(localDbPath)) {
        const fileContent = fs.readFileSync(localDbPath, 'utf8');
        localRecords = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Failed to read local contacts file:', err);
    }

    const newRecordWithMeta = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...contactRecord,
    };

    localRecords.push(newRecordWithMeta);

    try {
      fs.writeFileSync(localDbPath, JSON.stringify(localRecords, null, 2), 'utf8');
      console.log('Saved contact submission locally to contacts.json');
    } catch (err) {
      console.error('Failed to write to local contacts file:', err);
    }

    // Send email via Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO || 'office@palromproducts.ro';
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    let emailSent = false;
    if (resendApiKey) {
      // 1. Send internal notification email to sales office (always in Romanian)
      try {
        const productInterestLabelsInternal = {
          dowels: 'Tije din lemn de fag',
          planed: 'Șipci rindeluite din lemn de fag',
          profiles: 'Profile din lemn de fag',
          specials: 'Piese brute din lemn de fag',
          general: 'Cerere Generală de Aprovizionare',
          careers: 'Cariere / Solicitare Job',
        };
        const interestLabel = productInterestLabelsInternal[productType] || productType;

        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <!-- Top brand bar -->
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b;">PALROM PRODUCTS</span>
              <h2 style="margin: 6px 0 0; font-size: 1.5rem; font-weight: 600; color: #1a202c;">Mesaj nou de contact</h2>
            </div>

            <div style="margin-bottom: 32px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 140px;">Nume</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">E-mail</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc;"><a href="mailto:${email}" style="color: #1e3a2b; text-decoration: none; border-bottom: 1px dotted #1e3a2b;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Telefon</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${phone || 'Nespecificat'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Companie</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${company || 'Nespecificată'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Interes</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${interestLabel}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 12px; margin-top: 0;">Mesaj</h3>
              <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #2d3748; white-space: pre-line; border: 1px solid #edf2f7;">
                ${message}
              </div>
            </div>

            <div style="border-top: 1px solid #edf2f7; padding-top: 24px; text-align: center; font-size: 0.8rem; color: #a0aec0;">
              <p style="margin: 0 0 4px;">Acest mesaj a fost trimis prin intermediul formularului de contact de pe site-ul Palrom Products.</p>
              <p style="margin: 0;">PALROM Products SRL • 8 Poienita St, Brad City, Hunedoara, Romania</p>
            </div>
          </div>
        `;

        const subjectLine = productType === 'careers'
          ? `[Candidatură] Mesaj nou de la ${name}`
          : `[Contact] Mesaj de la ${name} (${interestLabel})`;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: emailFrom,
            to: emailTo,
            subject: subjectLine,
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
        console.error('Failed to send internal email via Resend:', err);
      }      // 2. Send client confirmation email to customer
      try {
        const emailLang = lang; // Revert to dynamic language chosen by customer
        const clientSubject = {
          nl: 'Ontvangstbevestiging contactformulier - Palrom Products',
          en: 'Contact form receipt - Palrom Products',
          de: 'Bestätigung Ihres Kontaktformulars - Palrom Products',
          ro: 'Confirmare primire formular de contact - Palrom Products'
        }[emailLang] || 'Ontvangstbevestiging contactformulier - Palrom Products';

        const clientGreeting = {
          nl: `Beste ${name},`,
          en: `Dear ${name},`,
          de: `Sehr geehrte(r) ${name},`,
          ro: `Stimate ${name},`
        }[emailLang] || `Beste ${name},`;

        const clientThankYou = {
          nl: 'Bedankt voor uw bericht aan Palrom Products. We hebben uw aanvraag in goede orde ontvangen.',
          en: 'Thank you for contacting Palrom Products. We have successfully received your request.',
          de: 'Vielen Dank für Ihre Nachricht an Palrom Products. Wir haben Ihre Anfrage erhalten.',
          ro: 'Vă mulțumim pentru mesajul trimis către Palrom Products. Am primit solicitarea dumneavoastră.'
        }[emailLang] || 'Bedankt voor uw bericht aan Palrom Products. We hebben uw aanvraag in goede orde ontvangen.';

        const clientReassurance = {
          nl: 'We streven ernaar om alle vragen binnen 24 uur te beantwoorden.',
          en: 'We aim to respond to all inquiries within 24 hours.',
          de: 'Wir sind bestrebt, alle Anfragen innerhalb von 24 Stunden zu beantworten.',
          ro: 'Ne propunem să răspundem la toate solicitările în termen de 24 de ore.'
        }[emailLang] || 'We streven ernaar om alle vragen binnen 24 uur te beantwoorden.';

        const clientTitleDetails = {
          nl: 'Ingezonden details',
          en: 'Submitted details',
          de: 'Übermittelte Details',
          ro: 'Detalii trimise'
        }[emailLang] || 'Ingezonden details';

        const clientLabelPhone = {
          nl: 'Telefoonnummer',
          en: 'Phone Number',
          de: 'Telefonnummer',
          ro: 'Număr de Telefon'
        }[emailLang] || 'Telefoonnummer';

        const clientLabelCompany = {
          nl: 'Bedrijf',
          en: 'Company',
          de: 'Unternehmen',
          ro: 'Companie'
        }[emailLang] || 'Bedrijf';

        const clientLabelCategory = {
          nl: 'Geselecteerde productcategorie',
          en: 'Selected product category',
          de: 'Ausgewählte Produktkategorie',
          ro: 'Categoria de produse selectată'
        }[emailLang] || 'Geselecteerde productcategorie';

        const clientTitleMsg = {
          nl: 'Uw bericht',
          en: 'Your message',
          de: 'Ihre Nachricht',
          ro: 'Mesajul dumneavoastră'
        }[emailLang] || 'Uw bericht';

        const clientFooterNote = {
          nl: 'Dit is een geautomatiseerde bevestiging van uw contactaanvraag.',
          en: 'This is an automated confirmation of your contact request.',
          de: 'Dies ist eine automatische Bestätigung Ihrer Kontaktanfrage.',
          ro: 'Aceasta este o confirmare automată a solicitării dumneavoastră de contact.'
        }[emailLang] || 'Dit is een geautomatiseerde bevestiging van uw contactaanvraag.';

        const productInterestLabelsLocalized = {
          nl: {
            dowels: 'Beukenhouten stokken',
            planed: 'Beukenhouten latten',
            profiles: 'Beukenhouten profielen',
            specials: 'Beukenhouten bestekken',
            general: 'Algemene Houtinkoop Aanvraag',
            careers: 'Sollicitatie / Werken bij',
          },
          en: {
            dowels: 'Beechwood dowels / sticks',
            planed: 'Beechwood planed slats',
            profiles: 'Beechwood profiles',
            specials: 'Beechwood special blanks',
            general: 'General Timber Sourcing',
            careers: 'Careers / Job Application',
          },
          de: {
            dowels: 'Buchenholzstäbe / Rundstäbe',
            planed: 'Buchenholzleisten / Gehobelt',
            profiles: 'Buchenholzprofile',
            specials: 'Buchenholz-Zuschnitte',
            general: 'Allgemeine Holzanfrage',
            careers: 'Karriere / Bewerbung',
          },
          ro: {
            dowels: 'Tije din lemn de fag',
            planed: 'Șipci rindeluite din lemn de fag',
            profiles: 'Profile din lemn de fag',
            specials: 'Piese brute din lemn de fag',
            general: 'Cerere Generală de Aprovizionare',
            careers: 'Cariere / Solicitare Job',
          }
        };

        const clientInterestLabel = productInterestLabelsLocalized[emailLang]?.[productType] || productInterestLabelsLocalized.nl[productType] || productType;

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

            <!-- Submission Details -->
            <div style="margin-bottom: 32px; background-color: #ffffff; border: 1px solid #edf2f7; border-radius: 8px; padding: 20px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 16px; margin-top: 0;">${clientTitleDetails}</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 180px;">${clientLabelPhone}</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${phone}</td>
                </tr>
                ` : ''}
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 180px;">${clientLabelCompany}</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 180px;">${clientLabelCategory}</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${clientInterestLabel}</td>
                </tr>
              </table>
            </div>

            <!-- Message Box -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 12px; margin-top: 0;">${clientTitleMsg}</h3>
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #2d3748; white-space: pre-line; border: 1px solid #edf2f7; border-left: 3px solid #e7b124;">
                ${message}
              </div>
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
            to: email,
            subject: clientSubject,
            html: clientHtmlContent
          })
        });

        if (!clientRes.ok) {
          const errText = await clientRes.text();
          console.warn('Resend client contact confirmation warning (normal in sandbox mode):', errText);
        } else {
          console.log('Client contact confirmation email sent successfully via Resend');
        }
      } catch (clientErr) {
        console.warn('Failed to send client contact confirmation email:', clientErr);
      }
    } else {
      console.log('Resend API key not configured, skipping email delivery');
    }

    return NextResponse.json({
      success: true,
      message: 'Contact submission processed successfully',
      recordId: newRecordWithMeta.id,
      emailSent
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing contact submission.' },
      { status: 500 }
    );
  }
}
