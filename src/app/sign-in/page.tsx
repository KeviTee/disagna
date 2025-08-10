'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Simple sign-in form storing user role in localStorage */
const SignInPage = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ id: '1', email, role: 'student' }));
    router.push('/dashboard');
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-4'>
      <h1 className='text-2xl font-bold'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
          className='rounded border p-2'
        />
        <button type='submit' className='rounded bg-blue-600 px-4 py-2 text-white'>Continue</button>
      </form>
    </main>
  );
};

export default SignInPage;
