import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '@/lib/db';
import type { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  db.read();
  if (db.data.users.find(u => u.email === email)) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }
  const user: User = {
    id: uuid(),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: 'student'
  };
  db.data.users.push(user);
  db.write();
  return NextResponse.json({ ok: true });
}
