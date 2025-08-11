import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import getDb from '@/lib/db';
import { randomUUID } from 'crypto';
import type { Project } from '@/lib/types';

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json([], { status: 401 });
  const db = await getDb();
  const projects = await db
    .collection<Project>('projects')
    .find({ ownerId: user.id })
    .toArray();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data: Partial<Project> = await req.json();
  const db = await getDb();
  const newProject: Project = {
    id: randomUUID(),
    ownerId: user.id,
    topic: data.topic ?? '',
    institution: data.institution,
    programme: data.programme,
    supervisor: data.supervisor,
    deadlines: data.deadlines,
    status: data.status ?? 'draft'
  };
  await db.collection<Project>('projects').insertOne(newProject);
  return NextResponse.json(newProject, { status: 201 });
}
