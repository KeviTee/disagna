'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Section } from '@/lib/types';

/** Guided section editor with AI suggestions */
const SectionPage = () => {
  const params = useParams<{ id: string; sectionId: string }>();
  const [section, setSection] = useState<Section | null>(null);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    fetch(`/api/sections?projectId=${params.id}`)
      .then(res => res.json())
      .then((all: Section[]) => {
        setSection(all.find(s => s.id === params.sectionId) || null);
      });
  }, [params.id, params.sectionId]);

  const getSuggestion = async () => {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: section?.content || '' })
    });
    const data = await res.json();
    setSuggestion(data.suggestion);
  };

  if (!section) return <main className='p-4'>Loading...</main>;

  return (
    <main className='space-y-4 p-4'>
      <h1 className='text-xl font-bold'>{section.key}</h1>
      <textarea className='w-full rounded border p-2' value={section.content} readOnly />
      <button onClick={getSuggestion} className='rounded bg-green-600 px-4 py-2 text-white'>AI Suggest</button>
      {suggestion && <p className='whitespace-pre-wrap rounded border p-2'>{suggestion}</p>}
    </main>
  );
};

export default SectionPage;
