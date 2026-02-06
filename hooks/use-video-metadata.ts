/**
 * @fileoverview Logic to track and sync video playback time with strict types.
 */

import { useState, useCallback } from 'react';

interface CloudinaryVideoPlayer {
    // Overloaded method: no args to get, number arg to set
    currentTime: (seconds?: number) => number;
    play: () => void;
}

export function useVideoMetadata(playerRef: React.MutableRefObject<CloudinaryVideoPlayer | null>) {
    const [currentTime, setCurrentTime] = useState(0);

    const handleTimeUpdate = useCallback(() => {
        if (playerRef.current) {
            setCurrentTime(playerRef.current.currentTime());
        }
    }, [playerRef]);

    const seekTo = useCallback((seconds: number) => {
        if (playerRef.current) {
            // Use the 'seconds' variable to update the player state
            playerRef.current.currentTime(seconds);
            playerRef.current.play();
        }
    }, [playerRef]);

    return {
        currentTime,
        handleTimeUpdate,
        seekTo
    };
}