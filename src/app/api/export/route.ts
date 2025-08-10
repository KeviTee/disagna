import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { format } = await req.json();
  const url = `https://example.com/document.${format ?? 'docx'}`;
  return NextResponse.json({ url });
}
