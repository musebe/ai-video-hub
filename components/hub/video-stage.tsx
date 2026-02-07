'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

// Exporting the interface for page.tsx
export interface CloudinaryPlayerInstance {
  on: (event: string, callback: () => void) => void;
  currentTime: (seconds?: number) => number;
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
  // 1. FIX: Use useState initializer for Stable, Unique IDs
  // We use useState(() => ...) because this function runs ONLY once when the
  // component mounts. This satisfies the linter (it's not a render side-effect)
  // and solves the "Zombie Player" issue by guaranteeing a fresh ID every time
  // the parent remounts this component.
  const [playerId] = useState(
    () =>
      `player-${publicId.replace(/\//g, '-')}-${Math.random().toString(36).substring(2, 9)}`,
  );

  // 2. Safety Cleanup
  // Ensure we kill the reference when this specific instance dies.
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className='w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-12 ring-white'>
        <CldVideoPlayer
          key={playerId} // Use the generated stable ID as the key
          id={playerId}
          width='1920'
          height='1080'
          src={publicId}
          autoplay={true}
          controls={true}
          colors={{
            accent: '#6366f1',
            base: '#0f172a',
            text: '#ffffff',
          }}
          onDataLoad={({ player }: { player: CloudinaryPlayerInstance }) => {
            playerRef.current = player;

            player.on('timeupdate', () => {
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
