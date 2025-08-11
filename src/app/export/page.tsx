'use client';

import { useState } from 'react';

/** Allows user to export document in different formats */
const ExportPage = () => {
  const [topicId, setTopicId] = useState('');

  const handleExport = async () => {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: topicId })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className='space-y-4 p-4'>
      <h1 className='text-xl font-bold'>Export Document</h1>
      <input
        value={topicId}
        onChange={e => setTopicId(e.target.value)}
        placeholder='Topic ID'
        className='rounded border p-2'
      />
      <button onClick={handleExport} className='rounded bg-blue-600 px-4 py-2 text-white'>Export</button>
    </main>
  );
};

export default ExportPage;
