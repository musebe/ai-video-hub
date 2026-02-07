'use client';

import * as React from 'react';
import {
  SearchIcon,
  Loader2Icon,
  ClockIcon,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { HubSection } from './layout';
import { TranscriptSegment } from '@/lib/media';
import { getTranscriptAction } from '@/app/actions/media-process';

interface InsightsSidebarProps {
  publicId: string;
  version?: string;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export function InsightsSidebar({
  publicId,
  version,
  currentTime,
  onSeek,
}: InsightsSidebarProps) {
  const [transcript, setTranscript] = React.useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [, setAttemptCount] = React.useState(0); // Track retries

  const pollTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // 1. Reset everything when video changes
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

    if (!publicId) {
      setTranscript([]);
      setIsProcessing(false);
      return;
    }

    setTranscript([]);
    setAttemptCount(0); // Reset attempts
    setStatusMsg('Initializing Intelligence Layer...');
    setIsProcessing(true);

    const poll = async (currentAttempt: number) => {
      // 2. SAFETY STOP: Stop after 5 failed attempts (approx 2 minutes)
      if (currentAttempt > 5) {
        setIsProcessing(false);
        setStatusMsg('Transcription unavailable');
        return;
      }

      try {
        console.log(
          `📡 [AI-HUB] Polling Attempt ${currentAttempt + 1} for: ${publicId}`,
        );
        const segments = await getTranscriptAction(publicId, version);

        if (segments && segments.length > 0) {
          setTranscript(segments);
          setIsProcessing(false);
          setStatusMsg('Transcript Ready');
        } else {
          // 3. EXPONENTIAL BACKOFF: 5s, 10s, 20s, etc.
          const delay = 5000 * Math.pow(2, currentAttempt);
          setStatusMsg(`Analyzing... (Next check in ${delay / 1000}s)`);

          pollTimerRef.current = setTimeout(() => {
            setAttemptCount((prev) => prev + 1);
            poll(currentAttempt + 1);
          }, delay);
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Retry with backoff
        const delay = 5000 * Math.pow(2, currentAttempt);
        pollTimerRef.current = setTimeout(
          () => poll(currentAttempt + 1),
          delay,
        );
      }
    };

    poll(0); // Start first poll

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [publicId, version]);

  const filtered = React.useMemo(
    () =>
      transcript.filter((s) =>
        s.text.toLowerCase().includes(query.toLowerCase()),
      ),
    [transcript, query],
  );

  if (!publicId) {
    return (
      <div className='space-y-6'>
        <HubSection title='Search Transcript'>
          <Card className='border-none shadow-none bg-transparent'>
            <CardContent className='py-20 flex flex-col items-center gap-3 text-center text-slate-400'>
              <PlayCircle className='h-10 w-10 opacity-20' />
              <p className='font-medium'>No video loaded</p>
              <p className='text-xs max-w-50'>Upload a video to start.</p>
            </CardContent>
          </Card>
        </HubSection>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <HubSection title='Search Transcript'>
        <Card className='border-none shadow-none bg-transparent'>
          <div className='p-4 border-b'>
            <div className='relative'>
              <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search insights...'
                className='pl-10 bg-white'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <CardContent className='overflow-y-auto p-4 space-y-4 max-h-150'>
            {isProcessing ? (
              <div className='py-20 flex flex-col items-center gap-4 text-center'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75'></div>
                  <div className='relative bg-white p-3 rounded-full border border-indigo-100'>
                    <Loader2Icon className='h-6 w-6 animate-spin text-indigo-600' />
                  </div>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-semibold text-slate-900'>
                    {statusMsg}
                  </p>
                </div>
              </div>
            ) : transcript.length > 0 ? (
              filtered.map((item, i) => {
                const isActive =
                  currentTime >= item.startTime && currentTime <= item.endTime;
                return (
                  <div
                    key={i}
                    onClick={() => onSeek(item.startTime)}
                    className={`cursor-pointer rounded-xl p-3 transition-all border group ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                        : 'hover:bg-white hover:border-slate-200 border-transparent'
                    }`}
                  >
                    <div className='flex items-center gap-2 mb-1.5'>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        <ClockIcon className='inline h-3 w-3 mr-1' />
                        {new Date(item.startTime * 1000)
                          .toISOString()
                          .substr(14, 5)}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${isActive ? 'text-slate-900' : 'text-slate-600'}`}
                    >
                      {item.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className='py-20 flex flex-col items-center gap-3 text-center text-slate-400'>
                <AlertCircle className='h-8 w-8 opacity-20 text-red-400' />
                <p className='text-sm'>Transcript unavailable.</p>
                <p className='text-xs'>
                  We couldn&apos;t generate captions for this video.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </HubSection>
    </div>
  );
}
