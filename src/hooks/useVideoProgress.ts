// Video Progress Tracking Hook
// Tracks user's video watching progress and syncs with server

import { useCallback, useEffect, useRef } from "react";
import { trackDualEvent } from "../utils/dualAnalytics";

interface UseVideoProgressOptions {
  userId: string;
  moduleId: string;
  moduleTitle: string;
  videoDuration: number;
}

interface ProgressState {
  watchedSeconds: number;
  maxPosition: number;
  completionPct: number;
  completed: boolean;
}

export function useVideoProgress({
  userId,
  moduleId,
  moduleTitle,
  videoDuration,
}: UseVideoProgressOptions) {
  const lastSyncTime = useRef<number>(0);
  const progressRef = useRef<ProgressState>({
    watchedSeconds: 0,
    maxPosition: 0,
    completionPct: 0,
    completed: false,
  });
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const milestones = useRef<Set<number>>(new Set());

  // Sync progress to server
  const syncProgress = useCallback(
    async (eventType: string, position: number) => {
      try {
        await fetch("/api/course/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            moduleId,
            eventType,
            position: Math.round(position),
            duration: videoDuration,
          }),
        });
      } catch (error) {
        console.error("Failed to sync progress:", error);
      }
    },
    [userId, moduleId, videoDuration]
  );

  // Track video play
  const onPlay = useCallback(
    (currentTime: number) => {
      syncProgress("play", currentTime);
      trackDualEvent("video_play", {
        userId,
        moduleId,
        moduleTitle,
        position: Math.round(currentTime),
      });
    },
    [syncProgress, userId, moduleId, moduleTitle]
  );

  // Track video pause
  const onPause = useCallback(
    (currentTime: number) => {
      syncProgress("pause", currentTime);
      trackDualEvent("video_pause", {
        userId,
        moduleId,
        moduleTitle,
        position: Math.round(currentTime),
      });
    },
    [syncProgress, userId, moduleId, moduleTitle]
  );

  // Track video seek
  const onSeek = useCallback(
    (fromTime: number, toTime: number) => {
      syncProgress("seek", toTime);
      trackDualEvent("video_seek", {
        userId,
        moduleId,
        moduleTitle,
        fromPosition: Math.round(fromTime),
        toPosition: Math.round(toTime),
      });
    },
    [syncProgress, userId, moduleId, moduleTitle]
  );

  // Track video ended
  const onEnded = useCallback(() => {
    syncProgress("ended", videoDuration);
    progressRef.current.completed = true;
    trackDualEvent("video_completed", {
      userId,
      moduleId,
      moduleTitle,
      duration: videoDuration,
    });
  }, [syncProgress, userId, moduleId, moduleTitle, videoDuration]);

  // Track time update (called frequently during playback)
  const onTimeUpdate = useCallback(
    (currentTime: number) => {
      const now = Date.now();

      // Update local progress
      progressRef.current.maxPosition = Math.max(
        progressRef.current.maxPosition,
        currentTime
      );
      progressRef.current.completionPct =
        videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

      // Check for milestone completions (25%, 50%, 75%, 100%)
      const milestoneThresholds = [25, 50, 75, 100];
      milestoneThresholds.forEach((threshold) => {
        if (
          progressRef.current.completionPct >= threshold &&
          !milestones.current.has(threshold)
        ) {
          milestones.current.add(threshold);
          syncProgress(`progress_${threshold}`, currentTime);
          trackDualEvent(`video_progress_${threshold}`, {
            userId,
            moduleId,
            moduleTitle,
            position: Math.round(currentTime),
          });
        }
      });

      // Sync to server every 10 seconds
      if (now - lastSyncTime.current > 10000) {
        lastSyncTime.current = now;
        syncProgress("progress", currentTime);
      }
    },
    [syncProgress, userId, moduleId, moduleTitle, videoDuration]
  );

  // Fetch initial progress on mount
  useEffect(() => {
    const fetchInitialProgress = async () => {
      try {
        const response = await fetch(
          `/api/course/progress?userId=${userId}&moduleId=${moduleId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.progress) {
            progressRef.current = {
              watchedSeconds: data.progress.watchedSeconds,
              maxPosition: data.progress.maxPosition,
              completionPct: data.progress.completionPct,
              completed: data.progress.completed,
            };
            // Restore milestones
            [25, 50, 75, 100].forEach((threshold) => {
              if (data.progress.completionPct >= threshold) {
                milestones.current.add(threshold);
              }
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial progress:", error);
      }
    };

    fetchInitialProgress();

    // Cleanup on unmount
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [userId, moduleId]);

  return {
    onPlay,
    onPause,
    onSeek,
    onEnded,
    onTimeUpdate,
    getProgress: () => progressRef.current,
    getResumePosition: () => progressRef.current.maxPosition,
  };
}

