import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = request.headers.get('x-admin-passcode');
  const allowed = [...VALID_PASSCODES, getPasscode()];
  return allowed.includes(passcode);
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

// Mapping helpers to match Supabase snake_case columns
function mapNewsToDb(newsItem) {
  return {
    id: newsItem.id,
    tag: newsItem.tag,
    date: newsItem.date,
    author: newsItem.author,
    title: newsItem.title,
    content: newsItem.content,
    link_url: newsItem.linkUrl,
    link_text: newsItem.linkText,
    image: newsItem.image,
    is_romania_only: !!newsItem.isRomaniaOnly
  };
}

function mapNewsFromDb(dbItem) {
  return {
    id: dbItem.id,
    tag: dbItem.tag,
    date: dbItem.date,
    author: dbItem.author,
    title: dbItem.title,
    content: dbItem.content,
    linkUrl: dbItem.link_url,
    linkText: dbItem.link_text,
    image: dbItem.image,
    isRomaniaOnly: !!dbItem.is_romania_only
  };
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

function parseLocalizedDate(dateObj) {
  if (!dateObj) return null;
  
  if (dateObj.en) {
    const d = new Date(dateObj.en);
    if (!isNaN(d.getTime())) return d;
  }
  
  if (dateObj.nl) {
    const d = new Date(dateObj.nl);
    if (!isNaN(d.getTime())) return d;
    
    const nlMonths = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let str = dateObj.nl.toLowerCase();
    for (let i = 0; i < 12; i++) {
      if (str.includes(nlMonths[i])) {
        str = str.replace(nlMonths[i], enMonths[i]);
        const d2 = new Date(str);
        if (!isNaN(d2.getTime())) return d2;
        break;
      }
    }
  }
  
  if (dateObj.ro) {
    const roMonths = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let str = dateObj.ro.toLowerCase();
    for (let i = 0; i < 12; i++) {
      if (str.includes(roMonths[i])) {
        str = str.replace(roMonths[i], enMonths[i]);
        const d2 = new Date(str);
        if (!isNaN(d2.getTime())) return d2;
        break;
      }
    }
  }

  for (const lang of ['en', 'nl', 'de', 'ro']) {
    if (dateObj[lang]) {
      const d = new Date(dateObj[lang]);
      if (!isNaN(d.getTime())) return d;
    }
  }
  
  return null;
}

function sortNewsItems(items) {
  return [...items].sort((a, b) => {
    const dateA = parseLocalizedDate(a.date);
    const dateB = parseLocalizedDate(b.date);

    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;

    if (timeA !== timeB) {
      return timeB - timeA; // Descending (newest first)
    }

    return (b.id || '').localeCompare(a.id || '');
  });
}

export async function GET() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*');

      if (!error && data) {
        // Auto-seed: If database is connected but empty, insert local seed data
        if (data.length === 0) {
          const localNews = readNews();
          if (localNews.length > 0) {
            console.log('Supabase news table is empty. Seeding local news...');
            const dbRecords = localNews.map(mapNewsToDb);
            const { error: seedErr } = await supabase
              .from('news')
              .upsert(dbRecords);
            if (!seedErr) {
              return NextResponse.json({ success: true, news: sortNewsItems(localNews) });
            }
            console.error('Failed to seed news to Supabase:', seedErr);
          }
        }
        const mappedNews = data.map(mapNewsFromDb);
        return NextResponse.json({ success: true, news: sortNewsItems(mappedNews) });
      }
      console.error('Supabase fetch news error:', error);
    } catch (err) {
      console.error('Failed to fetch news from Supabase:', err);
    }
  }

  const news = readNews();
  return NextResponse.json({ success: true, news: sortNewsItems(news) });
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid passcode' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, newsItem } = body;

    if (supabase) {
      try {
        if (action === 'save') {
          if (!newsItem || !newsItem.title) {
            return NextResponse.json({ success: false, error: 'Invalid news article data' }, { status: 400 });
          }

          if (!newsItem.id) {
            const titleSlug = (newsItem.title.en || newsItem.title.nl || 'news')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            newsItem.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
          }

          const dbRecord = mapNewsToDb(newsItem);
          const { error } = await supabase
            .from('news')
            .upsert([dbRecord]);

          if (error) {
            console.error('Supabase news save error:', error);
            throw error;
          }
          return NextResponse.json({ success: true, newsItem });

        } else if (action === 'delete') {
          const { id } = body;
          if (!id) {
            return NextResponse.json({ success: false, error: 'Missing article ID' }, { status: 400 });
          }

          const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Supabase news delete error:', error);
            throw error;
          }
          return NextResponse.json({ success: true, message: 'News article deleted successfully' });
        }
      } catch (dbErr) {
        console.error('Supabase news write error:', dbErr);
        if (process.env.VERCEL) {
          return NextResponse.json({ 
            success: false, 
            error: `Database error: ${dbErr.message || 'Supabase error'}. Please verify that the 'news' table exists in Supabase by running the SQL in schema.sql.` 
          }, { status: 500 });
        }
        console.log('Falling back to local file database...');
      }
    }

    let news = readNews();

    if (action === 'save') {
      if (!newsItem || !newsItem.title) {
        return NextResponse.json({ success: false, error: 'Invalid news article data' }, { status: 400 });
      }

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

      if (existingIndex === -1) {
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
