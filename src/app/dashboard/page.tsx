'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { useSession } from 'next-auth/react';

/** Displays list of projects for the signed in user */
const Dashboard = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');

  const load = () =>
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then(setProjects);

  useEffect(() => {
    load();
  }, []);

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    load();
  };

  const removeProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Please sign in</p>;

  return (
    <main className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Dashboard</h1>
      <form onSubmit={addProject} className='mb-4 flex gap-2'>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='Project title'
          className='rounded border p-2'
        />
        <button type='submit' className='rounded bg-green-600 px-4 py-2 text-white'>Add</button>
      </form>
      <ul className='space-y-2'>
        {projects.map(p => (
          <li key={p.id} className='flex items-center justify-between rounded border p-2'>
            <Link href={`/projects/${p.id}`}>{p.title || 'Untitled Project'}</Link>
            <button
              onClick={() => removeProject(p.id)}
              className='text-sm text-red-600'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;
