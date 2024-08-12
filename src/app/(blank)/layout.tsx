import { Toaster } from 'sonner';

import { Box } from '@/components/atoms/layout';

import { geist, inter } from '../font';

import '../globals.css';

import type { Metadata } from 'next';

import { cn } from '@/lib/utils/cn';
import NextProgress from '@/components/atoms/next-progress';
import { Providers } from '@/components/organisms/providers';

export const metadata: Metadata = {
  title: 'FileKit',
  description: 'A starter kit for building SaaS products with Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.className, geist.variable)}
        suppressHydrationWarning
      >
        <Providers>
          <main className="flex h-[100dvh] flex-col overflow-x-hidden">
            <Box className="grow">{children}</Box>
          </main>
        </Providers>
        <NextProgress />
      </body>
    </html>
  );
}
