'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Project, Section } from '@/lib/types';

/** Shows project overview with its sections */
const ProjectPage = () => {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/projects/${params.id}`).then(res => res.json()).then(setProject);
    fetch(`/api/sections?projectId=${params.id}`).then(res => res.json()).then(setSections);
  }, [params.id]);

  if (!project) {
    return <main className='p-4'>Loading...</main>;
  }

  return (
    <main className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>{project.title}</h1>
      <ul className='space-y-2'>
        {sections.map(s => (
          <li key={s.id} className='rounded border p-2'>
            <Link href={`/projects/${project.id}/sections/${s.id}`}>{s.key}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ProjectPage;
