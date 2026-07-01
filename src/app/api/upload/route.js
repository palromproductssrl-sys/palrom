import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = (request.headers.get('x-admin-passcode') || '').trim();
  const allowed = [...VALID_PASSCODES, getPasscode()];
  return allowed.includes(passcode);
}

const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

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

    // 1. Vercel Blob Storage Upload (Production / Vercel primary)
    if (hasVercelBlob || process.env.VERCEL) {
      try {
        // Upload to Vercel Blob
        const blob = await put(filename, file, {
          access: 'public',
        });

        return NextResponse.json({
          success: true,
          url: blob.url
        });
      } catch (blobErr) {
        console.error('Vercel Blob upload failed:', blobErr);
        if (process.env.VERCEL) {
          return NextResponse.json({
            success: false,
            error: `Blob storage error: ${blobErr.message || 'Vercel Blob error'}. Please verify that a Vercel Blob store is linked to this project.`
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
