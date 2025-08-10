import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const suggestion = `AI suggestion for: ${prompt ?? ''}`;
  return NextResponse.json({ suggestion });
}
