import { NextResponse } from 'next/server';
import { sections } from '@/lib/data';
import type { Section } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  if (projectId) {
    return NextResponse.json(sections.filter(s => s.projectId === projectId));
  }
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const data: Partial<Section> = await req.json();
  const newSection: Section = {
    id: Date.now().toString(),
    projectId: data.projectId ?? '',
    key: data.key ?? '',
    content: data.content ?? '',
    notes: data.notes ?? '',
    status: data.status ?? 'draft'
  };
  sections.push(newSection);
  return NextResponse.json(newSection, { status: 201 });
}

export async function PUT(req: Request) {
  const data: Partial<Section> = await req.json();
  const index = sections.findIndex(s => s.id === data.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  sections[index] = { ...sections[index], ...data } as Section;
  return NextResponse.json(sections[index]);
}
