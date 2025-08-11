'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Project, Section } from '@/lib/types';

/** Shows topic overview with its sections */
const TopicPage = () => {
  const params = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Project | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [key, setKey] = useState('');

  const loadSections = () =>
    fetch(`/api/sections?projectId=${params.id}`).then(res => res.json()).then(setSections);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/projects/${params.id}`).then(res => res.json()).then(setTopic);
    loadSections();
  }, [params.id]);

  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: params.id, key })
    });
    setKey('');
    loadSections();
  };

  const removeSection = async (id: string) => {
    await fetch('/api/sections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    loadSections();
  };

  if (!topic) {
    return <main className='p-4'>Loading...</main>;
  }

  return (
    <main className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>{topic.topic}</h1>
      <form onSubmit={addSection} className='mb-4 flex gap-2'>
        <input
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder='Section key'
          className='rounded border p-2'
        />
        <button type='submit' className='rounded bg-green-600 px-4 py-2 text-white'>Add</button>
      </form>
      <ul className='space-y-2'>
        {sections.map(s => (
          <li key={s.id} className='flex items-center justify-between rounded border p-2'>
            <Link href={`/projects/${topic.id}/sections/${s.id}`}>{s.key}</Link>
            <button
              onClick={() => removeSection(s.id)}
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

export default TopicPage;
