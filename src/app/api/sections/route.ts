import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import db from '@/lib/db';
import { v4 as uuid } from 'uuid';
import type { Section } from '@/lib/types';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json([], { status: 401 });
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  db.read();
  const sections = db.data.sections.filter(s => {
    const project = db.data.projects.find(p => p.id === s.projectId);
    return project && project.ownerId === user.id && (!projectId || s.projectId === projectId);
  });
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data: Partial<Section> = await req.json();
  db.read();
  const project = db.data.projects.find(p => p.id === data.projectId && p.ownerId === user.id);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  const newSection: Section = {
    id: uuid(),
    projectId: data.projectId!,
    key: data.key ?? '',
    content: data.content ?? '',
    notes: data.notes ?? '',
    status: data.status ?? 'draft'
  };
  db.data.sections.push(newSection);
  db.write();
  return NextResponse.json(newSection, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data: Partial<Section> = await req.json();
  db.read();
  const index = db.data.sections.findIndex(s => s.id === data.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const project = db.data.projects.find(p => p.id === db.data.sections[index].projectId);
  if (!project || project.ownerId !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  db.data.sections[index] = { ...db.data.sections[index], ...data } as Section;
  db.write();
  return NextResponse.json(db.data.sections[index]);
}
