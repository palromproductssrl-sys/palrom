import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = (request.headers.get('x-admin-passcode') || '').trim();
  const allowed = [...VALID_PASSCODES, getPasscode()];
  return allowed.includes(passcode);
}

const hasPostgres = !!process.env.POSTGRES_URL || !!process.env.POSTGRES_URL_NON_POOLING;

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

    if (hasPostgres || process.env.VERCEL) {
      // --------------------------------------------------
      // VERCEL POSTGRES DB WRITES
      // --------------------------------------------------
      if (type === 'page_view') {
        await sql`
          INSERT INTO page_views (
            session_id, page_path, language, referrer, is_mobile, created_at
          ) VALUES (
            ${sessionId}, ${payload.path || '/'}, ${payload.lang || 'nl'}, ${payload.referrer || null}, ${!!payload.isMobile}, ${timestamp}
          );
        `;
      } 
      
      else if (type === 'configurator_event') {
        await sql`
          INSERT INTO configurator_events (
            session_id, event_type, category, sub_category, dimensions, grade, drying, fsc, quantity, language, created_at
          ) VALUES (
            ${sessionId}, ${payload.eventType}, ${payload.category || null}, ${payload.subCategory || null}, 
            ${payload.dimensions ? JSON.stringify(payload.dimensions) : null}, ${payload.grade || null}, 
            ${payload.drying || null}, ${payload.fsc !== undefined ? !!payload.fsc : null}, 
            ${payload.quantity ? Number(payload.quantity) : null}, ${payload.lang || 'nl'}, ${timestamp}
          );
        `;
      } 
      
      else if (type === 'chatbot_message') {
        await sql`
          INSERT INTO chatbot_conversations (
            session_id, message_count, language, created_at
          ) VALUES (
            ${sessionId}, 1, ${payload.lang || 'nl'}, ${timestamp}
          )
          ON CONFLICT (session_id) DO UPDATE SET
            message_count = chatbot_conversations.message_count + 1;
        `;
      } 
      
      else if (type === 'chatbot_config_complete') {
        await sql`
          INSERT INTO chatbot_conversations (
            session_id, completed_configuration, language, created_at
          ) VALUES (
            ${sessionId}, true, ${payload.lang || 'nl'}, ${timestamp}
          )
          ON CONFLICT (session_id) DO UPDATE SET
            completed_configuration = true;
        `;
      } 
      
      else if (type === 'chatbot_fallback') {
        const fallbackMsg = payload.message || null;
        const fallbackArray = fallbackMsg ? [fallbackMsg] : [];
        await sql`
          INSERT INTO chatbot_conversations (
            session_id, had_fallback, fallback_messages, language, created_at
          ) VALUES (
            ${sessionId}, true, ${JSON.stringify(fallbackArray)}, ${payload.lang || 'nl'}, ${timestamp}
          )
          ON CONFLICT (session_id) DO UPDATE SET
            had_fallback = true,
            fallback_messages = COALESCE(chatbot_conversations.fallback_messages, '[]'::jsonb) || ${JSON.stringify(fallbackArray)}::jsonb;
        `;
      }

      return NextResponse.json({ success: true, db: 'vercel-postgres' });

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
          fsc: payload.fsc !== undefined ? !!payload.fsc : null,
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
            fallback_messages: type === 'chatbot_fallback' && payload.message ? [payload.message] : [],
            language: payload.lang || 'nl',
            created_at: timestamp
          };
          data.chatbotConversations.push(newChat);
        } else {
          const chat = data.chatbotConversations[index];
          if (type === 'chatbot_message') chat.message_count++;
          if (type === 'chatbot_config_complete') chat.completed_configuration = true;
          if (type === 'chatbot_fallback') {
            chat.had_fallback = true;
            if (!chat.fallback_messages) chat.fallback_messages = [];
            if (payload.message) chat.fallback_messages.push(payload.message);
          }
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
    let dbStatus = { connected: false, type: 'local_json' };

    if (hasPostgres || process.env.VERCEL) {
      try {
        const { rows: pv } = await sql`SELECT * FROM page_views`;
        const { rows: ce } = await sql`SELECT * FROM configurator_events`;
        const { rows: cc } = await sql`SELECT * FROM chatbot_conversations`;
        const { rows: qi } = await sql`SELECT * FROM quote_inquiries`;

        pageViews = pv || [];
        configuratorEvents = ce || [];
        chatbotConversations = cc || [];
        quoteInquiries = qi || [];
        dbStatus = { connected: true, type: 'postgres' };
      } catch (dbErr) {
        console.error('Vercel Postgres fetch telemetry error, falling back to local files:', dbErr);
        // Fetch from local JSON fallbacks
        const local = readLocalTelemetry();
        pageViews = local.pageViews;
        configuratorEvents = local.configuratorEvents;
        chatbotConversations = local.chatbotConversations;
        quoteInquiries = readLocalInquiries();
        dbStatus = { connected: false, type: 'postgres_failed', error: dbErr.message };
      }
    } else {
      // Fetch from local JSON fallbacks
      const local = readLocalTelemetry();
      pageViews = local.pageViews;
      configuratorEvents = local.configuratorEvents;
      chatbotConversations = local.chatbotConversations;
      quoteInquiries = readLocalInquiries();
      dbStatus = { connected: false, type: 'local_json' };
    }

    // Run custom map-reduce aggregates in JS
    const aggregated = aggregateStats(pageViews, configuratorEvents, chatbotConversations, quoteInquiries);

    return NextResponse.json({ success: true, stats: aggregated, dbStatus });

  } catch (err) {
    console.error('Analytics aggregation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to retrieve stats' }, { status: 500 });
  }
}

function aggregateStats(pageViews, configuratorEvents, chatbotConversations, quoteInquiries) {
  // Helper to resolve domains safely
  const getReferrerDomain = (ref) => {
    if (!ref) return 'Direct / Unknown';
    try {
      const url = new URL(ref);
      return url.hostname.replace('www.', '') || 'Direct / Unknown';
    } catch (e) {
      if (ref.includes('google')) return 'google.com';
      return ref;
    }
  };

  // 1. Traffic Aggregation
  const totalViews = pageViews.length;
  const viewsByPage = {};
  const viewsByLang = {};
  const viewsByDay = {};
  const referrers = {};
  const devices = { mobile: 0, desktop: 0 };

  pageViews.forEach(pv => {
    const cleanPath = pv.page_path ? pv.page_path.split('?')[0] : '/';
    viewsByPage[cleanPath] = (viewsByPage[cleanPath] || 0) + 1;

    const l = pv.language || 'nl';
    viewsByLang[l] = (viewsByLang[l] || 0) + 1;

    if (pv.created_at) {
      const dateStr = typeof pv.created_at === 'string' ? pv.created_at : pv.created_at.toISOString();
      const day = dateStr.substring(0, 10);
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    }

    // Referrers
    const domain = getReferrerDomain(pv.referrer);
    referrers[domain] = (referrers[domain] || 0) + 1;

    // Devices
    if (pv.is_mobile) {
      devices.mobile++;
    } else {
      devices.desktop++;
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

  // New deeper insights
  const popularDimensions = {}; // category -> { [dimStr]: count }
  const quantityDist = { range500to1000: 0, range1000to5000: 0, range5000plus: 0 };
  let fscCertified = 0;
  let nonFsc = 0;

  // Track session conversions per version
  const sessionVersions = {}; // sessionId -> version
  const sessionSubmissions = new Set(); // sessionIds that submitted a quote

  configuratorEvents.forEach(evt => {
    const sId = evt.session_id;
    if (sId) startedSessions.add(sId);

    if (evt.event_type === 'configurator_start') {
      const version = evt.category || 'v1'; // version code stored here
      configByVersion[version] = (configByVersion[version] || 0) + 1;
      if (sId) sessionVersions[sId] = version;
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
        sessionSubmissions.add(sId);
      }

      // Track dimensions popularity
      if (evt.category && evt.dimensions) {
        const dims = evt.dimensions;
        let dimStr = '';
        if (evt.category === 'dowels' && dims.diameter) {
          dimStr = `Ø ${dims.diameter} x ${dims.length || 0} mm`;
        } else if (dims.thickness) {
          dimStr = `${dims.thickness} x ${dims.width || dims.diameter || 0} x ${dims.length || 0} mm`;
        }
        if (dimStr) {
          if (!popularDimensions[evt.category]) {
            popularDimensions[evt.category] = {};
          }
          popularDimensions[evt.category][dimStr] = (popularDimensions[evt.category][dimStr] || 0) + 1;
        }
      }

      // Quantity distribution
      if (evt.quantity) {
        const q = Number(evt.quantity);
        if (q <= 1000) quantityDist.range500to1000++;
        else if (q <= 5000) quantityDist.range1000to5000++;
        else quantityDist.range5000plus++;
      }

      // FSC count
      if (evt.fsc === true) fscCertified++;
      else if (evt.fsc === false) nonFsc++;
    }
  });

  // Calculate versionStats
  const versionStats = {
    v1: { started: 0, submitted: 0 },
    v2: { started: 0, submitted: 0 },
    v3: { started: 0, submitted: 0 },
    v4: { started: 0, submitted: 0 }
  };
  Object.entries(sessionVersions).forEach(([sId, ver]) => {
    if (versionStats[ver]) {
      versionStats[ver].started++;
      if (sessionSubmissions.has(sId)) {
        versionStats[ver].submitted++;
      }
    }
  });

  // 3. Chatbot Aggregation
  const totalChats = chatbotConversations.length;
  let totalChatMessages = 0;
  let chatsCompleted = 0;
  let chatsFallback = 0;
  const fallbackMessages = [];
  const chatbotByLang = {};

  chatbotConversations.forEach(chat => {
    totalChatMessages += chat.message_count || 0;
    if (chat.completed_configuration) chatsCompleted++;
    if (chat.had_fallback) chatsFallback++;

    // Collect fallback messages if any exist
    if (chat.fallback_messages) {
      const msgs = Array.isArray(chat.fallback_messages) 
        ? chat.fallback_messages 
        : [];
      fallbackMessages.push(...msgs);
    }

    // Language split
    const l = chat.language || 'nl';
    if (!chatbotByLang[l]) {
      chatbotByLang[l] = { total: 0, completed: 0 };
    }
    chatbotByLang[l].total++;
    if (chat.completed_configuration) {
      chatbotByLang[l].completed++;
    }
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

  // 5. User Navigation Path Analysis
  const sessions = {};
  pageViews.forEach(pv => {
    const sId = pv.session_id;
    if (!sId) return;
    if (!sessions[sId]) {
      sessions[sId] = [];
    }
    sessions[sId].push({
      path: pv.page_path ? pv.page_path.split('?')[0] : '/',
      createdAt: pv.created_at || ''
    });
  });

  const stages = [
    { step: 1, nodes: {}, links: [] },
    { step: 2, nodes: {}, links: [] },
    { step: 3, nodes: {}, links: [] },
    { step: 4, nodes: {}, links: [] }
  ];
  const topJourneysMap = {};

  Object.values(sessions).forEach(views => {
    views.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const seq = [];
    views.forEach(v => {
      if (seq.length === 0 || seq[seq.length - 1] !== v.path) {
        seq.push(v.path);
      }
    });

    if (seq.length === 0) return;

    const journeyKey = seq.slice(0, 4).join(' → ');
    topJourneysMap[journeyKey] = (topJourneysMap[journeyKey] || 0) + 1;

    const maxSteps = Math.min(seq.length, 4);

    for (let i = 0; i < maxSteps; i++) {
      const page = seq[i];
      const stage = stages[i];
      
      stage.nodes[page] = (stage.nodes[page] || 0) + 1;

      if (i > 0) {
        const prevPage = seq[i - 1];
        const prevStage = stages[i - 1];
        
        let link = prevStage.links.find(l => l.source === prevPage && l.target === page);
        if (link) {
          link.value++;
        } else {
          prevStage.links.push({ source: prevPage, target: page, value: 1 });
        }
      }
    }

    if (maxSteps < 4) {
      const lastPage = seq[maxSteps - 1];
      const exitStage = stages[maxSteps];
      exitStage.nodes['EXIT'] = (exitStage.nodes['EXIT'] || 0) + 1;
      
      let link = stages[maxSteps - 1].links.find(l => l.source === lastPage && l.target === 'EXIT');
      if (link) {
        link.value++;
      } else {
        stages[maxSteps - 1].links.push({ source: lastPage, target: 'EXIT', value: 1 });
      }
    }
  });

  const formattedStages = stages.map((stage, idx) => {
    const nodesArray = Object.entries(stage.nodes).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    return {
      step: stage.step,
      nodes: nodesArray,
      links: stage.links.sort((a, b) => b.value - a.value)
    };
  });

  const topJourneys = Object.entries(topJourneysMap)
    .map(([pathStr, count]) => ({
      path: pathStr.split(' → '),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const userFlow = {
    stages: formattedStages,
    topJourneys
  };

  return {
    traffic: {
      totalViews,
      viewsByPage,
      viewsByLang,
      viewsByDay: chronologicalViewsByDay,
      referrers,
      devices
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
      },
      popularDimensions,
      quantityDist,
      fscRatio: { fscCertified, nonFsc },
      versionStats
    },
    chatbot: {
      totalChats,
      avgMessages,
      completedCount: chatsCompleted,
      fallbackCount: chatsFallback,
      fallbackRate: chatbotFallbackRate,
      fallbackMessages: fallbackMessages.slice(-25), // Keep latest 25 fallbacks
      byLanguage: chatbotByLang
    },
    quotes: {
      totalQuotes,
      totalValue: Math.round(totalQuotesValue),
      byStatus: quotesByStatus
    },
    userFlow
  };
}
