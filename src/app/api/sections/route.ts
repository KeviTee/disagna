import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import getDb from '@/lib/db';
import { randomUUID } from 'crypto';
import type { Section, Project } from '@/lib/types';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json([], { status: 401 });
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const db = await getDb();
  const projectsCol = db.collection<Project>('projects');
  const sectionsCol = db.collection<Section>('sections');
  if (projectId) {
    const project = await projectsCol.findOne({ id: projectId, ownerId: user.id });
    if (!project) return NextResponse.json([], { status: 404 });
    const sections = await sectionsCol.find({ projectId }).toArray();
    return NextResponse.json(sections);
  }
  const userProjects = await projectsCol.find({ ownerId: user.id }).toArray();
  const ids = userProjects.map(p => p.id);
  const sections = await sectionsCol.find({ projectId: { $in: ids } }).toArray();
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data: Partial<Section> = await req.json();
  const db = await getDb();
  const projectsCol = db.collection<Project>('projects');
  const sectionsCol = db.collection<Section>('sections');
  const project = await projectsCol.findOne({ id: data.projectId, ownerId: user.id });
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  const newSection: Section = {
    id: randomUUID(),
    projectId: data.projectId!,
    key: data.key ?? '',
    content: data.content ?? '',
    notes: data.notes ?? '',
    status: data.status ?? 'draft'
  };
  await sectionsCol.insertOne(newSection);
  return NextResponse.json(newSection, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data: Partial<Section> = await req.json();
  const db = await getDb();
  const sectionsCol = db.collection<Section>('sections');
  const projectsCol = db.collection<Project>('projects');
  const existing = await sectionsCol.findOne({ id: data.id });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const project = await projectsCol.findOne({ id: existing.projectId });
  if (!project || project.ownerId !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await sectionsCol.updateOne({ id: data.id }, { $set: data });
  const updated = await sectionsCol.findOne({ id: data.id });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const db = await getDb();
  const sectionsCol = db.collection<Section>('sections');
  const projectsCol = db.collection<Project>('projects');
  const existing = await sectionsCol.findOne({ id });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const project = await projectsCol.findOne({ id: existing.projectId });
  if (!project || project.ownerId !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await sectionsCol.deleteOne({ id });
  return NextResponse.json({ ok: true });
}
