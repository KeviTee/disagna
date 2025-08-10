import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!openai) {
    return NextResponse.json({ suggestion: `AI suggestion for: ${prompt ?? ''}` });
  }
  const completion = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    max_output_tokens: 60
  });
  const suggestion = completion.output_text;
  return NextResponse.json({ suggestion });
}
