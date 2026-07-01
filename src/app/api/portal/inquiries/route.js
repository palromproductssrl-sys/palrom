import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const hasPostgres = !!process.env.POSTGRES_URL || !!process.env.POSTGRES_URL_NON_POOLING;

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

    if (hasPostgres || process.env.VERCEL) {
      try {
        const { rows } = await sql`
          SELECT * FROM quote_inquiries
          WHERE client_email = ${authEmail}
          ORDER BY created_at DESC;
        `;
        inquiries = rows || [];
      } catch (dbErr) {
        console.error('Vercel Postgres query error fetching inquiries:', dbErr);
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
