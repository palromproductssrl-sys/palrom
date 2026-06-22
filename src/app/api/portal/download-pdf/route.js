import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generatePdfBuffer } from '../../inquire/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const token = searchParams.get('token'); // We pass token via query parameter to support simple anchor link downloads
    
    if (!id || !token) {
      return NextResponse.json({ error: 'Missing inquiry ID or token' }, { status: 400 });
    }

    if (!token.startsWith('palrom-b2b-')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let authEmail = '';
    try {
      const encodedEmail = token.replace('palrom-b2b-', '');
      authEmail = Buffer.from(encodedEmail, 'base64').toString('utf8').toLowerCase().trim();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    // Load inquiries.json
    const localDbPath = path.join(process.cwd(), 'inquiries.json');
    if (!fs.existsSync(localDbPath)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }

    let allRecords = [];
    try {
      const fileContent = fs.readFileSync(localDbPath, 'utf8');
      allRecords = JSON.parse(fileContent);
    } catch (parseErr) {
      console.error('Failed to parse inquiries.json', parseErr);
      return NextResponse.json({ error: 'Database parse error' }, { status: 500 });
    }

    const inquiry = allRecords.find(record => record.id === id);

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Verify ownership
    if (inquiry.client_email?.toLowerCase().trim() !== authEmail) {
      return NextResponse.json({ error: 'Unauthorized to access this inquiry' }, { status: 403 });
    }

    // Map items dimensions and details to match PDF expectations
    const mappedItems = (inquiry.items || []).map(item => {
      let dimsText = item.dims || '';
      if (!dimsText) {
        if (item.category === 'brichete') {
          dimsText = '90mm x 90mm x 250mm';
        } else {
          const lVal = item.length || '';
          const dVal = item.diameter || item.width || '';
          const tVal = item.thickness || '';
          dimsText = tVal ? `${tVal}x${dVal}x${lVal} mm` : `${dVal}x${lVal} mm`;
        }
      }
      return {
        name: item.name || `Wood Product (${item.category || 'Custom'})`,
        dims: dimsText,
        radius: item.radius || '',
        grade: item.grade || 'A',
        drying: item.drying || 'kd',
        qty: item.qty || 1
      };
    });

    const pdfBuffer = await generatePdfBuffer(
      inquiry.client_name || 'Client',
      inquiry.client_email || authEmail,
      inquiry.client_phone || '',
      inquiry.client_notes || '',
      mappedItems
    );

    const safeClientName = (inquiry.client_name || 'Client').replace(/\s+/g, '_');
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename=Inquiry_${safeClientName}.pdf`);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('[B2B Portal Download PDF] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
