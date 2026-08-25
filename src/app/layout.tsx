import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'Yojana Board',
  description: 'Internal task management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`flex h-screen overflow-hidden bg-background text-foreground`} suppressHydrationWarning>
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
