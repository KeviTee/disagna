import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from './db';
import type { User } from './types';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials as Record<string, string>;
        db.read();
        const user = db.data.users.find(u => u.email === email);
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password: _p, ...rest } = user;
          return rest as any;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    }
  },
  pages: { signIn: '/sign-in' }
};

export default authOptions;
