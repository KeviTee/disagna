import Link from 'next/link';

/** Landing page with signup call to action */
const Page = () => {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 p-4'>
      <h1 className='text-4xl font-bold'>Dissertation SaaS</h1>
      <p className='text-center max-w-xl'>A guided writing platform with AI support for Zimbabwean university students.</p>
      <Link href='/sign-in' className='rounded bg-blue-600 px-4 py-2 text-white'>Get Started</Link>
    </main>
  );
};

export default Page;
