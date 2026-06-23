import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { generatePdfBuffer } from '../../inquire/route';

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

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];
function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const token = searchParams.get('token'); // We pass token via query parameter (client token or admin passcode)
    
    if (!id || !token) {
      return NextResponse.json({ error: 'Missing inquiry ID or token' }, { status: 400 });
    }

    const isAdmin = VALID_PASSCODES.includes(token) || token === getAdminPasscode();
    let authEmail = '';

    if (!isAdmin) {
      if (!token.startsWith('palrom-b2b-')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        const encodedEmail = token.replace('palrom-b2b-', '');
        authEmail = Buffer.from(encodedEmail, 'base64').toString('utf8').toLowerCase().trim();
      } catch (e) {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
      }

      if (!authEmail || !authEmail.includes('@')) {
        return NextResponse.json({ error: 'Invalid authenticated email' }, { status: 401 });
      }
    }

    let inquiry = null;

    if (supabase) {
      // Fetch the single inquiry from Supabase
      const { data, error } = await supabase
        .from('quote_inquiries')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Supabase query error fetching inquiry for PDF:', error);
      } else {
        inquiry = data;
      }
    }

    // Fallback to local inquiries file if Supabase is not available or if the query returned null
    if (!inquiry) {
      const localDbPath = path.join(process.cwd(), 'inquiries.json');
      if (fs.existsSync(localDbPath)) {
        try {
          const fileContent = fs.readFileSync(localDbPath, 'utf8');
          const allRecords = JSON.parse(fileContent);
          inquiry = allRecords.find(record => record.id === id);
        } catch (parseErr) {
          console.error('Failed to parse inquiries.json', parseErr);
        }
      }
    }

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Verify ownership for clients
    if (!isAdmin && inquiry.client_email?.toLowerCase().trim() !== authEmail) {
      return NextResponse.json({ error: 'Unauthorized to access this inquiry' }, { status: 403 });
    }

    // Map items dimensions and details to match PDF expectations
    const mappedItems = (inquiry.items || []).map(item => {
      let dimsText = item.dims || '';
      if (!dimsText) {
        if (item.category === 'brichete') {
          dimsText = '90mm x 90mm x 250mm';
        } else {
          const lVal = item.length || '';
          const dVal = item.diameter || item.width || '';
          const tVal = item.thickness || '';
          dimsText = tVal ? `${tVal}x${dVal}x${lVal} mm` : `${dVal}x${lVal} mm`;
        }
      }
      return {
        name: item.name || `Wood Product (${item.category || 'Custom'})`,
        dims: dimsText,
        radius: item.radius || '',
        grade: item.grade || 'A',
        drying: item.drying || 'kd',
        qty: item.qty || 1
      };
    });

    const pdfBuffer = await generatePdfBuffer(
      inquiry.client_name || 'Client',
      inquiry.client_email || inquiry.client_email || 'B2B Client',
      inquiry.client_phone || '',
      inquiry.client_notes || '',
      mappedItems
    );

    const safeClientName = (inquiry.client_name || 'Client').replace(/\s+/g, '_');
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename=Inquiry_${safeClientName}.pdf`);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('[B2B Portal Download PDF] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
