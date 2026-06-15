import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, productType, message } = body;

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
      try {
        const productInterestLabels = {
          dowels: 'Beukenhouten stokken',
          planed: 'Beukenhouten latten',
          profiles: 'Beukenhouten profielen',
          specials: 'Beukenhouten bestekken',
          general: 'Algemene Houtinkoop Aanvraag',
          careers: 'Sollicitatie / Werken bij',
        };
        const interestLabel = productInterestLabels[productType] || productType;

        const htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <div style="background-color: #1e3a2b; color: #ffffff; padding: 25px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
              <h1 style="margin: 0; font-size: 1.6rem; letter-spacing: 0.5px;">Nieuw Contactbericht</h1>
              <p style="margin: 5px 0 0; opacity: 0.85; font-size: 0.9rem;">Palrom Products Contactformulier</p>
            </div>
            <div style="padding: 25px;">
              <h3 style="color: #1e3a2b; border-bottom: 2px solid #f1c437; padding-bottom: 6px; margin-top: 0; font-size: 1.1rem;">Bericht Details</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #4a5568;">Naam:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mailadresse:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1e3a2b; text-decoration: underline;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Telefoonnummer:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${phone || 'Niet ingevuld'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Bedrijf:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${company || 'Niet ingevuld'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Onderwerp / Interesse:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${interestLabel}</td>
                </tr>
              </table>

              <h3 style="color: #1e3a2b; border-bottom: 2px solid #f1c437; padding-bottom: 6px; font-size: 1.1rem; margin-top: 0;">Inhoud Bericht</h3>
              <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; font-size: 0.95rem; line-height: 1.5; color: #2d3748; white-space: pre-line; border: 1px solid #e2e8f0;">
                ${message}
              </div>
            </div>
            <div style="background-color: #f7fafc; color: #718096; padding: 15px; text-align: center; font-size: 0.8rem; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #e2e8f0;">
              Dit bericht is verzonden via het contactformulier op de Palrom Products website.
            </div>
          </div>
        `;

        const subjectLine = productType === 'careers'
          ? `[Sollicitatie] Nieuwe inzending van ${name}`
          : `[Contact] Bericht van ${name} (${interestLabel})`;

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
          console.error('Resend API error response:', errText);
        } else {
          console.log('Email sent successfully via Resend');
          emailSent = true;
        }
      } catch (err) {
        console.error('Failed to send email via Resend:', err);
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
