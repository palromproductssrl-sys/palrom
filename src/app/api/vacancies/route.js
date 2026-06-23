import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = request.headers.get('x-admin-passcode');
  const allowed = [...VALID_PASSCODES, getPasscode()];
  return allowed.includes(passcode);
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

    let vacancies = readVacancies();

    if (action === 'save') {
      if (!vacancy || !vacancy.title) {
        return NextResponse.json({ success: false, error: 'Invalid vacancy data' }, { status: 400 });
      }

      // If no ID is provided, create a slug from title or generate UUID
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
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling vacancies API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
