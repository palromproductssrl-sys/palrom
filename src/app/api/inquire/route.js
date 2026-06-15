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

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientPhone, clientNotes, items } = body;

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

    // Send email via Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO || 'office@palromproducts.ro';
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    let emailSent = false;
    if (resendApiKey) {
      try {
        const itemsHtml = items.map(item => {
          const specsList = Object.entries(item).map(([k, v]) => {
            if (['id', 'isConfigured', 'name', 'category', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return null;
            if (v === undefined || v === null || v === '') return null;
            let label = k;
            let val = v;
            if (k === 'dims') label = 'Afmetingen';
            else if (k === 'grade') {
              label = 'Kwaliteit';
              if (v === 'A') val = 'Klasse A (Foutvrij)';
              else if (v === 'B') val = 'Klasse B (Meubelhout)';
              else if (v === 'C') val = 'Klasse C (Constructief)';
            }
            else if (k === 'fsc') {
              label = 'Certificering';
              val = v ? 'FSC® 100%' : 'Geen FSC';
            }
            else if (k === 'drying') {
              label = 'Droging';
              val = v === 'luchtdroog' ? 'Luchtdroog' : 'Kamerdroog (KD 10-12%)';
            }
            else if (k === 'additionalInfo') label = 'Notities';
            
            return `<strong>${label}</strong>: ${val}`;
          }).filter(Boolean).join(', ');

          return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: sans-serif;">
                <strong style="color: #1e3a2b;">${item.name}</strong><br/>
                <span style="font-size: 0.85rem; color: #4a5568;">Categorie: ${item.category} ${specsList ? `| ${specsList}` : ''}</span>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: sans-serif; font-weight: bold;">${item.qty}</td>
            </tr>
          `;
        }).join('');

        const htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <div style="background-color: #1e3a2b; color: #ffffff; padding: 25px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
              <h1 style="margin: 0; font-size: 1.6rem; letter-spacing: 0.5px;">Nieuwe B2B Offerteaanvraag</h1>
              <p style="margin: 5px 0 0; opacity: 0.85; font-size: 0.9rem;">Palrom Products B2B Configurator</p>
            </div>
            <div style="padding: 25px;">
              <h3 style="color: #1e3a2b; border-bottom: 2px solid #f1c437; padding-bottom: 6px; margin-top: 0; font-size: 1.1rem;">Klantgegevens</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #4a5568;">Naam:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mailadres:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${clientEmail}" style="color: #1e3a2b; text-decoration: underline;">${clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Telefoonnummer:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${clientPhone}</td>
                </tr>
                ${clientNotes ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top; color: #4a5568;">Extra opmerkingen:</td>
                  <td style="padding: 8px 0; white-space: pre-line; color: #2d3748;">${clientNotes}</td>
                </tr>
                ` : ''}
              </table>

              <h3 style="color: #1e3a2b; border-bottom: 2px solid #f1c437; padding-bottom: 6px; font-size: 1.1rem; margin-top: 0;">Geconfigureerde Materialen</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <thead>
                  <tr style="background-color: #f7fafc;">
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; color: #4a5568;">Productomschrijving</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center; width: 80px; color: #4a5568;">Aantal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>
            <div style="background-color: #f7fafc; color: #718096; padding: 15px; text-align: center; font-size: 0.8rem; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #e2e8f0;">
              Dit is een geautomatiseerde aanvraag verzonden vanaf de B2B Offerte Configurator.
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
            subject: `Nieuwe B2B Offerteaanvraag van ${clientName}`,
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
