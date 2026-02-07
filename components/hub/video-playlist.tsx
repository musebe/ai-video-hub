'use client';

import * as React from 'react';
import { PlayCircleIcon, ClockIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getPlaylistAction } from '@/app/actions/media-process';

// Define the interface for the playlist items
interface Video {
  publicId: string;
  version: number;
  format: string;
  duration: number;
  thumbnailUrl: string;
}

interface VideoPlaylistProps {
  currentPublicId: string;
  onSelectVideo: (publicId: string, version: string) => void;
}

export function VideoPlaylist({
  currentPublicId,
  onSelectVideo,
}: VideoPlaylistProps) {
  const [videos, setVideos] = React.useState<Video[]>([]);

  React.useEffect(() => {
    getPlaylistAction().then(setVideos);
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className='space-y-4 mt-8'>
      <h3 className='text-lg font-semibold text-slate-900'>Recent Sessions</h3>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {videos.map((video) => {
          const isSelected = video.publicId === currentPublicId;
          // Clean up the display title (remove 'webinar/' prefix if present)
          const displayTitle =
            video.publicId.split('/').pop() || video.publicId;

          return (
            <Card
              key={video.publicId}
              onClick={() =>
                onSelectVideo(video.publicId, video.version.toString())
              }
              className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-md border-2 ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-transparent'
              }`}
            >
              <div className='aspect-video bg-slate-100 relative'>
                {/* FIXED: Replaced CldImage with standard <img> using the pre-calculated video thumbnail URL.
                           This ensures we get the .jpg from the video resource correctly. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnailUrl}
                  alt={`Thumbnail for ${displayTitle}`}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  loading='lazy'
                />

                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors' />

                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='bg-white/90 rounded-full p-2 shadow-sm'>
                    <PlayCircleIcon className='h-8 w-8 text-indigo-600' />
                  </div>
                </div>

                <div className='absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1'>
                  <ClockIcon className='h-3 w-3' />
                  {Math.round(video.duration)}s
                </div>
              </div>

              <div className='p-3'>
                <p
                  className='text-xs font-medium text-slate-700 truncate'
                  title={video.publicId}
                >
                  {displayTitle}
                </p>
                <p className='text-[10px] text-slate-500 mt-1'>
                  Format: {video.format.toUpperCase()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
