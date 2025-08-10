'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

/** Sign-in / Sign-up form using NextAuth credentials */
const SignInPage = () => {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
    }
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    if (res?.ok) router.push('/dashboard');
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-4'>
      <h1 className='text-2xl font-bold'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        {isRegister && (
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name'
            required
            className='rounded border p-2'
          />
        )}
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
          className='rounded border p-2'
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
          className='rounded border p-2'
        />
        <button type='submit' className='rounded bg-blue-600 px-4 py-2 text-white'>
          {isRegister ? 'Register' : 'Sign In'}
        </button>
      </form>
      <button className='mt-2 text-sm underline' onClick={() => setIsRegister(r => !r)}>
        {isRegister ? 'Already have an account? Sign in' : "Need an account? Register"}
      </button>
    </main>
  );
};

export default SignInPage;
