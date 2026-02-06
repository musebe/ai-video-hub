/**
 * @fileoverview Root Layout for OptiFlow AI.
 * Maintained with strict font configurations and Next.js 16 metadata standards.
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OptiFlow AI | Video Knowledge Hub',
  description:
    'Solving long-form content fatigue with AI-powered video insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={outfit.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
