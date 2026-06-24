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
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid passcode' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-');
    const filename = `${base}-${Date.now()}${ext}`;

    // 1. Supabase Storage Upload (Production / Vercel primary)
    if (supabase) {
      try {
        const bucketName = 'news-images';
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Attempt upload to Supabase Storage
        let { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filename, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        // If bucket doesn't exist, try creating it and retrying upload
        if (error && (error.message?.includes('Bucket not found') || error.message?.includes('does not exist'))) {
          console.log(`Bucket '${bucketName}' not found. Attempting to create...`);
          const { error: createErr } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/*'],
            fileSizeLimit: 5242880 // 5MB limit
          });

          if (!createErr) {
            const retryResult = await supabase.storage
              .from(bucketName)
              .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
              });
            data = retryResult.data;
            error = retryResult.error;
          } else {
            console.error('Failed to create bucket:', createErr);
            throw createErr;
          }
        }

        if (error) {
          console.error('Supabase storage upload error:', error);
          throw error;
        }

        if (data) {
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filename);

          return NextResponse.json({
            success: true,
            url: urlData.publicUrl
          });
        }
      } catch (sbErr) {
        console.error('Supabase upload failed:', sbErr);
        if (process.env.VERCEL) {
          return NextResponse.json({
            success: false,
            error: `Database storage error: ${sbErr.message || 'Supabase error'}. Please verify that a public bucket named 'news-images' exists or that the service role key has correct policies.`
          }, { status: 500 });
        }
        console.log('Falling back to local filesystem storage...');
      }
    }

    // 2. Local Filesystem Storage Fallback (Local Development only)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved uploaded image file to: ${filePath}`);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ success: false, error: 'Internal server error during file upload' }, { status: 500 });
  }
}
