'use client';

import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

export interface CloudinaryPlayerInstance {
  on: (event: string, callback: () => void) => void;
  currentTime: (seconds?: number) => number;
  dispose: () => void;
  play: () => Promise<void>;
  source: (publicId: string, options?: unknown) => void;
}

interface VideoStageProps {
  publicId: string;
  playbackSession: number; // New Prop
  onTimeUpdate: (time: number) => void;
  playerRef: React.MutableRefObject<CloudinaryPlayerInstance | null>;
}

export function VideoStage({
  publicId,
  playbackSession,
  onTimeUpdate,
  playerRef,
}: VideoStageProps) {
  // 1. PURE ID GENERATION
  // No hooks, no side effects, no random numbers.
  // We simply combine the static publicId with the dynamic session ID from the parent.
  // This satisfies Hydration (server sees 0, client sees 0 initially)
  // and Uniqueness (client updates session on click -> new string).
  const playerId = `player-${publicId.replace(/\//g, '-')}-${playbackSession}`;

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className='w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
      <div className='relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10'>
        <CldVideoPlayer
          key={playerId} // Unique key ensures fresh mount
          id={playerId} // Unique ID ensures global registry safety
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

      <div className='px-1'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
          <div className='space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
              Building an AI Video Knowledge Hub
            </h1>
            <p className='text-base text-slate-500 max-w-3xl leading-relaxed'>
              Solving Long-Form Content Fatigue with React and Cloudinary.
              Automatically generate searchable transcripts and intelligent
              video chapters to turn webinars into accessible, actionable
              knowledge libraries.
            </p>
          </div>
          <div className='shrink-0'>
            <Badge
              variant='secondary'
              className='bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 font-semibold text-xs tracking-wide uppercase'
            >
              AI Workloads
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
