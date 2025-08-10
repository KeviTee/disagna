import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import getDb from '@/lib/db';
import type { Project } from '@/lib/types';

export async function GET(_req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = await getDb();
  const project = await db
    .collection<Project>('projects')
    .findOne({ id: params.id, ownerId: user.id });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = await getDb();
  const data: Partial<Project> = await req.json();
  const filter = { id: params.id, ownerId: user.id };
  const existing = await db.collection<Project>('projects').findOne(filter);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await db.collection<Project>('projects').updateOne(filter, { $set: data });
  const updated = { ...existing, ...data } as Project;
  return NextResponse.json(updated);
}
