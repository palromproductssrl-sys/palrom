import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, from = 'nl', to } = body;

    if (!text || !to) {
      return NextResponse.json({ success: false, error: 'Missing required parameters: text and to are required.' }, { status: 400 });
    }

    // Convert language codes to MyMemory format (e.g. nl, en, de, ro)
    // MyMemory accepts standard ISO 2-letter codes.
    const langpair = `${from}|${to}`;
    // Using a valid email increases daily rate limit from 5k to 50k characters
    const email = 'info@palromproducts.ro';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}&de=${email}`;

    const res = await fetch(url);
    const data = await res.json();

    if (res.ok && data.responseData && data.responseData.translatedText) {
      // Check if MyMemory returned an internal error code in their response details
      if (data.responseStatus && data.responseStatus !== 200) {
        console.error('MyMemory API error code in response:', data);
        return NextResponse.json({ 
          success: false, 
          error: data.responseDetails || `MyMemory API returned status ${data.responseStatus}` 
        }, { status: data.responseStatus });
      }

      return NextResponse.json({
        success: true,
        translatedText: data.responseData.translatedText
      });
    }

    console.error('Translation failed. MyMemory response data:', data);
    return NextResponse.json({ success: false, error: data.responseDetails || 'Translation API failed to respond' }, { status: 502 });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error during translation' }, { status: 500 });
  }
}
