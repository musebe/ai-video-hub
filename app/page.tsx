'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { AppShell } from '@/components/layout/shell';
import { HubContainer, HubSection } from '@/components/hub/layout';
// FIX 1: Import the new interface from video-stage
import {
  VideoStage,
  CloudinaryPlayerInstance,
} from '@/components/hub/video-stage';
import { InsightsSidebar } from '@/components/hub/insights-sidebar';
import { VideoPlaylist } from '@/components/hub/video-playlist';
import { UploadIcon } from 'lucide-react';

const VideoUploader = dynamic(
  () =>
    import('@/components/hub/video-uploader').then((mod) => mod.VideoUploader),
  { ssr: false },
);

function HubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialId = searchParams.get('video') || '';
  const initialVer = searchParams.get('version') || '';

  const [publicId, setPublicId] = React.useState(initialId);
  const [version, setVersion] = React.useState(initialVer);
  const [currentTime, setCurrentTime] = React.useState(0);

  // FIX 2: Update the ref to use CloudinaryPlayerInstance
  const playerRef = React.useRef<CloudinaryPlayerInstance | null>(null);

  const handleVideoSelect = (newId: string, newVersion: string) => {
    setPublicId(newId);
    setVersion(newVersion);

    // Update URL to persist state
    const params = new URLSearchParams(window.location.search);
    params.set('video', newId);
    if (newVersion) params.set('version', newVersion);
    router.push(`?${params.toString()}`);
  };

  return (
    <AppShell>
      <HubContainer>
        <div className='lg:col-span-2 space-y-6'>
          <HubSection title='AI Knowledge Hub'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-slate-900'>
                Webinar Player
              </h2>
              <VideoUploader onSuccess={handleVideoSelect} />
            </div>

            {publicId ? (
              <VideoStage
                key={publicId}
                publicId={publicId}
                onTimeUpdate={(t) => setCurrentTime(t)}
                playerRef={playerRef}
              />
            ) : (
              <div className='aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-4'>
                <div className='p-4 bg-white rounded-full shadow-sm'>
                  <UploadIcon className='h-8 w-8 text-indigo-500' />
                </div>
                <div className='text-center'>
                  <p className='font-medium text-slate-700'>
                    No video selected
                  </p>
                  <p className='text-sm'>
                    Upload a new video or select one from the playlist below.
                  </p>
                </div>
              </div>
            )}

            <VideoPlaylist
              currentPublicId={publicId}
              onSelectVideo={(id, ver) => handleVideoSelect(id, ver.toString())}
            />
          </HubSection>
        </div>

        <InsightsSidebar
          publicId={publicId}
          version={version}
          currentTime={currentTime}
          onSeek={(seconds) => {
            if (playerRef.current) {
              // These methods exist on CloudinaryPlayerInstance, so this works safely
              playerRef.current.currentTime(seconds);
              playerRef.current.play();
            }
          }}
        />
      </HubContainer>
    </AppShell>
  );
}

export default function KnowledgeHubPage() {
  return (
    <Suspense fallback={<div className='p-10 text-center'>Loading Hub...</div>}>
      <HubContent />
    </Suspense>
  );
}
