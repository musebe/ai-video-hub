/**
 * @fileoverview Specialized layout components for the Knowledge Hub.
 */

import { cn } from '@/lib/utils';

export function HubContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='bg-background w-full'>
      <div
        className={cn(
          'mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-12 p-6 pt-10 lg:grid-cols-3',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function HubSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className='flex flex-col gap-3 w-full'>
      {title && (
        <div className='text-muted-foreground/80 px-1 text-[10px] font-bold uppercase tracking-[0.2em]'>
          {title}
        </div>
      )}
      <div
        className={cn(
          'bg-white border border-slate-200/60 shadow-sm flex flex-col items-start gap-8 p-8 rounded-2xl',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
