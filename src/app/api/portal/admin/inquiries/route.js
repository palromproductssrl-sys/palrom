import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = (request.headers.get('x-admin-passcode') || '').trim();
  const allowed = [...VALID_PASSCODES, getAdminPasscode()];
  return allowed.includes(passcode);
}

// Initialize Supabase if present
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

const LOCAL_FILE = path.join(process.cwd(), 'inquiries.json');

function readLocalInquiries() {
  if (!fs.existsSync(LOCAL_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'));
  } catch (e) {
    console.error('Failed to read local inquiries file:', e);
    return [];
  }
}

function writeLocalInquiries(data) {
  try {
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write local inquiries file:', e);
  }
}

// GET: Retrieve all quote inquiries (admin only)
export async function GET(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let inquiries = [];

    if (supabase) {
      const { data, error } = await supabase
        .from('quote_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      inquiries = data || [];
    } else {
      inquiries = readLocalInquiries();
      inquiries.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return NextResponse.json({ success: true, inquiries });

  } catch (err) {
    console.error('[Admin Get Inquiries] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// PATCH: Update inquiry status (admin only)
export async function PATCH(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields: id and status' }, { status: 400 });
    }

    let updatedInDb = false;

    if (supabase) {
      const { error } = await supabase
        .from('quote_inquiries')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Supabase update status error:', error);
      } else {
        updatedInDb = true;
      }
    }

    // Always update local file inquiries.json for fallback auditing
    const inquiries = readLocalInquiries();
    const index = inquiries.findIndex(iq => iq.id === id);
    if (index !== -1) {
      inquiries[index].status = status;
      writeLocalInquiries(inquiries);
    } else {
      console.warn(`Inquiry ${id} not found in local file inquiries.json`);
    }

    return NextResponse.json({ success: true, updatedInDb });

  } catch (err) {
    console.error('[Admin Update Inquiry] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update inquiry status' }, { status: 500 });
  }
}
