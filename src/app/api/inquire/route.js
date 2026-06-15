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

    return NextResponse.json({
      success: true,
      message: 'Inquiry processed successfully',
      savedToDatabase,
      recordId: newRecordWithMeta.id,
    });
  } catch (error) {
    console.error('Error handling inquiry submission:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing inquiry.' },
      { status: 500 }
    );
  }
}
