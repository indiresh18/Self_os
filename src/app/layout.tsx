import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'MyLife OS — Personal Self-Care, Career Growth & Savings Management',
  description:
    'A full-stack, Supabase-ready personal productivity application featuring Neo-Brutalism design, daily self-care routines, semester career roadmaps, and disciplined savings tracker.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#F5F0E8] dark:bg-zinc-950">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
