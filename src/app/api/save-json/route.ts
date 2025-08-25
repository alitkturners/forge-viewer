import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // File path (write to project root or public folder)
    const filePath = path.join(process.cwd(), 'data.json');

    // Convert to JSON and write to file
    await writeFile(filePath, JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true, message: 'JSON saved successfully' });
  } catch (error) {
    console.error('Error saving JSON:', error);
    return NextResponse.json({ success: false, message: 'Failed to save JSON' }, { status: 500 });
  }
}
