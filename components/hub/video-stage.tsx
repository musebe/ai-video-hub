/**
 * @fileoverview Refined Video Stage with the exact Cloudinary Public ID.
 */

'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerEngine } from '@/components/video/player-engine';

export function VideoStage() {
  // EXACT Public ID from your Cloudinary folder
  const WEBINAR_ID =
    'webinars/Next.js_Media_Upload_Tutorial__Images_Videos_with_Cloudinary_2026';

  return (
    <div className='w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-2xl ring-12 ring-white'>
        <VideoPlayerEngine publicId={WEBINAR_ID} />
      </div>

      <div className='space-y-4 px-1'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl'>
              Next.js Media Upload Tutorial
            </h1>
            <p className='text-lg text-slate-500 leading-relaxed max-w-2xl'>
              Advanced implementation of images and videos using Cloudinary
              within a Next.js architecture.
            </p>
          </div>
          <Badge
            variant='secondary'
            className='mt-2 bg-sky-50 text-sky-600 border-sky-100 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]'
          >
            2026 Edition
          </Badge>
        </div>
      </div>
    </div>
  );
}
