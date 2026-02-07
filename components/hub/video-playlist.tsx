'use client';

import * as React from 'react';
import { PlayCircleIcon, ClockIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getPlaylistAction } from '@/app/actions/media-process';
import { Badge } from '@/components/ui/badge';

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
      <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider'>
        Recent Sessions ({videos.length})
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {videos.map((video) => {
          const isSelected = video.publicId === currentPublicId;
          // Clean title logic
          const displayTitle =
            video.publicId.split('/').pop() || video.publicId;

          return (
            <Card
              key={video.publicId}
              onClick={() =>
                onSelectVideo(video.publicId, video.version.toString())
              }
              className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg border-2 ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-200/50'
                  : 'border-transparent hover:border-slate-200'
              }`}
            >
              {/* Thumbnail Container */}
              <div className='aspect-video bg-slate-100 relative overflow-hidden'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnailUrl}
                  alt={`Thumbnail for ${displayTitle}`}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                  loading='lazy'
                />

                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

                {/* Centered Play Button (appears on hover) */}
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100'>
                  <div className='bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg'>
                    <PlayCircleIcon className='h-6 w-6 text-indigo-600' />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className='absolute bottom-2 right-2'>
                  <Badge
                    variant='secondary'
                    className='bg-black/60 text-white hover:bg-black/70 border-none h-5 px-1.5 text-[10px] gap-1 backdrop-blur-sm'
                  >
                    <ClockIcon className='h-3 w-3' />
                    {Math.round(video.duration)}s
                  </Badge>
                </div>
              </div>

              {/* Minimal Text Section */}
              <div className='p-3 bg-white'>
                <p
                  className='text-xs font-semibold text-slate-700 truncate leading-snug'
                  title={displayTitle} // Tooltip shows full name
                >
                  {displayTitle}
                </p>
                <p className='text-[10px] text-slate-400 mt-1 truncate'>
                  {new Date().toLocaleDateString()} •{' '}
                  {video.format.toUpperCase()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
