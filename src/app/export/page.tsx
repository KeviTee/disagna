'use client';

import { useState } from 'react';

/** Allows user to export document in different formats */
const ExportPage = () => {
  const [format, setFormat] = useState('docx');
  const [url, setUrl] = useState('');

  const handleExport = async () => {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format })
    });
    const data = await res.json();
    setUrl(data.url);
  };

  return (
    <main className='space-y-4 p-4'>
      <h1 className='text-xl font-bold'>Export Document</h1>
      <select
        value={format}
        onChange={e => setFormat(e.target.value)}
        className='rounded border p-2'
      >
        <option value='docx'>DOCX</option>
        <option value='pdf'>PDF</option>
      </select>
      <button onClick={handleExport} className='rounded bg-blue-600 px-4 py-2 text-white'>Export</button>
      {url && (
        <a href={url} className='block text-blue-700 underline'>Download</a>
      )}
    </main>
  );
};

export default ExportPage;
