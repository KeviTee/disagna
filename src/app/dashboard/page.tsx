'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types';

/** Displays list of projects for the signed in user */
const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  return (
    <main className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Dashboard</h1>
      <ul className='space-y-2'>
        {projects.map(p => (
          <li key={p.id} className='rounded border p-2'>
            <Link href={`/projects/${p.id}`}>{p.title || 'Untitled Project'}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;
