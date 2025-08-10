import { NextResponse } from 'next/server';
import { projects } from '@/lib/data';
import type { Project } from '@/lib/types';

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const data: Partial<Project> = await req.json();
  const newProject: Project = {
    id: Date.now().toString(),
    ownerId: data.ownerId ?? 'unknown',
    title: data.title ?? '',
    institution: data.institution ?? '',
    programme: data.programme ?? '',
    supervisor: data.supervisor ?? '',
    deadlines: data.deadlines ?? [],
    status: data.status ?? 'draft'
  };
  projects.push(newProject);
  return NextResponse.json(newProject, { status: 201 });
}
