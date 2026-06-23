import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, position, message, lang = 'nl', cvBase64, cvFilename, cvFileType } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !position || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, position, and message are required.' },
        { status: 400 }
      );
    }

    const applicationRecord = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      position: position,
      message: message.trim(),
      cv_filename: cvFilename || '',
      cv_filetype: cvFileType || '',
    };

    // Save locally to applications.json for auditing/local logs
    const localDbPath = path.join(process.cwd(), 'applications.json');
    let localRecords = [];
    try {
      if (fs.existsSync(localDbPath)) {
        const fileContent = fs.readFileSync(localDbPath, 'utf8');
        localRecords = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Failed to read local applications file:', err);
    }

    const newRecordWithMeta = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...applicationRecord,
    };

    localRecords.push(newRecordWithMeta);

    try {
      fs.writeFileSync(localDbPath, JSON.stringify(localRecords, null, 2), 'utf8');
      console.log('Saved application submission locally to applications.json');
    } catch (err) {
      console.error('Failed to write to local applications file:', err);
    }

    // Resolve job names
    const fallbackJobNames = {
      planing_operator: {
        nl: 'Operator Schaafmachine',
        en: 'Planing Machine Operator',
        de: 'Hobelmaschinenführer',
        ro: 'Operator Rindele'
      },
      quality_inspector: {
        nl: 'Inspecteur Kwaliteitscontrole & Sortering',
        en: 'Quality & Defect Inspector',
        de: 'Qualitäts- und Mängelprüfer',
        ro: 'Inspector Calitate & Defecte'
      },
      maintenance_mechanic: {
        nl: 'Onderhoudsmonteur / Werktuigbouwkundige',
        en: 'Maintenance Mechanic / Millwright',
        de: 'Wartungsmechaniker / Maschinenschlosser',
        ro: 'Mecanic Întreținere'
      },
      general_application: {
        nl: 'Open Sollicitatie',
        en: 'General Job Application',
        de: 'Initiativbewerbung',
        ro: 'Candidatură Spontană'
      },
    };

    let resolvedJobTitle = fallbackJobNames[position];

    // Try finding matching job title from dynamic vacancies database
    try {
      const vacanciesPath = path.join(process.cwd(), 'vacancies.json');
      if (fs.existsSync(vacanciesPath)) {
        const vacancies = JSON.parse(fs.readFileSync(vacanciesPath, 'utf8'));
        const matchedJob = vacancies.find(v => v.id === position);
        if (matchedJob) {
          resolvedJobTitle = matchedJob.title;
        }
      }
    } catch (err) {
      console.error('Failed to resolve dynamic job name:', err);
    }

    if (!resolvedJobTitle) {
      resolvedJobTitle = {
        nl: position,
        en: position,
        de: position,
        ro: position
      };
    }

    const formattedJobName = resolvedJobTitle.en || position;

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO_HR || 'anca.mihut@palromproducts.ro';
    const emailFrom = process.env.EMAIL_FROM || 'PALROM Products <website@palromproducts.com>';

    let emailSent = false;
    let cvContentBase64 = null;

    if (cvBase64 && cvBase64.includes(';base64,')) {
      cvContentBase64 = cvBase64.split(';base64,')[1];
    } else if (cvBase64) {
      cvContentBase64 = cvBase64;
    }

    if (resendApiKey) {
      // 1. Send internal notification email to HR manager (Anca Mihuț)
      try {
        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-top: 4px solid #1e3a2b; border-radius: 12px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <!-- Top brand bar -->
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b;">PALROM PRODUCTS</span>
              <h2 style="margin: 6px 0 0; font-size: 1.5rem; font-weight: 600; color: #1a202c;">Candidatură nouă (Job Application)</h2>
            </div>

            <div style="margin-bottom: 32px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 180px;">Nume candidat</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">E-mail</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc;"><a href="mailto:${email}" style="color: #1e3a2b; text-decoration: none; font-weight: 600;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Telefon</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Poziție solicitată</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c; font-weight: bold;">${formattedJobName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Fișier CV</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${cvFilename ? cvFilename : 'Fără CV (Nespecificat)'}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 12px; margin-top: 0;">Scrisoare de intenție / Motivare</h3>
              <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #2d3748; white-space: pre-line; border: 1px solid #edf2f7; border-left: 3px solid #1e3a2b;">
                ${message}
              </div>
            </div>

            <div style="border-top: 1px solid #edf2f7; padding-top: 24px; text-align: center; font-size: 0.8rem; color: #a0aec0;">
              <p style="margin: 0 0 4px;">Această candidatură a fost trimisă prin intermediul formularului de cariere de pe site-ul Palrom Products.</p>
              <p style="margin: 0;">PALROM Products SRL • 8 Poienita St, Brad City, Hunedoara, Romania</p>
            </div>
          </div>
        `;

        const subjectLine = `[Candidatură] Solicitare job de la ${name} - ${formattedJobName}`;

        const attachments = cvContentBase64 ? [
          {
            filename: cvFilename || 'CV.pdf',
            content: cvContentBase64
          }
        ] : [];

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [emailTo, 'matthias.radder@gmail.com'],
            subject: subjectLine,
            html: htmlContent,
            attachments
          })
        });

        if (!resendRes.ok) {
          const errText = await resendRes.text();
          console.error('Resend API error response (internal email):', errText);

          if (errText.includes('validation_error') || errText.includes('testing emails') || errText.includes('not verified')) {
            console.log('Attempting Resend sandbox fallback to matthias.radder@gmail.com');
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
              },
              body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: 'matthias.radder@gmail.com',
                subject: `[Sandbox Fallback] ${subjectLine}`,
                html: htmlContent,
                attachments
              })
            });
            if (fallbackRes.ok) {
              console.log('Sandbox fallback email sent successfully to matthias.radder@gmail.com');
              emailSent = true;
            } else {
              console.error('Resend fallback failed:', await fallbackRes.text());
            }
          }
        } else {
          console.log('Internal HR job application email sent successfully via Resend');
          emailSent = true;
        }
      } catch (err) {
        console.error('Failed to send job application email via Resend:', err);
      }

      // 2. Send confirmation email to applicant in their selected language
      try {
        const clientSubject = {
          nl: 'Ontvangstbevestiging sollicitatie - Palrom Products',
          en: 'Application confirmation - Palrom Products',
          de: 'Empfangsbestätigung Ihrer Bewerbung - Palrom Products',
          ro: 'Confirmare primire candidatură - Palrom Products'
        }[lang] || 'Ontvangstbevestiging sollicitatie - Palrom Products';

        const clientGreeting = {
          nl: `Beste ${name},`,
          en: `Dear ${name},`,
          de: `Sehr geehrte(r) ${name},`,
          ro: `Stimate ${name},`
        }[lang] || `Beste ${name},`;

        const clientThankYou = {
          nl: `Bedankt voor uw sollicitatie voor de functie "${resolvedJobTitle.nl || position}". We hebben uw gegevens en motivatie succesvol ontvangen door Anca Mihuț.`,
          en: `Thank you for your application for the "${resolvedJobTitle.en || position}" position. We have successfully received your details and message.`,
          de: `Vielen Dank für Ihre Bewerbung um die Stelle als "${resolvedJobTitle.de || position}". Wir haben Ihre Unterlagen und Motivation erhalten.`,
          ro: `Vă mulțumim pentru candidatura pentru poziția de "${resolvedJobTitle.ro || position}". Am primit cu succes detaliile și mesajul dumneavoastră.`
        }[lang] || `Bedankt voor uw sollicitatie. We hebben uw gegevens ontvangen.`;

        const clientReassurance = {
          nl: 'Onze afdeling Personeelszaken (HR) zal uw cv en motivatie beoordelen. We streven ernaar om binnen 2 werkdagen contact met u op te nemen.',
          en: 'Our Human Resources department will review your application. We aim to get back to you within 2 working days.',
          de: 'Unsere Personalabteilung (HR) wird Ihre Bewerbung prüfen. Wir sind bestrebt, uns innerhalb von 2 Werktagen bei Ihnen te melden.',
          ro: 'Departamentul nostru de Resurse Umane (HR) va analiza candidatura dumneavoastră. Ne propunem să vă răspundem în termen de 2 zile lucrătoare.'
        }[lang] || 'We zullen uw sollicitatie zo snel mogelijk beoordelen.';

        const clientFooterNote = {
          nl: 'Dit is een automatische ontvangstbevestiging van uw sollicitatie.',
          en: 'This is an automated confirmation of receipt of your application.',
          de: 'Dies ist eine automatische Empfangsbestätigung Ihrer Bewerbung.',
          ro: 'Aceasta este o confirmare automată de primire a candidaturii dumneavoastră.'
        }[lang] || 'Dit is een automatische ontvangstbevestiging.';

        const clientHtmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-top: 4px solid #e7b124; border-radius: 8px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b; display: block; margin-bottom: 4px;">PALROM PRODUCTS</span>
              <h2 style="margin: 0; font-size: 1.4rem; font-weight: 600; color: #1a202c;">${clientSubject}</h2>
            </div>
            
            <p style="font-size: 1rem; color: #1a202c; margin-top: 0; margin-bottom: 12px; font-weight: 600;">${clientGreeting}</p>
            <p style="font-size: 0.95rem; color: #2d3748; margin-top: 0; margin-bottom: 16px;">${clientThankYou}</p>
            <div style="font-size: 0.95rem; color: #2d3748; margin-top: 0; margin-bottom: 32px; padding: 12px 16px; background-color: #f7fafc; border-left: 3px solid #1e3a2b; border-radius: 4px; font-style: italic;">
              ${clientReassurance}
            </div>
            
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
          console.warn('Resend client application copy warning:', errText);

          if (errText.includes('validation_error') || errText.includes('testing emails') || errText.includes('not verified')) {
            console.log('Attempting Sandbox client application copy fallback to matthias.radder@gmail.com');
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
              },
              body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: 'matthias.radder@gmail.com',
                subject: `[Sandbox Client Apply Copy] ${clientSubject}`,
                html: clientHtmlContent
              })
            });
            if (fallbackRes.ok) {
              console.log('Sandbox client application copy fallback email sent successfully to matthias.radder@gmail.com');
            } else {
              console.error('Sandbox client application copy fallback failed:', await fallbackRes.text());
            }
          }
        } else {
          console.log('Client application confirmation email sent successfully via Resend');
        }
      } catch (clientErr) {
        console.warn('Failed to send client application confirmation email:', clientErr);
      }
    } else {
      console.log('Resend API key not configured, skipping email delivery for careers application');
    }

    return NextResponse.json({
      success: true,
      message: 'Application processed successfully',
      recordId: newRecordWithMeta.id,
      emailSent
    });
  } catch (error) {
    console.error('Error handling application submission:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing application submission.' },
      { status: 500 }
    );
  }
}
