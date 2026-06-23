import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || !token.startsWith('palrom-b2b-')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let authEmail = '';
    try {
      const encodedEmail = token.replace('palrom-b2b-', '');
      authEmail = Buffer.from(encodedEmail, 'base64').toString('utf8').toLowerCase().trim();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    if (!authEmail || !authEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid authenticated email' }, { status: 401 });
    }

    let inquiries = [];

    if (supabase) {
      // Fetch matching inquiries from Supabase sorted by created_at desc
      const { data, error } = await supabase
        .from('quote_inquiries')
        .select('*')
        .eq('client_email', authEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error fetching inquiries:', error);
      } else {
        inquiries = data || [];
      }
    } else {
      // Fallback to local inquiries file
      const localDbPath = path.join(process.cwd(), 'inquiries.json');
      if (fs.existsSync(localDbPath)) {
        try {
          const fileContent = fs.readFileSync(localDbPath, 'utf8');
          const allRecords = JSON.parse(fileContent);
          
          inquiries = allRecords
            .filter(record => record.client_email?.toLowerCase().trim() === authEmail)
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        } catch (err) {
          console.error('Failed to read or parse local inquiries file:', err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error('[B2B Portal Inquiries] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
