'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { useSession } from 'next-auth/react';

/** Displays list of topics for the signed in user */
const Dashboard = () => {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Project[]>([]);
  const [topic, setTopic] = useState('');

  const load = () =>
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then(setTopics);

  useEffect(() => {
    load();
  }, []);

  const addTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    setTopic('');
    load();
  };

  const removeTopic = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Please sign in</p>;

  return (
    <main className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Dashboard</h1>
      <form onSubmit={addTopic} className='mb-4 flex gap-2'>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder='Topic'
          className='rounded border p-2'
        />
        <button type='submit' className='rounded bg-green-600 px-4 py-2 text-white'>Add</button>
      </form>
      <ul className='space-y-2'>
        {topics.map(p => (
          <li key={p.id} className='flex items-center justify-between rounded border p-2'>
            <Link href={`/projects/${p.id}`}>{p.topic || 'Untitled Topic'}</Link>
            <button
              onClick={() => removeTopic(p.id)}
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
