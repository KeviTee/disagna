import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import getDb from '@/lib/db';
import type { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  const db = await getDb();
  const users = db.collection<User>('users');
  if (await users.findOne({ email })) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }
  const user: User = {
    id: randomUUID(),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: 'student'
  };
  await users.insertOne(user);
  return NextResponse.json({ ok: true });
}
