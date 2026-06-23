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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-');
    const filename = `${base}-${Date.now()}${ext}`;
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
