import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  title: 'ManagedBetter',
  description: 'ManagedBetter Application',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, 'dark antialiased')} lang="en">
      <body>{children}</body>
    </html>
  );
}
