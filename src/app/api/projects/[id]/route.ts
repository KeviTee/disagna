import { NextResponse } from 'next/server';
import { projects } from '@/lib/data';
import type { Project } from '@/lib/types';

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const project = projects.find(p => p.id === params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, { params }: Params) {
  const index = projects.findIndex(p => p.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data: Partial<Project> = await req.json();
  projects[index] = { ...projects[index], ...data };
  return NextResponse.json(projects[index]);
}
