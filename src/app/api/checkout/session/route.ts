import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { amount } = await req.json();
  const session = {
    id: Date.now().toString(),
    amount,
    url: 'https://example.com/checkout'
  };
  return NextResponse.json(session, { status: 201 });
}
