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

const dbPath = path.join(process.cwd(), 'news.json');

function readNews() {
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read news database:', err);
  }
  return [];
}

function writeNews(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write news database:', err);
    return false;
  }
}

export async function GET() {
  const news = readNews();
  return NextResponse.json({ success: true, news });
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid passcode' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, newsItem } = body;

    let news = readNews();

    if (action === 'save') {
      if (!newsItem || !newsItem.title) {
        return NextResponse.json({ success: false, error: 'Invalid news article data' }, { status: 400 });
      }

      // If no ID is provided, create a slug from title or generate UUID
      if (!newsItem.id) {
        const titleSlug = (newsItem.title.en || newsItem.title.nl || 'news')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        newsItem.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
      }

      const existingIndex = news.findIndex(n => n.id === newsItem.id);
      if (existingIndex > -1) {
        news[existingIndex] = newsItem;
      } else {
        news.push(newsItem);
      }

      // Sort news by date if we have valid dates, or keep default
      // Note: dates are formatted as localized strings, so we can't easily parse them,
      // but we can preserve the user's explicit order or append to the beginning.
      // Let's prepend new items to the top if they are newly added.
      if (existingIndex === -1) {
        // Move the newly added item to the front of the array (newest first)
        news.pop();
        news.unshift(newsItem);
      }

      if (writeNews(news)) {
        return NextResponse.json({ success: true, newsItem });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    } else if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Missing article ID' }, { status: 400 });
      }

      news = news.filter(n => n.id !== id);

      if (writeNews(news)) {
        return NextResponse.json({ success: true, message: 'News article deleted successfully' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling news API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
