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

const AUDIT_FILE = path.join(process.cwd(), 'telemetry_audit.json');

function readLocalTelemetry() {
  if (!fs.existsSync(AUDIT_FILE)) {
    return { pageViews: [], configuratorEvents: [], chatbotConversations: [] };
  }
  try {
    const raw = fs.readFileSync(AUDIT_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read telemetry audit file:', err);
    return { pageViews: [], configuratorEvents: [], chatbotConversations: [] };
  }
}

function writeLocalTelemetry(data) {
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write telemetry audit file:', err);
  }
}

function readLocalInquiries() {
  const file = path.join(process.cwd(), 'inquiries.json');
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
}

// POST: Register telemetry event
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, sessionId, payload } = body;

    if (!type || !sessionId) {
      return NextResponse.json({ error: 'Missing type or sessionId' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    if (supabase) {
      // --------------------------------------------------
      // SUPABASE DB WRITES
      // --------------------------------------------------
      if (type === 'page_view') {
        const { error } = await supabase.from('page_views').insert({
          session_id: sessionId,
          page_path: payload.path || '/',
          language: payload.lang || 'nl',
          referrer: payload.referrer || null,
          is_mobile: !!payload.isMobile,
          created_at: timestamp
        });
        if (error) throw error;
      } 
      
      else if (type === 'configurator_event') {
        const { error } = await supabase.from('configurator_events').insert({
          session_id: sessionId,
          event_type: payload.eventType,
          category: payload.category || null,
          sub_category: payload.subCategory || null,
          dimensions: payload.dimensions || null,
          grade: payload.grade || null,
          drying: payload.drying || null,
          quantity: payload.quantity ? Number(payload.quantity) : null,
          language: payload.lang || 'nl',
          created_at: timestamp
        });
        if (error) throw error;
      } 
      
      else if (type === 'chatbot_message') {
        const { data: existing } = await supabase
          .from('chatbot_conversations')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('chatbot_conversations')
            .update({ message_count: existing.message_count + 1 })
            .eq('session_id', sessionId);
        } else {
          await supabase
            .from('chatbot_conversations')
            .insert({
              session_id: sessionId,
              message_count: 1,
              language: payload.lang || 'nl',
              created_at: timestamp
            });
        }
      } 
      
      else if (type === 'chatbot_config_complete') {
        const { data: existing } = await supabase
          .from('chatbot_conversations')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('chatbot_conversations')
            .update({ completed_configuration: true })
            .eq('session_id', sessionId);
        } else {
          await supabase
            .from('chatbot_conversations')
            .insert({
              session_id: sessionId,
              completed_configuration: true,
              language: payload.lang || 'nl',
              created_at: timestamp
            });
        }
      } 
      
      else if (type === 'chatbot_fallback') {
        const { data: existing } = await supabase
          .from('chatbot_conversations')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('chatbot_conversations')
            .update({ had_fallback: true })
            .eq('session_id', sessionId);
        } else {
          await supabase
            .from('chatbot_conversations')
            .insert({
              session_id: sessionId,
              had_fallback: true,
              language: payload.lang || 'nl',
              created_at: timestamp
            });
        }
      }

      return NextResponse.json({ success: true, db: 'supabase' });

    } else {
      // --------------------------------------------------
      // LOCAL FALLBACK AUDIT FILE
      // --------------------------------------------------
      const data = readLocalTelemetry();

      if (type === 'page_view') {
        data.pageViews.push({
          id: crypto.randomUUID(),
          session_id: sessionId,
          page_path: payload.path || '/',
          language: payload.lang || 'nl',
          referrer: payload.referrer || null,
          is_mobile: !!payload.isMobile,
          created_at: timestamp
        });
      } 
      
      else if (type === 'configurator_event') {
        data.configuratorEvents.push({
          id: crypto.randomUUID(),
          session_id: sessionId,
          event_type: payload.eventType,
          category: payload.category || null,
          sub_category: payload.subCategory || null,
          dimensions: payload.dimensions || null,
          grade: payload.grade || null,
          drying: payload.drying || null,
          quantity: payload.quantity ? Number(payload.quantity) : null,
          language: payload.lang || 'nl',
          created_at: timestamp
        });
      } 
      
      else if (type === 'chatbot_message' || type === 'chatbot_config_complete' || type === 'chatbot_fallback') {
        let index = data.chatbotConversations.findIndex(c => c.session_id === sessionId);
        if (index === -1) {
          const newChat = {
            id: crypto.randomUUID(),
            session_id: sessionId,
            message_count: type === 'chatbot_message' ? 1 : 0,
            completed_configuration: type === 'chatbot_config_complete',
            had_fallback: type === 'chatbot_fallback',
            language: payload.lang || 'nl',
            created_at: timestamp
          };
          data.chatbotConversations.push(newChat);
        } else {
          const chat = data.chatbotConversations[index];
          if (type === 'chatbot_message') chat.message_count++;
          if (type === 'chatbot_config_complete') chat.completed_configuration = true;
          if (type === 'chatbot_fallback') chat.had_fallback = true;
        }
      }

      writeLocalTelemetry(data);
      return NextResponse.json({ success: true, db: 'local_file' });
    }

  } catch (err) {
    console.error('Telemetry error:', err);
    return NextResponse.json({ error: err.message || 'Failed to record event' }, { status: 500 });
  }
}

// GET: Aggregated analytics datasets (admin-protected)
export async function GET(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized passcode access' }, { status: 401 });
    }

    let pageViews = [];
    let configuratorEvents = [];
    let chatbotConversations = [];
    let quoteInquiries = [];

    if (supabase) {
      // Fetch raw logs from database to aggregate in JavaScript
      const { data: pv, error: pvErr } = await supabase.from('page_views').select('*');
      const { data: ce, error: ceErr } = await supabase.from('configurator_events').select('*');
      const { data: cc, error: ccErr } = await supabase.from('chatbot_conversations').select('*');
      const { data: qi, error: qiErr } = await supabase.from('quote_inquiries').select('*');

      if (pvErr || ceErr || ccErr || qiErr) {
        throw new Error(pvErr?.message || ceErr?.message || ccErr?.message || qiErr?.message);
      }

      pageViews = pv || [];
      configuratorEvents = ce || [];
      chatbotConversations = cc || [];
      quoteInquiries = qi || [];
    } else {
      // Fetch from local JSON fallbacks
      const local = readLocalTelemetry();
      pageViews = local.pageViews;
      configuratorEvents = local.configuratorEvents;
      chatbotConversations = local.chatbotConversations;
      quoteInquiries = readLocalInquiries();
    }

    // Run custom map-reduce aggregates in JS
    const aggregated = aggregateStats(pageViews, configuratorEvents, chatbotConversations, quoteInquiries);

    return NextResponse.json({ success: true, stats: aggregated });

  } catch (err) {
    console.error('Analytics aggregation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to retrieve stats' }, { status: 500 });
  }
}

function aggregateStats(pageViews, configuratorEvents, chatbotConversations, quoteInquiries) {
  // 1. Traffic Aggregation
  const totalViews = pageViews.length;
  const viewsByPage = {};
  const viewsByLang = {};
  const viewsByDay = {};

  pageViews.forEach(pv => {
    const cleanPath = pv.page_path ? pv.page_path.split('?')[0] : '/';
    viewsByPage[cleanPath] = (viewsByPage[cleanPath] || 0) + 1;

    const l = pv.language || 'nl';
    viewsByLang[l] = (viewsByLang[l] || 0) + 1;

    if (pv.created_at) {
      const day = pv.created_at.substring(0, 10);
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    }
  });

  // Sort viewsByDay keys for chronological order
  const sortedDays = Object.keys(viewsByDay).sort();
  const chronologicalViewsByDay = {};
  sortedDays.forEach(day => {
    chronologicalViewsByDay[day] = viewsByDay[day];
  });

  // 2. Configurator Aggregation
  const totalConfigEvents = configuratorEvents.length;
  const configByVersion = { v1: 0, v2: 0, v3: 0, v4: 0 };
  const configByCat = {};
  const configByGrade = {};
  const configByDrying = {};
  
  const startedSessions = new Set();
  const cartSessions = new Set();
  const inquirySessions = new Set();

  configuratorEvents.forEach(evt => {
    const sId = evt.session_id;
    if (sId) startedSessions.add(sId);

    if (evt.event_type === 'configurator_start') {
      const version = evt.category || 'v1'; // v1, v2, v3, v4 stored here
      configByVersion[version] = (configByVersion[version] || 0) + 1;
    } else {
      if (evt.category) {
        configByCat[evt.category] = (configByCat[evt.category] || 0) + 1;
      }
      if (evt.grade) {
        configByGrade[evt.grade] = (configByGrade[evt.grade] || 0) + 1;
      }
      if (evt.drying) {
        configByDrying[evt.drying] = (configByDrying[evt.drying] || 0) + 1;
      }
      if (evt.event_type === 'added_to_cart' && sId) {
        cartSessions.add(sId);
      }
      if (evt.event_type === 'quote_submitted' && sId) {
        inquirySessions.add(sId);
      }
    }
  });

  // 3. Chatbot Aggregation
  const totalChats = chatbotConversations.length;
  let totalChatMessages = 0;
  let chatsCompleted = 0;
  let chatsFallback = 0;

  chatbotConversations.forEach(chat => {
    totalChatMessages += chat.message_count || 0;
    if (chat.completed_configuration) chatsCompleted++;
    if (chat.had_fallback) chatsFallback++;
  });

  const avgMessages = totalChats > 0 ? Math.round((totalChatMessages / totalChats) * 10) / 10 : 0;
  const chatbotFallbackRate = totalChats > 0 ? Math.round((chatsFallback / totalChats) * 100) : 0;

  // 4. Quote Inquiries Aggregation
  const totalQuotes = quoteInquiries.length;
  let totalQuotesValue = 0;
  const quotesByStatus = {};

  quoteInquiries.forEach(quote => {
    totalQuotesValue += Number(quote.total_price || 0);
    const status = quote.status || 'New';
    quotesByStatus[status] = (quotesByStatus[status] || 0) + 1;
  });

  return {
    traffic: {
      totalViews,
      viewsByPage,
      viewsByLang,
      viewsByDay: chronologicalViewsByDay
    },
    configurator: {
      totalEvents: totalConfigEvents,
      byVersion: configByVersion,
      byCategory: configByCat,
      byGrade: configByGrade,
      byDrying: configByDrying,
      funnel: {
        started: startedSessions.size,
        addedToCart: cartSessions.size,
        submitted: inquirySessions.size
      }
    },
    chatbot: {
      totalChats,
      avgMessages,
      completedCount: chatsCompleted,
      fallbackCount: chatsFallback,
      fallbackRate: chatbotFallbackRate
    },
    quotes: {
      totalQuotes,
      totalValue: Math.round(totalQuotesValue),
      byStatus: quotesByStatus
    }
  };
}
