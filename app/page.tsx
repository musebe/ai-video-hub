'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { AppShell } from '@/components/layout/shell';
import { HubContainer, HubSection } from '@/components/hub/layout';
import {
  VideoStage,
  CloudinaryPlayerInstance,
} from '@/components/hub/video-stage';
import { InsightsSidebar } from '@/components/hub/insights-sidebar';
import { VideoPlaylist } from '@/components/hub/video-playlist';
import { getPlaylistAction } from '@/app/actions/media-process';
import { UploadIcon, Loader2 } from 'lucide-react';

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

  // 1. NEW: Playback Session ID
  // Initializes to 0 for SSR match. Updates on every video selection.
  const [playbackSession, setPlaybackSession] = React.useState(0);

  const [currentTime, setCurrentTime] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(!initialId);

  const playerRef = React.useRef<CloudinaryPlayerInstance | null>(null);

  React.useEffect(() => {
    if (publicId) {
      setIsLoading(false);
      return;
    }

    const fetchDefault = async () => {
      try {
        const videos = await getPlaylistAction();
        if (videos && videos.length > 0) {
          const latest = videos[0];
          setPublicId(latest.publicId);
          setVersion(latest.version.toString());
          // Set initial session ID after mount
          setPlaybackSession(Date.now());

          const params = new URLSearchParams(window.location.search);
          params.set('video', latest.publicId);
          params.set('version', latest.version.toString());
          router.replace(`?${params.toString()}`);
        }
      } catch (e) {
        console.error('Failed to auto-load video', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefault();
  }, [publicId, router]);

  const handleVideoSelect = (newId: string, newVersion: string) => {
    setPublicId(newId);
    setVersion(newVersion);

    // 2. FORCE NEW SESSION
    // This timestamp ensures the VideoStage receives a new prop,
    // triggering a clean remount without "Zombie" collisions.
    setPlaybackSession(Date.now());

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
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8'>
              <h2 className='text-xl font-bold text-slate-900 tracking-tight shrink-0'>
                Webinar Player
              </h2>
              <div className='w-full sm:w-auto'>
                <VideoUploader onSuccess={handleVideoSelect} />
              </div>
            </div>

            {isLoading ? (
              <div className='aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3'>
                <Loader2 className='h-10 w-10 text-indigo-500 animate-spin' />
                <p className='text-sm font-medium text-slate-500'>
                  Loading latest session...
                </p>
              </div>
            ) : publicId ? (
              <VideoStage
                // 3. PASS THE SESSION ID
                key={`${publicId}-${playbackSession}`} // Forces React to destroy/recreate component
                publicId={publicId}
                playbackSession={playbackSession} // Used for internal ID generation
                onTimeUpdate={(t) => setCurrentTime(t)}
                playerRef={playerRef}
              />
            ) : (
              <div className='aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-4'>
                <div className='p-4 bg-white rounded-full shadow-sm'>
                  <UploadIcon className='h-8 w-8 text-indigo-500' />
                </div>
                <div className='text-center'>
                  <p className='font-medium text-slate-700'>No videos found</p>
                  <p className='text-sm'>
                    Upload your first webinar to get started.
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
    <Suspense
      fallback={
        <div className='h-screen w-full flex items-center justify-center bg-slate-50'>
          <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
        </div>
      }
    >
      <HubContent />
    </Suspense>
  );
}
