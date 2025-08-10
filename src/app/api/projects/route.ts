import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import db from '@/lib/db';
import { randomUUID } from 'crypto';
import type { Project } from '@/lib/types';

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json([], { status: 401 });
  db.read();
  const projects = db.data.projects.filter(p => p.ownerId === user.id);
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data: Partial<Project> = await req.json();
  db.read();
  const newProject: Project = {
    id: randomUUID(),
    ownerId: user.id,
    title: data.title ?? '',
    institution: data.institution ?? '',
    programme: data.programme ?? '',
    supervisor: data.supervisor ?? '',
    deadlines: data.deadlines ?? [],
    status: data.status ?? 'draft'
  };
  db.data.projects.push(newProject);
  db.write();
  return NextResponse.json(newProject, { status: 201 });
}
