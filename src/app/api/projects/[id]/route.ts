import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import db from '@/lib/db';
import type { Project } from '@/lib/types';

export async function GET(_req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  db.read();
  const project = db.data.projects.find(p => p.id === params.id && p.ownerId === user.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  db.read();
  const index = db.data.projects.findIndex(p => p.id === params.id && p.ownerId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data: Partial<Project> = await req.json();
  db.data.projects[index] = { ...db.data.projects[index], ...data };
  db.write();
  return NextResponse.json(db.data.projects[index]);
}
