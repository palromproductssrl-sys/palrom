import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const CONFIG_FILE = path.join(process.cwd(), 'src/data/video_scenes_config.json');

// Global job tracker in Node server instance
let activeJob = {
  running: false,
  status: 'idle',
  lang: 'all',
  startedAt: null,
  completedAt: null,
  error: null,
  logs: []
};

export async function GET() {
  try {
    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }

    // Check existing corporate video files
    const corporateVideos = {};
    for (const lang of ['nl', 'en', 'de', 'ro']) {
      const p = path.join(process.cwd(), `public/images/palrom-corporate-video-${lang}.mp4`);
      if (fs.existsSync(p)) {
        const stat = fs.statSync(p);
        corporateVideos[lang] = {
          url: `/images/palrom-corporate-video-${lang}.mp4?v=${stat.mtimeMs}`,
          updatedAt: stat.mtime,
          sizeMb: (stat.size / (1024 * 1024)).toFixed(2)
        };
      }
    }

    return NextResponse.json({
      success: true,
      config,
      videoSource: '/videos/palrom_drone_source.mp4',
      corporateVideos,
      job: activeJob
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, config, lang = 'all' } = body;

    // 1. Save configuration if provided
    if (config) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    }

    if (action === 'save') {
      return NextResponse.json({ success: true, message: 'Configuratie succesvol opgeslagen.' });
    }

    if (action === 'render') {
      if (activeJob.running) {
        return NextResponse.json({
          success: false,
          message: 'Er is al een renderproces actief op de achtergrond.',
          job: activeJob
        });
      }

      // Reset job state
      activeJob = {
        running: true,
        status: 'rendering',
        lang,
        startedAt: new Date().toISOString(),
        completedAt: null,
        error: null,
        logs: [`Start renderproces voor taal: ${lang.toUpperCase()}...`]
      };

      // Spawn python script in background
      const scriptPath = path.join(process.cwd(), 'scripts/build_multilingual_corporate_videos.py');
      const py = spawn('python3', [scriptPath, '--lang', lang], {
        cwd: process.cwd()
      });

      py.stdout.on('data', (data) => {
        const text = data.toString().trim();
        if (text) {
          activeJob.logs.push(text);
          if (activeJob.logs.length > 80) activeJob.logs.shift();
        }
      });

      py.stderr.on('data', (data) => {
        const text = data.toString().trim();
        if (text) {
          activeJob.logs.push(`[ERR] ${text}`);
          if (activeJob.logs.length > 80) activeJob.logs.shift();
        }
      });

      py.on('close', (code) => {
        activeJob.running = false;
        activeJob.completedAt = new Date().toISOString();
        if (code === 0) {
          activeJob.status = 'completed';
          activeJob.logs.push('✓ Video render succesvol voltooid!');
        } else {
          activeJob.status = 'failed';
          activeJob.error = `Render mislukt met exit code ${code}`;
          activeJob.logs.push(`✖ Fout: Render mislukt (code ${code})`);
        }
      });

      return NextResponse.json({
        success: true,
        message: `Render gestart voor ${lang.toUpperCase()}.`,
        job: activeJob
      });
    }

    return NextResponse.json({ success: false, message: 'Onbekende actie.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
