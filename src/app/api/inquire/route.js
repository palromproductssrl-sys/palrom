import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export function generatePdfBuffer(clientName, clientEmail, clientPhone, clientNotes, items) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // 1. Brand Header
      doc.fillColor('#1e3a2b') // forest dark
         .fontSize(22)
         .font('Helvetica-Bold')
         .text('PALROM PRODUCTS', 40, 40);
         
      doc.fillColor('#e7b124') // primary gold
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('FSC® 100% CERTIFIED BEECHWOOD MANUFACTURER', 40, 65);

      // Accent top line
      doc.moveTo(40, 80).lineTo(550, 80).strokeColor('#e7b124').lineWidth(3).stroke();

      // Title
      doc.fillColor('#000000')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('B2B Quote Request / Cerere de Oferta', 40, 95);

      // 2. Client Details Box
      doc.fillColor('#f8fafc');
      doc.rect(40, 125, 510, 95).fill();
      doc.strokeColor('#edf2f7').lineWidth(1).stroke();

      doc.fillColor('#1a202c')
         .fontSize(11)
         .font('Helvetica-Bold')
         .text('Client Details / Detalii Client', 50, 135);

      doc.font('Helvetica').fontSize(10);
      doc.text(`Name / Nume: ${clientName}`, 50, 155);
      doc.text(`Email: ${clientEmail}`, 50, 170);
      doc.text(`Phone / Telefon: ${clientPhone}`, 50, 185);
      
      const notesY = 235;
      if (clientNotes) {
        doc.fillColor('#000000');
        doc.font('Helvetica-Bold').text('Notes / Note:', 40, notesY);
        doc.font('Helvetica').text(clientNotes, 40, notesY + 15, { width: 510 });
      }

      // 3. Table of Products
      let startY = clientNotes ? notesY + 60 : 235;
      
      doc.fillColor('#000000');
      doc.font('Helvetica-Bold').fontSize(12).text('Requested Products / Produse Solicitate', 40, startY);
      
      startY += 20;
      // Table Header Row
      doc.fillColor('#1e3a2b').rect(40, startY, 510, 20).fill();
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
      doc.text('Product Name', 45, startY + 5, { width: 180 });
      doc.text('Dimensions', 230, startY + 5, { width: 140 });
      doc.text('Grade', 380, startY + 5, { width: 50 });
      doc.text('Drying', 440, startY + 5, { width: 60 });
      doc.text('Qty', 510, startY + 5, { width: 35, align: 'right' });

      let currentY = startY + 20;
      doc.fillColor('#000000').font('Helvetica').fontSize(9);

      items.forEach((item, index) => {
        // Draw row background for alternating rows
        if (index % 2 === 0) {
          doc.fillColor('#f8fafc').rect(40, currentY, 510, 24).fill();
        }
        
        doc.fillColor('#000000');
        doc.text(item.name || '', 45, currentY + 7, { width: 180 });
        doc.text(item.dims || '', 230, currentY + 7, { width: 140 });
        doc.text(item.grade || 'A', 380, currentY + 7, { width: 50 });
        
        const dryText = item.drying === 'luchtdroog' ? 'AD' : 'KD';
        doc.text(dryText, 440, currentY + 7, { width: 60 });
        
        doc.text(String(item.qty), 510, currentY + 7, { width: 35, align: 'right' });
        
        // Bottom border for row
        doc.moveTo(40, currentY + 24).lineTo(550, currentY + 24).strokeColor('#edf2f7').lineWidth(1).stroke();
        currentY += 24;
      });

      // Footer
      doc.fillColor('#718096')
         .fontSize(8)
         .text('PALROM Products SRL \u2022 8 Poienita St, Brad City, Hunedoara, Romania', 40, 770, { align: 'center', width: 510 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

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
    const useFormSubmit = process.env.USE_FORMSUBMIT === 'true'; // Default to false (use Resend)
    const emailTo = process.env.EMAIL_TO || 'office@palromproducts.ro';
    const emailFrom = process.env.EMAIL_FROM || 'PALROM Products <website@palromproducts.com>';

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
            _subject: `This is a test email - Solicitare ofertă B2B de la ${clientName} (New B2B quote inquiry from ${clientName})`,
            _template: 'table',
            _captcha: 'false',
            _cc: 'matthias.radder@gmail.com',
            _replyto: clientEmail,
            "Rezultatul configuratorului B2B (B2B Configurator Output)": "Această cerere de ofertă a fost generată automat și trimisă ca rezultat direct al configuratorului online de oferte B2B de pe site-ul PALROM Products. Aceasta conține datele de contact ale potențialului client și specificațiile tehnice ale produselor configurate. Vă rugăm să analizați aceste informații de mai jos pentru a procesa solicitarea și a redacta o ofertă personalizată B2B. / This quote inquiry has been automatically generated and submitted as a direct output of the online B2B quote configurator on the PALROM Products website. It contains the contact details of the prospect and the technical specifications of their configured products. Please review this information below to process their request and draft a customized B2B quotation.",
            " ": " ",
            "=== DETALII CLIENT (CLIENT DETAILS) ===": "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
            "Nume client (Client Name)": clientName,
            "E-mail client (Client Email)": clientEmail,
            "Telefon client (Client Phone)": clientPhone,
            "Note (Notes)": clientNotes || 'Fără note (No notes)',
            ...items.reduce((acc, item, index) => {
              const prodKey = `=== PRODUSUL ${index + 1} (PRODUCT ${index + 1}) ===`;
              acc["  " + index] = " ";
              acc[prodKey] = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
              acc[`Nume produs ${index + 1} (Product ${index + 1} Name)`] = item.name;
              acc[`Cantitate produs ${index + 1} (Product ${index + 1} Qty)`] = item.qty;
              
              Object.entries(item).forEach(([k, v]) => {
                if (['id', 'isConfigured', 'name', 'category', 'categoryKey', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return;
                if (v === undefined || v === null || v === '') return;
                
                const labelRo = localizeSpecKey(k, 'ro');
                const labelEn = localizeSpecKey(k, 'en');
                const label = `${labelRo} (${labelEn})`;
                
                const valRo = localizeSpecValue(k, v, 'ro');
                const valEn = localizeSpecValue(k, v, 'en');
                const val = valRo === valEn ? valRo : `${valRo} (${valEn})`;
                
                acc[`Produsul ${index + 1} - ${label}`] = val;
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
        const itemsHtml = items.map((item, index) => {
          const specsList = Object.entries(item).map(([k, v]) => {
            if (['id', 'isConfigured', 'name', 'category', 'categoryKey', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return null;
            if (v === undefined || v === null || v === '') return null;
            
            // Render specifications in Romanian + English for sales office
            const labelRo = localizeSpecKey(k, 'ro');
            const labelEn = localizeSpecKey(k, 'en');
            const label = `${labelRo} (${labelEn})`;

            const valRo = localizeSpecValue(k, v, 'ro');
            const valEn = localizeSpecValue(k, v, 'en');
            const val = valRo === valEn ? valRo : `${valRo} (${valEn})`;
            
            return `
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: 500; width: 200px; vertical-align: top;">${label}</td>
                <td style="padding: 4px 0; color: #0f172a; font-weight: 600; vertical-align: top;">${val}</td>
              </tr>
            `;
          }).filter(Boolean).join('');

          return `
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 20px; border: 1px solid #e2e8f0; background-color: #ffffff; border-radius: 8px; border-collapse: separate; font-family: sans-serif;">
              <tr>
                <td style="padding: 20px;">
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; border-bottom: 1px solid #edf2f7;">
                    <tr>
                      <td style="padding: 0 0 12px 0; vertical-align: middle;">
                        <h4 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #0f172a;">Produsul ${index + 1} (Product ${index + 1}): ${item.name}</h4>
                      </td>
                      <td style="padding: 0 0 12px 0; text-align: right; vertical-align: middle; width: 140px;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: #1e3a2b; background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 4px 10px; border-radius: 6px; white-space: nowrap;">Cant. (Qty): ${item.qty}</span>
                      </td>
                    </tr>
                  </table>
                  <div style="font-size: 0.9rem; color: #475569; line-height: 1.6;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-weight: 500; width: 200px; vertical-align: top;">Categorie (Category)</td>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600; vertical-align: top;">${item.category}</td>
                      </tr>
                      ${specsList}
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          `;
        }).join('');

        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-top: 4px solid #e7b124; border-radius: 8px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <!-- Header -->
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b; display: block; margin-bottom: 4px;">PALROM PRODUCTS</span>
              <h2 style="margin: 0; font-size: 1.4rem; font-weight: 600; color: #1a202c;">Cerere de ofertă B2B (B2B Quote Inquiry)</h2>
            </div>

            <p style="font-size: 0.95rem; color: #475569; margin-top: 0; margin-bottom: 24px; line-height: 1.6;">
              Această notificare internă a fost generată automat și trimisă ca rezultat direct al configuratorului online B2B de pe site-ul PALROM Products. Un potențial client a finalizat configurarea produselor și a trimis o solicitare de preț. Mai jos veți găsi datele de contact ale clientului, notele opționale și specificațiile detaliate pentru fiecare produs solicitat. Vă rugăm să analizați aceste detalii pentru a pregăti o ofertă oficială.
              <br><br>
              <span style="font-style: italic; color: #718096; font-size: 0.85rem;">
                (This internal email notification has been automatically generated and sent as a direct output of the online B2B configurator on the PALROM Products website. A potential customer has successfully finalized their custom configurations and requested a price quotation. Below, you will find the customer's contact details, optional notes, and a structured breakdown of the specifications for each configured product. Please use these details to prepare a formal quote.)
              </span>
            </p>

            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; border-collapse: separate; font-family: sans-serif;">
              <tr>
                <td style="padding: 20px;">
                  <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin: 0 0 16px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Detalii client (Client Details)</h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-weight: 500; width: 160px;">Nume (Name)</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-weight: 600;">${clientName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-weight: 500;">E-mail (Email)</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;"><a href="mailto:${clientEmail}" style="color: #1e3a2b; text-decoration: none; font-weight: 600;">${clientEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-weight: 500;">Telefon (Phone)</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-weight: 600;">${clientPhone}</td>
                    </tr>
                    ${clientNotes ? `
                    <tr>
                      <td style="padding: 8px 0; vertical-align: top; color: #64748b; font-weight: 500;">Note (Notes)</td>
                      <td style="padding: 8px 0; color: #334155; white-space: pre-line;">${clientNotes}</td>
                    </tr>
                    ` : `
                    <tr>
                      <td style="padding: 8px 0; vertical-align: top; color: #64748b; font-weight: 500;">Note (Notes)</td>
                      <td style="padding: 8px 0; color: #718096; font-style: italic;">Fără note (No notes)</td>
                    </tr>
                    `}
                  </table>
                </td>
              </tr>
            </table>

            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 16px; margin-top: 0;">Produse solicitate (Requested Products)</h3>
              ${itemsHtml}
            </div>

            <div style="border-top: 1px solid #edf2f7; padding-top: 24px; text-align: center; font-size: 0.8rem; color: #a0aec0;">
              <p style="margin: 0 0 8px;">Acest e-mail a fost trimis automat de configuratorul de oferte B2B. (This is an automated message from the B2B Quote Configurator.)</p>
              <p style="margin: 0; font-weight: 500;">PALROM Products SRL • 8 Poienita St, Brad City, Hunedoara, Romania</p>
            </div>
          </div>
        `;

        // Generate CSV content for back-office import
        const escapeCSV = (val) => {
          if (val === undefined || val === null) return '';
          let str = String(val);
          str = str.replace(/"/g, '""');
          if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str}"`;
          }
          return str;
        };

        const csvRows = [
          ["Inquiry Details", ""].map(escapeCSV).join(','),
          ["Client Name", clientName].map(escapeCSV).join(','),
          ["Client Email", clientEmail].map(escapeCSV).join(','),
          ["Client Phone", clientPhone].map(escapeCSV).join(','),
          ["Client Notes", clientNotes || ''].map(escapeCSV).join(','),
          ["", ""].map(escapeCSV).join(','),
          ["Product Index", "Product Name", "Category", "Quantity", "Dimensions", "Grade", "Certification (FSC)", "Drying", "Product Notes"].map(escapeCSV).join(',')
        ];

        items.forEach((item, index) => {
          const row = [
            `Product ${index + 1}`,
            item.name || '',
            item.category || '',
            item.qty || '',
            item.dims || '',
            localizeSpecValue('grade', item.grade, 'en') || '',
            localizeSpecValue('fsc', item.fsc, 'en') || '',
            localizeSpecValue('drying', item.drying, 'en') || '',
            item.additionalInfo || ''
          ];
          csvRows.push(row.map(escapeCSV).join(','));
        });

        const csvContent = csvRows.join('\n');
        const csvBase64 = Buffer.from(csvContent, 'utf-8').toString('base64');

        // Generate PDF on the server
        let pdfBase64 = '';
        try {
          const pdfBuffer = await generatePdfBuffer(clientName, clientEmail, clientPhone, clientNotes, items);
          pdfBase64 = pdfBuffer.toString('base64');
        } catch (pdfErr) {
          console.error('Failed to generate B2B inquiry PDF:', pdfErr);
        }

        const subjectLine = `This is a test email - Solicitare ofertă B2B de la ${clientName} (New B2B quote inquiry from ${clientName})`;
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
            attachments: [
              {
                filename: `Inquiry_${clientName.replace(/\s+/g, '_')}.csv`,
                content: csvBase64
              },
              ...(pdfBase64 ? [{
                filename: `Inquiry_${clientName.replace(/\s+/g, '_')}.pdf`,
                content: pdfBase64
              }] : [])
            ]
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
                attachments: [
                  {
                    filename: `Inquiry_${clientName.replace(/\s+/g, '_')}.csv`,
                    content: csvBase64
                  },
                  ...(pdfBase64 ? [{
                    filename: `Inquiry_${clientName.replace(/\s+/g, '_')}.pdf`,
                    content: pdfBase64
                  }] : [])
                ]
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
          console.log('Internal sales notification email sent successfully via Resend');
          emailSent = true;
        }
      } catch (err) {
        console.error('Failed to send email via Resend:', err);
      }
    } else {
      console.log('Neither FormSubmit nor Resend configured, skipping internal email delivery');
    }

    // 2. Send client confirmation email to clientEmail (always via Resend if API key is present)
    if (resendApiKey) {
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
          nl: 'Aangevraagde Producten',
          en: 'Requested Products',
          de: 'Angeforderte Produkte',
          ro: 'Produse Solicitate'
        }[emailLang] || 'Aangevraagde Producten';

        const clientDetailsTitle = {
          nl: 'Uw Contactgegevens',
          en: 'Your Contact Details',
          de: 'Ihre Kontaktdaten',
          ro: 'Datele Dvs. de Contact'
        }[emailLang] || 'Uw Contactgegevens';

        const clientNameLabel = {
          nl: 'Naam',
          en: 'Name',
          de: 'Name',
          ro: 'Nume'
        }[emailLang] || 'Naam';

        const clientEmailLabel = {
          nl: 'E-mail',
          en: 'Email',
          de: 'E-Mail',
          ro: 'Email'
        }[emailLang] || 'E-mail';

        const clientPhoneLabel = {
          nl: 'Telefoon',
          en: 'Phone',
          de: 'Telefon',
          ro: 'Telefon'
        }[emailLang] || 'Telefoon';

        const clientNotesLabel = {
          nl: 'Opmerkingen',
          en: 'Notes',
          de: 'Notizen',
          ro: 'Note'
        }[emailLang] || 'Opmerkingen';

        const clientFooterNote = {
          nl: 'Dit is een geautomatiseerde bevestiging van uw aanvraag. We nemen zo snel mogelijk contact met u op.',
          en: 'This is an automated confirmation of your request. We will contact you as soon as possible.',
          de: 'Dies ist eine automatische Bestätigung Ihrer Anfrage. Wir werden uns so schnell wie möglich mit Ihnen in Verbindung setzen.',
          ro: 'Aceasta este o confirmare automată a solicitării dumneavoastră. Vă vom contacta în cel mai scurt timp posibil.'
        }[emailLang] || 'Dit is een geautomatiseerde bevestiging van uw aanvraag. We nemen zo snel mogelijk contact met u op.';

        const clientItemsHtml = items.map((item, index) => {
          const specsList = Object.entries(item).map(([k, v]) => {
            if (['id', 'isConfigured', 'name', 'category', 'categoryKey', 'qty', 'price', 'baseUnitPrice', 'discountPercent'].includes(k)) return null;
            if (v === undefined || v === null || v === '') return null;
            
            const label = localizeSpecKey(k, emailLang);
            const val = localizeSpecValue(k, v, emailLang);
            
            return `
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: 500; width: 140px; vertical-align: top;">${label}</td>
                <td style="padding: 4px 0; color: #0f172a; font-weight: 600; vertical-align: top;">${val}</td>
              </tr>
            `;
          }).filter(Boolean).join('');

          const qtyLabel = {
            nl: 'Aantal',
            en: 'Qty',
            de: 'Menge',
            ro: 'Cantitate'
          }[emailLang] || 'Aantal';

          const categoryLabel = {
            nl: 'Categorie',
            en: 'Category',
            de: 'Kategorie',
            ro: 'Categorie'
          }[emailLang] || 'Categorie';

          const productTitleLabel = {
            nl: 'Product',
            en: 'Product',
            de: 'Produkt',
            ro: 'Produs'
          }[emailLang] || 'Product';

          return `
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 20px; border: 1px solid #e2e8f0; background-color: #ffffff; border-radius: 8px; border-collapse: separate; font-family: sans-serif;">
              <tr>
                <td style="padding: 20px;">
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; border-bottom: 1px solid #edf2f7;">
                    <tr>
                      <td style="padding: 0 0 12px 0; vertical-align: middle;">
                        <h4 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #0f172a;">${productTitleLabel} ${index + 1}: ${item.name}</h4>
                      </td>
                      <td style="padding: 0 0 12px 0; text-align: right; vertical-align: middle; width: 100px;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: #1e3a2b; background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 4px 10px; border-radius: 6px; white-space: nowrap;">${qtyLabel}: ${item.qty}</span>
                      </td>
                    </tr>
                  </table>
                  <div style="font-size: 0.9rem; color: #475569; line-height: 1.6;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-weight: 500; width: 140px; vertical-align: top;">${categoryLabel}</td>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600; vertical-align: top;">${item.category}</td>
                      </tr>
                      ${specsList}
                    </table>
                  </div>
                </td>
              </tr>
            </table>
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

            <!-- Client Details Box -->
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; border-collapse: separate; font-family: sans-serif;">
              <tr>
                <td style="padding: 20px;">
                  <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin: 0 0 16px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">${clientDetailsTitle}</h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-weight: 500; width: 140px;">${clientNameLabel}</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-weight: 600;">${clientName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-weight: 500;">${clientEmailLabel}</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;"><a href="mailto:${clientEmail}" style="color: #1e3a2b; text-decoration: none; font-weight: 600;">${clientEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-weight: 500;">${clientPhoneLabel}</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-weight: 600;">${clientPhone}</td>
                    </tr>
                    ${clientNotes ? `
                    <tr>
                      <td style="padding: 8px 0; vertical-align: top; color: #64748b; font-weight: 500;">${clientNotesLabel}</td>
                      <td style="padding: 8px 0; color: #334155; white-space: pre-line;">${clientNotes}</td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Items list -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 16px; margin-top: 0;">${clientTitleItems}</h3>
              ${clientItemsHtml}
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
            html: clientHtmlContent,
            attachments: pdfBase64 ? [
              {
                filename: `Quote_Request_${clientName.replace(/\s+/g, '_')}.pdf`,
                content: pdfBase64
              }
            ] : []
          })
        });

        if (!clientRes.ok) {
          const errText = await clientRes.text();
          console.warn('Resend client confirmation warning (normal in sandbox mode):', errText);
          
          if (errText.includes('validation_error') || errText.includes('testing emails') || errText.includes('not verified')) {
            console.log('Attempting Sandbox client copy fallback to matthias.radder@gmail.com');
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
              },
              body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: 'matthias.radder@gmail.com',
                subject: `[Sandbox Client Copy] ${clientSubject}`,
                html: clientHtmlContent,
                attachments: pdfBase64 ? [
                  {
                    filename: `Quote_Request_${clientName.replace(/\s+/g, '_')}.pdf`,
                    content: pdfBase64
                  }
                ] : []
              })
            });
            if (fallbackRes.ok) {
              console.log('Sandbox client copy fallback email sent successfully to matthias.radder@gmail.com');
            } else {
              console.error('Sandbox client copy fallback failed:', await fallbackRes.text());
            }
          }
        } else {
          console.log('Client confirmation email sent successfully via Resend');
        }
      } catch (clientErr) {
        console.warn('Failed to send client confirmation email:', clientErr);
      }
    } else {
      console.log('Resend API key not configured, skipping client confirmation email');
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
