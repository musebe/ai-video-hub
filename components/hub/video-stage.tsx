/**
 * @fileoverview Video Stage with fixed Interface for Seeking (Setter support).
 */

'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

// 1. FIX: Update currentTime to accept an optional argument (seconds)
// This allows it to work as both a Getter (current time) and a Setter (seek).
export interface CloudinaryPlayerInstance {
  on: (event: string, callback: () => void) => void;
  currentTime: (seconds?: number) => number; // <--- Updated signature
  dispose: () => void;
  play: () => Promise<void>;
  source: (publicId: string, options?: unknown) => void;
}

interface VideoStageProps {
  publicId: string;
  onTimeUpdate: (time: number) => void;
  playerRef: React.MutableRefObject<CloudinaryPlayerInstance | null>;
}

export function VideoStage({
  publicId,
  onTimeUpdate,
  playerRef,
}: VideoStageProps) {
  return (
    <div className='w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-12 ring-white'>
        <CldVideoPlayer
          key={publicId}
          id={publicId}
          width='1920'
          height='1080'
          src={publicId}
          autoplay={true}
          colors={{
            accent: '#6366f1',
            base: '#0f172a',
            text: '#ffffff',
          }}
          onDataLoad={({ player }: { player: CloudinaryPlayerInstance }) => {
            playerRef.current = player;

            player.on('timeupdate', () => {
              // Works as a getter (0 args)
              onTimeUpdate(player.currentTime());
            });
          }}
        />
      </div>

      <div className='space-y-6 px-2'>
        <div className='flex items-start justify-between gap-6'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl'>
              Next.js Media Upload Tutorial
            </h1>
            <p className='text-lg text-slate-500 leading-relaxed max-w-3xl'>
              Mastering the Cloudinary upload lifecycle and AI-powered metadata
              within a modern Next.js 16 architecture.
            </p>
          </div>
          <Badge
            variant='secondary'
            className='mt-2 bg-sky-50 text-sky-600 border-sky-100 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]'
          >
            Webinar
          </Badge>
        </div>
      </div>
    </div>
  );
}
