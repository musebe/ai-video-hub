/**
 * @fileoverview Fully typed Video Player Engine.
 * Resolves remaining ESLint 'any' errors in the analytics shim.
 */

'use client';

import * as React from 'react';
import Script from 'next/script';
import { useVideoMetadata } from '@/hooks';

/**
 * Define the structure for our analytics shim.
 */
interface GTagShim {
  (...args: unknown[]): void;
}

if (typeof window !== 'undefined') {
  // Replace 'any' with our new GTagShim interface
  (window as Window & { gtag?: GTagShim }).gtag =
    (window as Window & { gtag?: GTagShim }).gtag || function () {};
}

interface CloudinaryVideoPlayer {
  on: (event: string, callback: () => void) => void;
  currentTime: (seconds?: number) => number;
  play: () => void;
}

declare global {
  interface Window {
    cloudinary: {
      videoPlayer: (
        el: HTMLVideoElement | null,
        options: object,
      ) => CloudinaryVideoPlayer;
    };
  }
}

export function VideoPlayerEngine({ publicId }: { publicId: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<CloudinaryVideoPlayer | null>(null);
  const { handleTimeUpdate } = useVideoMetadata(playerRef);

  const onPlayerReady = () => {
    if (!window.cloudinary || !videoRef.current) return;

    playerRef.current = window.cloudinary.videoPlayer(videoRef.current, {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      secure: true,
      fluid: true,
      controls: true,
      analytics: false,
      accessibilityMode: true,
    });

    playerRef.current.on('timeupdate', handleTimeUpdate);
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
