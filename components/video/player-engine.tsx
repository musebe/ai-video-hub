/**
 * @fileoverview Finalized, strictly-typed Video Player Engine.
 * This version eliminates all 'any' types and satisfies unused variable checks.
 */

'use client';

import * as React from 'react';
import Script from 'next/script';

/**
 * 1. Define specific interfaces for our global dependencies.
 */
interface GTagShim {
  (...args: unknown[]): void;
}

export interface CloudinaryVideoPlayer {
  on: (event: string, callback: () => void) => void;
  currentTime: (seconds?: number) => number;
  play: () => void;
}

/**
 * 2. Create a combined interface for the Window object.
 */
interface CloudinaryWindow extends Window {
  gtag?: GTagShim;
  cloudinary: {
    videoPlayer: (
      el: HTMLVideoElement | null,
      options: object,
    ) => CloudinaryVideoPlayer;
  };
}

/**
 * 3. Initialize the shim safely using our new type.
 */
if (typeof window !== 'undefined') {
  const win = window as unknown as CloudinaryWindow;
  win.gtag = win.gtag || function () {};
}

interface VideoPlayerEngineProps {
  publicId: string;
  onTimeUpdate: (time: number) => void;
  playerRef: React.MutableRefObject<CloudinaryVideoPlayer | null>;
}

export function VideoPlayerEngine({
  publicId,
  onTimeUpdate,
  playerRef,
}: VideoPlayerEngineProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const onPlayerReady = () => {
    // Cast window to our custom interface to avoid 'any'
    const win = window as unknown as CloudinaryWindow;

    if (!win.cloudinary || !videoRef.current) return;

    playerRef.current = win.cloudinary.videoPlayer(videoRef.current, {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      secure: true,
      fluid: true,
      controls: true,
      analytics: false,
      accessibilityMode: true,
    });

    playerRef.current?.on('timeupdate', () => {
      const time = playerRef.current?.currentTime() || 0;
      onTimeUpdate(time);
    });
  };

  return (
    <>
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/cloudinary-video-player@3.7.2/dist/cld-video-player.min.css'
      />
      <Script
        src='https://cdn.jsdelivr.net/npm/cloudinary-video-player@3.7.2/dist/cld-video-player.min.js'
        strategy='afterInteractive'
        onLoad={onPlayerReady}
      />
      <video
        ref={videoRef}
        className='cld-video-player cld-fluid'
        data-cld-public-id={publicId}
      />
    </>
  );
}
