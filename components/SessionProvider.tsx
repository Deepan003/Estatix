// components/SessionProvider.tsx
'use client'; // This directive is necessary for SessionProvider

import { SessionProvider } from 'next-auth/react';

// Renaming the component function to avoid conflict if you import SessionProvider elsewhere
export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // The SessionProvider component from next-auth/react makes the session data available
  return <SessionProvider>{children}</SessionProvider>;
}