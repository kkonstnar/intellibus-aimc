import { useEffect, useRef, useCallback } from "react";
import { trackEvent } from "../utils/analytics";

interface VideoTrackingOptions {
  videoId: string;
  videoTitle: string;
  location: string;
}

interface VideoTrackingReturn {
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onLoadedMetadata: (duration: number) => void;
}

/**
 * Custom hook for comprehensive video tracking
 * Tracks: play, pause, completion, watch duration, drop-off points, and milestone percentages
 */
export const useVideoTracking = ({
  videoId,
  videoTitle,
  location,
}: VideoTrackingOptions): VideoTrackingReturn => {
  const startTimeRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);
  const milestonesTrackedRef = useRef<Set<number>>(new Set());
  const totalWatchTimeRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(Date.now());
  const durationRef = useRef<number>(0);

  const onPlay = useCallback(() => {
    startTimeRef.current = Date.now();

    trackEvent("video_played", {
      videoId,
      videoTitle,
      location,
      timestamp: new Date().toISOString(),
    });
  }, [videoId, videoTitle, location]);

  const onPause = useCallback(() => {
    if (startTimeRef.current) {
      const watchDuration = (Date.now() - startTimeRef.current) / 1000;
      totalWatchTimeRef.current += watchDuration;

      trackEvent("video_paused", {
        videoId,
        videoTitle,
        location,
        position: lastPositionRef.current,
        watchDuration,
        totalWatchTime: totalWatchTimeRef.current,
      });

      startTimeRef.current = null;
    }
  }, [videoId, videoTitle, location]);

  const onEnded = useCallback(() => {
    if (startTimeRef.current) {
      const watchDuration = (Date.now() - startTimeRef.current) / 1000;
      totalWatchTimeRef.current += watchDuration;
    }

    const totalSessionTime = (Date.now() - sessionStartRef.current) / 1000;

    trackEvent("video_completed", {
      videoId,
      videoTitle,
      location,
      totalWatchTime: totalWatchTimeRef.current,
      totalSessionTime,
      duration: durationRef.current,
    });
  }, [videoId, videoTitle, location]);

  const onTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      lastPositionRef.current = currentTime;

      if (duration > 0) {
        const percentWatched = (currentTime / duration) * 100;

        // Track milestones: 25%, 50%, 75%, 90%
        const milestones = [25, 50, 75, 90];
        milestones.forEach((milestone) => {
          if (
            percentWatched >= milestone &&
            !milestonesTrackedRef.current.has(milestone)
          ) {
            milestonesTrackedRef.current.add(milestone);

            trackEvent("video_progress", {
              videoId,
              videoTitle,
              location,
              milestone: `${milestone}%`,
              currentTime,
              duration,
            });
          }
        });
      }
    },
    [videoId, videoTitle, location]
  );

  const onLoadedMetadata = useCallback(
    (duration: number) => {
      durationRef.current = duration;

      trackEvent("video_loaded", {
        videoId,
        videoTitle,
        location,
        duration,
      });
    },
    [videoId, videoTitle, location]
  );

  // Track drop-off when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      if (startTimeRef.current && lastPositionRef.current > 0) {
        const watchDuration = (Date.now() - startTimeRef.current) / 1000;
        totalWatchTimeRef.current += watchDuration;

        trackEvent("video_drop_off", {
          videoId,
          videoTitle,
          location,
          dropOffPoint: lastPositionRef.current,
          totalWatchTime: totalWatchTimeRef.current,
          percentWatched:
            durationRef.current > 0
              ? (lastPositionRef.current / durationRef.current) * 100
              : 0,
        });
      }
    };
  }, [videoId, videoTitle, location]);

  return {
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onLoadedMetadata,
  };
};

export default useVideoTracking;
