/**
 * @fileoverview Main application shell including responsive Navbar and Footer.
 * @module components/layout/shell
 */

import Link from 'next/link';
import { GithubIcon, VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Responsive Navbar */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-2'>
            <VideoIcon className='h-6 w-6 text-primary' />
            <span className='text-lg font-bold tracking-tight'>
              OptiFlow AI
            </span>
          </div>
          <nav className='hidden md:flex items-center gap-6'>
            <Link
              href='/'
              className='text-sm font-medium transition-hover hover:text-primary'
            >
              Hub
            </Link>
            <Link
              href='/analytics'
              className='text-sm font-medium text-muted-foreground transition-hover hover:text-primary'
            >
              Analytics
            </Link>
          </nav>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' asChild>
              <Link href='https://github.com/musebe/optiflow'>
                <GithubIcon className='mr-2 h-4 w-4' />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='flex-1'>{children}</main>

      {/* Responsive Footer */}
      <footer className='border-t py-8 md:py-0'>
        <div className='container mx-auto flex h-auto md:h-24 flex-col items-center justify-between gap-4 px-4 md:flex-row'>
          <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
            Built with Next.js 16 and Cloudinary AI.
          </p>
          <div className='flex items-center gap-4 text-muted-foreground'>
            <Link href='#' className='hover:underline'>
              Privacy
            </Link>
            <Link href='#' className='hover:underline'>
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
