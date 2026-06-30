import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = (request.headers.get('x-admin-passcode') || '').trim();
  const allowed = [...VALID_PASSCODES, getPasscode()];
  return allowed.includes(passcode);
}

// Load Supabase environment variables if present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

const dbPath = path.join(process.cwd(), 'vacancies.json');

function readVacancies() {
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read vacancies database:', err);
  }
  return [];
}

function writeVacancies(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write vacancies database:', err);
    return false;
  }
}

export async function GET() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return NextResponse.json({ success: true, vacancies: data });
      }
      console.error('Supabase fetch vacancies error:', error);
    } catch (err) {
      console.error('Failed to fetch vacancies from Supabase:', err);
    }
  }

  const vacancies = readVacancies();
  return NextResponse.json({ success: true, vacancies });
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid passcode' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, vacancy } = body;

    if (supabase) {
      try {
        if (action === 'save') {
          if (!vacancy || !vacancy.title) {
            return NextResponse.json({ success: false, error: 'Invalid vacancy data' }, { status: 400 });
          }

          if (!vacancy.id) {
            const titleSlug = (vacancy.title.en || vacancy.title.nl || 'job')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            vacancy.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
          }

          const { error } = await supabase
            .from('vacancies')
            .upsert([vacancy]);

          if (error) {
            console.error('Supabase vacancies save error:', error);
            throw error;
          }
          return NextResponse.json({ success: true, vacancy });

        } else if (action === 'delete') {
          const { id } = body;
          if (!id) {
            return NextResponse.json({ success: false, error: 'Missing vacancy ID' }, { status: 400 });
          }

          const { error } = await supabase
            .from('vacancies')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Supabase vacancies delete error:', error);
            throw error;
          }
          return NextResponse.json({ success: true, message: 'Vacancy deleted successfully' });
        } else if (action === 'export_local') {
          const { data, error } = await supabase
            .from('vacancies')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Supabase fetch vacancies for export error:', error);
            throw error;
          }

          if (data) {
            if (writeVacancies(data)) {
              return NextResponse.json({ success: true, message: 'Vacancies exported successfully to local file' });
            } else {
              return NextResponse.json({ success: false, error: 'Failed to write to local file database' }, { status: 500 });
            }
          }
          return NextResponse.json({ success: false, error: 'No vacancies found in database to export' }, { status: 400 });
        } else if (action === 'sync_local') {
          const localVacancies = readVacancies();
          if (localVacancies.length > 0) {
            const { error } = await supabase
              .from('vacancies')
              .upsert(localVacancies);

            if (error) {
              console.error('Supabase vacancies sync error:', error);
              throw error;
            }
            return NextResponse.json({ success: true, message: 'Vacancies synced successfully' });
          }
          return NextResponse.json({ success: false, error: 'No local vacancies found to sync' }, { status: 400 });
        }
      } catch (dbErr) {
        console.error('Supabase vacancies write error:', dbErr);
        if (process.env.VERCEL) {
          return NextResponse.json({ 
            success: false, 
            error: `Database error: ${dbErr.message || 'Supabase error'}. Please verify that the 'vacancies' table exists in Supabase by running the SQL in schema.sql.` 
          }, { status: 500 });
        }
        console.log('Falling back to local file database...');
      }
    }

    let vacancies = readVacancies();

    if (action === 'save') {
      if (!vacancy || !vacancy.title) {
        return NextResponse.json({ success: false, error: 'Invalid vacancy data' }, { status: 400 });
      }

      if (!vacancy.id) {
        const titleSlug = (vacancy.title.en || vacancy.title.nl || 'job')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        vacancy.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
      }

      const existingIndex = vacancies.findIndex(v => v.id === vacancy.id);
      if (existingIndex > -1) {
        vacancies[existingIndex] = vacancy;
      } else {
        vacancies.push(vacancy);
      }

      if (writeVacancies(vacancies)) {
        return NextResponse.json({ success: true, vacancy });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    } else if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Missing vacancy ID' }, { status: 400 });
      }

      vacancies = vacancies.filter(v => v.id !== id);

      if (writeVacancies(vacancies)) {
        return NextResponse.json({ success: true, message: 'Vacancy deleted successfully' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    } else if (action === 'sync_local') {
      return NextResponse.json({ success: true, message: 'Local JSON database active. No database to sync.' });
    } else if (action === 'export_local') {
      return NextResponse.json({ success: false, error: 'Supabase is not configured. Cannot export to local.' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling vacancies API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
